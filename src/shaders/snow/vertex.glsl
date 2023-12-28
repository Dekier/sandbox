varying vec2 vUv;
#include <common>
#include <shadowmap_pars_vertex>
uniform float time;
attribute vec3 offset;
uniform vec3 uCharacterPosition;
uniform sampler2D alphaMap;
varying vec3 vNormal;
varying vec3 vViewDir;


void main() {
    #include <beginnormal_vertex>
    #include <defaultnormal_vertex>

    #include <begin_vertex>

    #include <worldpos_vertex>
    #include <shadowmap_vertex>
    vUv = uv;
    float t = time * 2.;


    // VERTEX POSITION
    vec4 mvPosition = vec4(position, 1.0);
	// #ifdef USE_INSTANCING
    // 	mvPosition = instanceMatrix * mvPosition;
	// #endif




    vec4 modelPosition = modelMatrix * mvPosition;
     	
    if(texture2D(alphaMap, vUv).r > 0.5){
        modelPosition.y += 0.5;
    } 

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 clipPosition = projectionMatrix * viewPosition;

    vNormal = normalize(normalMatrix * normal);

    gl_Position = clipPosition;
}