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

        <el-form :model="form" label-position="top" class="pt-2">
          <el-row :gutter="12">
            <el-col :md="6" :sm="12">
              <el-form-item label="មុខវិជ្ជា" required>
                <el-select
                  v-model="form.subject"
                  filterable
                  allow-create
                  default-first-option
                  placeholder="ជ្រើសរើសមុខវិជ្ជា"
                  class="w-full"
                >
                  <el-option
                    v-for="s in subjects"
                    :key="s.id"
                    :label="s.name"
                    :value="s.name"
                  >
                    <div class="flex items-center justify-between">
                      <span class="flex items-center gap-2">
                        <span
                          class="h-2 w-2 rounded-full"
                          :style="{ backgroundColor: s.color || '#0284c7' }"
                        />
                        <span>{{ s.name }}</span>
                      </span>
                      <span v-if="s.code" class="text-xs text-slate-400">
                        {{ s.code }}
                      </span>
                    </div>
                  </el-option>
                </el-select>
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
                class="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-300"
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
                class="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-300"
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
                class="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-300"
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
              :type="currentStep === i ? 'primary' : 'default'"
              @click="currentStep = i"
            >
              {{ khNum[i] }}. {{ step.shortTitle }}
            </el-button>
          </div>

          <p class="mb-2 text-sm font-bold text-sky-600">
            ជំហានទី{{ khNum[currentStep] }}៖ {{ steps[currentStep]?.title }}
          </p>

          <!-- ខ្លឹមសារមេរៀន / ខ្លឹមសារសកម្មភាព គ្រប់ជំហាន -->
          <div class="mb-3">
            <div class="flex items-center justify-between mb-1">
              <label
                class="block text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                📝 ខ្លឹមសារមេរៀន / ខ្លឹមសារសកម្មភាព (ជំហានទី{{ khNum[currentStep] }})
              </label>
              <span class="text-xs text-slate-400">
                អាចសរសេរអត្ថបទ រូបមន្ត រូបភាព ឬចំណុចសំខាន់ៗ
              </span>
            </div>
            <RichEditor
              v-model="
                (form as any)[steps[currentStep]?.content || 'step1Content']
              "
              :placeholder="
                steps[currentStep]?.contentPlaceholder ||
                'ខ្លឹមសារមេរៀន / ខ្លឹមសារសកម្មភាព...'
              "
              :height="170"
            />
          </div>

          <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label
                class="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                👨‍🏫 សកម្មភាពគ្រូ
              </label>
              <RichEditor
                v-model="
                  (form as any)[steps[currentStep]?.teacher || 'step1Teacher']
                "
                :placeholder="
                  steps[currentStep]?.teacherPlaceholder ||
                  'ពន្យល់ / បង្ហាញ / ដឹកនាំ...'
                "
                :height="170"
              />
            </div>
            <div>
              <label
                class="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                🧑‍🎓 សកម្មភាពសិស្ស
              </label>
              <RichEditor
                v-model="
                  (form as any)[steps[currentStep]?.student || 'step1Student']
                "
                :placeholder="
                  steps[currentStep]?.studentPlaceholder ||
                  'ស្តាប់ / ពិភាក្សា / អនុវត្ត...'
                "
                :height="170"
              />
            </div>
          </div>

          <!-- Prev / Next -->
          <div class="mt-3 flex justify-between">
            <el-button :disabled="currentStep === 0" @click="currentStep--">
              <el-icon><ArrowLeft /></el-icon> មុន
            </el-button>
            <el-button
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
        <div class="text-sm text-slate-500">
          <template v-if="!isValid">
            <div class="flex items-center gap-1 text-amber-500">
              <el-icon class="text-amber-500"><Warning /></el-icon>
              <p>សូមបំពេញ មុខវិជ្ជា និង ចំណងជើងមេរៀន</p>
            </div>
          </template>
          <template v-else>
            <div class="flex items-center gap-1 text-emerald-500">
              <el-icon class="text-emerald-500"><CircleCheck /></el-icon>
              <p>រួចរាល់ក្នុងការរក្សាទុក</p>
            </div>
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
import { useSubjects } from "~/composables/useSubjects";

