<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-bold text-slate-800 dark:text-white">
          ការកំណត់ប្រព័ន្ធ (Settings)
        </h3>
        <p class="text-sm text-slate-500">
          គ្រប់គ្រងព័ត៌មានសាលា គណនីគ្រូ និងជម្រើសកំណត់ទូទៅ
        </p>
      </div>
      <el-button type="primary" @click="saveAllSettings">
        <el-icon><Check /></el-icon> រក្សាទុកការកំណត់
      </el-button>
    </div>

    <div class="grid grid-cols-1 gap-5 lg:grid-cols-4">
      <!-- Settings Navigation -->
      <div class="lg:col-span-1">
        <div
          class="space-y-1 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-700 dark:bg-slate-800"
        >
          <button
            v-for="tab in tabs"
            :key="tab.id"
            type="button"
            class="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition"
            :class="
              activeTab === tab.id
                ? 'bg-sky-50 text-sky-600 dark:bg-sky-900/40 dark:text-sky-400'
                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50'
            "
            @click="activeTab = tab.id"
          >
            <el-icon :size="16"><component :is="tab.icon" /></el-icon>
            <span>{{ tab.label }}</span>
          </button>
        </div>
      </div>

      <!-- Settings Content Panels -->
      <div class="lg:col-span-3">
        <!-- Panel 1: School Info -->
        <div
          v-show="activeTab === 'school'"
          class="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
        >
          <div class="border-b border-slate-100 pb-3 dark:border-slate-700">
            <h4 class="text-sm font-bold text-slate-800 dark:text-white">
              ព័ត៌មានគ្រឹះស្ថានសិក្សា / សាលារៀន
            </h4>
            <p class="text-sm text-slate-400">
              ព័ត៌មាននេះនឹងបង្ហាញលើក្បាលកិច្ចតែងការ និងវិញ្ញាសាប្រឡង
            </p>
          </div>

          <el-form label-position="top" class="space-y-2">
            <el-row :gutter="16">
              <el-col :sm="16">
                <el-form-item label="ឈ្មោះសាលារៀន" required>
                  <el-input v-model="schoolForm.name" />
                </el-form-item>
              </el-col>
              <el-col :sm="8">
                <el-form-item label="កម្រិតសិក្សា">
                  <el-select v-model="schoolForm.level" class="w-full">
                    <el-option label="វិទ្យាល័យ" value="វិទ្យាល័យ" />
                    <el-option label="អនុវិទ្យាល័យ" value="អនុវិទ្យាល័យ" />
                    <el-option label="បឋមសិក្សា" value="បឋមសិក្សា" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="16">
              <el-col :sm="12">
                <el-form-item label="មន្ទីរអប់រំ រាជធានី/ខេត្ត">
                  <el-input v-model="schoolForm.province" />
                </el-form-item>
              </el-col>
              <el-col :sm="12">
                <el-form-item label="ការិយាល័យអប់រំ ក្រុង/ស្រុក/ខណ្ឌ">
                  <el-input v-model="schoolForm.district" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="16">
              <el-col :sm="12">
                <el-form-item label="លេខទូរស័ព្ទទំនាក់ទំនង">
                  <el-input v-model="schoolForm.phone" />
                </el-form-item>
              </el-col>
              <el-col :sm="12">
                <el-form-item label="អ៊ីមែលសាលា">
                  <el-input v-model="schoolForm.email" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="អាសយដ្ឋានសាលា">
              <el-input
                v-model="schoolForm.address"
                type="textarea"
                :rows="2"
              />
            </el-form-item>
          </el-form>
        </div>

        <!-- Panel 2: Profile Settings -->
        <div
          v-show="activeTab === 'profile'"
          class="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
        >
          <div class="border-b border-slate-100 pb-3 dark:border-slate-700">
            <h4 class="text-sm font-bold text-slate-800 dark:text-white">
              គណនី & ព័ត៌មានផ្ទាល់ខ្លួន
            </h4>
            <p class="text-sm text-slate-400">
              កែប្រែប្រវត្តិរូប និងព័ត៌មានបង្រៀនរបស់លោកគ្រូ/អ្នកគ្រូ
            </p>
          </div>

          <div class="flex items-center gap-4">
            <el-avatar
              :size="64"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces"
              class="ring-4 ring-sky-500/20"
            />
            <div>
              <el-button>ប្តូររូបថត</el-button>
              <p class="mt-1 text-sm text-slate-400">
                JPG, PNG ទំហំអតិបរមា 2MB
              </p>
            </div>
          </div>

          <el-form label-position="top" class="space-y-2">
            <el-row :gutter="16">
              <el-col :sm="12">
                <el-form-item label="គោត្តនាម & នាម" required>
                  <el-input v-model="profileForm.name" />
                </el-form-item>
              </el-col>
              <el-col :sm="12">
                <el-form-item label="អ៊ីមែល" required>
                  <el-input v-model="profileForm.email" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="16">
              <el-col :sm="12">
                <el-form-item label="មុខវិជ្ជាឯកទេស">
                  <el-input v-model="profileForm.subject" />
                </el-form-item>
              </el-col>
              <el-col :sm="12">
                <el-form-item label="លេខទូរស័ព្ទ">
                  <el-input v-model="profileForm.phone" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="ជីវប្រវត្តិសង្ខេប / ចំណាំ">
              <el-input v-model="profileForm.bio" type="textarea" :rows="2" />
            </el-form-item>
          </el-form>
        </div>

        <!-- Panel 3: Appearance & System -->
        <div
          v-show="activeTab === 'appearance'"
          class="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
        >
          <div class="border-b border-slate-100 pb-3 dark:border-slate-700">
            <h4 class="text-sm font-bold text-slate-800 dark:text-white">
              ការកំណត់រូបរាង & ប្រព័ន្ធ
            </h4>
            <p class="text-sm text-slate-400">
              កំណត់រូបរាង Theme ភាសា និងជម្រើសបង្ហាញទូទៅ
            </p>
          </div>

          <div class="space-y-3">
            <div
              class="flex items-center justify-between rounded-xl bg-slate-50 p-3.5 dark:bg-slate-900/40"
            >
              <div>
                <div class="text-sm font-bold text-slate-800 dark:text-white">
                  របៀបងងឹត (Dark Mode)
                </div>
                <div class="text-sm text-slate-500">
                  ប្តូរផ្ទៃបង្ហាញទៅជារបៀបងងឹត ដើម្បីកាត់បន្ថយការចាំងភ្នែក
                </div>
              </div>
              <el-switch
                :model-value="layoutStore.isDark"
                active-text="ងងឹត"
                inactive-text="ពន្លឺ"
                inline-prompt
                @change="layoutStore.toggleDark()"
              />
            </div>

            <div
              class="flex items-center justify-between rounded-xl bg-slate-50 p-3.5 dark:bg-slate-900/40"
            >
              <div>
                <div class="text-sm font-bold text-slate-800 dark:text-white">
                  របារចំហៀង Sidebar
                </div>
                <div class="text-sm text-slate-500">
                  បង្រួម ឬពង្រីករបារចំហៀងខាងឆ្វេង
                </div>
              </div>
              <el-switch
                :model-value="layoutStore.isCollapse"
                active-text="បង្រួម"
                inactive-text="ពង្រីក"
                inline-prompt
                @change="layoutStore.toggleSidebar()"
              />
            </div>

            <div
              class="flex items-center justify-between rounded-xl bg-slate-50 p-3.5 dark:bg-slate-900/40"
            >
              <div>
                <div class="text-sm font-bold text-slate-800 dark:text-white">
                  ភាសាប្រព័ន្ធ (Language)
                </div>
                <div class="text-sm text-slate-500">
                  ជ្រើសរើសភាសាដែលត្រូវប្រើក្នុងកម្មវិធី
                </div>
              </div>
              <el-select
                :model-value="layoutStore.locale"
                class="!w-44"
                @change="layoutStore.setLocale($event)"
              >
                <el-option
                  v-for="loc in layoutStore.locales"
                  :key="loc.code"
                  :label="`${loc.flag} ${loc.label}`"
                  :value="loc.code"
                />
              </el-select>
            </div>

            <div
              class="flex items-center justify-between rounded-xl bg-slate-50 p-3.5 dark:bg-slate-900/40"
            >
              <div>
                <div class="text-sm font-bold text-slate-800 dark:text-white">
                  ឆ្នាំសិក្សាដើម (Default Academic Year)
                </div>
                <div class="text-sm text-slate-500">
                  កំណត់ឆ្នាំសិក្សាសកម្មជាស្វ័យប្រវត្តិ
                </div>
              </div>
              <el-select
                :model-value="layoutStore.academicYear"
                class="!w-44"
                @change="layoutStore.setAcademicYear($event)"
              >
                <el-option
                  v-for="y in layoutStore.academicYears"
                  :key="y.value"
                  :label="y.label"
                  :value="y.value"
                />
              </el-select>
            </div>
          </div>
        </div>

        <!-- Panel 4: Backup & Data -->
        <div
          v-show="activeTab === 'backup'"
          class="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
        >
          <div class="border-b border-slate-100 pb-3 dark:border-slate-700">
            <h4 class="text-sm font-bold text-slate-800 dark:text-white">
              ការបម្រុងទុក & ទិន្នន័យ (Backup & Data)
            </h4>
            <p class="text-sm text-slate-400">
              ទាញយកឯកសារបម្រុងទុក និងនាំចេញទិន្នន័យកិច្ចតែងការ
            </p>
          </div>

          <div class="space-y-3">
            <div
              class="flex items-center justify-between rounded-xl border border-slate-200 p-3.5 dark:border-slate-700"
            >
              <div>
                <h5 class="text-sm font-bold text-slate-800 dark:text-white">
                  ទាញយកទិន្នន័យកិច្ចតែងការ (Export Lesson Plans)
                </h5>
                <p class="text-sm text-slate-400">
                  ទាញយកកិច្ចតែងការទាំងអស់ជាទម្រង់ JSON Backup
                </p>
              </div>
              <el-button type="primary" @click="exportData('plans')">
                <el-icon><Download /></el-icon> នាំចេញ JSON
              </el-button>
            </div>

            <div
              class="flex items-center justify-between rounded-xl border border-slate-200 p-3.5 dark:border-slate-700"
            >
              <div>
                <h5 class="text-sm font-bold text-slate-800 dark:text-white">
                  ទាញយកធនាគារសំណួរ (Export Question Bank)
                </h5>
                <p class="text-sm text-slate-400">
                  ទាញយកកម្រងសំណួរ និងចម្លើយទាំងអស់
                </p>
              </div>
              <el-button type="primary" @click="exportData('questions')">
                <el-icon><Download /></el-icon> នាំចេញ JSON
              </el-button>
            </div>

            <div
              class="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50/40 p-3.5 dark:border-rose-900/40 dark:bg-rose-950/20"
            >
              <div>
                <h5 class="text-sm font-bold text-rose-700 dark:text-rose-400">
                  កំណត់ទិន្នន័យប្រព័ន្ធឡើងវិញ (Reset Demo Data)
                </h5>
                <p class="text-sm text-rose-500/80">
                  លុបទិន្នន័យកែប្រែ ហើយកំណត់មកទិន្នន័យគំរូដើម
                </p>
              </div>
              <el-button type="danger" @click="resetDemoData">
                <el-icon><RefreshLeft /></el-icon> កំណត់ឡើងវិញ
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import {
  School,
  User,
  Setting,
  FolderOpened,
  Check,
  Download,
  RefreshLeft,
} from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useLayoutStore } from "~/stores/layout";

