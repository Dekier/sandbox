//Based on:
//"Realistic real-time grass rendering" by Eddie Lee, 2010
//https://www.eddietree.com/grass
//https://en.wikibooks.org/wiki/GLSL_Programming/Unity/Translucent_Surfaces

//There are two scenes: one for the sky/sun and another for the grass. The sky is rendered without depth information on a plane geometry that fills the screen. Automatic clearing is disabled and after the sky has been rendered, we draw the grass scene on top of the background. Both scenes share a camera and light direction information.

var canvas = document.getElementById("canvas");

const mobile =
  navigator.userAgent.match(/Android/i) ||
  navigator.userAgent.match(/webOS/i) ||
  navigator.userAgent.match(/iPhone/i) ||
  navigator.userAgent.match(/BlackBerry/i) ||
  navigator.userAgent.match(/Windows Phone/i);

//Variables for blade mesh
var joints = 4;
var bladeWidth = 0.12;
var bladeHeight = 1;

//Patch side length
var width = 50;
//Number of vertices on ground plane side
var resolution = 64;
//Distance between two ground plane vertices
var delta = width / resolution;
//Radius of the sphere onto which the ground plane is bent
var radius = 240;
//User movement speed
var speed = 3;

//The global coordinates
//The geometry never leaves a box of width*width around (0, 0)
//But we track where in space the camera would be globally
var pos = new THREE.Vector2(0.01, 0.01);

//Number of blades
var instances = 4000;
if (mobile) {
  instances = 7000;
  width = 50;
}

//Sun
//Height over horizon in range [0, PI/2.0]
var elevation = 0.2;
//Rotation around Y axis in range [0, 2*PI]
var azimuth = 0.4;

var fogFade = 0.009;

//Lighting variables for grass
var ambientStrength = 0.7;
var translucencyStrength = 1.5;
var specularStrength = 0.5;
var diffuseStrength = 1.5;
var shininess = 256;
var sunColour = new THREE.Vector3(1.0, 1.0, 1.0);
var specularColour = new THREE.Vector3(1.0, 1.0, 1.0);

//Camera rotate
var rotate = false;

//Initialise three.js. There are two scenes which are drawn after one another with clear() called manually at the start of each frame
//Grass scene
var scene = new THREE.Scene();
//Sky scene
var backgroundScene = new THREE.Scene();

var renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas });
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

//Camera
var distance = 1500;

var FOV = 45; //2 * Math.atan(window.innerHeight / distance) * 180 / Math.PI;
var camera = new THREE.PerspectiveCamera(
  FOV,
  window.innerWidth / window.innerHeight,
  1,
  20000
);

camera.position.set(-30, 5, 30);
camera.lookAt(new THREE.Vector3(0, 0, 0));

scene.add(camera);
backgroundScene.add(camera);

//Light for ground plane
var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

//OrbitControls.js for camera manipulation
var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.autoRotate = rotate;
controls.autoRotateSpeed = 1.0;
controls.maxDistance = 65.0;
if (mobile) {
  controls.maxDistance = 35.0;
}
controls.minDistance = 5.0;
//Disable keys to stop arrow keys from moving the camera
controls.enableKeys = false;
controls.enablePan = false;
controls.update();

const stats = new Stats();
stats.showPanel(0);
stats.domElement.style.position = "absolute";
stats.domElement.style.right = "0px";
stats.domElement.style.bottom = "0px";
document.body.appendChild(stats.domElement);

window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  renderer.setSize(window.innerWidth, window.innerHeight);
  backgroundMaterial.uniforms.resolution.value = new THREE.Vector2(
    canvas.width,
    canvas.height
  );
  camera.fov = FOV;
  camera.updateProjectionMatrix();
  backgroundMaterial.uniforms.fov.value = FOV;
}

//Get alpha map and blade texture
//These have been taken from "https://cdn.skypack.dev/Realistic real-time grass rendering" by Eddie Lee, 2010
var loader = new THREE.TextureLoader();
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
noiseTexture.wrapS = THREE.RepeatWrapping;
noiseTexture.wrapT = THREE.RepeatWrapping;

