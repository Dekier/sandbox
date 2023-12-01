<script setup lang="ts">
import {
  MeshBasicMaterial,
  Mesh,
  MeshStandardMaterial,
  TextureLoader,
  RepeatWrapping,
  Vector2,
  Vector3,
  NearestFilter,
  WebGLRenderTarget,
  PlaneGeometry,
  DoubleSide,
  BufferAttribute,
  ShaderMaterial,
  BufferGeometry,
  Matrix4,
  MeshPhongMaterial,
  InstancedBufferAttribute,
  Color,
  MeshNormalMaterial,
  Quaternion,
  RawShaderMaterial,
  InstancedBufferGeometry,
} from "three";

const { scene, renderer, camera } = useTresContext();

const storeControl = useControlsStore();
const characterStore = useCharacterStore();
const { positionCharacter } = storeToRefs(characterStore);

import grassVertexSource from "@/src/shaders/vertex2.glsl";
import grassFragmentSource from "@/src/shaders/fragment2.glsl";

// import skyVertexSource from "@/src/shaders/vertex-sky.glsl";
// import skyFragmentSource from "@/src/shaders/fragment-sky.glsl";

const { onLoop, resume } = useRenderLoop();

// //Sun
// //Height over horizon in range [0, PI/2.0]
const elevation = 0.2;
// //Rotation around Y axis in range [0, 2*PI]
const azimuth = 0.4;
const fogFade = 0.009;
const FOV = 45;
// const backgroundMaterial = new ShaderMaterial({
//   uniforms: {
//     sunDirection: {
//       value: new Vector3(
//         Math.sin(azimuth),
//         Math.sin(elevation),
//         -Math.cos(azimuth)
//       ),
//     },
//     cameraPos: { value: camera.value.position },
//     resolution: {
//       value: new Vector2(window.innerWidth, window.innerHeight),
//     },
//     fogFade: { value: fogFade },
//     fov: { value: FOV },
//   },
//   vertexShader: skyVertexSource,
//   fragmentShader: skyFragmentSource,
// });

// backgroundMaterial.depthWrite = false;
// const backgroundGeometry = new PlaneGeometry(100, 100, 1, 1);
// const background = new Mesh(backgroundGeometry, backgroundMaterial);
// // background.position.y = -40;
// scene.value.add(background);

const loader = new TextureLoader();
loader.crossOrigin = "";
const grassTexture = loader.load("/materials/grass/blade_diffuse2.jpg");
const alphaMap = loader.load("/materials/grass/blade_alpha.jpg");
const noiseTexture = loader.load("/materials/grass/perlinFbm.jpg");
noiseTexture.wrapS = RepeatWrapping;
noiseTexture.wrapT = RepeatWrapping;

//************** Ground **************
//Ground material is a modification of the existing MeshPhongMaterial rather than one from scratch
//Lighting variables for grass
const ambientStrength = 0.7;
const translucencyStrength = 1.5;
const specularStrength = 0.5;
const diffuseStrength = 1.5;
const shininess = 256;
const sunColour = new Vector3(1.0, 1.0, 1.0);
const specularColour = new Vector3(1.0, 1.0, 1.0);
//Number of blades
const instances = 400000;
//Variables for blade mesh
const joints = 4;
const bladeWidth = 0.06;
const bladeHeight = 0.25;
//Patch side length
const width = 100;
//Number of vertices on ground plane side
const resolution = 1;
//Distance between two ground plane vertices
const delta = width / resolution;
const pos = new Vector2(0.01, 0.01);
const radius = 240;
let groundShader: any = null;
const groundBaseGeometry = new PlaneGeometry(width, width, 1, 1);
groundBaseGeometry.lookAt(new Vector3(0, 1, 0));
groundBaseGeometry.verticesNeedUpdate = true;

const groundGeometry = new PlaneGeometry(width, width, 1, 1);
groundGeometry.setAttribute(
  "basePosition",
  groundBaseGeometry.getAttribute("position")
);
groundGeometry.lookAt(new Vector3(0, 1, 0));
groundGeometry.verticesNeedUpdate = true;
const groundMaterial = new MeshPhongMaterial({
  color: new Color("rgb(10%, 25%, 2%)"),
});

const groundVertexPrefix = ` 
attribute vec3 basePosition;
uniform float delta;
uniform float posX;
uniform float posZ;
uniform float radius;
uniform float width;

float placeOnSphere(vec3 v){
  float theta = acos(v.z/radius);
  float phi = acos(v.x/(radius * sin(theta)));
  float sV = radius * sin(theta) * sin(phi);
  //If undefined, set to default value
  if(sV != sV){
    sV = v.y;
  }
  return sV;
}

//Get the position of the ground from the [x,z] coordinates, the sphere and the noise height field
vec3 getPosition(vec3 pos, float epsX, float epsZ){
  vec3 temp;
  temp.x = pos.x + epsX;
  temp.z = pos.z + epsZ;
  // temp.y = max(0.0, placeOnSphere(temp)) - radius;
  // temp.y += getYPosition(vec2(basePosition.x+epsX+delta*floor(posX), basePosition.z+epsZ+delta*floor(posZ)));
  return temp;
}

//Find the normal at pos as the cross product of the central-differences in x and z directions
vec3 getNormal(vec3 pos){
  float eps = 1e-1;

  vec3 tempP = getPosition(pos, eps, 0.0);
  vec3 tempN = getPosition(pos, -eps, 0.0);
  
  vec3 slopeX = tempP - tempN;

  tempP = getPosition(pos, 0.0, eps);
  tempN = getPosition(pos, 0.0, -eps);

  vec3 slopeZ = tempP - tempN;

  vec3 norm = normalize(cross(slopeZ, slopeX));
  return norm;
}
`;

