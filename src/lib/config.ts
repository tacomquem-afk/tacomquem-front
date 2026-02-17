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
} as const;
