interface State {
  color: string;
  colorFlower: string;
  colorTrees: string;
  isStartedGame: boolean;
}
export const useGeneralStore = defineStore("GeneralStore", {
  state: (): State => {
    return {
      color: "#6e3a47",
      colorFlower: "#6C7644",
      colorTrees: "#5c703e",
      isStartedGame: false,
    };
  },
  getters: {},
  actions: {
    setColor(data: string) {
      this.color = data;
    },
    setColorFlower(data: string) {
      this.colorFlower = data;
    },
    setColorTrees(data: string) {
      this.colorTrees = data;
    },
    setIsStartedGame(data: boolean) {
      this.isStartedGame = data;
    },
  },
});
