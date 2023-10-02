interface State {
  isSettingsHud: boolean;
  isActiveShadows: boolean;
  fps: number;
  shadowSize: number;
  lightX: number;
  lightY: number;
  lightZ: number;
  isActiveCharacterCamera: boolean;
  isSwitchCameraAnimation: boolean;
}
export const useHudStore = defineStore("HudStore", {
  state: (): State => {
    return {
      isSettingsHud: false,
      isActiveShadows: true,
      fps: 0,
      shadowSize: 4096,
      lightX: -25,
      lightY: 15,
      lightZ: 30,
      isActiveCharacterCamera: false,
      isSwitchCameraAnimation: false,
    };
  },
  getters: {},
  actions: {
    setIsSettingsHud() {
      this.isSettingsHud = !this.isSettingsHud;
    },
    setFps(data: number) {
      this.fps = data;
    },
    setActiveShadows(data: boolean) {
      this.isActiveShadows = data;
    },
    setShadowSize(data: number) {
      this.shadowSize = data;
    },
    setLightX(data: number) {
      this.lightX = data;
    },
    setLightY(data: number) {
      this.lightY = data;
    },
    setLightZ(data: number) {
      this.lightZ = data;
    },
    setCharacterCameraIsActive(data: boolean) {
      this.isActiveCharacterCamera = data;
    },
    setIsSwitchCameraAnimation(data: boolean) {
      this.isSwitchCameraAnimation = data;
    },
  },
});
