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
} from "three";

const { scene, renderer, camera } = useTresContext();
const characterStore = useCharacterStore();
const { positionCharacter } = storeToRefs(characterStore);

const pbrTexture = await useTexture({
  map: "/materials/sand/color_512x512.webp",
  displacementMap: "/materials/sand/height_512x512.webp",
  roughnessMap: "/materials/sand/rough_512x512.webp",
  normalMap: "/materials/sand/normal_512x512.webp",
  aoMap: "/materials/sand/ao_512x512.webp",
  // metalnessMap: "/materials/sand/metallic.webp",
  // matcap: '/materials/sand/myMatcapTexture.webp',
  // alphaMap: '/materials/sand/myAlphaMapTexture.webp'
});

pbrTexture.map.wrapS = RepeatWrapping;
pbrTexture.map.wrapT = RepeatWrapping;
pbrTexture.map.repeat.x = 7;
pbrTexture.map.repeat.y = 7;
pbrTexture.map.minFilter = NearestFilter;

pbrTexture.displacementMap.wrapS = RepeatWrapping;
pbrTexture.displacementMap.wrapT = RepeatWrapping;
pbrTexture.displacementMap.repeat.x = 7;
pbrTexture.displacementMap.repeat.y = 7;
pbrTexture.displacementMap.minFilter = NearestFilter;

pbrTexture.roughnessMap.wrapS = RepeatWrapping;
pbrTexture.roughnessMap.wrapT = RepeatWrapping;
pbrTexture.roughnessMap.repeat.x = 7;
pbrTexture.roughnessMap.repeat.y = 7;
pbrTexture.roughnessMap.minFilter = NearestFilter;

pbrTexture.normalMap.wrapS = RepeatWrapping;
pbrTexture.normalMap.wrapT = RepeatWrapping;
pbrTexture.normalMap.repeat.x = 7;
pbrTexture.normalMap.repeat.y = 7;
pbrTexture.normalMap.minFilter = NearestFilter;

pbrTexture.aoMap.wrapS = RepeatWrapping;
pbrTexture.aoMap.wrapT = RepeatWrapping;
pbrTexture.aoMap.repeat.x = 7;
pbrTexture.aoMap.repeat.y = 7;
pbrTexture.aoMap.minFilter = NearestFilter;

const mesh = new Mesh(
  new PlaneGeometry(100, 100, 1000, 1000),
  new MeshStandardMaterial({
    color: 0xdbc0a4,
    metalness: 0,
    roughness: 1,
    map: pbrTexture.map,
    displacementMap: pbrTexture.displacementMap,
    roughnessMap: pbrTexture.roughnessMap,
    normalMap: pbrTexture.normalMap,
    aoMap: pbrTexture.aoMap,
    aoMapIntensity: 1.5,
    displacementScale: 0.7,
    normalScale: new Vector2(10, -10),
  })
);
mesh.rotation.x = -Math.PI / 2;
// mesh.position.y = -1.67;
// mesh.position.y = -2.05;
mesh.position.y = -1.9;
mesh.receiveShadow = true;
mesh.castShadow = false;
scene.value.add(mesh);
</script>

<template></template>
