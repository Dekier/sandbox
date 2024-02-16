interface EquipmentHudData {
  title: string;
  count: number;
  src: string;
}
interface State {
  equipmentHudList: EquipmentHudData[];
}
export const useEquipmentStore = defineStore("EquipmentStore", {
  state: (): State => {
    return {
      equipmentHudList: [],
    };
  },
  getters: {},
  actions: {
    addToEquipmentHudList(data: EquipmentHudData) {
      if (this.equipmentHudList.length <= 8) {
        const index = this.equipmentHudList.findIndex(
          (element: EquipmentHudData) =>
            element.title === data.title && element.count < 3
        );
        if (index !== -1) {
          this.equipmentHudList[index].count++;
        } else {
          this.equipmentHudList.push(data);
        }
      }
    },
  },
});
