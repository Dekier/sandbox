interface State {
  color: string;
  colorBackground: string;
  colorFlower: string;
  isStartedGame: boolean;
}
export const useGeneralStore = defineStore("GeneralStore", {
  state: (): State => {
    return {
      color: "#286a81",
      colorBackground: "#213545",
      colorFlower: "#318f9b",
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
    setColorFlower(data: string) {
      this.colorFlower = data;
    },
    setIsStartedGame(data: boolean) {
      this.isStartedGame = data;
    },
  },
});
