<script setup lang="ts">
import { MeshBasicMaterial, Vector3 } from "three";
const { $gsap } = useNuxtApp();
import { useGLTF } from "@tresjs/cientos";
import { useCharacterStore } from "~/stores/character";
import { useHudStore } from "~/stores/hud";
import { storeToRefs } from "pinia";
const characterStore = useCharacterStore();
const hudStore = useHudStore();
const { positionCharacter, angle, keys, jumpHeight } =
  storeToRefs(characterStore);
const { isActiveCharacterCamera } = storeToRefs(hudStore);
const { nodes } = await useGLTF("/models/arms.glb", { draco: true });
const model = nodes.arms;
model.children[model.children.length - 1].material.dispose();
model.children[model.children.length - 1].material = new MeshBasicMaterial({
  color: 0x000000,
});
nodes.Scene.traverse((child: any) => {
  if (child.isMesh) {
    child.castShadow = true;
    child.receiveShadow = true;
  }
});
const { onLoop } = useRenderLoop();
const isJumping = ref(false);

onLoop(() => {
  if (!isActiveCharacterCamera.value) return;
  if (model.position) {
    if (angle) {
      $gsap.to(model.rotation, { y: angle.value, duration: 0.5 });
    }
    model.position.x = positionCharacter.value.x;
    model.position.z = positionCharacter.value.z;
    if (keys.value.space && !isJumping.value) {
      isJumping.value = true;
      jump();
    }
  }
});

const jump = () => {
  $gsap.to(model.position, {
    y: model.position.y + jumpHeight.value,
    duration: 0.4,
    ease: "power1.out",
    onComplete: () => {
      $gsap.to(model.position, {
        y: 0.4,
        duration: 0.4,
        ease: "power1.in",
        onComplete: () => {
          isJumping.value = false;
        },
      });
    },
  });
};
</script>

<template>
  <primitive :object="model" />
</template>
