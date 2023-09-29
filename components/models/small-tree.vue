<script setup lang="ts">
import { MeshBasicMaterial, Vector3 } from "three";
import { storeToRefs } from "pinia";
const { $gsap } = useNuxtApp();
const {
  scene: modelScene,
  nodes,
  animations,
} = await useGLTF("/models/small-tree.glb", {
  draco: true,
});
import { useCharacterStore } from "~/stores/character";
const characterStore = useCharacterStore();
const { positionCharacter } = storeToRefs(characterStore);

// const model = nodes.smallTree;
// for (let index = 0; index < model.children.length; index++) {
//   model.children[index].receiveShadow = true;
//   model.children[index].castShadow = true;
// }

// model.children[model.children.length - 1].material.dispose();

// model.children[model.children.length - 1].material = new MeshBasicMaterial({
//   color: 0x000000,
// });
// const { onLoop } = useRenderLoop();
const calculateDistance = (point1, point2) => {
  const dx = point2.x - point1.x;
  const dz = point2.z - point1.z;
  return Math.sqrt(dx * dx + dz * dz);
};
const createModelClone = () => {
  const clone = nodes.smallTree.clone();
  clone.children.forEach((child) => {
    child.receiveShadow = true;
    child.castShadow = true;
  });

  clone.children[clone.children.length - 1].material.dispose();
  clone.children[clone.children.length - 1].material = new MeshBasicMaterial({
    color: 0x000000,
  });

  return clone;
};
const models = [];
for (let index = 0; index < 20; index++) {
  models.push(createModelClone());
}

models.forEach((model, index) => {
  // if (index === 0) {
  // model.position.x = positionCharacter.value.x - 2;
  // model.position.z = positionCharacter.value.z - 2;
  // } else {
  model.position.x = Math.random() * 10 + 15 - Math.random() + index * 0.2;
  model.position.z = Math.random() * 10 + -12 - Math.random() + index * 0.2;
  // model.rotation.y = Math.random() * 1 + index;
  const randomScale = Math.random() * 2 + 1;
  model.scale.set(randomScale, randomScale, randomScale);
  // }
});

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
    duration: 0.7,
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
</script>

<template>
  <primitive v-for="(model, index) in models" :object="model" :key="index" />
</template>
