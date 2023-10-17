<script setup lang="ts">
import { MeshBasicMaterial } from "three";
import { useModelSettings } from "~/composables/useModel";
import { useGLTF } from "@tresjs/cientos";
import { useUtils } from "~/composables/useUtils";
import { useControls } from "~/composables/useControls";
const { changeModelRotation } = useControls();
const { $gsap } = useNuxtApp();
const { setModel } = useModelSettings();
const { jump } = useUtils();
const characterStore = useCharacterStore();
const controlsStore = useControlsStore();
const { positionCharacter, isActiveHolding } = storeToRefs(characterStore);
const { isJumping, keys, isMovingCharacter } = storeToRefs(controlsStore);
const { nodes } = await useGLTF("/models/arms.glb", { draco: true });
const model = nodes.arms;
setModel(model);
const { onLoop } = useRenderLoop();

watchEffect(() => {
  if (isActiveHolding.value) {
    // console.log(isActiveHolding.value);
    // $gsap.to(model.rotation, {
    //   duration: 0.3,
    //   z: 2,
    //   ease: "power4.easeIn",
    // });
  }
});

onLoop(() => {
  if (model.position) {
    if (isMovingCharacter.value) {
      changeModelRotation(model);
    }
    model.position.x = positionCharacter.value.x;
    model.position.z = positionCharacter.value.z;
    if (keys.value.space && !isJumping.value) {
      controlsStore.setIsJumping(true);
      jump(model);
    }
  }
});
</script>

<template>
  <primitive :object="model" />
</template>
