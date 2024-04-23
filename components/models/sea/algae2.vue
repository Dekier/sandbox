<script setup lang="ts">
import {
  TextureLoader,
  ShaderMaterial,
  Vector3,
  Color,
  UniformsLib,
  DoubleSide,
  MeshLambertMaterial,
  InstancedMesh,
  Object3D,
  Vector2,
  Matrix4,
  DynamicDrawUsage,
  InstancedBufferGeometry,
  PlaneGeometry,
  InstancedBufferAttribute,
  RawShaderMaterial,
  Mesh,
  MeshNormalMaterial,
  RepeatWrapping,
  Quaternion,
} from "three";
import { Precipitation } from "@tresjs/cientos";
import vertexShader from "@/src/shaders/algae2/vertex.glsl";
import fragmentShader from "@/src/shaders/algae2/fragment.glsl";
const { newSetModel } = useModelSettings();
const storeGeneral = useGeneralStore();
const { scene, camera } = useTresContext();
const characterStore = useCharacterStore();
const storeControl = useControlsStore();
const { characterPosition } = storeToRefs(characterStore);
const { speed } = storeToRefs(storeControl);

// let geometry = new PlaneGeometry(1, 1, 1, 1);
// let uniforms = {
//   //   centerPosition: { value: new Vector3(0, 1, 0) },
//   //   maxDistance: { value: 10.0 },
//   //   offsetPosition: { value: 3.0 },
// };
// let material = new ShaderMaterial({
//   uniforms: uniforms,
//   vertexShader: vertexShader,
//   fragmentShader: fragmentShader,
//   side: DoubleSide,
// });

// const instanceMeshRef = shallowRef(null);
// watch(instanceMeshRef, (value) => {
//   if (!value) return;
//   dupa();
//   //   setMeshRock();
// });

//Variables for blade mesh
var joints = 4;
var bladeWidth = 0.06;
var bladeHeight = 0.5;

var width = 50;
var resolution = 64;
var delta = width / resolution;
var radius = 240;
var pos = new Vector2(0.01, 0.01);

var instances = 4000;

var elevation = 0.2;
var azimuth = 0.4;
var fogFade = 0.009;
var ambientStrength = 0.7;
var translucencyStrength = 1.5;
var specularStrength = 0.5;
var diffuseStrength = 1.5;
var shininess = 256;
var sunColour = new Vector3(1.0, 1.0, 1.0);
var specularColour = new Vector3(1.0, 1.0, 1.0);
var rotate = false;

var loader = new TextureLoader();
loader.crossOrigin = "";
var grassTexture = loader.load(
  "https://al-ro.github.io/images/grass/blade_diffuse.jpg"
);
var alphaMap = loader.load(
  "https://al-ro.github.io/images/grass/blade_alpha.jpg"
);
var noiseTexture = loader.load(
  "https://al-ro.github.io/images/grass/perlinFbm.jpg"
);
noiseTexture.wrapS = RepeatWrapping;
noiseTexture.wrapT = RepeatWrapping;

var sharedPrefix = `
uniform sampler2D noiseTexture;
float getYPosition(vec2 p){
	return 8.0*(2.0*texture2D(noiseTexture, p/800.0).r - 1.0);
}
`;
//************** Grass **************

//Define base geometry that will be instanced. We use a plane for an individual blade of grass
var grassBaseGeometry = new PlaneGeometry(bladeWidth, bladeHeight, 1, joints);
grassBaseGeometry.translate(0, bladeHeight / 2, 0);

//Define the bend of the grass blade as the combination of three quaternion rotations
let vertex = new Vector3();
let quaternion0 = new Quaternion();
let quaternion1 = new Quaternion();
let x, y, z, w, angle, sinAngle, rotationAxis;

