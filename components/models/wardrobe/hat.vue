<script setup lang="ts">
import { MeshBasicMaterial } from "three";
import { useGLTF } from "@tresjs/cientos";
import { useUtils } from "~/composables/useUtils";
import { useModelSettings } from "~/composables/useModel";
import { useControls } from "~/composables/useControls";
const { changeModelRotation } = useControls();
const { setModel } = useModelSettings();
const { $gsap } = useNuxtApp();
const { jump } = useUtils();
const characterStore = useCharacterStore();
const controlsStore = useControlsStore();
const { positionCharacter } = storeToRefs(characterStore);
const { keys, isJumping, isMovingCharacter } = storeToRefs(controlsStore);
const { nodes } = await useGLTF("/models/hat.glb", { draco: true });
const model = nodes.hat;
setModel(model);
const { onLoop } = useRenderLoop();

onLoop(() => {
  if (model.position) {
    if (isMovingCharacter.value) {
      changeModelRotation(model);
    }

    model.position.x = positionCharacter.value.x;
    model.position.z = positionCharacter.value.z;
    if (keys.value.space && !isJumping.value) {
      jump(model);
    }
  }
});
</script>

<template>
  <primitive :object="model" />
</template>
