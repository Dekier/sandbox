interface TreeSecondData {
  positionX: Number;
  positionZ: Number;
  cutStep: Number;
  scale: Number;
  rotationY: Number;
}
interface TreeData {
  positionX: Number;
  positionZ: Number;
  scale: Number;
  rotationY: Number;
}
interface BushData {
  positionX: Number;
  positionZ: Number;
  positionY: Number;
}
interface State {
  treeData: TreeData[];
  treeSecondData: TreeSecondData[];
  bushData: BushData[];
}
export const useFloraStore = defineStore("FloraStore", {
  state: (): State => {
    return {
      bushData: [
        { positionX: 10, positionZ: 16, positionY: 0 },
        { positionX: 22, positionZ: 1, positionY: 0 },
        { positionX: -30, positionZ: 23, positionY: 0 },
        { positionX: -23, positionZ: -7, positionY: 0 },
        { positionX: 50, positionZ: 56, positionY: 0 },
        { positionX: -44, positionZ: -36, positionY: 0 },
        { positionX: 30, positionZ: -24, positionY: 0 },
        { positionX: 3, positionZ: -50, positionY: 0 },
        { positionX: 53, positionZ: 4, positionY: 0 },
        { positionX: 32, positionZ: 40, positionY: 0 },
        { positionX: -50, positionZ: 60, positionY: 0 },
        { positionX: -47, positionZ: -3, positionY: 0 },
        { positionX: -10, positionZ: 53, positionY: 0 },
      ],
      treeData: [
        {
          positionX: -30,
          positionZ: 10,
          scale: 0.6 + Math.random() * 0.7,
          rotationY: Math.random() * 360,
        },
        {
          positionX: -62,
          positionZ: 56,
          scale: 0.6 + Math.random() * 0.7,
          rotationY: Math.random() * 360,
        },
        {
          positionX: -57,
          positionZ: -53,
          scale: 0.6 + Math.random() * 0.7,
          rotationY: Math.random() * 360,
        },
        {
          positionX: 18,
          positionZ: 53,
          scale: 0.6 + Math.random() * 0.7,
          rotationY: Math.random() * 360,
        },
        {
          positionX: -20,
          positionZ: 65,
          scale: 0.6 + Math.random() * 0.7,
          rotationY: Math.random() * 360,
        },
        {
          positionX: 30,
          positionZ: -30,
          scale: 0.6 + Math.random() * 0.7,
          rotationY: Math.random() * 360,
        },
        {
          positionX: 10,
          positionZ: -50,
          scale: 0.6 + Math.random() * 0.7,
          rotationY: Math.random() * 360,
        },
        {
          positionX: 60,
          positionZ: 3,
          scale: 0.6 + Math.random() * 0.7,
          rotationY: Math.random() * 360,
        },
      ],
      treeSecondData: [
        {
          positionX: 50,
          positionZ: 40,
          cutStep: 1,
          scale: 0.6 + Math.random() * 0.7,
          rotationY: Math.random() * 360,
        },
        {
          positionX: 30,
          positionZ: 10,
          cutStep: 1,
          scale: 0.6 + Math.random() * 0.7,
          rotationY: Math.random() * 360,
        },
        {
          positionX: -30,
          positionZ: -30,
          cutStep: 1,
          scale: 0.6 + Math.random() * 0.7,
          rotationY: Math.random() * 360,
        },
        {
          positionX: -34,
          positionZ: 45,
          cutStep: 1,
          scale: 0.6 + Math.random() * 0.7,
          rotationY: Math.random() * 360,
        },
        {
          positionX: 0,
          positionZ: 50,
          cutStep: 1,
          scale: 0.6 + Math.random() * 0.7,
          rotationY: Math.random() * 360,
        },
        {
          positionX: -70,
          positionZ: 10,
          cutStep: 1,
          scale: 0.6 + Math.random() * 0.7,
          rotationY: Math.random() * 360,
        },
        {
          positionX: 60,
          positionZ: -50,
          cutStep: 1,
          scale: 0.6 + Math.random() * 0.7,
          rotationY: Math.random() * 360,
        },
        {
          positionX: 4,
          positionZ: -30,
          cutStep: 1,
          scale: 0.6 + Math.random() * 0.7,
          rotationY: Math.random() * 360,
        },
      ],
    };
  },
  getters: {},
  actions: {
    //   setCharacterModel(data: any) {
    //     this.characterModel = data;
    //   },
  },
});
