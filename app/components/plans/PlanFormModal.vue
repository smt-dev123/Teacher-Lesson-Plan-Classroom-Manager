<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? 'កែប្រែកិច្ចតែងការ' : 'បង្កើតកិច្ចតែងការថ្មី'"
    width="min(960px, 92vw)"
    top="5vh"
    destroy-on-close
  >
    <el-form :model="form" label-position="top" size="small">
      <el-row :gutter="12">
        <el-col :md="6" :sm="12">
          <el-form-item label="មុខវិជ្ជា" required>
            <el-input v-model="form.subject" placeholder="ឧ. រូបវិទ្យា" />
          </el-form-item>
        </el-col>
        <el-col :md="6" :sm="12">
          <el-form-item label="ថ្នាក់ទី" required>
            <el-select v-model="form.grade" class="w-full">
              <el-option v-for="g in grades" :key="g" :label="g" :value="g" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :md="6" :sm="12">
          <el-form-item label="កាលបរិច្ឆេទ">
            <el-date-picker
              v-model="form.date"
              type="date"
              value-format="YYYY-MM-DD"
              class="!w-full"
            />
          </el-form-item>
        </el-col>
        <el-col :md="6" :sm="12">
          <el-form-item label="រយៈពេល">
            <el-input v-model="form.duration" placeholder="៥០ នាទី" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="12">
        <el-col :sm="12">
          <el-form-item label="ជំពូក">
            <el-input v-model="form.chapter" />
          </el-form-item>
        </el-col>
        <el-col :sm="12">
          <el-form-item label="ចំណងជើងមេរៀន" required>
            <el-input v-model="form.topic" />
          </el-form-item>
        </el-col>
      </el-row>

      <div
        class="mb-4 rounded-xl border border-sky-100 bg-sky-50/50 p-3 dark:border-slate-700 dark:bg-slate-900/40"
      >
        <h4 class="mb-2 font-bold text-sky-700 dark:text-sky-400">
          🎯 វត្ថុបំណងមេរៀន
        </h4>
        <el-row :gutter="8">
          <el-col :md="8" :sm="24">
            <el-form-item label="ចំណេះដឹង">
              <el-input v-model="form.objKnowledge" type="textarea" :rows="2" />
            </el-form-item>
          </el-col>
          <el-col :md="8" :sm="24">
            <el-form-item label="បំណិន">
              <el-input v-model="form.objSkills" type="textarea" :rows="2" />
            </el-form-item>
          </el-col>
          <el-col :md="8" :sm="24">
            <el-form-item label="ឥរិយាបថ">
              <el-input v-model="form.objAttitude" type="textarea" :rows="2" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <el-row :gutter="12">
        <el-col :sm="12">
          <el-form-item label="សម្ភារឧបទេស">
            <el-input v-model="form.materials" />
          </el-form-item>
        </el-col>
        <el-col :sm="12">
          <el-form-item label="ឯកសារយោង">
            <el-input v-model="form.references" />
          </el-form-item>
        </el-col>
      </el-row>

      <h4 class="mb-2 mt-2 font-bold text-slate-800 dark:text-white">
        ដំណើរបង្រៀន (៥ ជំហាន)
      </h4>

      <div
        v-for="(step, i) in steps"
        :key="i"
        class="mb-3 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/40"
      >
        <p class="mb-2 text-xs font-bold text-sky-600">
          ជំហានទី{{ khNum[i] }}៖ {{ step.title }}
        </p>
        <el-row :gutter="8">
          <el-col :md="12" :sm="24">
            <el-form-item label="សកម្មភាពគ្រូ">
              <el-input
                v-model="(form as any)[step.teacher]"
                type="textarea"
                :rows="2"
              />
            </el-form-item>
          </el-col>
          <el-col :md="12" :sm="24">
            <el-form-item label="សកម្មភាពសិស្ស">
              <el-input
                v-model="(form as any)[step.student]"
                type="textarea"
                :rows="2"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">បោះបង់</el-button>
      <el-button type="primary" @click="submit">រក្សាទុក</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, reactive, watch } from "vue";
import type { LessonPlan } from "~/types";

const props = defineProps<{ modelValue: boolean; plan: LessonPlan | null }>();
const emit = defineEmits<{
  "update:modelValue": [boolean];
  save: [LessonPlan];
}>();

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

const isEdit = computed(() => !!props.plan?.id);

const grades = [
  "ថ្នាក់ទី៧",
  "ថ្នាក់ទី៨",
  "ថ្នាក់ទី៩",
  "ថ្នាក់ទី១០",
  "ថ្នាក់ទី១១",
  "ថ្នាក់ទី១២",
];
const khNum = ["១", "២", "៣", "៤", "៥"];

const steps = [
  {
    title: "ពិនិត្យវត្តមាន & សណ្តាប់ធ្នាប់",
    teacher: "step1Teacher",
    student: "step1Student",
  },
  { title: "រំលឹកមេរៀនចាស់", teacher: "step2Teacher", student: "step2Student" },
  {
    title: "មេរៀនថ្មី & ខ្លឹមសារ",
    teacher: "step3Teacher",
    student: "step3Student",
  },
  { title: "ពង្រឹងចំណេះដឹង", teacher: "step4Teacher", student: "step4Student" },
  {
    title: "បណ្តាំផ្ញើ & កិច្ចការផ្ទះ",
    teacher: "step5Teacher",
    student: "step5Student",
  },
];

const empty = (): LessonPlan => ({
  id: "",
  subject: "",
  grade: "ថ្នាក់ទី៩",
  date: new Date().toISOString().slice(0, 10),
  duration: "៥០ នាទី",
  chapter: "",
  topic: "",
  objKnowledge: "",
  objSkills: "",
  objAttitude: "",
  materials: "",
  references: "",
  step1Teacher: "",
  step1Student: "",
  step2Teacher: "",
  step2Student: "",
  step3Content: "",
  step3Teacher: "",
  step3Student: "",
  step4Teacher: "",
  step4Student: "",
  step5Teacher: "",
  step5Student: "",
});

const form = reactive<LessonPlan>(empty());

watch(
  () => props.plan,
  (p) => Object.assign(form, p || empty()),
  { immediate: true },
);

const submit = () => {
  if (!form.subject || !form.topic) return;
  const data: LessonPlan = { ...form, id: form.id || "plan-" + Date.now() };
  emit("save", data);
};
</script>
