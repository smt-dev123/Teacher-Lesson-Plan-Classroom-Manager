<template>
  <aside
    class="flex h-full w-full flex-col overflow-hidden border-r border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 transition-[width] duration-300"
  >
    <!-- Logo -->
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
          class="truncate text-[10px] font-medium text-sky-600 dark:text-sky-400"
        >
          ប្រព័ន្ធគរុកោសល្យខ្មែរ
        </div>
      </div>
    </div>

    <!-- Menu -->
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

    <!-- User + Dark Mode -->
    <div class="shrink-0 border-t border-slate-200 p-3 dark:border-slate-700">
      <div
        class="flex items-center gap-2.5 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-700/40"
        :class="layoutStore.isCollapse ? 'justify-center' : ''"
      >
        <el-avatar
          :size="34"
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"
          class="ring-2 ring-sky-500/30"
        />
        <div v-show="!layoutStore.isCollapse" class="min-w-0 flex-1">
          <h4 class="truncate text-xs font-bold text-slate-800 dark:text-white">
            លោកគ្រូ លុយ សុមាត្រា
          </h4>
          <p class="truncate text-[10px] text-slate-500">
            គ្រូបង្រៀនកម្រិតវិទ្យាល័យ
          </p>
        </div>
        <el-button
          v-show="!layoutStore.isCollapse"
          circle
          size="small"
          @click="layoutStore.toggleDark()"
        >
          <el-icon>
            <Sunny v-if="layoutStore.isDark" />
            <Moon v-else />
          </el-icon>
        </el-button>
      </div>
    </div>
  </aside>
</template>

<script lang="ts" setup>
import {
  School,
  DataBoard,
  Reading,
  List,
  Calendar,
  Folder,
  Sunny,
  Moon,
  Files,
  EditPen,
} from "@element-plus/icons-vue";
import { useLayoutStore } from "~/stores/layout";

const layoutStore = useLayoutStore();
const route = useRoute();

const navItems = [
  { path: "/", label: "ផ្ទាំងគ្រប់គ្រង", icon: DataBoard },
  { path: "/lesson-plans", label: "កិច្ចតែងការបង្រៀន", icon: Reading },
  { path: "/lessons", label: "មេរៀន & កិច្ចការ", icon: List },
  { path: "/question-bank", label: "ធនាគារសំណួរ", icon: Files },
  { path: "/exam-builder", label: "បង្កើតវិញ្ញាសា", icon: EditPen },
  { path: "/timetable", label: "កាលវិភាគបង្រៀន", icon: Calendar },
  { path: "/resources", label: "ឃ្លាំងឯកសារ", icon: Folder },
];
</script>
