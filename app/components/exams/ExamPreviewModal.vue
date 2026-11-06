<template>
  <el-dialog v-model="visible" width="min(900px, 95vw)" top="2vh">
    <template #header>
      <div class="flex items-center justify-between">
        <span class="text-sm font-semibold">មើលវិញ្ញាសាជាមុន</span>
        <el-button type="primary" size="small" @click="doPrint">
          <el-icon><Printer /></el-icon> បោះពុម្ព
        </el-button>
      </div>
    </template>

    <div v-if="exam" id="print-area" class="p-4 font-khmer">
      <div class="mb-4 border-b pb-3 text-center">
        <p class="font-moul text-sm">ព្រះរាជាណាចក្រកម្ពុជា</p>
        <p class="font-moul text-xs">ជាតិ សាសនា ព្រះមហាក្សត្រ</p>
        <div class="mx-auto my-2 h-0.5 w-24 bg-slate-800"></div>
        <h2 class="font-moul text-base text-sky-800">វិញ្ញាសាប្រឡង</h2>
        <p class="mt-1 text-xs">
          <strong>{{ exam.title }}</strong>
        </p>
      </div>

      <div class="mb-3 grid grid-cols-2 gap-1 text-xs">
        <div><strong>មុខវិជ្ជា៖</strong> {{ exam.subject }}</div>
        <div><strong>ថ្នាក់៖</strong> {{ exam.grade }}</div>
        <div><strong>រយៈពេល៖</strong> {{ exam.duration }} នាទី</div>
        <div><strong>ពិន្ទុសរុប៖</strong> {{ exam.totalPoints }}</div>
      </div>

      <p
        v-if="exam.instructions"
        class="mb-3 rounded-lg bg-amber-50 p-2 text-xs italic"
      >
        <strong>សេចក្តីណែនាំ៖</strong> {{ exam.instructions }}
      </p>

      <div class="space-y-3">
        <div v-for="q in exam.questions" :key="q.id" class="text-xs">
          <p class="font-semibold">
            <span class="mr-1">{{ q.order }}.</span>{{ q.content }}
            <span class="text-slate-500">({{ q.examPoints }} ពិន្ទុ)</span>
          </p>

          <ul v-if="q.type === 'mcq'" class="ml-6 mt-1 space-y-0.5">
            <li v-for="opt in q.options" :key="opt.id">
              {{ opt.id.toUpperCase() }}. {{ opt.text }}
            </li>
          </ul>

          <div
            v-else-if="q.type === 'truefalse'"
            class="ml-6 mt-1 text-slate-600"
          >
            ☐ ត្រូវ ☐ ខុស
          </div>

          <div v-else-if="q.type === 'short'" class="ml-6 mt-1 text-slate-400">
            ....................................................
          </div>

          <div v-else-if="q.type === 'essay'" class="ml-6 mt-1 text-slate-400">
            ............................................................................<br />
            ............................................................................
          </div>
        </div>
      </div>

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
import type { Exam } from "~/types";

const props = defineProps<{ modelValue: boolean; exam: Exam | null }>();
const emit = defineEmits<{ "update:modelValue": [boolean] }>();

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

const doPrint = () => window.print();
</script>
