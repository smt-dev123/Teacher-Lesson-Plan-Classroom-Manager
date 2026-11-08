<template>
  <div class="space-y-5">
    <!-- Header -->
    <div
      class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h3 class="text-lg font-bold text-slate-800 dark:text-white">
          ការគ្រប់គ្រងអ្នកប្រើប្រាស់
        </h3>
        <p class="text-sm text-slate-500">
          គ្រប់គ្រងគណនីគ្រូបង្រៀន និងបុគ្គលិកអប់រំក្នុងប្រព័ន្ធ
        </p>
      </div>
      <el-button type="primary" @click="openCreateModal">
        <el-icon><Plus /></el-icon> បន្ថែមអ្នកប្រើប្រាស់
      </el-button>
    </div>

    <!-- Stat Cards -->
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
      >
        <div class="flex items-center justify-between">
          <span
            class="text-sm font-semibold text-slate-500 dark:text-slate-400"
          >
            {{ stat.label }}
          </span>
          <div
            class="flex h-8 w-8 items-center justify-center rounded-lg"
            :class="stat.bgClass"
          >
            <el-icon :class="stat.textClass"
              ><component :is="stat.icon"
            /></el-icon>
          </div>
        </div>
        <div class="mt-2 text-2xl font-bold text-slate-800 dark:text-white">
          {{ stat.value }}
        </div>
      </div>
    </div>

    <!-- Filter & Table Card -->
    <div
      class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
    >
      <div
        class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <div class="flex flex-1 flex-wrap items-center gap-2">
          <el-input
            v-model="search"
            placeholder="ស្វែងរកតាមឈ្មោះ ឬអ៊ីមែល..."
            class="!w-64"
            clearable
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>

          <el-select
            v-model="roleFilter"
            placeholder="តួនាទី"
            class="!w-40"
            clearable
          >
            <el-option label="តួនាទីទាំងអស់" value="" />
            <el-option label="គ្រូបង្រៀន" value="គ្រូបង្រៀន" />
            <el-option label="ប្រធានដេប៉ាតឺម៉ង់" value="ប្រធានដេប៉ាតឺម៉ង់" />
            <el-option label="អ្នកគ្រប់គ្រង" value="អ្នកគ្រប់គ្រង" />
          </el-select>

          <el-select
            v-model="statusFilter"
            placeholder="ស្ថានភាព"
            class="!w-32"
            clearable
          >
            <el-option label="ស្ថានភាពទាំងអស់" value="" />
            <el-option label="សកម្ម" value="active" />
            <el-option label="ផ្អាក" value="inactive" />
          </el-select>
        </div>

        <span class="text-sm text-slate-500">
          បង្ហាញ <b class="text-sky-600">{{ filteredUsers.length }}</b> នាក់
        </span>
      </div>

      <!-- User Table -->
      <el-table :data="filteredUsers" class="w-full" stripe>
        <el-table-column label="អ្នកប្រើប្រាស់" min-width="200">
          <template #default="{ row }">
            <div class="flex items-center gap-3">
              <el-avatar
                :size="36"
                :src="row.avatar"
                class="ring-2 ring-sky-500/20"
              />
              <div>
                <h5 class="text-sm font-bold text-slate-800 dark:text-white">
                  {{ row.name }}
                </h5>
                <span class="text-[11px] text-slate-400">{{ row.email }}</span>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="លេខទូរស័ព្ទ" prop="phone" width="130" />

        <el-table-column label="មុខវិជ្ជា" min-width="120">
          <template #default="{ row }">
            <span class="text-sm text-slate-600 dark:text-slate-300">{{
              row.subject || "-"
            }}</span>
          </template>
        </el-table-column>

        <el-table-column label="តួនាទី" width="150">
          <template #default="{ row }">
            <el-tag
              :type="
                row.role === 'អ្នកគ្រប់គ្រង'
                  ? 'danger'
                  : row.role === 'ប្រធានដេប៉ាតឺម៉ង់'
                    ? 'warning'
                    : 'info'
              "
              effect="light"
            >
              {{ row.role }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="ស្ថានភាព" width="100">
          <template #default="{ row }">
            <el-switch v-model="row.active" @change="toggleUserStatus(row)" />
          </template>
        </el-table-column>

        <el-table-column label="សកម្មភាព" width="110" align="right">
          <template #default="{ row }">
            <el-button text circle type="primary" @click="openEditModal(row)">
              <el-icon><Edit /></el-icon>
            </el-button>
            <el-button text circle type="danger" @click="deleteUser(row.id)">
              <el-icon><Delete /></el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- Modal Form -->
    <el-dialog
      v-model="modalVisible"
      :title="
        isEdit ? 'កែប្រែព័ត៌មានអ្នកប្រើប្រាស់' : 'បន្ថែមអ្នកប្រើប្រាស់ថ្មី'
      "
      width="min(720px, 92vw)"
      align-center
    >
      <el-form label-position="top" class="space-y-1">
        <el-form-item label="ឈ្មោះពេញ" required>
          <el-input v-model="form.name" placeholder="ឧ. លោកគ្រូ កែវ សំណាង" />
        </el-form-item>

        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="អ៊ីមែល" required>
              <el-input
                v-model="form.email"
                placeholder="example@school.edu.kh"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="លេខទូរស័ព្ទ">
              <el-input v-model="form.phone" placeholder="012 345 678" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="តួនាទី" required>
              <el-select v-model="form.role" class="w-full">
                <el-option label="គ្រូបង្រៀន" value="គ្រូបង្រៀន" />
                <el-option
                  label="ប្រធានដេប៉ាតឺម៉ង់"
                  value="ប្រធានដេប៉ាតឺម៉ង់"
                />
                <el-option label="អ្នកគ្រប់គ្រង" value="អ្នកគ្រប់គ្រង" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="មុខវិជ្ជាបង្រៀន">
              <el-input v-model="form.subject" placeholder="ឧ. រូបវិទ្យា" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item :label="isEdit ? 'ពាក្យសម្ងាត់ថ្មី (ទុកទទេបើមិនប្តូរ)' : 'ពាក្យសម្ងាត់'">
          <el-input
            v-model="form.password"
            type="password"
            show-password
            placeholder="យ៉ាងតិច ៦ តួអក្សរ (Default: 123456)"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="modalVisible = false">បោះបង់</el-button>
        <el-button type="primary" @click="saveUser">រក្សាទុក</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, onMounted } from "vue";
