import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  css: ["@/assets/css/main.css"],
  devtools: { enabled: true },

  vite: {
    plugins: [tailwindcss()],
  },
  modules: [
    "@nuxt/icon",
    "@compodium/nuxt",
    "@nuxt/ui",
    "@nuxtjs/i18n",
    "@pinia/nuxt",
  ],
  ssr: true,
  i18n: {
    locales: [
      { code: "en", iso: "en-US", name: "English", file: "en.json" },
      { code: "uz", iso: "uz-UZ", name: "Uzbek", file: "uz.json" },
      { code: "ru", iso: "ru-RU", name: "Russian", file: "ru.json" },
    ],
    // defaultLocale: "uz",
    lazy: true,
    strategy: "prefix_and_default",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
    },
  },
});
