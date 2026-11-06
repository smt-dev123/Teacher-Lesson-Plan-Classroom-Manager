<template>
  <div class="space-y-5">
    <!-- Filters -->
    <div
      class="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 md:flex-row md:items-center md:justify-between"
    >
      <div class="flex flex-wrap gap-2">
        <el-select
          v-model="gradeFilter"
          size="small"
          placeholder="គ្រប់កម្រិតថ្នាក់"
          class="!w-40"
        >
          <el-option label="គ្រប់កម្រិតថ្នាក់" value="all" />
          <el-option label="ថ្នាក់ទី៧" value="ថ្នាក់ទី៧" />
          <el-option label="ថ្នាក់ទី៨" value="ថ្នាក់ទី៨" />
          <el-option label="ថ្នាក់ទី៩" value="ថ្នាក់ទី៩" />
          <el-option label="ថ្នាក់ទី១០" value="ថ្នាក់ទី១០" />
        </el-select>

        <el-select
          v-model="subjectFilter"
          size="small"
          placeholder="គ្រប់មុខវិជ្ជា"
          class="!w-40"
        >
          <el-option label="គ្រប់មុខវិជ្ជា" value="all" />
          <el-option label="រូបវិទ្យា" value="រូបវិទ្យា" />
          <el-option label="គណិតវិទ្យា" value="គណិតវិទ្យា" />
          <el-option label="គីមីវិទ្យា" value="គីមីវិទ្យា" />
        </el-select>
      </div>

      <div class="flex items-center gap-2">
        <el-tag type="primary" round
          >សរុប: {{ filtered.length }} កិច្ចតែងការ</el-tag
        >
        <el-button type="primary" size="small" @click="openCreate">
          <el-icon><Plus /></el-icon> បន្ថែមថ្មី
        </el-button>
      </div>
    </div>

    <!-- Cards -->
    <div
      v-if="filtered.length"
      class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
    >
      <PlanCard
        v-for="p in filtered"
        :key="p.id"
        :plan="p"
        @edit="openEdit"
        @delete="onDelete"
        @view="openPrint"
      />
    </div>
    <el-empty v-else description="មិនមានកិច្ចតែងការតាមការស្វែងរក" />

    <!-- Modals -->
    <PlanFormModal v-model="formVisible" :plan="editingPlan" @save="onSave" />
    <PlanPrintModal v-model="printVisible" :plan="printingPlan" />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { Plus } from "@element-plus/icons-vue";
import type { LessonPlan } from "~/types";
import { useLessonPlans } from "~/composables/useLessonPlans";
import { ElMessage, ElMessageBox } from "element-plus";
import PlanCard from "~/components/plans/PlanCard.vue";
import PlanFormModal from "~/components/plans/PlanFormModal.vue";
import PlanPrintModal from "~/components/plans/PlanPrintModal.vue";

const { plans, load, add, update, remove, getById } = useLessonPlans();

onMounted(load);

const gradeFilter = ref("all");
const subjectFilter = ref("all");

const filtered = computed(() =>
  plans.value.filter((p) => {
    const g = gradeFilter.value === "all" || p.grade === gradeFilter.value;
    const s =
      subjectFilter.value === "all" || p.subject.includes(subjectFilter.value);
    return g && s;
  }),
);

const formVisible = ref(false);
const editingPlan = ref<LessonPlan | null>(null);
const printVisible = ref(false);
const printingPlan = ref<LessonPlan | null>(null);

const openCreate = () => {
  editingPlan.value = null;
  formVisible.value = true;
};

const openEdit = (id: string) => {
  editingPlan.value = getById(id) || null;
  formVisible.value = true;
};

const onSave = (plan: LessonPlan) => {
  if (editingPlan.value) {
    update(plan);
    ElMessage.success("បានកែប្រែដោយជោគជ័យ!");
  } else {
    add(plan);
    ElMessage.success("បានបង្កើតថ្មីដោយជោគជ័យ!");
  }
  formVisible.value = false;
};

const onDelete = async (id: string) => {
  try {
    await ElMessageBox.confirm("តើអ្នកពិតជាចង់លុបមែនទេ?", "បញ្ជាក់", {
      type: "warning",
      confirmButtonText: "លុប",
      cancelButtonText: "បោះបង់",
    });
    remove(id);
    ElMessage.success("បានលុបរួចរាល់");
  } catch {}
};

const openPrint = (id: string) => {
  printingPlan.value = getById(id) || null;
  printVisible.value = true;
};
</script>
