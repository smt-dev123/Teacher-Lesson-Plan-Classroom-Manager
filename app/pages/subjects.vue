<template>
  <div class="space-y-5">
    <!-- Header -->
    <div
      class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h3 class="text-lg font-bold text-slate-800 dark:text-white">
          គ្រប់គ្រងមុខវិជ្ជា (Subjects Management)
        </h3>
        <p class="text-sm text-slate-500">
          គ្រប់គ្រងមុខវិជ្ជាសិក្សា កូដសម្គាល់ និងកម្រិតថ្នាក់ក្នុងគ្រឹះស្ថានសិក្សា
        </p>
      </div>
      <el-button type="primary" @click="openCreateModal">
        <el-icon><Plus /></el-icon> បន្ថែមមុខវិជ្ជាថ្មី
      </el-button>
    </div>

    <!-- Stat Cards -->
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div
        class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
      >
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-slate-500">មុខវិជ្ជាសរុប</span>
          <div
            class="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-900/40"
          >
            <el-icon><Collection /></el-icon>
          </div>
        </div>
        <div class="mt-2 text-2xl font-bold text-slate-800 dark:text-white">
          {{ subjects.length }}
        </div>
      </div>

      <div
        class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
      >
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-slate-500">វិទ្យាសាស្ត្រពិត</span>
          <div
            class="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40"
          >
            <el-icon><Notebook /></el-icon>
          </div>
        </div>
        <div class="mt-2 text-2xl font-bold text-slate-800 dark:text-white">
          {{ scienceCount }}
        </div>
      </div>

      <div
        class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
      >
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-slate-500">សង្គម & ភាសា</span>
          <div
            class="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-900/40"
          >
            <el-icon><Reading /></el-icon>
          </div>
        </div>
        <div class="mt-2 text-2xl font-bold text-slate-800 dark:text-white">
          {{ socialCount }}
        </div>
      </div>

      <div
        class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
      >
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-slate-500">កម្រិតសិក្សា</span>
          <div
            class="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-900/40"
          >
            <el-icon><School /></el-icon>
          </div>
        </div>
        <div class="mt-2 text-sm font-bold text-slate-800 dark:text-white">
          ថ្នាក់ទី ៧ - ១២
        </div>
      </div>
    </div>

    <!-- Filter Bar -->
    <div
      class="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:flex-row sm:items-center sm:justify-between"
    >
      <div class="flex flex-1 flex-wrap items-center gap-2">
        <el-input
          v-model="searchQuery"
          placeholder="ស្វែងរកតាមឈ្មោះមុខវិជ្ជា ឬកូដ..."
          class="!w-64"
          clearable
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>

        <el-select
          v-model="gradeFilter"
          placeholder="កម្រិតថ្នាក់ទាំងអស់"
          class="!w-48"
          clearable
        >
          <el-option label="កម្រិតថ្នាក់ទាំងអស់" value="" />
          <el-option
            v-for="g in allGrades"
            :key="g"
            :label="g"
            :value="g"
          />
        </el-select>
      </div>

      <div class="flex items-center gap-2">
        <el-radio-group v-model="viewMode" size="small">
          <el-radio-button label="cards">កាត (Cards)</el-radio-button>
          <el-radio-button label="table">តារាង (Table)</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <!-- Cards View -->
    <div
      v-if="viewMode === 'cards'"
      class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      <div
        v-for="sub in filteredSubjects"
        :key="sub.id"
        class="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
      >
        <div>
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-2.5">
              <span
                class="h-3.5 w-3.5 rounded-full ring-2 ring-white dark:ring-slate-800"
                :style="{ backgroundColor: sub.color || '#0284c7' }"
              />
              <span
                v-if="sub.code"
                class="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300"
              >
                {{ sub.code }}
              </span>
            </div>

            <div class="flex items-center gap-1">
              <el-button
                text
                circle
                size="small"
                @click="openEditModal(sub)"
              >
                <el-icon><Edit /></el-icon>
              </el-button>
              <el-button
                text
                circle
                size="small"
                type="danger"
                @click="onDelete(sub.id)"
              >
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </div>

          <h4
            class="mt-3 text-base font-bold text-slate-800 dark:text-white"
          >
            {{ sub.name }}
          </h4>
          <p class="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
            {{ sub.description || "មុខវិជ្ជាសិក្សាគោលនៃកម្មវិធីអប់រំជាតិ" }}
          </p>

          <div class="mt-4 flex flex-wrap gap-1.5">
            <span
              v-for="g in (sub.grades || [])"
              :key="g"
              class="rounded-lg bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-900/60 dark:text-slate-300"
            >
              {{ g }}
            </span>
          </div>
        </div>

        <div
          class="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-400 dark:border-slate-700"
        >
          <span>⏱ {{ sub.totalHours || 60 }} ម៉ោង/ឆ្នាំ</span>
          <span class="text-sky-600 dark:text-sky-400 font-medium">សកម្ម</span>
        </div>
      </div>
    </div>

    <!-- Table View -->
    <div
      v-else
      class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
    >
      <el-table :data="filteredSubjects" stripe style="width: 100%">
        <el-table-column label="ពណ៌ & កូដ" width="130">
          <template #default="{ row }">
            <div class="flex items-center gap-2">
              <span
                class="h-3 w-3 rounded-full"
                :style="{ backgroundColor: row.color || '#0284c7' }"
              />
              <span class="font-bold text-xs text-slate-600 dark:text-slate-300">
                {{ row.code || "-" }}
              </span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="ឈ្មោះមុខវិជ្ជា" prop="name" min-width="160">
          <template #default="{ row }">
            <span class="font-bold text-slate-800 dark:text-white">
              {{ row.name }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="កម្រិតថ្នាក់ទទួលបន្ទុក" min-width="260">
          <template #default="{ row }">
            <div class="flex flex-wrap gap-1">
              <el-tag
                v-for="g in (row.grades || [])"
                :key="g"
                size="small"
                effect="plain"
              >
                {{ g }}
              </el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="ការពិពណ៌នា" prop="description" min-width="220" show-overflow-tooltip />

        <el-table-column label="ម៉ោងបង្រៀន" width="120" align="center">
          <template #default="{ row }">
            <span class="text-xs">{{ row.totalHours || 60 }} ម៉ោង</span>
          </template>
        </el-table-column>

        <el-table-column label="សកម្មភាព" width="110" align="center">
          <template #default="{ row }">
            <div class="flex items-center justify-center gap-1">
              <el-button text circle size="small" @click="openEditModal(row)">
                <el-icon><Edit /></el-icon>
              </el-button>
              <el-button
                text
                circle
                size="small"
                type="danger"
                @click="onDelete(row.id)"
              >
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- Create / Edit Dialog -->
    <el-dialog
      v-model="modalVisible"
      :title="isEdit ? 'កែប្រែព័ត៌មានមុខវិជ្ជា' : 'បន្ថែមមុខវិជ្ជាថ្មី'"
      width="min(560px, 94vw)"
      align-center
    >
      <el-form label-position="top" class="space-y-2">
        <el-row :gutter="12">
          <el-col :span="16">
            <el-form-item label="ឈ្មោះមុខវិជ្ជា (ខ្មែរ)" required>
              <el-input
                v-model="form.name"
                placeholder="ឧ. រូបវិទ្យា, គណិតវិទ្យា..."
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="កូដកាត់ (Code)">
              <el-input
                v-model="form.code"
                placeholder="ឧ. PHY, MATH..."
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="ពណ៌សម្គាល់ (Color)">
              <div class="flex items-center gap-2">
                <el-color-picker v-model="form.color" />
                <span class="text-xs font-mono text-slate-500">{{ form.color }}</span>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="ម៉ោងបង្រៀនសរុប/ឆ្នាំ">
              <el-input-number
                v-model="form.totalHours"
                :min="10"
                :max="300"
                :step="5"
                class="!w-full"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="កម្រិតថ្នាក់បង្រៀន">
          <el-select
            v-model="form.grades"
            multiple
            placeholder="ជ្រើសរើសថ្នាក់ដែលត្រូវបង្រៀន"
            class="w-full"
          >
            <el-option
              v-for="g in allGrades"
              :key="g"
              :label="g"
              :value="g"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="ការពិពណ៌នាសង្ខេប">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="បញ្ជាក់អំពីកម្មវិធីសិក្សា និងខ្លឹមសារទូទៅ..."
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="flex justify-end gap-2">
          <el-button @click="modalVisible = false">បោះបង់</el-button>
          <el-button type="primary" :loading="saving" @click="saveSubject">
            រក្សាទុក
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, onMounted } from "vue";
import {
  Plus,
  Search,
  Edit,
  Delete,
  Collection,
  Notebook,
  Reading,
  School,
} from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useSubjects, type SubjectItem } from "~/composables/useSubjects";

