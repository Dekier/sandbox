<script setup lang="ts">
import { Fog } from "three";
const { scene, renderer, camera } = useTresContext();
const fog = new Fog("#BEE1F7", 50, 150);
scene.value.fog = fog;
renderer.value.setClearColor("#BEE1F7");
</script>

<template></template>