var sharedPrefix = `
uniform sampler2D noiseTexture;
float getYPosition(vec2 p){
	return 8.0*(2.0*texture2D(noiseTexture, p/800.0).r - 1.0);
}
`;

//************** Grass **************
var grassVertexSource =
  sharedPrefix +
  `
precision mediump float;
attribute vec3 position;
attribute vec3 normal;
attribute vec3 offset;
attribute vec2 uv;
attribute vec2 halfRootAngle;
attribute float scale;
attribute float index;
uniform float time;

uniform float delta;
uniform float posX;
uniform float posZ;
uniform float radius;
uniform float width;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying float frc;
varying float idx;

const float PI = 3.1415;
const float TWO_PI = 2.0 * PI;


//https://www.geeks3d.com/20141201/how-to-rotate-a-vertex-by-a-quaternion-in-glsl/
vec3 rotateVectorByQuaternion(vec3 v, vec4 q){
  return 2.0 * cross(q.xyz, v * q.w + cross(q.xyz, v)) + v;
}

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

void main() {

	//Vertex height in blade geometry
	frc = position.y / float(` +
  bladeHeight +
  `);

	//Scale vertices
  vec3 vPosition = position;
	vPosition.y *= scale;

	//Invert scaling for normals
	vNormal = normal;
	vNormal.y /= scale;

	//Rotate blade around Y axis
  vec4 direction = vec4(0.0, halfRootAngle.x, 0.0, halfRootAngle.y);
	vPosition = rotateVectorByQuaternion(vPosition, direction);
	vNormal = rotateVectorByQuaternion(vNormal, direction);

  //UV for texture
  vUv = uv;

	vec3 pos;
	vec3 globalPos;
	vec3 tile;

	globalPos.x = offset.x-posX*delta;
	globalPos.z = offset.z-posZ*delta;

	tile.x = floor((globalPos.x + 0.5 * width) / width);
	tile.z = floor((globalPos.z + 0.5 * width) / width);

	pos.x = globalPos.x - tile.x * width;
	pos.z = globalPos.z - tile.z * width;

	pos.y = max(0.0, placeOnSphere(pos)) - radius;
	pos.y += getYPosition(vec2(pos.x+delta*posX, pos.z+delta*posZ));
	
	//Position of the blade in the visible patch [0->1]
  vec2 fractionalPos = 0.5 + offset.xz / width;
  //To make it seamless, make it a multiple of 2*PI
  fractionalPos *= TWO_PI;

  //Wind is sine waves in time. 
  float noise = 0.5 + 0.5 * sin(fractionalPos.x + time);
  float halfAngle = -noise * 0.1;
  noise = 0.5 + 0.5 * cos(fractionalPos.y + time);
  halfAngle -= noise * 0.05;

	direction = normalize(vec4(sin(halfAngle), 0.0, -sin(halfAngle), cos(halfAngle)));

	//Rotate blade and normals according to the wind
  vPosition = rotateVectorByQuaternion(vPosition, direction);
	vNormal = rotateVectorByQuaternion(vNormal, direction);

	//Move vertex to global location
	vPosition += pos;

	//Index of instance for varying colour in fragment shader
	idx = index;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);

}`;

