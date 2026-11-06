<template>
  <div class="space-y-5">
    <!-- Stats -->
    <div class="grid grid-cols-2 gap-3 md:grid-cols-4">
      <div
        class="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
      >
        <p class="text-[11px] text-slate-500">សំណួរសរុប</p>
        <p class="mt-1 text-2xl font-bold text-slate-800 dark:text-white">
          {{ stats.total }}
        </p>
      </div>
      <div
        class="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
      >
        <p class="text-[11px] text-slate-500">ពហុជម្រើស</p>
        <p class="mt-1 text-2xl font-bold text-sky-600">
          {{ stats.byType.mcq }}
        </p>
      </div>
      <div
        class="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
      >
        <p class="text-[11px] text-slate-500">ត្រូវ/ខុស</p>
        <p class="mt-1 text-2xl font-bold text-emerald-600">
          {{ stats.byType.truefalse }}
        </p>
      </div>
      <div
        class="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
      >
        <p class="text-[11px] text-slate-500">ខ្លី / អត្ថបទ</p>
        <p class="mt-1 text-2xl font-bold text-amber-600">
          {{ stats.byType.short }} / {{ stats.byType.essay }}
        </p>
      </div>
    </div>

    <!-- Filters -->
    <QuestionFilter v-model:filters="filters" @create="openCreate" />

    <!-- Questions list -->
    <div v-if="filtered.length" class="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <QuestionCard
        v-for="q in filtered"
        :key="q.id"
        :question="q"
        @edit="openEdit"
        @delete="onDelete"
      />
    </div>
    <el-empty v-else description="មិនមានសំណួរតាមការស្វែងរក" />

    <QuestionFormModal
      v-model="formVisible"
      :question="editingQuestion"
      @save="onSave"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from "vue";
import type { Question } from "~/types";
import { useQuestionBank } from "~/composables/useQuestionBank";
import QuestionCard from "~/components/questions/QuestionCard.vue";
import QuestionFormModal from "~/components/questions/QuestionFormModal.vue";
import QuestionFilter from "~/components/questions/QuestionFilter.vue";
import { ElMessage, ElMessageBox } from "element-plus";

const { questions, load, add, update, remove, filter, stats } =
  useQuestionBank();
onMounted(load);

const filters = reactive({
  subject: "all",
  grade: "all",
  type: "all",
  difficulty: "all",
  search: "",
});

const filtered = computed(() => filter(filters));

const formVisible = ref(false);
const editingQuestion = ref<Question | null>(null);

const openCreate = () => {
  editingQuestion.value = null;
  formVisible.value = true;
};

const openEdit = (id: string) => {
  editingQuestion.value = questions.value.find((q) => q.id === id) || null;
  formVisible.value = true;
};

const onSave = (q: Question) => {
  if (editingQuestion.value) {
    update(q);
    ElMessage.success("បានកែប្រែសំណួរ!");
  } else {
    add(q);
    ElMessage.success("បានបង្កើតសំណួរថ្មី!");
  }
  formVisible.value = false;
};

const onDelete = async (id: string) => {
  try {
    await ElMessageBox.confirm("លុបសំណួរនេះ?", "បញ្ជាក់", { type: "warning" });
    remove(id);
    ElMessage.success("បានលុប");
  } catch {}
};
</script>
