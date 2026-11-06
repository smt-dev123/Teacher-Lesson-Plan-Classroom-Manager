<template>
  <div
    class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
  >
    <div class="mb-2 flex items-start justify-between gap-2">
      <div class="flex flex-wrap gap-1.5">
        <el-tag :type="typeTag.type" size="small">{{ typeTag.label }}</el-tag>
        <el-tag :type="diffTag.type" size="small" effect="plain">{{
          diffTag.label
        }}</el-tag>
        <el-tag size="small" type="info" effect="plain">{{
          question.grade
        }}</el-tag>
      </div>
      <span class="text-[11px] text-slate-400"
        >{{ question.points }} ពិន្ទុ</span
      >
    </div>

    <p class="mt-2 text-sm font-semibold text-slate-800 dark:text-white">
      {{ question.content }}
    </p>

    <!-- Options -->
    <ul v-if="question.type === 'mcq'" class="mt-3 space-y-1.5">
      <li
        v-for="opt in question.options"
        :key="opt.id"
        class="flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs"
        :class="
          opt.isCorrect
            ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
            : 'border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300'
        "
      >
        <span class="font-bold">{{ opt.id.toUpperCase() }}.</span>
        <span class="flex-1">{{ opt.text }}</span>
        <el-icon v-if="opt.isCorrect" class="text-emerald-500"
          ><CircleCheck
        /></el-icon>
      </li>
    </ul>

    <!-- True/False -->
    <div v-else-if="question.type === 'truefalse'" class="mt-3 text-xs">
      <span
        class="rounded-md bg-emerald-50 px-2 py-1 font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
      >
        ចម្លើយ៖ {{ question.correctAnswer === "true" ? "ត្រូវ" : "ខុស" }}
      </span>
    </div>

    <!-- Short answer -->
    <div
      v-else-if="question.type === 'short'"
      class="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs dark:bg-slate-900/40"
    >
      <strong>ចម្លើយ៖</strong> {{ question.correctAnswer }}
    </div>

    <!-- Explanation -->
    <p
      v-if="question.explanation"
      class="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-[11px] text-amber-800 dark:bg-amber-900/20 dark:text-amber-200"
    >
      💡 {{ question.explanation }}
    </p>

    <div
      class="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 dark:border-slate-700"
    >
      <div class="flex flex-wrap gap-1">
        <el-tag
          v-for="t in question.tags"
          :key="t"
          size="small"
          effect="plain"
          >{{ t }}</el-tag
        >
      </div>
      <div class="flex gap-1">
        <el-button text circle size="small" @click="$emit('edit', question.id)">
          <el-icon><EditPen /></el-icon>
        </el-button>
        <el-button
          text
          circle
          size="small"
          type="danger"
          @click="$emit('delete', question.id)"
        >
          <el-icon><Delete /></el-icon>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { EditPen, Delete, CircleCheck } from "@element-plus/icons-vue";
import type { Question } from "~/types";

const props = defineProps<{ question: Question }>();
defineEmits<{ edit: [string]; delete: [string] }>();

const typeTag = computed(
  () =>
    ({
      mcq: { label: "ពហុជម្រើស", type: "primary" as const },
      truefalse: { label: "ត្រូវ/ខុស", type: "success" as const },
      short: { label: "ខ្លី", type: "warning" as const },
      essay: { label: "អត្ថបទ", type: "danger" as const },
    })[props.question.type],
);

const diffTag = computed(
  () =>
    ({
      easy: { label: "ងាយ", type: "success" as const },
      medium: { label: "មធ្យម", type: "warning" as const },
      hard: { label: "ពិបាក", type: "danger" as const },
    })[props.question.difficulty],
);
</script>
