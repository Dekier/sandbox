interface State {
  color: string;
  colorBackground: string;
}
export const useGeneralStore = defineStore("GeneralStore", {
  state: (): State => {
    return {
      color: "#7c715a",
      colorBackground: "#4b4230",
    };
  },
  getters: {},
  actions: {
    setColor(data: string) {
      this.color = data;
    },
    setColorBackground(data: string) {
      this.colorBackground = data;
    },
  },
});
