// https://nuxt.com/docs/api/configuration/nuxt-config
import glsl from "vite-plugin-glsl";
export default defineNuxtConfig({
  devServer: {
    port: 3000,
  },
  imports: {
    dirs: ["stores"],
  },

  modules: [
    "@tresjs/nuxt",
    "@hypernym/nuxt-gsap",
    [
      "@pinia/nuxt",
      {
        autoImports: ["defineStore", "definePiniaStore"],
      },
    ],
  ],
  css: ["@/assets/styles/main.scss"],
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
