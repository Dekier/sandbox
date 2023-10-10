<script setup lang="ts">
import { useGLTF } from "@tresjs/cientos";
import { useModelSettings } from "~/composables/useModel";
const { setModel } = useModelSettings();
const characterStore = useCharacterStore();
import { useControls } from "~/composables/useControls";
const { setBorders } = useControls();
const { nodes } = await useGLTF("/models/table.glb", { draco: true });
const { isCharacterOnModel } = useUtils();

const isCharacterOnAreaRight = ref(false);
const isCharacterOnAreaTop = ref(false);
const isCharacterOnAreaLeft = ref(false);
const isCharacterOnAreaBottom = ref(false);

const modelTable = nodes.table001;
setModel(modelTable);

const { onLoop } = useRenderLoop();
onLoop(() => {
  setBorders(modelTable);
  if (characterStore.isActiveHolding) {
    isCharacterOnAreaRight.value = isCharacterOnModel(modelTable, 2, 0);
    isCharacterOnAreaLeft.value = isCharacterOnModel(modelTable, -2, 0);
    isCharacterOnAreaTop.value = isCharacterOnModel(modelTable, 0, -2);
    isCharacterOnAreaBottom.value = isCharacterOnModel(modelTable, 0, 2);
  }
});
</script>

<template>
  <primitive :object="modelTable" />
</template>
