import { db, subjects } from "../../database";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Invalid ID" });
  }

  const body = await readBody(event);

  const [updated] = await db
    .update(subjects)
    .set({
      name: body.name,
      code: body.code,
      grades: body.grades,
      color: body.color,
      description: body.description,
      totalHours: Number(body.totalHours) || 60,
      updatedAt: new Date(),
    })
    .where(eq(subjects.id, id))
    .returning();

  if (!updated) {
    throw createError({ statusCode: 404, statusMessage: "រកមិនឃើញមុខវិជ្ជានេះទេ" });
  }

  return {
    success: true,
    message: "បានកែប្រែមុខវិជ្ជាដោយជោគជ័យ",
    data: updated,
  };
});
