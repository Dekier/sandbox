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
const { colorFlower } = storeToRefs(storeGeneral);
const { scene, renderer, camera } = useTresContext();
const { onLoop, resume } = useRenderLoop();

const characterStore = useCharacterStore();
const { positionCharacter } = storeToRefs(characterStore);

import vertexShader from "@/src/shaders/flowers/vertex.glsl";
import fragmentShader from "@/src/shaders/flowers/fragment.glsl";
const loader = new TextureLoader();
const alphaMap = loader.load("/materials/flowers/alpha2.webp");

const uniforms = {
  time: {
    value: 0,
  },
  uCharacterPosition: { value: new Vector3(0, 0, 0) },
  alphaMap: { value: alphaMap },
  hexColor: {
    value: new Vector3(
      new Color(colorFlower.value).r,
      new Color(colorFlower.value).g,
      new Color(colorFlower.value).b
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
const instanceNumber = 50;
let dummy = new Object3D();
const geometry = new PlaneGeometry(0.1, 1, 1, 4);
geometry.translate(0, 0.5, 0);

const { nodes } = await useGLTF("/models/flowers.glb", { draco: true });
let instancedMesh = new InstancedMesh(
  nodes.flowers.geometry,
  grassMaterial,
  instanceNumber
);
instancedMesh.castShadow = false;
instancedMesh.receiveShadow = false;

const drawingCanvas = document.getElementById("drawing-canvas");
const drawStartPos = new Vector2();
const drawingContext = drawingCanvas?.getContext("2d");

const setupCanvasDrawing = (texture) => {
  drawingContext.fillStyle = "#FFFFFF";
  drawingContext.fillRect(0, 0, 130, 130);
  drawingContext.drawImage(texture, 0, 0, 130, 130);

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

loader.load("/materials/grass/perlin2.png", (texture) => {
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
  canvas.width = 130;
  canvas.height = 130;
  context.drawImage(data, 0, 0);
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
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
      const x = (i / 4) % canvas.width;
      const z = Math.floor(i / 4 / canvas.width);
      validPositions.push({ x, z });
    }
  }

  for (let i = 0; i < newPercentInstanceNumber; i++) {
    const randomIndex = Math.floor(Math.random() * validPositions.length);
    const randomPosition = validPositions[randomIndex];
    dummy.position.set(
      randomPosition.x + Math.random() * 3.0 - 64.5,
      0.0,
      randomPosition.z + Math.random() * 3.0 - 47
    );

    dummy.scale.y = 1.3 + Math.random() * 0.7;
    dummy.scale.x = 1.5 + Math.random() * 0.4;
    dummy.scale.z = 1.5 + Math.random() * 0.4;
    // dummy.rotation.y = Math.random() * 184;

    dummy.updateMatrix();
    instancedMesh.setMatrixAt(i, dummy.matrix);
  }
  oldModel = instancedMesh;
  scene.value.add(instancedMesh);
};

watch(colorFlower, (value) => {
  grassMaterial.uniforms.hexColor.value = new Vector3(
    new Color(value).r,
    new Color(value).g,
    new Color(value).b
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
