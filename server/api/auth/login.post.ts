import { db, users } from "../../database";
import { eq } from "drizzle-orm";
import {
  verifyPassword,
  getUserSession,
  sealUserSession,
} from "../../utils/auth";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password } = body || {};

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: "សូមបញ្ចូលអ៊ីមែល និងពាក្យសម្ងាត់",
    });
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.trim().toLowerCase()))
    .limit(1);

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "អ៊ីមែល ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ",
    });
  }

  // Check password
  const isValid = verifyPassword(password, user.password || "");
  if (!isValid) {
    throw createError({
      statusCode: 401,
      statusMessage: "អ៊ីមែល ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ",
    });
  }

  // H3 useSession: updates session data and automatically seals & sets HTTP-only cookie
  const session = await getUserSession(event);
  await session.update({ userId: user.id });

  const token = await sealUserSession(event);
  const { password: _, ...safeUser } = user;

  return {
    success: true,
    message: "ចូលប្រព័ន្ធបានជោគជ័យ",
    token,
    user: safeUser,
  };
});
