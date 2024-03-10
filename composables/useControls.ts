import { useCharacterStore } from "~/stores/character";
import { useControlsStore } from "~/stores/controls";
import { Object3D, Vector3 } from "three";
export const useCharacterControls = () => {
  const { $gsap } = useNuxtApp();
  const characterStore = useCharacterStore();
  const storeControl = useControlsStore();
  const { angle } = storeToRefs(storeControl);
  const { positionCharacter, characterAngle } = storeToRefs(characterStore);

  const targetRotationNormalized = ref();
  const rotationDiff = ref();
  const currentRotation = ref();
  const normalizedRotationDiff = ref();
  const changeModelRotation = (model: Object3D) => {
    currentRotation.value = Number(model.rotation.y.toFixed(1));
    // console.log("angle.value", angle.value);
    // console.log("currentRotation.value", currentRotation.value);
    // model.rotation.y = -angle.value;
    if (currentRotation.value !== angle.value) {
      // Oblicz różnicę obrotu
      rotationDiff.value = angle.value - currentRotation.value;

      // Znormalizuj różnicę do zakresu [-π, π]
      normalizedRotationDiff.value =
        ((rotationDiff.value + Math.PI) % (2 * Math.PI)) - Math.PI;

      // Oblicz docelowy obrót
      targetRotationNormalized.value = (
        currentRotation.value + normalizedRotationDiff.value
      ).toFixed(1);

      // Ustaw animację za pomocą GSAP
      $gsap.to(model.rotation, {
        duration: 0.5,
        y: Number(targetRotationNormalized.value),
      });
    }
  };

  const setBorders = (model: Object3D) => {
    if (
      (model.position.x + 1.5 >= positionCharacter.value.x &&
        model.position.x + 1 <= positionCharacter.value.x &&
        model.position.z + 1.3 >= positionCharacter.value.z &&
        model.position.z - 1.3 <= positionCharacter.value.z) ||
      (positionCharacter.value.z <= 11.94 &&
        positionCharacter.value.z >= 3 &&
        positionCharacter.value.x <= 2.4 &&
        positionCharacter.value.x >= 1) ||
      (positionCharacter.value.x <= 11 &&
        positionCharacter.value.x >= 10 &&
        positionCharacter.value.z <= 4 &&
        positionCharacter.value.z >= -11)
    ) {
      storeControl.setBlockA(true);
    } else {
      storeControl.setBlockA(false);
    }

    if (
      (model.position.x - 1.5 <= positionCharacter.value.x &&
        model.position.x - 1 >= positionCharacter.value.x &&
        model.position.z + 1.3 >= positionCharacter.value.z &&
        model.position.z - 1.3 <= positionCharacter.value.z) ||
      (positionCharacter.value.z >= 4 &&
        positionCharacter.value.z <= 11.94 &&
        positionCharacter.value.x >= -2.4 &&
        positionCharacter.value.x <= -1.4) ||
      (positionCharacter.value.z <= 4 &&
        positionCharacter.value.z >= -10.6 &&
        positionCharacter.value.x >= -10 &&
        positionCharacter.value.x <= -9)
    ) {
      storeControl.setBlockD(true);
    } else {
      storeControl.setBlockD(false);
    }

    if (
      (model.position.x + 1.3 >= positionCharacter.value.x &&
        model.position.x - 1.3 <= positionCharacter.value.x &&
        model.position.z - 1.5 <= positionCharacter.value.z &&
        model.position.z - 1 >= positionCharacter.value.z) ||
      (positionCharacter.value.z >= -11 &&
        positionCharacter.value.z <= -10 &&
        positionCharacter.value.x <= 11 &&
        positionCharacter.value.x >= -9.7)
    ) {
      storeControl.setBlockS(true);
    } else {
      storeControl.setBlockS(false);
    }

    if (
      (model.position.x + 1.3 >= positionCharacter.value.x &&
        model.position.x - 1.3 <= positionCharacter.value.x &&
        model.position.z + 1.5 >= positionCharacter.value.z &&
        model.position.z + 1 <= positionCharacter.value.z) ||
      (positionCharacter.value.z <= 4.1 &&
        positionCharacter.value.z >= 3 &&
        positionCharacter.value.x >= 2.35 &&
        positionCharacter.value.x <= 10.98) ||
      (positionCharacter.value.z <= 4.1 &&
        positionCharacter.value.x <= -2.3 &&
        positionCharacter.value.x >= -9.95) ||
      (positionCharacter.value.z <= 12 &&
        positionCharacter.value.z >= 11 &&
        positionCharacter.value.x >= -2.35 &&
        positionCharacter.value.x <= 2.35)
    ) {
      storeControl.setBlockW(true);
    } else {
      storeControl.setBlockW(false);
    }
  };

  const characterSeeModelType = (modelPosition: Vector3): string => {
    const directionVector = new Vector3()
      .subVectors(modelPosition, positionCharacter.value)
      .normalize();

    const directionX = directionVector.x;
    const directionZ = directionVector.z;

    if (Math.abs(directionX) > Math.abs(directionZ)) {
      if (directionX > 0) {
        if (characterAngle.value > -0.8 && characterAngle.value < 1.1) {
          // console.log(characterAngle.value);
          // console.log("Character jest po prawej stronie modelu.");
          return "Model right";
        } else {
          // console.log(characterAngle.value);
          // console.log("Character jest po prawej stronie modelu.");
        }
      } else {
        if (characterAngle.value > 2.1 || characterAngle.value < -2.2) {
          // console.log("Character jest po lewej stronie modelu.");
          return "Model left";
        } else {
          // console.log(characterAngle.value);
          // console.log("Character jest po lewej stronie modelu.");
        }
      }
    } else {
      if (directionZ > 0) {
        if (characterAngle.value < 2.3 && characterAngle.value > 0.9) {
          // console.log("Character jest u góry modelu.");
          return "Model up";
        } else {
          // console.log(characterAngle.value);
          // console.log("Character jest u góry modelu.");
        }
      } else {
        if (characterAngle.value > -2.3 && characterAngle.value < -0.5) {
          // console.log("Character jest na dole modelu.");
          return "Model down";
        } else {
          // console.log(characterAngle.value);
          // console.log("Character jest na dole modelu.");
        }
      }
    }
    return "";
  };

  return { changeModelRotation, setBorders, characterSeeModelType };
};
