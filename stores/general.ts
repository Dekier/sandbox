interface State {
  color: string;
  colorStone: string;
  colorTrees: string;
  isStartedGame: boolean;
}
export const useGeneralStore = defineStore("GeneralStore", {
  state: (): State => {
    return {
      color: "#226756",
      // color: "#adadads",
      colorStone: "#6C7644",
      colorTrees: "#165037",
      isStartedGame: false,
    };
  },
  getters: {},
  actions: {
    setColor(data: string) {
      this.color = data;
    },
    setColorStone(data: string) {
      this.colorStone = data;
    },
    setColorTrees(data: string) {
      this.colorTrees = data;
    },
    setIsStartedGame(data: boolean) {
      this.isStartedGame = data;
    },
  },
});
