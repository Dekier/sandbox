<script setup lang="ts">
import {
  Mesh,
  MeshStandardMaterial,
  TextureLoader,
  RepeatWrapping,
  Vector2,
  Vector3,
  PlaneGeometry,
  DoubleSide,
  ShaderMaterial,
  BufferGeometry,
  Matrix4,
  Object3D,
  InstancedMesh,
  Color,
  MeshDepthMaterial,
  RGBADepthPacking,
  UniformsLib,
  CanvasTexture,
  MeshBasicMaterial,
  BoxGeometry,
} from "three";
const props = defineProps({
  drawingCanvas: {
    type: Object,
    required: true,
  },
  isActiveUpdateCanvas: {
    type: Boolean,
    required: true,
  },
});

const storeGeneral = useGeneralStore();
const { color } = storeToRefs(storeGeneral);
const { scene, renderer, camera } = useTresContext();
const { onLoop, resume } = useRenderLoop();

const characterStore = useCharacterStore();
const { positionCharacter } = storeToRefs(characterStore);

import vertexShader from "@/src/shaders/vertex3.glsl";
import fragmentShader from "@/src/shaders/fragment3.glsl";
const loader = new TextureLoader();
const alphaMap = loader.load("/materials/grass/blade_alpha3.png");

const darkerFactor = 3.4;
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
  fogColor: { value: new Color("#BEE1F7") },
  fogNear: { value: 130 },
  fogFar: { value: 150 },
  ...UniformsLib.lights,
};

const grassMaterial = new ShaderMaterial({
  uniforms,
  vertexShader,
  fragmentShader,
  side: DoubleSide,
  lights: true,
});
const instanceNumber = 100000;
let dummy = new Object3D();
const geometry = new PlaneGeometry(0.1, 0.2, 1, 4);
geometry.translate(0, 0.5, 0);

let instancedMesh = new InstancedMesh(geometry, grassMaterial, instanceNumber);
instancedMesh.castShadow = false;
instancedMesh.receiveShadow = false;

const calculatePixelPercentage = (pixelData, targetColor) => {
  let totalPixels = 0;
  let targetPixels = 0;
  for (let i = 0; i < pixelData.length; i += 4) {
    // Pixel data is stored in RGBA format (4 values per pixel)
    const red = pixelData[i];
    const green = pixelData[i + 1];
    const blue = pixelData[i + 2];
    const alpha = pixelData[i + 3];

    // Check if the pixel is not fully transparent
    if (alpha > 0) {
      // Assuming targetColor is either "#000000" (black) or "#FFFFFF" (white)
      const isTargetColor =
        (targetColor === "#000000" && red === 0 && green === 0 && blue === 0) ||
        (targetColor === "#FFFFFF" &&
          red === 255 &&
          green === 255 &&
          blue === 255);

      if (isTargetColor) {
        targetPixels++;
      }
    }

    totalPixels++;
  }

  return (targetPixels / totalPixels) * 100;
};

let oldModel = null;

const drawingContext = props.drawingCanvas?.getContext("2d");
const setIntancesMesh = () => {
  const imageData = drawingContext.getImageData(0, 0, 200, 200);
  const pixels = imageData.data;
  const whitePercentage = calculatePixelPercentage(pixels, "#FFFFFF");
  const newPercentInstanceNumber = Math.round(
    instanceNumber * (whitePercentage / 100)
  );
  if (oldModel) {
    oldModel.geometry.dispose();
    oldModel.material.dispose();
    scene.value.remove(oldModel);

    dummy = new Object3D();
    instancedMesh = new InstancedMesh(
      geometry,
      grassMaterial,
      newPercentInstanceNumber
    );
  }

  const threshold = 0.3;
  const validPositions = [];
  for (let i = 0; i < pixels.length; i += 4) {
    const pixelValue = (pixels[i] / 255.0 - 0.5) * 2.0;

    if (pixelValue > threshold) {
      const x = (i / 4) % 200;
      const z = Math.floor(i / 4 / 200);
      validPositions.push({ x, z });
    }
  }

  for (let i = 0; i < newPercentInstanceNumber; i++) {
    const randomIndex = Math.floor(Math.random() * validPositions.length);
    const randomPosition = validPositions[randomIndex];
    dummy.position.set(
      randomPosition.x + Math.random() * 1.2 - 200 / 2,
      0,
      randomPosition.z - 200 / 2 + Math.random() * 1.2
    );

    dummy.scale.y = 1.5 + Math.random() * 0.7;
    dummy.scale.x = 1.5 + Math.random() * 0.4;
    dummy.scale.z = 1.5 + Math.random() * 0.4;
    dummy.rotation.y = Math.random() * 184;

    dummy.updateMatrix();
    instancedMesh.setMatrixAt(i, dummy.matrix);
  }
  oldModel = instancedMesh;
  scene.value.add(instancedMesh);
};

setIntancesMesh();

watch(color, (value) => {
  grassMaterial.uniforms.hexColor.value = new Vector3(
    new Color(value).r / darkerFactor,
    new Color(value).g / darkerFactor,
    new Color(value).b / darkerFactor
  );
});

watch(
  () => props.isActiveUpdateCanvas,
  (value) => {
    if (!value) {
      setIntancesMesh();
    }
  }
);

onLoop(({ _delta, elapsed }) => {
  grassMaterial.uniforms.time.value = elapsed;
  grassMaterial.uniformsNeedUpdate = true;
  if (positionCharacter.value) {
    grassMaterial.uniforms.uCharacterPosition.value = positionCharacter.value;
  }
});
</script>
