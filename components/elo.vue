<script setup lang="ts">
import {
  MeshBasicMaterial,
  Mesh,
  PlaneGeometry,
  MeshStandardMaterial,
  TextureLoader,
  RepeatWrapping,
  Vector2,
  NearestFilter,
  WebGLRenderTarget,
  CircleGeometry,
  DoubleSide,
  BufferAttribute,
  RawShaderMaterial,
  BufferGeometry,
} from "three";

const { scene, renderer, camera } = useTresContext();
const characterStore = useCharacterStore();
const { positionCharacter } = storeToRefs(characterStore);

import vertexShader from "@/src/shaders/vertex2.glsl";
import fragmentShader from "@/src/shaders/fragment2.glsl";

// const grassTexture = useLoader(TextureLoader, "/materials/grass.jpg");
const material = new RawShaderMaterial({
  uniforms: {
    uFrequency: { value: new Vector2(10, 10) },
    // uCloud: { value: cloudTexture },
    uTime: { value: 0 },
  },
  side: DoubleSide,
  vertexShader,
  fragmentShader,
});
const geometry = new PlaneGeometry(20, 20, 100, 100);

const count = geometry.attributes.position.count;
const randoms = new Float32Array(count);

for (let i = 0; i < count; i++) {
  randoms[i] = Math.random();
}

geometry.setAttribute("aRandom", new BufferAttribute(randoms, 1));
console.log(geometry);

const mesh = new Mesh(geometry, material);
// mesh.rotation.x = -Math.PI / 2;
// mesh.position.y = -1.67;
// mesh.position.y = -2.05;
// mesh.position.y = -1.9;
// mesh.receiveShadow = true;
// mesh.castShadow = false;
const { onLoop } = useRenderLoop();
onLoop(({ _delta, elapsed }) => {
  material.uniforms.uTime.value = elapsed;
});
//   grass.update = function (time) {
//     this.material.uniforms.uTime.value = time;
//   };
scene.value.add(mesh);
</script>

<template></template>
