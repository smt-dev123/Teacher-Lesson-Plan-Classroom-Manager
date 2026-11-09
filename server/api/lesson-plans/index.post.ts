import { db, lessonPlans } from "../../database";
import { getAuthUser } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.subject || !body.grade || !body.topic) {
    throw createError({
      statusCode: 400,
      statusMessage: "ព័ត៌មានមិនគ្រប់គ្រាន់ (មុខវិជ្ជា, ថ្នាក់ទី, ចំណងជើង ត្រូវតែបំពេញ)",
    });
  }

  const authUser = await getAuthUser(event);
  const userId = authUser ? authUser.id : (body.userId || "user-1");
  const { createdAt: _createdAt, updatedAt: _updatedAt, ...data } = body;

  const [newPlan] = await db
    .insert(lessonPlans)
    .values({
      ...data,
      ...(body.id ? { id: body.id } : {}),
      userId,
      schoolId: body.schoolId || (authUser?.schoolId ?? "sch-1"),
      academicYear: body.academicYear || "2024-2025",
      updatedAt: new Date(),
    })
    .returning();

  return {
    success: true,
    message: "បានបង្កើតកិច្ចតែងការដោយជោគជ័យ",
    data: newPlan,
  };
});
