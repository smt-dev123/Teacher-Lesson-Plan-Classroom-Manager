import type { Exam, ExamQuestion, Question } from "~/types";

export const useExamBuilder = () => {
  const exams = ref<Exam[]>([]);
  const currentExam = ref<Exam | null>(null);

  const load = () => {
    if (import.meta.client) {
      const stored = localStorage.getItem("kh_exams");
      exams.value = stored ? JSON.parse(stored) : [];
    }
  };

  const save = () => {
    if (import.meta.client) {
      localStorage.setItem("kh_exams", JSON.stringify(exams.value));
    }
  };

  const createExam = (
    meta: Pick<
      Exam,
      "title" | "subject" | "grade" | "duration" | "instructions"
    >,
  ) => {
    currentExam.value = {
      id: "exam-" + Date.now(),
      ...meta,
      totalPoints: 0,
      questions: [],
      createdAt: new Date().toISOString().slice(0, 10),
      status: "draft",
    };
  };

  const addQuestion = (q: Question) => {
    const exam = currentExam.value;
    if (!exam) return;
    if (exam.questions.some((x) => x.id === q.id)) return;

    const eq: ExamQuestion = {
      ...q,
      order: exam.questions.length + 1,
      examPoints: q.points,
    };
    exam.questions.push(eq);
    recalcTotal();
  };

  const removeQuestion = (id: string) => {
    const exam = currentExam.value;
    if (!exam) return;
    exam.questions = exam.questions
      .filter((q) => q.id !== id)
      .map((q, i) => ({ ...q, order: i + 1 }));
    recalcTotal();
  };

  const moveQuestion = (id: string, dir: -1 | 1) => {
    const exam = currentExam.value;
    if (!exam) return;

    const arr = exam.questions;
    const idx = arr.findIndex((q) => q.id === id);
    if (idx < 0) return;

    const next = idx + dir;
    if (next < 0 || next >= arr.length) return;

    const a = arr[idx];
    const b = arr[next];
    if (!a || !b) return;
    arr[idx] = b;
    arr[next] = a;

    arr.forEach((q, i) => {
      q.order = i + 1;
    });
  };

  const setPoints = (id: string, points: number) => {
    const exam = currentExam.value;
    if (!exam) return;

    const q = exam.questions.find((x) => x.id === id);
    if (!q) return; // ✅ guard
    q.examPoints = Math.max(0.5, points);
    recalcTotal();
  };

  const recalcTotal = () => {
    const exam = currentExam.value;
    if (!exam) return;
    exam.totalPoints = exam.questions.reduce((sum, q) => sum + q.examPoints, 0);
  };

  const saveExam = () => {
    const exam = currentExam.value;
    if (!exam) return;

    const idx = exams.value.findIndex((e) => e.id === exam.id);
    if (idx > -1) exams.value[idx] = { ...exam };
    else exams.value.unshift({ ...exam });
    save();
  };

  const loadExam = (id: string) => {
    currentExam.value = exams.value.find((e) => e.id === id) ?? null;
  };

  const resetCurrent = () => {
    currentExam.value = null;
  };

  const removeExam = (id: string) => {
    exams.value = exams.value.filter((e) => e.id !== id);
    save();
  };

  return {
    exams,
    currentExam,
    load,
    save,
    createExam,
    addQuestion,
    removeQuestion,
    moveQuestion,
    setPoints,
    saveExam,
    loadExam,
    resetCurrent,
    removeExam,
  };
};
