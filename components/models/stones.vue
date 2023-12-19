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
  SphereGeometry,
  MeshLambertMaterial,
} from "three";

const storeGeneral = useGeneralStore();
const { scene, renderer, camera } = useTresContext();
const { onLoop, resume } = useRenderLoop();
const { color, colorStone } = storeToRefs(storeGeneral);

const characterStore = useCharacterStore();
const { positionCharacter } = storeToRefs(characterStore);

import vertexShader from "@/src/shaders/fern/vertex.glsl";
import fragmentShader from "@/src/shaders/fern/fragment.glsl";
const loader = new TextureLoader();
const alphaMap = loader.load("/materials/flowers/fern.png");

const stoneMaterial = new MeshLambertMaterial({
  color: new Color("#787878"),
});
const instanceNumber = 40;
let dummy = new Object3D();
const { nodes } = await useGLTF("/models/stones.glb", { draco: true });
const geometry1 = nodes.stone1.geometry;
const geometry2 = nodes.stone2.geometry;
const geometry3 = nodes.stone3.geometry;
const geometry4 = nodes.stone4.geometry;
let instancedMesh = new InstancedMesh(geometry1, stoneMaterial, instanceNumber);
instancedMesh.castShadow = true;
instancedMesh.receiveShadow = true;

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
  const imageData = drawingContext.getImageData(0, 0, 160, 160);
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
      geometry1,
      stoneMaterial,
      newPercentInstanceNumber
    );
    instancedMesh.castShadow = true;
    instancedMesh.receiveShadow = true;
  }

  const threshold = 0.3;
  const validPositions = [];
  for (let i = 0; i < pixels.length; i += 4) {
    const pixelValue = (pixels[i] / 255.0 - 0.5) * 2.0;

    if (pixelValue > threshold) {
      const x = (i / 4) % 160;
      const z = Math.floor(i / 4 / 160);
      validPositions.push({ x, z });
    }
  }
  const geometries = [geometry1, geometry2, geometry3, geometry4];
  for (let i = 0; i < newPercentInstanceNumber; i++) {
    const randomGeometryIndex = Math.floor(Math.random() * geometries.length);
    const randomGeometry = geometries[randomGeometryIndex];

    const randomIndex = Math.floor(Math.random() * validPositions.length);
    const randomPosition = validPositions[randomIndex];
    dummy.position.set(
      randomPosition.x + Math.random() * 1.2 - 80,
      -0.5,
      randomPosition.z - 160 / 2 + Math.random() * 1.2
    );
    dummy.rotation.y = Math.random() * 184;
    dummy.scale.y = 1.0 + Math.random() * 0.7;
    dummy.scale.x = 1.0 + Math.random() * 0.4;
    dummy.scale.z = 1.0 + Math.random() * 0.4;

    dummy.updateMatrix();
    instancedMesh.setMatrixAt(i, dummy.matrix);
    instancedMesh.instanceMatrix.needsUpdate = true;
    instancedMesh.geometry.attributes.position.copy(
      randomGeometry.attributes.position
    );
    instancedMesh.geometry.attributes.normal.copy(
      randomGeometry.attributes.normal
    );
    // instancedMesh.geometry.attributes.uv.copy(randomGeometry.attributes.uv);
    // instancedMesh.geometry.index.copy(randomGeometry.index);
    // instancedMesh.geometry.computeVertexNormals();
    // instancedMesh.geometry.computeBoundingBox();
    // instancedMesh.geometry.computeBoundingSphere();

    // const dotX = dummy.position.x + 80;
    // const dotZ = dummy.position.z + 80;
    // drawingContext.fillStyle = "#000000";
    // drawingContext.beginPath();
    // drawingContext.arc(dotX, dotZ, 3, 0, 2 * Math.PI);
    // drawingContext.fill();
  }
  oldModel = instancedMesh;
  scene.value.add(instancedMesh);
};

watch(colorStone, (value) => {
  stoneMaterial.color = new Color(value);
});
</script>

<template></template>
