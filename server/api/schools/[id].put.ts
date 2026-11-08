import { db, schools } from "../../database";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Invalid ID" });
  }

  const body = await readBody(event);

  const [updated] = await db
    .update(schools)
    .set({
      name: body.name,
      code: body.code,
      level: body.level,
      province: body.province,
      district: body.district,
      phone: body.phone,
      email: body.email,
      logo: body.logo,
      updatedAt: new Date(),
    })
    .where(eq(schools.id, id))
    .returning();

  return {
    success: true,
    message: "បានកែប្រែព័ត៌មានសាលារៀនជោគជ័យ",
    data: updated,
  };
});
