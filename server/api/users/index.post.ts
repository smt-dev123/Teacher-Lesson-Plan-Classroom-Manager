import { db, users } from "../../database";
import { hashPassword } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.name || !body.email) {
    throw createError({
      statusCode: 400,
      statusMessage: "ឈ្មោះ និងអ៊ីមែល ត្រូវតែបំពេញ",
    });
  }

  const id = body.id || `user-${Date.now()}`;
  const password = body.password
    ? hashPassword(body.password)
    : hashPassword("123456");

  const [newUser] = await db
    .insert(users)
    .values({
      ...body,
      id,
      email: body.email.trim().toLowerCase(),
      password,
    })
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

  return {
    success: true,
    message: "បានបន្ថែមអ្នកប្រើប្រាស់ដោយជោគជ័យ",
    data: newUser,
  };
});
