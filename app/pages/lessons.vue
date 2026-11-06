<template>
  <div class="space-y-5">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-bold text-slate-800 dark:text-white">
          បញ្ជីកិច្ចការសិស្ស
        </h3>
        <p class="text-xs text-slate-500">តាមដានការប្រគល់កិច្ចការ</p>
      </div>
      <el-button type="primary" @click="modalVisible = true">
        <el-icon><Plus /></el-icon> បង្កើតកិច្ចការថ្មី
      </el-button>
    </div>

    <AssignmentTable
      :items="items"
      @increment="onIncrement"
      @delete="onDelete"
    />

    <AssignmentFormModal v-model="modalVisible" @save="onSave" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { Plus } from "@element-plus/icons-vue";
import type { Assignment } from "~/types";
import { useAssignments } from "~/composables/useAssignments";
import { ElMessage, ElMessageBox } from "element-plus";
import AssignmentTable from "~/components/assignments/AssignmentTable.vue";
import AssignmentFormModal from "~/components/assignments/AssignmentFormModal.vue";

const { items, load, add, increment, remove } = useAssignments();

onMounted(load);

const modalVisible = ref(false);

const onSave = (a: Assignment) => {
  add(a);
  modalVisible.value = false;
  ElMessage.success("បានបង្កើតកិច្ចការថ្មី!");
};

const onIncrement = (id: string) => {
  increment(id);
  ElMessage.success("បានកត់ត្រា +១");
};

const onDelete = async (id: string) => {
  try {
    await ElMessageBox.confirm("លុបកិច្ចការនេះ?", "បញ្ជាក់", {
      type: "warning",
    });
    remove(id);
    ElMessage.success("បានលុប");
  } catch {}
};
</script>
