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
  groundIds: number[];
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
      groundIds: [
        17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 32, 33, 34, 35, 36,
        37, 38, 39, 40, 41, 42, 43, 44, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56,
        57, 58, 59, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 77, 78,
        79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 92, 93, 94, 95, 96, 97, 98,
        99, 100, 101, 102, 103, 104, 107, 108, 109, 110, 111, 112, 113, 114,
        115, 116, 117, 118, 119, 122, 123, 124, 125, 126, 127, 128, 129, 130,
        131, 132, 133, 134, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146,
        147, 148, 149, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162,
        163, 164, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178,
        179, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194,
        197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209,
      ],
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
        // },
        // {
        //   id: 2,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        // },
        // {
        //   id: 3,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        // },
        // {
        //   id: 4,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        // },
        // {
        //   id: 5,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        // },
        // {
        //   id: 6,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        // },
        // {
        //   id: 7,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        // },
        // {
        //   id: 8,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        // },
        // {
        //   id: 9,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        // },
        // {
        //   id: 10,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        // },
        // {
        //   id: 11,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        // },
        // {
        //   id: 12,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        // },
        // {
        //   id: 13,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        // },
        // {
        //   id: 14,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        // },
        // {
        //   id: 15,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        // },
        // {
        //   id: 16,
        //   positionX: -105,
        //   positionZ: -90,
        //   positionY: 0,
        //   isActive: false,
        // },
        {
          id: 17,
          positionX: -90,
          positionZ: -90,
          positionY: 0,
          isActive: false,
        },
        {
          id: 18,
          positionX: -75,
          positionZ: -90,
          positionY: 0,
          isActive: false,
        },

        {
          id: 19,
          positionX: -60,
          positionZ: -90,
          positionY: 0,
          isActive: false,
        },

        {
          id: 20,
          positionX: -45,
          positionZ: -90,
          positionY: 0,
          isActive: false,
        },
        {
          id: 21,
          positionX: -30,
          positionZ: -90,
          positionY: 0,
          isActive: false,
        },
        {
          id: 22,
          positionX: -15,
          positionZ: -90,
          positionY: 0,
          isActive: false,
        },
        {
          id: 23,
          positionX: 0,
          positionZ: -90,
          positionY: 0,
          isActive: false,
        },
        {
          id: 24,
          positionX: 15,
          positionZ: -90,
          positionY: 0,
          isActive: false,
        },
        {
          id: 25,
          positionX: 30,
          positionZ: -90,
          positionY: 0,
          isActive: false,
        },
        {
          id: 26,
          positionX: 45,
          positionZ: -90,
          positionY: 0,
          isActive: false,
        },
        {
          id: 27,
          positionX: 60,
          positionZ: -90,
          positionY: 0,
          isActive: false,
        },
        {
          id: 28,
          positionX: 75,
          positionZ: -90,
          positionY: 0,
          isActive: false,
        },
        {
          id: 29,
          positionX: 90,
          positionZ: -90,
          positionY: 0,
          isActive: false,
        },
        // {
        //   id: 30,
        //   positionX: 105,
        //   positionZ: -90,
        //   positionY: 0,
        //   isActive: false,
        // },
        // {
        //   id: 31,
        //   positionX: -105,
        //   positionZ: -75,
        //   positionY: 0,
        //   isActive: false,
        // },
        {
          id: 32,
          positionX: -90,
          positionZ: -75,
          positionY: 0,
          isActive: false,
        },
        {
          id: 33,
          positionX: -75,
          positionZ: -75,
          positionY: 0,
          isActive: false,
        },
        {
          id: 34,
          positionX: -60,
          positionZ: -75,
          positionY: 0,
          isActive: false,
        },
        {
          id: 35,
          positionX: -45,
          positionZ: -75,
          positionY: 0,
          isActive: false,
        },
        {
          id: 36,
          positionX: -30,
          positionZ: -75,
          positionY: 0,
          isActive: false,
        },
        {
          id: 37,
          positionX: -15,
          positionZ: -75,
          positionY: 0,
          isActive: false,
        },
        {
          id: 38,
          positionX: 0,
          positionZ: -75,
          positionY: 0,
          isActive: false,
        },
        {
          id: 39,
          positionX: 15,
          positionZ: -75,
          positionY: 0,
          isActive: false,
        },
        {
          id: 40,
          positionX: 30,
          positionZ: -75,
          positionY: 0,
          isActive: false,
        },
        {
          id: 41,
          positionX: 45,
          positionZ: -75,
          positionY: 0,
          isActive: false,
        },
        {
          id: 42,
          positionX: 60,
          positionZ: -75,
          positionY: 0,
          isActive: false,
        },
        {
          id: 43,
          positionX: 75,
          positionZ: -75,
          positionY: 0,
          isActive: false,
        },
        {
          id: 44,
          positionX: 90,
          positionZ: -75,
          positionY: 0,
          isActive: false,
        },
        // {
        //   id: 45,
        //   positionX: 105,
        //   positionZ: -75,
        //   positionY: 0,
        //   isActive: false,
        // },
        // {
        //   id: 46,
        //   positionX: -105,
        //   positionZ: -60,
        //   positionY: 0,
        //   isActive: false,
        // },
        {
          id: 47,
          positionX: -90,
          positionZ: -60,
          positionY: 0,
          isActive: false,
        },
        {
          id: 48,
          positionX: -75,
          positionZ: -60,
          positionY: 0,
          isActive: false,
        },
        {
          id: 49,
          positionX: -60,
          positionZ: -60,
          positionY: 0,
          isActive: false,
        },
        {
          id: 50,
          positionX: -45,
          positionZ: -60,
          positionY: 0,
          isActive: false,
        },
        {
          id: 51,
          positionX: -30,
          positionZ: -60,
          positionY: 0,
          isActive: false,
        },
        {
          id: 52,
          positionX: -15,
          positionZ: -60,
          positionY: 0,
          isActive: false,
        },
        {
          id: 53,
          positionX: 0,
          positionZ: -60,
          positionY: 0,
          isActive: false,
        },
        {
          id: 54,
          positionX: 15,
          positionZ: -60,
          positionY: 0,
          isActive: false,
        },
        {
          id: 55,
          positionX: 30,
          positionZ: -60,
          positionY: 0,
          isActive: false,
        },
        {
          id: 56,
          positionX: 45,
          positionZ: -60,
          positionY: 0,
          isActive: false,
        },
        {
          id: 57,
          positionX: 60,
          positionZ: -60,
          positionY: 0,
          isActive: false,
        },
        {
          id: 58,
          positionX: 75,
          positionZ: -60,
          positionY: 0,
          isActive: false,
        },
        {
          id: 59,
          positionX: 90,
          positionZ: -60,
          positionY: 0,
          isActive: false,
        },
        // {
        //   id: 60,
        //   positionX: 105,
        //   positionZ: -60,
        //   positionY: 0,
        //   isActive: false,
        // },
        // {
        //   id: 61,
        //   positionX: -105,
        //   positionZ: -45,
        //   positionY: 0,
        //   isActive: false,
        // },
        {
          id: 62,
          positionX: -90,
          positionZ: -45,
          positionY: 0,
          isActive: false,
        },
        {
          id: 63,
          positionX: -75,
          positionZ: -45,
          positionY: 0,
          isActive: false,
        },
        {
          id: 64,
          positionX: -60,
          positionZ: -45,
          positionY: 0,
          isActive: false,
        },
        {
          id: 65,
          positionX: -45,
          positionZ: -45,
          positionY: 0,
          isActive: false,
        },
        {
          id: 66,
          positionX: -30,
          positionZ: -45,
          positionY: 0,
          isActive: false,
        },
        {
          id: 67,
          positionX: -15,
          positionZ: -45,
          positionY: 0,
          isActive: false,
        },
        {
          id: 68,
          positionX: 0,
          positionZ: -45,
          positionY: 0,
          isActive: false,
        },
        {
          id: 69,
          positionX: 15,
          positionZ: -45,
          positionY: 0,
          isActive: false,
        },
        {
          id: 70,
          positionX: 30,
          positionZ: -45,
          positionY: 0,
          isActive: false,
        },
        {
          id: 71,
          positionX: 45,
          positionZ: -45,
          positionY: 0,
          isActive: false,
        },
        {
          id: 72,
          positionX: 60,
          positionZ: -45,
          positionY: 0,
          isActive: false,
        },
        {
          id: 73,
          positionX: 75,
          positionZ: -45,
          positionY: 0,
          isActive: false,
        },
        {
          id: 74,
          positionX: 90,
          positionZ: -45,
          positionY: 0,
          isActive: false,
        },
        // {
        //   id: 75,
        //   positionX: 105,
        //   positionZ: -45,
        //   positionY: 0,
        //   isActive: false,
        // },
        // {
        //   id: 76,
        //   positionX: -105,
        //   positionZ: -30,
        //   positionY: 0,
        //   isActive: false,
        // },
        {
          id: 77,
          positionX: -90,
          positionZ: -30,
          positionY: 0,
          isActive: false,
        },
        {
          id: 78,
          positionX: -75,
          positionZ: -30,
          positionY: 0,
          isActive: false,
        },
        {
          id: 79,
          positionX: -60,
          positionZ: -30,
          positionY: 0,
          isActive: false,
        },
        {
          id: 80,
          positionX: -45,
          positionZ: -30,
          positionY: 0,
          isActive: false,
        },
        {
          id: 81,
          positionX: -30,
          positionZ: -30,
          positionY: 0,
          isActive: true,
        },
        {
          id: 82,
          positionX: -15,
          positionZ: -30,
          positionY: 0,
          isActive: true,
        },
        {
          id: 83,
          positionX: 0,
          positionZ: -30,
          positionY: 0,
          isActive: true,
        },
        {
          id: 84,
          positionX: 15,
          positionZ: -30,
          positionY: 0,
          isActive: true,
        },
        {
          id: 85,
          positionX: 30,
          positionZ: -30,
          positionY: 0,
          isActive: true,
        },
        {
          id: 86,
          positionX: 45,
          positionZ: -30,
          positionY: 0,
          isActive: false,
        },
        {
          id: 87,
          positionX: 60,
          positionZ: -30,
          positionY: 0,
          isActive: false,
        },
        {
          id: 88,
          positionX: 75,
          positionZ: -30,
          positionY: 0,
          isActive: false,
        },
        {
          id: 89,
          positionX: 90,
          positionZ: -30,
          positionY: 0,
          isActive: false,
        },
        // {
        //   id: 90,
        //   positionX: 105,
        //   positionZ: -30,
        //   positionY: 0,
        //   isActive: false,
        // },
        // {
        //   id: 91,
        //   positionX: -105,
        //   positionZ: -15,
        //   positionY: 0,
        //   isActive: false,
        // },
        {
          id: 92,
          positionX: -90,
          positionZ: -15,
          positionY: 0,
          isActive: false,
        },
        {
          id: 93,
          positionX: -75,
          positionZ: -15,
          positionY: 0,
          isActive: false,
        },
        {
          id: 94,
          positionX: -60,
          positionZ: -15,
          positionY: 0,
          isActive: false,
        },
        {
          id: 95,
          positionX: -45,
          positionZ: -15,
          positionY: 0,
          isActive: false,
        },
        {
          id: 96,
          positionX: -30,
          positionZ: -15,
          positionY: 0,
          isActive: true,
        },
        {
          id: 97,
          positionX: -15,
          positionZ: -15,
          positionY: 0,
          isActive: true,
        },
        {
          id: 98,
          positionX: 0,
          positionZ: -15,
          positionY: 0,
          isActive: true,
        },
        {
          id: 99,
          positionX: 15,
          positionZ: -15,
          positionY: 0,
          isActive: true,
        },
        {
          id: 100,
          positionX: 30,
          positionZ: -15,
          positionY: 0,
          isActive: true,
        },
        {
          id: 101,
          positionX: 45,
          positionZ: -15,
          positionY: 0,
          isActive: false,
        },
        {
          id: 102,
          positionX: 60,
          positionZ: -15,
          positionY: 0,
          isActive: false,
        },
        {
          id: 103,
          positionX: 75,
          positionZ: -15,
          positionY: 0,
          isActive: false,
        },
        {
          id: 104,
          positionX: 90,
          positionZ: -15,
          positionY: 0,
          isActive: false,
        },
        // {
        //   id: 105,
        //   positionX: 105,
        //   positionZ: -15,
        //   positionY: 0,
        //   isActive: false,
        // },
        // {
        //   id: 106,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        // },
        {
          id: 107,
          positionX: -90,
          positionZ: 0,
          positionY: 0,
          isActive: false,
        },
        {
          id: 108,
          positionX: -75,
          positionZ: 0,
          positionY: 0,
          isActive: false,
        },
        {
          id: 109,
          positionX: -60,
          positionZ: 0,
          positionY: 0,
          isActive: false,
        },
        {
          id: 110,
          positionX: -45,
          positionZ: 0,
          positionY: 0,
          isActive: false,
        },
        {
          id: 111,
          positionX: -30,
          positionZ: 0,
          positionY: 0,
          isActive: true,
        },
        {
          id: 112,
          positionX: -15,
          positionZ: 0,
          positionY: 0,
          isActive: true,
        },
        {
          id: 113,
          positionX: 0,
          positionZ: 0,
          positionY: 0,
          isActive: true,
        },
        {
          id: 114,
          positionX: 15,
          positionZ: 0,
          positionY: 0,
          isActive: true,
        },
        {
          id: 115,
          positionX: 30,
          positionZ: 0,
          positionY: 0,
          isActive: true,
        },
        {
          id: 116,
          positionX: 45,
          positionZ: 0,
          positionY: 0,
          isActive: false,
        },
        {
          id: 117,
          positionX: 60,
          positionZ: 0,
          positionY: 0,
          isActive: false,
        },
        {
          id: 118,
          positionX: 75,
          positionZ: 0,
          positionY: 0,
          isActive: false,
        },

        {
          id: 119,
          positionX: 90,
          positionZ: 0,
          positionY: 0,
          isActive: false,
        },

        // {
        //   id: 120,
        //   positionX: 105,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        // },
        // {
        //   id: 121,
        //   positionX: -105,
        //   positionZ: 15,
        //   positionY: 0,
        //   isActive: false,
        // },
        {
          id: 122,
          positionX: -90,
          positionZ: 15,
          positionY: 0,
          isActive: false,
        },
        {
          id: 123,
          positionX: -75,
          positionZ: 15,
          positionY: 0,
          isActive: false,
        },
        {
          id: 124,
          positionX: -60,
          positionZ: 15,
          positionY: 0,
          isActive: false,
        },
        {
          id: 125,
          positionX: -45,
          positionZ: 15,
          positionY: 0,
          isActive: false,
        },
        {
          id: 126,
          positionX: -30,
          positionZ: 15,
          positionY: 0,
          isActive: true,
        },
        {
          id: 127,
          positionX: -15,
          positionZ: 15,
          positionY: 0,
          isActive: true,
        },
        {
          id: 128,
          positionX: 0,
          positionZ: 15,
          positionY: 0,
          isActive: true,
        },
        {
          id: 129,
          positionX: 15,
          positionZ: 15,
          positionY: 0,
          isActive: true,
        },
        {
          id: 130,
          positionX: 30,
          positionZ: 15,
          positionY: 0,
          isActive: true,
        },
        {
          id: 131,
          positionX: 45,
          positionZ: 15,
          positionY: 0,
          isActive: false,
        },
        {
          id: 132,
          positionX: 60,
          positionZ: 15,
          positionY: 0,
          isActive: false,
        },
        {
          id: 133,
          positionX: 75,
          positionZ: 15,
          positionY: 0,
          isActive: false,
        },
        {
          id: 134,
          positionX: 90,
          positionZ: 15,
          positionY: 0,
          isActive: false,
        },
        // {
        //   id: 135,
        //   positionX: 105,
        //   positionZ: 15,
        //   positionY: 0,
        //   isActive: false,
        // },
        // {
        //   id: 136,
        //   positionX: -105,
        //   positionZ: 30,
        //   positionY: 0,
        //   isActive: false,
        // },
        {
          id: 137,
          positionX: -90,
          positionZ: 30,
          positionY: 0,
          isActive: false,
        },
        {
          id: 138,
          positionX: -75,
          positionZ: 30,
          positionY: 0,
          isActive: false,
        },
        {
          id: 139,
          positionX: -60,
          positionZ: 30,
          positionY: 0,
          isActive: false,
        },
        {
          id: 140,
          positionX: -45,
          positionZ: 30,
          positionY: 0,
          isActive: false,
        },
        {
          id: 141,
          positionX: -30,
          positionZ: 30,
          positionY: 0,
          isActive: true,
        },
        {
          id: 142,
          positionX: -15,
          positionZ: 30,
          positionY: 0,
          isActive: true,
        },
        {
          id: 143,
          positionX: 0,
          positionZ: 30,
          positionY: 0,
          isActive: true,
        },
        {
          id: 144,
          positionX: 15,
          positionZ: 30,
          positionY: 0,
          isActive: true,
        },
        {
          id: 145,
          positionX: 30,
          positionZ: 30,
          positionY: 0,
          isActive: true,
        },
        {
          id: 146,
          positionX: 45,
          positionZ: 30,
          positionY: 0,
          isActive: false,
        },
        {
          id: 147,
          positionX: 60,
          positionZ: 30,
          positionY: 0,
          isActive: false,
        },
        {
          id: 148,
          positionX: 75,
          positionZ: 30,
          positionY: 0,
          isActive: false,
        },
        {
          id: 149,
          positionX: 90,
          positionZ: 30,
          positionY: 0,
          isActive: false,
        },
        // {
        //   id: 150,
        //   positionX: 105,
        //   positionZ: 30,
        //   positionY: 0,
        //   isActive: false,
        // },
        // {
        //   id: 151,
        //   positionX: -105,
        //   positionZ: 45,
        //   positionY: 0,
        //   isActive: false,
        // },
        {
          id: 152,
          positionX: -90,
          positionZ: 45,
          positionY: 0,
          isActive: false,
        },
        {
          id: 153,
          positionX: -75,
          positionZ: 45,
          positionY: 0,
          isActive: false,
        },
        {
          id: 154,
          positionX: -60,
          positionZ: 45,
          positionY: 0,
          isActive: false,
        },
        {
          id: 155,
          positionX: -45,
          positionZ: 45,
          positionY: 0,
          isActive: false,
        },
        {
          id: 156,
          positionX: -30,
          positionZ: 45,
          positionY: 0,
          isActive: false,
        },
        {
          id: 157,
          positionX: -15,
          positionZ: 45,
          positionY: 0,
          isActive: false,
        },
        {
          id: 158,
          positionX: 0,
          positionZ: 45,
          positionY: 0,
          isActive: false,
        },
        {
          id: 159,
          positionX: 15,
          positionZ: 45,
          positionY: 0,
          isActive: false,
        },
        {
          id: 160,
          positionX: 30,
          positionZ: 45,
          positionY: 0,
          isActive: false,
        },
        {
          id: 161,
          positionX: 45,
          positionZ: 45,
          positionY: 0,
          isActive: false,
        },
        {
          id: 162,
          positionX: 60,
          positionZ: 45,
          positionY: 0,
          isActive: false,
        },
        {
          id: 163,
          positionX: 75,
          positionZ: 45,
          positionY: 0,
          isActive: false,
        },
        {
          id: 164,
          positionX: 90,
          positionZ: 45,
          positionY: 0,
          isActive: false,
        },
        // {
        //   id: 165,
        //   positionX: 105,
        //   positionZ: 45,
        //   positionY: 0,
        //   isActive: false,
        // },
        // {
        //   id: 166,
        //   positionX: -105,
        //   positionZ: 60,
        //   positionY: 0,
        //   isActive: false,
        // },
        {
          id: 167,
          positionX: -90,
          positionZ: 60,
          positionY: 0,
          isActive: false,
        },
        {
          id: 168,
          positionX: -75,
          positionZ: 60,
          positionY: 0,
          isActive: false,
        },
        {
          id: 169,
          positionX: -60,
          positionZ: 60,
          positionY: 0,
          isActive: false,
        },
        {
          id: 170,
          positionX: -45,
          positionZ: 60,
          positionY: 0,
          isActive: false,
        },
        {
          id: 171,
          positionX: -30,
          positionZ: 60,
          positionY: 0,
          isActive: false,
        },
        {
          id: 172,
          positionX: -15,
          positionZ: 60,
          positionY: 0,
          isActive: false,
        },
        {
          id: 173,
          positionX: 0,
          positionZ: 60,
          positionY: 0,
          isActive: false,
        },
        {
          id: 174,
          positionX: 15,
          positionZ: 60,
          positionY: 0,
          isActive: false,
        },
        {
          id: 175,
          positionX: 30,
          positionZ: 60,
          positionY: 0,
          isActive: false,
        },
        {
          id: 176,
          positionX: 45,
          positionZ: 60,
          positionY: 0,
          isActive: false,
        },
        {
          id: 177,
          positionX: 60,
          positionZ: 60,
          positionY: 0,
          isActive: false,
        },
        {
          id: 178,
          positionX: 75,
          positionZ: 60,
          positionY: 0,
          isActive: false,
        },
        {
          id: 179,
          positionX: 90,
          positionZ: 60,
          positionY: 0,
          isActive: false,
        },
        // {
        //   id: 180,
        //   positionX: 105,
        //   positionZ: 60,
        //   positionY: 0,
        //   isActive: false,
        // },
        // {
        //   id: 181,
        //   positionX: -105,
        //   positionZ: 75,
        //   positionY: 0,
        //   isActive: false,
        // },
        {
          id: 182,
          positionX: -90,
          positionZ: 75,
          positionY: 0,
          isActive: false,
        },
        {
          id: 183,
          positionX: -75,
          positionZ: 75,
          positionY: 0,
          isActive: false,
        },
        {
          id: 184,
          positionX: -60,
          positionZ: 75,
          positionY: 0,
          isActive: false,
        },
        {
          id: 185,
          positionX: -45,
          positionZ: 75,
          positionY: 0,
          isActive: false,
        },
        {
          id: 186,
          positionX: -30,
          positionZ: 75,
          positionY: 0,
          isActive: false,
        },
        {
          id: 187,
          positionX: -15,
          positionZ: 75,
          positionY: 0,
          isActive: false,
        },
        {
          id: 188,
          positionX: 0,
          positionZ: 75,
          positionY: 0,
          isActive: false,
        },
        {
          id: 189,
          positionX: 15,
          positionZ: 75,
          positionY: 0,
          isActive: false,
        },
        {
          id: 190,
          positionX: 30,
          positionZ: 75,
          positionY: 0,
          isActive: false,
        },
        {
          id: 191,
          positionX: 45,
          positionZ: 75,
          positionY: 0,
          isActive: false,
        },
        {
          id: 192,
          positionX: 60,
          positionZ: 75,
          positionY: 0,
          isActive: false,
        },
        {
          id: 193,
          positionX: 75,
          positionZ: 75,
          positionY: 0,
          isActive: false,
        },
        {
          id: 194,
          positionX: 90,
          positionZ: 75,
          positionY: 0,
          isActive: false,
        },
        // {
        //   id: 195,
        //   positionX: 105,
        //   positionZ: 75,
        //   positionY: 0,
        //   isActive: false,
        // },
        // {
        //   id: 196,
        //   positionX: -105,
        //   positionZ: 90,
        //   positionY: 0,
        //   isActive: false,
        // },
        {
          id: 197,
          positionX: -90,
          positionZ: 90,
          positionY: 0,
          isActive: false,
        },
        {
          id: 198,
          positionX: -75,
          positionZ: 90,
          positionY: 0,
          isActive: false,
        },
        {
          id: 199,
          positionX: -60,
          positionZ: 90,
          positionY: 0,
          isActive: false,
        },
        {
          id: 200,
          positionX: -45,
          positionZ: 90,
          positionY: 0,
          isActive: false,
        },
        {
          id: 201,
          positionX: -30,
          positionZ: 90,
          positionY: 0,
          isActive: false,
        },
        {
          id: 202,
          positionX: -15,
          positionZ: 90,
          positionY: 0,
          isActive: false,
        },
        {
          id: 203,
          positionX: 0,
          positionZ: 90,
          positionY: 0,
          isActive: false,
        },
        {
          id: 204,
          positionX: 15,
          positionZ: 90,
          positionY: 0,
          isActive: false,
        },
        {
          id: 205,
          positionX: 30,
          positionZ: 90,
          positionY: 0,
          isActive: false,
        },
        {
          id: 206,
          positionX: 45,
          positionZ: 90,
          positionY: 0,
          isActive: false,
        },
        {
          id: 207,
          positionX: 60,
          positionZ: 90,
          positionY: 0,
          isActive: false,
        },
        {
          id: 208,
          positionX: 75,
          positionZ: 90,
          positionY: 0,
          isActive: false,
        },
        {
          id: 209,
          positionX: 90,
          positionZ: 90,
          positionY: 0,
          isActive: false,
        },
        // {
        //   id: 210,
        //   positionX: 105,
        //   positionZ: 90,
        //   positionY: 0,
        //   isActive: false,
        // },
        // {
        //   id: 211,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        // },
        // {
        //   id: 212,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        // },
        // {
        //   id: 213,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        // },
        // {
        //   id: 214,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        // },
        // {
        //   id: 215,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        // },
        // {
        //   id: 216,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        // },
        // {
        //   id: 217,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        // },
        // {
        //   id: 218,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        // },

        // {
        //   id: 219,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        // },

        // {
        //   id: 220,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        // },
        // {
        //   id: 221,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        // },
        // {
        //   id: 222,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        // },
        // {
        //   id: 223,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        // },
        // {
        //   id: 224,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        // },
        // {
        //   id: 225,
        //   positionX: 0,
        //   positionZ: 0,
        //   positionY: 0,
        //   isActive: false,
        // },
      ],
    };
  },
  getters: {
    activeModularList: (state) =>
      state.groundDataList.filter((data: GroundData) => data.isActive),
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
