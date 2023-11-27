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
  Matrix4,
} from "three";

const { scene, renderer, camera } = useTresContext();

const characterStore = useCharacterStore();
const { positionCharacter } = storeToRefs(characterStore);

import vertexShader from "@/src/shaders/vertex.glsl";
import fragmentShader from "@/src/shaders/fragment.glsl";

const BLADE_WIDTH = 0.2;
const BLADE_HEIGHT = 0.3;
const BLADE_HEIGHT_VARIATION = 0.3;
const BLADE_VERTEX_COUNT = 5; // Zwiększ liczbę wierzchołków.
const BLADE_TIP_OFFSET = 0;

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

  const bottomLeft = yawVec.map(
    (n, i) => n * BLADE_WIDTH * 0.6 * 1 + center[i]
  );
  const bottomRight = yawVec.map(
    (n, i) => n * BLADE_WIDTH * 0.6 * -1 + center[i]
  );
  const topLeft = yawVec.map(
    (n, i) => n * BLADE_WIDTH * 0.5 * 1 + center[i] - 0.1
  );
  const topRight = yawVec.map(
    (n, i) => n * BLADE_WIDTH * 0.5 * -1 + center[i] - 0.1
  );
  const topCenter = bendVec.map(
    (n, i) => n * BLADE_TIP_OFFSET + center[i] - 0.3
  );

  topLeft[1] = height * 0.6;
  topRight[1] = height * 0.6;
  topCenter[1] = height;

  return {
    positions: [
      ...bottomLeft,
      ...bottomRight,
      ...topRight,
      ...topLeft,
      ...topCenter,
    ],
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
const count = 5000;
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
    uFloor: { value: false },
  },
  side: DoubleSide,
  vertexShader,
  fragmentShader,
  // wireframe: true,
});
const grass = new Mesh(geometry, material);

grass.castShadow = true;
grass.receiveShadow = true;
grass.position.y = -1.67;

const materialFloor = new ShaderMaterial({
  uniforms: {
    uCloud: { value: cloudTexture },
    uTime: { value: 0 },
    uCharacterPosition: { value: new Vector3(0, 0, 0) },
    uFloor: { value: true },
  },
  side: DoubleSide,
  vertexShader,
  fragmentShader,
});
const floor = new Mesh(
  new PlaneGeometry(100, 100).rotateX(-Math.PI / 2),
  new MeshStandardMaterial({
    color: 0x6b5f49,
  })
);
floor.receiveShadow = true;
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
</script>

<template></template>
