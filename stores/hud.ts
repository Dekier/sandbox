interface EquipmentData {
  id: string;
  title: string;
  count: number;
  src: string;
}
interface State {
  fps: number;
  isActiveGamepad: boolean;
  addedElementToEquipmentList: EquipmentData[];
}
export const useHudStore = defineStore("HudStore", {
  state: (): State => {
    return {
      fps: 0,
      isActiveGamepad: false,
      addedElementToEquipmentList: [],
    };
  },
  getters: {},
  actions: {
    setFps(data: number) {
      this.fps = data;
    },
    setIsActiveGamepad(data: boolean) {
      this.isActiveGamepad = data;
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
