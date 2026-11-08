import { db, subjects } from "../../database";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Invalid ID" });
  }

  const [deleted] = await db
    .delete(subjects)
    .where(eq(subjects.id, id))
    .returning();

  if (!deleted) {
    throw createError({ statusCode: 404, statusMessage: "រកមិនឃើញមុខវិជ្ជានេះដើម្បីលុបទេ" });
  }

  return {
    success: true,
    message: "បានលុបមុខវិជ្ជាដោយជោគជ័យ",
    data: deleted,
  };
});
