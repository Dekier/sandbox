import { Vector3, Quaternion } from "three";
interface State {
  keys: {
    space: boolean;
    e: boolean;
  };
  angle: number;
  jumpHeight: number;
  isJumping: boolean;
  speed: number;
  isBlockW: boolean;
  isBlockS: boolean;
  isBlockA: boolean;
  isBlockD: boolean;
  deltaX: number;
  deltaY: number;
  upPressed: boolean;
  downPressed: boolean;
  leftPressed: boolean;
  rightPressed: boolean;
  leftShiftPressed: boolean;
  xAxis: number;
  zAxis: number;
  buttonRTValue: number;
  userUseGamepad: boolean;
  gamepadButtonYPressed: boolean;
  gamepadButtonXPressed: boolean;
  gamepadButtonAPressed: boolean;
  sanitisedAngle: number;
}
export const useControlsStore = defineStore("ControlsStore", {
  state: (): State => {
    return {
      keys: {
        space: false,
        e: false,
      },
      angle: 0,
      jumpHeight: 2.3,
      isJumping: false,
      speed: 0.06,
      isBlockW: false,
      isBlockS: false,
      isBlockA: false,
      isBlockD: false,
      deltaX: 0,
      deltaY: 0,
      upPressed: false,
      downPressed: false,
      leftPressed: false,
      rightPressed: false,
      leftShiftPressed: false,
      xAxis: 0,
      zAxis: 0,
      buttonRTValue: 0,
      userUseGamepad: false,
      gamepadButtonYPressed: false,
      gamepadButtonXPressed: false,
      gamepadButtonAPressed: false,
      sanitisedAngle: 0,
    };
  },
  getters: {
    keyE: (state) => state.keys.e,
    isMovingCharacter: (state) =>
      state.upPressed ||
      state.downPressed ||
      state.leftPressed ||
      state.rightPressed ||
      state.zAxis > 0.3 ||
      state.zAxis < -0.3 ||
      state.xAxis > 0.3 ||
      state.xAxis < -0.3 ||
      state.deltaX > 0.3 ||
      state.deltaX < -0.3 ||
      state.deltaY > 0.3 ||
      state.deltaY < -0.3,
  },
  actions: {
    setKeysTrue(key: string) {
      this.keys[key] = true;
      if (key === "w" && !this.upPressed) {
        this.setUpPressed(true);
      }

      if (key === "s" && !this.downPressed) {
        this.setDownPressed(true);
      }

      if (key === "a" && !this.leftPressed) {
        this.setLeftPressed(true);
      }

      if (key === "d" && !this.rightPressed) {
        this.setRightPressed(true);
      }
      if (key === "shiftleft" && !this.leftShiftPressed) {
        this.leftShiftPressed = true;
      }
    },
    setKeysFalse(key: string) {
      this.keys[key] = false;
      if (key === "w") {
        this.setUpPressed(false);
      }

      if (key === "s") {
        this.setDownPressed(false);
      }

      if (key === "a") {
        this.setLeftPressed(false);
      }

      if (key === "d") {
        this.setRightPressed(false);
      }
      if (key === "shiftleft") {
        this.leftShiftPressed = false;
      }
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
    // setSpeedCharacter() {
    //   if (this.leftShiftPressed) {
    //     this.speed = 9;
    //   } else if (this.buttonRTValue) {
    //     const value = this.buttonRTValue * 3;
    //     this.speed = 6 + value;
    //   } else {
    //     this.speed = 6;
    //   }
    // },
    setSpeedCharacter() {
      if (this.upPressed) {
        if (this.leftShiftPressed) {
          this.speed = 18;
        } else if (this.buttonRTValue) {
          const value = this.buttonRTValue * 3;
          this.speed = 13 + value;
        } else {
          this.speed = 13;
        }
      }
      if (this.downPressed) {
        if (this.leftShiftPressed) {
          this.speed = -18;
        } else if (this.buttonRTValue) {
          const value = this.buttonRTValue * 3;
          this.speed = -13 - value;
        } else {
          this.speed = -13;
        }
      }
    },
    setDeltaPosition(deltaX, deltaY) {
      if (deltaX > 0.3 || deltaX < -0.3) {
        this.deltaX = deltaX;
      } else {
        this.deltaX = 0;
      }

      if (deltaY > 0.3 || deltaY < -0.3) {
        this.deltaY = deltaY;
      } else {
        this.deltaY = 0;
      }
    },
    setUpPressed(data: boolean) {
      this.upPressed = data;
    },
    setDownPressed(data: boolean) {
      this.downPressed = data;
    },
    setLeftPressed(data: boolean) {
      this.leftPressed = data;
    },
    setRightPressed(data: boolean) {
      this.rightPressed = data;
    },
    setXaxis(data: number) {
      if (data > 0.3 || data < -0.3) {
        this.xAxis = data;
      } else {
        this.xAxis = 0;
      }
    },
    setZaxis(data: number) {
      if (data > 0.3 || data < -0.3) {
        this.zAxis = data;
      } else {
        this.zAxis = 0;
      }
    },
    setButtonRTValue(data: number) {
      this.buttonRTValue = data;
    },
    setUserUseGamepad(data: boolean) {
      this.userUseGamepad = data;
    },
    setGamepadButtonYPressed(data: boolean) {
      this.gamepadButtonYPressed = data;
    },
    setGamepadButtonXPressed(data: boolean) {
      this.gamepadButtonXPressed = data;
    },
    setGamepadButtonAPressed(data: boolean) {
      this.gamepadButtonAPressed = data;
    },
    setSanitisedAngle(data: number) {
      this.sanitisedAngle = data;
    },
  },
});