const layoutStore = useLayoutStore();

const activeTab = ref("school");
const schoolId = ref("sch-1");

const tabs = [
  { id: "school", label: "ព័ត៌មានសាលារៀន", icon: School },
  { id: "profile", label: "គណនី & ប្រវត្តិរូប", icon: User },
  { id: "appearance", label: "រូបរាង & ប្រព័ន្ធ", icon: Setting },
  { id: "backup", label: "បម្រុងទុក & ទិន្នន័យ", icon: FolderOpened },
];

const schoolForm = reactive({
  name: "វិទ្យាល័យ ហ៊ុន សែន មិត្តភាព",
  level: "វិទ្យាល័យ",
  province: "រាជធានីភ្នំពេញ",
  district: "ខណ្ឌ៧មករា",
  phone: "023 880 990",
  email: "info@mittapheap.edu.kh",
  address: "រាជធានីភ្នំពេញ",
});

const profileForm = reactive({
  name: "លោកគ្រូ លុយ សុមាត្រា",
  email: "teacher@school.edu.kh",
  phone: "+855 12 345 678",
  subject: "រូបវិទ្យា & គណិតវិទ្យា",
  bio: "គ្រូបង្រៀនកម្រិតវិទ្យាល័យ បទពិសោធន៍បង្រៀន ៨ ឆ្នាំ ផ្នែករូបវិទ្យា",
});

