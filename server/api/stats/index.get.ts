import {
  db,
  lessonPlans,
  users,
  assignments,
  questions,
  subjects,
} from "../../database";
import { sql } from "drizzle-orm";

export default defineEventHandler(async () => {
  const [plansCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(lessonPlans);

  const [usersCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(users);

  const [subjectsCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(subjects);

  const [assignmentsCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(assignments);

  const [questionsCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(questions);

  return {
    success: true,
    data: {
      lessonPlans: plansCount?.count ?? 0,
      users: usersCount?.count ?? 0,
      subjects: subjectsCount?.count ?? 0,
      assignments: assignmentsCount?.count ?? 0,
      questions: questionsCount?.count ?? 0,
    },
  };
});
