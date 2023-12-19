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
  DynamicDrawUsage,
  CanvasTexture,
  MeshPhongMaterial,
  MeshDistanceMaterial,
  BoxGeometry,
} from "three";
import { useCanvas } from "~/composables/useCanvas";
const { calculatePixelPercentage, draw } = useCanvas();
import vertexShaderShadow from "@/src/shaders/shadow/vertex.glsl";
import fragmentShaderShadow from "@/src/shaders/shadow/fragment.glsl";
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
const trawaMap = loader.load("/materials/grass/trawa.png");
const noisePerlin = loader.load("/materials/grass/perlinFbm.jpg");

const uniforms = {
  time: {
    value: 0,
  },
  uCharacterPosition: { value: new Vector3(0, 0, 0) },
  alphaMap: { value: alphaMap },
  noiseMap: { vlaue: noisePerlin },
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
const instanceNumber = 170000;
let dummy = new Object3D();
const geometry = new PlaneGeometry(0.1, 1, 1, 4);
geometry.translate(0, 0.5, 0);
// const lol = new MeshPhongMaterial({
//   alphaMap: alphaMap,
//   alphaTest: 0.3,
//   side: DoubleSide,
// });
let instancedMesh = new InstancedMesh(geometry, grassMaterial, instanceNumber);
instancedMesh.castShadow = false;
instancedMesh.receiveShadow = false;
// instancedMesh.instanceMatrix.setUsage(DynamicDrawUsage);
// instancedMesh.frustumCulled = false;
const grassDepthVertexShader = `
varying vec2 vUv;
void main(){
vUv=uv;
vec4 mvPosition=vec4(position,1.0);
mvPosition=instanceMatrix*mvPosition;
mvPosition=modelViewMatrix*mvPosition;
    gl_Position=projectionMatrix*mvPosition;
}
`;

const grassDepthFragmentShader = `
uniform sampler2D map;
  varying vec2 vUv;
  void main(){
  gl_FragColor=vec4(1.0);
  vec4 diffuse=texture2D(map,vUv);
  if(diffuse.a<0.5){ discard; }
      gl_FragColor=diffuse;
  }
  `;
instancedMesh.customDepthMaterial = new ShaderMaterial({
  uniforms: {
    map: { value: trawaMap },
  },
  vertexShader: grassDepthVertexShader,
  fragmentShader: grassDepthFragmentShader,
});
instancedMesh.customDepthMaterial = new MeshDepthMaterial({
  depthPacking: RGBADepthPacking,
  alphaTest: 0.1,
});

// const planeMesh = new Mesh(geometry, lol);
// planeMesh.position.set(10, 1, 10);
// planeMesh.scale.set(10, 5, 10);
// planeMesh.castShadow = true;
// planeMesh.receiveShadow = true;
// scene.value.add(planeMesh);

const uniformsShadow = {
  time: {
    value: 0,
  },
  alphaMap: { value: alphaMap },
  hexColor: {
    value: new Vector3(
      new Color(color.value).r,
      new Color(color.value).g,
      new Color(color.value).b
    ),
  },
};
// instancedMesh.customDepthMaterial = new ShaderMaterial({
//   uniforms: uniformsShadow,
//   vertexShader: vertexShaderShadow,
//   fragmentShader: fragmentShaderShadow,
// });

const drawingCanvas = document.getElementById("drawing-canvas");
const drawStartPos = new Vector2();
const drawingContext = drawingCanvas?.getContext("2d");

const setupCanvasDrawing = (texture) => {
  drawingContext.fillStyle = "#FFFFFF";
  drawingContext.fillRect(0, 0, 160, 160);
  drawingContext.drawImage(texture, 0, 0, 160, 160);

  const newTexture = new CanvasTexture(drawingCanvas);
  let paint = false;
  drawingCanvas?.addEventListener("pointerdown", (e) => {
    paint = true;
    drawStartPos.set(e.offsetX, e.offsetY);
  });

  drawingCanvas?.addEventListener("pointermove", (e) => {
    if (paint) draw(drawingContext, e.offsetX, e.offsetY, drawStartPos);
  });

  drawingCanvas?.addEventListener("pointerup", () => {
    paint = false;
    setIntancesMesh(newTexture.source.data);
  });

  setIntancesMesh(newTexture.source.data);
};

loader.load("/materials/grass/perlin.webp", (texture) => {
  setupCanvasDrawing(texture.source.data);
});

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
      0,
      randomPosition.z - 160 / 2 + Math.random() * 1.2
    );

    dummy.scale.y = 0.6 + Math.random() * 0.7;
    dummy.scale.x = 8.0 + Math.random() * 0.4;
    dummy.scale.z = 8.0 + Math.random() * 0.4;
    dummy.rotation.y = Math.random() * 184;
    // dummy.rotation.x = (Math.random() - 0.3) * 1.0;
    // dummy.rotation.z = (Math.random() - 0.3) * 1.0;

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

onLoop(({ _delta, elapsed }) => {
  grassMaterial.uniforms.time.value = elapsed;
  grassMaterial.uniformsNeedUpdate = true;
  if (positionCharacter.value) {
    grassMaterial.uniforms.uCharacterPosition.value = positionCharacter.value;
  }
});
</script>

<template></template>
