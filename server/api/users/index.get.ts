import { db, users } from "../../database";
import { desc, ilike, or } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const search = query.search ? String(query.search) : null;

  let conditions;
  if (search) {
    conditions = or(
      ilike(users.name, `%${search}%`),
      ilike(users.email, `%${search}%`),
      ilike(users.subject, `%${search}%`)
    );
  }

  const result = await db
    .select()
    .from(users)
    .where(conditions)
    .orderBy(desc(users.createdAt));

  return {
    success: true,
    data: result,
  };
});
