<template>
  <el-dialog
    v-model="visible"
    title="បង្កើតកិច្ចការថ្មី"
    width="min(520px, 92vw)"
  >
    <el-form :model="form" label-position="top" size="small">
      <el-form-item label="ចំណងជើង" required>
        <el-input v-model="form.title" />
      </el-form-item>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="មុខវិជ្ជា"
            ><el-input v-model="form.subject"
          /></el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="ថ្នាក់"
            ><el-input v-model="form.grade"
          /></el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="ផុតកំណត់">
            <el-date-picker
              v-model="form.due"
              type="date"
              value-format="YYYY-MM-DD"
              class="!w-full"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="សិស្សសរុប">
            <el-input-number v-model="form.total" :min="1" class="!w-full" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">បោះបង់</el-button>
      <el-button type="primary" @click="submit">ដាក់កិច្ចការ</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, reactive, watch } from "vue";
import type { Assignment } from "~/types";

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{
  "update:modelValue": [boolean];
  save: [Assignment];
}>();

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

const form = reactive<Assignment>({
  id: "",
  title: "",
  subject: "រូបវិទ្យា",
  grade: "ថ្នាក់ទី៩B",
  due: new Date().toISOString().slice(0, 10),
  total: 36,
  submitted: 0,
  status: "pending",
});

watch(visible, (v) => {
  if (v)
    Object.assign(form, {
      id: "",
      title: "",
      subject: "រូបវិទ្យា",
      grade: "ថ្នាក់ទី៩B",
      due: new Date().toISOString().slice(0, 10),
      total: 36,
      submitted: 0,
      status: "pending",
    });
});

const submit = () => {
  if (!form.title) return;
  emit("save", { ...form, id: "asg-" + Date.now() });
};
</script>
