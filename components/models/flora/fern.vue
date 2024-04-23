<script setup lang="ts">
import {
  TextureLoader,
  Vector3,
  DoubleSide,
  ShaderMaterial,
  Matrix4,
  Object3D,
  InstancedMesh,
  Color,
  UniformsLib,
  DynamicDrawUsage,
  BoxGeometry,
  InstancedBufferGeometry,
  MeshStandardMaterial,
  Mesh,
  InstancedBufferAttribute,
} from "three";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { Html } from "@tresjs/cientos";
const hudStore = useHudStore();
const floraStore = useFloraStore();
const { bendModel, calculateDistance } = useUtils();
const storeModularGround = useModularGroundStore();
const storeEquipment = useEquipmentStore();
const storeControl = useControlsStore();
const { keyE } = storeToRefs(storeControl);
const props = defineProps({
  fernList: {
    type: Object,
    required: true,
  },
});
const storeGeneral = useGeneralStore();
const { scene, renderer, camera } = useTresContext();
const { onLoop, resume } = useRenderLoop();
const { color, settingsShadow } = storeToRefs(storeGeneral);

const characterStore = useCharacterStore();
const { positionCharacter } = storeToRefs(characterStore);

import vertexShader from "@/src/shaders/fern/vertex.glsl";
import fragmentShader from "@/src/shaders/fern/fragment.glsl";
const loader = new TextureLoader();
const alphaMap = loader.load("/materials/flowers/fern.png");
const darkerFactor = 3.0;
const uniforms = {
  time: {
    value: 0,
  },
  uCharacterPosition: { value: new Vector3(0, 0, 0) },
  alphaMap: { value: alphaMap },
  hexColor: {
    value: new Vector3(
      new Color(color.value).r / darkerFactor,
      new Color(color.value).g / darkerFactor,
      new Color(color.value).b / darkerFactor
    ),
  },
  ...UniformsLib.lights,
};

const fernMaterial = new ShaderMaterial({
  uniforms,
  vertexShader,
  fragmentShader,
  side: DoubleSide,
  lights: true,
});

const { nodes } = await useGLTF("/models/fern.glb", { draco: true });

watch(color, (value) => {
  fernMaterial.uniforms.hexColor.value = new Vector3(
    new Color(value).r / darkerFactor,
    new Color(value).g / darkerFactor,
    new Color(value).b / darkerFactor
  );
});

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = "absolute";
document.body.appendChild(labelRenderer.domElement);

const div = document.getElementById("collect-e");

const earthLabel = new CSS2DObject(div);
scene.value.add(earthLabel);

window.addEventListener("resize", () => {
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
});

const dummy = new Object3D();
const matrix = new Matrix4();
const instanceMeshRef = shallowRef(null);
let oldPositions = null as null | { x: number; y: number; z: number };
let oldIndex = -1 as number;
const currentDistance = ref(0);
onLoop(({ _delta, elapsed }) => {
  fernMaterial.uniforms.time.value = elapsed;
  fernMaterial.uniformsNeedUpdate = true;
  if (positionCharacter.value) {
    fernMaterial.uniforms.uCharacterPosition.value = positionCharacter.value;
  }
  labelRenderer.render(scene.value, camera.value);

  if (storeControl.isMovingCharacter && instanceMeshRef.value) {
    for (let i = 0; i < props.fernList.length; i++) {
      instanceMeshRef.value.getMatrixAt(i, matrix);
      matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);

      currentDistance.value = calculateDistance(dummy.position);
      if (currentDistance.value < 3 && div) {
        if (!characterStore.characterIsCloseFern) {
          characterStore.setCharacterIsCloseFern(true);
        }
        earthLabel.position.set(dummy.position.x, 2, dummy.position.z);
        div.style.opacity = "1";
        oldPositions = earthLabel.position;
        oldIndex = i;
      }
    }
  }

  if (oldPositions) {
    const oldDistance = calculateDistance(oldPositions);
    if (oldDistance > 3 && div) {
      div.style.opacity = "0";
      oldIndex = -1;
      if (characterStore.characterIsCloseFern) {
        characterStore.setCharacterIsCloseFern(false);
      }
    }
    if (oldDistance < 5 && keyE.value && oldIndex >= 0 && div) {
      oldPositions = null;
      div.style.opacity = "0";
      if (!storeControl.isMovingCharacter) {
        hudStore.setElementToEquipmentList({
          title: "Large leaf",
          id: `${hudStore.addedElementToEquipmentList.length + 1}`,
          count: 1,
        });

        setTimeout(() => {
          floraStore.removeElementFromList({
            type: "fern",
            index: oldIndex,
          });
          characterStore.setCharacterIsCloseFern(false);
        }, 500);
      }
    }
  }
});

watch(instanceMeshRef, (value) => {
  if (!value) return;
  setMesh();
});

watch(
  () => props.fernList.length,
  () => {
    setMesh();
  }
);

const setMesh = () => {
  instanceMeshRef.value.instanceMatrix.setUsage(DynamicDrawUsage);
  instanceMeshRef.value.count = props.fernList.length;
  for (let i = 0; i < props.fernList.length; i++) {
    dummy.position.set(
      props.fernList[i].positionX,
      0.0,
      props.fernList[i].positionZ
    );
    dummy.scale.y = 1.5;
    dummy.scale.x = 1.5;
    dummy.scale.z = 1.5;

    dummy.updateMatrix();
    instanceMeshRef.value.setMatrixAt(i, dummy.matrix);
  }
  instanceMeshRef.value.instanceMatrix.needsUpdate = true;
  instanceMeshRef.value.computeBoundingSphere();
};
</script>
<template>
  <TresInstancedMesh
    :castShadow="settingsShadow > 512"
    ref="instanceMeshRef"
    :args="[nodes.fern.geometry, fernMaterial, 1000]"
  />
</template>
