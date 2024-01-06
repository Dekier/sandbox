<script setup lang="ts">
import {
  MeshLambertMaterial,
  InstancedMesh,
  Object3D,
  Vector3,
  Color,
  TextureLoader,
  RepeatWrapping,
  UniformsLib,
  Texture,
  ShaderMaterial,
} from "three";
import { useGLTF } from "@tresjs/cientos";
const { nodes } = await useGLTF("/models/ground.glb", { draco: true });
const storeGeneral = useGeneralStore();
const { color } = storeToRefs(storeGeneral);
const storeModularGround = useModularGroundStore();
const { activeModularList } = storeToRefs(storeModularGround);
const { newSetModel } = useModelSettings();
const { scene } = useTresContext();
import { useModelSettings } from "~/composables/useModel";
const { setModel } = useModelSettings();
import vertexShader from "@/src/shaders/ground/vertex.glsl";
import fragmentShader from "@/src/shaders/ground/fragment.glsl";
const props = defineProps({
  drawingCanvas: {
    type: Object,
    required: true,
  },
});
const loader = new TextureLoader();
const rough = loader.load("/materials/grass/color.webp");
rough.wrapS = RepeatWrapping;
rough.wrapT = RepeatWrapping;
rough.repeat.x = 35;
rough.repeat.y = 35;
const darkerFactor = 0.85;
const darkerFactorRoads = 1.0;
const alphaMap = new Texture();
const drawingContext = props.drawingCanvas?.getContext("2d");
alphaMap.image = await drawingContext.getImageData(0, 0, 200, 200);
alphaMap.needsUpdate = true;

// Ustaw parametry dla tekstury mapy alfy
alphaMap.wrapS = RepeatWrapping;
alphaMap.wrapT = RepeatWrapping;
const uniforms = {
  time: {
    value: 0,
  },
  uCharacterPosition: { value: new Vector3(0, 0, 0) },
  roughMap: { value: rough },
  alphaMap: { value: alphaMap },
  hexColor: {
    value: new Vector3(
      new Color(color.value).r / darkerFactor,
      new Color(color.value).g / darkerFactor,
      new Color(color.value).b / darkerFactor
    ),
  },
  hexColorRoads: {
    value: new Vector3(
      new Color(color.value).r / darkerFactorRoads,
      new Color(color.value).g / darkerFactorRoads,
      new Color(color.value).b / darkerFactorRoads
    ),
  },
  ...UniformsLib.lights,
};

const groundMaterial = new ShaderMaterial({
  uniforms,
  vertexShader,
  fragmentShader,
  lights: true,
});

watch(color, (value) => {
  groundMaterial.uniforms.hexColor.value = new Vector3(
    new Color(value).r / darkerFactor,
    new Color(value).g / darkerFactor,
    new Color(value).b / darkerFactor
  );

  groundMaterial.uniforms.hexColorRoads.value = new Vector3(
    new Color(value).r / darkerFactorRoads,
    new Color(value).g / darkerFactorRoads,
    new Color(value).b / darkerFactorRoads
  );
});

const groundZeroList = [];
const listGroundOneSide = [];
const groundCornerList = [];
const groundTwoSideList = [];
const groundThreeSideList = [];

