<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? 'កែប្រែសំណួរ' : 'បង្កើតសំណួរថ្មី'"
    width="min(720px, 92vw)"
    top="5vh"
  >
    <el-form :model="form" label-position="top">
      <!-- Type -->
      <el-form-item label="ប្រភេទសំណួរ">
        <el-radio-group v-model="form.type">
          <el-radio-button value="mcq">ពហុជម្រើស</el-radio-button>
          <el-radio-button value="truefalse">ត្រូវ/ខុស</el-radio-button>
          <el-radio-button value="short">ខ្លី</el-radio-button>
          <el-radio-button value="essay">អត្ថបទ</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-row :gutter="12">
        <el-col :md="6" :sm="12">
          <el-form-item label="មុខវិជ្ជា">
            <el-input v-model="form.subject" />
          </el-form-item>
        </el-col>
        <el-col :md="6" :sm="12">
          <el-form-item label="ថ្នាក់">
            <el-select v-model="form.grade" class="w-full">
              <el-option v-for="g in grades" :key="g" :label="g" :value="g" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :md="6" :sm="12">
          <el-form-item label="កម្រិត">
            <el-select v-model="form.difficulty" class="w-full">
              <el-option label="ងាយ" value="easy" />
              <el-option label="មធ្យម" value="medium" />
              <el-option label="ពិបាក" value="hard" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :md="6" :sm="12">
          <el-form-item label="ពិន្ទុ">
            <el-input-number
              v-model="form.points"
              :min="0.5"
              :step="0.5"
              class="!w-full"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="ជំពូក">
        <el-input v-model="form.chapter" />
      </el-form-item>

      <el-form-item label="ខ្លឹមសារសំណួរ" required>
        <el-input v-model="form.content" type="textarea" :rows="3" />
      </el-form-item>

      <!-- MCQ options -->
      <div
        v-if="form.type === 'mcq'"
        class="mb-3 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/40"
      >
        <p class="mb-2 text-xs font-bold text-slate-700 dark:text-slate-300">
          ជម្រើសចម្លើយ (ជ្រើសរើស ១ ត្រឹមត្រូវ)
        </p>
        <div
          v-for="(opt, i) in form.options"
          :key="opt.id"
          class="mb-2 flex items-center gap-2"
        >
          <el-radio v-model="correctId" :value="opt.id" />
          <span class="text-xs font-bold">{{ opt.id.toUpperCase() }}.</span>
          <el-input v-model="opt.text" placeholder="អត្ថបទជម្រើស" />
        </div>
      </div>

      <!-- True/False -->
      <el-form-item
        v-else-if="form.type === 'truefalse'"
        label="ចម្លើយត្រឹមត្រូវ"
      >
        <el-radio-group v-model="form.correctAnswer">
          <el-radio value="true">ត្រូវ</el-radio>
          <el-radio value="false">ខុស</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- Short answer -->
      <el-form-item v-else-if="form.type === 'short'" label="ចម្លើយត្រឹមត្រូវ">
        <el-input v-model="form.correctAnswer" />
      </el-form-item>

      <!-- Explanation -->
      <el-form-item label="ការពន្យល់ (ស្រេចចិត្ត)">
        <el-input v-model="form.explanation" type="textarea" :rows="2" />
      </el-form-item>

      <el-form-item label="ស្លាក (Tags)">
        <el-select
          v-model="form.tags"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="បន្ថែមស្លាក..."
          class="w-full"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">បោះបង់</el-button>
      <el-button type="primary" @click="submit">រក្សាទុក</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, watch } from "vue";
import type { Question, QuestionOption, QuestionType } from "~/types";

const props = defineProps<{ modelValue: boolean; question: Question | null }>();
const emit = defineEmits<{
  "update:modelValue": [boolean];
  save: [Question];
}>();

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

const isEdit = computed(() => !!props.question?.id);
const grades = [
  "ថ្នាក់ទី៧",
  "ថ្នាក់ទី៨",
  "ថ្នាក់ទី៩",
  "ថ្នាក់ទី១០",
  "ថ្នាក់ទី១១",
  "ថ្នាក់ទី១២",
];

const empty = (): Question => ({
  id: "",
  type: "mcq",
  subject: "រូបវិទ្យា",
  grade: "ថ្នាក់ទី៩",
  chapter: "",
  difficulty: "medium",
  content: "",
  options: [
    { id: "a", text: "", isCorrect: false },
    { id: "b", text: "", isCorrect: false },
    { id: "c", text: "", isCorrect: false },
    { id: "d", text: "", isCorrect: false },
  ],
  correctAnswer: "",
  explanation: "",
  points: 2,
  createdAt: new Date().toISOString().slice(0, 10),
  tags: [],
});

const form = reactive<Question>(empty());
const correctId = ref<string>("a");

watch(
  () => props.question,
  (q) => {
    Object.assign(form, q || empty());
    correctId.value = q?.options.find((o) => o.isCorrect)?.id || "a";
  },
  { immediate: true },
);

watch(correctId, (id) => {
  form.options.forEach((o) => (o.isCorrect = o.id === id));
});

const submit = () => {
  if (!form.content.trim()) return;
  const data: Question = {
    ...form,
    id: form.id || `q-${crypto.randomUUID()}`,
    options: form.type === "mcq" ? form.options : [],
    correctAnswer:
      form.type === "truefalse" || form.type === "short"
        ? form.correctAnswer
        : "",
  };
  emit("save", data);
};
</script>
