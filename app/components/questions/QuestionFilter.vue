<template>
  <div
    class="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 md:flex-row md:items-center md:justify-between"
  >
    <div class="flex flex-wrap gap-2">
      <el-select
        v-model="local.subject"
        size="small"
        placeholder="មុខវិជ្ជា"
        class="!w-36"
      >
        <el-option label="គ្រប់មុខវិជ្ជា" value="all" />
        <el-option label="រូបវិទ្យា" value="រូបវិទ្យា" />
        <el-option label="គណិតវិទ្យា" value="គណិតវិទ្យា" />
        <el-option label="គីមីវិទ្យា" value="គីមីវិទ្យា" />
      </el-select>

      <el-select v-model="local.grade" size="small" class="!w-32">
        <el-option label="គ្រប់ថ្នាក់" value="all" />
        <el-option label="ថ្នាក់ទី៧" value="ថ្នាក់ទី៧" />
        <el-option label="ថ្នាក់ទី៨" value="ថ្នាក់ទី៨" />
        <el-option label="ថ្នាក់ទី៩" value="ថ្នាក់ទី៩" />
      </el-select>

      <el-select v-model="local.type" size="small" class="!w-32">
        <el-option label="គ្រប់ប្រភេទ" value="all" />
        <el-option label="ពហុជម្រើស" value="mcq" />
        <el-option label="ត្រូវ/ខុស" value="truefalse" />
        <el-option label="ខ្លី" value="short" />
        <el-option label="អត្ថបទ" value="essay" />
      </el-select>

      <el-select v-model="local.difficulty" size="small" class="!w-32">
        <el-option label="គ្រប់កម្រិត" value="all" />
        <el-option label="ងាយ" value="easy" />
        <el-option label="មធ្យម" value="medium" />
        <el-option label="ពិបាក" value="hard" />
      </el-select>

      <el-input
        v-model="local.search"
        size="small"
        placeholder="ស្វែងរក..."
        class="!w-48"
        clearable
      >
        <template #prefix
          ><el-icon><Search /></el-icon
        ></template>
      </el-input>
    </div>

    <el-button type="primary" size="small" @click="$emit('create')">
      <el-icon><Plus /></el-icon> បង្កើតសំណួរ
    </el-button>
  </div>
</template>

<script lang="ts" setup>
import { Search, Plus } from "@element-plus/icons-vue";

const props = defineProps<{ filters: any }>();
const emit = defineEmits<{
  "update:filters": [any];
  create: [];
}>();

// two-way sync
const local = new Proxy(props.filters, {
  set(target, key, value) {
    target[key] = value;
    emit("update:filters", { ...target });
    return true;
  },
});
</script>
