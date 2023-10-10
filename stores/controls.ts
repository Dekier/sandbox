import { Vector3, Quaternion } from "three";
interface State {
  keys: {
    a: boolean;
    s: boolean;
    d: boolean;
    w: boolean;
    shiftleft: boolean;
    space: boolean;
    e: boolean;
  };
  angle: number;
  jumpHeight: number;
  isJumping: boolean;
  directionOffset: number;
  isCharacterWalk: boolean;
  rotateAngle: Vector3;
  rotateQuaternion: Quaternion;
  speed: number;
  velocity: number;
  isBlockW: boolean;
  isBlockS: boolean;
  isBlockA: boolean;
  isBlockD: boolean;
}
export const useControlsStore = defineStore("ControlsStore", {
  state: (): State => {
    return {
      keys: {
        a: false,
        s: false,
        d: false,
        w: false,
        shiftleft: false,
        space: false,
        e: false,
      },
      angle: 0,
      jumpHeight: 2.3,
      isJumping: false,
      directionOffset: 0,
      isCharacterWalk: false,
      rotateAngle: new Vector3(0, -1, 0),
      rotateQuaternion: new Quaternion(),
      speed: 0,
      velocity: 0,
      isBlockW: false,
      isBlockS: false,
      isBlockA: false,
      isBlockD: false,
    };
  },
  getters: {
    keyE: (state) => state.keys.e,
    isMovingCharacter: (state) =>
      state.keys.a || state.keys.d || state.keys.s || state.keys.w,
  },
  actions: {
    setKeysTrue(key: string) {
      this.keys[key] = true;
    },
    setKeysFalse(key: string) {
      this.keys[key] = false;
    },
    setAngle(data: number) {
      this.angle = Number(data.toFixed(1));
    },
    setIsJumping(data: boolean) {
      this.isJumping = data;
    },
    setBlockW(data: boolean) {
      this.isBlockW = data;
    },
    setBlockS(data: boolean) {
      this.isBlockS = data;
    },
    setBlockA(data: boolean) {
      this.isBlockA = data;
    },
    setBlockD(data: boolean) {
      this.isBlockD = data;
    },
    setDirectionOffset() {
      if (this.keys.w) {
        if (this.keys.a) {
          this.directionOffset = -Math.PI / 4 - Math.PI / 2;
        } else if (this.keys.d) {
          this.directionOffset = Math.PI / 4 + Math.PI / 2;
        } else {
          this.directionOffset = Math.PI;
        }
      } else if (this.keys.s) {
        if (this.keys.a) {
          this.directionOffset = -Math.PI / 4;
        } else if (this.keys.d) {
          this.directionOffset = Math.PI / 4;
        } else {
          this.directionOffset = 0;
        }
      } else if (this.keys.a) {
        this.directionOffset = -Math.PI / 2;
      } else if (this.keys.d) {
        this.directionOffset = Math.PI / 2;
      }
    },
    setIsCharacterWalk(data: boolean) {
      this.isCharacterWalk = data;
    },
    setSpeedCharacter() {
      this.speed = 0.0;
      if (this.keys.w) {
        if (this.keys.shiftleft) {
          this.speed = 0.11;
        } else {
          this.speed = 0.08;
        }
      } else if (this.keys.s) {
        if (this.keys.shiftleft) {
          this.speed = -0.11;
        } else {
          this.speed = -0.08;
        }
      } else if (
        (!this.keys.w && !this.keys.s && this.keys.a) ||
        (!this.keys.w && !this.keys.s && this.keys.d)
      ) {
        if (this.keys.shiftleft) {
          this.speed = 0.11;
        } else {
          this.speed = 0.08;
        }
      }
      this.velocity += this.speed - this.velocity;
    },
  },
});
