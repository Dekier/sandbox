<script setup lang="ts">
import {
  MeshBasicMaterial,
  VideoTexture,
  LinearFilter,
  SRGBColorSpace,
  Object3D,
} from "three";
import { useModelSettings } from "~/composables/useModel";
const { setModel } = useModelSettings();
const { nodes } = await useGLTF("/models/plate-small-tree.glb", {
  draco: true,
});

const models: Object3D[] = [];
const modelsVideo: Object3D[] = [];
const model = nodes.plate;
const videoModel = nodes.video;

for (let index = 0; index < videoModel.children.length; index++) {
  model.children[index].receiveShadow = true;
  model.children[index].castShadow = true;
}

const createModelClone = () => {
  const clone = model.clone();
  setModel(clone);

  return clone;
};

for (let index = 0; index < 2; index++) {
  models.push(createModelClone());
}

models.forEach((model, index) => {
  if (index === 1) {
    model.position.x = 40;
  }
});

const video = document.createElement("video");
video.id = "lol";
video.src = "/videos/plate-small-tree.mp4";
video.crossOrigin = "anonymous"; // Enable cross-origin for video
video.loop = true;
video.muted = true;
video.controls = false;

const texture = new VideoTexture(video);
texture.flipY = false;
texture.colorSpace = SRGBColorSpace;

video.addEventListener("canplay", () => {
  video.play();
  texture.needsUpdate = true;
});

const videoGrass = document.createElement("video");
videoGrass.id = "grass"; // Corrected this line
videoGrass.src = "/videos/grass.mp4";
videoGrass.crossOrigin = "anonymous";
videoGrass.loop = true;
videoGrass.muted = true;
videoGrass.controls = false;

const textureGrass = new VideoTexture(videoGrass);
textureGrass.flipY = false;
textureGrass.colorSpace = SRGBColorSpace;
videoGrass.addEventListener("canplay", () => {
  videoGrass.play();
  textureGrass.needsUpdate = true;
});

const createModelVideoClone = () => {
  const clone = videoModel.clone();

  return clone;
};

for (let index = 0; index < 2; index++) {
  modelsVideo.push(createModelVideoClone());
}

modelsVideo[0].material.dispose();
modelsVideo[0].material = new MeshBasicMaterial({
  color: 0xb2b8a9,
  map: texture,
});

modelsVideo[1].material.dispose();
modelsVideo[1].material = new MeshBasicMaterial({
  color: 0xb2b8a9,
  map: textureGrass,
});
modelsVideo[1].position.x = 39.9;
</script>

<template>
  <primitive v-for="(model, index) in models" :object="model" :key="index" />
  <primitive
    v-for="(modelVideo, indexVideo) in modelsVideo"
    :object="modelVideo"
    :key="indexVideo"
  />
</template>
