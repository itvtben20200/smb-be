/**
 * In-memory store for mock checkout sessions (used when no real Stripe key is configured).
 * Sessions expire after 30 minutes. Cleared automatically on TTL.
 * When a real Stripe key is added to .env, this file becomes unused.
 */
import { randomUUID } from 'crypto';
import { CheckoutPayload } from '../types';

interface MockSession {
  payload: CheckoutPayload & { userId?: string };
  expiresAt: number;
  products: { id: string; name: string; price: string; quantity: number }[];
  total: number;
}

const store = new Map<string, MockSession>();
const TTL_MS = 30 * 60 * 1000;

export function createMockSession(
  payload: CheckoutPayload & { userId?: string },
  products: { id: string; name: string; price: string; quantity: number }[],
  total: number
): string {
  const sessionId = `mock_${randomUUID()}`;
  store.set(sessionId, {
    payload,
    expiresAt: Date.now() + TTL_MS,
    products,
    total,
  });
  return sessionId;
}

export function getMockSession(sessionId: string): MockSession | null {
  const session = store.get(sessionId);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    store.delete(sessionId);
    return null;
  }
  return session;
}

export function deleteMockSession(sessionId: string): void {
  store.delete(sessionId);
}
