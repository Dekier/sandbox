// https://nuxt.com/docs/api/configuration/nuxt-config
import glsl from "vite-plugin-glsl";
export default defineNuxtConfig({
  devServer: {
    port: 4000,
  },
  devtools: { enabled: true },
  modules: ["@tresjs/nuxt"],
  vite: {
    plugins: [glsl({ root: "/public/shaders/" })],
  },
});
