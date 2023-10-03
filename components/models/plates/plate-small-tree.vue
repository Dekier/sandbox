<script setup lang="ts">
import {
  MeshBasicMaterial,
  VideoTexture,
  LinearFilter,
  SRGBColorSpace,
} from "three";
import { useLoader } from "@tresjs/core";
const { scene: modelScene, nodes } = await useGLTF(
  "/models/plate-small-tree.glb",
  {
    draco: true,
  }
);
const model = nodes.plate;
const videoModel = nodes.video;
for (let index = 0; index < model.children.length; index++) {
  model.children[index].receiveShadow = true;
  model.children[index].castShadow = true;
}

for (let index = 0; index < videoModel.children.length; index++) {
  model.children[index].receiveShadow = true;
  model.children[index].castShadow = true;
}

model.children[model.children.length - 1].material.dispose();

model.children[model.children.length - 1].material = new MeshBasicMaterial({
  color: 0x000000,
});

const video = document.createElement("video");
video.src = "/videos/plate-small-tree.mp4";
video.crossOrigin = "anonymous"; // Enable cross-origin for video
video.loop = true;
video.muted = true;
video.controls = false;

// Create a texture from the video
const texture = new VideoTexture(video);
texture.minFilter = LinearFilter;
texture.magFilter = LinearFilter;
texture.flipY = false;
texture.colorSpace = SRGBColorSpace;
videoModel.material.map = texture;
video.addEventListener("canplay", () => {
  video.play();
});
</script>

<template>
  <primitive :object="model" />
  <primitive :object="videoModel" />
</template>
