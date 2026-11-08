import { db, lessonPlans } from "../../database";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Invalid ID" });
  }

  const [plan] = await db
    .select()
    .from(lessonPlans)
    .where(eq(lessonPlans.id, id));

  if (!plan) {
    throw createError({ statusCode: 404, statusMessage: "រកមិនឃើញកិច្ចតែងការនេះទេ" });
  }

  return {
    success: true,
    data: plan,
  };
});
