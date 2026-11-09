import { scrypt, randomBytes, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import type { H3Event, SessionConfig } from "h3";
import {
  useSession,
  unsealSession,
  sealSession,
  getHeader,
  createError,
} from "h3";
import { db, users, type UserRecord } from "../database";
import { eq } from "drizzle-orm";

const scryptAsync = promisify(scrypt);

export const SESSION_CONFIG: SessionConfig = {
  name: "auth_session",
  password:
    process.env.SESSION_PASSWORD ||
    "tlp-super-secret-auth-session-key-32-chars-2026!",
  maxAge: 60 * 60 * 24 * 7, // 7 days
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
  },
};

/**
 * Native H3 useSession instance for the current event
 */
export async function getUserSession(event: H3Event) {
  return await useSession<{ userId: string }>(event, SESSION_CONFIG);
}

/**
 * Seal current H3 session to an encrypted token string (Useful for Mobile/Bearer tokens)
 */
export async function sealUserSession(event: H3Event): Promise<string> {
  return await sealSession(event, SESSION_CONFIG);
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const hash = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${hash.toString("hex")}`;
}

export async function verifyPassword(
  password: string,
  combined: string,
): Promise<boolean> {
  if (!combined) return false;
  const [salt, key] = combined.split(":");
  if (!salt || !key) return false;

  try {
    const hash = (await scryptAsync(password, salt, 64)) as Buffer;
    const keyBuffer = Buffer.from(key, "hex");

    if (hash.length !== keyBuffer.length) {
      return false;
    }

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

  // 1. H3 useSession (reads encrypted cookie 'auth_session')
  try {
    const session = await getUserSession(event);
    if (session.data?.userId) {
      userId = session.data.userId;
    }
  } catch {
    // Session មិនត្រឹមត្រូវ ឬ Expired
  }

  // 2. Authorization: Bearer <sealed_token> (សម្រាប់ Mobile App ឬ External API)
  if (!userId) {
    const authHeader = getHeader(event, "authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.slice(7).trim();
      try {
        const unsealed = await unsealSession(event, SESSION_CONFIG, token);
        userId = unsealed.data?.userId;
      } catch {
        // Token unseal មិនបាន
      }
    }
  }

  // ចំណាំ៖ បានដក fallback legacy cookie ដែលគ្មាន signature verification ចេញ ដើម្បីទប់ស្កាត់ Auth Bypass

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
