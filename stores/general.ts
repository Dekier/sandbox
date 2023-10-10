interface State {
  mouse: {
    x: number;
    y: number;
  };
}
export const useGeneralStore = defineStore("GeneralStore", {
  state: (): State => {
    return {
      mouse: {
        x: 0,
        y: 0,
      },
    };
  },
  getters: {},
  actions: {
    setMouseMove(data: { x: number; y: number }) {
      this.mouse = data;
    },
  },
});
