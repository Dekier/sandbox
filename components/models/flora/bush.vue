<script setup lang="ts">
import {
  TextureLoader,
  Vector3,
  Color,
  UniformsLib,
  Matrix4,
  DoubleSide,
  MeshLambertMaterial,
  Object3D,
  DynamicDrawUsage,
} from "three";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { CustomEase } from "gsap/CustomEase";
const { characterSeeModelType } = useCharacterControls();
const { setMinusHealth } = useEquipmentUtils();
const characterStore = useCharacterStore();
const { characterAngle, positionCharacter, characterModel } =
  storeToRefs(characterStore);
const storeGeneral = useGeneralStore();
const controlsStore = useControlsStore();
const floraStore = useFloraStore();
const hudStore = useHudStore();
const { isMovingCharacter, characterState } = storeToRefs(controlsStore);
const { $gsap } = useNuxtApp();
$gsap.registerPlugin(CustomEase);
const { colorTrees, settingsShadow } = storeToRefs(storeGeneral);
const { bendModel, calculateDistance } = useUtils();

const props = defineProps({
  bushList: {
    type: Array,
    required: true,
  },
});
const { scene: modelScene, nodes } = await useGLTF("/models/bush-test.glb", {
  draco: true,
});
const { scene } = useTresContext();
const { onBeforeLoop } = useRenderLoop();
const modelLeaves = nodes.leaves003;
const modelWood = nodes.wood;
import vertexShader from "@/src/shaders/leaves-small/vertex.glsl";
const loader = new TextureLoader();
const alphaMap = loader.load("/materials/leaves/leaves.png");

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = "absolute";
document.body.appendChild(labelRenderer.domElement);

const div = document.getElementById("item-health-2");

const earthLabel = new CSS2DObject(div);
scene.value.add(earthLabel);

const instanceMeshWoodRef = shallowRef(null);
const instanceMeshLeavesRef = shallowRef(null);

watch(colorTrees, (value) => {
  instanceMeshLeavesRef.value.material.color = new Color(value);
});
const dummy = new Object3D();
const matrix = new Matrix4();
const currentDistance = ref(0);
let oldPositions = ref(null);
let timer = 0 as number;
let isActiveShake = false as boolean;
let isActiveSticksAndLeavesEffect = ref(false);
let animationPlayed = false;

onBeforeLoop(({ delta }) => {
  for (let i = 0; i < props.bushList.length; i++) {
    instanceMeshWoodRef.value.getMatrixAt(i, matrix);
    instanceMeshLeavesRef.value.getMatrixAt(i, matrix);
    matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
    currentDistance.value = calculateDistance(dummy.position);
    if (currentDistance.value < 4) {
      const { x, z } = bendModel(dummy.position);
      if (isMovingCharacter.value && !animationPlayed) {
        dummy.rotation.x = lerp(dummy.rotation.x, x, 0.04);
        dummy.rotation.z = lerp(dummy.rotation.z, z, 0.04);
        dummy.updateMatrix();
        instanceMeshWoodRef.value.setMatrixAt(i, dummy.matrix);
        instanceMeshWoodRef.value.instanceMatrix.needsUpdate = true;
        instanceMeshLeavesRef.value.setMatrixAt(i, dummy.matrix);
        instanceMeshLeavesRef.value.instanceMatrix.needsUpdate = true;
      }
      if (!isActiveSticksAndLeavesEffect.value) {
        oldPositions.value = { ...dummy.position };
      }

      const sideType = characterSeeModelType(dummy.position);
      if (
        (sideType === "Model right" &&
          characterAngle.value < 0 &&
          characterAngle.value > -1.6) ||
        (sideType === "Model right" &&
          characterAngle.value > 0 &&
          characterAngle.value < 0.7)
      ) {
        if (characterState.value === "attack" && !timer) {
          isActiveShake = true;
        }
        if (isActiveShake) {
          animationModelShake({
            number: -0.12,
            i,
            x,
            z,
            dummy,
            type: "rotationX",
            delta,
          });
        }
        if (characterState.value === "attack" && !timer) {
          updateDummy(i);
        }
      }
      if (
        (sideType === "Model left" && characterAngle.value < -2.3) ||
        (sideType === "Model left" && characterAngle.value > 2.3)
      ) {
        if (characterState.value === "attack" && !timer) {
          isActiveShake = true;
        }
        if (isActiveShake) {
          animationModelShake({
            number: 0.12,
            i,
            x,
            z,
            dummy,
            type: "rotationX",
            delta,
          });
        }
        if (characterState.value === "attack" && !timer) {
          updateDummy(i);
        }
      }
      if (
        sideType === "Model up" &&
        characterAngle.value > 0 &&
        characterAngle.value < 2.3
      ) {
        if (characterState.value === "attack" && !timer) {
          isActiveShake = true;
        }
        if (isActiveShake) {
          animationModelShake({
            number: -0.12,
            i,
            x,
            z,
            dummy,
            type: "rotationZ",
            delta,
          });
        }
        if (characterState.value === "attack" && !timer) {
          updateDummy(i);
        }
      }
      if (
        sideType === "Model down" &&
        characterAngle.value < -0.7 &&
        characterAngle.value > -2.7
      ) {
        if (characterState.value === "attack" && !timer) {
          isActiveShake = true;
        }
        if (isActiveShake) {
          animationModelShake({
            number: 0.12,
            i,
            x,
            z,
            dummy,
            type: "rotationZ",
            delta,
          });
        }
        if (characterState.value === "attack" && !timer) {
          updateDummy(i);
        }
      }
    }
  }
});