import {
  Plus,
  Search,
  Edit,
  Delete,
  User,
  UserFilled,
  CircleCheck,
  Management,
} from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";

interface UserItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "គ្រូបង្រៀន" | "ប្រធានដេប៉ាតឺម៉ង់" | "អ្នកគ្រប់គ្រង";
  subject: string;
  avatar: string;
  active: boolean;
}

const search = ref("");
const roleFilter = ref("");
const statusFilter = ref("");
const modalVisible = ref(false);
const isEdit = ref(false);

const users = ref<UserItem[]>([]);

const form = reactive({
  id: "",
  name: "",
  email: "",
  phone: "",
  role: "គ្រូបង្រៀន" as UserItem["role"],
  subject: "",
  password: "",
});

const stats = computed(() => [
  {
    label: "អ្នកប្រើប្រាស់សរុប",
    value: users.value.length,
    icon: User,
    bgClass: "bg-sky-50 dark:bg-sky-900/30",
    textClass: "text-sky-600 dark:text-sky-400",
  },
  {
    label: "គ្រូបង្រៀន",
    value: users.value.filter((u) => u.role === "គ្រូបង្រៀន").length,
    icon: UserFilled,
    bgClass: "bg-indigo-50 dark:bg-indigo-900/30",
    textClass: "text-indigo-600 dark:text-indigo-400",
  },
  {
    label: "គណនីសកម្ម",
    value: users.value.filter((u) => u.active).length,
    icon: CircleCheck,
    bgClass: "bg-emerald-50 dark:bg-emerald-900/30",
    textClass: "text-emerald-600 dark:text-emerald-400",
  },
  {
    label: "អ្នកគ្រប់គ្រង",
    value: users.value.filter((u) => u.role === "អ្នកគ្រប់គ្រង").length,
    icon: Management,
    bgClass: "bg-amber-50 dark:bg-amber-900/30",
    textClass: "text-amber-600 dark:text-amber-400",
  },
]);

