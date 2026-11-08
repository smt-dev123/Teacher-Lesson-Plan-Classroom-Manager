import { defineStore } from "pinia";

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

export const useSubjectStore = defineStore("subjects", {
  state: () => ({
    subjects: [] as SubjectItem[],
    loading: false as boolean,
    initialized: false as boolean,
  }),

  getters: {
    allSubjects: (state) => state.subjects,
    subjectCount: (state) => state.subjects.length,
    getById: (state) => (id: string) => state.subjects.find((s) => s.id === id),
  },

  actions: {
    async load(search?: string) {
      this.loading = true;
      try {
        const query = search ? `?search=${encodeURIComponent(search)}` : "";
        const res = await $fetch<{ success: boolean; data: SubjectItem[] }>(
          `/api/subjects${query}`
        );
        if (res && res.data) {
          this.subjects = res.data;
          this.initialized = true;
          return res.data;
        }
      } catch (err) {
        console.error("Failed to load subjects:", err);
      } finally {
        this.loading = false;
      }
    },

    async add(sub: Partial<SubjectItem>) {
      try {
        const res = await $fetch<{ success: boolean; data: SubjectItem }>(
          "/api/subjects",
          {
            method: "POST",
            body: sub,
          }
        );
        if (res && res.data) {
          this.subjects.push(res.data);
          return res.data;
        }
      } catch (err) {
        console.error("Failed to add subject:", err);
        throw err;
      }
    },

    async update(sub: SubjectItem) {
      try {
        const res = await $fetch<{ success: boolean; data: SubjectItem }>(
          `/api/subjects/${sub.id}`,
          {
            method: "PUT",
            body: sub,
          }
        );
        const updated = res?.data || sub;
        const idx = this.subjects.findIndex((s) => s.id === sub.id);
        if (idx > -1) this.subjects[idx] = updated;
        return updated;
      } catch (err) {
        console.error("Failed to update subject:", err);
        throw err;
      }
    },

    async remove(id: string) {
      try {
        await $fetch(`/api/subjects/${id}`, { method: "DELETE" });
        this.subjects = this.subjects.filter((s) => s.id !== id);
      } catch (err) {
        console.error("Failed to delete subject:", err);
        throw err;
      }
    },
  },
});
