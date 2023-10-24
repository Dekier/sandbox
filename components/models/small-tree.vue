<script setup lang="ts">
import { Object3D } from "three";
import { useModelSettings } from "~/composables/useModel";
const { setModel } = useModelSettings();
const controlsStore = useControlsStore();
const { isMovingCharacter } = storeToRefs(controlsStore);

const { $gsap } = useNuxtApp();
const { nodes } = await useGLTF("/models/small-tree.glb", {
  draco: true,
});
const { bendModel, calculateDistance } = useUtils();
const models: Object3D[] = [];

const instancesCount = ref(12);

const { isMobile } = useDevice();

if (isMobile) {
  instancesCount.value = 6;
}

if (nodes.smallTree) {
  const createModelClone = () => {
    const clone = nodes.smallTree.clone();
    setModel(clone);

    clone.position.x = Math.random() * 10 + 14 - Math.random();
    clone.position.z = Math.random() * 10 + -11 - Math.random();
    const randomScale = Math.random() * 1.3 + 1;
    clone.scale.set(randomScale, randomScale, randomScale);

    return clone;
  };
  for (let index = 0; index < instancesCount.value; index++) {
    models.push(createModelClone());
  }
  const prevPositions: Ref<Record<string, { x: number; z: number }>> = ref({});
  const { onLoop } = useRenderLoop();
  onLoop(() => {
    if (isMovingCharacter.value) {
      models.forEach((model) => {
        const currentDistance = calculateDistance(model.position);
        if (currentDistance < 3) {
          const { x, z } = bendModel(model.position);
          const key = model.uuid;
          const prevPosition = prevPositions.value[key];
          if (!prevPosition || prevPosition.x !== x || prevPosition.z !== z) {
            if (model.rotation.x !== x && model.rotation.z !== z) {
              $gsap.to(model.rotation, {
                duration: 0.6,
                x,
                z,
                ease: "power4.easeOut",
              });

              prevPositions.value[key] = { x, z };
            }
          }
        }
      });
    }
  });
}
</script>

<template>
  <primitive v-for="(model, index) in models" :object="model" :key="index" />
</template>
