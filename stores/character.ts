interface State {
  positionCharacter: any;
  positionCharacterLookAt: any;
  keys: {
    a: boolean;
    s: boolean;
    d: boolean;
    w: boolean;
    shiftleft: boolean;
  };
  angle: number;
}
export const useCharacterStore = defineStore("CharacterStore", {
  state: (): State => {
    return {
      positionCharacter: null,
      positionCharacterLookAt: null,
      keys: {
        a: false,
        s: false,
        d: false,
        w: false,
        shiftleft: false,
      },
      angle: 0,
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

    setKeysTrue(key: string) {
      this.keys[key] = true;
    },
    setKeysFalse(key: any) {
      this.keys[key] = false;
    },
    setAngle(data: number) {
      this.angle = data;
    },
  },
});
