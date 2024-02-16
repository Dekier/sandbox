interface ModelData {
  positionType: string;
  id: string | number;
  positionX: number;
  positionZ: number;
  rotationY: number;
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
}
export const useFloraStore = defineStore("FloraStore", {
  state: (): State => {
    return {
      fernList: [],
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
      const setPositions = (data: GroundData): ModelData => {
        if (data.bottomLeft && data.bottomLeft.type === "fern") {
          return {
            positionX: data.positionX + 3.5,
            positionZ: data.positionZ + 3.5,
            rotationY: data.bottomLeft?.rotationY,
            positionType: data.bottomLeft?.positionType,
            id: data.id,
          };
        }
        if (data.bottomRight && data.bottomRight.type === "fern") {
          return {
            positionX: data.positionX - 3.5,
            positionZ: data.positionZ + 3.5,
            rotationY: data.bottomRight?.rotationY,
            positionType: data.bottomRight?.positionType,
            id: data.id,
          };
        }
        if (data.center && data.center.type === "fern") {
          return {
            positionX: data.positionX,
            positionZ: data.positionZ,
            rotationY: data.center?.rotationY,
            positionType: data.center?.positionType,
            id: data.id,
          };
        }
        if (data.topLeft && data.topLeft.type === "fern") {
          return {
            positionX: data.positionX - 3.5,
            positionZ: data.positionZ - 3.5,
            rotationY: data.topLeft?.rotationY,
            positionType: data.topLeft?.positionType,
            id: data.id,
          };
        }
        if (data.topRight && data.topRight.type === "fern") {
          return {
            positionX: data.positionX + 3.5,
            positionZ: data.positionZ - 3.5,
            rotationY: data.topRight?.rotationY,
            positionType: data.topRight?.positionType,
            id: data.id,
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

      data.forEach((groundData: GroundData) => {
        if (groundData.bottomLeft && groundData.bottomLeft.type === "fern") {
          fernList.push(setPositions(groundData));
        }
        if (groundData.bottomRight && groundData.bottomRight.type === "fern") {
          fernList.push(setPositions(groundData));
        }
        if (groundData.center && groundData.center.type === "fern") {
          fernList.push(setPositions(groundData));
        }
        if (groundData.topLeft && groundData.topLeft.type === "fern") {
          fernList.push(setPositions(groundData));
        }
        if (groundData.topRight && groundData.topRight.type === "fern") {
          fernList.push(setPositions(groundData));
        }
      });
      this.fernList = fernList;
    },
  },
});
