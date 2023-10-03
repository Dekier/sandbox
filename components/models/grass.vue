<script setup lang="ts">
import { MeshBasicMaterial, Vector3, Object3D } from "three";
import { storeToRefs } from "pinia";
const { $gsap } = useNuxtApp();
const { nodes } = await useGLTF("/models/grass.glb", {
  draco: true,
});
import { useCharacterStore } from "~/stores/character";
const characterStore = useCharacterStore();
const { positionCharacter } = storeToRefs(characterStore);
const models: Object3D[] = [];
if (nodes.grass) {
  const calculateDistance = (point1: Vector3, point2: Vector3) => {
    const dx = point2.x - point1.x;
    const dz = point2.z - point1.z;
    return Math.sqrt(dx * dx + dz * dz);
  };
  const createModelClone = () => {
    const clone = nodes.grass.clone();
    clone.children.forEach((child) => {
      child.receiveShadow = true;
      child.castShadow = true;
    });

    clone.children[clone.children.length - 1].material.dispose();
    clone.children[clone.children.length - 1].material = new MeshBasicMaterial({
      color: 0x000000,
    });

    clone.position.x = Math.random() * 10 + 30 - Math.random();
    clone.position.z = Math.random() * 10 + -11 - Math.random();
    const randomScale = Math.random() * 0.7 + 1;
    clone.scale.set(randomScale, randomScale, randomScale);
    return clone;
  };
  for (let index = 0; index < 400; index++) {
    models.push(createModelClone());
  }

  models.forEach((model) => {});

  const maxRotation = 1;
  const maxDistance = 1.5;
  const bendBush = (model: any) => {
    const direction = new Vector3();
    direction.subVectors(positionCharacter.value, model.position).normalize();
    const currentDistance = calculateDistance(
      positionCharacter.value,
      model.position
    );

    const factor = 1 - Math.min(currentDistance / maxDistance, 1);
    const limitedAngleX = maxRotation * factor;
    const limitedAngleY = maxRotation * factor;
    const sign = direction.z > 0 ? -1 : 1;
    const signY = direction.x > 0 ? 1 : -1;

    $gsap.to(model.rotation, {
      duration: 0.3,
      x: limitedAngleX * sign,
      z: limitedAngleY * signY,
      ease: "power4.easeOut",
    });
  };
  const { onLoop } = useRenderLoop();
  onLoop(() => {
    models.forEach((model) => {
      const currentDistance = calculateDistance(
        positionCharacter.value,
        model.position
      );
      if (currentDistance < 3) {
        bendBush(model);
      }
    });
  });
}
</script>

<template>
  <primitive v-for="(model, index) in models" :object="model" :key="index" />
</template>
