<script setup lang="ts">
import {
  TextureLoader,
  ShaderMaterial,
  Vector3,
  Color,
  UniformsLib,
  Matrix4,
  DoubleSide,
  MeshLambertMaterial,
  Object3D,
  InstancedMesh,
  DynamicDrawUsage,
} from "three";
import vertexShader from "@/src/shaders/leaves-small/vertex.glsl";
import { CustomEase } from "gsap/CustomEase";
const { $gsap } = useNuxtApp();
$gsap.registerPlugin(CustomEase);
const storeGeneral = useGeneralStore();
const controlsStore = useControlsStore();
const characterStore = useCharacterStore();
const { characterAngle } = storeToRefs(characterStore);
const { characterSeeModelType } = useCharacterControls();
const storeEquipment = useEquipmentStore();
const floraStore = useFloraStore();
const hudStore = useHudStore();
const { setMinusHealth } = useEquipmentUtils();
const { isMovingCharacter, characterState } = storeToRefs(controlsStore);
const { colorTrees, settingsShadow } = storeToRefs(storeGeneral);
const { bendModel, calculateDistance } = useUtils();
const props = defineProps({
  bushStickList: {
    type: Array,
    required: true,
  },
});
const { scene } = useTresContext();
const { onBeforeLoop } = useRenderLoop();
const { scene: modelScene, nodes } = await useGLTF(
  "/models/bush-stick-test.glb",
  { draco: true }
);
const modelLeaves = nodes.leavesStick001;
const modelWood = nodes.woodStick001;

const loader = new TextureLoader();
const alphaMap = loader.load("/materials/leaves/leaves.png");

const instanceMeshWoodRef = shallowRef(null);
const instanceMeshLeavesRef = shallowRef(null);

watch(colorTrees, (value) => {
  instanceMeshLeavesRef.value.material.color = new Color(value);
});
let matrix = new Matrix4();
let dummy = new Object3D();
const currentDistance = ref(0);
let oldPositions = ref(null);
let timer = 0 as number;
let isActiveSticksAndLeavesEffect = ref(false);
let isActiveShake = false as boolean;
onBeforeLoop(({ delta }) => {
  for (let i = 0; i < props.bushStickList.length; i++) {
    instanceMeshWoodRef.value.getMatrixAt(i, matrix);
    instanceMeshLeavesRef.value.getMatrixAt(i, matrix);
    matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
    currentDistance.value = calculateDistance(dummy.position);
    if (currentDistance.value < 3) {
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
          characterAngle.value < 0.5)
      ) {
        if (characterState.value === "attack" && !timer) {
          isActiveShake = true;
        }
        // console.log("right");
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
        // console.log("left");
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
        // console.log("up");
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
        // console.log("down");
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
  setTimeout(() => {
    isActiveSticksAndLeavesEffect.value = true;

    setTimeout(() => {
      isActiveSticksAndLeavesEffect.value = false;
    }, 1000);
  }, 890);
  timer = window.setTimeout(() => {
    isActiveShake = false;
    timer = 0;
    if (props.bushStickList[i].health - setMinusHealth() === 0) {
      hudStore.setElementToEquipmentList({
        title: "Stick",
        id: `${hudStore.addedElementToEquipmentList.length + 1}`,
        count: 1,
      });
      floraStore.removeElementFromList({
        type: "bush-stick",
        index: i,
      });
    }
  }, 900);
};

let numberToAnimation = { number: 0 };
let animationPlayed = false;
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
  () => props.bushStickList.length,
  () => {
    setMesh();
    setMeshLeaves();
  }
);

const setMesh = () => {
  instanceMeshWoodRef.value.instanceMatrix.setUsage(DynamicDrawUsage);
  instanceMeshWoodRef.value.count = props.bushStickList.length;
  for (let i = 0; i < props.bushStickList.length; i++) {
    dummy.position.set(
      props.bushStickList[i].positionX,
      0.0,
      props.bushStickList[i].positionZ
    );

    dummy.updateMatrix();
    instanceMeshWoodRef.value.setMatrixAt(i, dummy.matrix);
  }
  instanceMeshWoodRef.value.instanceMatrix.needsUpdate = true;
  instanceMeshWoodRef.value.computeBoundingSphere();
};

const setMeshLeaves = () => {
  instanceMeshLeavesRef.value.instanceMatrix.setUsage(DynamicDrawUsage);
  instanceMeshLeavesRef.value.count = props.bushStickList.length;
  for (let i = 0; i < props.bushStickList.length; i++) {
    dummy.position.set(
      props.bushStickList[i].positionX,
      0.0,
      props.bushStickList[i].positionZ
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

const isActiveCastShadow = ref();
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
    :castShadow="settingsShadow.value > 512"
    :receiveShadow="settingsShadow.value > 512"
    ref="instanceMeshWoodRef"
    :args="[modelWood.geometry, modelWood.material, 1000]"
  />
  <TresInstancedMesh
    :castShadow="settingsShadow.value > 512"
    :receiveShadow="settingsShadow.value > 512"
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
