interface State {}
export const useGeneralStore = defineStore("GeneralStore", {
  state: (): State => {
    return {};
  },
  getters: {},
  actions: {
    setIsMobile(data: boolean) {},
  },
});
