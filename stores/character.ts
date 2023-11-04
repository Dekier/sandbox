interface State {
  positionCharacter: any;
  positionCharacterLookAt: any;
  isActiveHolding: boolean;
  characterModel: any;
}
export const useCharacterStore = defineStore("CharacterStore", {
  state: (): State => {
    return {
      positionCharacter: null,
      positionCharacterLookAt: null,
      isActiveHolding: false,
      characterModel: null,
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
    setCharacterModel(data: any) {
      this.characterModel = data;
    },
  },
});
