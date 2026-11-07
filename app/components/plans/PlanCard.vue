<template>
  <div
    class="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
  >
    <div>
      <div class="flex items-start justify-between">
        <el-tag type="primary" effect="light" size="small">{{
          plan.grade
        }}</el-tag>
        <span class="text-sm text-slate-400">⏱ {{ plan.duration }}</span>
      </div>
      <h4
        class="mt-3 truncate text-sm font-bold text-slate-800 dark:text-white"
      >
        {{ plan.topic }}
      </h4>
      <p class="mt-0.5 text-sm font-medium text-sky-600 dark:text-sky-400">
        {{ plan.subject }} • {{ plan.chapter }}
      </p>

      <div
        class="mt-3 rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300"
      >
        <p class="line-clamp-2">
          <strong class="text-slate-800 dark:text-white">វត្ថុបំណង៖</strong>
          {{ plan.objKnowledge }}
        </p>
      </div>
    </div>

    <div
      class="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-700"
    >
      <span class="text-sm text-slate-400">{{ plan.date }}</span>
      <div class="flex gap-1">
        <el-button text circle size="small" @click="$emit('edit', plan.id)">
          <el-icon><EditPen /></el-icon>
        </el-button>
        <el-button text circle size="small" @click="$emit('delete', plan.id)">
          <el-icon><Delete /></el-icon>
        </el-button>
        <el-button type="primary" size="small" @click="$emit('view', plan.id)">
          <el-icon class="mr-1"><View /></el-icon> មើល
        </el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { EditPen, Delete, View } from "@element-plus/icons-vue";
import type { LessonPlan } from "~/types";

defineProps<{ plan: LessonPlan }>();
defineEmits<{ edit: [string]; delete: [string]; view: [string] }>();
</script>
