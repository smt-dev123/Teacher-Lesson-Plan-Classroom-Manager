<template>
  <el-dialog
    v-model="visible"
    width="min(900px, 95vw)"
    top="2vh"
    class="print-modal"
  >
    <template #header>
      <div class="flex items-center justify-between">
        <span class="text-sm font-semibold">ទិដ្ឋភាពបោះពុម្ព</span>
        <el-button type="primary" size="small" @click="doPrint">
          <el-icon><Printer /></el-icon> បោះពុម្ព
        </el-button>
      </div>
    </template>

    <div v-if="plan" id="print-area" class="p-4 font-khmer leading-relaxed">
      <div class="mb-4 border-b pb-3 text-center">
        <p class="font-moul text-sm">ព្រះរាជាណាចក្រកម្ពុជា</p>
        <p class="font-moul text-xs">ជាតិ សាសនា ព្រះមហាក្សត្រ</p>
        <div class="mx-auto my-2 h-0.5 w-24 bg-slate-800"></div>
        <h2 class="font-moul text-base text-sky-800">កិច្ចតែងការបង្រៀន</h2>
      </div>

      <div class="mb-4 grid grid-cols-2 gap-y-1 text-xs">
        <div><strong>មុខវិជ្ជា៖</strong> {{ plan.subject }}</div>
        <div><strong>ថ្នាក់ទី៖</strong> {{ plan.grade }}</div>
        <div><strong>កាលបរិច្ឆេទ៖</strong> {{ plan.date }}</div>
        <div><strong>រយៈពេល៖</strong> {{ plan.duration }}</div>
        <div class="col-span-2"><strong>ជំពូក៖</strong> {{ plan.chapter }}</div>
        <div class="col-span-2"><strong>ចំណងជើង៖</strong> {{ plan.topic }}</div>
      </div>

      <div class="mb-3 rounded-lg border bg-slate-50 p-3">
        <h4 class="mb-1 text-xs font-bold underline">I. វត្ថុបំណង</h4>
        <p class="text-xs">
          <strong>១. ចំណេះដឹង៖</strong> {{ plan.objKnowledge }}
        </p>
        <p class="text-xs"><strong>២. បំណិន៖</strong> {{ plan.objSkills }}</p>
        <p class="text-xs">
          <strong>៣. ឥរិយាបថ៖</strong> {{ plan.objAttitude }}
        </p>
      </div>

      <div class="mb-3 grid grid-cols-2 gap-3 text-xs">
        <div class="rounded-lg border p-2">
          <strong>II. សម្ភារឧបទេស៖</strong>
          <p>{{ plan.materials }}</p>
        </div>
        <div class="rounded-lg border p-2">
          <strong>III. ឯកសារយោង៖</strong>
          <p>{{ plan.references }}</p>
        </div>
      </div>

      <h4 class="mb-2 text-xs font-bold underline">
        IV. ដំណើរបង្រៀន (៥ ជំហាន)
      </h4>
      <table class="w-full border-collapse border text-xs">
        <thead>
          <tr class="bg-slate-200">
            <th class="w-32 border p-2">ជំហាន</th>
            <th class="border p-2">សកម្មភាពគ្រូ</th>
            <th class="border p-2">សកម្មភាពសិស្ស</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(step, i) in steps" :key="i">
            <td class="border bg-slate-50 p-2 font-bold">
              {{ khNum[i] }}. {{ step.title }}
            </td>
            <td class="border p-2">{{ (plan as any)[step.teacher] }}</td>
            <td class="border p-2">{{ (plan as any)[step.student] }}</td>
          </tr>
        </tbody>
      </table>

      <div class="mt-8 flex justify-between text-xs">
        <div class="text-center">
          <p>បានឃើញ និងឯកភាព</p>
          <p class="font-bold">នាយកសាលា</p>
          <div class="h-16"></div>
          <p class="text-slate-400">.................</p>
        </div>
        <div class="text-center">
          <p>ថ្ងៃទី...... ខែ...... ឆ្នាំ ២០២...</p>
          <p class="font-bold">ហត្ថលេខាគ្រូបង្រៀន</p>
          <div class="h-16"></div>
          <p class="font-semibold">លោកគ្រូ សុខ ចាន់ថន</p>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { Printer } from "@element-plus/icons-vue";
import type { LessonPlan } from "~/types";

const props = defineProps<{ modelValue: boolean; plan: LessonPlan | null }>();
const emit = defineEmits<{ "update:modelValue": [boolean] }>();

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

const khNum = ["១", "២", "៣", "៤", "៥"];
const steps = [
  { title: "ពិនិត្យវត្តមាន", teacher: "step1Teacher", student: "step1Student" },
  { title: "រំលឹកមេរៀនចាស់", teacher: "step2Teacher", student: "step2Student" },
  { title: "មេរៀនថ្មី", teacher: "step3Teacher", student: "step3Student" },
  { title: "ពង្រឹងចំណេះដឹង", teacher: "step4Teacher", student: "step4Student" },
  { title: "បណ្តាំផ្ញើ", teacher: "step5Teacher", student: "step5Student" },
];

const doPrint = () => window.print();
</script>
