import type { Question } from "~/types";

const seedQuestions: Question[] = [
  {
    id: "q-1",
    type: "mcq",
    subject: "រូបវិទ្យា",
    grade: "ថ្នាក់ទី៩",
    chapter: "ជំពូកទី ២៖ កម្លាំង និងចលនា",
    difficulty: "medium",
    content: "តើរូបមន្តនៃច្បាប់ទី២ញូតុនគឺជាអ្វី?",
    options: [
      { id: "a", text: "F = m × a", isCorrect: true },
      { id: "b", text: "F = m / a", isCorrect: false },
      { id: "c", text: "F = a / m", isCorrect: false },
      { id: "d", text: "F = m + a", isCorrect: false },
    ],
    correctAnswer: "",
    explanation: "ច្បាប់ទី២ញូតុន៖ កម្លាំង = ម៉ាស × សំទុះ",
    points: 2,
    createdAt: "2026-11-01",
    tags: ["ញូតុន", "កម្លាំង"],
  },
  {
    id: "q-2",
    type: "truefalse",
    subject: "រូបវិទ្យា",
    grade: "ថ្នាក់ទី៩",
    chapter: "ជំពូកទី ២៖ កម្លាំង និងចលនា",
    difficulty: "easy",
    content: 'ច្បាប់ទី១ញូតុនត្រូវបានគេហៅថា "ច្បាប់និចលភាព"។',
    options: [],
    correctAnswer: "true",
    explanation: "ច្បាប់ទី១ញូតុន = ច្បាប់និចលភាព (Inertia)",
    points: 1,
    createdAt: "2026-11-02",
    tags: ["ញូតុន"],
  },
  {
    id: "q-3",
    type: "short",
    subject: "គណិតវិទ្យា",
    grade: "ថ្នាក់ទី៨",
    chapter: "ជំពូកទី ៣៖ សមីការ",
    difficulty: "medium",
    content: "ដោះស្រាយសមីការ 2x + 6 = 0 ។ តើ x = ?",
    options: [],
    correctAnswer: "x = -3",
    explanation: "2x = -6 → x = -3",
    points: 2,
    createdAt: "2026-11-03",
    tags: ["សមីការ"],
  },
  {
    id: "q-4",
    type: "essay",
    subject: "រូបវិទ្យា",
    grade: "ថ្នាក់ទី៩",
    chapter: "ជំពូកទី ២៖ កម្លាំង និងចលនា",
    difficulty: "hard",
    content: "ចូរពន្យល់ពីច្បាប់ទី៣ញូតុន និងផ្តល់ឧទាហរណ៍ជាក់ស្តែង ២ ។",
    options: [],
    correctAnswer: "",
    explanation: "រំពឹងឱ្យសិស្សពន្យល់ពី action-reaction និងឧទាហរណ៍",
    points: 5,
    createdAt: "2026-11-04",
    tags: ["ញូតុន", "អត្ថបទ"],
  },
];

export const useQuestionBank = () => {
  const questions = ref<Question[]>([]);

  const load = () => {
    if (import.meta.client) {
      const stored = localStorage.getItem("kh_question_bank");
      questions.value = stored ? JSON.parse(stored) : [...seedQuestions];
    }
  };

  const save = () => {
    if (import.meta.client) {
      localStorage.setItem("kh_question_bank", JSON.stringify(questions.value));
    }
  };

  const add = (q: Question) => {
    questions.value.unshift(q);
    save();
  };

  const update = (q: Question) => {
    const i = questions.value.findIndex((x) => x.id === q.id);
    if (i > -1) questions.value[i] = q;
    save();
  };

  const remove = (id: string) => {
    questions.value = questions.value.filter((q) => q.id !== id);
    save();
  };

  const filter = (opts: {
    subject?: string;
    grade?: string;
    type?: string;
    difficulty?: string;
    search?: string;
  }) => {
    return questions.value.filter((q) => {
      if (opts.subject && opts.subject !== "all" && q.subject !== opts.subject)
        return false;
      if (opts.grade && opts.grade !== "all" && q.grade !== opts.grade)
        return false;
      if (opts.type && opts.type !== "all" && q.type !== opts.type)
        return false;
      if (
        opts.difficulty &&
        opts.difficulty !== "all" &&
        q.difficulty !== opts.difficulty
      )
        return false;
      if (opts.search) {
        const s = opts.search.toLowerCase();
        if (
          !q.content.toLowerCase().includes(s) &&
          !q.tags.some((t) => t.toLowerCase().includes(s))
        )
          return false;
      }
      return true;
    });
  };

  const stats = computed(() => ({
    total: questions.value.length,
    byType: {
      mcq: questions.value.filter((q) => q.type === "mcq").length,
      truefalse: questions.value.filter((q) => q.type === "truefalse").length,
      short: questions.value.filter((q) => q.type === "short").length,
      essay: questions.value.filter((q) => q.type === "essay").length,
    },
  }));

  return { questions, load, save, add, update, remove, filter, stats };
};
