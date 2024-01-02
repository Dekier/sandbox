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

const storeGeneral = useGeneralStore();
const { color } = storeToRefs(storeGeneral);
const { scene, renderer, camera } = useTresContext();
const { onLoop, resume } = useRenderLoop();

const characterStore = useCharacterStore();
const { positionCharacter } = storeToRefs(characterStore);

import vertexShader from "@/src/shaders/flowers/vertex.glsl";
import fragmentShader from "@/src/shaders/flowers/fragment.glsl";
const loader = new TextureLoader();
const alphaMap = loader.load("/materials/flowers/alpha3.webp");

const darkerFactor = 1.3;
const uniforms = {
  time: {
    value: 0,
  },
  uCharacterPosition: { value: new Vector3(0, 0, 0) },
  alphaMap: { value: alphaMap },
  hexColor: {
    value: new Vector3(
      new Color(color.value).r * darkerFactor,
      new Color(color.value).g * darkerFactor,
      new Color(color.value).b * darkerFactor
    ),
  },
  ...UniformsLib.lights,
};

const grassMaterial = new ShaderMaterial({
  uniforms,
  vertexShader,
  fragmentShader,
  side: DoubleSide,
  lights: true,
});
const instanceNumber = 900;
let dummy = new Object3D();
const geometry = new PlaneGeometry(0.2, 0.8, 1, 2);
geometry.translate(0, 0.5, 0);

const { nodes } = await useGLTF("/models/flower.glb", { draco: true });
let instancedMesh = new InstancedMesh(geometry, grassMaterial, instanceNumber);
instancedMesh.castShadow = false;
instancedMesh.receiveShadow = false;

const drawingCanvas = document.getElementById("drawing-canvas");
const drawStartPos = new Vector2();
const drawingContext = drawingCanvas?.getContext("2d");
drawingCanvas.addEventListener("pointerup", () => {
  const newTexture = new CanvasTexture(drawingCanvas);
  setIntancesMesh(newTexture.source.data);
});

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
const setIntancesMesh = (data) => {
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

const newTexture = new CanvasTexture(drawingCanvas);
setIntancesMesh(newTexture.source.data);

watch(color, (value) => {
  grassMaterial.uniforms.hexColor.value = new Vector3(
    new Color(value).r * darkerFactor,
    new Color(value).g * darkerFactor,
    new Color(value).b * darkerFactor
  );
});

onLoop(({ _delta, elapsed }) => {
  grassMaterial.uniforms.time.value = elapsed;
  grassMaterial.uniformsNeedUpdate = true;
  if (positionCharacter.value) {
    grassMaterial.uniforms.uCharacterPosition.value = positionCharacter.value;
  }
});
</script>