const filteredUsers = computed(() => {
  return users.value.filter((u) => {
    const matchSearch =
      !search.value ||
      u.name.toLowerCase().includes(search.value.toLowerCase()) ||
      u.email.toLowerCase().includes(search.value.toLowerCase());
    const matchRole = !roleFilter.value || u.role === roleFilter.value;
    const matchStatus =
      !statusFilter.value ||
      (statusFilter.value === "active" ? u.active : !u.active);
    return matchSearch && matchRole && matchStatus;
  });
});

const openCreateModal = () => {
  isEdit.value = false;
  Object.assign(form, {
    id: "",
    name: "",
    email: "",
    phone: "",
    role: "គ្រូបង្រៀន",
    subject: "",
    password: "",
  });
  modalVisible.value = true;
};

const openEditModal = (row: UserItem) => {
  isEdit.value = true;
  Object.assign(form, {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    role: row.role,
    subject: row.subject,
    password: "",
  });
  modalVisible.value = true;
};

const loadUsers = async () => {
  try {
    const res = await $fetch<{ success: boolean; data: any[] }>("/api/users");
    if (res?.data) {
      users.value = res.data.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone || "",
        role: u.role || "គ្រូបង្រៀន",
        subject: u.subject || "",
        avatar:
          u.avatar ||
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
        active: u.status === "សកម្ម",
      }));
    }
  } catch (err) {
    console.error("Failed to load users from API:", err);
  }
};

onMounted(loadUsers);

const saveUser = async () => {
  if (!form.name || !form.email) {
    ElMessage.warning("សូមបំពេញឈ្មោះ និងអ៊ីមែល");
    return;
  }
  try {
    if (isEdit.value) {
      const payload: any = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        role: form.role,
        subject: form.subject,
        status: "សកម្ម",
      };
      if (form.password) {
        payload.password = form.password;
      }
      await $fetch(`/api/users/${form.id}`, {
        method: "PUT",
        body: payload,
      });
      ElMessage.success("បានកែប្រែព័ត៌មានអ្នកប្រើប្រាស់ជោគជ័យ");
    } else {
      await $fetch("/api/users", {
        method: "POST",
        body: {
          name: form.name,
          email: form.email,
          phone: form.phone,
          role: form.role,
          subject: form.subject,
          status: "សកម្ម",
          password: form.password || "123456",
        },
      });
      ElMessage.success("បានបន្ថែមអ្នកប្រើប្រាស់ថ្មីជោគជ័យ");
    }
    await loadUsers();
    modalVisible.value = false;
  } catch (err) {
    console.error("Save user error:", err);
    ElMessage.error("មានបញ្ហាក្នុងការរក្សាទុកអ្នកប្រើប្រាស់");
  }
};

const toggleUserStatus = async (row: UserItem) => {
  try {
    await $fetch(`/api/users/${row.id}`, {
      method: "PUT",
      body: {
        status: row.active ? "សកម្ម" : "ផ្អាក",
      },
    });
    ElMessage.success(
      `គណនី ${row.name} ត្រូវបាន ${row.active ? "បើកដំណើរការ" : "ផ្អាកបណ្តោះអាសន្ន"}`
    );
  } catch (err) {
    row.active = !row.active;
    ElMessage.error("មិនអាចផ្លាស់ប្តូរស្ថានភាពបានទេ");
  }
};

const deleteUser = (id: string) => {
  ElMessageBox.confirm(
    "តើអ្នកពិតជាចង់លុបគណនីអ្នកប្រើប្រាស់នេះមែនទេ?",
    "បញ្ជាក់ការលុប",
    {
      confirmButtonText: "លុប",
      cancelButtonText: "បោះបង់",
      type: "warning",
    },
  )
    .then(async () => {
      try {
        await $fetch(`/api/users/${id}`, { method: "DELETE" });
        await loadUsers();
        ElMessage.success("បានលុបអ្នកប្រើប្រាស់ជោគជ័យ");
      } catch (err) {
        ElMessage.error("មានបញ្ហាក្នុងការលុប");
      }
    })
    .catch(() => {});
};
</script>
