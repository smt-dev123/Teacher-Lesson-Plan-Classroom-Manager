<template>
  <el-dialog
    v-model="visible"
    width="min(980px, 96vw)"
    top="2vh"
    class="print-modal"
    modal-class="print-overlay"
  >
    <template #header>
      <div class="flex items-center justify-between pr-6">
        <span class="text-sm font-semibold">ទិដ្ឋភាពបោះពុម្ពកិច្ចតែងការ</span>
        <div class="flex items-center gap-2">
          <el-button
            type="success"
            size="small"
            :loading="isExporting"
            @click="onDownloadDocx"
          >
            <el-icon><Download /></el-icon> ទាញយក .docx
          </el-button>
          <el-button type="primary" size="small" @click="doPrint">
            <el-icon><Printer /></el-icon> បោះពុម្ព
          </el-button>
        </div>
      </div>
    </template>

    <div
      v-if="plan"
      id="print-area"
      class="p-6 font-khmer leading-relaxed text-slate-900 bg-white"
    >
      <!-- Header -->
      <div class="mb-5 border-b border-slate-300 pb-3 text-center">
        <p class="font-moul text-sm tracking-wide">ព្រះរាជាណាចក្រកម្ពុជា</p>
        <p class="font-moul text-xs">ជាតិ សាសនា ព្រះមហាក្សត្រ</p>
        <div class="my-1 text-center font-tacteing text-2xl text-slate-500">
          7
        </div>
        <h2 class="font-moul text-base text-sky-900 mt-2">កិច្ចតែងការបង្រៀន</h2>
      </div>

      <!-- Basic Info -->
      <div class="mb-4 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
        <div><strong>មុខវិជ្ជា៖</strong> {{ plan.subject }}</div>
        <div><strong>ថ្នាក់ទី៖</strong> {{ plan.grade }}</div>
        <div><strong>កាលបរិច្ឆេទ៖</strong> {{ plan.date }}</div>
        <div>
          <strong>រយៈពេល៖</strong> {{ plan.duration }}
          <span v-if="(plan as any).academicYear" class="text-slate-500 font-normal ml-2">
            (ឆ្នាំសិក្សា៖ {{ (plan as any).academicYear }})
          </span>
        </div>
        <div class="col-span-2"><strong>ជំពូក៖</strong> {{ plan.chapter }}</div>
        <div class="col-span-2">
          <strong>ចំណងជើងមេរៀន៖</strong>
          <span class="font-bold text-sky-900">{{ plan.topic }}</span>
        </div>
      </div>

      <!-- Objectives -->
      <div class="mb-3 rounded-lg border border-slate-300 bg-slate-50/70 p-3">
        <h4 class="mb-2 text-xs font-bold underline text-slate-800">
          I. វត្ថុបំណង
        </h4>
        <div class="space-y-1 text-xs">
          <div class="flex items-start gap-1">
            <strong class="shrink-0">១. ចំណេះដឹង៖</strong>
            <div class="rich-content flex-1" v-html="plan.objKnowledge" />
          </div>
          <div class="flex items-start gap-1">
            <strong class="shrink-0">២. បំណិន៖</strong>
            <div class="rich-content flex-1" v-html="plan.objSkills" />
          </div>
          <div class="flex items-start gap-1">
            <strong class="shrink-0">៣. ឥរិយាបថ៖</strong>
            <div class="rich-content flex-1" v-html="plan.objAttitude" />
          </div>
        </div>
      </div>

      <!-- Materials & References -->
      <div class="mb-4 grid grid-cols-2 gap-3 text-xs">
        <div class="rounded-lg border border-slate-300 p-2.5 bg-slate-50/50">
          <strong>II. សម្ភារឧបទេស៖</strong>
          <p class="mt-1 text-slate-700">
            {{ plan.materials || "សៀវភៅពុម្ព, ក្តារខៀន, ឧបករណ៍ពិសោធន៍" }}
          </p>
        </div>
        <div class="rounded-lg border border-slate-300 p-2.5 bg-slate-50/50">
          <strong>III. ឯកសារយោង៖</strong>
          <p class="mt-1 text-slate-700">
            {{ plan.references || "សៀវភៅគ្រូ និងសៀវភៅសិក្សាគោលក្រសួងអប់រំ" }}
          </p>
        </div>
      </div>

      <!-- Teaching Process Table (IV. ដំណើរបង្រៀន) -->
      <h4 class="mb-2 text-xs font-bold underline text-slate-800">
        IV. ដំណើរបង្រៀន (៥ ជំហានគរុកោសល្យ)
      </h4>
      <table class="w-full border-collapse border border-slate-400 text-xs">
        <thead class="bg-slate-200/90 font-bold text-slate-800">
          <tr>
            <th
              class="border border-slate-400 p-2 text-center"
              style="width: 30%"
            >
              សកម្មភាពគ្រូ
            </th>
            <th
              class="border border-slate-400 p-2 text-center"
              style="width: 40%"
            >
              ខ្លឹមសារមេរៀន
            </th>
            <th
              class="border border-slate-400 p-2 text-center"
              style="width: 30%"
            >
              សកម្មភាពសិស្ស
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(step, i) in steps" :key="i">
            <!-- ១. សកម្មភាពគ្រូ -->
            <td class="border border-slate-400 p-2.5 align-top">
              <div
                v-if="(plan as any)[step.teacher]"
                class="rich-content space-y-1"
                v-html="(plan as any)[step.teacher]"
              />
              <p v-else class="text-slate-400 italic text-[11px]">
                - គ្មានសកម្មភាព
              </p>
            </td>

            <!-- ២. ខ្លឹមសារមេរៀន (ជំហាននីមួយៗនៅក្នុងខ្លឹមសារមេរៀន) -->
            <td class="border border-slate-400 p-2.5 align-top bg-slate-50/40">
              <div
                class="font-bold text-sky-900 border-b border-slate-300 pb-1 mb-1.5"
              >
                {{ step.stepName }}៖ {{ step.title }}
              </div>

              <!-- បង្ហាញខ្លឹមសារមេរៀនគ្រប់ជំហាន (ប្រសិនបើមានសរសេរ) -->
              <div v-if="hasContent((plan as any)[step.content])" class="mt-1">
                <div
                  class="rich-content font-normal text-slate-800"
                  v-html="(plan as any)[step.content]"
                />
              </div>
              <div v-else class="text-[11px] text-slate-500 italic leading-normal">
                {{ step.description }}
              </div>
            </td>

            <!-- ៣. សកម្មភាពសិស្ស -->
            <td class="border border-slate-400 p-2.5 align-top">
              <div
                v-if="(plan as any)[step.student]"
                class="rich-content space-y-1"
                v-html="(plan as any)[step.student]"
              />
              <p v-else class="text-slate-400 italic text-[11px]">
                - គ្មានសកម្មភាព
              </p>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Footer Signatures -->
      <div class="mt-8 flex justify-between text-xs pt-4">
        <div class="text-center space-y-1">
          <p>បានឃើញ និងឯកភាព</p>
          <p class="font-bold">នាយកសាលា / គណៈគ្រប់គ្រង</p>
          <div class="h-16"></div>
          <p class="text-slate-400">
            ....................................................
          </p>
        </div>
        <div class="text-center space-y-1">
          <p>........ថ្ងៃទី...... ខែ...... ឆ្នាំ ២០.....</p>
          <p class="font-bold">ហត្ថលេខាគ្រូបង្រៀន</p>
          <div class="h-16"></div>
          <p class="text-slate-400">
            ....................................................
          </p>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { Printer, Download } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import type { LessonPlan } from "~/types";
