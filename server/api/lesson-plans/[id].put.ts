import { db, lessonPlans } from "../../database";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Invalid ID" });
  }

  const body = await readBody(event);

  const [updated] = await db
    .update(lessonPlans)
    .set({
      ...body,
      updatedAt: new Date(),
    })
    .where(eq(lessonPlans.id, id))
    .returning();

  if (!updated) {
    throw createError({ statusCode: 404, statusMessage: "រកមិនឃើញកិច្ចតែងការនេះដើម្បីកែប្រែទេ" });
  }

  return {
    success: true,
    message: "បានកែប្រែកិច្ចតែងការដោយជោគជ័យ",
    data: updated,
  };
});
