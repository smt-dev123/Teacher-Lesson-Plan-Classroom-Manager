<template>
  <div
    class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
  >
    <div class="mb-4 flex items-center justify-between">
      <div>
        <h3 class="text-lg font-bold text-slate-800 dark:text-white">
          កាលវិភាគបង្រៀនប្រចាំសប្តាហ៍
        </h3>
        <p class="text-xs text-slate-500">ម៉ោងសរុប ១៨ ម៉ោង/សប្តាហ៍</p>
      </div>
      <el-button @click="() => window.print()">
        <el-icon><Printer /></el-icon> បោះពុម្ព
      </el-button>
    </div>

    <el-table :data="timetable" border size="small">
      <el-table-column prop="time" label="ម៉ោង" width="120" fixed />
      <el-table-column v-for="d in days" :key="d.key" :label="d.label">
        <template #default="{ row }">
          <div v-if="row[d.key]" class="text-center">
            <div class="font-bold text-sky-700 dark:text-sky-400">
              {{ row[d.key].subject }}
            </div>
            <div class="text-[10px] text-slate-500">{{ row[d.key].room }}</div>
          </div>
          <span v-else class="text-slate-300">—</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { Printer } from "@element-plus/icons-vue";

const days = [
  { key: "mon", label: "ច័ន្ទ" },
  { key: "tue", label: "អង្គារ" },
  { key: "wed", label: "ពុធ" },
  { key: "thu", label: "ព្រហស្បតិ៍" },
  { key: "fri", label: "សុក្រ" },
  { key: "sat", label: "សៅរ៍" },
];

const timetable = [
  {
    time: "07:00-07:50",
    mon: { subject: "រូបវិទ្យា (៩A)", room: "បន្ទប់ ១០១" },
    wed: { subject: "រូបវិទ្យា (៩C)", room: "បន្ទប់ ១០៣" },
    fri: { subject: "គីមីវិទ្យា (៨B)", room: "បន្ទប់ ២០២" },
  },
  {
    time: "08:00-08:50",
    mon: { subject: "រូបវិទ្យា (៩B)", room: "បន្ទប់ ២០៤" },
    tue: { subject: "ពិសោធន៍ (៩A)", room: "Lab 1" },
    thu: { subject: "រូបវិទ្យា (៩B)", room: "បន្ទប់ ២០៤" },
    sat: { subject: "បំប៉ន", room: "បណ្ណាល័យ" },
  },
  {
    time: "09:10-10:00",
    tue: { subject: "គីមីវិទ្យា (៨A)", room: "បន្ទប់ ២០១" },
    wed: { subject: "រូបវិទ្យា (៧A)", room: "បន្ទប់ ១០៤" },
    fri: { subject: "រូបវិទ្យា (៧B)", room: "បន្ទប់ ១០៥" },
  },
  {
    time: "10:05-10:55",
    wed: { subject: "ប្រជុំបច្ចេកទេស", room: "ការិយាល័យគ្រូ" },
    thu: { subject: "គីមីវិទ្យា (៨A)", room: "បន្ទប់ ២០១" },
  },
];
</script>
