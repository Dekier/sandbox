interface EquipmentHudData {
  title: string;
  count: number;
  src: string;
  id?: number;
  list?: "hand" | "backpack";
}
interface MaxCountData {
  title: string;
  maxCount: number;
}
interface State {
  itemMaxCountList: MaxCountData[];
  equipmentItemsList: EquipmentHudData[];
}
export const useEquipmentStore = defineStore("EquipmentStore", {
  state: (): State => {
    return {
      itemMaxCountList: [
        {
          title: "Large leaf",
          maxCount: 4,
        },
        {
          title: "Stick",
          maxCount: 4,
        },
      ],
      equipmentItemsList: [
        {
          title: "Stick",
          count: 2,
          src: "/image/equipment/stick.png",
          id: 1,
          list: "hand",
        },
        {
          title: "Large leaf",
          count: 3,
          src: "/image/equipment/big-leaf.png",
          id: 2,
          list: "hand",
        },
        {
          title: "Large leaf",
          count: 1,
          src: "/image/equipment/big-leaf.png",
          id: 3,
          list: "hand",
        },
        {
          title: "Stick",
          count: 3,
          src: "/image/equipment/stick.png",
          id: 4,
          list: "hand",
        },
        {
          title: "",
          count: 0,
          src: "",
          id: 5,
          list: "hand",
        },
        {
          title: "",
          count: 0,
          src: "",
          id: 6,
          list: "hand",
        },
        {
          title: "",
          count: 0,
          src: "",
          id: 7,
          list: "hand",
        },
        {
          title: "Large leaf",
          count: 2,
          src: "/image/equipment/big-leaf.png",
          id: 8,
          list: "hand",
        },
        {
          title: "Large leaf",
          count: 2,
          src: "/image/equipment/big-leaf.png",
          id: 9,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
          src: "",
          id: 10,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
          src: "",
          id: 11,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
          src: "",
          id: 12,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
          src: "",
          id: 13,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
          src: "",
          id: 14,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
          src: "",
          id: 15,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
          src: "",
          id: 16,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
          src: "",
          id: 17,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
          src: "",
          id: 18,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
          src: "",
          id: 19,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
          src: "",
          id: 20,
          list: "backpack",
        },
        {
          title: "Stick",
          count: 1,
          src: "/image/equipment/stick.png",
          id: 21,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
          src: "",
          id: 22,
          list: "backpack",
        },
        {
          title: "Stick",
          count: 1,
          src: "/image/equipment/stick.png",
          id: 23,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
          src: "",
          id: 24,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
          src: "",
          id: 25,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
          src: "",
          id: 26,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
          src: "",
          id: 27,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
          src: "",
          id: 28,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
          src: "",
          id: 29,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
          src: "",
          id: 30,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
          src: "",
          id: 31,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
          src: "",
          id: 32,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
          src: "",
          id: 33,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
          src: "",
          id: 34,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
          src: "",
          id: 35,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
          src: "",
          id: 36,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
          src: "",
          id: 37,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
          src: "",
          id: 38,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
          src: "",
          id: 39,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
          src: "",
          id: 40,
          list: "backpack",
        },
      ],
    };
  },
  getters: {
    equipmentItemsHandList: (state) =>
      state.equipmentItemsList.filter(
        (data: EquipmentHudData) => data.list === "hand"
      ),
    equipmentItemsBackpackList: (state) =>
      state.equipmentItemsList.filter(
        (data: EquipmentHudData) => data.list === "backpack"
      ),
  },
  actions: {
    addToequipmentItemsList(data: EquipmentHudData) {
      const itemMaxCount =
        this.itemMaxCountList.find(
          (element) => element.title.toUpperCase() === data.title.toUpperCase()
        )?.maxCount || 1;
      const indexHand = this.equipmentItemsHandList.findIndex(
        (element: EquipmentHudData) =>
          element.title === data.title && element.count < itemMaxCount
      );
      if (indexHand !== -1) {
        this.equipmentItemsList[indexHand].count++;
      } else {
        const isEmptyItemInHand = this.equipmentItemsHandList.findIndex(
          (item) => item.title === ""
        );
        if (isEmptyItemInHand !== -1) {
          this.equipmentItemsList[isEmptyItemInHand] = {
            ...data,
            id: this.equipmentItemsList[isEmptyItemInHand].id,
            list: "hand",
          };
        } else {
          const indexBackpack = this.equipmentItemsList.findIndex(
            (element: EquipmentHudData) =>
              element.title === data.title && element.count < itemMaxCount
          );
          if (indexBackpack !== -1) {
            this.equipmentItemsList[indexBackpack].count++;
          } else {
            const isEmptyItemInBackpack = this.equipmentItemsList.findIndex(
              (item) => item.title === ""
            );
            if (isEmptyItemInBackpack !== -1) {
              this.equipmentItemsList[isEmptyItemInBackpack] = {
                ...data,
                id: this.equipmentItemsList[isEmptyItemInBackpack].id,
                list: "backpack",
              };
            }
          }
        }
      }
    },

    updatePositionItem(data) {
      if (data.itemID === data.newId) return;
      const oldElementIndex = this.equipmentItemsList.findIndex(
        (element) => element.id === parseInt(data.itemID)
      );

      const newElementIndex = this.equipmentItemsList.findIndex(
        (element) => element.id === parseInt(data.newId)
      );
      const oldMaxCount =
        this.itemMaxCountList.find(
          (data) =>
            data.title === this.equipmentItemsList[oldElementIndex].title
        )?.maxCount || 1;
      const newMaxCount =
        this.itemMaxCountList.find(
          (data) =>
            data.title === this.equipmentItemsList[newElementIndex].title
        )?.maxCount || 1;

      const exangeElementsInList = (
        lista: EquipmentHudData[],
        indexA: number,
        indexB: number
      ) => {
        [lista[indexA], lista[indexB]] = [lista[indexB], lista[indexA]];
      };
      const exange = () => {
        const oldId = this.equipmentItemsList[oldElementIndex].id;
        const newId = this.equipmentItemsList[newElementIndex].id;
        if (
          this.equipmentItemsList[oldElementIndex].list !==
          this.equipmentItemsList[newElementIndex].list
        ) {
          const oldListType = this.equipmentItemsList[oldElementIndex].list;
          const newListType = this.equipmentItemsList[newElementIndex].list;
          exangeElementsInList(
            this.equipmentItemsList,
            oldElementIndex,
            newElementIndex
          );
          this.equipmentItemsList[oldElementIndex].list = oldListType;
          this.equipmentItemsList[newElementIndex].list = newListType;
        } else {
          exangeElementsInList(
            this.equipmentItemsList,
            oldElementIndex,
            newElementIndex
          );
        }

        this.equipmentItemsList[oldElementIndex].id = oldId;
        this.equipmentItemsList[newElementIndex].id = newId;
      };

      if (oldElementIndex !== -1 && newElementIndex !== -1) {
        if (
          this.equipmentItemsList[oldElementIndex].title !==
          this.equipmentItemsList[newElementIndex].title
        ) {
          exange();
        } else {
          if (
            this.equipmentItemsList[newElementIndex].count === newMaxCount ||
            this.equipmentItemsList[oldElementIndex].count === oldMaxCount
          ) {
            exange();
          } else {
            if (
              this.equipmentItemsList[newElementIndex].count +
                this.equipmentItemsList[oldElementIndex].count <=
              newMaxCount
            ) {
              this.equipmentItemsList[newElementIndex].count +=
                this.equipmentItemsList[oldElementIndex].count;
              this.equipmentItemsList[oldElementIndex].title = "";
              this.equipmentItemsList[oldElementIndex].src = "";
              this.equipmentItemsList[oldElementIndex].count = 0;
            } else {
              const difference =
                newMaxCount - this.equipmentItemsList[newElementIndex].count;

              this.equipmentItemsList[oldElementIndex].count =
                this.equipmentItemsList[oldElementIndex].count - difference;
              this.equipmentItemsList[newElementIndex].count = newMaxCount;
            }
          }
        }
      }
    },
  },
});