import { exportLessonPlanToDocx } from "~/utils/exportLessonPlanDocx";

const props = defineProps<{ modelValue: boolean; plan: LessonPlan | null }>();
const emit = defineEmits<{ "update:modelValue": [boolean] }>();

const isExporting = ref(false);

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

const onDownloadDocx = async () => {
  if (!props.plan) return;
  try {
    isExporting.value = true;
    await exportLessonPlanToDocx(props.plan);
    ElMessage.success("ទាញយកកិច្ចតែងការ (.docx) បានជោគជ័យ!");
  } catch (error) {
    console.error("Export docx error:", error);
    ElMessage.error("មានបញ្ហាក្នុងការបង្កើតឯកសារ .docx");
  } finally {
    isExporting.value = false;
  }
};

const steps = [
  {
    stepName: "ជំហានទី១",
    title: "ពិនិត្យវត្តមាន & សណ្តាប់ធ្នាប់ (រដ្ឋបាលថ្នាក់)",
    content: "step1Content",
    teacher: "step1Teacher",
    student: "step1Student",
    description: "ពិនិត្យអនាម័យ សណ្តាប់ធ្នាប់ និងវត្តមានសិស្សក្នុងថ្នាក់",
  },
  {
    stepName: "ជំហានទី២",
    title: "រំលឹកមេរៀនចាស់",
    content: "step2Content",
    teacher: "step2Teacher",
    student: "step2Student",
    description: "សួរសំណួររំលឹកចំណុចសំខាន់ៗនៃមេរៀនមុន",
  },
  {
    stepName: "ជំហានទី៣",
    title: "មេរៀនថ្មី & ខ្លឹមសារ",
    content: "step3Content",
    teacher: "step3Teacher",
    student: "step3Student",
    description: "ខ្លឹមសារ និងទ្រឹស្តីគន្លឹះនៃមេរៀនថ្មី",
  },
  {
    stepName: "ជំហានទី៤",
    title: "ពង្រឹងចំណេះដឹង (ពង្រឹងពុទ្ធិ)",
    content: "step4Content",
    teacher: "step4Teacher",
    student: "step4Student",
    description: "សំណួរ និងលំហាត់អនុវត្តពង្រឹងការយល់ដឹង",
  },
  {
    stepName: "ជំហានទី៥",
    title: "បណ្តាំផ្ញើ & កិច្ចការផ្ទះ",
    content: "step5Content",
    teacher: "step5Teacher",
    student: "step5Student",
    description: "ដាក់កិច្ចការស្រាវជ្រាវ និងការរំលឹកឱ្យសិស្សមើលមេរៀនបន្ត",
  },
];

const hasContent = (val?: string | null) => {
  if (!val) return false;
  return val.replace(/<[^>]*>/g, "").trim().length > 0;
};

const doPrint = () => {
  if (import.meta.client) {
    window.print();
  }
};
</script>

<style scoped>
.rich-content :deep(p) {
  margin: 0 0 4px 0;
}
.rich-content :deep(ul) {
  list-style-type: disc;
  padding-left: 1.2rem;
  margin: 4px 0;
}
.rich-content :deep(ol) {
  list-style-type: decimal;
  padding-left: 1.2rem;
  margin: 4px 0;
}
.rich-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  margin: 4px 0;
}

/* Print CSS */
@media print {
  @page {
    size: A4 portrait;
    margin: 10mm;
  }

  body * {
    visibility: hidden;
  }

  #print-area,
  #print-area * {
    visibility: visible;
  }

  #print-area {
    position: absolute;
    left: 0;
    top: 0;
    width: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
    background: #fff !important;
    color: #000 !important;
  }

  table {
    page-break-inside: auto;
    width: 100% !important;
  }
  tr {
    page-break-inside: avoid;
  }
  thead {
    display: table-header-group;
  }
}
</style>
