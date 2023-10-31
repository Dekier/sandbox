interface State {
  positionCharacter: any;
  positionCharacterLookAt: any;
  isActiveHolding: boolean;
}
export const useCharacterStore = defineStore("CharacterStore", {
  state: (): State => {
    return {
      positionCharacter: null,
      positionCharacterLookAt: null,
      isActiveHolding: false,
    };
  },
  getters: {},
  actions: {
    setPositionCharacter(data: any) {
      this.positionCharacter = data;
    },
    setPositionCharacterLookAt(data: any) {
      this.positionCharacterLookAt = data;
    },
    setIsActiveHolding(data: boolean) {
      this.isActiveHolding = data;
    },
  },
});
