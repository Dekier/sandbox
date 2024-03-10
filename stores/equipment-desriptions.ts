interface EquipmentDescriptionsData {
  title: string;
  description: string;
  src: string;
  power?: number;
}
interface State {
  equipmentDescriptionsList: EquipmentDescriptionsData[];
}
export const useEquipmentDescriptionsStore = defineStore(
  "EquipmentDescriptionsStore",
  {
    state: (): State => {
      return {
        equipmentDescriptionsList: [
          {
            title: "Large leaf",
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus tincidunt vehicula nunc, vel posuere libero blandit ut. Donec lacinia est et placerat fermentum. Donec posuere nec elit in placerat. Integer elementum enim augue, ut sodales nisl elementum vel. Phasellus lorem lacus, tincidunt dapibus massa eu, malesuada bibendum magna. Aliquam id gravida massa. Vivamus molestie turpis eget nisi malesuada, vulputate congue nisl cursus.",
            src: "/image/equipment/big-leaf.png",
          },
          {
            title: "Stick",
            description:
              "Phasellus lorem lacus, tincidunt dapibus massa eu, malesuada bibendum magna. Aliquam id gravida massa. Vivamus molestie turpis eget nisi malesuada, vulputate congue nisl cursus. Phasellus lorem lacus, tincidunt dapibus massa eu, malesuada bibendum magna. Aliquam id gravida massa. Vivamus molestie turpis eget nisi malesuada, vulputate congue nisl cursus.",
            src: "/image/equipment/stick.png",
          },
          {
            title: "Small axe",
            description:
              "Phasellus lorem lacus, tincidunt dapibus massa eu, malesuada bibendcula nunc, vel posuere libero blandit ut. Donec lacinia est et placerat fermentum. Donec posuere nec elit in placerat. Integer elementum enim augue, ut sodales nisl elementum vel. Phasellus lorem lacus, tius molestie turpis eget nisi malesuada, vulputate congue nisl cursus.",
            src: "/image/equipment/axe-small.png",
            power: 1,
          },
          {
            title: "Small leaves",
            description:
              "Phasellus lorem lacus, tincidunt dassa. Vivamus molestie turpis eget nisi malesuada, vulputate congue nisl cursus. Phasellus lorem lacus, tincidunt dapibus massa eu, malesuada bibendum magna. Aliquam id gravida massa. Vivamus molestie isl elementum vel. Phasellus lorem lacus, tius molestie turpis eget nisi malesuada, vulputate congue nisl cursus.",
            src: "/image/equipment/small-leaves.png",
          },
        ],
      };
    },
    getters: {},
    actions: {},
  }
);
