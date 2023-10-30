<script setup lang="ts">
import { MeshBasicMaterial } from "three";
const { $gsap } = useNuxtApp();
import { useGLTF, Html } from "@tresjs/cientos";
import { useModelSettings } from "~/composables/useModel";
import { useControls } from "~/composables/useControls";
const { setModel } = useModelSettings();
const { setBorders } = useControls();
const storeControl = useControlsStore();
const { nodes } = await useGLTF("/models/tool-box.glb", { draco: true });
const { isCharacterOnModel, checkDistance, setPositionItem } = useUtils();
const hudStore = useHudStore();
const { isActiveGamepad } = storeToRefs(hudStore);
const { isMovingCharacter } = storeToRefs(storeControl);
const characterStore = useCharacterStore();
const controlsStore = useControlsStore();
const { positionCharacter } = storeToRefs(characterStore);
const { angle, keyE } = storeToRefs(controlsStore);

const isCharacterOnPlaneRight = ref(false);
const isCharacterOnPlaneTop = ref(false);
const isCharacterOnPlaneLeft = ref(false);
const isCharacterOnPlaneBottom = ref(false);
const isTorusWithCharacter = ref(false);
const oldPositionFlap = ref();
const isActiveFlap = ref(false);

const modelBox = nodes.box;
setModel(modelBox);

const modelFlap = nodes.flap;
setModel(modelFlap);
oldPositionFlap.value = modelFlap.position;
const modelTorus = nodes.torus;
setModel(modelTorus);
const basicWhiteMaterial = ref(
  new MeshBasicMaterial({
    color: 0xffffff,
    opacity: 0.1,
    transparent: true,
  })
);

const angleAnim = ref(0);
watchEffect(() => {
  $gsap.to(angleAnim, {
    duration: 0.3,
    value: angle.value,
  });
});

watch(isActiveFlap, (value) => {
  $gsap.to(modelTorus.position, {
    duration: 0.2,
    y: modelTorus.position.y + 0.5,
    ease: "power4.easeIn",

    onComplete() {
      characterStore.setIsActiveHolding(true);

      $gsap.to(modelTorus.position, {
        duration: 0.2,
        z: setPositionItem().z,
        x: setPositionItem().x,
        ease: "power4.easeIn",
        onComplete() {
          isTorusWithCharacter.value = true;
        },
      });
    },
  });
});

watch(isCharacterOnPlaneLeft, (value) => {
  flapPositionToDefaultX(value, 0.35);
});
watch(isCharacterOnPlaneRight, (value) => {
  flapPositionToDefaultX(value, -0.35);
});
watch(isCharacterOnPlaneTop, (value) => {
  flapPositionToDefaultZ(value, 0.35);
});
watch(isCharacterOnPlaneBottom, (value) => {
  flapPositionToDefaultZ(value, -0.35);
});

watch(keyE, (value) => {
  if (value && isCharacterOnPlaneLeft.value && !isActiveFlap.value) {
    isActiveFlap.value = true;
    $gsap.to(modelFlap.rotation, {
      duration: 0.3,
      z: -1,
      ease: "power4.easeOut",
    });
    $gsap.to(modelFlap.position, {
      duration: 0.3,
      y: oldPositionFlap.value.y + 0.7,
      x: oldPositionFlap.value.x + 0.35,
      ease: "power4.easeOut",
    });
  }

  if (value && isCharacterOnPlaneRight.value && !isActiveFlap.value) {
    isActiveFlap.value = true;
    $gsap.to(modelFlap.rotation, {
      duration: 0.3,
      z: 1,
      ease: "power4.easeOut",
    });
    $gsap.to(modelFlap.position, {
      duration: 0.3,
      y: oldPositionFlap.value.y + 0.7,
      x: oldPositionFlap.value.x - 0.35,
      ease: "power4.easeOut",
    });
  }
  if (value && isCharacterOnPlaneTop.value && !isActiveFlap.value) {
    isActiveFlap.value = true;
    $gsap.to(modelFlap.rotation, {
      duration: 0.3,
      x: 1,
      ease: "power4.easeOut",
    });
    $gsap.to(modelFlap.position, {
      duration: 0.3,
      y: oldPositionFlap.value.y + 0.7,
      z: oldPositionFlap.value.z + 0.35,
      ease: "power4.easeOut",
    });
  }
  if (value && isCharacterOnPlaneBottom.value && !isActiveFlap.value) {
    isActiveFlap.value = true;
    $gsap.to(modelFlap.rotation, {
      duration: 0.3,
      x: -1,
      ease: "power4.easeOut",
    });
    $gsap.to(modelFlap.position, {
      duration: 0.3,
      y: oldPositionFlap.value.y + 0.7,
      z: oldPositionFlap.value.z - 0.35,
      ease: "power4.easeOut",
    });
  }
});
const flapPositionToDefaultX = (value: any, x: number) => {
  if ((!value && isActiveFlap.value) || (!value && isActiveFlap.value)) {
    $gsap.to(modelFlap.rotation, {
      duration: 0.3,
      z: 0,
      ease: "power4.easeOut",
    });
    $gsap.to(modelFlap.position, {
      duration: 0.3,
      y: oldPositionFlap.value.y - 0.7,
      x: oldPositionFlap.value.x - x,
      ease: "power4.easeOut",
      onComplete() {
        isActiveFlap.value = false;
      },
    });
  }
};

