export interface SubjectItem {
  id: string;
  schoolId?: string;
  name: string;
  code?: string;
  grades?: string[];
  color?: string;
  description?: string;
  totalHours?: number;
  createdAt?: string;
}

export const useSubjects = () => {
  const subjects = ref<SubjectItem[]>([]);
  const loading = ref(false);

  const load = async (search?: string) => {
    loading.value = true;
    try {
      const query = search ? `?search=${encodeURIComponent(search)}` : "";
      const res = await $fetch<{ success: boolean; data: SubjectItem[] }>(
        `/api/subjects${query}`
      );
      if (res && res.data) {
        subjects.value = res.data;
        return res.data;
      }
    } catch (err) {
      console.error("Failed to load subjects:", err);
    } finally {
      loading.value = false;
    }
  };

  const add = async (sub: Partial<SubjectItem>) => {
    try {
      const res = await $fetch<{ success: boolean; data: SubjectItem }>(
        "/api/subjects",
        {
          method: "POST",
          body: sub,
        }
      );
      if (res && res.data) {
        subjects.value.push(res.data);
        return res.data;
      }
    } catch (err) {
      console.error("Failed to add subject:", err);
      throw err;
    }
  };

  const update = async (sub: SubjectItem) => {
    try {
      const res = await $fetch<{ success: boolean; data: SubjectItem }>(
        `/api/subjects/${sub.id}`,
        {
          method: "PUT",
          body: sub,
        }
      );
      const updated = res?.data || sub;
      const idx = subjects.value.findIndex((s) => s.id === sub.id);
      if (idx > -1) subjects.value[idx] = updated;
      return updated;
    } catch (err) {
      console.error("Failed to update subject:", err);
      throw err;
    }
  };

  const remove = async (id: string) => {
    try {
      await $fetch(`/api/subjects/${id}`, { method: "DELETE" });
      subjects.value = subjects.value.filter((s) => s.id !== id);
    } catch (err) {
      console.error("Failed to delete subject:", err);
      throw err;
    }
  };

  const getById = (id: string) => subjects.value.find((s) => s.id === id);

  return {
    subjects,
    loading,
    load,
    add,
    update,
    remove,
    getById,
  };
};
