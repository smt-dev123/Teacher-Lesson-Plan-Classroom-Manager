import { db, users } from "../../database";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Invalid ID" });
  }

  const body = await readBody(event);

  const [updated] = await db
    .update(users)
    .set({
      name: body.name,
      email: body.email,
      phone: body.phone,
      role: body.role,
      subject: body.subject,
      status: body.status,
    })
    .where(eq(users.id, id))
    .returning();

  if (!updated) {
    throw createError({ statusCode: 404, statusMessage: "រកមិនឃើញអ្នកប្រើប្រាស់នេះទេ" });
  }

  return {
    success: true,
    message: "បានកែប្រែអ្នកប្រើប្រាស់ដោយជោគជ័យ",
    data: updated,
  };
});