const updateDummy = (i: number) => {
  const stickCount = Math.round(Math.random() + 1);
  const leavesCount = Math.round(Math.random() + 1);
  timer = window.setTimeout(() => {
    isActiveShake = false;
    timer = 0;
    if (props.bushList[i].health - setMinusHealth() === 0) {
      isActiveSticksAndLeavesEffect.value = true;
      setTimeout(() => {
        isActiveSticksAndLeavesEffect.value = false;
      }, 1800);
      setTimeout(() => {
        hudStore.setElementToEquipmentList({
          title: "Small leaves",
          id: `${hudStore.addedElementToEquipmentList.length + 1}`,
          count: leavesCount,
        });
      }, 300);
      hudStore.setElementToEquipmentList({
        title: "Stick",
        id: `${hudStore.addedElementToEquipmentList.length + 1}`,
        count: stickCount,
      });
      floraStore.removeElementFromList({
        type: "bush",
        index: i,
      });
    } else {
      floraStore.updateHealthElementFromList({
        type: "bush",
        index: i,
        minusHealth: setMinusHealth() || 1,
      });
    }
  }, 1000);
};

let numberToAnimation = { number: 0 };
const animationModelShake = (data: any) => {
  if (!animationPlayed) {
    animationPlayed = true;

    numberToAnimation.number =
      data.type === "rotationZ" ? data.dummy.rotation.z : data.dummy.rotation.x;

    $gsap.to(numberToAnimation, {
      number: numberToAnimation.number + data.number,
      duration: 1,
      ease: CustomEase.create(
        "custom",
        "M0,0 C0.098,0 0.418,0 0.557,0 0.603,0 0.612,0.042 0.612,0.111 0.612,0.223 0.624,0.645 0.68,0.645 0.741,0.645 0.665,-0.446 0.73,-0.446 0.8,-0.446 0.763,0.4 0.824,0.4 0.894,0.4 0.832,-0.2 0.9,-0.2 0.946,-0.2 0.901,0.121 0.941,0.133 1.011,0.153 0.99,0 1,0 "
      ),
      onComplete: () => {
        setTimeout(() => {
          animationPlayed = false;
        }, 50);
      },
    });
  }
  if (data.type === "rotationZ") {
    data.dummy.rotation.z = numberToAnimation.number + data.delta * 0.7;
  } else {
    data.dummy.rotation.x = numberToAnimation.number + data.delta * 0.7;
  }
  data.dummy.updateMatrix();
  instanceMeshWoodRef.value.setMatrixAt(data.i, data.dummy.matrix);
  instanceMeshWoodRef.value.instanceMatrix.needsUpdate = true;
  instanceMeshLeavesRef.value.setMatrixAt(data.i, data.dummy.matrix);
  instanceMeshLeavesRef.value.instanceMatrix.needsUpdate = true;
};

