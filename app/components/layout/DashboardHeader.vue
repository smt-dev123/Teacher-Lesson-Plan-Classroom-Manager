<template>
  <el-header
    height="64px"
    class="relative z-10 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-700 dark:bg-slate-800"
  >
    <div class="flex items-center gap-3">
      <el-icon
        class="cursor-pointer rounded-lg p-2 text-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
        @click="layoutStore.toggleSidebar()"
      >
        <Fold v-if="!layoutStore.isCollapse" />
        <Expand v-else />
      </el-icon>

      <div class="hidden md:block">
        <h2 class="text-base font-bold text-slate-800 dark:text-white">
          {{ pageTitle }}
        </h2>
        <p class="text-[11px] text-slate-500">{{ pageSubtitle }}</p>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <el-input
        v-model="search"
        placeholder="ស្វែងរក..."
        size="small"
        class="hidden !w-56 sm:block"
        clearable
        @input="onSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>

      <el-button type="primary" @click="emit('create')">
        <el-icon><Plus /></el-icon>
        <span class="ml-1 hidden sm:inline">បង្កើតកិច្ចតែងការថ្មី</span>
      </el-button>
    </div>
  </el-header>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { Fold, Expand, Search, Plus } from "@element-plus/icons-vue";
import { useLayoutStore } from "~/stores/layout";

const layoutStore = useLayoutStore();
const route = useRoute();
const emit = defineEmits<{ create: []; search: [string] }>();

const search = ref("");

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

const onSearch = (v: string) => emit("search", v);
</script>
