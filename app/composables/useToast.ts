export const useToast = () => {
  if (import.meta.client) {
    const { ElMessage } = useNuxtApp().$notify as any;
  }
  const notify = (
    msg: string,
    type: "success" | "warning" | "error" = "success",
  ) => {
    if (import.meta.client) {
      ElMessage({ message: msg, type, duration: 2500 });
    }
  };
  return { notify };
};
