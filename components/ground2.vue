<script setup lang="ts">
import {
  MeshBasicMaterial,
  Mesh,
  MeshStandardMaterial,
  TextureLoader,
  RepeatWrapping,
  Vector2,
  Vector3,
  NearestFilter,
  WebGLRenderTarget,
  PlaneGeometry,
  DoubleSide,
  BufferAttribute,
  ShaderMaterial,
  BufferGeometry,
} from "three";

const { scene, renderer, camera } = useTresContext();
const characterStore = useCharacterStore();
const { positionCharacter } = storeToRefs(characterStore);

import vertexShader from "@/src/shaders/vertex.glsl";
import fragmentShader from "@/src/shaders/fragment.glsl";

// const grassTexture = useLoader(TextureLoader, "/materials/grass.jpg");
// const mesh = new Mesh(
//   new PlaneGeometry(100, 100, 1000, 1000),
//   new MeshStandardMaterial({
//     color: 0xdbc0a4,
//     metalness: 0,
//     roughness: 1,
//   })
// );
// mesh.rotation.x = -Math.PI / 2;
// // mesh.position.y = -1.67;
// mesh.position.y = -2.05;
// mesh.position.y = -1.9;
// mesh.receiveShadow = true;
// mesh.castShadow = false;
// scene.value.add(mesh);

const BLADE_WIDTH = 0.1;
const BLADE_HEIGHT = 0.8;
const BLADE_HEIGHT_VARIATION = 0.6;
const BLADE_VERTEX_COUNT = 5;
const BLADE_TIP_OFFSET = 0.3;

const interpolate = (val, oldMin, oldMax, newMin, newMax) => {
  return ((val - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin;
};

const computeBlade = (center, index = 0) => {
  const height = BLADE_HEIGHT + Math.random() * BLADE_HEIGHT_VARIATION;
  const vIndex = index * BLADE_VERTEX_COUNT;

  const yaw = Math.random() * Math.PI * 2;
  const yawVec = [Math.sin(yaw), 0, -Math.cos(yaw)];
  const bend = Math.random() * Math.PI * 2;
  const bendVec = [Math.sin(bend), 0, -Math.cos(bend)];

  const bl = yawVec.map((n, i) => n * (BLADE_WIDTH / 2) * 1 + center[i]);
  const br = yawVec.map((n, i) => n * (BLADE_WIDTH / 2) * -1 + center[i]);
  const tl = yawVec.map((n, i) => n * (BLADE_WIDTH / 4) * 1 + center[i]);
  const tr = yawVec.map((n, i) => n * (BLADE_WIDTH / 4) * -1 + center[i]);
  const tc = bendVec.map((n, i) => n * BLADE_TIP_OFFSET + center[i]);

  tl[1] += height / 2;
  tr[1] += height / 2;
  tc[1] += height;

  return {
    positions: [...bl, ...br, ...tr, ...tl, ...tc],
    indices: [
      vIndex,
      vIndex + 1,
      vIndex + 2,
      vIndex + 2,
      vIndex + 4,
      vIndex + 3,
      vIndex + 3,
      vIndex,
      vIndex + 2,
    ],
  };
};
const { onLoop, resume } = useRenderLoop();
const size = 100;
const count = 500000;
const geometry = new BufferGeometry();

const positions = [];
const uvs = [];
const indices = [];

for (let i = 0; i < count; i++) {
  const halfSize = size / 2;

  const x = Math.random() * size - halfSize;
  const y = Math.random() * size - halfSize;

  uvs.push(
    ...Array.from({ length: BLADE_VERTEX_COUNT }).flatMap(() => [
      interpolate((x + halfSize) / size, 0, 1, 0, 1),
      interpolate((y + halfSize) / size, 0, 1, 0, 1),
    ])
  );

  const blade = computeBlade([x, 0, y], i);
  positions.push(...blade.positions);
  indices.push(...blade.indices);
}
geometry.setAttribute(
  "position",
  new BufferAttribute(new Float32Array(positions), 3)
);
geometry.setAttribute("uv", new BufferAttribute(new Float32Array(uvs), 2));
geometry.setIndex(indices);
geometry.computeVertexNormals();

const cloudTexture = new TextureLoader().load("/materials/cloud2.jpg");
cloudTexture.wrapS = cloudTexture.wrapT = RepeatWrapping;

const material = new ShaderMaterial({
  uniforms: {
    uCloud: { value: cloudTexture },
    uTime: { value: 0 },
    uCharacterPosition: { value: new Vector3(0, 0, 0) },
  },
  side: DoubleSide,
  vertexShader,
  fragmentShader,
});
const grass = new Mesh(geometry, material);
grass.position.y = -1.67;

const materialFloor = new ShaderMaterial({
  uniforms: {
    uCloud: { value: cloudTexture },
    uTime: { value: 0 },
    uCharacterPosition: { value: new Vector3(0, 0, 0) },
  },
  side: DoubleSide,
  vertexShader,
  fragmentShader,
});
const floor = new Mesh(
  new PlaneGeometry(100, 100).rotateX(Math.PI / 2),
  materialFloor
);
floor.position.y = -Number.EPSILON;
grass.add(floor);
scene.value.add(grass);
onLoop(({ _delta, elapsed }) => {
  if (positionCharacter.value) {
    material.uniforms.uCharacterPosition.value = positionCharacter.value;
  }
  material.uniforms.uTime.value = elapsed;
  materialFloor.uniforms.uTime.value = elapsed;
});
//   grass.update = function (time) {
//     this.material.uniforms.uTime.value = time;
//   };
</script>

<template></template>

<!-- 
const xMin = -30;
const xMax = -71;
const yMin = -30;
const yMax = -71;

for (let i = 0; i < count; i++) {
  const x = xMin + Math.random() * (xMax - xMin);
  const y = yMin + Math.random() * (yMax - yMin);

  // Odwróć pozycje względem wysokości (zmiana y)
  const newY = -y;

  // Przesunięcie względem floor
  const xOffset = (xMax - xMin) / 2; // Przesunięcie x na środek wybranego obszaru
  const yOffset = (yMax - yMin) / 2; // Przesunięcie y na środek wybranego obszaru

  const finalX = x - xOffset;
  const finalY = newY + yOffset;

  uvs.push(
    ...Array.from({ length: BLADE_VERTEX_COUNT }).flatMap(() => [
      interpolate(finalX, xMin, xMax, 0, 1),
      interpolate(finalY, yMin, yMax, 0, 1),
    ])
  );

  const blade = computeBlade([finalX, 0, finalY], i);
  positions.push(...blade.positions);
  indices.push(...blade.indices);
} -->
