// https://nuxt.com/docs/api/configuration/nuxt-config
import glsl from "vite-plugin-glsl";
export default defineNuxtConfig({
  devServer: {
    port: 4000,
  },
  imports: {
    dirs: ["store"],
  },

  devtools: { enabled: true },
  modules: [
    "@tresjs/nuxt",
    "@hypernym/nuxt-gsap",
    "@nuxtjs/device",
    [
      "@pinia/nuxt",
      {
        autoImports: ["defineStore", "definePiniaStore"],
      },
    ],
  ],
  css: [
    { src: "@/assets/styles/main.scss", lang: "sass" },
    { src: "@tresjs/leches/dist/style.css", lang: "css" },
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData:
            '@import "@/assets/styles/variables.scss"; @import "@/assets/styles/mixins.scss";',
        },
      },
    },
    plugins: [glsl({ root: "/public/shaders/" })],
  },
});
