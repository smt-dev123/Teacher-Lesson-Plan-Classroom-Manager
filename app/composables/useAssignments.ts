import type { Assignment } from "~/types";

const defaults: Assignment[] = [
  {
    id: "asg-1",
    title: "លំហាត់ច្បាប់ទី២ញូតុន (សំណួរ ១-៤)",
    subject: "រូបវិទ្យា",
    grade: "ថ្នាក់ទី៩B",
    due: "2026-11-09",
    total: 36,
    submitted: 28,
    status: "pending",
  },
  {
    id: "asg-2",
    title: "ដោះស្រាយសមីការ ៥ លំហាត់",
    subject: "គណិតវិទ្យា",
    grade: "ថ្នាក់ទី៨A",
    due: "2026-11-07",
    total: 40,
    submitted: 39,
    status: "completed",
  },
];

export const useAssignments = () => {
  const items = ref<Assignment[]>([]);

  const load = () => {
    if (import.meta.client) {
      const stored = localStorage.getItem("kh_teacher_assignments");
      items.value = stored ? JSON.parse(stored) : [...defaults];
    }
  };

  const save = () => {
    if (import.meta.client) {
      localStorage.setItem(
        "kh_teacher_assignments",
        JSON.stringify(items.value),
      );
    }
  };

  const add = (a: Assignment) => {
    items.value.unshift(a);
    save();
  };

  const increment = (id: string) => {
    const a = items.value.find((x) => x.id === id);
    if (a && a.submitted < a.total) {
      a.submitted += 1;
      save();
    }
  };

  const remove = (id: string) => {
    items.value = items.value.filter((a) => a.id !== id);
    save();
  };

  return { items, load, save, add, increment, remove };
};