var grassFragmentSource = `
precision mediump float;

uniform vec3 cameraPosition;

//Light uniforms
uniform float ambientStrength;
uniform float diffuseStrength;
uniform float specularStrength;
uniform float translucencyStrength;
uniform float shininess;
uniform vec3 lightColour;
uniform vec3 sunDirection;


//Surface uniforms
uniform sampler2D map;
uniform sampler2D alphaMap;
uniform vec3 specularColour;

varying float frc;
varying float idx;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

vec3 ACESFilm(vec3 x){
	float a = 2.51;
	float b = 0.03;
	float c = 2.43;
	float d = 0.59;
	float e = 0.14;
	return clamp((x*(a*x+b))/(x*(c*x+d)+e), 0.0, 1.0);
}

void main() {

  //If transparent, don't draw
  if(texture2D(alphaMap, vUv).r < 0.15){
    discard;
  }

	vec3 normal;

	//Flip normals when viewing reverse of the blade
	if(gl_FrontFacing){
		normal = normalize(vNormal);
	}else{
		normal = normalize(-vNormal);
	}

  //Get colour data from texture
	vec3 textureColour = pow(texture2D(map, vUv).rgb, vec3(2.2));

  //Add different green tones towards root
	vec3 mixColour = idx > 0.75 ? vec3(0.2, 0.8, 0.06) : vec3(0.5, 0.8, 0.08);
  textureColour = mix(0.1 * mixColour, textureColour, 0.75);

	vec3 lightTimesTexture = lightColour * textureColour;
  vec3 ambient = textureColour;
	vec3 lightDir = normalize(sunDirection);

  //How much a fragment faces the light
	float dotNormalLight = dot(normal, lightDir);
  float diff = max(dotNormalLight, 0.0);

  //Colour when lit by light
  vec3 diffuse = diff * lightTimesTexture;

  float sky = max(dot(normal, vec3(0, 1, 0)), 0.0);
	vec3 skyLight = sky * vec3(0.12, 0.29, 0.55);

  vec3 viewDirection = normalize(cameraPosition - vPosition);
  vec3 halfwayDir = normalize(lightDir + viewDirection);
  //How much a fragment directly reflects the light to the camera
  float spec = pow(max(dot(normal, halfwayDir), 0.0), shininess);
  
  //Colour of light sharply reflected into the camera
  vec3 specular = spec * specularColour * lightColour;

	//https://en.wikibooks.org/wiki/GLSL_Programming/Unity/Translucent_Surfaces
	vec3 diffuseTranslucency = vec3(0);
	vec3 forwardTranslucency = vec3(0);
	float dotViewLight = dot(-lightDir, viewDirection);
	if(dotNormalLight <= 0.0){
		diffuseTranslucency = lightTimesTexture * translucencyStrength * -dotNormalLight;
		if(dotViewLight > 0.0){
			forwardTranslucency = lightTimesTexture * translucencyStrength * pow(dotViewLight, 16.0);
		}
	}

  vec3 col = 0.3 * skyLight * textureColour + ambientStrength * ambient + diffuseStrength * diffuse + specularStrength * specular + diffuseTranslucency + forwardTranslucency;

	//Add a shadow towards root
	col = mix(0.35*vec3(0.1, 0.25, 0.02), col, frc);
	
  //Tonemapping
  col = ACESFilm(col);

  //Gamma correction 1.0/2.2 = 0.4545...
	col = pow(col, vec3(0.4545));

  gl_FragColor = vec4(col, 1.0);
}`;

//Define base geometry that will be instanced. We use a plane for an individual blade of grass
var grassBaseGeometry = new THREE.PlaneGeometry(
  bladeWidth,
  bladeHeight,
  1,
  joints
);
grassBaseGeometry.translate(0, bladeHeight / 2, 0);

//Define the bend of the grass blade as the combination of three quaternion rotations
let vertex = new THREE.Vector3();
let quaternion0 = new THREE.Quaternion();
let quaternion1 = new THREE.Quaternion();
let x, y, z, w, angle, sinAngle, rotationAxis;

//Rotate around Y
angle = 0.05;
sinAngle = Math.sin(angle / 2.0);
rotationAxis = new THREE.Vector3(0, 1, 0);
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

let quaternion2 = new THREE.Quaternion();

//Bend grass base geometry for more organic look
for (
  let v = 0;
  v < grassBaseGeometry.attributes.position.array.length;
  v += 3
) {
  quaternion2.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
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
var baseMaterial = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });
var baseBlade = new THREE.Mesh(grassBaseGeometry, baseMaterial);
//Show grass base geometry
//scene.add(baseBlade);

var instancedGeometry = new THREE.InstancedBufferGeometry();

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

var offsetAttribute = new THREE.InstancedBufferAttribute(
  new Float32Array(offsets),
  3
);
var scaleAttribute = new THREE.InstancedBufferAttribute(
  new Float32Array(scales),
  1
);
var halfRootAngleAttribute = new THREE.InstancedBufferAttribute(
  new Float32Array(halfRootAngles),
  2
);
var indexAttribute = new THREE.InstancedBufferAttribute(
  new Float32Array(indices),
  1
);

