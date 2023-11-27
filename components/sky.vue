<script setup lang="ts">
import { Mesh, Vector2, Vector3, PlaneGeometry, ShaderMaterial } from "three";
import { Sky } from "@tresjs/cientos";

const { scene, renderer, camera } = useTresContext();

const storeControl = useControlsStore();
const characterStore = useCharacterStore();
const { positionCharacter } = storeToRefs(characterStore);

import skyVertexSource from "@/src/shaders/vertex-sky.glsl";
import skyFragmentSource from "@/src/shaders/fragment-sky.glsl";

// const { onLoop, resume } = useRenderLoop();

//Sun
//Height over horizon in range [0, PI/2.0]
const elevation = 0.2;
//Rotation around Y axis in range [0, 2*PI]
const azimuth = 0.9;
const fogFade = 0.009;
const FOV = 90;
const backgroundMaterial = new ShaderMaterial({
  uniforms: {
    sunDirection: {
      value: new Vector3(
        Math.sin(azimuth),
        Math.sin(elevation),
        -Math.cos(azimuth)
      ),
    },
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
var backgroundGeometry = new PlaneGeometry(100, 100, 1, 1);
var background = new Mesh(backgroundGeometry, backgroundMaterial);
// scene.value.add(background);
</script>

<template>
  <Sky :azimuth="azimuth" :elevation="elevation" />
</template>
