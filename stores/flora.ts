interface ModelData {
  positionType: string | undefined;
  id: string | number;
  positionX: number;
  positionZ: number;
  rotationY: number | undefined;
  type?: string;
  health?: number;
}
interface GroundData {
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
  fernList: ModelData[];
  bushList: ModelData[];
  bushStickList: ModelData[];
  treeList: ModelData[];
  treeSecondList: ModelData[];
  floraItemHealth: ItemHealth[];
}
export const useFloraStore = defineStore("FloraStore", {
  state: (): State => {
    return {
      fernList: [],
      bushList: [],
      bushStickList: [],
      treeList: [],
      treeSecondList: [],
      floraItemHealth: [
        {
          type: "bush",
          health: 2,
        },
        {
          type: "bush-stick",
          health: 1,
        },
        {
          type: "tree",
          health: 5,
        },
        {
          type: "tree-second",
          health: 5,
        },
      ],
    };
  },
  getters: {},
  actions: {
    removeElementFromList(data: { index: number; type: string }) {
      switch (data.type) {
        case "fern":
          this.fernList.splice(data.index, 1);
          break;
        case "bush":
          this.bushList.splice(data.index, 1);
          break;
        case "bush-stick":
          this.bushStickList.splice(data.index, 1);
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
      if (data.type === "bush") {
        this.bushList[data.index].health -= data.minusHealth;
      }
    },
    setFloraLists(data: GroundData[]) {
      const setPositions = (data: {
        groundData: GroundData;
        type: string;
      }): ModelData => {
        if (data.type === "bottomLeft") {
          const itemHealthData = this.floraItemHealth.find(
            (element) => element.type === data.groundData.bottomLeft.type
          );
          return {
            positionX: data.groundData.positionX + 3.5,
            positionZ: data.groundData.positionZ + 3.5,
            rotationY: data.groundData.bottomLeft?.rotationY,
            positionType: data.groundData.bottomLeft?.positionType,
            id: data.groundData.id,
            health: itemHealthData ? itemHealthData.health : 0,
          };
        } else if (data.type === "bottomRight") {
          const itemHealthData = this.floraItemHealth.find(
            (element) => element.type === data.groundData.bottomRight.type
          );
          return {
            positionX: data.groundData.positionX - 3.5,
            positionZ: data.groundData.positionZ + 3.5,
            rotationY: data.groundData.bottomRight?.rotationY,
            positionType: data.groundData.bottomRight?.positionType,
            id: data.groundData.id,
            health: itemHealthData ? itemHealthData.health : 0,
          };
        } else if (data.type === "center") {
          const itemHealthData = this.floraItemHealth.find(
            (element) => element.type === data.groundData.center.type
          );
          return {
            positionX: data.groundData.positionX,
            positionZ: data.groundData.positionZ,
            rotationY: data.groundData.center?.rotationY,
            positionType: data.groundData.center?.positionType,
            id: data.groundData.id,
            health: itemHealthData ? itemHealthData.health : 0,
          };
        } else if (data.type === "topLeft") {
          const itemHealthData = this.floraItemHealth.find(
            (element) => element.type === data.groundData.topLeft.type
          );
          return {
            positionX: data.groundData.positionX - 3.5,
            positionZ: data.groundData.positionZ - 3.5,
            rotationY: data.groundData.topLeft?.rotationY,
            positionType: data.groundData.topLeft?.positionType,
            id: data.groundData.id,
            health: itemHealthData ? itemHealthData.health : 0,
          };
        } else if (data.type === "topRight") {
          const itemHealthData = this.floraItemHealth.find(
            (element) => element.type === data.groundData.topRight.type
          );
          return {
            positionX: data.groundData.positionX + 3.5,
            positionZ: data.groundData.positionZ - 3.5,
            rotationY: data.groundData.topRight?.rotationY,
            positionType: data.groundData.topRight?.positionType,
            id: data.groundData.id,
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
      const fernList: ModelData[] = [];
      const bushList: ModelData[] = [];
      const bushStickList: ModelData[] = [];
      const treeList: ModelData[] = [];
      const treeSecondList: ModelData[] = [];

      data.forEach((groundData: GroundData) => {
        if (groundData.bottomLeft) {
          switch (groundData.bottomLeft.type) {
            case "fern":
              fernList.push(
                setPositions({
                  groundData,
                  type: "bottomLeft",
                })
              );
              break;
            case "tree-second":
              treeSecondList.push(
                setPositions({
                  groundData,
                  type: "bottomLeft",
                })
              );
              break;
            case "tree":
              treeList.push(
                setPositions({
                  groundData,
                  type: "bottomLeft",
                })
              );
              break;
            case "bush":
              bushList.push(
                setPositions({
                  groundData,
                  type: "bottomLeft",
                })
              );
              break;
            case "bush-stick":
              bushStickList.push(
                setPositions({
                  groundData,
                  type: "bottomLeft",
                })
              );
            default:
              break;
          }
        }
        if (groundData.bottomRight) {
          switch (groundData.bottomRight.type) {
            case "fern":
              fernList.push(
                setPositions({
                  groundData,
                  type: "bottomRight",
                })
              );
              break;
            case "tree-second":
              treeSecondList.push(
                setPositions({
                  groundData,
                  type: "bottomRight",
                })
              );
              break;
            case "tree":
              treeList.push(
                setPositions({
                  groundData,
                  type: "bottomRight",
                })
              );
              break;
            case "bush":
              bushList.push(
                setPositions({
                  groundData,
                  type: "bottomRight",
                })
              );
              break;
            case "bush-stick":
              bushStickList.push(
                setPositions({
                  groundData,
                  type: "bottomRight",
                })
              );
            default:
              break;
          }
        }
        if (groundData.center) {
          switch (groundData.center.type) {
            case "fern":
              fernList.push(
                setPositions({
                  groundData,
                  type: "center",
                })
              );
              break;
            case "tree-second":
              treeSecondList.push(
                setPositions({
                  groundData,
                  type: "center",
                })
              );
              break;
            case "tree":
              treeList.push(
                setPositions({
                  groundData,
                  type: "center",
                })
              );
              break;
            case "bush":
              bushList.push(
                setPositions({
                  groundData,
                  type: "center",
                })
              );
              break;
            case "bush-stick":
              bushStickList.push(
                setPositions({
                  groundData,
                  type: "center",
                })
              );
            default:
              break;
          }
        }
        if (groundData.topLeft) {
          switch (groundData.topLeft.type) {
            case "fern":
              fernList.push(
                setPositions({
                  groundData,
                  type: "topLeft",
                })
              );
              break;
            case "tree-second":
              treeSecondList.push(
                setPositions({
                  groundData,
                  type: "topLeft",
                })
              );
              break;
            case "tree":
              treeList.push(
                setPositions({
                  groundData,
                  type: "topLeft",
                })
              );
              break;
            case "bush":
              bushList.push(
                setPositions({
                  groundData,
                  type: "topLeft",
                })
              );
              break;
            case "bush-stick":
              bushStickList.push(
                setPositions({
                  groundData,
                  type: "topLeft",
                })
              );
            default:
              break;
          }
        }
        if (groundData.topRight) {
          switch (groundData.topRight.type) {
            case "fern":
              fernList.push(
                setPositions({
                  groundData,
                  type: "topRight",
                })
              );
              break;
            case "tree-second":
              treeSecondList.push(
                setPositions({
                  groundData,
                  type: "topRight",
                })
              );
              break;
            case "tree":
              treeList.push(
                setPositions({
                  groundData,
                  type: "topRight",
                })
              );
              break;
            case "bush":
              bushList.push(
                setPositions({
                  groundData,
                  type: "topRight",
                })
              );
              break;
            case "bush-stick":
              bushStickList.push(
                setPositions({
                  groundData,
                  type: "topRight",
                })
              );
            default:
              break;
          }
        }
      });
      this.fernList = this.fernList.concat(fernList);
      this.bushList = this.bushList.concat(bushList);
      this.bushStickList = this.bushStickList.concat(bushStickList);
      this.treeList = this.treeList.concat(treeList);
      this.treeSecondList = this.treeSecondList.concat(treeSecondList);
    },
  },
});
