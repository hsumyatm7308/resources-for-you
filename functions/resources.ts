import { neon } from "@neondatabase/serverless"
import { createRemoteJWKSet, jwtVerify } from "jose"

const sql = neon(process.env.DATABASE_URL!)
const jwks = createRemoteJWKSet(new URL(process.env.NEON_AUTH_JWKS_URL!))
const authIssuer = new URL(process.env.NEON_AUTH_BASE_URL!).origin
const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase() || ""

type PublishStatus = "draft" | "published" | "archived"
type ResourceRecord = {
  resource: Record<string, unknown>
  status: PublishStatus
  updatedAt?: string
}

function responseHeaders(request: Request) {
  return {
    "Access-Control-Allow-Origin": request.headers.get("origin") || "*",
    "Access-Control-Allow-Headers": "authorization, content-type",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    Vary: "Origin",
  }
}

function json(request: Request, body: unknown, status = 200) {
  return Response.json(body, { status, headers: responseHeaders(request) })
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isValidResource(value: unknown): value is Record<string, unknown> {
  if (!isRecord(value)) return false
  const textFields = [
    "id",
    "title",
    "description",
    "category",
    "type",
    "source",
    "image",
  ]
  if (
    textFields.some(
      (field) => typeof value[field] !== "string" || !value[field],
    )
  ) {
    return false
  }
  if (!/^[a-z0-9][a-z0-9-]{1,79}$/.test(value.id as string)) return false
  if ((value.title as string).length > 180) return false
  if ((value.description as string).length > 1200) return false
  if (
    !Array.isArray(value.tags) ||
    value.tags.some((tag) => typeof tag !== "string")
  ) {
    return false
  }
  for (const field of ["ctaUrl", "announcementUrl"]) {
    const url = value[field]
    if (url && (typeof url !== "string" || !isHttpsUrl(url))) return false
  }
  if (
    value.links !== undefined &&
    (!Array.isArray(value.links) ||
      value.links.some((link) => {
        if (
          !isRecord(link) ||
          typeof link.label !== "string" ||
          typeof link.url !== "string"
        )
          return true
        return !isSafeLink(link.url)
      }))
  )
    return false
  const image = value.image as string
  if (
    (!image.startsWith("/") || image.startsWith("//")) &&
    !isHttpsUrl(image)
  ) return false
  return true
}

function isHttpsUrl(value: string) {
  try {
    return new URL(value).protocol === "https:"
  } catch {
    return false
  }
}

function isSafeLink(value: string) {
  if (isHttpsUrl(value)) return true
  if (value.startsWith("mailto:")) return !/[\r\n]/.test(value)
  return /^tel:\+?[0-9().-]+$/i.test(value)
}

function isPublishStatus(value: unknown): value is PublishStatus {
  return value === "draft" || value === "published" || value === "archived"
}

async function verifyAdmin(request: Request) {
  if (!adminEmail)
    return {
      ok: false as const,
      status: 503,
      error: "Admin access is not configured.",
    }
  const header = request.headers.get("authorization")
  if (!header?.toLowerCase().startsWith("bearer ")) {
    return { ok: false as const, status: 401, error: "Sign in to continue." }
  }

  try {
    const { payload } = await jwtVerify(header.slice(7), jwks, {
      issuer: authIssuer,
    })
    if (typeof payload.sub !== "string") {
      return {
        ok: false as const,
        status: 401,
        error: "Your session is invalid.",
      }
    }

    const [user] = await sql`
      SELECT email, "emailVerified" AS email_verified
      FROM neon_auth."user"
      WHERE id = ${payload.sub}
      LIMIT 1
    `
    if (
      typeof user?.email !== "string" ||
      user.email.toLowerCase() !== adminEmail ||
      user.email_verified !== true
    ) {
      return {
        ok: false as const,
        status: 403,
        error: "This account cannot manage resources.",
      }
    }
    return { ok: true as const }
  } catch {
    return {
      ok: false as const,
      status: 401,
      error: "Your session has expired. Sign in again.",
    }
  }
}

function recordFromRow(row: {
  resource: Record<string, unknown>
  status: PublishStatus
  updated_at: Date
}) {
  return {
    resource: row.resource,
    status: row.status,
    updatedAt: row.updated_at.toISOString(),
  }
}

export default {
  async fetch(request: Request) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: responseHeaders(request),
      })
    }

    const path = new URL(request.url).pathname.replace(/\/+$/, "") || "/"

    if (request.method === "GET" && path === "/resources") {
      const rows = await sql`
        SELECT resource
        FROM public.rfu_resources
        WHERE status = 'published'
        ORDER BY updated_at DESC
      `
      return json(
        request,
        rows.map((row) => row.resource),
      )
    }

    if (path === "/admin/resources" || path.startsWith("/admin/resources/")) {
      const access = await verifyAdmin(request)
      if (!access.ok)
        return json(request, { error: access.error }, access.status)

      if (request.method === "GET" && path === "/admin/resources") {
        const rows = await sql`
          SELECT resource, status, updated_at
          FROM public.rfu_resources
          ORDER BY updated_at DESC
        `
        return json(request, rows.map(recordFromRow))
      }

      if (request.method === "POST" && path === "/admin/resources") {
        let body: unknown
        try {
          body = await request.json()
        } catch {
          return json(request, { error: "Enter a valid resource." }, 400)
        }
        if (
          !isRecord(body) ||
          !isValidResource(body.resource) ||
          !isPublishStatus(body.status)
        ) {
          return json(
            request,
            { error: "Check the resource fields and try again." },
            400,
          )
        }
        const [row] = await sql`
          INSERT INTO public.rfu_resources (id, resource, status)
          VALUES (${body.resource.id as string}, ${JSON.stringify(body.resource)}::jsonb, ${body.status})
          RETURNING resource, status, updated_at
        `
        return json(request, recordFromRow(row), 201)
      }

      const match = path.match(
        /^\/admin\/resources\/([a-z0-9][a-z0-9-]{1,79})$/,
      )
      if (!match) return json(request, { error: "Resource not found." }, 404)
      const [, id] = match

      if (request.method === "PUT") {
        let body: unknown
        try {
          body = await request.json()
        } catch {
          return json(request, { error: "Enter a valid resource." }, 400)
        }
        if (
          !isRecord(body) ||
          !isValidResource(body.resource) ||
          body.resource.id !== id ||
          !isPublishStatus(body.status)
        ) {
          return json(
            request,
            { error: "Check the resource fields and try again." },
            400,
          )
        }
        const [row] = await sql`
          UPDATE public.rfu_resources
          SET resource = ${JSON.stringify(body.resource)}::jsonb,
              status = ${body.status},
              updated_at = now()
          WHERE id = ${id}
          RETURNING resource, status, updated_at
        `
        return row
          ? json(request, recordFromRow(row))
          : json(request, { error: "Resource not found." }, 404)
      }

      if (request.method === "DELETE") {
        const rows = await sql`
          DELETE FROM public.rfu_resources
          WHERE id = ${id}
          RETURNING id
        `
        return rows.length
          ? json(request, { deleted: true })
          : json(request, { error: "Resource not found." }, 404)
      }
    }

    return json(request, { error: "Not found." }, 404)
  },
}
