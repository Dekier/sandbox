precision mediump float;
attribute vec3 position;
attribute vec3 normal;
attribute vec3 offset;
attribute vec2 uv;
attribute vec2 halfRootAngle;
attribute float scale;
attribute float index;
uniform float time;
uniform sampler2D noiseTexture;

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
const float Blade_Height = 0.5;


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

float getYPosition(vec2 p){
	return 8.0*(2.0*texture2D(noiseTexture, p/800.0).r - 1.0);
}

void main() {

	//Vertex height in blade geometry
	// frc = position.y / float(Blade_Height);

	//Scale vertices
  vec3 vPosition = position;
	vPosition.y *= scale;

	//Invert scaling for normals
	// vNormal = normal;
	// vNormal.y /= scale;

	//Rotate blade around Y axis
  // vec4 direction = vec4(0.0, halfRootAngle.x, 0.0, halfRootAngle.y);
	// vPosition = rotateVectorByQuaternion(vPosition, direction);
	// vNormal = rotateVectorByQuaternion(vNormal, direction);

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
  // vec2 fractionalPos = 0.5 + offset.xz / width;
  //To make it seamless, make it a multiple of 2*PI
  // fractionalPos *= TWO_PI;

  //Wind is sine waves in time. 
  // float noise = 0.5 + 0.5 * sin(fractionalPos.x + time);
  // float halfAngle = -noise * 0.1;
  // noise = 0.5 + 0.5 * cos(fractionalPos.y + time);
  // halfAngle -= noise * 0.05;

	// direction = normalize(vec4(sin(halfAngle), 0.0, -sin(halfAngle), cos(halfAngle)));

	//Rotate blade and normals according to the wind
  // vPosition = rotateVectorByQuaternion(vPosition, direction);
	// vNormal = rotateVectorByQuaternion(vNormal, direction);

	//Move vertex to global location
	vPosition += pos;

	//Index of instance for varying colour in fragment shader
	idx = index;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);

}