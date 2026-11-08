<template>
  <div class="space-y-5">
    <!-- Filters & Search Bar -->
    <div
      class="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 md:flex-row md:items-center md:justify-between"
    >
      <div class="flex flex-1 flex-wrap items-center gap-2">
        <!-- API Search Input -->
        <el-input
          v-model="searchQuery"
          placeholder="ស្វែងរកចំណងជើងមេរៀន, ជំពូក, មុខវិជ្ជា..."
          class="!w-64"
          clearable
          @input="onSearchInput"
          @clear="onSearchInput"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>

        <!-- Grade Filter -->
        <el-select
          v-model="gradeFilter"
          placeholder="គ្រប់កម្រិតថ្នាក់"
          class="!w-40"
          @change="onFilterChange"
        >
          <el-option label="គ្រប់កម្រិតថ្នាក់" value="all" />
          <el-option label="ថ្នាក់ទី៧" value="ថ្នាក់ទី៧" />
          <el-option label="ថ្នាក់ទី៨" value="ថ្នាក់ទី៨" />
          <el-option label="ថ្នាក់ទី៩" value="ថ្នាក់ទី៩" />
          <el-option label="ថ្នាក់ទី១០" value="ថ្នាក់ទី១០" />
          <el-option label="ថ្នាក់ទី១១" value="ថ្នាក់ទី១១" />
          <el-option label="ថ្នាក់ទី១២" value="ថ្នាក់ទី១២" />
        </el-select>

        <!-- Dynamic Subjects Filter from API -->
        <el-select
          v-model="subjectFilter"
          placeholder="គ្រប់មុខវិជ្ជា"
          class="!w-44"
          clearable
          @change="onFilterChange"
        >
          <el-option label="គ្រប់មុខវិជ្ជា" value="all" />
          <el-option
            v-for="s in subjects"
            :key="s.id"
            :label="s.name"
            :value="s.name"
          />
        </el-select>

        <!-- Admin: Filter by Teacher -->
        <el-select
          v-if="authUser && authUser.role === 'អ្នកគ្រប់គ្រង'"
          v-model="userFilter"
          placeholder="ជ្រើសរើសគ្រូ"
          class="!w-48"
          @change="onFilterChange"
        >
          <el-option label="កិច្ចតែងការទាំងអស់" value="all" />
          <el-option
            v-for="t in teacherUsers"
            :key="t.id"
            :label="t.name"
            :value="t.id"
          />
        </el-select>
      </div>

      <div class="flex items-center gap-2">
        <el-tag type="primary" round effect="light">
          សរុប: {{ pagination.total }} កិច្ចតែងការ
        </el-tag>
        <el-button type="primary" @click="openCreate">
          <el-icon><Plus /></el-icon> បន្ថែមថ្មី
        </el-button>
      </div>
    </div>

    <!-- Cards Grid with Loading State -->
    <div v-loading="loading">
      <div
        v-if="plans.length"
        class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
      >
        <PlanCard
          v-for="p in plans"
          :key="p.id"
          :plan="p"
          @edit="openEdit"
          @delete="onDelete"
          @view="openPrint"
          @download-docx="handleDownloadDocx"
        />
      </div>
      <el-empty
        v-else-if="!loading"
        description="មិនមានកិច្ចតែងការតាមការស្វែងរកឡើយ"
      />
    </div>

    <!-- Pagination from API -->
    <div
      v-if="pagination.total > 0"
      class="flex flex-col items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:flex-row"
    >
      <div class="text-xs text-slate-500">
        បង្ហាញពី
        <span class="font-bold text-slate-700 dark:text-slate-200">
          {{ (pagination.page - 1) * pagination.limit + 1 }}
        </span>
        ដល់
        <span class="font-bold text-slate-700 dark:text-slate-200">
          {{ Math.min(pagination.page * pagination.limit, pagination.total) }}
        </span>
        នៃសរុប
        <span class="font-bold text-sky-600 dark:text-sky-400">
          {{ pagination.total }}
        </span>
        កិច្ចតែងការ
      </div>

      <el-pagination
        v-model:current-page="page"
        v-model:page-size="limit"
        :page-sizes="[6, 9, 12, 18, 24]"
        :total="pagination.total"
        layout="sizes, prev, pager, next, jumper"
        background
        @current-change="onPageChange"
        @size-change="onSizeChange"
      />
    </div>

    <!-- Modals -->
    <PlanFormModal v-model="formVisible" :plan="editingPlan" @save="onSave" />
    <PlanPrintModal v-model="printVisible" :plan="printingPlan" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { Plus, Search } from "@element-plus/icons-vue";
