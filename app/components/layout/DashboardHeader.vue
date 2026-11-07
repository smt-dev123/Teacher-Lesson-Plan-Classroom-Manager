<template>
  <el-header
    height="64px"
    class="relative z-10 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-700 dark:bg-slate-800"
  >
    <!-- Left: Collapse / Expand toggle + Page title -->
    <div class="flex items-center gap-3">
      <el-tooltip
        :content="layoutStore.isCollapse ? 'ពង្រីករបារចំហៀង (Expand)' : 'បង្រួមរបារចំហៀង (Collapse)'"
        placement="bottom"
      >
        <button
          type="button"
          class="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-sky-600 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-sky-400"
          @click="layoutStore.toggleSidebar()"
        >
          <el-icon :size="20">
            <Expand v-if="layoutStore.isCollapse" />
            <Fold v-else />
          </el-icon>
        </button>
      </el-tooltip>

      <div class="hidden md:block">
        <h2 class="text-base font-bold text-slate-800 dark:text-white">
          {{ pageTitle }}
        </h2>
        <p class="text-[11px] text-slate-500">{{ pageSubtitle }}</p>
      </div>
    </div>

    <!-- Right: Lang switch + Maximize + DarkMode + Notification -->
    <div class="flex items-center gap-2">
      <!-- Language Switcher -->
      <el-dropdown trigger="click" @command="onLanguageChange">
        <button
          type="button"
          class="flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-sky-400"
        >
          <span class="text-sm">{{ layoutStore.currentLocaleItem.flag }}</span>
          <span>{{ layoutStore.currentLocaleItem.short }}</span>
          <el-icon :size="12" class="text-slate-400"><ArrowDown /></el-icon>
        </button>
        <template #dropdown>
          <el-dropdown-menu class="min-w-[150px]">
            <el-dropdown-item
              v-for="item in layoutStore.locales"
              :key="item.code"
              :command="item.code"
              :class="{ '!text-sky-600 font-bold': layoutStore.locale === item.code }"
            >
              <div class="flex items-center gap-2">
                <span class="text-base">{{ item.flag }}</span>
                <span>{{ item.label }}</span>
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <!-- Maximize / FullScreen Toggle -->
      <el-tooltip
        :content="isFullscreen ? 'បង្រួមអេក្រង់' : 'ពង្រីកពេញអេក្រង់ (Maximize)'"
        placement="bottom"
      >
        <button
          type="button"
          class="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-sky-600 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-sky-400"
          @click="toggleFullscreen"
        >
          <el-icon :size="18">
            <ScaleToOriginal v-if="isFullscreen" />
            <FullScreen v-else />
          </el-icon>
        </button>
      </el-tooltip>

      <!-- Dark Mode Toggle -->
      <el-tooltip
        :content="layoutStore.isDark ? 'ប្តូរទៅរបៀបពន្លឺ (Light)' : 'ប្តូរទៅរបៀបងងឹត (Dark)'"
        placement="bottom"
      >
        <button
          type="button"
          class="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-amber-500 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-amber-400"
          @click="layoutStore.toggleDark()"
        >
          <el-icon :size="18">
            <Sunny v-if="layoutStore.isDark" />
            <Moon v-else />
          </el-icon>
        </button>
      </el-tooltip>

      <!-- Notifications -->
      <el-tooltip content="ការជូនដំណឹង" placement="bottom">
        <button
          type="button"
          class="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-sky-600 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-sky-400"
          @click="onNotificationClick"
        >
          <el-icon :size="18"><Bell /></el-icon>
          <span
            class="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-800"
          />
        </button>
      </el-tooltip>
    </div>
  </el-header>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import {
  Fold,
  Expand,
  FullScreen,
  ScaleToOriginal,
  Sunny,
  Moon,
  Bell,
  ArrowDown,
} from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { useLayoutStore } from "~/stores/layout";

const layoutStore = useLayoutStore();
const route = useRoute();

const isFullscreen = ref(false);

const titleMap: Record<string, [string, string]> = {
  "/": ["ផ្ទាំងគ្រប់គ្រងទូទៅ", "ស្វាគមន៍មកកាន់ប្រព័ន្ធរៀបចំការបង្រៀន"],
  "/lesson-plans": ["កិច្ចតែងការបង្រៀន", "កិច្ចតែងការតាមស្តង់ដារ ៥ ជំហាន"],
  "/question-bank": ["ធនាគារសំណួរ", "គ្រប់គ្រងសំណួរតាមមុខវិជ្ជា & កម្រិត"],
  "/exam-builder": ["បង្កើតវិញ្ញាសា", "រៀបចំវិញ្ញាសាប្រឡងពីធនាគារ"],
  "/lessons": ["មេរៀន & កិច្ចការសិស្ស", "តាមដានស្ថានភាពប្រគល់កិច្ចការ"],
  "/timetable": ["កាលវិភាគបង្រៀន", "តារាងម៉ោងបង្រៀនប្រចាំសប្តាហ៍"],
  "/resources": ["ឃ្លាំងឯកសារ", "រក្សាទុកស្លាយ និងឯកសារជំនួយ"],
};

const pageTitle = computed(() => titleMap[route.path]?.[0] || "");
const pageSubtitle = computed(() => titleMap[route.path]?.[1] || "");

const onLanguageChange = (code: string) => {
  layoutStore.setLocale(code);
  ElMessage.success(
    code === "km" ? "បានប្តូរទៅភាសាខ្មែរ (🇰🇭)" : "Switched to English (🇬🇧)",
  );
};

const toggleFullscreen = () => {
  if (!import.meta.client) return;
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch((err) => {
      console.warn("Fullscreen error:", err);
    });
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch((err) => {
        console.warn("Exit fullscreen error:", err);
      });
    }
  }
};

const updateFullscreenState = () => {
  if (import.meta.client) {
    isFullscreen.value = !!document.fullscreenElement;
  }
};

onMounted(() => {
  if (import.meta.client) {
    document.addEventListener("fullscreenchange", updateFullscreenState);
    layoutStore.initLocale();
  }
});

onUnmounted(() => {
  if (import.meta.client) {
    document.removeEventListener("fullscreenchange", updateFullscreenState);
  }
});

const onNotificationClick = () => {
  ElMessage.info("ពុំទាន់មានការជូនដំណឹងថ្មីទេ");
};
</script>
