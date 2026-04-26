// src/logger.ts
export function logUser(user: any) {
  // VIOLATION: Logging email in plaintext
  console.log(`[AUTH] Login attempt for: ${user.email}`);
}
