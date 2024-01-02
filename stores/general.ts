interface State {
  color: string;
  colorStone: string;
  colorTrees: string;
  isStartedGame: boolean;
}
export const useGeneralStore = defineStore("GeneralStore", {
  state: (): State => {
    return {
      color: "#15513d",
      // color: "#adadads",
      colorStone: "#6C7644",
      colorTrees: "#105133",
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
