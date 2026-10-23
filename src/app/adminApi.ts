import type { Resource } from "./data"
import { authClient } from "./auth"

export type PublishStatus = "draft" | "published" | "archived"

export type AdminResourceRecord = {
  resource: Resource
  status: PublishStatus
  updatedAt: string
}

const apiUrl = import.meta.env.VITE_RFU_API_URL?.replace(/\/$/, "")
export const adminApiConfigured = Boolean(apiUrl)

export async function adminRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  if (!apiUrl || !authClient) {
    throw new Error("The admin service is not configured yet.")
  }

  const { data, error } = await authClient.token()
  if (error) {
    throw new Error(error.message || "Could not create an admin access token.")
  }

  // Managed Better Auth also attaches its JWT to the session response header.
  // Use that SDK-provided session token if the token endpoint has no payload.
  let accessToken = data?.token
  if (!accessToken) {
    const { data: sessionData, error: sessionError } =
      await authClient.getSession()
    accessToken = (
      sessionData?.session as { token?: string } | undefined
    )?.token
    if (!accessToken && sessionError) {
      throw new Error(
        sessionError.message || "Could not read your admin sign-in session.",
      )
    }
  }

  if (!accessToken) {
    throw new Error(
      "Your sign-in session did not provide an admin access token. Refresh the page and sign in again if this continues.",
    )
  }

  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...options.headers,
    },
  })
  const result = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(
      typeof result?.error === "string"
        ? result.error
        : "The request could not be completed.",
    )
  }
  return result as T
}
