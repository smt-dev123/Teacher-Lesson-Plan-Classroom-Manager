<template>
  <div
    class="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
  >
    <div>
      <p class="text-md font-medium text-slate-500">{{ label }}</p>
      <h3 class="mt-1 text-2xl font-bold text-slate-800 dark:text-white">
        {{ value }}
      </h3>
      <span class="mt-1 block text-sm font-medium" :class="textClass">{{
        subtitle
      }}</span>
    </div>
    <div
      class="flex h-12 w-12 items-center justify-center rounded-xl"
      :class="bgClass"
    >
      <el-icon :size="22" :class="iconClass">
        <component :is="iconMap[icon]" />
      </el-icon>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { Document, Reading, EditPen, Timer } from "@element-plus/icons-vue";

const props = defineProps<{
  label: string;
  value: number | string;
  subtitle: string;
  icon: string;
  color: "sky" | "indigo" | "amber" | "emerald";
}>();

const iconMap: Record<string, any> = { Document, Reading, EditPen, Timer };

const bgClass = computed(
  () =>
    ({
      sky: "bg-sky-50 dark:bg-sky-900/30",
      indigo: "bg-indigo-50 dark:bg-indigo-900/30",
      amber: "bg-amber-50 dark:bg-amber-900/30",
      emerald: "bg-emerald-50 dark:bg-emerald-900/30",
    })[props.color],
);

const iconClass = computed(
  () =>
    ({
      sky: "text-sky-600 dark:text-sky-400",
      indigo: "text-indigo-600 dark:text-indigo-400",
      amber: "text-amber-600 dark:text-amber-400",
      emerald: "text-emerald-600 dark:text-emerald-400",
    })[props.color],
);

const textClass = computed(
  () =>
    ({
      sky: "text-sky-600",
      indigo: "text-indigo-600",
      amber: "text-amber-600",
      emerald: "text-emerald-600",
    })[props.color],
);
</script>