const { subjects, load, add, update, remove } = useSubjects();

onMounted(() => {
  load();
});

const searchQuery = ref("");
const gradeFilter = ref("");
const viewMode = ref<"cards" | "table">("cards");
const modalVisible = ref(false);
const isEdit = ref(false);
const saving = ref(false);

const allGrades = [
  "ថ្នាក់ទី៧",
  "ថ្នាក់ទី៨",
  "ថ្នាក់ទី៩",
  "ថ្នាក់ទី១០",
  "ថ្នាក់ទី១១",
  "ថ្នាក់ទី១២",
];

const form = reactive({
  id: "",
  name: "",
  code: "",
  color: "#0284c7",
  grades: [] as string[],
  totalHours: 60,
  description: "",
});

const scienceSubjects = ["រូបវិទ្យា", "គណិតវិទ្យា", "គីមីវិទ្យា", "ជីវវិទ្យា"];
const scienceCount = computed(
  () => subjects.value.filter((s) => scienceSubjects.includes(s.name)).length
);
const socialCount = computed(
  () => subjects.value.length - scienceCount.value
);

const filteredSubjects = computed(() => {
  return subjects.value.filter((s) => {
    const matchQuery =
      !searchQuery.value ||
      s.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (s.code && s.code.toLowerCase().includes(searchQuery.value.toLowerCase()));

    const matchGrade =
      !gradeFilter.value || (s.grades && s.grades.includes(gradeFilter.value));

    return matchQuery && matchGrade;
  });
});