instancedGeometry.setAttribute("offset", offsetAttribute);
instancedGeometry.setAttribute("scale", scaleAttribute);
instancedGeometry.setAttribute("halfRootAngle", halfRootAngleAttribute);
instancedGeometry.setAttribute("index", indexAttribute);

//Define the material, specifying attributes, uniforms, shaders etc.
var grassMaterial = new THREE.RawShaderMaterial({
  uniforms: {
    time: { type: "float", value: 0 },
    delta: { type: "float", value: delta },
    posX: { type: "float", value: pos.x },
    posZ: { type: "float", value: pos.y },
    radius: { type: "float", value: radius },
    width: { type: "float", value: width },
    map: { value: grassTexture },
    alphaMap: { value: alphaMap },
    noiseTexture: { value: noiseTexture },
    sunDirection: {
      type: "vec3",
      value: new THREE.Vector3(
        Math.sin(azimuth),
        Math.sin(elevation),
        -Math.cos(azimuth)
      ),
    },
    cameraPosition: { type: "vec3", value: camera.position },
    ambientStrength: { type: "float", value: ambientStrength },
    translucencyStrength: { type: "float", value: translucencyStrength },
    diffuseStrength: { type: "float", value: diffuseStrength },
    specularStrength: { type: "float", value: specularStrength },
    shininess: { type: "float", value: shininess },
    lightColour: { type: "vec3", value: sunColour },
    specularColour: { type: "vec3", value: specularColour },
  },
  vertexShader: grassVertexSource,
  fragmentShader: grassFragmentSource,
  side: THREE.DoubleSide,
});

var grass = new THREE.Mesh(instancedGeometry, grassMaterial);
scene.add(grass);

//************** User movement **************
var forward = false;
var backward = false;
var left = false;
var right = false;
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

function cross(a, b) {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
}

var viewDirection = new THREE.Vector3();
var upVector = new THREE.Vector3(0, 1, 0);

//Find the height of the spherical world at given x,z position
function placeOnSphere(v) {
  let theta = Math.acos(v.z / radius);
  let phi = Math.acos(v.x / (radius * Math.sin(theta)));
  let sV = radius * Math.sin(theta) * Math.sin(phi);
  //If undefined, set to default value
  if (sV != sV) {
    sV = v.y;
  }
  return sV;
}

function move(dT) {
  camera.getWorldDirection(viewDirection);
  length = Math.sqrt(
    viewDirection.x * viewDirection.x + viewDirection.z * viewDirection.z
  );
  viewDirection.x /= length;
  viewDirection.z /= length;
  if (forward) {
    pos.x += dT * speed * viewDirection.x;
    pos.y += dT * speed * viewDirection.z;
  }
  if (backward) {
    pos.x -= dT * speed * viewDirection.x;
    pos.y -= dT * speed * viewDirection.z;
  }
  if (left) {
    var rightVector = cross(upVector, viewDirection);
    pos.x += dT * speed * rightVector.x;
    pos.y += dT * speed * rightVector.z;
  }
  if (right) {
    var rightVector = cross(upVector, viewDirection);
    pos.x -= dT * speed * rightVector.x;
    pos.y -= dT * speed * rightVector.z;
  }
  grassMaterial.uniforms.posX.value = pos.x;
  grassMaterial.uniforms.posZ.value = pos.y;
  grassMaterial.uniforms.radius.value = radius;
}

//************** Draw **************
var time = 0;
var lastFrame = Date.now();
var thisFrame;
var dT = 0;

function draw() {
  stats.begin();

  //Update time
  thisFrame = Date.now();
  dT = (thisFrame - lastFrame) / 200.0;
  time += dT;
  move(dT);
  lastFrame = thisFrame;

  grassMaterial.uniforms.time.value = time;

  renderer.clear();
  renderer.render(backgroundScene, camera);
  renderer.render(scene, camera);

  if (rotate) {
    controls.update();
  }
  stats.end();
  requestAnimationFrame(draw);
}

draw();