import type { LessonPlan } from "~/types";
import { useLessonPlans } from "~/composables/useLessonPlans";
import { useSubjects } from "~/composables/useSubjects";
import { useLayoutStore } from "~/stores/layout";
import { useAuth } from "~/composables/useAuth";
import { ElMessage, ElMessageBox } from "element-plus";
import PlanCard from "~/components/plans/PlanCard.vue";
import PlanFormModal from "~/components/plans/PlanFormModal.vue";
import PlanPrintModal from "~/components/plans/PlanPrintModal.vue";
import { exportLessonPlanToDocx } from "~/utils/exportLessonPlanDocx";

const layoutStore = useLayoutStore();
const { user: authUser } = useAuth();
const { plans, loading, pagination, load, add, update, remove, getById } =
  useLessonPlans();
const { subjects, load: loadSubjects } = useSubjects();

const searchQuery = ref("");
const gradeFilter = ref("all");
const subjectFilter = ref("all");
const userFilter = ref("all");
const page = ref(1);
const limit = ref(9);
const teacherUsers = ref<any[]>([]);

const fetchPlans = () => {
  load({
    page: page.value,
    limit: limit.value,
    search: searchQuery.value,
    grade: gradeFilter.value,
    subject: subjectFilter.value,
    userId: userFilter.value !== "all" ? userFilter.value : undefined,
    academicYear: layoutStore.academicYear,
  });
};

const loadTeacherList = async () => {
  if (authUser.value?.role === "អ្នកគ្រប់គ្រង") {
    try {
      const res = await $fetch<{ success: boolean; data: any[] }>("/api/users");
      if (res?.data) {
        teacherUsers.value = res.data;
      }
    } catch {}
  }
};

let debounceTimer: ReturnType<typeof setTimeout> | null = null;
const onSearchInput = () => {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    page.value = 1;
    fetchPlans();
  }, 300);
};

const onFilterChange = () => {
  page.value = 1;
  fetchPlans();
};

const onPageChange = (newPage: number) => {
  page.value = newPage;
  fetchPlans();
};

const onSizeChange = (newSize: number) => {
  limit.value = newSize;
  page.value = 1;
  fetchPlans();
};

onMounted(() => {
  fetchPlans();
  loadSubjects();
  loadTeacherList();
});

watch(
  () => layoutStore.academicYear,
  () => {
    page.value = 1;
    fetchPlans();
  }
);

watch(
  () => authUser.value,
  () => {
    loadTeacherList();
    fetchPlans();
  }
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

const onSave = async (plan: LessonPlan) => {
  const planData = {
    ...plan,
    userId: authUser.value?.id || "user-1",
    academicYear: layoutStore.academicYear,
    schoolId: authUser.value?.schoolId || "sch-1",
  };
  if (editingPlan.value) {
    await update(planData);
    ElMessage.success("បានកែប្រែដោយជោគជ័យ!");
  } else {
    await add(planData);
    ElMessage.success("បានបង្កើតថ្មីដោយជោគជ័យ!");
  }
  formVisible.value = false;
  fetchPlans();
};

const onDelete = async (id: string) => {
  try {
    await ElMessageBox.confirm("តើអ្នកពិតជាចង់លុបមែនទេ?", "បញ្ជាក់", {
      type: "warning",
      confirmButtonText: "លុប",
      cancelButtonText: "បោះបង់",
    });
    await remove(id);
    ElMessage.success("បានលុបរួចរាល់");
    fetchPlans();
  } catch {}
};

const openPrint = (id: string) => {
  printingPlan.value = getById(id) || null;
  printVisible.value = true;
};

const handleDownloadDocx = async (plan: LessonPlan) => {
  try {
    await exportLessonPlanToDocx(plan);
    ElMessage.success("ទាញយកកិច្ចតែងការ (.docx) បានជោគជ័យ!");
  } catch (err) {
    console.error("Download docx error:", err);
    ElMessage.error("មានបញ្ហាក្នុងការបង្កើតឯកសារ .docx");
  }
};
</script>
