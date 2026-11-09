import { db, lessonPlans } from "../../database";
import { eq } from "drizzle-orm";
import { getAuthUser } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Invalid ID" });
  }

  const [existing] = await db
    .select()
    .from(lessonPlans)
    .where(eq(lessonPlans.id, id))
    .limit(1);

  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage: "រកមិនឃើញកិច្ចតែងការនេះដើម្បីកែប្រែទេ",
    });
  }

  const authUser = await getAuthUser(event);
  if (
    authUser &&
    authUser.role !== "អ្នកគ្រប់គ្រង" &&
    existing.userId &&
    existing.userId !== authUser.id
  ) {
    throw createError({
      statusCode: 403,
      statusMessage: "អ្នកមិនមានសិទ្ធិកែប្រែកិច្ចតែងការរបស់អ្នកដទៃឡើយ",
    });
  }

  const body = await readBody(event);
  const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...updateData } = body;

  const [updated] = await db
    .update(lessonPlans)
    .set({
      ...updateData,
      updatedAt: new Date(),
    })
    .where(eq(lessonPlans.id, id))
    .returning();

  return {
    success: true,
    message: "បានកែប្រែកិច្ចតែងការដោយជោគជ័យ",
    data: updated,
  };
});
