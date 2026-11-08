import { db, users } from "../../database";
import { eq } from "drizzle-orm";
import {
  hashPassword,
  getUserSession,
  sealUserSession,
} from "../../utils/auth";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { name, email, password, phone, role, subject } = body || {};

  if (!name || !email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: "សូមបំពេញឈ្មោះ, អ៊ីមែល និងពាក្យសម្ងាត់",
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .limit(1);

  if (existing) {
    throw createError({
      statusCode: 409,
      statusMessage: "អ៊ីមែលនេះមានក្នុងប្រព័ន្ធរួចហើយ",
    });
  }

  const hashedPassword = hashPassword(password);
  const id = `user-${Date.now()}`;

  const [newUser] = await db
    .insert(users)
    .values({
      id,
      schoolId: "sch-1",
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      phone: phone || "",
      role: role || "គ្រូបង្រៀន",
      subject: subject || "",
      status: "សកម្ម",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
    })
    .returning();

  // H3 useSession: updates session data and automatically seals & sets HTTP-only cookie
  const session = await getUserSession(event);
  await session.update({ userId: newUser.id });

  const token = await sealUserSession(event);
  const { password: _, ...safeUser } = newUser;

  return {
    success: true,
    message: "ចុះឈ្មោះបានជោគជ័យ",
    token,
    user: safeUser,
  };
});
