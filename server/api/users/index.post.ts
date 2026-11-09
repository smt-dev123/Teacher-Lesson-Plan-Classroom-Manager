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

  const password = body.password
    ? await hashPassword(body.password)
    : await hashPassword("123456");

  const [newUser] = await db
    .insert(users)
    .values({
      ...body,
      ...(body.id ? { id: body.id } : {}),
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

  if (!newUser) {
    throw createError({
      statusCode: 500,
      statusMessage: "មិនអាចបន្ថែមអ្នកប្រើប្រាស់បានទេ",
    });
  }

  return {
    success: true,
    message: "បានបន្ថែមអ្នកប្រើប្រាស់ដោយជោគជ័យ",
    data: newUser,
  };
});
