import { db, users } from "../../database";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Invalid ID" });
  }

  const [deleted] = await db
    .delete(users)
    .where(eq(users.id, id))
    .returning();

  if (!deleted) {
    throw createError({ statusCode: 404, statusMessage: "រកមិនឃើញអ្នកប្រើប្រាស់នេះទេ" });
  }

  return {
    success: true,
    message: "បានលុបអ្នកប្រើប្រាស់ដោយជោគជ័យ",
    data: deleted,
  };
});
