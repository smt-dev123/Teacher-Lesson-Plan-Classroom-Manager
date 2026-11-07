<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? 'កែប្រែកិច្ចតែងការ' : 'បង្កើតកិច្ចតែងការថ្មី'"
    width="min(1280px, 96vw)"
    top="3vh"
    destroy-on-close
    @open="onOpen"
  >
    <el-tabs v-model="activeTab" class="plan-tabs">
      <!-- ========== TAB 1: Basic ========== -->
      <el-tab-pane name="basic">
        <template #label>
          <span class="flex items-center gap-1.5">
            <el-icon><Document /></el-icon>
            ព័ត៌មានទូទៅ
            <el-badge
              v-if="basicProgress < 100"
              :value="basicProgress + '%'"
              type="warning"
              class="ml-1"
            />
            <el-icon v-else class="text-emerald-500"><CircleCheck /></el-icon>
          </span>
        </template>

        <el-form :model="form" label-position="top" size="small" class="pt-2">
          <el-row :gutter="12">
            <el-col :md="6" :sm="12">
              <el-form-item label="មុខវិជ្ជា" required>
                <el-input v-model="form.subject" placeholder="ឧ. រូបវិទ្យា" />
              </el-form-item>
            </el-col>
            <el-col :md="6" :sm="12">
              <el-form-item label="ថ្នាក់ទី" required>
                <el-select v-model="form.grade" class="w-full">
                  <el-option
                    v-for="g in grades"
                    :key="g"
                    :label="g"
                    :value="g"
                  />
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
        </el-form>
      </el-tab-pane>

      <!-- ========== TAB 2: Objectives ========== -->
      <el-tab-pane name="objectives">
        <template #label>
          <span class="flex items-center gap-1.5">
            <el-icon><Aim /></el-icon>
            វត្ថុបំណង
            <el-badge
              v-if="objProgress < 100"
              :value="objProgress + '%'"
              type="warning"
              class="ml-1"
            />
            <el-icon v-else class="text-emerald-500"><CircleCheck /></el-icon>
          </span>
        </template>

        <div
          class="rounded-xl border border-sky-100 bg-sky-50/50 p-3 dark:border-slate-700 dark:bg-slate-900/40"
        >
          <h4 class="mb-2 font-bold text-sky-700 dark:text-sky-400">
            🎯 វត្ថុបំណងមេរៀន (៣ ចំណុច)
          </h4>
          <div class="space-y-3">
            <div>
              <label
                class="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                ១. ចំណេះដឹង (Knowledge)
              </label>
              <RichEditor
                v-model="form.objKnowledge"
                placeholder="សិស្សអាចរៀបរាប់ ឬកំណត់និយមន័យ..."
                :height="150"
              />
            </div>
            <div>
              <label
                class="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                ២. បំណិន (Skills)
              </label>
              <RichEditor
                v-model="form.objSkills"
                placeholder="សិស្សចេះអនុវត្ត រូបមន្ត ឬគណនា..."
                :height="150"
              />
            </div>
            <div>
              <label
                class="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                ៣. ឥរិយាបថ (Attitude)
              </label>
              <RichEditor
                v-model="form.objAttitude"
                placeholder="បណ្ដុះស្មារតីសហការ ស្រាវជ្រាវ..."
                :height="150"
              />
            </div>
          </div>
        </div>
      </el-tab-pane>

      <!-- ========== TAB 3: Steps ========== -->
      <el-tab-pane name="steps">
        <template #label>
          <span class="flex items-center gap-1.5">
            <el-icon><List /></el-icon>
            ដំណើរបង្រៀន (៥ ជំហាន)
            <el-badge
              v-if="stepsProgress < 100"
              :value="stepsProgress + '%'"
              type="warning"
              class="ml-1"
            />
            <el-icon v-else class="text-emerald-500"><CircleCheck /></el-icon>
          </span>
        </template>

        <div
          class="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/40"
        >
          <!-- Step navigator -->
          <div class="mb-3 flex flex-wrap gap-1.5">
            <el-button
              v-for="(step, i) in steps"
              :key="i"
              size="small"
              :type="currentStep === i ? 'primary' : 'default'"
              @click="currentStep = i"
            >
              {{ khNum[i] }}. {{ step.shortTitle }}
            </el-button>
          </div>

          <p class="mb-2 text-xs font-bold text-sky-600">
            ជំហានទី{{ khNum[currentStep] }}៖ {{ steps[currentStep]?.title }}
          </p>

          <!-- Content -->
          <div v-show="currentStep === 2" class="mb-3">
            <label
              class="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              ខ្លឹមសារមេរៀន (អាចបញ្ចូលរូបភាព, អក្សរដិត, បញ្ជី)
            </label>
            <RichEditor
              v-model="form.step3Content"
              placeholder="រូបមន្ត / ចំណុចសំខាន់ / រូបភាព..."
              :height="200"
            />
          </div>

          <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label
                class="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                សកម្មភាពគ្រូ
              </label>
              <RichEditor
                v-model="
                  (form as any)[steps[currentStep]?.teacher || 'step1Teacher']
                "
                placeholder="ពន្យល់ / បង្ហាញ / ដឹកនាំ..."
                :height="180"
              />
            </div>
            <div>
              <label
                class="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                សកម្មភាពសិស្ស
              </label>
              <RichEditor
                v-model="
                  (form as any)[steps[currentStep]?.student || 'step1Student']
                "
                placeholder="ស្តាប់ / ពិភាក្សា / អនុវត្ត..."
                :height="180"
              />
            </div>
          </div>

          <!-- Prev / Next -->
          <div class="mt-3 flex justify-between">
            <el-button
              size="small"
              :disabled="currentStep === 0"
              @click="currentStep--"
            >
              <el-icon><ArrowLeft /></el-icon> មុន
            </el-button>
            <el-button
              size="small"
              type="primary"
              :disabled="currentStep === steps.length - 1"
              @click="currentStep++"
            >
              បន្ទាប់ <el-icon><ArrowRight /></el-icon>
            </el-button>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- ========== Footer ========== -->
    <template #footer>
      <div class="flex items-center justify-between">
        <div class="text-[11px] text-slate-500">
          <template v-if="!isValid">
            <el-icon class="text-amber-500"><Warning /></el-icon>
            សូមបំពេញ មុខវិជ្ជា និង ចំណងជើងមេរៀន
          </template>
          <template v-else>
            <el-icon class="text-emerald-500"><CircleCheck /></el-icon>
            រួចរាល់ក្នុងការរក្សាទុក
          </template>
        </div>

        <div class="flex gap-2">
          <el-button @click="visible = false">បោះបង់</el-button>
          <el-button type="primary" :disabled="!isValid" @click="submit">
            {{ isEdit ? "ធ្វើបច្ចុប្បន្នភាព" : "រក្សាទុក" }}
          </el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, watch } from "vue";
