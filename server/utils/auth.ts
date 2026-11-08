import { scryptSync, randomBytes, timingSafeEqual } from "crypto";
import type { H3Event, SessionConfig } from "h3";
import {
  useSession,
  unsealSession,
  sealSession,
  getHeader,
  getCookie,
  createError,
} from "h3";
import { db, users, type UserRecord } from "../database";
import { eq } from "drizzle-orm";

export const SESSION_CONFIG: SessionConfig = {
  name: "auth_session",
  password:
    process.env.SESSION_PASSWORD ||
    "tlp-super-secret-auth-session-key-32-chars-2026!",
  maxAge: 60 * 60 * 24 * 14, // 14 days
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  },
};

/**
 * Native H3 useSession instance for the current event
 */
export async function getUserSession(event: H3Event) {
  return await useSession<{ userId: string }>(event, SESSION_CONFIG);
}

/**
 * Seal current H3 session to an encrypted token string
 */
export async function sealUserSession(event: H3Event): Promise<string> {
  return await sealSession(event, SESSION_CONFIG);
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, combined: string): boolean {
  if (!combined) return false;
  const [salt, key] = combined.split(":");
  if (!salt || !key) return false;
  try {
    const hash = scryptSync(password, salt, 64);
    const keyBuffer = Buffer.from(key, "hex");
    return timingSafeEqual(hash, keyBuffer);
  } catch {
    return false;
  }
}

/**
 * Retrieve authenticated user using H3 session or Bearer header
 */
export async function getAuthUser(event: H3Event): Promise<UserRecord | null> {
  let userId: string | undefined;

  // 1. H3 useSession (reads encrypted cookie 'auth_session' or x-auth_session-session header)
  try {
    const session = await getUserSession(event);
    if (session.data?.userId) {
      userId = session.data.userId;
    }
  } catch {
    // ignore
  }

  // 2. Authorization: Bearer <sealed_token>
  if (!userId) {
    const authHeader = getHeader(event, "authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.slice(7).trim();
      try {
        const unsealed = await unsealSession(event, SESSION_CONFIG, token);
        userId = unsealed.data?.userId;
      } catch {
        // invalid token
      }
    }
  }

  // 3. Fallback: check legacy cookie if present
  if (!userId) {
    const legacy = getCookie(event, "auth_token");
    if (legacy && legacy.includes(".")) {
      try {
        const [payload] = legacy.split(".");
        const data = JSON.parse(
          Buffer.from(payload, "base64url").toString("utf8")
        );
        if (data.userId) userId = data.userId;
      } catch {
        // ignore
      }
    }
  }

  if (!userId) return null;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return user || null;
}

export async function requireAuthUser(event: H3Event): Promise<UserRecord> {
  const user = await getAuthUser(event);
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "សូមចូលប្រើប្រាស់គណនីជាមុនសិន (Unauthorized)",
    });
  }
  return user;
}
