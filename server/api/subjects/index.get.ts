import { db, subjects } from "../../database";
import { asc, ilike, or } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const search = query.search ? String(query.search) : null;

  let condition;
  if (search) {
    condition = or(
      ilike(subjects.name, `%${search}%`),
      ilike(subjects.code, `%${search}%`),
      ilike(subjects.description, `%${search}%`)
    );
  }

  const result = await db
    .select()
    .from(subjects)
    .where(condition)
    .orderBy(asc(subjects.name));

  return {
    success: true,
    data: result,
  };
});
