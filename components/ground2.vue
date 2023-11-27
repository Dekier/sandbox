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
  Object3D,
  InstancedMesh,
  Uint8BufferAttribute,
  InstancedBufferAttribute,
} from "three";

import { useControls, TresLeches } from "@tresjs/leches";

const { scene, renderer, camera } = useTresContext();
const { onLoop, resume } = useRenderLoop();

const { nodes } = await useGLTF("/models/grass-flat-3.glb", {
  draco: true,
});
const modelGrass = nodes.grass006;
import skyVertexSource from "@/src/shaders/vertex-sky.glsl";
import skyFragmentSource from "@/src/shaders/fragment-sky.glsl";

//Sun
//Height over horizon in range [0, PI/2.0]
const elevation = 0.08;
//Rotation around Y axis in range [0, 2*PI]
const azimuth = -1.0;
const fogFade = 0.009;
const FOV = 45;
const backgroundMaterial = new ShaderMaterial({
  uniforms: {
    sunDirection: {
      value: new Vector3(
        Math.sin(azimuth),
        Math.sin(elevation),
        Math.cos(azimuth)
      ),
    },
    cameraPos: { value: camera.value.position },
    resolution: {
      value: new Vector2(window.innerWidth, window.innerHeight),
    },
    fogFade: { value: fogFade },
    fov: { value: FOV },
  },
  vertexShader: skyVertexSource,
  fragmentShader: skyFragmentSource,
});

backgroundMaterial.depthWrite = false;
const backgroundGeometry = new PlaneGeometry(45000, 45000, 1, 1);
const background = new Mesh(backgroundGeometry, backgroundMaterial);
scene.value.add(background);

const characterStore = useCharacterStore();
const { positionCharacter } = storeToRefs(characterStore);

import vertexShader from "@/src/shaders/vertex3.glsl";
import fragmentShader from "@/src/shaders/fragment3.glsl";
const loader = new TextureLoader();
const alphaMap = loader.load("/materials/grass/blade_alpha2.webp");
const noiseTexture = loader.load("/materials/grass/perlinFbm.png");
noiseTexture.wrapS = RepeatWrapping;
noiseTexture.wrapT = RepeatWrapping;

const uniforms = {
  time: {
    value: 0,
  },
  uCharacterPosition: { value: new Vector3(0, 0, 0) },
  alphaMap: { value: alphaMap },
  noiseTexture: { value: noiseTexture },
};

const leavesMaterial = new ShaderMaterial({
  uniforms,
  vertexShader,
  fragmentShader,
  side: DoubleSide,
  transparent: true,
  alphaTest: 0.5,
});

const instanceNumber = 130000;
const dummy = new Object3D();
useControls({
  awiwi: true,
  color: "#008080",
});
const geometry = new PlaneGeometry(0.1, 1, 1, 4);
geometry.translate(0, 0.5, 0); // move grass blade geometry lowest point at 0.

const instancedMesh = new InstancedMesh(
  geometry,
  leavesMaterial,
  instanceNumber
);
instancedMesh.castShadow = true;
instancedMesh.receiveShadow = true;
const { scene: modelScene } = await useGLTF("/models/new-grass2.glb", {
  draco: true,
});
let heh = [];
modelScene.traverse((lol) => {
  heh.push({
    pos: { x: lol.position.x, y: 0, z: lol.position.z },
    scale: lol.scale,
  });
});

const offsets = [];
for (let i = 0; i < instanceNumber; i++) {
  if (heh[i]) {
    dummy.position.set(heh[i].pos.x, -0.5, heh[i].pos.z);
    dummy.scale.y = heh[i].scale.y * 0.3;
  } else {
    // dummy.position.set(
    //   (Math.random() - 0.5) * 100,
    //   0,
    //   (Math.random() - 0.5) * 100
    // );
  }
  offsets.push(dummy.position);

  // dummy.scale.setScalar(0.4 + Math.random() * 0.4);
  // dummy.scale.y = 0.4 + Math.random() * 0.5;
  dummy.scale.x = 5.5 + Math.random() * 0.4;
  dummy.scale.z = 5.5 + Math.random() * 0.4;
  dummy.rotation.y = Math.random() * 184;

  dummy.updateMatrix();
  instancedMesh.setMatrixAt(i, dummy.matrix);
}

const offsetAttribute = new InstancedBufferAttribute(
  new Float32Array(offsets),
  3
);
geometry.setAttribute("offset", offsetAttribute);
scene.value.add(instancedMesh);

const floor = new Mesh(
  new PlaneGeometry(130, 130).rotateX(-Math.PI / 2),
  new MeshStandardMaterial({
    // color: 0xffffff,
    color: 0x6b5f49,
    // map: noiseTexture,
  })
);
floor.position.z = 10;
floor.receiveShadow = true;
scene.value.add(floor);

onLoop(({ _delta, elapsed }) => {
  // Hand a time variable to vertex shader for wind displacement.
  leavesMaterial.uniforms.time.value = elapsed;
  leavesMaterial.uniformsNeedUpdate = true;
  if (positionCharacter.value) {
    leavesMaterial.uniforms.uCharacterPosition.value = positionCharacter.value;
  }
  // material.uniforms.uTime.value = elapsed;
  // materialFloor.uniforms.uTime.value = elapsed;
});
</script>

<template>
  <TresLeches />
</template>
