<template>
  <div
    class="grid h-screen w-screen overflow-hidden transition-[grid-template-columns] duration-300 ease-in-out"
    :style="{ gridTemplateColumns: `${layoutStore.currentWidth} 1fr` }"
  >
    <!-- ================= SIDEBAR ================= -->
    <DashboardSidebar class="h-screen min-h-0 overflow-hidden" />

    <!-- ================= MAIN ================= -->
    <div
      class="grid h-screen min-h-0 min-w-0 overflow-hidden"
      style="grid-template-rows: 56px 1fr"
    >
      <!-- Header -->
      <DashboardHeader class="relative z-10 h-14 min-h-14 bg-white" />

      <!-- Main content -->
      <main class="relative min-h-0 min-w-0 overflow-hidden">
        <el-scrollbar class="absolute inset-0 h-full">
          <div class="box-border min-h-full w-full min-w-0 px-4 py-6">
            <slot />
          </div>
        </el-scrollbar>
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, nextTick } from "vue";
import DashboardHeader from "@/components/layout/DashboardHeader.vue";
import DashboardSidebar from "@/components/layout/DashboardSidebar.vue";
import { useLayoutStore } from "@/stores/layout";

const layoutStore = useLayoutStore();

const handleResize = () => {
  const isMobile = window.innerWidth < 768;
  layoutStore.setMobileStatus(isMobile);
};

onMounted(async () => {
  handleResize();
  window.addEventListener("resize", handleResize);

  await nextTick();
  window.dispatchEvent(new Event("resize"));
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>
