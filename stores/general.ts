interface State {
  isMobile: boolean;
}
export const useGeneralStore = defineStore("GeneralStore", {
  state: (): State => {
    return {
      isMobile: false,
    };
  },
  getters: {},
  actions: {
    setIsMobile(data: boolean) {
      this.isMobile = data;
    },
  },
});
