import { getAuthUser } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  const user = await getAuthUser(event);

  if (!user) {
    return {
      success: false,
      user: null,
    };
  }

  const { password: _, ...safeUser } = user;

  return {
    success: true,
    user: safeUser,
  };
});
