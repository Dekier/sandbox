interface EquipmentHudData {
  title: string;
  count: number;
  id?: number;
  list?: "hand" | "backpack";
}
interface MaxCountData {
  title: string;
  maxCount: number;
}

interface ItemSrcListData {
  title: string;
  src: string;
}
interface State {
  isActiveHandItemTitle: string;
  itemMaxCountList: MaxCountData[];
  itemSrcList: ItemSrcListData[];
  equipmentItemsList: EquipmentHudData[];
}
export const useEquipmentStore = defineStore("EquipmentStore", {
  state: (): State => {
    return {
      isActiveHandItemTitle: "Small axe",
      itemMaxCountList: [
        {
          title: "Large leaf",
          maxCount: 4,
        },
        {
          title: "Stick",
          maxCount: 4,
        },
        {
          title: "Small leaves",
          maxCount: 6,
        },
      ],
      itemSrcList: [
        {
          title: "Large leaf",
          src: "/image/equipment/big-leaf.png",
        },
        {
          title: "Stick",
          src: "/image/equipment/stick.png",
        },
        {
          title: "Small axe",
          src: "/image/equipment/axe-small.png",
        },
        {
          title: "Small leaves",
          src: "/image/equipment/small-leaves.png",
        },
      ],
      equipmentItemsList: [
        {
          title: "Small axe",
          count: 0,
          id: 1,
          list: "hand",
        },
        {
          title: "Large leaf",
          count: 3,
          id: 2,
          list: "hand",
        },
        {
          title: "Large leaf",
          count: 1,
          id: 3,
          list: "hand",
        },
        {
          title: "Stick",
          count: 3,
          id: 4,
          list: "hand",
        },
        {
          title: "",
          count: 0,
          id: 5,
          list: "hand",
        },
        {
          title: "",
          count: 0,
          id: 6,
          list: "hand",
        },
        {
          title: "",
          count: 0,
          id: 7,
          list: "hand",
        },
        {
          title: "Large leaf",
          count: 2,
          id: 8,
          list: "hand",
        },
        {
          title: "Large leaf",
          count: 2,
          id: 9,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
          id: 10,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
          id: 11,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
          id: 12,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
          id: 13,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
          id: 14,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
          id: 15,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
          id: 16,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
          id: 17,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
          id: 18,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
          id: 19,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
          id: 20,
          list: "backpack",
        },
        {
          title: "Stick",
          count: 1,
          id: 21,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
          id: 22,
          list: "backpack",
        },
        {
          title: "Stick",
          count: 1,
          id: 23,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
          id: 24,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
          id: 25,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
          id: 26,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
          id: 27,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
          id: 28,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
          id: 29,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
          id: 30,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
          id: 31,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
          id: 32,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
          id: 33,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
          id: 34,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
          id: 35,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
          id: 36,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
          id: 37,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
          id: 38,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
          id: 39,
          list: "backpack",
        },
        {
          title: "",
          count: 0,
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
    setIsActiveHandItemTitle(data: string) {
      this.isActiveHandItemTitle = data;
    },
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
