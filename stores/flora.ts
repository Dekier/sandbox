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
  // treeData: TreeData[];
  // treeSecondData: TreeSecondData[];
  // bushData: BushData[];
  // bushStickData: BushData[];
}
export const useFloraStore = defineStore("FloraStore", {
  state: (): State => {
    return {};
  },
  getters: {},
  actions: {
    //   setCharacterModel(data: any) {
    //     this.characterModel = data;
    //   },
  },
});
