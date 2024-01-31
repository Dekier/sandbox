interface EquipmentData {
  id: string;
  title: string;
  count: number;
  src: string;
}
interface State {
  isSettingsHud: boolean;
  isActiveShadows: boolean;
  fps: number;
  shadowSize: number;
  lightX: number;
  lightY: number;
  lightZ: number;
  isActiveOutline: boolean;
  colorOutline: string;
  isActiveGamepad: boolean;
  isActiveFullSizeMap: boolean;
  addedElementToEquipmentList: EquipmentData[];
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
      isActiveOutline: false,
      colorOutline: "#000000",
      isActiveGamepad: false,
      isActiveFullSizeMap: false,
      addedElementToEquipmentList: [],
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
    setIsActiveOutline(data: boolean) {
      this.isActiveOutline = data;
    },
    setColorOutline(data: string) {
      this.colorOutline = data;
    },
    setIsActiveGamepad(data: boolean) {
      this.isActiveGamepad = data;
    },
    setIsActiveFullSizeMap(data: boolean) {
      this.isActiveFullSizeMap = data;
    },
    setElementToEquipmentList(data: EquipmentData) {
      this.addedElementToEquipmentList.unshift(data);

      setTimeout(() => {
        const indexToRemove = this.addedElementToEquipmentList.findIndex(
          (value) => value.id === data.id
        );
        if (indexToRemove !== -1) {
          this.addedElementToEquipmentList.splice(indexToRemove, 1);
        }
      }, 2500);
    },
  },
});
