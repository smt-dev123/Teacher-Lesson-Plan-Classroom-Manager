import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();
  if (!authStore.user) {
    await authStore.fetchUser();
  }

  // If already logged in and visiting /login, redirect to dashboard/plans
  if (to.path === "/login") {
    if (authStore.user) {
      return navigateTo("/lesson-plans");
    }
    return;
  }

  // If not authenticated, redirect to /login
  if (!authStore.user) {
    return navigateTo("/login");
  }
});
