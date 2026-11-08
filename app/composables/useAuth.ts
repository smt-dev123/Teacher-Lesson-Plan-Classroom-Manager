import { storeToRefs } from "pinia";
import { useAuthStore } from "~/stores/auth";

export const useAuth = () => {
  const store = useAuthStore();
  const { user, loading, isAuthenticated, currentUser, isTeacher, isAdmin } =
    storeToRefs(store);

  return {
    user,
    loading,
    isAuthenticated,
    currentUser,
    isTeacher,
    isAdmin,
    fetchUser: store.fetchUser,
    login: store.login,
    register: store.register,
    logout: store.logout,
  };
};