const { subjects, load: loadSubjects } = useSubjects();
onMounted(() => {
  loadSubjects();
});

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
    title: "ពិនិត្យវត្តមាន & សណ្តាប់ធ្នាប់ (រដ្ឋបាលថ្នាក់)",
    shortTitle: "រដ្ឋបាលថ្នាក់",
    content: "step1Content",
    teacher: "step1Teacher",
    student: "step1Student",
    contentPlaceholder: "អនាម័យ សណ្តាប់ធ្នាប់ វត្តមានសិស្ស កិច្ចការរដ្ឋបាលថ្នាក់...",
    teacherPlaceholder: "ពិនិត្យវត្តមាន សណ្តាប់ធ្នាប់ អនាម័យ...",
    studentPlaceholder: "ប្រធានថ្នាក់រាយការណ៍ អង្គុយតាមកន្លែង រៀបរយ...",
  },
  {
    title: "រំលឹកមេរៀនចាស់",
    shortTitle: "រំលឹកមេរៀនចាស់",
    content: "step2Content",
    teacher: "step2Teacher",
    student: "step2Student",
    contentPlaceholder: "សំណួរគន្លឹះ ឬរូបមន្តដែលត្រូវរំលឹកពីមេរៀនមុន...",
    teacherPlaceholder: "សួរសំណួរទៅកាន់សិស្ស លើកទឹកចិត្ត...",
    studentPlaceholder: "ឆ្លើយសំណួរ ឡើងដោះស្រាយលើក្តារខៀន...",
  },
  {
    title: "មេរៀនថ្មី & ខ្លឹមសារ",
    shortTitle: "មេរៀនថ្មី",
    content: "step3Content",
    teacher: "step3Teacher",
    student: "step3Student",
    contentPlaceholder: "ចំណងជើងរង ទ្រឹស្តី រូបមន្ត និយមន័យ ឧទាហរណ៍...",
    teacherPlaceholder: "ពន្យល់ បង្ហាញរូបភាព/ពិសោធន៍ ដឹកនាំការពិភាក្សា...",
    studentPlaceholder: "ស្តាប់ការបកស្រាយ កត់ត្រា ចូលរួមពិភាក្សាក្នុងក្រុម...",
  },
  {
    title: "ពង្រឹងចំណេះដឹង (ពង្រឹងពុទ្ធិ)",
    shortTitle: "ពង្រឹងពុទ្ធិ",
    content: "step4Content",
    teacher: "step4Teacher",
    student: "step4Student",
    contentPlaceholder: "សំណួរពង្រឹងការយល់ដឹង លំហាត់អនុវត្តរហ័ស...",
    teacherPlaceholder: "ដាក់សំណួរ/លំហាត់ តាមដាន និងជួយណែនាំ...",
    studentPlaceholder: "ធ្វើលំហាត់ ឆ្លើយសំណួរ ឬប្រកួតប្រជែងជាក្រុម...",
  },
  {
    title: "បណ្តាំផ្ញើ & កិច្ចការផ្ទះ",
    shortTitle: "កិច្ចការផ្ទះ",
    content: "step5Content",
    teacher: "step5Teacher",
    student: "step5Student",
    contentPlaceholder: "កិច្ចការស្រាវជ្រាវ លំហាត់ត្រូវធ្វើនៅផ្ទះ បណ្តាំផ្ញើ...",
    teacherPlaceholder: "ដាក់កិច្ចការផ្ទះ ណែនាំវិធីស្រាវជ្រាវ និងផ្តាំផ្ញើ...",
    studentPlaceholder: "កត់ត្រាកិច្ចការផ្ទះ និងបណ្តាំផ្ញើរបស់គ្រូ...",
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
  step1Content: "",
  step1Teacher: "",
  step1Student: "",
  step2Content: "",
  step2Teacher: "",
  step2Student: "",
  step3Content: "",
  step3Teacher: "",
  step3Student: "",
  step4Content: "",
  step4Teacher: "",
  step4Student: "",
  step5Content: "",
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
    const hasTeacher = !!(form as any)[s.teacher];
    const hasStudent = !!(form as any)[s.student];
    const hasContent = !!(form as any)[s.content];
    if (hasTeacher || hasStudent || hasContent) filled++;
  });
  return Math.round((filled / steps.length) * 100);
});

const isValid = computed(() => !!form.subject && !!form.topic);

/* ---------------- Submit ---------------- */
const submit = () => {
  if (!isValid.value) return;
  const data: LessonPlan = {
    ...form,
    id: form.id || `plan-${crypto.randomUUID()}`,
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
