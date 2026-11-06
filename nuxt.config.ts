// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@element-plus/nuxt", "@pinia/nuxt", "@nuxtjs/tailwindcss"],
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  app: {
    head: {
      title: "ប្រព័ន្ធគ្រប់គ្រងកិច្ចតែងការ - គ្រូបង្រៀន",
      link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@300;400;500;600;700&family=Moul&display=swap",
        },
      ],
    },
  },
  css: ["~/assets/css/main.css"],
});
