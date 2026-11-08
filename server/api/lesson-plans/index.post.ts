import { db, lessonPlans } from "../../database";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.subject || !body.grade || !body.topic) {
    throw createError({
      statusCode: 400,
      statusMessage: "ព័ត៌មានមិនគ្រប់គ្រាន់ (មុខវិជ្ជា, ថ្នាក់ទី, ចំណងជើង ត្រូវតែបំពេញ)",
    });
  }

  const id = body.id || `plan-${Date.now()}`;

  const [newPlan] = await db
    .insert(lessonPlans)
    .values({
      ...body,
      id,
      updatedAt: new Date(),
    })
    .returning();

  return {
    success: true,
    message: "បានបង្កើតកិច្ចតែងការដោយជោគជ័យ",
    data: newPlan,
  };
});