//Rotate around Y
angle = 0.05;
sinAngle = Math.sin(angle / 2.0);
rotationAxis = new Vector3(0, 1, 0);
x = rotationAxis.x * sinAngle;
y = rotationAxis.y * sinAngle;
z = rotationAxis.z * sinAngle;
w = Math.cos(angle / 2.0);
quaternion0.set(x, y, z, w);

//Rotate around X
angle = 0.3;
sinAngle = Math.sin(angle / 2.0);
rotationAxis.set(1, 0, 0);
x = rotationAxis.x * sinAngle;
y = rotationAxis.y * sinAngle;
z = rotationAxis.z * sinAngle;
w = Math.cos(angle / 2.0);
quaternion1.set(x, y, z, w);

//Combine rotations to a single quaternion
quaternion0.multiply(quaternion1);

//Rotate around Z
angle = 0.1;
sinAngle = Math.sin(angle / 2.0);
rotationAxis.set(0, 0, 1);
x = rotationAxis.x * sinAngle;
y = rotationAxis.y * sinAngle;
z = rotationAxis.z * sinAngle;
w = Math.cos(angle / 2.0);
quaternion1.set(x, y, z, w);

//Combine rotations to a single quaternion
quaternion0.multiply(quaternion1);

let quaternion2 = new Quaternion();

//Bend grass base geometry for more organic look
for (
  let v = 0;
  v < grassBaseGeometry.attributes.position.array.length;
  v += 3
) {
  quaternion2.setFromAxisAngle(new Vector3(0, 1, 0), Math.PI / 2);
  vertex.x = grassBaseGeometry.attributes.position.array[v];
  vertex.y = grassBaseGeometry.attributes.position.array[v + 1];
  vertex.z = grassBaseGeometry.attributes.position.array[v + 2];
  let frac = vertex.y / bladeHeight;
  quaternion2.slerp(quaternion0, frac);
  vertex.applyQuaternion(quaternion2);
  grassBaseGeometry.attributes.position.array[v] = vertex.x;
  grassBaseGeometry.attributes.position.array[v + 1] = vertex.y;
  grassBaseGeometry.attributes.position.array[v + 2] = vertex.z;
}

grassBaseGeometry.computeVertexNormals();
var baseMaterial = new MeshNormalMaterial({ side: DoubleSide });
var baseBlade = new Mesh(grassBaseGeometry, baseMaterial);
//Show grass base geometry
//scene.add(baseBlade);

var instancedGeometry = new InstancedBufferGeometry();

instancedGeometry.index = grassBaseGeometry.index;
instancedGeometry.attributes.position = grassBaseGeometry.attributes.position;
instancedGeometry.attributes.uv = grassBaseGeometry.attributes.uv;
instancedGeometry.attributes.normal = grassBaseGeometry.attributes.normal;

// Each instance has its own data for position, orientation and scale
var indices = [];
var offsets = [];
var scales = [];
var halfRootAngles = [];

//For each instance of the grass blade
for (let i = 0; i < instances; i++) {
  indices.push(i / instances);

  //Offset of the roots
  x = Math.random() * width - width / 2;
  z = Math.random() * width - width / 2;
  y = 0;
  offsets.push(x, y, z);

  //Random orientation
  let angle = Math.PI - Math.random() * (2 * Math.PI);
  halfRootAngles.push(Math.sin(0.5 * angle), Math.cos(0.5 * angle));

  //Define variety in height
  if (i % 3 != 0) {
    scales.push(2.0 + Math.random() * 1.25);
  } else {
    scales.push(2.0 + Math.random());
  }
}

var offsetAttribute = new InstancedBufferAttribute(
  new Float32Array(offsets),
  3
);
var scaleAttribute = new InstancedBufferAttribute(new Float32Array(scales), 1);
var halfRootAngleAttribute = new InstancedBufferAttribute(
  new Float32Array(halfRootAngles),
  2
);
var indexAttribute = new InstancedBufferAttribute(new Float32Array(indices), 1);

