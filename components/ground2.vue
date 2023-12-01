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

const leavesMaterial = new ShaderMaterial({
  uniforms,
  vertexShader,
  fragmentShader,
  side: DoubleSide,
  lights: true,
});
const instanceNumber = 90000;
let dummy = new Object3D();
const geometry = new PlaneGeometry(0.1, 1, 1, 4);
geometry.translate(0, 0.5, 0); // move grass blade geometry lowest point at 0.

let instancedMesh = new InstancedMesh(geometry, leavesMaterial, instanceNumber);
instancedMesh.castShadow = false;
instancedMesh.receiveShadow = false;

const noiseTexture = loader.load("/materials/grass/perlin.png", (texture) => {
  const material = new MeshBasicMaterial();
  let newTexture = null;
  const drawingCanvas = document.getElementById("drawing-canvas");
  const drawStartPos = new Vector2();
  const drawingContext = drawingCanvas?.getContext("2d");
  const setupCanvasDrawing = () => {
    drawingContext.fillStyle = "#FFFFFF";
    drawingContext.fillRect(0, 0, 130, 130);
    drawingContext.drawImage(texture.source.data, 0, 0, 130, 130);

    newTexture = new CanvasTexture(drawingCanvas);
    material.map = newTexture;
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

    drawingCanvas.addEventListener("pointerleave", () => {
      paint = false;
    });

    setIntancesMesh(newTexture.source.data);
  };

  const draw = (drawContext, x, y) => {
    drawContext.moveTo(drawStartPos.x, drawStartPos.y);
    drawContext.lineWidth = 7;
    drawContext.strokeStyle = "#000000";
    drawContext.lineTo(x, y);
    drawContext.stroke();
    drawStartPos.set(x, y);
    if (newTexture) {
      newTexture.needsUpdate = true;
    }
  };
  setupCanvasDrawing();
});

let oldModel = null;
const setIntancesMesh = (data) => {
  if (oldModel) {
    console.log(";dskjfhk");
    oldModel.geometry.dispose();
    oldModel.material.dispose();
    scene.value.remove(oldModel);

    dummy = new Object3D();
    instancedMesh = new InstancedMesh(geometry, leavesMaterial, instanceNumber);
  }
  const canvas = document.getElementById("old-canvas");
  const context = canvas.getContext("2d");
  canvas.width = 130;
  canvas.height = 130;
  context.drawImage(data, 0, 0);
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

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

  for (let i = 0; i < instanceNumber; i++) {
    const randomIndex = Math.floor(Math.random() * validPositions.length);
    const randomPosition = validPositions[randomIndex];
    dummy.position.set(
      randomPosition.x + Math.random() * 3.0 - 64.5,
      0,
      randomPosition.z + Math.random() * 3.0 - 47
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
  leavesMaterial.uniforms.hexColor.value = new Vector3(
    new Color(value).r,
    new Color(value).g,
    new Color(value).b
  );
});
onLoop(({ _delta, elapsed }) => {
  leavesMaterial.uniforms.time.value = elapsed;
  leavesMaterial.uniformsNeedUpdate = true;
  if (positionCharacter.value) {
    leavesMaterial.uniforms.uCharacterPosition.value = positionCharacter.value;
  }
});
const rough = loader.load("/materials/grass/rough.webp");
rough.wrapS = RepeatWrapping;
rough.wrapT = RepeatWrapping;
rough.repeat.x = 35;
rough.repeat.y = 35;
</script>

<template>
  <Plane
    ref="planeRef"
    :args="[130, 133]"
    :position="[0, 0, 19]"
    receive-shadow
  >
    <TresMeshLambertMaterial
      :color="new Color(colorBackground)"
      :map="rough"
      :roughness="1"
    />
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
  cursor: crosshair;
  touch-action: none;
  width: 130px;
  height: 130px;
}
</style>
