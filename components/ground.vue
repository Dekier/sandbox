<script setup lang="ts">
import {
  MeshBasicMaterial,
  Mesh,
  PlaneGeometry,
  MeshStandardMaterial,
} from "three";
import { useGLTF } from "@tresjs/cientos";

const { scene } = useTresContext();

const mesh = new Mesh(
  new PlaneGeometry(2000, 2000),
  new MeshStandardMaterial({ color: 0xccb489 })
);
mesh.rotation.x = -Math.PI / 2;
mesh.position.y = -1.5;
mesh.receiveShadow = true;
scene.value.add(mesh);
</script>

<template></template>
