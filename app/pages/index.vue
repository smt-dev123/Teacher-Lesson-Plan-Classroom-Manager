<template>
  <div class="space-y-5">
    <!-- Stats -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="កិច្ចតែងការសរុប"
        :value="plans.length"
        subtitle="តាមស្តង់ដារ ៥ ជំហាន"
        icon="Document"
        color="sky"
      />
      <StatCard
        label="មេរៀនសកម្ម"
        :value="plans.length + 4"
        subtitle="កំពុងបង្រៀន"
        icon="Reading"
        color="indigo"
      />
      <StatCard
        label="កិច្ចការត្រូវកែ"
        :value="pendingCount"
        subtitle="សិស្សដាក់ស្នើ"
        icon="EditPen"
        color="amber"
      />
      <StatCard
        label="ម៉ោងបង្រៀន"
        value="18 ម៉ោង"
        subtitle="ថ្នាក់ ៧A, ៨B, ៩C"
        icon="Timer"
        color="emerald"
      />
    </div>

    <!-- Banner -->
    <div
      class="rounded-2xl bg-gradient-to-r from-sky-700 to-sky-500 p-6 text-white shadow-lg"
    >
      <span
        class="inline-block rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide"
      >
        កាលវិភាគបង្រៀនបន្ទាប់
      </span>
      <h3 class="mt-2 text-lg font-bold md:text-xl">
        ថ្នាក់ទី៩B • រូបវិទ្យា: ច្បាប់ចលនាទី២ ញូតុន
      </h3>
      <p class="mt-1 text-xs text-sky-100">
        ⏰ ០៨:០០ - ០៨:៥០ ព្រឹក • 🚪 បន្ទប់ ២០៤
      </p>
    </div>

    <!-- 2 cols -->
    <div class="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <RecentPlans :plans="plans.slice(0, 4)" class="lg:col-span-2" />
      <HomeworkList :assignments="assignments" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from "vue";
import StatCard from "~/components/dashboard/StatCard.vue";
import { useLessonPlans } from "~/composables/useLessonPlans";
import { useAssignments } from "~/composables/useAssignments";

definePageMeta({ layout: "default" });

const { plans, load } = useLessonPlans();
const { items: assignments, load: loadA } = useAssignments();

onMounted(() => {
  load();
  loadA();
});

const pendingCount = computed(
  () => assignments.value.filter((a) => a.submitted < a.total).length,
);
</script>
