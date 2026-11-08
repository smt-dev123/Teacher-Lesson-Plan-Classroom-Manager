<template>
  <aside
    class="flex h-full w-full flex-col overflow-hidden border-r border-slate-200 bg-white transition-[width] duration-300 dark:border-slate-700 dark:bg-slate-800"
  >
    <!-- ================= LOGO ================= -->
    <div
      class="flex h-16 shrink-0 items-center gap-2.5 border-b border-slate-200 dark:border-slate-700"
      :class="layoutStore.isCollapse ? 'justify-center px-0' : 'px-4'"
    >
      <div
        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-600 to-sky-700 text-white shadow-lg shadow-sky-500/30"
      >
        <el-icon :size="22"><School /></el-icon>
      </div>
      <div v-show="!layoutStore.isCollapse" class="min-w-0 leading-tight">
        <div class="truncate text-sm font-bold text-slate-800 dark:text-white">
          កិច្ចតែងការគ្រូ
        </div>
        <div
          class="truncate text-[12px] font-medium text-sky-600 dark:text-sky-400"
        >
          ប្រព័ន្ធគរុកោសល្យខ្មែរ
        </div>
      </div>
    </div>

    <!-- ================= ACADEMIC YEAR ================= -->
    <div
      v-show="!layoutStore.isCollapse"
      class="shrink-0 border-b border-slate-200 px-3 py-2.5 dark:border-slate-700"
    >
      <el-select
        :model-value="layoutStore.academicYear"
        class="w-full academic-year-select"
        @update:model-value="onAcademicYearChange"
      >
        <template #prefix>
          <el-icon><Calendar /></el-icon>
        </template>
        <el-option
          v-for="y in layoutStore.academicYears"
          :key="y.value"
          :label="y.label"
          :value="y.value"
        />
      </el-select>
    </div>

    <!-- ================= MENU ================= -->
    <el-scrollbar class="min-h-0 flex-1">
      <el-menu
        :default-active="route.path"
        :collapse="layoutStore.isCollapse"
        :collapse-transition="false"
        router
        class="py-2"
      >
        <el-menu-item v-for="nav in navItems" :key="nav.path" :index="nav.path">
          <el-icon><component :is="nav.icon" /></el-icon>
          <template #title>{{ nav.label }}</template>
        </el-menu-item>
      </el-menu>
    </el-scrollbar>

    <!-- ================= SETTING & PROFILE ================= -->
    <div class="shrink-0 border-t border-slate-200 p-2.5 dark:border-slate-700">
      <el-dropdown
        trigger="click"
        placement="top"
        class="w-full"
        @command="handleUserCommand"
      >
        <div
          class="flex w-full cursor-pointer items-center gap-2.5 rounded-xl p-2 transition hover:bg-slate-100 dark:hover:bg-slate-700/60"
          :class="
            layoutStore.isCollapse
              ? 'justify-center px-0'
              : 'bg-slate-50 dark:bg-slate-700/40'
          "
        >
          <el-avatar
            :size="36"
            :src="
              authUser?.avatar ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces'
            "
            class="shrink-0 ring-2 ring-sky-500/30"
          />
          <div
            v-show="!layoutStore.isCollapse"
            class="min-w-0 flex-1 text-left"
          >
            <h4
              class="truncate text-xs font-bold text-slate-800 dark:text-white"
            >
              {{ authUser?.name || "លោកគ្រូ សុខ ចាន់ថន" }}
            </h4>
            <p class="truncate text-[10px] text-slate-500">
              {{ authUser?.role || "គ្រូបង្រៀន" }} • {{ authUser?.subject || "ទូទៅ" }}
            </p>
          </div>
          <el-icon
            v-show="!layoutStore.isCollapse"
            class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <Setting />
          </el-icon>
        </div>

        <template #dropdown>
          <el-dropdown-menu class="min-w-[200px]">
            <div
              class="border-b border-slate-100 px-3 py-2 dark:border-slate-700"
            >
              <p class="text-xs font-bold text-slate-800 dark:text-white">
                {{ authUser?.name || "លោកគ្រូ សុខ ចាន់ថន" }}
              </p>
              <p class="text-xs text-slate-400">
                {{ authUser?.email || "teacher@school.edu.kh" }}
              </p>
            </div>
            <el-dropdown-item command="profile">
              <el-icon><User /></el-icon>
              <span>ព័ត៌មានផ្ទាល់ខ្លួន (Profile)</span>
            </el-dropdown-item>
            <el-dropdown-item command="settings">
              <el-icon><Setting /></el-icon>
              <span>ការកំណត់ (Settings)</span>
            </el-dropdown-item>
            <el-dropdown-item divided command="logout" class="!text-rose-500">
              <el-icon><SwitchButton /></el-icon>
              <span>ចាកចេញ (Logout)</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <!-- Dialog: Profile Details -->
    <el-dialog
      v-model="profileDialogVisible"
      title="ព័ត៌មានផ្ទាល់ខ្លួន (Teacher Profile)"
      width="min(500px, 92vw)"
      align-center
    >
      <div class="flex flex-col items-center gap-3 text-center">
        <el-avatar
          :size="72"
          :src="
            authUser?.avatar ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces'
          "
          class="ring-4 ring-sky-500/20"
        />
        <div>
          <h3 class="text-base font-bold text-slate-800 dark:text-white">
            {{ authUser?.name || "លោកគ្រូ សុខ ចាន់ថន" }}
          </h3>
          <p class="text-[12px] text-sky-600 dark:text-sky-400">
            {{ authUser?.role || "គ្រូបង្រៀន" }} ({{ authUser?.subject || "ទូទៅ" }})
          </p>
        </div>
      </div>

      <div
        class="mt-5 space-y-2.5 rounded-xl bg-slate-50 p-3 text-xs dark:bg-slate-800/60"
      >
        <div
          class="flex justify-between border-b border-slate-200/60 pb-2 dark:border-slate-700"
        >
          <span class="text-slate-500">អ៊ីមែល៖</span>
          <span class="font-semibold text-slate-700 dark:text-slate-300">
            {{ authUser?.email || "teacher@school.edu.kh" }}
          </span>
        </div>
        <div
          class="flex justify-between border-b border-slate-200/60 pb-2 dark:border-slate-700"
        >
          <span class="text-slate-500">លេខទូរស័ព្ទ៖</span>
          <span class="font-semibold text-slate-700 dark:text-slate-300">
            {{ authUser?.phone || "មិនទាន់បញ្ជាក់" }}
          </span>
        </div>
        <div
          class="flex justify-between border-b border-slate-200/60 pb-2 dark:border-slate-700"
        >
          <span class="text-slate-500">ថ្នាក់ទទួលបន្ទុក៖</span>
          <span class="font-semibold text-slate-700 dark:text-slate-300"
            >ថ្នាក់ទី១០A, ១១B, ១២A</span
          >
        </div>
        <div class="flex justify-between">
          <span class="text-slate-500">ឆ្នាំសិក្សា៖</span>
          <span class="font-semibold text-sky-600 dark:text-sky-400">{{
            layoutStore.currentAcademicYearLabel
          }}</span>
        </div>
      </div>

      <template #footer>
        <el-button type="primary" @click="profileDialogVisible = false"
          >យល់ព្រម</el-button
        >
      </template>
    </el-dialog>

    <!-- Dialog: Settings -->
    <el-dialog
      v-model="settingsDialogVisible"
      title="ការកំណត់ប្រព័ន្ធ (System Settings)"
      width="min(480px, 92vw)"
      align-center
    >
      <div class="space-y-4">
        <div
          class="flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60"
        >
          <div>
            <div class="text-xs font-bold text-slate-800 dark:text-white">
              របៀបពន្លឺ/ងងឹត (Theme)
            </div>
            <div class="text-[11px] text-slate-500">
              ជ្រើសរើសរូបរាង Dark Mode ឬ Light Mode
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
          class="flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60"
        >
          <div>
            <div class="text-xs font-bold text-slate-800 dark:text-white">
              ទំហំ Sidebar
            </div>
            <div class="text-[11px] text-slate-500">
              បង្រួម ឬពង្រីករបារចំហៀង
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
      </div>

      <template #footer>
        <el-button type="primary" @click="settingsDialogVisible = false"
          >បិទ</el-button
        >
      </template>
    </el-dialog>
  </aside>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import {
  School,
  DataBoard,
  Reading,
  List,
  Files,
  EditPen,
  Calendar,
  Folder,
  Setting,
  User,
  UserFilled,
  SwitchButton,
  Collection,
} from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { useLayoutStore } from "~/stores/layout";
import { useAuth } from "~/composables/useAuth";

