import { useCharacterStore } from "~/stores/character";
import { Object3D, Vector3 } from "three";
import {
  CSS2DObject,
  CSS2DRenderer,
} from "three/addons/renderers/CSS2DRenderer.js";
export const useUtils = () => {
  const { $gsap } = useNuxtApp();
  const storeControls = useControlsStore();
  const characterStore = useCharacterStore();
  const { positionCharacter, angle } = storeToRefs(characterStore);
  const offsetDistance = ref(1.5);
  const { camera, scene } = useTresContext();

  const jump = (model: Object3D) => {
    $gsap.to(model.position, {
      y: model.position.y + characterStore.jumpHeight,
      duration: 0.4,
      ease: "power1.out",
      onComplete: () => {
        $gsap.to(model.position, {
          y: 0.4,
          duration: 0.4,
          ease: "power1.in",
          onComplete: () => {
            storeControls.setIsJumping(false);
          },
        });
      },
    });
  };
  const dx = ref(0);
  const dz = ref(0);
  const calculateDistance = (modelPosition: Vector3) => {
    dx.value = modelPosition.x - positionCharacter.value.x;
    dz.value = modelPosition.z - positionCharacter.value.z;
    return Math.sqrt(dx.value * dx.value + dz.value * dz.value);
  };

  const maxRotation = ref(1);
  const maxDistance = ref(1.5);
  const direction = ref(new Vector3());
  const currentDistance = ref(0);
  const factor = ref(0);
  const limitedAngle = ref(0);
  const sign = ref(0);
  const signY = ref(0);
  const bendModel = (position: Vector3) => {
    direction.value.subVectors(positionCharacter.value, position).normalize();
    currentDistance.value = calculateDistance(position);

    factor.value = 1 - Math.min(currentDistance.value / maxDistance.value, 1);
    limitedAngle.value = maxRotation.value * factor.value;
    sign.value = direction.value.z > 0 ? -1 : 1;
    signY.value = direction.value.x > 0 ? 1 : -1;
    return {
      x: limitedAngle.value * sign.value,
      z: limitedAngle.value * signY.value,
    };
  };

  const offsetX = ref();
  const offsetZ = ref();
  const setPositionItem = () => {
    offsetX.value = offsetDistance.value * Math.sin(angle.value);
    offsetZ.value = offsetDistance.value * Math.cos(angle.value);
    return {
      z: positionCharacter.value.z + offsetZ.value,
      x: positionCharacter.value.x + offsetX.value,
    };
  };

  const checkDistance = (model: Object3D) => {
    return positionCharacter.value.distanceTo(model.position);
  };

  const planeWidth = ref(1.6);
  const planeHeight = ref(1.6);
  const isCharacterOnModel = (model: Object3D, x: number, z: number) => {
    return (
      positionCharacter.value.x >=
        model.position.x + x - planeWidth.value / 2 &&
      positionCharacter.value.x <=
        model.position.x + x + planeWidth.value / 2 &&
      positionCharacter.value.z >=
        model.position.z + z - planeHeight.value / 2 &&
      positionCharacter.value.z <= model.position.z + z + planeHeight.value / 2
    );
  };

  return {
    jump,
    bendModel,
    calculateDistance,
    setPositionItem,
    isCharacterOnModel,
    checkDistance,
  };
};
