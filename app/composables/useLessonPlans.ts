import type { LessonPlan } from "~/types";

export interface LessonPlanPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface LessonPlanFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  grade?: string;
  subject?: string;
  academicYear?: string;
  schoolId?: string;
}

const defaultPlans: LessonPlan[] = [
  {
    id: "plan-1",
    schoolId: "sch-1",
    academicYear: "2024-2025",
    subject: "រូបវិទ្យា",
    grade: "ថ្នាក់ទី៩",
    chapter: "ជំពូកទី ២៖ កម្លាំង និងចលនា",
    topic: "ច្បាប់ទី២ញូតុន (F = ma)",
    date: "2026-11-06",
    duration: "៥០ នាទី",
    objKnowledge:
      "សិស្សអាចថ្លែងពីនិយមន័យនៃច្បាប់ទី២ញូតុន និងទាញយករូបមន្ត F=m*a បានត្រឹមត្រូវ។",
    objSkills:
      "សិស្សអាចគណនាកម្លាំង ម៉ាស ឬសំទុះ តាមលំហាត់គំរូជាក់ស្តែងបានដោយឥតខុសឆ្គង។",
    objAttitude:
      "បណ្តុះស្មារតីសង្កេត ចង់ចេះចង់ដឹង និងការសហការបំពេញការងារជាក្រុម។",
    materials: "រទេះពិសោធន៍, ឌីណាម៉ូម៉ែត្រ, ផ្ទាំងរូបភាពរូបមន្ត",
    references: "សៀវភៅពុម្ពទំព័រ ៥០ ដល់ ៥៤",
    step1Teacher: "ពិនិត្យអនាម័យ ឯកសណ្ឋានសិស្ស និងកត់ត្រាវត្តមាន",
    step1Student: "ប្រធានថ្នាក់រាយការណ៍វត្តមាន",
    step2Teacher: "សួរ៖ តើច្បាប់ទី១ញូតុនចែងដូចម្តេច?",
    step2Student: "សិស្សឡើងឆ្លើយនិយមន័យច្បាប់និចលភាព",
    step3Content: "រូបមន្ត F = ma (F: ញូតុន, m: kg, a: m/s²)",
    step3Teacher: "បង្ហាញការពិសោធន៍ទាញរទេះដោយកម្លាំងខុសៗគ្នា",
    step3Student: "សង្កេត ពិភាក្សាជាដៃគូ កត់ត្រារូបមន្ត",
    step4Teacher: "ដាក់លំហាត់៖ ម៉ាស 5kg រងកម្លាំង 20N រកសំទុះ?",
    step4Student: "អនុវត្តគណនាក្នុងសៀវភៅព្រាង",
    step5Teacher: "សង្ខេបចំណុចសំខាន់ ដាក់លំហាត់ផ្ទះទំព័រ ៥៥",
    step5Student: "កត់ត្រាកិច្ចការផ្ទះ",
  },
];

export const useLessonPlans = () => {
  const plans = ref<LessonPlan[]>([]);
  const loading = ref(false);
  const pagination = ref<LessonPlanPagination>({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 1,
  });

  const load = async (filter?: LessonPlanFilterParams) => {
    loading.value = true;
    try {
      const params = new URLSearchParams();
      if (filter?.page) params.append("page", String(filter.page));
      if (filter?.limit) params.append("limit", String(filter.limit));
      if (filter?.search) params.append("search", filter.search.trim());
      if (filter?.grade && filter.grade !== "all") {
        params.append("grade", filter.grade);
      }
      if (filter?.subject && filter.subject !== "all") {
        params.append("subject", filter.subject);
      }
      if (filter?.academicYear && filter.academicYear !== "all") {
        params.append("academicYear", filter.academicYear);
      }
      if (filter?.schoolId && filter.schoolId !== "all") {
        params.append("schoolId", filter.schoolId);
      }

      const queryStr = params.toString() ? `?${params.toString()}` : "";
      const res = await $fetch<{
        success: boolean;
        data: LessonPlan[];
        pagination?: LessonPlanPagination;
      }>(`/api/lesson-plans${queryStr}`);

      if (res && res.data) {
        plans.value = res.data;
        if (res.pagination) {
          pagination.value = res.pagination;
        } else {
          pagination.value = {
            page: filter?.page || 1,
            limit: filter?.limit || 9,
            total: res.data.length,
            totalPages: 1,
          };
        }
        return res;
      }
    } catch (err) {
      console.warn("API load failed, falling back to localStorage:", err);
    } finally {
      loading.value = false;
    }

    if (import.meta.client) {
      const stored = localStorage.getItem("kh_teacher_plans");
      const list = stored ? JSON.parse(stored) : [...defaultPlans];
      plans.value = list;
      pagination.value = {
        page: 1,
        limit: 9,
        total: list.length,
        totalPages: Math.ceil(list.length / 9) || 1,
      };
    }
  };

  const add = async (plan: LessonPlan) => {
    try {
      const res = await $fetch<{ success: boolean; data: LessonPlan }>(
        "/api/lesson-plans",
        {
          method: "POST",
          body: plan,
        }
      );
      if (res && res.data) {
        plans.value.unshift(res.data);
        pagination.value.total++;
        return res.data;
      }
    } catch (err) {
      console.error("API add failed:", err);
      plans.value.unshift(plan);
    }
  };

  const update = async (plan: LessonPlan) => {
    try {
      const res = await $fetch<{ success: boolean; data: LessonPlan }>(
        `/api/lesson-plans/${plan.id}`,
        {
          method: "PUT",
          body: plan,
        }
      );
      const updatedPlan = res?.data || plan;
      const i = plans.value.findIndex((p) => p.id === plan.id);
      if (i > -1) plans.value[i] = updatedPlan;
      return updatedPlan;
    } catch (err) {
      console.error("API update failed:", err);
      const i = plans.value.findIndex((p) => p.id === plan.id);
      if (i > -1) plans.value[i] = plan;
    }
  };

  const remove = async (id: string) => {
    try {
      await $fetch(`/api/lesson-plans/${id}`, { method: "DELETE" });
      pagination.value.total = Math.max(0, pagination.value.total - 1);
    } catch (err) {
      console.error("API remove failed:", err);
    }
    plans.value = plans.value.filter((p) => p.id !== id);
  };

  const getById = (id: string) => plans.value.find((p) => p.id === id);

  return { plans, loading, pagination, load, add, update, remove, getById };
};
