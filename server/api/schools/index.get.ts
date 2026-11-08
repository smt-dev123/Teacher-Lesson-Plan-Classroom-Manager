import { db, schools } from "../../database";

export default defineEventHandler(async () => {
  const [school] = await db.select().from(schools).limit(1);

  return {
    success: true,
    data: school || null,
  };
});
