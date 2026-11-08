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
      statusMessage: "រកមិនឃើញកិច្ចតែងការនេះដើម្បីលុបទេ",
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
      statusMessage: "អ្នកមិនមានសិទ្ធិលុបកិច្ចតែងការរបស់អ្នកដទៃឡើយ",
    });
  }

  const [deleted] = await db
    .delete(lessonPlans)
    .where(eq(lessonPlans.id, id))
    .returning();

  return {
    success: true,
    message: "បានលុបកិច្ចតែងការដោយជោគជ័យ",
    data: deleted,
  };
});
