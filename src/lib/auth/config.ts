/** ZionCore auth & admin — MWARI NDI MWARI */

export const ADMIN_EMAILS = ["tariromasawi19@gmail.com"] as const;

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.trim().toLowerCase() as (typeof ADMIN_EMAILS)[number]);
}

export const AUTH_STORAGE_KEY = "zioncore_auth_session_v1";
