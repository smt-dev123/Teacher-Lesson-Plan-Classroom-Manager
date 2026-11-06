<template>
  <div class="space-y-5">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-bold text-slate-800 dark:text-white">
          ឃ្លាំងឯកសារបង្រៀន
        </h3>
        <p class="text-xs text-slate-500">
          ឯកសារជំនួយ សៀវភៅគោល និងសន្លឹកកិច្ចការ
        </p>
      </div>
      <el-button
        type="primary"
        @click="ElMessage.success('បានបន្ថែមឯកសារថ្មី!')"
      >
        <el-icon><Upload /></el-icon> បញ្ចូលឯកសារ
      </el-button>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="res in resources"
        :key="res.id"
        class="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
      >
        <div class="flex items-center gap-3">
          <el-icon :size="28" :class="res.color"><Document /></el-icon>
          <div class="min-w-0">
            <h5
              class="truncate text-xs font-bold text-slate-800 dark:text-white"
            >
              {{ res.title }}
            </h5>
            <span class="text-[10px] text-slate-400">{{ res.size }}</span>
          </div>
        </div>
        <el-button text circle @click="ElMessage.success('កំពុងទាញយក...')">
          <el-icon><Download /></el-icon>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Upload, Download, Document } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import type { Resource } from "~/types";

const resources: Resource[] = [
  {
    id: "1",
    title: "កិច្ចតែងការគំរូ រូបវិទ្យា ៩",
    type: "pdf",
    icon: "",
    color: "text-rose-500",
    size: "2.4 MB",
  },
  {
    id: "2",
    title: "ស្លាយបង្រៀន ច្បាប់ញូតុន",
    type: "ppt",
    icon: "",
    color: "text-amber-500",
    size: "14.8 MB",
  },
  {
    id: "3",
    title: "សន្លឹកកិច្ចការ សមីការ",
    type: "doc",
    icon: "",
    color: "text-blue-500",
    size: "850 KB",
  },
  {
    id: "4",
    title: "វីដេអូពិសោធន៍ កម្លាំង",
    type: "video",
    icon: "",
    color: "text-purple-500",
    size: "45 MB",
  },
];
</script>
