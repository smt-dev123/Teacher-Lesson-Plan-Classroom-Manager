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
    .select({
      id: users.id,
      schoolId: users.schoolId,
      name: users.name,
      email: users.email,
      phone: users.phone,
      role: users.role,
      subject: users.subject,
      status: users.status,
      avatar: users.avatar,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(conditions)
    .orderBy(desc(users.createdAt));

  return {
    success: true,
    data: result,
  };
});
