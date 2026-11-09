import { db, subjects } from "../../database";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.name) {
    throw createError({
      statusCode: 400,
      statusMessage: "ឈ្មោះមុខវិជ្ជាត្រូវតែបំពេញ",
    });
  }

  const [newSubject] = await db
    .insert(subjects)
    .values({
      ...(body.id ? { id: body.id } : {}),
      schoolId: body.schoolId || "sch-1",
      name: body.name,
      code: body.code || "",
      grades: body.grades || [],
      color: body.color || "#0284c7",
      description: body.description || "",
      totalHours: Number(body.totalHours) || 60,
    })
    .returning();

  return {
    success: true,
    message: "បានបង្កើតមុខវិជ្ជាថ្មីដោយជោគជ័យ",
    data: newSubject,
  };
});
