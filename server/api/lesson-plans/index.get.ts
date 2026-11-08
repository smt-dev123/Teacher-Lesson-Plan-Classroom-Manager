import { db, lessonPlans } from "../../database";
import { desc, eq, and, ilike, or, sql } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const grade = query.grade ? String(query.grade) : null;
  const subject = query.subject ? String(query.subject) : null;
  const search = query.search ? String(query.search).trim() : null;
  const academicYear = query.academicYear ? String(query.academicYear) : null;
  const schoolId = query.schoolId ? String(query.schoolId) : null;

  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.max(
    1,
    Math.min(100, Number(query.limit) || Number(query.pageSize) || 9)
  );
  const offset = (page - 1) * limit;

  const conditions = [];

  if (academicYear && academicYear !== "all") {
    conditions.push(eq(lessonPlans.academicYear, academicYear));
  }
  if (schoolId && schoolId !== "all") {
    conditions.push(eq(lessonPlans.schoolId, schoolId));
  }
  if (grade && grade !== "all") {
    conditions.push(eq(lessonPlans.grade, grade));
  }
  if (subject && subject !== "all") {
    conditions.push(ilike(lessonPlans.subject, `%${subject}%`));
  }
  if (search) {
    conditions.push(
      or(
        ilike(lessonPlans.topic, `%${search}%`),
        ilike(lessonPlans.chapter, `%${search}%`),
        ilike(lessonPlans.subject, `%${search}%`)
      )
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  // 1. Get total count
  const [{ total }] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(lessonPlans)
    .where(whereClause);

  // 2. Get paginated rows
  const result = await db
    .select()
    .from(lessonPlans)
    .where(whereClause)
    .orderBy(desc(lessonPlans.createdAt))
    .limit(limit)
    .offset(offset);

  const totalPages = Math.ceil(total / limit) || 1;

  return {
    success: true,
    data: result,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
});
