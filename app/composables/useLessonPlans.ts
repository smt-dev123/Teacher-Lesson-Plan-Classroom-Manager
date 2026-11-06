import type { LessonPlan } from "~/types";

const defaultPlans: LessonPlan[] = [
  {
    id: "plan-1",
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

  const load = () => {
    if (import.meta.client) {
      const stored = localStorage.getItem("kh_teacher_plans");
      plans.value = stored ? JSON.parse(stored) : [...defaultPlans];
    }
  };

  const save = () => {
    if (import.meta.client) {
      localStorage.setItem("kh_teacher_plans", JSON.stringify(plans.value));
    }
  };

  const add = (plan: LessonPlan) => {
    plans.value.unshift(plan);
    save();
  };

  const update = (plan: LessonPlan) => {
    const i = plans.value.findIndex((p) => p.id === plan.id);
    if (i > -1) plans.value[i] = plan;
    save();
  };

  const remove = (id: string) => {
    plans.value = plans.value.filter((p) => p.id !== id);
    save();
  };

  const getById = (id: string) => plans.value.find((p) => p.id === id);

  return { plans, load, save, add, update, remove, getById };
};
