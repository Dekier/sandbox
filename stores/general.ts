interface State {
  color: string;
  colorStone: string;
  colorTrees: string;
  colorSand: string;
  isStartedGame: boolean;
  isActiveMenuGame: boolean;
  isMouseLocked: boolean;
}
export const useGeneralStore = defineStore("GeneralStore", {
  state: (): State => {
    return {
      color: "#457866",
      // '#225846'
      // color: "#adadads",
      colorStone: "#6C7644",
      colorTrees: "#2a5143",
      colorSand: "#736c54",
      isStartedGame: false,
      isActiveMenuGame: true,
      isMouseLocked: false,
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
    setColorSand(data: string) {
      this.colorSand = data;
    },
    setIsStartedGame(data: boolean) {
      this.isStartedGame = data;
    },
    setIsActiveMenuGame(data: boolean) {
      this.isActiveMenuGame = data;
    },
    setIsMouseLocked(data: boolean) {
      this.isMouseLocked = data;
    },
  },
});