const lerp = (start: number, end: number, alpha: number): number => {
  return start * (1 - alpha) + end * alpha;
};

watch(instanceMeshWoodRef, (value) => {
  if (!value) return;
  setMesh();
});

watch(instanceMeshLeavesRef, (value) => {
  if (!value) return;
  setMeshLeaves();
});

watch(
  () => props.bushList.length,
  () => {
    setMesh();
    setMeshLeaves();
  }
);

const setMesh = () => {
  instanceMeshWoodRef.value.instanceMatrix.setUsage(DynamicDrawUsage);
  instanceMeshWoodRef.value.count = props.bushList.length;
  for (let i = 0; i < props.bushList.length; i++) {
    dummy.position.set(
      props.bushList[i].positionX,
      0.0,
      props.bushList[i].positionZ
    );

    dummy.updateMatrix();
    instanceMeshWoodRef.value.setMatrixAt(i, dummy.matrix);
  }
  instanceMeshWoodRef.value.instanceMatrix.needsUpdate = true;
  instanceMeshWoodRef.value.computeBoundingSphere();
};

const setMeshLeaves = () => {
  instanceMeshLeavesRef.value.instanceMatrix.setUsage(DynamicDrawUsage);
  instanceMeshLeavesRef.value.count = props.bushList.length;
  for (let i = 0; i < props.bushList.length; i++) {
    dummy.position.set(
      props.bushList[i].positionX,
      0.0,
      props.bushList[i].positionZ
    );

    dummy.updateMatrix();
    instanceMeshLeavesRef.value.setMatrixAt(i, dummy.matrix);
  }
  instanceMeshLeavesRef.value.instanceMatrix.needsUpdate = true;
  instanceMeshLeavesRef.value.computeBoundingSphere();
  instanceMeshLeavesRef.value.material.alphaMap = alphaMap;
  instanceMeshLeavesRef.value.material.alphaTest = 0.3;
  instanceMeshLeavesRef.value.material.side = DoubleSide;
  instanceMeshLeavesRef.value.material.color = new Color(colorTrees.value);
};

const materialProps = {
  baseMaterial: MeshLambertMaterial,
  vertexShader,
  uniforms: {
    time: {
      value: 0,
    },
    u_WobbleAmplitude: { value: 0.07 },
    alphaMap: { value: alphaMap },
    alphaMapMoving: { value: null },
    hexColor: {
      value: new Vector3(
        new Color(colorTrees.value).r,
        new Color(colorTrees.value).g,
        new Color(colorTrees.value).b
      ),
    },
    ...UniformsLib.lights,
  },
};

const { onLoop } = useRenderLoop();
onMounted(async () => {
  await nextTick();

  onLoop(({ elapsed }) => {
    materialProps.uniforms.time.value = elapsed;
  });
});
</script>

<template>
  <TresInstancedMesh
    :castShadow="settingsShadow > 0"
    :receiveShadow="settingsShadow > 0"
    ref="instanceMeshWoodRef"
    :args="[modelWood.geometry, modelWood.material, 1000]"
  />
  <TresInstancedMesh
    :castShadow="settingsShadow > 0"
    :receiveShadow="settingsShadow > 0"
    ref="instanceMeshLeavesRef"
    :args="[modelLeaves.geometry, null, 1000]"
  >
    <CustomShaderMaterial v-bind="materialProps" />
  </TresInstancedMesh>
  <Suspense>
    <ModelsFloraEffects2
      v-if="oldPositions"
      :key="oldPositions.x + oldPositions.z"
      :positions="oldPositions"
      :is-active-effect="isActiveSticksAndLeavesEffect"
    />
  </Suspense>
</template>
