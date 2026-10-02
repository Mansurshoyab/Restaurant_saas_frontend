import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a fresh idempotency key for a single logical operation
 * (one "Pay" tap, one "Receive Goods" submission). The backend's
 * idempotency.middleware.js keys off this header — reusing the same
 * key across genuinely different operations would incorrectly replay
 * a stale cached response, so always call this once per user action,
 * never once per component mount.
 */
export function generateIdempotencyKey(): string {
  return uuidv4();
}


