<script setup lang="ts">
import {
  TextureLoader,
  ShaderMaterial,
  Vector3,
  Color,
  UniformsLib,
  DoubleSide,
  MeshLambertMaterial,
  InstancedMesh,
  Object3D,
  Vector2,
  Matrix4,
  DynamicDrawUsage,
  InstancedBufferGeometry,
  PlaneGeometry,
  InstancedBufferAttribute,
} from "three";
import { Precipitation } from "@tresjs/cientos";
import vertexShader from "@/src/shaders/algae/vertex.glsl";
import fragmentShader from "@/src/shaders/algae/fragment.glsl";
const { newSetModel } = useModelSettings();
const storeGeneral = useGeneralStore();
const { scene } = useTresContext();
const characterStore = useCharacterStore();
const { characterPosition } = storeToRefs(characterStore);

let instances = 100;
let geometry = new PlaneGeometry(1, 1, 1, 1);
let uniforms = {
  //   centerPosition: { value: new Vector3(0, 1, 0) },
  //   maxDistance: { value: 10.0 },
  //   offsetPosition: { value: 3.0 },
};
let material = new ShaderMaterial({
  uniforms: uniforms,
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  side: DoubleSide,
});

const dupa = () => {
  var centerPosition = new Vector3(
    characterPosition.value.x,
    0,
    characterPosition.value.z
  );
  var offsets = [];
  var rotationsY = [];
  for (var i = 0; i < instances; i++) {
    var x = Math.random() * 20 - 10; // Losowa pozycja x z zakresu [-5, 5]
    var y = 0; // Losowa pozycja y z zakresu [-5, 5]
    var z = Math.random() * 20 - 10; // Losowa pozycja z z zakresu [-5, 5]
    var rotationY = Math.random() * Math.PI * 2; // Losowa rotacja wokół osi Y
    var randomOffset = new Vector3(
      x, // Losowa pozycja x w zakresie [-20, 20]
      y, // Losowa pozycja y w zakresie [-20, 20]
      z // Losowa pozycja z w zakresie [-20, 20]
    );
    //   offsets.push(x, y, z);
    var position = centerPosition.clone().add(randomOffset);
    offsets.push(position.x, position.y, position.z);
    rotationsY.push(rotationY);
  }
  geometry.setAttribute(
    "offset",
    new InstancedBufferAttribute(new Float32Array(offsets), 3)
  );
  geometry.setAttribute(
    "rotationY",
    new InstancedBufferAttribute(new Float32Array(rotationsY), 1)
  );
};

const instanceMeshRef = shallowRef(null);
watch(instanceMeshRef, (value) => {
  if (!value) return;
  dupa();
  //   setMeshRock();
});

const { onLoop } = useRenderLoop();
onLoop(({ _delta, elapsed }) => {
  //   dupa();
});
</script>

<template>
  <TresInstancedMesh
    :castShadow="true"
    :receiveShadow="true"
    ref="instanceMeshRef"
    :args="[geometry, material, instances]"
  />
</template>
