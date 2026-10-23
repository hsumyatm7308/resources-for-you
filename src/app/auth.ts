import { createAuthClient } from "@neondatabase/auth"

const authUrl = import.meta.env.VITE_NEON_AUTH_URL

export const authClient = authUrl
  ? createAuthClient(authUrl, {
      // The auth service and Vite app use different origins. Include the
      // session cookie so token() can mint the JWT required by the admin API.
      fetchOptions: { credentials: "include" },
    })
  : null
export const adminEmail =
  import.meta.env.VITE_ADMIN_EMAIL?.trim().toLowerCase() || ""
