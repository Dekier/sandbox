import MersenneTwister from "mersenne-twister";

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      MersenneTwister,
    },
  };
});