const openCreateModal = () => {
  isEdit.value = false;
  Object.assign(form, {
    id: "",
    name: "",
    code: "",
    color: "#0284c7",
    grades: ["ថ្នាក់ទី៧", "ថ្នាក់ទី៨", "ថ្នាក់ទី៩", "ថ្នាក់ទី១០", "ថ្នាក់ទី១១", "ថ្នាក់ទី១២"],
    totalHours: 60,
    description: "",
  });
  modalVisible.value = true;
};

const openEditModal = (sub: SubjectItem) => {
  isEdit.value = true;
  Object.assign(form, {
    id: sub.id,
    name: sub.name,
    code: sub.code || "",
    color: sub.color || "#0284c7",
    grades: sub.grades || [],
    totalHours: sub.totalHours || 60,
    description: sub.description || "",
  });
  modalVisible.value = true;
};

const saveSubject = async () => {
  if (!form.name.trim()) {
    ElMessage.warning("សូមបំពេញឈ្មោះមុខវិជ្ជា");
    return;
  }

  saving.value = true;
  try {
    if (isEdit.value) {
      await update({
        id: form.id,
        name: form.name.trim(),
        code: form.code.trim().toUpperCase(),
        color: form.color,
        grades: form.grades,
        totalHours: form.totalHours,
        description: form.description.trim(),
      });
      ElMessage.success("បានកែប្រែមុខវិជ្ជាដោយជោគជ័យ");
    } else {
      await add({
        name: form.name.trim(),
        code: form.code.trim().toUpperCase(),
        color: form.color,
        grades: form.grades,
        totalHours: form.totalHours,
        description: form.description.trim(),
      });
      ElMessage.success("បានបន្ថែមមុខវិជ្ជាថ្មីដោយជោគជ័យ");
    }
    modalVisible.value = false;
  } catch (err) {
    ElMessage.error("មានបញ្ហាក្នុងការរក្សាទុកមុខវិជ្ជា");
  } finally {
    saving.value = false;
  }
};

const onDelete = (id: string) => {
  ElMessageBox.confirm(
    "តើអ្នកពិតជាចង់លុបមុខវិជ្ជានេះមែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។",
    "បញ្ជាក់ការលុប",
    {
      confirmButtonText: "លុប",
      cancelButtonText: "បោះបង់",
      type: "warning",
    }
  )
    .then(async () => {
      try {
        await remove(id);
        ElMessage.success("បានលុបមុខវិជ្ជាដោយជោគជ័យ");
      } catch {
        ElMessage.error("មានបញ្ហាក្នុងការលុប");
      }
    })
    .catch(() => {});
};
</script>
