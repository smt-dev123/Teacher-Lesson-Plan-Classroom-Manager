<template>
  <div class="space-y-5">
    <!-- If no current exam: show list + create -->
    <div v-if="!currentExam" class="space-y-4">
      <div
        class="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800"
      >
        <h3 class="text-base font-bold text-slate-800 dark:text-white">
          បង្កើតវិញ្ញាសាថ្មី
        </h3>
        <p class="mt-1 text-xs text-slate-500">
          រៀបចំវិញ្ញាសាប្រឡងពីធនាគារសំណួរ
        </p>

        <div class="mt-4 grid grid-cols-1 gap-3 md:grid-cols-4">
          <el-input v-model="meta.title" placeholder="ចំណងជើងវិញ្ញាសា" />
          <el-input v-model="meta.subject" placeholder="មុខវិជ្ជា" />
          <el-select v-model="meta.grade" placeholder="ថ្នាក់">
            <el-option v-for="g in grades" :key="g" :label="g" :value="g" />
          </el-select>
          <el-input-number
            v-model="meta.duration"
            :min="5"
            class="!w-full"
            placeholder="រយៈពេល (នាទី)"
          />
        </div>

        <div class="mt-3">
          <el-input
            v-model="meta.instructions"
            type="textarea"
            :rows="2"
            placeholder="សេចក្តីណែនាំសម្រាប់សិស្ស..."
          />
        </div>

        <div class="mt-4 flex justify-end gap-2">
          <el-button type="primary" @click="startCreate">
            <el-icon><Plus /></el-icon> ចាប់ផ្តើមបង្កើត
          </el-button>
        </div>
      </div>

      <!-- Saved exams -->
      <div
        class="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800"
      >
        <h3 class="mb-3 text-base font-bold text-slate-800 dark:text-white">
          វិញ្ញាសាដែលបានរក្សាទុក
        </h3>
        <div v-if="exams.length" class="space-y-2">
          <div
            v-for="e in exams"
            :key="e.id"
            class="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2.5 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/40"
          >
            <div>
              <p class="text-sm font-semibold text-slate-800 dark:text-white">
                {{ e.title }}
              </p>
              <p class="text-[11px] text-slate-500">
                {{ e.subject }} • {{ e.grade }} • {{ e.questions.length }} សំណួរ
                • {{ e.totalPoints }} ពិន្ទុ
              </p>
            </div>
            <div class="flex gap-1">
              <el-button size="small" @click="openExam(e.id)">បន្តកែ</el-button>
              <el-button
                size="small"
                type="danger"
                text
                @click="onRemoveExam(e.id)"
              >
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </div>
        </div>
        <el-empty v-else description="មិនទាន់មានវិញ្ញាសា" />
      </div>
    </div>

    <!-- If current exam exists: builder UI -->
    <div v-else class="space-y-4">
      <ExamBuilderHeader
        :exam="currentExam"
        @add="pickerVisible = true"
        @save="onSave"
        @reset="resetCurrent"
        @preview="previewVisible = true"
      />

      <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <!-- Question list -->
        <div class="space-y-3 lg:col-span-2">
          <div
            v-if="!currentExam.questions.length"
            class="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-800"
          >
            <el-icon :size="40" class="mb-2 text-slate-300"><Files /></el-icon>
            <p class="text-sm font-semibold text-slate-600 dark:text-slate-300">
              មិនទាន់មានសំណួរ
            </p>
            <el-button
              type="primary"
              class="mt-3"
              @click="pickerVisible = true"
            >
              <el-icon><Plus /></el-icon> បន្ថែមសំណួរ
            </el-button>
          </div>

          <div
            v-for="q in currentExam.questions"
            :key="q.id"
            class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
          >
            <div class="mb-2 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span
                  class="flex h-7 w-7 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-700 dark:bg-sky-900/40 dark:text-sky-300"
                >
                  {{ q.order }}
                </span>
                <el-tag size="small" type="info" effect="plain">{{
                  typeLabel(q.type)
                }}</el-tag>
                <el-tag size="small" type="warning" effect="plain">{{
                  diffLabel(q.difficulty)
                }}</el-tag>
              </div>
              <div class="flex items-center gap-1">
                <el-button size="small" text @click="move(q.id, -1)"
                  ><el-icon><Top /></el-icon
                ></el-button>
                <el-button size="small" text @click="move(q.id, 1)"
                  ><el-icon><Bottom /></el-icon
                ></el-button>
                <el-input-number
                  :model-value="q.examPoints"
                  :min="0.5"
                  :step="0.5"
                  size="small"
                  class="!w-20"
                  @update:model-value="(v: number) => setPoints(q.id, v)"
                />
                <el-button
                  size="small"
                  text
                  type="danger"
                  @click="removeQ(q.id)"
                >
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
            <p class="text-sm font-semibold text-slate-800 dark:text-white">
              {{ q.content }}
            </p>
            <ul v-if="q.type === 'mcq'" class="mt-2 grid grid-cols-2 gap-1.5">
              <li
                v-for="opt in q.options"
                :key="opt.id"
                class="rounded-lg border px-2 py-1 text-[11px]"
                :class="
                  opt.isCorrect
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                    : 'border-slate-200 text-slate-600'
                "
              >
                {{ opt.id.toUpperCase() }}. {{ opt.text }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Summary -->
        <div class="lg:col-span-1">
          <div
            class="sticky top-4 space-y-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
          >
            <h4 class="text-sm font-bold text-slate-800 dark:text-white">
              សេចក្តីសង្ខេប
            </h4>
            <div class="space-y-1.5 text-xs">
              <div class="flex justify-between">
                <span class="text-slate-500">មុខវិជ្ជា</span
                ><strong>{{ currentExam.subject }}</strong>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">ថ្នាក់</span
                ><strong>{{ currentExam.grade }}</strong>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">រយៈពេល</span
                ><strong>{{ currentExam.duration }} នាទី</strong>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">ចំនួនសំណួរ</span
                ><strong>{{ currentExam.questions.length }}</strong>
              </div>
              <div
                class="flex justify-between border-t pt-1.5 dark:border-slate-700"
              >
                <span class="text-slate-500">ពិន្ទុសរុប</span
                ><strong class="text-sky-600">{{
                  currentExam.totalPoints
                }}</strong>
              </div>
            </div>

            <div class="border-t pt-2 dark:border-slate-700">
              <p
                class="mb-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300"
              >
                តាមប្រភេទ
              </p>
              <div class="space-y-0.5 text-[11px] text-slate-500">
                <div
                  v-for="t in typeBreakdown"
                  :key="t.label"
                  class="flex justify-between"
                >
                  <span>{{ t.label }}</span
                  ><span>{{ t.count }} សំណួរ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <ExamQuestionPicker
      v-model="pickerVisible"
      :exclude-ids="currentExam?.questions.map((q) => q.id) || []"
      @pick="onPick"
    />
    <ExamPreviewModal v-model="previewVisible" :exam="currentExam" />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from "vue";
import { Plus, Delete, Top, Bottom, Files } from "@element-plus/icons-vue";
import type { Question, QuestionType, Difficulty } from "~/types";
import { useExamBuilder } from "~/composables/useExamBuilder";
import ExamBuilderHeader from "~/components/exams/ExamBuilderHeader.vue";
import ExamQuestionPicker from "~/components/exams/ExamQuestionPicker.vue";
import ExamPreviewModal from "~/components/exams/ExamPreviewModal.vue";
import { ElMessage } from "element-plus";

const {
  exams,
  currentExam,
  load,
  createExam,
  addQuestion,
  removeQuestion,
  moveQuestion,
  setPoints,
  saveExam,
  loadExam,
  resetCurrent,
  removeExam,
} = useExamBuilder();

onMounted(load);

const grades = [
  "ថ្នាក់ទី៧",
  "ថ្នាក់ទី៨",
  "ថ្នាក់ទី៩",
  "ថ្នាក់ទី១០",
  "ថ្នាក់ទី១១",
  "ថ្នាក់ទី១២",
];

const meta = reactive({
  title: "",
  subject: "រូបវិទ្យា",
  grade: "ថ្នាក់ទី៩",
  duration: 60,
  instructions: "",
});

const startCreate = () => {
  if (!meta.title.trim()) return ElMessage.warning("សូមបញ្ចូលចំណងជើង");
  createExam({
    title: meta.title,
    subject: meta.subject,
    grade: meta.grade,
    duration: meta.duration,
    instructions: meta.instructions,
  });
};

const openExam = (id: string) => loadExam(id);
const onRemoveExam = (id: string) => {
  removeExam(id);
  ElMessage.success("បានលុបវិញ្ញាសា");
};

const pickerVisible = ref(false);
const previewVisible = ref(false);

const onPick = (q: Question) => addQuestion(q);
const onSave = () => {
  saveExam();
  ElMessage.success("បានរក្សាទុកវិញ្ញាសា!");
};
const move = (id: string, dir: -1 | 1) => moveQuestion(id, dir);
const removeQ = (id: string) => removeQuestion(id);

const typeLabel = (t: QuestionType) =>
  ({
    mcq: "ពហុជម្រើស",
    truefalse: "ត្រូវ/ខុស",
    short: "ខ្លី",
    essay: "អត្ថបទ",
  })[t];

const diffLabel = (d: Difficulty) =>
  ({
    easy: "ងាយ",
    medium: "មធ្យម",
    hard: "ពិបាក",
  })[d];

const typeBreakdown = computed(() => {
  if (!currentExam.value) return [];
  const arr = currentExam.value.questions;
  return [
    { label: "ពហុជម្រើស", count: arr.filter((q) => q.type === "mcq").length },
    {
      label: "ត្រូវ/ខុស",
      count: arr.filter((q) => q.type === "truefalse").length,
    },
    { label: "ខ្លី", count: arr.filter((q) => q.type === "short").length },
    { label: "អត្ថបទ", count: arr.filter((q) => q.type === "essay").length },
  ].filter((t) => t.count > 0);
});
</script>
