<template>
  <div
    class="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-900"
  >
    <div class="w-full max-w-md space-y-6">
      <!-- School / System Brand -->
      <div class="text-center space-y-2">
        <div
          class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-lg shadow-sky-600/30"
        >
          <el-icon :size="28"><Reading /></el-icon>
        </div>
        <h2 class="font-moul text-base text-slate-800 dark:text-white pt-1">
          ប្រព័ន្ធគ្រប់គ្រងកិច្ចតែងការ
        </h2>
        <p class="text-xs text-slate-500 dark:text-slate-400">
          ចូលប្រើប្រាស់គណនីគ្រូបង្រៀន និងគណៈគ្រប់គ្រងសាលា
        </p>
      </div>

      <!-- Card Box -->
      <div
        class="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-800/90 dark:shadow-none sm:p-8"
      >
        <!-- Tabs (Login / Register) -->
        <div class="mb-6 flex rounded-xl bg-slate-100 p-1 dark:bg-slate-700/50">
          <button
            type="button"
            class="flex-1 rounded-lg py-2 text-xs font-bold transition"
            :class="
              isRegister
                ? 'text-slate-600 dark:text-slate-300'
                : 'bg-white text-sky-600 shadow-sm dark:bg-slate-800 dark:text-white'
            "
            @click="isRegister = false"
          >
            ចូលប្រព័ន្ធ (Login)
          </button>
          <button
            type="button"
            class="flex-1 rounded-lg py-2 text-xs font-bold transition"
            :class="
              isRegister
                ? 'bg-white text-sky-600 shadow-sm dark:bg-slate-800 dark:text-white'
                : 'text-slate-600 dark:text-slate-300'
            "
            @click="isRegister = true"
          >
            ចុះឈ្មោះគ្រូថ្មី (Register)
          </button>
        </div>

        <!-- Login Form -->
        <form v-if="!isRegister" class="space-y-4" @submit.prevent="handleLogin">
          <div>
            <label class="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-200">
              អ៊ីមែល (Email)
            </label>
            <el-input
              v-model="loginForm.email"
              placeholder="ឧ. chanthorn.sok@school.edu.kh"
              size="large"
              clearable
              autocomplete="email"
            >
              <template #prefix>
                <el-icon><Message /></el-icon>
              </template>
            </el-input>
          </div>

          <div>
            <div class="mb-1.5 flex items-center justify-between">
              <label class="text-xs font-semibold text-slate-700 dark:text-slate-200">
                ពាក្យសម្ងាត់ (Password)
              </label>
            </div>
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="បញ្ចូលពាក្យសម្ងាត់របស់អ្នក"
              size="large"
              show-password
              autocomplete="current-password"
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </div>

          <div class="flex items-center justify-between pt-1">
            <el-checkbox v-model="rememberMe" label="ចងចាំគណនីខ្ញុំ" size="small" />
          </div>

          <el-button
            type="primary"
            size="large"
            class="!w-full !rounded-xl !mt-2 !font-bold"
            :loading="loading"
            native-type="submit"
          >
            ចូលប្រើប្រាស់ប្រព័ន្ធ
          </el-button>
        </form>

        <!-- Register Form -->
        <form v-else class="space-y-3" @submit.prevent="handleRegister">
          <div>
            <label class="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-200">
              ឈ្មោះពេញ (Full Name) <span class="text-red-500">*</span>
            </label>
            <el-input
              v-model="registerForm.name"
              placeholder="ឧ. លោកគ្រូ ម៉ៅ ចិន្តា"
              size="large"
            >
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
          </div>

          <div>
            <label class="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-200">
              អ៊ីមែល (Email) <span class="text-red-500">*</span>
            </label>
            <el-input
              v-model="registerForm.email"
              placeholder="ឧ. chenda.mao@school.edu.kh"
              size="large"
              autocomplete="email"
            >
              <template #prefix>
                <el-icon><Message /></el-icon>
              </template>
            </el-input>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-200">
                មុខវិជ្ជា
              </label>
              <el-input
                v-model="registerForm.subject"
                placeholder="ឧ. ភាសាខ្មែរ"
                size="large"
              />
            </div>
            <div>
              <label class="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-200">
                លេខទូរស័ព្ទ
              </label>
              <el-input
                v-model="registerForm.phone"
                placeholder="012 345 678"
                size="large"
              />
            </div>
          </div>

          <div>
            <label class="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-200">
              ពាក្យសម្ងាត់ (Password) <span class="text-red-500">*</span>
            </label>
            <el-input
              v-model="registerForm.password"
              type="password"
              placeholder="យ៉ាងតិច ៦ តួអក្សរ"
              size="large"
              show-password
              autocomplete="new-password"
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </div>

          <el-button
            type="primary"
            size="large"
            class="!w-full !rounded-xl !mt-2 !font-bold"
            :loading="loading"
            native-type="submit"
          >
            ចុះឈ្មោះគណនីថ្មី
          </el-button>
        </form>
      </div>

      <!-- Footer Info -->
      <p class="text-center text-xs text-slate-400">
        ប្រព័ន្ធទិន្នន័យកិច្ចតែងការបង្រៀន • តភ្ជាប់ផ្ទាល់ជាមួយ PostgreSQL Database
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import { Reading, Message, Lock, User } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { useAuthStore } from "~/stores/auth";

