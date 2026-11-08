import { db, academicYears } from "../../database";
import { asc } from "drizzle-orm";

export default defineEventHandler(async () => {
  const result = await db
    .select()
    .from(academicYears)
    .orderBy(asc(academicYears.code));

  return {
    success: true,
    data: result,
  };
});
