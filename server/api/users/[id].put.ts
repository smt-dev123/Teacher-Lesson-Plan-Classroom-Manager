import { db, users } from "../../database";
import { eq } from "drizzle-orm";
import { hashPassword } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Invalid ID" });
  }

  const body = await readBody(event);

  const updateData: any = {};
  if (body.name !== undefined) updateData.name = body.name;
  if (body.email !== undefined) updateData.email = body.email.trim().toLowerCase();
  if (body.phone !== undefined) updateData.phone = body.phone;
  if (body.role !== undefined) updateData.role = body.role;
  if (body.subject !== undefined) updateData.subject = body.subject;
  if (body.status !== undefined) updateData.status = body.status;
  if (body.avatar !== undefined) updateData.avatar = body.avatar;
  if (body.password) {
    updateData.password = hashPassword(body.password);
  }

  const [updated] = await db
    .update(users)
    .set(updateData)
    .where(eq(users.id, id))
    .returning({
      id: users.id,
      schoolId: users.schoolId,
      name: users.name,
      email: users.email,
      phone: users.phone,
      role: users.role,
      subject: users.subject,
      status: users.status,
      avatar: users.avatar,
      createdAt: users.createdAt,
    });

  if (!updated) {
    throw createError({
      statusCode: 404,
      statusMessage: "រកមិនឃើញអ្នកប្រើប្រាស់នេះទេ",
    });
  }

  return {
    success: true,
    message: "បានកែប្រែអ្នកប្រើប្រាស់ដោយជោគជ័យ",
    data: updated,
  };
});