activeModularList.value.forEach((element) => {
  const isLeftActive = activeModularList.value.find(
    (data) => data.index === element.index - 1
  );
  const isRightActive = activeModularList.value.find(
    (data) => data.index === element.index + 1
  );

  const isTopActive = activeModularList.value.find(
    (data) => data.index === element.index - 15
  );
  const isBottomActive = activeModularList.value.find(
    (data) => data.index === element.index + 15
  );
  if (isLeftActive && isRightActive && isTopActive && isBottomActive) {
    groundZeroList.push(element);
  }

  if (isLeftActive && isRightActive && isTopActive && !isBottomActive) {
    listGroundOneSide.push({ ...element, side: "bottom" });
  }

  if (!isLeftActive && isRightActive && isTopActive && isBottomActive) {
    listGroundOneSide.push({ ...element, side: "left" });
  }

  if (isLeftActive && !isRightActive && isTopActive && isBottomActive) {
    listGroundOneSide.push({ ...element, side: "right" });
  }

  if (isLeftActive && isRightActive && !isTopActive && isBottomActive) {
    listGroundOneSide.push({ ...element, side: "top" });
  }

  if (!isLeftActive && isRightActive && !isTopActive && isBottomActive) {
    groundCornerList.push({ ...element, side: "bottom-right" });
  }

  if (!isLeftActive && isRightActive && isTopActive && !isBottomActive) {
    groundCornerList.push({ ...element, side: "top-right" });
  }

  if (isLeftActive && !isRightActive && isTopActive && !isBottomActive) {
    groundCornerList.push({ ...element, side: "top-left" });
  }

  if (isLeftActive && !isRightActive && !isTopActive && isBottomActive) {
    groundCornerList.push({ ...element, side: "bottom-left" });
  }

  if (!isLeftActive && isRightActive && !isTopActive && !isBottomActive) {
    groundThreeSideList.push({ ...element, side: "right" });
  }

  if (isLeftActive && !isRightActive && !isTopActive && !isBottomActive) {
    groundThreeSideList.push({ ...element, side: "left" });
  }

  if (!isLeftActive && !isRightActive && !isTopActive && isBottomActive) {
    groundThreeSideList.push({ ...element, side: "bottom" });
  }

  if (!isLeftActive && !isRightActive && isTopActive && !isBottomActive) {
    groundThreeSideList.push({ ...element, side: "top" });
  }

  if (!isLeftActive && !isRightActive && isTopActive && isBottomActive) {
    groundTwoSideList.push({ ...element, side: "top-bottom" });
  }

  if (isLeftActive && isRightActive && !isTopActive && !isBottomActive) {
    groundTwoSideList.push({ ...element, side: "left-right" });
  }
});
const groundOneSideModel = nodes.Cube068;
newSetModel(groundOneSideModel);
const instancedMeshGroundOneSide = new InstancedMesh(
  groundOneSideModel.geometry,
  groundMaterial,
  listGroundOneSide.length
);
instancedMeshGroundOneSide.castShadow = true;
instancedMeshGroundOneSide.receiveShadow = true;

const groundOneSideModel2 = nodes.Cube068_1;
newSetModel(groundOneSideModel2);
const instancedMeshGroundOneSide2 = new InstancedMesh(
  groundOneSideModel2.geometry,
  groundOneSideModel2.material,
  listGroundOneSide.length
);
instancedMeshGroundOneSide2.castShadow = true;
instancedMeshGroundOneSide2.receiveShadow = true;

const groundCornerSideModel = nodes.Cube069;
newSetModel(groundCornerSideModel);
const instancedMeshGroundCornerSide = new InstancedMesh(
  groundCornerSideModel.geometry,
  groundMaterial,
  groundCornerList.length
);
instancedMeshGroundCornerSide.castShadow = true;
instancedMeshGroundCornerSide.receiveShadow = true;

const groundCornerSideModel2 = nodes.Cube069_1;
newSetModel(groundCornerSideModel2);
const instancedMeshGroundCornerSide2 = new InstancedMesh(
  groundCornerSideModel2.geometry,
  groundCornerSideModel2.material,
  groundCornerList.length
);
instancedMeshGroundCornerSide2.castShadow = true;
instancedMeshGroundCornerSide2.receiveShadow = true;

const groundTwoSideModel = nodes.Cube074;
newSetModel(groundTwoSideModel);
const instancedMeshGroundTwoSide = new InstancedMesh(
  groundTwoSideModel.geometry,
  groundMaterial,
  groundTwoSideList.length
);
instancedMeshGroundTwoSide.castShadow = true;
instancedMeshGroundTwoSide.receiveShadow = true;

const groundTwoSideModel2 = nodes.Cube074_1;
newSetModel(groundTwoSideModel2);
const instancedMeshGroundTwoSide2 = new InstancedMesh(
  groundTwoSideModel2.geometry,
  groundTwoSideModel2.material,
  groundTwoSideList.length
);
instancedMeshGroundTwoSide2.castShadow = true;
instancedMeshGroundTwoSide2.receiveShadow = true;

const groundThreeSideModel = nodes.Cube070;
newSetModel(groundThreeSideModel);
const instancedMeshGroundThreeSide = new InstancedMesh(
  groundThreeSideModel.geometry,
  groundMaterial,
  groundThreeSideList.length
);
instancedMeshGroundThreeSide.castShadow = true;
instancedMeshGroundThreeSide.receiveShadow = true;

const groundThreeSideModel2 = nodes.Cube070_1;
newSetModel(groundThreeSideModel2);
const instancedMeshGroundThreeSide2 = new InstancedMesh(
  groundThreeSideModel2.geometry,
  groundThreeSideModel2.material,
  groundThreeSideList.length
);
instancedMeshGroundThreeSide2.castShadow = true;
instancedMeshGroundThreeSide2.receiveShadow = true;

const groundZeroModel = nodes.groundZero;
newSetModel(groundZeroModel);
const instancedMeshGroundZero = new InstancedMesh(
  groundZeroModel.geometry,
  groundMaterial,
  groundZeroList.length
);
instancedMeshGroundZero.castShadow = true;
instancedMeshGroundZero.receiveShadow = true;

