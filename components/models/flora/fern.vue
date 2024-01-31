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
} from "three";
import { Html } from "@tresjs/cientos";
const hudStore = useHudStore();
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer";
const { bendModel, calculateDistance } = useUtils();
const storeModularGround = useModularGroundStore();
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
const { color } = storeToRefs(storeGeneral);

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
let dummy = new Object3D();
const { nodes } = await useGLTF("/models/fern.glb", { draco: true });
let instancedMesh = null;
const drawingContext = props.drawingCanvas?.getContext("2d");
let oldModel = null;
const setIntancesMesh = () => {
  if (oldModel) {
    oldModel.geometry.dispose();
    oldModel.material.dispose();
    scene.value.remove(oldModel);
  }

  dummy = new Object3D();
  instancedMesh = new InstancedMesh(
    nodes.fern.geometry,
    fernMaterial,
    props.fernList.length
  );

  for (let i = 0; i < props.fernList.length; i++) {
    dummy.position.set(
      props.fernList[i].positionX,
      0.0,
      props.fernList[i].positionZ
    );
    // dummy.rotation.y = props.fernList[i].rotationX;
    // dummy.scale.y = 1.2 + Math.random() * 0.7;
    // dummy.scale.x = 1.2 + Math.random() * 0.4;
    // dummy.scale.z = 1.2 + Math.random() * 0.4;
    dummy.scale.y = 1.5;
    dummy.scale.x = 1.5;
    dummy.scale.z = 1.5;

    dummy.updateMatrix();
    instancedMesh.setMatrixAt(i, dummy.matrix);
  }
  oldModel = instancedMesh;
  scene.value.add(instancedMesh);
  instancedMesh.instanceMatrix.needsUpdate = true;
};

setIntancesMesh();

watch(color, (value) => {
  fernMaterial.uniforms.hexColor.value = new Vector3(
    new Color(value).r / darkerFactor,
    new Color(value).g / darkerFactor,
    new Color(value).b / darkerFactor
  );
});

watch(
  () => props.fernList,
  () => {
    setIntancesMesh();
  }
);
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = "absolute";
labelRenderer.domElement.style.top = "0px";
document.body.appendChild(labelRenderer.domElement);

// for (let index = 0; index < props.fernList.length; index++) {
const div = document.getElementById("collect-e");

const earthLabel = new CSS2DObject(div);
scene.value.add(earthLabel);
// }

window.addEventListener("resize", () => {
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
});
const matrix = new Matrix4();
const currentDistance = ref(0);
let oldPositions = null;
let oldIndex = null;
onLoop(({ _delta, elapsed }) => {
  fernMaterial.uniforms.time.value = elapsed;
  fernMaterial.uniformsNeedUpdate = true;
  if (positionCharacter.value) {
    fernMaterial.uniforms.uCharacterPosition.value = positionCharacter.value;
  }
  labelRenderer.render(scene.value, camera.value);

  if (storeControl.isMovingCharacter) {
    for (let i = 0; i < props.fernList.length; i++) {
      instancedMesh.getMatrixAt(i, matrix);
      matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);

      currentDistance.value = calculateDistance(dummy.position);
      if (currentDistance.value < 3 && div) {
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
      oldIndex = null;
    }
    if (
      oldDistance < 3 &&
      keyE.value &&
      oldIndex >= 0 &&
      !storeControl.isMovingCharacter &&
      div
    ) {
      hudStore.setElementToEquipmentList({
        title: "large leaf",
        id: `${hudStore.addedElementToEquipmentList.length + 1}`,
        count: 1,
        src: "",
      });
      oldPositions = null;
      div.style.opacity = "0";

      setTimeout(() => {
        storeModularGround.removeElementFromModule({
          name: "fern",
          positions: dummy.position,
          id: props.fernList[oldIndex].id,
          positionType: props.fernList[oldIndex].positionType,
        });
      }, 500);
    }
  }
});
</script>
