import { db, users } from "../../database";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.name || !body.email) {
    throw createError({
      statusCode: 400,
      statusMessage: "ឈ្មោះ និងអ៊ីមែល ត្រូវតែបំពេញ",
    });
  }

  const id = body.id || `user-${Date.now()}`;

  const [newUser] = await db
    .insert(users)
    .values({
      ...body,
      id,
    })
    .returning();

  return {
    success: true,
    message: "បានបន្ថែមអ្នកប្រើប្រាស់ដោយជោគជ័យ",
    data: newUser,
  };
});
