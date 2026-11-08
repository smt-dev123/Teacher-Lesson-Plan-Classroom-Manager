import { db, lessonPlans } from "../../database";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Invalid ID" });
  }

  const [deleted] = await db
    .delete(lessonPlans)
    .where(eq(lessonPlans.id, id))
    .returning();

  if (!deleted) {
    throw createError({ statusCode: 404, statusMessage: "រកមិនឃើញកិច្ចតែងការនេះដើម្បីលុបទេ" });
  }

  return {
    success: true,
    message: "បានលុបកិច្ចតែងការដោយជោគជ័យ",
    data: deleted,
  };
});
