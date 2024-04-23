interface ModelData {
  positionType: string | undefined;
  id: string | number;
  positionX: number;
  positionZ: number;
  rotationY: number | undefined;
  type?: string;
  health?: number;
}
interface SeaData {
  id: number;
  positionX: number;
  positionZ: number;
  positionY: number;
  isActive: boolean;
  isWall: boolean;
  topLeft?: ModelData;
  topRight?: ModelData;
  center?: ModelData;
  bottomLeft?: ModelData;
  bottomRight?: ModelData;
  side?: string;
}
interface ItemHealth {
  type: string;
  health: number;
}
interface State {
  bigRocksList: ModelData[];
  seaItemHealth: ItemHealth[];
}
export const useSeaStore = defineStore("SeaStore", {
  state: (): State => {
    return {
      bigRocksList: [],
      seaItemHealth: [
        {
          type: "big-rocks",
          health: 6,
        },
      ],
    };
  },
  getters: {},
  actions: {
    removeElementFromList(data: { index: number; type: string }) {
      switch (data.type) {
        case "big-rocks":
          this.fernList.splice(data.index, 1);
          break;

        default:
          break;
      }
    },
    updateHealthElementFromList(data: {
      type: string;
      index: number;
      minusHealth: number;
    }) {
      if (data.type === "big-rocks") {
        this.bigRocksList[data.index].health -= data.minusHealth;
      }
    },
    setSeaLists(data: SeaData[]) {
      const setPositions = (data: {
        seaData: SeaData;
        type: string;
      }): ModelData => {
        if (data.type === "bottomLeft") {
          const itemHealthData = this.seaItemHealth.find(
            (element) => element.type === data.seaData.bottomLeft.type
          );
          return {
            positionX: data.seaData.positionX + 3.5,
            positionZ: data.seaData.positionZ + 3.5,
            rotationY: data.seaData.bottomLeft?.rotationY,
            positionType: data.seaData.bottomLeft?.positionType,
            id: data.seaData.id,
            health: itemHealthData ? itemHealthData.health : 0,
          };
        } else if (data.type === "bottomRight") {
          const itemHealthData = this.seaItemHealth.find(
            (element) => element.type === data.seaData.bottomRight.type
          );
          return {
            positionX: data.seaData.positionX - 3.5,
            positionZ: data.seaData.positionZ + 3.5,
            rotationY: data.seaData.bottomRight?.rotationY,
            positionType: data.seaData.bottomRight?.positionType,
            id: data.seaData.id,
            health: itemHealthData ? itemHealthData.health : 0,
          };
        } else if (data.type === "center") {
          const itemHealthData = this.seaItemHealth.find(
            (element) => element.type === data.seaData.center.type
          );
          return {
            positionX: data.seaData.positionX,
            positionZ: data.seaData.positionZ,
            rotationY: data.seaData.center?.rotationY,
            positionType: data.seaData.center?.positionType,
            id: data.seaData.id,
            health: itemHealthData ? itemHealthData.health : 0,
          };
        } else if (data.type === "topLeft") {
          const itemHealthData = this.seaItemHealth.find(
            (element) => element.type === data.seaData.topLeft.type
          );
          return {
            positionX: data.seaData.positionX - 3.5,
            positionZ: data.seaData.positionZ - 3.5,
            rotationY: data.seaData.topLeft?.rotationY,
            positionType: data.seaData.topLeft?.positionType,
            id: data.seaData.id,
            health: itemHealthData ? itemHealthData.health : 0,
          };
        } else if (data.type === "topRight") {
          const itemHealthData = this.seaItemHealth.find(
            (element) => element.type === data.seaData.topRight.type
          );
          return {
            positionX: data.seaData.positionX + 3.5,
            positionZ: data.seaData.positionZ - 3.5,
            rotationY: data.seaData.topRight?.rotationY,
            positionType: data.seaData.topRight?.positionType,
            id: data.seaData.id,
            health: itemHealthData ? itemHealthData.health : 0,
          };
        }
        return {
          positionX: 0,
          positionZ: 0,
          rotationY: 0,
          positionType: "",
          id: "",
        };
      };
      const bigRocksList: ModelData[] = [];

      data.forEach((seaData: SeaData) => {
        if (seaData.bottomLeft) {
          switch (seaData.bottomLeft.type) {
            case "big-rocks":
              bigRocksList.push(
                setPositions({
                  seaData,
                  type: "bottomLeft",
                })
              );
              break;
            default:
              break;
          }
        }
        if (seaData.bottomRight) {
          switch (seaData.bottomRight.type) {
            case "big-rocks":
              bigRocksList.push(
                setPositions({
                  seaData,
                  type: "bottomRight",
                })
              );
              break;

            default:
              break;
          }
        }
        if (seaData.center) {
          switch (seaData.center.type) {
            case "big-rocks":
              bigRocksList.push(
                setPositions({
                  seaData,
                  type: "center",
                })
              );
              break;
            default:
              break;
          }
        }
        if (seaData.topLeft) {
          switch (seaData.topLeft.type) {
            case "big-rocks":
              bigRocksList.push(
                setPositions({
                  seaData,
                  type: "topLeft",
                })
              );
              break;
            default:
              break;
          }
        }
        if (seaData.topRight) {
          switch (seaData.topRight.type) {
            case "big-rocks":
              bigRocksList.push(
                setPositions({
                  seaData,
                  type: "topRight",
                })
              );
              break;
            default:
              break;
          }
        }
      });
      this.bigRocksList = this.bigRocksList.concat(bigRocksList);
    },
  },
});