import RichEditor from "~/components/common/RichEditor.vue";
import {
  Document,
  Aim,
  List,
  ArrowLeft,
  ArrowRight,
  CircleCheck,
  Warning,
} from "@element-plus/icons-vue";
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

/* ---------------- Tabs ---------------- */
const activeTab = ref<"basic" | "objectives" | "steps">("basic");
const currentStep = ref(0);

/* ---------------- Config ---------------- */
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
    shortTitle: "វត្តមាន",
    teacher: "step1Teacher",
    student: "step1Student",
  },
  {
    title: "រំលឹកមេរៀនចាស់",
    shortTitle: "រំលឹក",
    teacher: "step2Teacher",
    student: "step2Student",
  },
  {
    title: "មេរៀនថ្មី & ខ្លឹមសារ",
    shortTitle: "មេរៀនថ្មី",
    teacher: "step3Teacher",
    student: "step3Student",
  },
  {
    title: "ពង្រឹងចំណេះដឹង",
    shortTitle: "ពង្រឹង",
    teacher: "step4Teacher",
    student: "step4Student",
  },
  {
    title: "បណ្តាំផ្ញើ & កិច្ចការផ្ទះ",
    shortTitle: "កិច្ចការផ្ទះ",
    teacher: "step5Teacher",
    student: "step5Student",
  },
] as const;

/* ---------------- Form ---------------- */
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

/* ---------------- Mode-specific init ---------------- */
const onOpen = () => {
  if (isEdit.value) {
    // UPDATE: maintain current tab OR default to basic
    // Reset form ពី props
    Object.assign(form, props.plan || empty());
    activeTab.value = "basic";
    currentStep.value = 0;
  } else {
    // CREATE: ចាប់ផ្តើមពី basic + ទំនេរ
    Object.assign(form, empty());
    activeTab.value = "basic";
    currentStep.value = 0;
  }
};

// ពេល plan ផ្លាស់ប្តូរ → sync form
watch(
  () => props.plan,
  (p) => Object.assign(form, p || empty()),
  { immediate: true },
);

/* ---------------- Validation progress ---------------- */
const basicProgress = computed(() => {
  let done = 0;
  if (form.subject) done++;
  if (form.grade) done++;
  if (form.topic) done++;
  return Math.round((done / 3) * 100);
});

const objProgress = computed(() => {
  let done = 0;
  if (form.objKnowledge) done++;
  if (form.objSkills) done++;
  if (form.objAttitude) done++;
  return Math.round((done / 3) * 100);
});

const stepsProgress = computed(() => {
  let filled = 0;
  steps.forEach((s) => {
    if ((form as any)[s.teacher] && (form as any)[s.student]) filled++;
  });
  return Math.round((filled / steps.length) * 100);
});

const isValid = computed(() => !!form.subject && !!form.topic);

/* ---------------- Submit ---------------- */
const submit = () => {
  if (!isValid.value) return;
  const data: LessonPlan = {
    ...form,
    id: form.id || "plan-" + Date.now(),
  };
  emit("save", data);
};
</script>

<style scoped>
/* Tab styling */
.plan-tabs :deep(.el-tabs__header) {
  margin-bottom: 12px;
}
.plan-tabs :deep(.el-tabs__item) {
  font-size: 13px;
  font-weight: 600;
}
</style>
