import { db, lessonPlans } from "../../database";
import { desc, eq, and, ilike } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const grade = query.grade ? String(query.grade) : null;
  const subject = query.subject ? String(query.subject) : null;
  const search = query.search ? String(query.search) : null;

  const conditions = [];

  if (grade && grade !== "all") {
    conditions.push(eq(lessonPlans.grade, grade));
  }
  if (subject && subject !== "all") {
    conditions.push(ilike(lessonPlans.subject, `%${subject}%`));
  }
  if (search) {
    conditions.push(ilike(lessonPlans.topic, `%${search}%`));
  }

  const result = await db
    .select()
    .from(lessonPlans)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(lessonPlans.createdAt));

  return {
    success: true,
    data: result,
  };
});
