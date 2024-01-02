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
} from "three";

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
const uniforms = {
  time: {
    value: 0,
  },
  uCharacterPosition: { value: new Vector3(0, 0, 0) },
  alphaMap: { value: alphaMap },
  hexColor: {
    value: new Vector3(
      new Color(color.value).r / 0.7,
      new Color(color.value).g / 0.7,
      new Color(color.value).b / 0.7
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
const instanceNumber = 70;
let dummy = new Object3D();
const { nodes } = await useGLTF("/models/fern.glb", { draco: true });
let instancedMesh = new InstancedMesh(
  nodes.fern.geometry,
  fernMaterial,
  instanceNumber
);
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
      nodes.fern.geometry,
      fernMaterial,
      newPercentInstanceNumber
    );
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
  for (let i = 0; i < newPercentInstanceNumber; i++) {
    const randomIndex = Math.floor(Math.random() * validPositions.length);
    const randomPosition = validPositions[randomIndex];
    dummy.position.set(
      randomPosition.x + Math.random() * 1.2 - 80,
      0.0,
      randomPosition.z - 160 / 2 + Math.random() * 1.2
    );
    dummy.rotation.y = Math.random() * 184;
    dummy.scale.y = 1.2 + Math.random() * 0.7;
    dummy.scale.x = 1.2 + Math.random() * 0.4;
    dummy.scale.z = 1.2 + Math.random() * 0.4;

    dummy.updateMatrix();
    instancedMesh.setMatrixAt(i, dummy.matrix);
  }
  oldModel = instancedMesh;
  scene.value.add(instancedMesh);
  instancedMesh.instanceMatrix.needsUpdate = true;
};

const newTexture = new CanvasTexture(drawingCanvas);
setIntancesMesh(newTexture.source.data);

watch(color, (value) => {
  fernMaterial.uniforms.hexColor.value = new Vector3(
    new Color(value).r,
    new Color(value).g,
    new Color(value).b
  );
});

onLoop(({ _delta, elapsed }) => {
  fernMaterial.uniforms.time.value = elapsed;
  fernMaterial.uniformsNeedUpdate = true;
  if (positionCharacter.value) {
    fernMaterial.uniforms.uCharacterPosition.value = positionCharacter.value;
  }
});

// :class="{
//           'Label__main-container--active': isActiveLabel,
//           'Label__main-container--gamepad': isActiveGamepad,
//           'Label__main-container--hide': isHideLabel,
//         }"
</script>

<!-- <template> -->
<!-- <primitive :object="instancedMesh"> -->
<!-- <Html center transform :distance-factor="5" :position="[0, 1, 0]" portal="">
      <div class="Label__main-container--active">
        <div class="Label__content">E</div>
      </div>
    </Html> -->
<!-- </primitive> -->
<!-- </template> -->
