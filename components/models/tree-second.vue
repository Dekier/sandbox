<script setup lang="ts">
import {
  TextureLoader,
  ShaderMaterial,
  Vector3,
  Color,
  UniformsLib,
  DoubleSide,
  MeshLambertMaterial,
} from "three";
import { useGLTF } from "@tresjs/cientos";
const storeGeneral = useGeneralStore();
const { color } = storeToRefs(storeGeneral);

const { nodes } = await useGLTF("/models/tree2.glb", { draco: true });
const modelTree = nodes.tree;

console.log(nodes);
modelTree.castShadow = true;
modelTree.receiveShadow = true;

import vertexShader from "@/src/shaders/leafs/vertex.glsl";
import fragmentShader from "@/src/shaders/leafs/fragment.glsl";

const loader = new TextureLoader();
const alphaMap = loader.load("/materials/leaves/leaves.webp");

const uniforms = {
  time: {
    value: 0,
  },
  alphaMap: { value: alphaMap },
  hexColor: {
    value: new Vector3(
      new Color(color.value).r,
      new Color(color.value).g,
      new Color(color.value).b
    ),
  },
  ...UniformsLib.lights,
};

const leavesMaterial = new ShaderMaterial({
  uniforms,
  vertexShader,
  fragmentShader,
  lights: true,
  side: DoubleSide,
});
const lol = new MeshLambertMaterial({
  color: new Color(color.value),
  alphaMap: alphaMap,
  alphaTest: 0.3,
  side: DoubleSide,
});

const modelLeaves = nodes.leaves;
modelLeaves.material?.dispose();
modelLeaves.material = lol;

modelLeaves.castShadow = true;
modelLeaves.receiveShadow = true;

const modelLeaves2 = nodes.leaves2;
modelLeaves2.material?.dispose();
modelLeaves2.material = lol;

modelLeaves2.castShadow = true;
modelLeaves2.receiveShadow = true;

watch(color, (value) => {
  modelLeaves.material.color = new Color(value);
  modelLeaves2.material.color = new Color(value);
  leavesMaterial.uniforms.hexColor.value = new Vector3(
    new Color(value).r,
    new Color(value).g,
    new Color(value).b
  );
});
// setModel(model);
const { onLoop } = useRenderLoop();
onLoop(({ _delta, elapsed }) => {
  leavesMaterial.uniforms.time.value = elapsed;
  leavesMaterial.uniformsNeedUpdate = true;
});
</script>

<template>
  <primitive :object="modelTree" />
  <primitive :object="modelLeaves" />
  <primitive :object="modelLeaves2" />
</template>
