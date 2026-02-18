/**
 * Feature flags and configuration
 * All flags should default to true for backward compatibility
 */

export const config = {
  /**
   * Whether authentication (login/register) is enabled
   * Set NEXT_PUBLIC_AUTH_ENABLED=false in .env.local to disable
   */
  authEnabled: process.env.NEXT_PUBLIC_AUTH_ENABLED !== "false",

  /**
   * Whether the app is in beta mode (invite-only access)
   * Set NEXT_PUBLIC_BETA_MODE=true in .env.local to enable
   */
  betaModeEnabled: process.env.NEXT_PUBLIC_BETA_MODE === "true",
} as const;
