<template>
  <div
    class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
  >
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h3 class="text-base font-bold text-slate-800 dark:text-white">
          {{ exam.title }}
        </h3>
        <p class="text-[11px] text-slate-500">
          {{ exam.subject }} • {{ exam.grade }} • {{ exam.duration }} នាទី •
          {{ exam.totalPoints }} ពិន្ទុ
        </p>
      </div>
      <div class="flex flex-wrap gap-2">
        <el-button size="small" @click="$emit('reset')">
          <el-icon><Close /></el-icon> ចាកចេញ
        </el-button>
        <el-button size="small" type="success" plain @click="$emit('preview')">
          <el-icon><View /></el-icon> មើលជាមុន
        </el-button>
        <el-button size="small" type="primary" @click="$emit('save')">
          <el-icon><DocumentAdd /></el-icon> រក្សាទុក
        </el-button>
        <el-button size="small" type="primary" @click="$emit('add')">
          <el-icon><Plus /></el-icon> បន្ថែមសំណួរ
        </el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Close, View, DocumentAdd, Plus } from "@element-plus/icons-vue";
import type { Exam } from "~/types";

defineProps<{ exam: Exam }>();
defineEmits<{ reset: []; save: []; preview: []; add: [] }>();
</script>
