interface State {
  color: string;
  colorStone: string;
  colorTrees: string;
  colorSand: string;
  isStartedGame: boolean;
  isActiveMenuGame: boolean;
  isActiveBlockAnimation: boolean;
  isMouseLocked: boolean;
  settingsShadow: number;
  settingsGraphics: string;
}
export const useGeneralStore = defineStore("GeneralStore", {
  state: (): State => {
    return {
      color: "#5b6f58",
      // '#225846'
      // color: "#adadads",
      colorStone: "#6C7644",
      colorTrees: "#2d3e2e",
      colorSand: "#5e563b",
      isStartedGame: false,
      isActiveMenuGame: true,
      isActiveBlockAnimation: true,
      isMouseLocked: false,
      settingsShadow: 1024,
      settingsGraphics: "Medium",
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
    setIsActiveBlockAnimation(data: boolean) {
      this.isActiveBlockAnimation = data;
    },
    setIsMouseLocked(data: boolean) {
      this.isMouseLocked = data;
    },
    setSettingsShadow(data: number) {
      this.settingsShadow = data;
    },
    setSettingsGraphics(data: string) {
      this.settingsGraphics = data;
    },
  },
});
