interface ModelData {
  positionType: string | undefined;
  id: string | number;
  positionX: number;
  positionZ: number;
  rotationY: number | undefined;
  type?: string;
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
interface State {
  fernList: ModelData[];
  bushList: ModelData[];
  bushStickList: ModelData[];
}
export const useFloraStore = defineStore("FloraStore", {
  state: (): State => {
    return {
      fernList: [],
      bushList: [],
      bushStickList: [],
    };
  },
  getters: {},
  actions: {
    removeElementFromList(data: {
      id: string;
      index: number;
      positionType: string;
      type: string;
    }) {
      if (data.type === "fern") {
        // this.fernList = this.fernList.filter(
        //   (element, index) => index !== data.index
        // );
        this.fernList.splice(data.index, 1);
      }
    },
    setFloraLists(data: GroundData[]) {
      const setPositions = (data: {
        groundData: GroundData;
        type: string;
      }): ModelData => {
        if (data.type === "bottomLeft") {
          return {
            positionX: data.groundData.positionX + 3.5,
            positionZ: data.groundData.positionZ + 3.5,
            rotationY: data.groundData.bottomLeft?.rotationY,
            positionType: data.groundData.bottomLeft?.positionType,
            id: data.groundData.id,
          };
        } else if (data.type === "bottomRight") {
          return {
            positionX: data.groundData.positionX - 3.5,
            positionZ: data.groundData.positionZ + 3.5,
            rotationY: data.groundData.bottomRight?.rotationY,
            positionType: data.groundData.bottomRight?.positionType,
            id: data.groundData.id,
          };
        } else if (data.type === "center") {
          return {
            positionX: data.groundData.positionX,
            positionZ: data.groundData.positionZ,
            rotationY: data.groundData.center?.rotationY,
            positionType: data.groundData.center?.positionType,
            id: data.groundData.id,
          };
        } else if (data.type === "topLeft") {
          return {
            positionX: data.groundData.positionX - 3.5,
            positionZ: data.groundData.positionZ - 3.5,
            rotationY: data.groundData.topLeft?.rotationY,
            positionType: data.groundData.topLeft?.positionType,
            id: data.groundData.id,
          };
        } else if (data.type === "topRight") {
          return {
            positionX: data.groundData.positionX + 3.5,
            positionZ: data.groundData.positionZ - 3.5,
            rotationY: data.groundData.topRight?.rotationY,
            positionType: data.groundData.topRight?.positionType,
            id: data.groundData.id,
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

      data.forEach((groundData: GroundData) => {
        if (groundData.bottomLeft) {
          switch (groundData.bottomLeft.type) {
            case "fern":
              fernList.push(setPositions({ groundData, type: "bottomLeft" }));
              break;
            case "bush":
              bushList.push(setPositions({ groundData, type: "bottomLeft" }));
              break;
            case "bush-stick":
              bushStickList.push(
                setPositions({ groundData, type: "bottomLeft" })
              );
            default:
              break;
          }
        }
        if (groundData.bottomRight) {
          switch (groundData.bottomRight.type) {
            case "fern":
              fernList.push(setPositions({ groundData, type: "bottomRight" }));
              break;
            case "bush":
              bushList.push(setPositions({ groundData, type: "bottomRight" }));
              break;
            case "bush-stick":
              bushStickList.push(
                setPositions({ groundData, type: "bottomRight" })
              );
            default:
              break;
          }
        }
        if (groundData.center) {
          switch (groundData.center.type) {
            case "fern":
              fernList.push(setPositions({ groundData, type: "center" }));
              break;
            case "bush":
              bushList.push(setPositions({ groundData, type: "center" }));
              break;
            case "bush-stick":
              bushStickList.push(setPositions({ groundData, type: "center" }));
            default:
              break;
          }
        }
        if (groundData.topLeft) {
          switch (groundData.topLeft.type) {
            case "fern":
              fernList.push(setPositions({ groundData, type: "topLeft" }));
              break;
            case "bush":
              bushList.push(setPositions({ groundData, type: "topLeft" }));
              break;
            case "bush-stick":
              bushStickList.push(setPositions({ groundData, type: "topLeft" }));
            default:
              break;
          }
        }
        if (groundData.topRight) {
          switch (groundData.topRight.type) {
            case "fern":
              fernList.push(setPositions({ groundData, type: "topRight" }));
              break;
            case "bush":
              bushList.push(setPositions({ groundData, type: "topRight" }));
              break;
            case "bush-stick":
              bushStickList.push(
                setPositions({ groundData, type: "topRight" })
              );
            default:
              break;
          }
        }
      });
      this.fernList = this.fernList.concat(fernList);
      this.bushList = this.bushList.concat(bushList);
      this.bushStickList = this.bushStickList.concat(bushStickList);
    },
  },
});