const flapPositionToDefaultZ = (value: any, z: number) => {
  if ((!value && isActiveFlap.value) || (!value && isActiveFlap.value)) {
    $gsap.to(modelFlap.rotation, {
      duration: 0.3,
      x: 0,
      ease: "power4.easeOut",
    });
    $gsap.to(modelFlap.position, {
      duration: 0.3,
      y: oldPositionFlap.value.y - 0.7,
      z: oldPositionFlap.value.z - z,
      ease: "power4.easeOut",
      onComplete() {
        isActiveFlap.value = false;
      },
    });
  }
};

const labelText = computed(() => {
  return isActiveGamepad.value ? "A" : "E";
});

const { onLoop } = useRenderLoop();

onLoop(() => {
  if (isMovingCharacter.value) {
    setBorders(modelBox);
    isCharacterOnPlaneRight.value = isCharacterOnModel(modelBox, 2, 0);
    isCharacterOnPlaneLeft.value = isCharacterOnModel(modelBox, -2, 0);
    isCharacterOnPlaneTop.value = isCharacterOnModel(modelBox, 0, -2);
    isCharacterOnPlaneBottom.value = isCharacterOnModel(modelBox, 0, 2);
    setLabel();
  }

  if (isTorusWithCharacter.value) {
    modelTorus.position.x =
      positionCharacter.value.x + 1.3 * Math.sin(angleAnim.value);
    modelTorus.position.z =
      positionCharacter.value.z + 1.3 * Math.cos(angleAnim.value);
  }
});

const isActiveLabel = ref(false);
const isHideLabel = ref(true);
const setLabel = () => {
  // labelRenderer.render(scene.value, camera.value);

  if (checkDistance(modelBox) > 5) {
    isHideLabel.value = true;
  } else {
    isHideLabel.value = false;

    if (
      (isCharacterOnPlaneRight.value && !isActiveLabel.value) ||
      (isCharacterOnPlaneLeft.value && !isActiveLabel.value) ||
      (isCharacterOnPlaneTop.value && !isActiveLabel.value) ||
      (isCharacterOnPlaneBottom.value && !isActiveLabel.value)
    ) {
      isActiveLabel.value = true;
    }

    if (
      !isCharacterOnPlaneRight.value &&
      isActiveLabel.value &&
      !isCharacterOnPlaneLeft.value &&
      !isCharacterOnPlaneTop.value &&
      !isCharacterOnPlaneBottom.value
    ) {
      isActiveLabel.value = false;
    }
  }
};
</script>

<template>
  <primitive :object="modelFlap" />
  <primitive :object="modelTorus" />

  <primitive :object="modelBox">
    <Html center transform :distance-factor="5" :position="[0, 1, 0]" portal="">
      <div
        class="Label__main-container"
        :class="{
          'Label__main-container--active': isActiveLabel,
          'Label__main-container--gamepad': isActiveGamepad,
          'Label__main-container--hide': isHideLabel,
        }"
      >
        <div
          class="Label__content"
          :class="{ 'Label__content--active': isActiveLabel }"
        >
          {{ labelText }}
        </div>
      </div>
    </Html>
  </primitive>
</template>
