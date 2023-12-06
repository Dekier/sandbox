interface State {
  color: string;
  colorBackground: string;
  isStartedGame: boolean;
}
export const useGeneralStore = defineStore("GeneralStore", {
  state: (): State => {
    return {
      color: "#7c715a",
      colorBackground: "#4b4230",
      isStartedGame: false,
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
    setIsStartedGame(data: boolean) {
      this.isStartedGame = data;
      console.log("data", data);
    },
  },
});
