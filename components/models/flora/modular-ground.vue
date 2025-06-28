<script setup lang="ts">
import {
  MeshLambertMaterial,
  Color,
  UniformsLib,
  ShaderMaterial,
  Vector3,
} from "three";
const { nodes } = await useGLTF("/models/ground.glb", { draco: true });
const storeGeneral = useGeneralStore();
const { color, colorSand } = storeToRefs(storeGeneral);
const storeModularGround = useModularGroundStore();
const {
  activeModularList,
  groundZeroList,
  groundOneSideList,
  groundCornerList,
  groundTwoSideList,
  groundThreeSideList,
} = storeToRefs(storeModularGround);
import vertexShader from "@/src/shaders/ground/vertex.glsl";
import fragmentShader from "@/src/shaders/ground/fragment.glsl";

storeModularGround.setGroundPiecesListsClear();
storeModularGround.setGroundPiecesLists();
watch(activeModularList, () => {
  storeModularGround.setGroundPiecesListsClear();
  storeModularGround.setGroundPiecesLists();
});
const darkerFactor = 2.1;

const uniforms = {
  time: {
    value: 0,
  },
  hexColor: {
    value: new Vector3(
      new Color(color.value).r / darkerFactor,
      new Color(color.value).g / darkerFactor,
      new Color(color.value).b / darkerFactor
    ),
  },
  ...UniformsLib.lights,
};

const groundMaterial = new ShaderMaterial({
  uniforms,
  vertexShader,
  fragmentShader,
  lights: true,
});
const sandMaterial = new MeshLambertMaterial({
  color: new Color(colorSand.value),
});
sandMaterial.castShadow = true;
sandMaterial.receiveShadow = true;

watch(color, (value) => {
  groundMaterial.uniforms.hexColor.value = new Vector3(
    new Color(value).r / darkerFactor,
    new Color(value).g / darkerFactor,
    new Color(value).b / darkerFactor
  );
});

watch(colorSand, (value) => {
  sandMaterial.color = new Color(value);
});
</script>

<template>
  <Suspense>
    <ModelsFloraModularGroundZeroSide
      v-if="groundZeroList.length"
      :ground-geometry="nodes.groundZero.geometry"
      :ground-material="groundMaterial"
    />
  </Suspense>

  <Suspense>
    <ModelsFloraModularGroundOneSide
      v-if="groundOneSideList.length"
      :ground-geometry="nodes.Cube068.geometry"
      :sand-geometry="nodes.Cube068_1.geometry"
      :sand-material="sandMaterial"
      :ground-material="groundMaterial"
    />
  </Suspense>

  <Suspense>
    <ModelsFloraModularGroundCorner
      v-if="groundCornerList.length"
      :ground-geometry="nodes.Cube069.geometry"
      :sand-geometry="nodes.Cube069_1.geometry"
      :sand-material="sandMaterial"
      :ground-material="groundMaterial"
    />
  </Suspense>
  <Suspense>
    <ModelsFloraModularGroundTwoSide
      v-if="groundTwoSideList.length"
      :ground-geometry="nodes.Cube074.geometry"
      :sand-geometry="nodes.Cube074_1.geometry"
      :sand-material="sandMaterial"
      :ground-material="groundMaterial"
    />
  </Suspense>
  <Suspense>
    <ModelsFloraModularGroundThreeSide
      v-if="groundThreeSideList.length"
      :ground-geometry="nodes.Cube070.geometry"
      :sand-geometry="nodes.Cube070_1.geometry"
      :sand-material="sandMaterial"
      :ground-material="groundMaterial"
    />
  </Suspense>
</template>
