<template>
  <ClientOnly>
    <div class="rich-editor-wrapper">
      <Toolbar
        :editor="editorRef"
        :default-config="toolbarConfig"
        :mode="mode"
        class="border-b border-slate-200 dark:border-slate-700"
      />
      <Editor
        v-model="valueHtml"
        :default-config="editorConfig"
        :mode="mode"
        class="rich-editor-body"
        @on-created="handleCreated"
        @on-change="handleChange"
      />
    </div>
    <template #fallback>
      <div class="rich-editor-wrapper rich-editor-fallback" />
    </template>
  </ClientOnly>
</template>

<script lang="ts" setup>
import "@wangeditor/editor/dist/css/style.css";
import { onBeforeUnmount, onMounted, ref, shallowRef, watch } from "vue";
import type {
  IDomEditor,
  IEditorConfig,
  IToolbarConfig,
} from "@wangeditor/editor";

const props = withDefaults(
  defineProps<{
    modelValue: string;
    placeholder?: string;
    height?: number;
    mode?: "default" | "simple";
    readOnly?: boolean;
  }>(),
  {
    modelValue: "",
    placeholder: "សរសេរខ្លឹមសារនៅទីនេះ...",
    height: 200,
    mode: "default",
    readOnly: false,
  },
);

const emit = defineEmits<{ "update:modelValue": [string] }>();

const editorRef = shallowRef<IDomEditor>();
const valueHtml = ref(props.modelValue);

watch(
  () => props.modelValue,
  (v) => {
    if (v !== valueHtml.value) valueHtml.value = v;
  },
);

watch(valueHtml, (v) => emit("update:modelValue", v));

/* Toolbar config */
const toolbarConfig: Partial<IToolbarConfig> = {
  toolbarKeys: [
    "bold",
    "italic",
    "underline",
    "through",
    "|",
    "color",
    "bgColor",
    "|",
    "fontSize",
    "fontFamily",
    "|",
    "bulletedList",
    "numberedList",
    "|",
    "justifyLeft",
    "justifyCenter",
    "justifyRight",
    "|",
    "uploadImage",
    "insertImage",
    "insertVideo",
    "|",
    "undo",
    "redo",
  ],
};

/* Editor config */
const editorConfig: Partial<IEditorConfig> = {
  placeholder: props.placeholder,
  readOnly: props.readOnly,
  MENU_CONF: {
    fontFamily: {
      fontFamilyList: [
        "Kantumruy Pro",
        "Moul",
        "Arial",
        "Tahoma",
        "Verdana",
        "Times New Roman",
        "Courier New",
      ],
    },
    uploadImage: {
      // ប្រើ base64 សម្រាប់ demo — ក្នុង production គួរ upload ទៅ server
      base64LimitSize: 5 * 1024 * 1024, // 5MB
    },
  },
};

onMounted(async () => {
  if (typeof window !== "undefined") {
    const origWarn = console.warn;
    console.warn = (...args: any[]) => {
      if (
        typeof args[0] === "string" &&
        args[0].includes("Textarea height < 300px")
      ) {
        return;
      }
      origWarn.apply(console, args);
    };
  }
  const { i18nChangeLanguage } = await import("@wangeditor/editor");
  i18nChangeLanguage("en");
});

const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor;
  // កំណត់កម្ពស់
  const container = editor.getEditableContainer();
  if (container) {
    container.style.minHeight = `${props.height}px`;
    container.style.overflowY = "auto";
  }
};

const handleChange = (editor: IDomEditor) => {
  if (!editor || !editorRef.value) return;
  emit("update:modelValue", editor.getHtml());
};

onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor) editor.destroy();
});
</script>

<style scoped>
.rich-editor-wrapper {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
}

.rich-editor-fallback {
  min-height: 120px;
}

.dark .rich-editor-wrapper {
  border-color: #475569;
  background: #1e293b;
}

.rich-editor-body :deep(.w-e-text-container) {
  font-family: "Kantumruy Pro", sans-serif;
}
</style>