const layoutStore = useLayoutStore();
const { user: authUser, logout } = useAuth();
const route = useRoute();

const profileDialogVisible = ref(false);
const settingsDialogVisible = ref(false);

const navItems = [
  { path: "/", label: "ផ្ទាំងគ្រប់គ្រង", icon: DataBoard },
  { path: "/lesson-plans", label: "កិច្ចតែងការបង្រៀន", icon: Reading },
  { path: "/subjects", label: "មុខវិជ្ជា", icon: Collection },
  { path: "/lessons", label: "មេរៀន & កិច្ចការ", icon: List },
  { path: "/question-bank", label: "បណ្ដុំសំណួរ", icon: Files },
  { path: "/exam-builder", label: "បង្កើតវិញ្ញាសា", icon: EditPen },
  { path: "/timetable", label: "កាលវិភាគបង្រៀន", icon: Calendar },
  { path: "/resources", label: "ឃ្លាំងឯកសារ", icon: Folder },
  { path: "/users", label: "អ្នកប្រើប្រាស់", icon: UserFilled },
  { path: "/settings", label: "ការកំណត់", icon: Setting },
];

const onAcademicYearChange = (v: string) => {
  layoutStore.setAcademicYear(v);
  const label = layoutStore.currentAcademicYearLabel;
  ElMessage.success(`បានប្តូរទៅឆ្នាំសិក្សា ${label}`);
};

const handleUserCommand = async (cmd: string) => {
  if (cmd === "profile") {
    profileDialogVisible.value = true;
  } else if (cmd === "settings") {
    settingsDialogVisible.value = true;
  } else if (cmd === "logout") {
    await logout();
    ElMessage.success("បានចាកចេញពីប្រព័ន្ធដោយជោគជ័យ");
  }
};
</script>

<style scoped>
.academic-year-select :deep(.el-select__wrapper) {
  border-radius: 10px;
  background-color: #f8fafc;
  box-shadow: none;
  border: 1px solid #e2e8f0;
  font-size: 12px;
  font-weight: 600;
  color: #334155;
}

.academic-year-select :deep(.el-select__wrapper:hover) {
  border-color: #cbd5e1;
}

.academic-year-select :deep(.el-select__wrapper.is-focused) {
  border-color: #0ea5e9;
  box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.15);
}

:global(.dark) .academic-year-select :deep(.el-select__wrapper) {
  background-color: rgba(51, 65, 85, 0.4);
  border-color: #475569;
  color: #e2e8f0;
}
</style>
