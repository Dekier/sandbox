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
  settingsFlora: string;
  settingsPixelRatio: number;
  settingsGraphics: string;
  settingsAntialias: boolean;
}
export const useGeneralStore = defineStore("GeneralStore", {
  state: (): State => {
    return {
      color: "#5b6f58",
      colorStone: "#6C7644",
      colorTrees: "#2d3e2e",
      colorSand: "#5e563b",
      isStartedGame: false,
      isActiveMenuGame: true,
      isActiveBlockAnimation: true,
      isMouseLocked: false,
      settingsShadow: 1024,
      settingsPixelRatio: 1,
      settingsFlora: "Medium",
      settingsGraphics: "Medium",
      settingsAntialias: true,
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
    setSettingsFlora(data: string) {
      this.settingsFlora = data;
    },
    setSettingsGraphics(data: string) {
      this.settingsGraphics = data;
    },
    setSettingsAntialias(data: boolean) {
      this.settingsAntialias = data;
    },
    setSettingsPixelRatio(data: number) {
      this.settingsPixelRatio = data;
    },
  },
});