definePageMeta({
  layout: false,
});

const authStore = useAuthStore();
const { loading } = storeToRefs(authStore);

const isRegister = ref(false);
const rememberMe = ref(true);

const loginForm = reactive({
  email: "",
  password: "",
});

const registerForm = reactive({
  name: "",
  email: "",
  password: "",
  phone: "",
  role: "គ្រូបង្រៀន",
  subject: "រូបវិទ្យា",
});

onMounted(() => {
  if (import.meta.client) {
    const savedEmail = localStorage.getItem("saved_login_email");
    if (savedEmail) {
      loginForm.email = savedEmail;
    }
  }
});

const handleLogin = async () => {
  if (!loginForm.email.trim() || !loginForm.password) {
    ElMessage.warning("សូមបញ្ចូលអ៊ីមែល និងពាក្យសម្ងាត់ឱ្យបានត្រឹមត្រូវ");
    return;
  }
  try {
    const user = await authStore.login(loginForm.email.trim(), loginForm.password);
    if (user) {
      if (import.meta.client) {
        if (rememberMe.value) {
          localStorage.setItem("saved_login_email", loginForm.email.trim());
        } else {
          localStorage.removeItem("saved_login_email");
        }
      }
      ElMessage.success(`ស្វាគមន៍ការចូលប្រព័ន្ធ, ${user.name}!`);
      await navigateTo("/lesson-plans");
    }
  } catch (err: any) {
    ElMessage.error(err?.data?.statusMessage || "អ៊ីមែល ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ");
  }
};

const handleRegister = async () => {
  if (!registerForm.name.trim() || !registerForm.email.trim() || !registerForm.password) {
    ElMessage.warning("សូមបំពេញព័ត៌មានចាំបាច់ (ឈ្មោះ អ៊ីមែល ពាក្យសម្ងាត់)");
    return;
  }
  if (registerForm.password.length < 6) {
    ElMessage.warning("ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច ៦ តួអក្សរ");
    return;
  }
  try {
    const user = await authStore.register({
      name: registerForm.name.trim(),
      email: registerForm.email.trim(),
      password: registerForm.password,
      phone: registerForm.phone.trim(),
      role: registerForm.role,
      subject: registerForm.subject.trim(),
    });
    if (user) {
      ElMessage.success(`ចុះឈ្មោះជោគជ័យ! ស្វាគមន៍ ${user.name}`);
      await navigateTo("/lesson-plans");
    }
  } catch (err: any) {
    ElMessage.error(err?.data?.statusMessage || "មានបញ្ហាក្នុងការចុះឈ្មោះ");
  }
};
</script>
