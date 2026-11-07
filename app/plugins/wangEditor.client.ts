import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { i18nChangeLanguage } from "@wangeditor/editor";

// កំណត់ភាសាអង់គ្លេសភ្លាមៗពេល import មុនពេល Editor/Toolbar render
i18nChangeLanguage("en");

// បិទ Warning អំពី "Textarea height < 300px" របស់ WangEditor ក្នុង console
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

export default defineNuxtPlugin((nuxtApp) => {
  i18nChangeLanguage("en");
  nuxtApp.vueApp.component("Editor", Editor);
  nuxtApp.vueApp.component("Toolbar", Toolbar);
});
