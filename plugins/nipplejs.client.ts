import nipplejs from "nipplejs";

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      nipplejs,
    },
  };
});