instancedGeometry.setAttribute("offset", offsetAttribute);
instancedGeometry.setAttribute("scale", scaleAttribute);
instancedGeometry.setAttribute("halfRootAngle", halfRootAngleAttribute);
instancedGeometry.setAttribute("index", indexAttribute);

//Define the material, specifying attributes, uniforms, shaders etc.
var grassMaterial = new RawShaderMaterial({
  uniforms: {
    time: { value: 0 },
    delta: { value: delta },
    posX: { value: pos.x },
    posZ: { value: pos.y },
    radius: { value: radius },
    width: { value: width },
    map: { value: grassTexture },
    alphaMap: { value: alphaMap },
    noiseTexture: { value: noiseTexture },
    sunDirection: {
      value: new Vector3(
        Math.sin(azimuth),
        Math.sin(elevation),
        -Math.cos(azimuth)
      ),
    },
    cameraPosition: { value: camera.value.position },
    ambientStrength: { value: ambientStrength },
    translucencyStrength: { value: translucencyStrength },
    diffuseStrength: { value: diffuseStrength },
    specularStrength: { value: specularStrength },
    shininess: { value: shininess },
    lightColour: { value: sunColour },
    specularColour: { value: specularColour },
  },
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  side: DoubleSide,
});
var forward = false;
var backward = false;
var left = false;
var right = false;
var viewDirection = new Vector3();
var upVector = new Vector3(0, 1, 0);
function keyDown(e) {
  if (e.keyCode == 38 || e.keyCode == 40) {
    e.preventDefault();
  }
  if (e.keyCode == 87 || e.keyCode == 38) {
    forward = true;
  }
  if (e.keyCode == 83 || e.keyCode == 40) {
    backward = true;
  }
  if (e.keyCode == 65 || e.keyCode == 37) {
    left = true;
  }
  if (e.keyCode == 68 || e.keyCode == 39) {
    right = true;
  }
}

function keyUp(e) {
  if (e.keyCode == 87 || e.keyCode == 38) {
    forward = false;
  }
  if (e.keyCode == 83 || e.keyCode == 40) {
    backward = false;
  }
  if (e.keyCode == 65 || e.keyCode == 37) {
    left = false;
  }
  if (e.keyCode == 68 || e.keyCode == 39) {
    right = false;
  }
}

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);
var grass = new Mesh(instancedGeometry, grassMaterial);
scene.value.add(grass);
const move = (dT) => {
  camera.value.getWorldDirection(viewDirection);
  length = Math.sqrt(
    viewDirection.x * viewDirection.x + viewDirection.z * viewDirection.z
  );
  viewDirection.x /= length;
  viewDirection.z /= length;
  if (forward) {
    pos.x += dT * speed.value * viewDirection.x;
    pos.y += dT * speed.value * viewDirection.z;
  }
  if (backward) {
    pos.x -= dT * speed.value * viewDirection.x;
    pos.y -= dT * speed.value * viewDirection.z;
  }
  if (left) {
    var rightVector = cross(upVector, viewDirection);
    pos.x += dT * speed.value * rightVector.x;
    pos.y += dT * speed.value * rightVector.z;
  }
  if (right) {
    var rightVector = cross(upVector, viewDirection);
    pos.x -= dT * speed.value * rightVector.x;
    pos.y -= dT * speed.value * rightVector.z;
  }
  grassMaterial.uniforms.posX.value = pos.x;
  grassMaterial.uniforms.posZ.value = pos.y;
  grassMaterial.uniforms.radius.value = radius;
};
const { onLoop } = useRenderLoop();
onLoop(({ delta, elapsed }) => {
  move(delta);
  if (grassMaterial) {
    grassMaterial.uniforms.time.value = elapsed;
  }
});
</script>
<!-- 
<template>
  <TresInstancedMesh
    :castShadow="true"
    :receiveShadow="true"
    ref="instanceMeshRef"
    :args="[geometry, material, instances]"
  />
</template> -->
