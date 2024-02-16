import { useFloraStore as floraStore } from "./flora";
interface ModelData {
  positionType?: string;
  type?: string;
  positionX?: number;
  positionZ?: number;
  rotationY?: number;
  id?: number;
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
interface ModuleFlora {
  topLeft?: ModelData;
  topRight?: ModelData;
  center?: ModelData;
  bottomLeft?: ModelData;
  bottomRight?: ModelData;
}
interface State {
  groundDataList: GroundData[];
  randomModuleFlora: ModuleFlora[];
  groundZeroList: GroundData[];
  groundOneSideList: GroundData[];
  groundCornerList: GroundData[];
  groundTwoSideList: GroundData[];
  groundThreeSideList: GroundData[];
}
export const useModularGroundStore = defineStore("ModuleStore", {
  state: (): State => {
    return {
      groundZeroList: [],
      groundOneSideList: [],
      groundCornerList: [],
      groundTwoSideList: [],
      groundThreeSideList: [],
      randomModuleFlora: [
        {
          topLeft: {
            positionType: "topLeft",
            type: "",
            positionX: 0,
            positionZ: 2,
            rotationY: -1,
          },
          topRight: {
            positionType: "topRight",
            type: "fern",
            positionX: 3,
            positionZ: -1,
            rotationY: 2,
          },
          center: {
            positionType: "center",
            type: "tree",
            positionX: -3,
            positionZ: 0,
            rotationY: -3,
          },
          bottomLeft: {
            positionType: "bottomLeft",
            type: "",
            positionX: 0,
            positionZ: 2,
            rotationY: 3,
          },
          bottomRight: {
            positionType: "bottomRight",
            type: "bush",
            positionX: 3,
            positionZ: -3,
            rotationY: 3,
          },
        },
        {
          topLeft: {
            positionType: "topLeft",
            type: "",
            positionX: -1,
            positionZ: -3,
            rotationY: 0,
          },
          topRight: {
            positionType: "topRight",
            type: "fern",
            positionX: -2,
            positionZ: 2,
            rotationY: -1,
          },
          center: {
            positionType: "center",
            type: "",
            positionX: -1,
            positionZ: -1,
            rotationY: 0,
          },
          bottomLeft: {
            positionType: "bottomLeft",
            type: "tree",
            positionX: -2,
            positionZ: 3,
            rotationY: 0,
          },
          bottomRight: {
            positionType: "bottomRight",
            type: "bush",
            positionX: 0,
            positionZ: 2,
            rotationY: 0,
          },
        },
        {
          topLeft: {
            positionType: "topLeft",
            type: "",
            positionX: 3,
            positionZ: -1,
            rotationY: 0,
          },
          topRight: {
            positionType: "topRight",
            type: "bush-stick",
            positionX: -1,
            positionZ: 3,
            rotationY: 0,
          },
          center: {
            positionType: "center",
            type: "bush",
            positionX: 3,
            positionZ: 3,
            rotationY: 0,
          },
          bottomLeft: {
            positionType: "bottomLeft",
            type: "fern",
            positionX: 2,
            positionZ: 1,
            rotationY: 0,
          },
          bottomRight: {
            positionType: "bottomRight",
            type: "",
            positionX: 2,
            positionZ: -2,
            rotationY: 0,
          },
        },
        {
          topLeft: {
            positionType: "topLeft",
            type: "",
            positionX: 2,
            positionZ: -2,
            rotationY: 0,
          },
          topRight: {
            positionType: "topRight",
            type: "tree-second",
            positionX: 1,
            positionZ: 1,
            rotationY: 0,
          },
          center: {
            positionType: "center",
            type: "",
            positionX: -1,
            positionZ: -1,
            rotationY: 0,
          },
          bottomLeft: {
            positionType: "bottomLeft",
            type: "bush",
            positionX: 1,
            positionZ: 3,
            rotationY: 0,
          },
          bottomRight: {
            positionType: "bottomRight",
            type: "fern",
            positionX: -1,
            positionZ: -3,
            rotationY: 0,
          },
        },
        {
          topLeft: {
            positionType: "topLeft",
            type: "bush",
            positionX: 3,
            positionZ: -2,
            rotationY: 0,
          },
          topRight: {
            positionType: "topRight",
            type: "",
            positionX: -1,
            positionZ: 2,
            rotationY: 0,
          },
          center: {
            positionType: "center",
            type: "fern",
            positionX: -2,
            positionZ: 1,
            rotationY: 0,
          },
          bottomLeft: {
            positionType: "bottomLeft",
            type: "",
            positionX: 2,
            positionZ: 0,
            rotationY: 0,
          },
          bottomRight: {
            positionType: "bottomRight",
            type: "",
            positionX: -3,
            positionZ: 2,
            rotationY: 0,
          },
        },
      ],
      groundDataList: [
        // {
        //   id: 1,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        //   isWall: true,
        // },
        // {
        //   id: 2,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        //   isWall: true,
        // },
        // {
        //   id: 3,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        //   isWall: true,
        // },
        // {
        //   id: 4,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        //   isWall: true,
        // },
        // {
        //   id: 5,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        //   isWall: true,
        // },
        // {
        //   id: 6,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        //   isWall: true,
        // },
        // {
        //   id: 7,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        //   isWall: true,
        // },
        // {
        //   id: 8,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        //   isWall: true,
        // },
        // {
        //   id: 9,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        //   isWall: true,
        // },
        // {
        //   id: 10,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        //   isWall: true,
        // },
        // {
        //   id: 11,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        //   isWall: true,
        // },
        // {
        //   id: 12,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        //   isWall: true,
        // },
        // {
        //   id: 13,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        //   isWall: true,
        // },
        // {
        //   id: 14,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        //   isWall: true,
        // },
        // {
        //   id: 15,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        //   isWall: true,
        // },
        // {
        //   id: 16,
        //   positionX: -105,
        //   positionZ: -90,
        //   positionY: 0,
        //   isActive: false,
        //   isWall: true,
        // },
        {
          id: 17,
          positionX: -90,
          positionZ: -90,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 18,
          positionX: -75,
          positionZ: -90,
          positionY: 0,
          isActive: false,
          isWall: false,
        },

        {
          id: 19,
          positionX: -60,
          positionZ: -90,
          positionY: 0,
          isActive: false,
          isWall: false,
        },

        {
          id: 20,
          positionX: -45,
          positionZ: -90,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 21,
          positionX: -30,
          positionZ: -90,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 22,
          positionX: -15,
          positionZ: -90,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 23,
          positionX: 0,
          positionZ: -90,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 24,
          positionX: 15,
          positionZ: -90,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 25,
          positionX: 30,
          positionZ: -90,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 26,
          positionX: 45,
          positionZ: -90,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 27,
          positionX: 60,
          positionZ: -90,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 28,
          positionX: 75,
          positionZ: -90,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 29,
          positionX: 90,
          positionZ: -90,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        // {
        //   id: 30,
        //   positionX: 105,
        //   positionZ: -90,
        //   positionY: 0,
        //   isActive: false,
        //   isWall: true,
        // },
        // {
        //   id: 31,
        //   positionX: -105,
        //   positionZ: -75,
        //   positionY: 0,
        //   isActive: false,
        //   isWall: true,
        // },
        {
          id: 32,
          positionX: -90,
          positionZ: -75,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 33,
          positionX: -75,
          positionZ: -75,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 34,
          positionX: -60,
          positionZ: -75,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 35,
          positionX: -45,
          positionZ: -75,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 36,
          positionX: -30,
          positionZ: -75,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 37,
          positionX: -15,
          positionZ: -75,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 38,
          positionX: 0,
          positionZ: -75,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 39,
          positionX: 15,
          positionZ: -75,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 40,
          positionX: 30,
          positionZ: -75,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 41,
          positionX: 45,
          positionZ: -75,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 42,
          positionX: 60,
          positionZ: -75,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 43,
          positionX: 75,
          positionZ: -75,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 44,
          positionX: 90,
          positionZ: -75,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        // {
        //   id: 45,
        //   positionX: 105,
        //   positionZ: -75,
        //   positionY: 0,
        //   isActive: false,
        //   isWall: true,
        // },
        // {
        //   id: 46,
        //   positionX: -105,
        //   positionZ: -60,
        //   positionY: 0,
        //   isActive: false,
        //   isWall: true,
        // },
        {
          id: 47,
          positionX: -90,
          positionZ: -60,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 48,
          positionX: -75,
          positionZ: -60,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 49,
          positionX: -60,
          positionZ: -60,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 50,
          positionX: -45,
          positionZ: -60,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 51,
          positionX: -30,
          positionZ: -60,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 52,
          positionX: -15,
          positionZ: -60,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 53,
          positionX: 0,
          positionZ: -60,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 54,
          positionX: 15,
          positionZ: -60,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 55,
          positionX: 30,
          positionZ: -60,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 56,
          positionX: 45,
          positionZ: -60,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 57,
          positionX: 60,
          positionZ: -60,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 58,
          positionX: 75,
          positionZ: -60,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 59,
          positionX: 90,
          positionZ: -60,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        // {
        //   id: 60,
        //   positionX: 105,
        //   positionZ: -60,
        //   positionY: 0,
        //   isActive: false,
        //   isWall: true,
        // },
        // {
        //   id: 61,
        //   positionX: -105,
        //   positionZ: -45,
        //   positionY: 0,
        //   isActive: false,
        //   isWall: true,
        // },
        {
          id: 62,
          positionX: -90,
          positionZ: -45,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 63,
          positionX: -75,
          positionZ: -45,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 64,
          positionX: -60,
          positionZ: -45,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 65,
          positionX: -45,
          positionZ: -45,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 66,
          positionX: -30,
          positionZ: -45,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 67,
          positionX: -15,
          positionZ: -45,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 68,
          positionX: 0,
          positionZ: -45,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 69,
          positionX: 15,
          positionZ: -45,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 70,
          positionX: 30,
          positionZ: -45,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 71,
          positionX: 45,
          positionZ: -45,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 72,
          positionX: 60,
          positionZ: -45,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 73,
          positionX: 75,
          positionZ: -45,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 74,
          positionX: 90,
          positionZ: -45,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        // {
        //   id: 75,
        //   positionX: 105,
        //   positionZ: -45,
        //   positionY: 0,
        //   isActive: false,
        //   isWall: true,
        // },
        // {
        //   id: 76,
        //   positionX: -105,
        //   positionZ: -30,
        //   positionY: 0,
        //   isActive: false,
        //   isWall: true,
        // },
        {
          id: 77,
          positionX: -90,
          positionZ: -30,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 78,
          positionX: -75,
          positionZ: -30,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 79,
          positionX: -60,
          positionZ: -30,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 80,
          positionX: -45,
          positionZ: -30,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 81,
          positionX: -30,
          positionZ: -30,
          positionY: 0,
          isActive: true,
          isWall: false,
        },
        {
          id: 82,
          positionX: -15,
          positionZ: -30,
          positionY: 0,
          isActive: true,
          isWall: false,
        },
        {
          id: 83,
          positionX: 0,
          positionZ: -30,
          positionY: 0,
          isActive: true,
          isWall: false,
        },
        {
          id: 84,
          positionX: 15,
          positionZ: -30,
          positionY: 0,
          isActive: true,
          isWall: false,
        },
        {
          id: 85,
          positionX: 30,
          positionZ: -30,
          positionY: 0,
          isActive: true,
          isWall: false,
        },
        {
          id: 86,
          positionX: 45,
          positionZ: -30,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 87,
          positionX: 60,
          positionZ: -30,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 88,
          positionX: 75,
          positionZ: -30,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 89,
          positionX: 90,
          positionZ: -30,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        // {
        //   id: 90,
        //   positionX: 105,
        //   positionZ: -30,
        //   positionY: 0,
        //   isActive: false,
        //   isWall: true,
        // },
        // {
        //   id: 91,
        //   positionX: -105,
        //   positionZ: -15,
        //   positionY: 0,
        //   isActive: false,
        //   isWall: true,
        // },
        {
          id: 92,
          positionX: -90,
          positionZ: -15,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 93,
          positionX: -75,
          positionZ: -15,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 94,
          positionX: -60,
          positionZ: -15,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 95,
          positionX: -45,
          positionZ: -15,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 96,
          positionX: -30,
          positionZ: -15,
          positionY: 0,
          isActive: true,
          isWall: false,
        },
        {
          id: 97,
          positionX: -15,
          positionZ: -15,
          positionY: 0,
          isActive: true,
          isWall: false,
        },
        {
          id: 98,
          positionX: 0,
          positionZ: -15,
          positionY: 0,
          isActive: true,
          isWall: false,
        },
        {
          id: 99,
          positionX: 15,
          positionZ: -15,
          positionY: 0,
          isActive: true,
          isWall: false,
        },
        {
          id: 100,
          positionX: 30,
          positionZ: -15,
          positionY: 0,
          isActive: true,
          isWall: false,
        },
        {
          id: 101,
          positionX: 45,
          positionZ: -15,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 102,
          positionX: 60,
          positionZ: -15,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 103,
          positionX: 75,
          positionZ: -15,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 104,
          positionX: 90,
          positionZ: -15,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        // {
        //   id: 105,
        //   positionX: 105,
        //   positionZ: -15,
        //   positionY: 0,
        //   isActive: false,
        //   isWall: true,
        // },
        // {
        //   id: 106,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        //   isWall: true,
        // },
        {
          id: 107,
          positionX: -90,
          positionZ: 0,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 108,
          positionX: -75,
          positionZ: 0,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 109,
          positionX: -60,
          positionZ: 0,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 110,
          positionX: -45,
          positionZ: 0,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 111,
          positionX: -30,
          positionZ: 0,
          positionY: 0,
          isActive: true,
          isWall: false,
        },
        {
          id: 112,
          positionX: -15,
          positionZ: 0,
          positionY: 0,
          isActive: true,
          isWall: false,
        },
        {
          id: 113,
          positionX: 0,
          positionZ: 0,
          positionY: 0,
          isActive: true,
          isWall: false,
        },
        {
          id: 114,
          positionX: 15,
          positionZ: 0,
          positionY: 0,
          isActive: true,
          isWall: false,
        },
        {
          id: 115,
          positionX: 30,
          positionZ: 0,
          positionY: 0,
          isActive: true,
          isWall: false,
        },
        {
          id: 116,
          positionX: 45,
          positionZ: 0,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 117,
          positionX: 60,
          positionZ: 0,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 118,
          positionX: 75,
          positionZ: 0,
          positionY: 0,
          isActive: false,
          isWall: false,
        },

        {
          id: 119,
          positionX: 90,
          positionZ: 0,
          positionY: 0,
          isActive: false,
          isWall: false,
        },

        // {
        //   id: 120,
        //   positionX: 105,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        //   isWall: true,
        // },
        // {
        //   id: 121,
        //   positionX: -105,
        //   positionZ: 15,
        //   positionY: 0,
        //   isActive: false,
        //   isWall: true,
        // },
        {
          id: 122,
          positionX: -90,
          positionZ: 15,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 123,
          positionX: -75,
          positionZ: 15,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 124,
          positionX: -60,
          positionZ: 15,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 125,
          positionX: -45,
          positionZ: 15,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 126,
          positionX: -30,
          positionZ: 15,
          positionY: 0,
          isActive: true,
          isWall: false,
        },
        {
          id: 127,
          positionX: -15,
          positionZ: 15,
          positionY: 0,
          isActive: true,
          isWall: false,
        },
        {
          id: 128,
          positionX: 0,
          positionZ: 15,
          positionY: 0,
          isActive: true,
          isWall: false,
        },
        {
          id: 129,
          positionX: 15,
          positionZ: 15,
          positionY: 0,
          isActive: true,
          isWall: false,
        },
        {
          id: 130,
          positionX: 30,
          positionZ: 15,
          positionY: 0,
          isActive: true,
          isWall: false,
        },
        {
          id: 131,
          positionX: 45,
          positionZ: 15,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 132,
          positionX: 60,
          positionZ: 15,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 133,
          positionX: 75,
          positionZ: 15,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 134,
          positionX: 90,
          positionZ: 15,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        // {
        //   id: 135,
        //   positionX: 105,
        //   positionZ: 15,
        //   positionY: 0,
        //   isActive: false,
        //   isWall: true,
        // },
        // {
        //   id: 136,
        //   positionX: -105,
        //   positionZ: 30,
        //   positionY: 0,
        //   isActive: false,
        //   isWall: true,
        // },
        {
          id: 137,
          positionX: -90,
          positionZ: 30,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 138,
          positionX: -75,
          positionZ: 30,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 139,
          positionX: -60,
          positionZ: 30,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 140,
          positionX: -45,
          positionZ: 30,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 141,
          positionX: -30,
          positionZ: 30,
          positionY: 0,
          isActive: true,
          isWall: false,
        },
        {
          id: 142,
          positionX: -15,
          positionZ: 30,
          positionY: 0,
          isActive: true,
          isWall: false,
        },
        {
          id: 143,
          positionX: 0,
          positionZ: 30,
          positionY: 0,
          isActive: true,
          isWall: false,
        },
        {
          id: 144,
          positionX: 15,
          positionZ: 30,
          positionY: 0,
          isActive: true,
          isWall: false,
        },
        {
          id: 145,
          positionX: 30,
          positionZ: 30,
          positionY: 0,
          isActive: true,
          isWall: false,
        },
        {
          id: 146,
          positionX: 45,
          positionZ: 30,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 147,
          positionX: 60,
          positionZ: 30,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 148,
          positionX: 75,
          positionZ: 30,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 149,
          positionX: 90,
          positionZ: 30,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        // {
        //   id: 150,
        //   positionX: 105,
        //   positionZ: 30,
        //   positionY: 0,
        //   isActive: false,
        //   isWall: true,
        // },
        // {
        //   id: 151,
        //   positionX: -105,
        //   positionZ: 45,
        //   positionY: 0,
        //   isActive: false,
        //   isWall: true,
        // },
        {
          id: 152,
          positionX: -90,
          positionZ: 45,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 153,
          positionX: -75,
          positionZ: 45,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 154,
          positionX: -60,
          positionZ: 45,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 155,
          positionX: -45,
          positionZ: 45,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 156,
          positionX: -30,
          positionZ: 45,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 157,
          positionX: -15,
          positionZ: 45,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 158,
          positionX: 0,
          positionZ: 45,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 159,
          positionX: 15,
          positionZ: 45,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 160,
          positionX: 30,
          positionZ: 45,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 161,
          positionX: 45,
          positionZ: 45,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 162,
          positionX: 60,
          positionZ: 45,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 163,
          positionX: 75,
          positionZ: 45,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 164,
          positionX: 90,
          positionZ: 45,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        // {
        //   id: 165,
        //   positionX: 105,
        //   positionZ: 45,
        //   positionY: 0,
        //   isActive: false,
        //   isWall: true,
        // },
        // {
        //   id: 166,
        //   positionX: -105,
        //   positionZ: 60,
        //   positionY: 0,
        //   isActive: false,
        //   isWall: true,
        // },
        {
          id: 167,
          positionX: -90,
          positionZ: 60,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 168,
          positionX: -75,
          positionZ: 60,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 169,
          positionX: -60,
          positionZ: 60,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 170,
          positionX: -45,
          positionZ: 60,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 171,
          positionX: -30,
          positionZ: 60,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 172,
          positionX: -15,
          positionZ: 60,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 173,
          positionX: 0,
          positionZ: 60,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 174,
          positionX: 15,
          positionZ: 60,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 175,
          positionX: 30,
          positionZ: 60,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 176,
          positionX: 45,
          positionZ: 60,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 177,
          positionX: 60,
          positionZ: 60,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 178,
          positionX: 75,
          positionZ: 60,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 179,
          positionX: 90,
          positionZ: 60,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        // {
        //   id: 180,
        //   positionX: 105,
        //   positionZ: 60,
        //   positionY: 0,
        //   isActive: false,
        //   isWall: true,
        // },
        // {
        //   id: 181,
        //   positionX: -105,
        //   positionZ: 75,
        //   positionY: 0,
        //   isActive: false,
        //   isWall: true,
        // },
        {
          id: 182,
          positionX: -90,
          positionZ: 75,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 183,
          positionX: -75,
          positionZ: 75,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 184,
          positionX: -60,
          positionZ: 75,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 185,
          positionX: -45,
          positionZ: 75,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 186,
          positionX: -30,
          positionZ: 75,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 187,
          positionX: -15,
          positionZ: 75,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 188,
          positionX: 0,
          positionZ: 75,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 189,
          positionX: 15,
          positionZ: 75,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 190,
          positionX: 30,
          positionZ: 75,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 191,
          positionX: 45,
          positionZ: 75,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 192,
          positionX: 60,
          positionZ: 75,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 193,
          positionX: 75,
          positionZ: 75,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 194,
          positionX: 90,
          positionZ: 75,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        // {
        //   id: 195,
        //   positionX: 105,
        //   positionZ: 75,
        //   positionY: 0,
        //   isActive: false,
        //   isWall: true,
        // },
        // {
        //   id: 196,
        //   positionX: -105,
        //   positionZ: 90,
        //   positionY: 0,
        //   isActive: false,
        //   isWall: true,
        // },
        {
          id: 197,
          positionX: -90,
          positionZ: 90,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 198,
          positionX: -75,
          positionZ: 90,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 199,
          positionX: -60,
          positionZ: 90,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 200,
          positionX: -45,
          positionZ: 90,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 201,
          positionX: -30,
          positionZ: 90,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 202,
          positionX: -15,
          positionZ: 90,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 203,
          positionX: 0,
          positionZ: 90,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 204,
          positionX: 15,
          positionZ: 90,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 205,
          positionX: 30,
          positionZ: 90,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 206,
          positionX: 45,
          positionZ: 90,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 207,
          positionX: 60,
          positionZ: 90,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 208,
          positionX: 75,
          positionZ: 90,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        {
          id: 209,
          positionX: 90,
          positionZ: 90,
          positionY: 0,
          isActive: false,
          isWall: false,
        },
        // {
        //   id: 210,
        //   positionX: 105,
        //   positionZ: 90,
        //   positionY: 0,
        //   isActive: false,
        //   isWall: true,
        // },
        // {
        //   id: 211,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        //   isWall: true,
        // },
        // {
        //   id: 212,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        //   isWall: true,
        // },
        // {
        //   id: 213,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        //   isWall: true,
        // },
        // {
        //   id: 214,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        //   isWall: true,
        // },
        // {
        //   id: 215,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        //   isWall: true,
        // },
        // {
        //   id: 216,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        //   isWall: true,
        // },
        // {
        //   id: 217,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        //   isWall: true,
        // },
        // {
        //   id: 218,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        //   isWall: true,
        // },

        // {
        //   id: 219,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        //   isWall: true,
        // },

        // {
        //   id: 220,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        //   isWall: true,
        // },
        // {
        //   id: 221,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        //   isWall: true,
        // },
        // {
        //   id: 222,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        //   isWall: true,
        // },
        // {
        //   id: 223,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        //   isWall: true,
        // },
        // {
        //   id: 224,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        //   isWall: true,
        // },
        // {
        //   id: 225,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        //   isWall: true,
        // },
      ],
    };
  },
  getters: {
    activeModularList: (state) =>
      state.groundDataList.filter(
        (data: GroundData) => data.isActive && !data.isWall
      ),
    // topLeftList: (getters) => {
    //   return (type: string) =>
    //     getters.activeModularList
    //       .filter(
    //         (data: GroundData) => data.topLeft && data.topLeft.type === type
    //       )
    //       .map((data: GroundData) => {
    //         return {
    //           positionX: data.positionX - 3.5,
    //           positionZ: data.positionZ - 3.5,
    //           rotationY: data.topLeft?.rotationY,
    //           positionType: data.topLeft?.positionType,
    //           id: data.id,
    //         };
    //       });
    // },
    // topRightList: (getters) => {
    //   return (type: string) =>
    //     getters.activeModularList
    //       .filter(
    //         (data: GroundData) => data.topRight && data.topRight.type === type
    //       )
    //       .map((data: GroundData) => {
    //         return {
    //           positionX: data.positionX + 3.5,
    //           positionZ: data.positionZ - 3.5,
    //           rotationY: data.topRight?.rotationY,
    //           positionType: data.topRight?.positionType,
    //           id: data.id,
    //         };
    //       });
    // },
    // centerList: (getters) => {
    //   return (type: string) =>
    //     getters.activeModularList
    //       .filter(
    //         (data: GroundData) => data.center && data.center.type === type
    //       )
    //       .map((data: GroundData) => {
    //         return {
    //           positionX: data.positionX,
    //           positionZ: data.positionZ,
    //           rotationY: data.center?.rotationY,
    //           positionType: data.center?.positionType,
    //           id: data.id,
    //         };
    //       });
    // },
    // bottomRightList: (getters) => {
    //   return (type: string) =>
    //     getters.activeModularList
    //       .filter(
    //         (data: GroundData) =>
    //           data.bottomRight && data.bottomRight.type === type
    //       )
    //       .map((data: GroundData) => {
    //         return {
    //           positionX: data.positionX - 3.5,
    //           positionZ: data.positionZ + 3.5,
    //           rotationY: data.bottomRight?.rotationY,
    //           positionType: data.bottomRight?.positionType,
    //           id: data.id,
    //         };
    //       });
    // },
    // bottomLeftList: (getters) => {
    //   return (type: string) =>
    //     getters.activeModularList
    //       .filter(
    //         (data: GroundData) =>
    //           data.bottomLeft && data.bottomLeft.type === type
    //       )
    //       .map((data: GroundData) => {
    //         return {
    //           positionX: data.positionX + 3.5,
    //           positionZ: data.positionZ + 3.5,
    //           rotationY: data.bottomLeft?.rotationY,
    //           positionType: data.bottomLeft?.positionType,
    //           id: data.id,
    //         };
    //       });
    // },
    // bushList: (getters) =>
    //   [].concat(
    //     getters.topLeftList("bush"),
    //     getters.topRightList("bush"),
    //     getters.centerList("bush"),
    //     getters.bottomRightList("bush"),
    //     getters.bottomLeftList("bush")
    //   ),
    // bushStickList: (getters) =>
    //   [].concat(
    //     getters.topLeftList("bush-stick"),
    //     getters.topRightList("bush-stick"),
    //     getters.centerList("bush-stick"),
    //     getters.bottomRightList("bush-stick"),
    //     getters.bottomLeftList("bush-stick")
    //   ),
    // treeList: (getters) =>
    //   [].concat(
    //     getters.topLeftList("tree"),
    //     getters.topRightList("tree"),
    //     getters.centerList("tree"),
    //     getters.bottomRightList("tree"),
    //     getters.bottomLeftList("tree")
    //   ),
    // treeSecondList: (getters) =>
    //   [].concat(
    //     getters.topLeftList("tree-second"),
    //     getters.topRightList("tree-second"),
    //     getters.centerList("tree-second"),
    //     getters.bottomRightList("tree-second"),
    //     getters.bottomLeftList("tree-second")
    //   ),
    // fernList: (getters) =>
    //   [].concat(
    //     getters.topLeftList("fern"),
    //     getters.topRightList("fern"),
    //     getters.centerList("fern"),
    //     getters.bottomRightList("fern"),
    //     getters.bottomLeftList("fern")
    //   ),
  },
  actions: {
    updatePieces(data: GroundData[]) {
      const newList = [] as GroundData[];
      this.groundDataList = this.groundDataList.map(
        (groundData: GroundData) => {
          const element = data.find(
            (el: GroundData) => el.id === groundData.id
          );

          if (element) {
            const random = Math.floor(Math.random() * 5);
            const newData = {
              ...groundData,
              isActive: true,
              ...this.randomModuleFlora[random],
            };
            newList.push(newData);
            return newData;
          }

          return groundData;
        }
      );
      floraStore().setFloraLists(newList);
    },
    setRandomModular() {
      this.groundDataList.forEach((data, index) => {
        if (data.isActive && data.id !== 113) {
          const random = Math.floor(Math.random() * 5);
          this.groundDataList[index] = {
            ...data,
            ...this.randomModuleFlora[random],
          };
        }
      });
    },
    removeElementFromModule(data) {
      const index = this.groundDataList.findIndex(
        (element) => element.id === data.id
      );
      console.log(index);
      if (index === -1) return;
      switch (data.positionType) {
        case "topRight":
          this.groundDataList[index].topRight = {};
          break;
        case "topLeft":
          this.groundDataList[index].topLeft = {};
          break;
        case "center":
          this.groundDataList[index].center = {};
          break;
        case "bottomLeft":
          this.groundDataList[index].bottomLeft = {};
          break;
        case "bottomRight":
          this.groundDataList[index].bottomRight = {};
          break;

        default:
          break;
      }
    },
    setGroundPiecesListsClear() {
      this.groundZeroList = [];
      this.groundOneSideList = [];
      this.groundCornerList = [];
      this.groundTwoSideList = [];
      this.groundThreeSideList = [];
    },
    setGroundPiecesLists() {
      this.activeModularList.forEach((element) => {
        const isLeftActive = this.activeModularList.find(
          (data) => data.id === element.id - 1
        );
        const isRightActive = this.activeModularList.find(
          (data) => data.id === element.id + 1
        );

        const isTopActive = this.activeModularList.find(
          (data) => data.id === element.id - 15
        );
        const isBottomActive = this.activeModularList.find(
          (data) => data.id === element.id + 15
        );
        if (isLeftActive && isRightActive && isTopActive && isBottomActive) {
          this.groundZeroList.push(element);
        } else if (
          isLeftActive &&
          isRightActive &&
          isTopActive &&
          !isBottomActive
        ) {
          this.groundOneSideList.push({ ...element, side: "bottom" });
        } else if (
          !isLeftActive &&
          isRightActive &&
          isTopActive &&
          isBottomActive
        ) {
          this.groundOneSideList.push({ ...element, side: "left" });
        } else if (
          isLeftActive &&
          !isRightActive &&
          isTopActive &&
          isBottomActive
        ) {
          this.groundOneSideList.push({ ...element, side: "right" });
        } else if (
          isLeftActive &&
          isRightActive &&
          !isTopActive &&
          isBottomActive
        ) {
          this.groundOneSideList.push({ ...element, side: "top" });
        } else if (
          !isLeftActive &&
          isRightActive &&
          !isTopActive &&
          isBottomActive
        ) {
          this.groundCornerList.push({ ...element, side: "bottom-right" });
        } else if (
          !isLeftActive &&
          isRightActive &&
          isTopActive &&
          !isBottomActive
        ) {
          this.groundCornerList.push({ ...element, side: "top-right" });
        } else if (
          isLeftActive &&
          !isRightActive &&
          isTopActive &&
          !isBottomActive
        ) {
          this.groundCornerList.push({ ...element, side: "top-left" });
        } else if (
          isLeftActive &&
          !isRightActive &&
          !isTopActive &&
          isBottomActive
        ) {
          this.groundCornerList.push({ ...element, side: "bottom-left" });
        } else if (
          !isLeftActive &&
          isRightActive &&
          !isTopActive &&
          !isBottomActive
        ) {
          this.groundThreeSideList.push({ ...element, side: "right" });
        } else if (
          isLeftActive &&
          !isRightActive &&
          !isTopActive &&
          !isBottomActive
        ) {
          this.groundThreeSideList.push({ ...element, side: "left" });
        } else if (
          !isLeftActive &&
          !isRightActive &&
          !isTopActive &&
          isBottomActive
        ) {
          this.groundThreeSideList.push({ ...element, side: "bottom" });
        } else if (
          !isLeftActive &&
          !isRightActive &&
          isTopActive &&
          !isBottomActive
        ) {
          this.groundThreeSideList.push({ ...element, side: "top" });
        } else if (
          !isLeftActive &&
          !isRightActive &&
          isTopActive &&
          isBottomActive
        ) {
          this.groundTwoSideList.push({ ...element, side: "top-bottom" });
        } else if (
          isLeftActive &&
          isRightActive &&
          !isTopActive &&
          !isBottomActive
        ) {
          this.groundTwoSideList.push({ ...element, side: "left-right" });
        }
      });
    },
  },
});
