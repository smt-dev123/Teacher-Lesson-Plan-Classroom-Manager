<template>
  <el-dialog
    v-model="visible"
    title="ជ្រើសរើសសំណួរពីធនាគារ"
    width="min(900px, 95vw)"
    top="5vh"
  >
    <div class="mb-3 flex flex-wrap gap-2">
      <el-input
        v-model="search"
        placeholder="ស្វែងរក..."
        size="small"
        class="!w-56"
        clearable
      />
      <el-select
        v-model="typeFilter"
        size="small"
        class="!w-40"
        placeholder="ប្រភេទ"
      >
        <el-option label="គ្រប់ប្រភេទ" value="all" />
        <el-option label="ពហុជម្រើស" value="mcq" />
        <el-option label="ត្រូវ/ខុស" value="truefalse" />
        <el-option label="ខ្លី" value="short" />
        <el-option label="អត្ថបទ" value="essay" />
      </el-select>
    </div>

    <el-scrollbar max-height="55vh">
      <div class="space-y-2">
        <div
          v-for="q in available"
          :key="q.id"
          class="flex items-start gap-3 rounded-xl border border-slate-200 p-3 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/30"
        >
          <el-checkbox
            :model-value="selectedIds.includes(q.id)"
            @update:model-value="toggle(q.id)"
          />
          <div class="flex-1">
            <div class="mb-1 flex gap-1.5">
              <el-tag size="small" type="primary" effect="plain">{{
                typeLabel(q.type)
              }}</el-tag>
              <el-tag size="small" type="info" effect="plain">{{
                q.grade
              }}</el-tag>
              <el-tag size="small" type="warning" effect="plain"
                >{{ q.points }} ពិន្ទុ</el-tag
              >
            </div>
            <p class="text-sm font-semibold text-slate-800 dark:text-white">
              {{ q.content }}
            </p>
          </div>
        </div>
        <el-empty v-if="!available.length" description="មិនមានសំណួរ" />
      </div>
    </el-scrollbar>

    <template #footer>
      <el-button @click="visible = false">បោះបង់</el-button>
      <el-button
        type="primary"
        :disabled="!selectedIds.length"
        @click="confirm"
      >
        បន្ថែម ({{ selectedIds.length }})
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import type { Question, QuestionType } from "~/types";
import { useQuestionBank } from "~/composables/useQuestionBank";

const props = defineProps<{ modelValue: boolean; excludeIds: string[] }>();
const emit = defineEmits<{
  "update:modelValue": [boolean];
  pick: [Question];
}>();

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

const { questions, load } = useQuestionBank();
if (import.meta.client) load();

const search = ref("");
const typeFilter = ref("all");
const selectedIds = ref<string[]>([]);

watch(visible, (v) => {
  if (v) selectedIds.value = [];
});

const available = computed(() =>
  questions.value.filter((q) => {
    if (props.excludeIds.includes(q.id)) return false;
    if (typeFilter.value !== "all" && q.type !== typeFilter.value) return false;
    if (search.value) {
      const s = search.value.toLowerCase();
      if (!q.content.toLowerCase().includes(s)) return false;
    }
    return true;
  }),
);

const typeLabel = (t: QuestionType) =>
  ({
    mcq: "ពហុជម្រើស",
    truefalse: "ត្រូវ/ខុស",
    short: "ខ្លី",
    essay: "អត្ថបទ",
  })[t];

const toggle = (id: string) => {
  const i = selectedIds.value.indexOf(id);
  if (i > -1) selectedIds.value.splice(i, 1);
  else selectedIds.value.push(id);
};

const confirm = () => {
  selectedIds.value.forEach((id) => {
    const q = questions.value.find((x) => x.id === id);
    if (q) emit("pick", q);
  });
  visible.value = false;
};
</script>
