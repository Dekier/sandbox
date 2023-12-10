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
const { color, colorBackground, positions } = storeToRefs(storeGeneral);
const { scene, renderer, camera } = useTresContext();
const { onLoop, resume } = useRenderLoop();

const characterStore = useCharacterStore();
const { positionCharacter } = storeToRefs(characterStore);

import vertexShader from "@/src/shaders/vertex3.glsl";
import fragmentShader from "@/src/shaders/fragment3.glsl";
const loader = new TextureLoader();
const alphaMap = loader.load("/materials/grass/blade_alpha2.webp");
const rough = loader.load("/materials/grass/rough.webp");
rough.wrapS = RepeatWrapping;
rough.wrapT = RepeatWrapping;
rough.repeat.x = 35;
rough.repeat.y = 35;

const uniforms = {
  time: {
    value: 0,
  },
  uCharacterPosition: { value: new Vector3(0, 0, 0) },
  alphaMap: { value: alphaMap },
  hexColor: {
    value: new Vector3(
      new Color(color.value).r,
      new Color(color.value).g,
      new Color(color.value).b
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
const instanceNumber = 200000;
let dummy = new Object3D();
const geometry = new PlaneGeometry(0.1, 1, 1, 3);
geometry.translate(0, 0.5, 0);

let instancedMesh = new InstancedMesh(geometry, grassMaterial, instanceNumber);
instancedMesh.castShadow = false;
instancedMesh.receiveShadow = false;

const drawingCanvas = document.getElementById("drawing-canvas");
const drawStartPos = new Vector2();
const drawingContext = drawingCanvas?.getContext("2d");

const setupCanvasDrawing = (texture) => {
  drawingContext.fillStyle = "#FFFFFF";
  drawingContext.fillRect(0, 0, 160, 160);
  drawingContext.drawImage(texture, 0, 0, 160, 160);

  const newTexture = new CanvasTexture(drawingCanvas);
  let paint = false;
  drawingCanvas.addEventListener("pointerdown", (e) => {
    paint = true;
    drawStartPos.set(e.offsetX, e.offsetY);
  });

  drawingCanvas.addEventListener("pointermove", (e) => {
    if (paint) draw(drawingContext, e.offsetX, e.offsetY);
  });

  drawingCanvas.addEventListener("pointerup", () => {
    paint = false;
    setIntancesMesh(newTexture.source.data);
  });

  setIntancesMesh(newTexture.source.data);
};
const draw = (drawContext, x, y) => {
  drawContext.fillStyle = "#000000";
  drawContext.beginPath();
  drawContext.arc(x, y, 3, 0, 3 * Math.PI);
  drawContext.fill();
  drawContext.strokeStyle = "#000000";
  drawContext.beginPath();
  drawContext.moveTo(drawStartPos.x, drawStartPos.y);
  drawContext.lineTo(x, y);
  drawContext.stroke();
  drawStartPos.set(x, y);
};

loader.load("/materials/grass/perlin.webp", (texture) => {
  setupCanvasDrawing(texture.source.data);
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
  const canvas = document.getElementById("old-canvas");
  const context = canvas.getContext("2d");
  canvas.width = 160;
  canvas.height = 160;
  context.drawImage(data, 0, 0);
  const imageData = context.getImageData(0, 0, canvas.width, canvas.width);
  const pixels = imageData.data;
  const whitePercentage = calculatePixelPercentage(pixels, "#FFFFFF");
  console.log(whitePercentage);
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
      const x = (i / 4) % canvas.width;
      const z = Math.floor(i / 4 / canvas.width);
      validPositions.push({ x, z });
    }
  }
  console.log(newPercentInstanceNumber);
  for (let i = 0; i < newPercentInstanceNumber; i++) {
    const randomIndex = Math.floor(Math.random() * validPositions.length);
    const randomPosition = validPositions[randomIndex];
    dummy.position.set(
      randomPosition.x + Math.random() * 3.0 - 80,
      0,
      randomPosition.z - canvas.width / 2 + Math.random() * 3.0
    );

    dummy.scale.y = 0.6 + Math.random() * 0.7;
    dummy.scale.x = 6.0 + Math.random() * 0.4;
    dummy.scale.z = 6.0 + Math.random() * 0.4;
    dummy.rotation.y = Math.random() * 184;

    dummy.updateMatrix();
    instancedMesh.setMatrixAt(i, dummy.matrix);
  }
  oldModel = instancedMesh;
  scene.value.add(instancedMesh);
};

watch(color, (value) => {
  grassMaterial.uniforms.hexColor.value = new Vector3(
    new Color(value).r,
    new Color(value).g,
    new Color(value).b
  );
});

const newColor = ref(new Color(colorBackground.value));
watch(colorBackground, (value) => {
  newColor.value = new Color(value);
});
onLoop(({ _delta, elapsed }) => {
  grassMaterial.uniforms.time.value = elapsed;
  grassMaterial.uniformsNeedUpdate = true;
  if (positionCharacter.value) {
    grassMaterial.uniforms.uCharacterPosition.value = positionCharacter.value;
  }
});
</script>

<template>
  <Plane ref="planeRef" :args="[163, 163]" :position="[1, 0, 1]" receive-shadow>
    <TresMeshLambertMaterial :color="newColor" :map="rough" :roughness="1" />
  </Plane>
</template>
<style lang="scss">
#drawing-canvas {
  position: absolute;
  background-color: #000000;
  top: 20px;
  left: 0px;
  right: 0px;
  margin: 0 auto;
  z-index: 2;
  opacity: 1;
  cursor: crosshair;
  touch-action: none;
  width: 160px;
  height: 160px;
}
</style>