// groundMaterial.onBeforeCompile = (shader) => {
//   shader.uniforms.delta = { value: delta };
//   shader.uniforms.posX = { value: pos.x };
//   shader.uniforms.posZ = { value: pos.y };
//   shader.uniforms.radius = { value: radius };
//   shader.uniforms.width = { value: width };
//   shader.uniforms.noiseTexture = { value: noiseTexture };
//   shader.vertexShader = groundVertexPrefix + shader.vertexShader;
//   shader.vertexShader = shader.vertexShader.replace(
//     "#include <beginnormal_vertex>",
//     `//https://dev.to/maurobringolf/a-neat-trick-to-compute-modulo-of-negative-numbers-111e
// 			vec3 pos = vec3(0);
//       pos.x = basePosition.x - mod(mod((delta*posX),delta) + delta, delta);
//       pos.z = basePosition.z - mod(mod((delta*posZ),delta) + delta, delta);
//       // pos.y = max(0.0, placeOnSphere(pos)) - radius;
//       // pos.y += getYPosition(vec2(basePosition.x+delta*floor(posX), basePosition.z+delta*floor(posZ)));
//       vec3 objectNormal = getNormal(pos);
// #ifdef USE_TANGENT
//       vec3 objectTangent = vec3( tangent.xyz );
// #endif`
//   );
//   shader.vertexShader = shader.vertexShader.replace(
//     "#include <begin_vertex>",
//     `vec3 transformed = vec3(pos);`
//   );
//   groundShader = shader;
// };

// const ground = new Mesh(groundGeometry, groundMaterial);

// ground.geometry.computeVertexNormals();
// scene.value.add(ground);

const cross = (a, b) => {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
};

// ===============> GRASS <================

//Define base geometry that will be instanced. We use a plane for an individual blade of grass
const grassBaseGeometry = new PlaneGeometry(bladeWidth, bladeHeight, 1, joints);
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
angle = 0.6;
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

// grassBaseGeometry.computeVertexNormals();
// const baseMaterial = new MeshNormalMaterial({ side: DoubleSide });
// const baseBlade = new Mesh(grassBaseGeometry, baseMaterial);
// Show grass base geometry
// scene.value.add(baseBlade);

const instancedGeometry = new InstancedBufferGeometry();

instancedGeometry.index = grassBaseGeometry.index;
instancedGeometry.attributes.position = grassBaseGeometry.attributes.position;
instancedGeometry.attributes.uv = grassBaseGeometry.attributes.uv;
instancedGeometry.attributes.normal = grassBaseGeometry.attributes.normal;

// Each instance has its own data for position, orientation and scale
const indices = [];
const offsets = [];
const scales = [];
const halfRootAngles = [];

//For each instance of the grass blade
for (let i = 0; i < instances; i++) {
  indices.push(i / instances);

  //Offset of the roots
  x = Math.random() * width;
  z = Math.random() * width;
  y = 0;
  offsets.push(x, y, z);

  //Random orientation
  let angle = Math.PI - Math.random() * (2 * Math.PI);
  halfRootAngles.push(Math.sin(0.5 * angle), Math.cos(0.5 * angle));

  //Define constiety in height
  if (i % 3 != 0) {
    scales.push(2.0 + Math.random() * 1.45);
  } else {
    scales.push(2.0 + Math.random());
  }
}

const offsetAttribute = new InstancedBufferAttribute(
  new Float32Array(offsets),
  3
);
const scaleAttribute = new InstancedBufferAttribute(
  new Float32Array(scales),
  1
);
// const halfRootAngleAttribute = new InstancedBufferAttribute(
//   new Float32Array(halfRootAngles),
//   2
// );
const indexAttribute = new InstancedBufferAttribute(
  new Float32Array(indices),
  1
);
instancedGeometry.setAttribute("offset", offsetAttribute);
instancedGeometry.setAttribute("scale", scaleAttribute);
// instancedGeometry.setAttribute("halfRootAngle", halfRootAngleAttribute);
instancedGeometry.setAttribute("index", indexAttribute);

//Define the material, specifying attributes, uniforms, shaders etc.
const grassMaterial = new RawShaderMaterial({
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
  vertexShader: grassVertexSource,
  fragmentShader: grassFragmentSource,
  side: DoubleSide,
  wireframe: false,
});

const grass = new Mesh(instancedGeometry, grassMaterial);
scene.value.add(grass);

onLoop(({ delta, elapsed }) => {
  grassMaterial.uniforms.time.value = elapsed;
  if (camera.value?.position) {
    // grassMaterial.uniforms.cameraPosition.value = camera.value?.position;
    // backgroundMaterial.uniforms.cameraPos.value = camera.value?.position;
  }
});
</script>

<template></template>