const loadSchoolData = async () => {
  try {
    const res = await $fetch<{ success: boolean; data: any }>("/api/schools");
    if (res?.data) {
      schoolId.value = res.data.id || "sch-1";
      Object.assign(schoolForm, {
        name: res.data.name || schoolForm.name,
        level: res.data.level || schoolForm.level,
        province: res.data.province || schoolForm.province,
        district: res.data.district || schoolForm.district,
        phone: res.data.phone || schoolForm.phone,
        email: res.data.email || schoolForm.email,
        address: res.data.district ? `${res.data.district}, ${res.data.province}` : schoolForm.address,
      });
    }
  } catch (err) {
    console.error("Failed to load school data:", err);
  }
};

onMounted(() => {
  loadSchoolData();
});

const saveAllSettings = async () => {
  try {
    await $fetch(`/api/schools/${schoolId.value}`, {
      method: "PUT",
      body: {
        name: schoolForm.name,
        level: schoolForm.level,
        province: schoolForm.province,
        district: schoolForm.district,
        phone: schoolForm.phone,
        email: schoolForm.email,
      },
    });
    ElMessage.success("បានរក្សាទុកព័ត៌មានសាលារៀន និងការកំណត់ដោយជោគជ័យ!");
  } catch (err) {
    console.error("Save settings error:", err);
    ElMessage.error("មានបញ្ហាក្នុងការរក្សាទុកការកំណត់");
  }
};

const exportData = (type: string) => {
  ElMessage.success(
    `កំពុងរៀបចំ និងទាញយកទិន្នន័យ ${type === "plans" ? "កិច្ចតែងការ" : "ធនាគារសំណួរ"}...`,
  );
};

const resetDemoData = () => {
  ElMessageBox.confirm(
    "តើអ្នកពិតជាចង់កំណត់ទិន្នន័យឡើងវិញមែនទេ? សកម្មភាពនេះនឹងសម្អាតទិន្នន័យបណ្តោះអាសន្ន។",
    "បញ្ជាក់",
    {
      confirmButtonText: "កំណត់ឡើងវិញ",
      cancelButtonText: "បោះបង់",
      type: "warning",
    },
  )
    .then(() => {
      ElMessage.success("បានកំណត់ទិន្នន័យគំរូឡើងវិញជោគជ័យ!");
    })
    .catch(() => {});
};
</script>
