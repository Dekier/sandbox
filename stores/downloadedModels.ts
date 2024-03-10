interface State {
  smallStick: any;
}
export const useDownloadedModels = defineStore("useDownloadedModels", {
  state: (): State => {
    return {
      smallStick: null,
    };
  },
  getters: {},
  actions: {
    setSmallStick(data: any) {
      this.smallStick = data;
    },
  },
});
