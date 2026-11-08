import { db, subjects } from "../../database";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Invalid ID" });
  }

  const [sub] = await db
    .select()
    .from(subjects)
    .where(eq(subjects.id, id));

  if (!sub) {
    throw createError({ statusCode: 404, statusMessage: "រកមិនឃើញមុខវិជ្ជានេះទេ" });
  }

  return {
    success: true,
    data: sub,
  };
});
