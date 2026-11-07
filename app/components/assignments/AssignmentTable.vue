<template>
  <div
    class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
  >
    <el-table :data="items" class="!border-none">
      <el-table-column prop="title" label="ចំណងជើង" min-width="200" />
      <el-table-column label="មុខវិជ្ជា & ថ្នាក់" min-width="150">
        <template #default="{ row }"
          >{{ row.subject }} ({{ row.grade }})</template
        >
      </el-table-column>
      <el-table-column prop="due" label="ផុតកំណត់" width="120" />
      <el-table-column label="ប្រគល់" width="140">
        <template #default="{ row }">
          <strong>{{ row.submitted }}</strong> / {{ row.total }}
          <span class="ml-1 text-sm text-slate-400">
            ({{ Math.round((row.submitted / row.total) * 100) }}%)
          </span>
        </template>
      </el-table-column>
      <el-table-column label="ស្ថានភាព" width="130">
        <template #default="{ row }">
          <el-tag :type="row.submitted === row.total ? 'success' : 'warning'">
            {{ row.submitted === row.total ? "រួចរាល់" : "កំពុងប្រមូល" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="សកម្មភាព" width="180" align="right">
        <template #default="{ row }">
          <el-button @click="$emit('increment', row.id)">+១</el-button>
          <el-button text type="danger" @click="$emit('delete', row.id)">
            <el-icon><Delete /></el-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { Delete } from "@element-plus/icons-vue";
import type { Assignment } from "~/types";

defineProps<{ items: Assignment[] }>();
defineEmits<{ increment: [string]; delete: [string] }>();
</script>