const dummyZero = new Object3D();
for (let i = 0; i < groundZeroList.length; i++) {
  dummyZero.position.set(
    groundZeroList[i].positionX,
    0.0,
    groundZeroList[i].positionZ
  );

  dummyZero.updateMatrix();
  instancedMeshGroundZero.setMatrixAt(i, dummyZero.matrix);
}
scene.value.add(instancedMeshGroundZero);

const dummyOneSide = new Object3D();
for (let i = 0; i < listGroundOneSide.length; i++) {
  dummyOneSide.position.set(
    listGroundOneSide[i].positionX,
    0.0,
    listGroundOneSide[i].positionZ
  );
  if (listGroundOneSide[i].side === "bottom") {
    dummyOneSide.rotation.y = -Math.PI;
  } else if (listGroundOneSide[i].side === "top") {
    dummyOneSide.rotation.y = 0;
  } else if (listGroundOneSide[i].side === "left") {
    dummyOneSide.rotation.y = Math.PI / 2;
  } else if (listGroundOneSide[i].side === "right") {
    dummyOneSide.rotation.y = -Math.PI / 2;
  }
  dummyOneSide.updateMatrix();
  instancedMeshGroundOneSide.setMatrixAt(i, dummyOneSide.matrix);
  instancedMeshGroundOneSide2.setMatrixAt(i, dummyOneSide.matrix);
}
scene.value.add(instancedMeshGroundOneSide);
scene.value.add(instancedMeshGroundOneSide2);

const dummyCornerSide = new Object3D();
for (let i = 0; i < groundCornerList.length; i++) {
  dummyCornerSide.position.set(
    groundCornerList[i].positionX,
    0.0,
    groundCornerList[i].positionZ
  );
  if (groundCornerList[i].side === "top-left") {
    dummyCornerSide.rotation.y = -Math.PI;
  } else if (groundCornerList[i].side === "bottom-left") {
    dummyCornerSide.rotation.y = -Math.PI / 2;
  } else if (groundCornerList[i].side === "top-right") {
    dummyCornerSide.rotation.y = Math.PI / 2;
  } else if (groundCornerList[i].side === "bottom-right") {
    dummyCornerSide.rotation.y = 0;
  }
  dummyCornerSide.updateMatrix();
  instancedMeshGroundCornerSide.setMatrixAt(i, dummyCornerSide.matrix);
  instancedMeshGroundCornerSide2.setMatrixAt(i, dummyCornerSide.matrix);
}
scene.value.add(instancedMeshGroundCornerSide);
scene.value.add(instancedMeshGroundCornerSide2);

const dummyThreeSide = new Object3D();
for (let i = 0; i < groundThreeSideList.length; i++) {
  dummyThreeSide.position.set(
    groundThreeSideList[i].positionX,
    0.0,
    groundThreeSideList[i].positionZ
  );
  if (groundThreeSideList[i].side === "left") {
    dummyThreeSide.rotation.y = -Math.PI / 2;
  } else if (groundThreeSideList[i].side === "right") {
    dummyThreeSide.rotation.y = Math.PI / 2;
  } else if (groundThreeSideList[i].side === "top") {
    dummyThreeSide.rotation.y = Math.PI;
  } else if (groundThreeSideList[i].side === "bottom") {
    dummyThreeSide.rotation.y = 0;
  }
  dummyThreeSide.updateMatrix();
  instancedMeshGroundThreeSide.setMatrixAt(i, dummyThreeSide.matrix);
  instancedMeshGroundThreeSide2.setMatrixAt(i, dummyThreeSide.matrix);
}
scene.value.add(instancedMeshGroundThreeSide);
scene.value.add(instancedMeshGroundThreeSide2);

const dummyTwoSide = new Object3D();
for (let i = 0; i < groundTwoSideList.length; i++) {
  dummyTwoSide.position.set(
    groundTwoSideList[i].positionX,
    0.0,
    groundTwoSideList[i].positionZ
  );
  if (groundTwoSideList[i].side === "left-right") {
    dummyTwoSide.rotation.y = -Math.PI / 2;
  } else if (groundTwoSideList[i].side === "top-bottom") {
    dummyTwoSide.rotation.y = Math.PI / 2;
  }
  dummyTwoSide.updateMatrix();
  instancedMeshGroundTwoSide.setMatrixAt(i, dummyTwoSide.matrix);
  instancedMeshGroundTwoSide2.setMatrixAt(i, dummyTwoSide.matrix);
}
scene.value.add(instancedMeshGroundTwoSide);
scene.value.add(instancedMeshGroundTwoSide2);
</script>

<!-- <template>
  <primitive :object="model" />
</template> -->
