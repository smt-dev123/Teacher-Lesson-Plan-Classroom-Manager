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

  if (!name?.trim() || !email?.trim() || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: "សូមបំពេញឈ្មោះ, អ៊ីមែល និងពាក្យសម្ងាត់ឱ្យបានត្រឹមត្រូវ",
    });
  }

  if (password.length < 6) {
    throw createError({
      statusCode: 400,
      statusMessage: "ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច ៦ តួអក្សរ",
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .limit(1);

  if (existing) {
    throw createError({
      statusCode: 409,
      statusMessage: "អ៊ីមែលនេះមានក្នុងប្រព័ន្ធរួចហើយ",
    });
  }

  const hashedPassword = await hashPassword(password);

  const [newUser] = await db
    .insert(users)
    .values({
      schoolId: "sch-1",
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      phone: phone?.trim() || "",
      role: role || "គ្រូបង្រៀន",
      subject: subject?.trim() || "",
      status: "សកម្ម",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
    })
    .returning();

  if (!newUser) {
    throw createError({
      statusCode: 500,
      statusMessage: "មិនអាចបង្កើតគណនីបានទេ សូមព្យាយាមម្តងទៀត",
    });
  }

  // Update H3 Session (បង្កើត HttpOnly Cookie 'auth_session' ស្វ័យប្រវត្តិ)
  const session = await getUserSession(event);
  await session.update({ userId: newUser.id });

  const token = await sealUserSession(event);

  const { password: _, ...safeUser } = newUser;

  setResponseStatus(event, 201);

  return {
    success: true,
    message: "ចុះឈ្មោះបានជោគជ័យ",
    token,
    user: safeUser,
  };
});
