import { getUserSession } from "../../utils/auth";
import { deleteCookie } from "h3";

export default defineEventHandler(async (event) => {
  // Clear native H3 session
  const session = await getUserSession(event);
  await session.clear();

  // Clear legacy cookie if present
  deleteCookie(event, "auth_token", { path: "/" });

  return {
    success: true,
    message: "បានចាកចេញដោយជោគជ័យ",
  };
});
