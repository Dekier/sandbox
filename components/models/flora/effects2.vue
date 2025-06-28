<script setup lang="ts">
import {
  DoubleSide,
  Object3D,
  PlaneGeometry,
  MeshLambertMaterial,
  TextureLoader,
  Color,
  Matrix4,
} from "three";

const props = defineProps({
  positions: {
    type: Object,
    required: true,
  },
  isActiveEffect: {
    type: Boolean,
    required: true,
  },
});
const downloadedModels = useDownloadedModels();
const { smallStick } = storeToRefs(downloadedModels);
const storeGeneral = useGeneralStore();
const { colorTrees, settingsShadow } = storeToRefs(storeGeneral);
const smallStickModel = { ...smallStick.value.smallStick };
const smallStick2Model = { ...smallStick.value.smallStick2 };

const { onLoop } = useRenderLoop();
const matrix = new Matrix4();
const instanceMeshWoodRef = shallowRef(null);
const instanceMeshWood2Ref = shallowRef(null);
const instanceMeshLeafRef = shallowRef(null);
const dummy = new Object3D();
onMounted(async () => {
  await nextTick();

  onLoop(({ delta }) => {
    if (instanceMeshWoodRef.value) {
      for (let i = 0; i < 5; i++) {
        instanceMeshWoodRef.value.getMatrixAt(i, matrix);
        matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
        const randomNumber = Math.random() * 5;
        dummy.position.y -= 5 * delta;
        dummy.rotation.x += randomNumber * delta;
        dummy.rotation.y += randomNumber * delta;
        dummy.rotation.z += randomNumber * delta;
        dummy.updateMatrix();
        instanceMeshWoodRef.value.setMatrixAt(i, dummy.matrix);
        instanceMeshWoodRef.value.instanceMatrix.needsUpdate = true;
      }

      for (let i = 0; i < 5; i++) {
        instanceMeshWood2Ref.value.getMatrixAt(i, matrix);
        matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
        const randomNumber = Math.random() * 5;
        dummy.position.y -= 5 * delta;
        dummy.rotation.x += randomNumber * delta;
        dummy.rotation.y += randomNumber * delta;
        dummy.rotation.z += randomNumber * delta;
        dummy.updateMatrix();
        instanceMeshWood2Ref.value.setMatrixAt(i, dummy.matrix);
        instanceMeshWood2Ref.value.instanceMatrix.needsUpdate = true;
      }

      for (let i = 0; i < 30; i++) {
        instanceMeshLeafRef.value.getMatrixAt(i, matrix);
        matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
        const randomNumber = Math.random() * 5;
        dummy.position.y -= 5 * delta;
        dummy.rotation.x += randomNumber * delta;
        dummy.rotation.y += randomNumber * delta;
        dummy.rotation.z += randomNumber * delta;
        dummy.updateMatrix();
        instanceMeshLeafRef.value.setMatrixAt(i, dummy.matrix);
        instanceMeshLeafRef.value.instanceMatrix.needsUpdate = true;
      }
    }
  });
});

const { scene } = useTresContext();
const loader = new TextureLoader();
const alphaMap = loader.load("/materials/leaves/one-leaf.png");
const materialLeaf = new MeshLambertMaterial({
  color: new Color(
    new Color(colorTrees.value).r / 0.7,
    new Color(colorTrees.value).g / 0.7,
    new Color(colorTrees.value).b / 0.7
  ),
  alphaMap: alphaMap,
  alphaTest: 0.3,
  side: DoubleSide,
});
const geometryLeaf = new PlaneGeometry(0.2, 0.2, 1, 1);
watch(instanceMeshWoodRef, (value) => {
  if (!value) return;
  for (let i = 0; i < 5; i++) {
    const randomNumber = Math.random() * 2 - 1;
    const randomNumber2 = Math.random() * 2 - 1;
    const randomNumber3 = Math.random() * 5;
    dummy.position.set(
      props.positions.x + randomNumber,
      randomNumber3,
      props.positions.z + randomNumber2
    );
    dummy.rotation.set(randomNumber3, randomNumber3, randomNumber3);

    dummy.updateMatrix();
    instanceMeshWoodRef.value.setMatrixAt(i, dummy.matrix);
  }
});

watch(instanceMeshWood2Ref, (value) => {
  if (!value) return;
  for (let i = 0; i < 5; i++) {
    const randomNumber = Math.random() * 2 - 1;
    const randomNumber2 = Math.random() * 2 - 1;
    const randomNumber3 = Math.random() * 5;
    dummy.position.set(
      props.positions.x + randomNumber,
      randomNumber3,
      props.positions.z + randomNumber2
    );
    dummy.rotation.set(randomNumber3, randomNumber3, randomNumber3);

    dummy.updateMatrix();
    instanceMeshWood2Ref.value.setMatrixAt(i, dummy.matrix);
  }
});

watch(instanceMeshLeafRef, (value) => {
  if (!value) return;
  for (let i = 0; i < 30; i++) {
    const randomNumber = Math.random() * 3 - 1.5;
    const randomNumber2 = Math.random() * 3 - 1.5;
    const randomNumber3 = Math.random() * 5 + 0.2;
    dummy.position.set(
      props.positions.x + randomNumber,
      randomNumber3,
      props.positions.z + randomNumber2
    );
    dummy.rotation.set(randomNumber3, randomNumber3, randomNumber3);

    dummy.updateMatrix();
    instanceMeshLeafRef.value.setMatrixAt(i, dummy.matrix);
  }
});
</script>

<template>
  <TresInstancedMesh
    v-if="isActiveEffect"
    ref="instanceMeshWoodRef"
    :args="[smallStickModel.geometry, smallStickModel.material, 5]"
  >
  </TresInstancedMesh>
  <TresInstancedMesh
    v-if="isActiveEffect"
    :castShadow="settingsShadow > 0"
    ref="instanceMeshWood2Ref"
    :args="[smallStick2Model.geometry, smallStick2Model.material, 5]"
  >
  </TresInstancedMesh>
  <TresInstancedMesh
    v-if="isActiveEffect"
    :receiveShadow="settingsShadow > 0"
    ref="instanceMeshLeafRef"
    :args="[geometryLeaf, materialLeaf, 30]"
  >
  </TresInstancedMesh>
</template>
