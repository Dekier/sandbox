interface State {
  positionCharacter: any;
  positionCharacterLookAt: any;
  isActiveHolding: boolean;
  characterModel: any;
  characterAngle: number;
  characterIsCloseFern: boolean;
}
export const useCharacterStore = defineStore("CharacterStore", {
  state: (): State => {
    return {
      positionCharacter: null,
      positionCharacterLookAt: null,
      isActiveHolding: false,
      characterModel: null,
      characterAngle: 0,
      characterIsCloseFern: false,
    };
  },
  getters: {
    characterPosition: (state) => state.characterModel.position,
    // characterRotationY: (state) => state.characterModel.rotation
  },
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
    setCharacterAngle(data: any) {
      this.characterAngle = data;
    },
    setCharacterIsCloseFern(data: boolean) {
      this.characterIsCloseFern = data;
    },
  },
});
