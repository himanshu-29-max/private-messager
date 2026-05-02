export const DISPLAY_ID_REGEX = /^@[a-zA-Z0-9_]{3,29}$/;

/**
 * Validates a display ID.
 * Must start with @, contain only alphanumeric characters and underscores,
 * and be between 4 and 30 characters long (including the @).
 */
export function isValidDisplayId(displayId: string): boolean {
  return DISPLAY_ID_REGEX.test(displayId);
}

/**
 * Generates a random Display ID if the user doesn't provide one.
 */
export function generateRandomDisplayId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '@anon_';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
