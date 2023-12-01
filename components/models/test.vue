<script setup lang="ts">
import { useGLTF, CustomShaderMaterial } from "@tresjs/cientos";
import {
  ShaderMaterial,
  Color,
  UniformsLib,
  Mesh,
  SphereGeometry,
  AmbientLight,
  TorusGeometry,
  PlaneGeometry,
  DoubleSide,
  TextureLoader,
} from "three";
import { useModelSettings } from "~/composables/useModel";
const params = {
  color: "#90826f",
};

const { onLoop } = useRenderLoop();

const vertexShader = `
varying vec2 vUv;
#include <common>
#include <shadowmap_pars_vertex>

varying vec3 vNormal;
varying vec3 vViewDir;
void main() {
    #include <beginnormal_vertex>
    #include <defaultnormal_vertex>

    #include <begin_vertex>

    #include <worldpos_vertex>
    #include <shadowmap_vertex>

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 clipPosition = projectionMatrix * viewPosition;

    vNormal = normalize(normalMatrix * normal);

    gl_Position = clipPosition;
}
`;

const fragmentShader = `
  #include <common>
  #include <packing>
  #include <lights_pars_begin>
  #include <shadowmap_pars_fragment>
  #include <shadowmask_pars_fragment>

  uniform vec3 uColor;
  uniform sampler2D alphaMap;

  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    // shadow map
    DirectionalLightShadow directionalShadow = directionalLightShadows[0];

    float shadow = getShadow(
      directionalShadowMap[0],
      directionalShadow.shadowMapSize,
      directionalShadow.shadowBias,
      directionalShadow.shadowRadius,
      vDirectionalShadowCoord[0]
    );

    // directional light
    float NdotL = dot(vNormal, directionalLights[0].direction);
    float lightIntensity = smoothstep(-2.0, 1.01, NdotL * shadow);
    vec3 directionalLight = directionalLights[0].color * lightIntensity;
    float clarity = vUv.y * 1.0 + 0.5;
    if(texture2D(alphaMap, vUv).r < 0.15){
      discard;
    }
    gl_FragColor = vec4(uColor * clarity * directionalLight , 1.0);
  }
`;

const loader = new TextureLoader();
const alphaMap = loader.load("/materials/grass/blade_alpha2.webp");
const sphereGeometry = new SphereGeometry(1, 32, 32);
const uniforms = {
  uColor: { value: new Color(params.color) },
  alphaMap: { value: alphaMap },
};
const shaderMaterial = new ShaderMaterial({
  lights: true,
  uniforms: { ...UniformsLib.lights, ...uniforms },
  vertexShader,
  fragmentShader,
  side: DoubleSide,
});
const sphere = new Mesh(sphereGeometry, shaderMaterial);
sphere.position.z = 17;
sphere.position.x = -1;
sphere.position.y = 0.5;
sphere.scale.x = 0.5;
sphere.scale.y = 0.5;
sphere.scale.z = 0.5;
sphere.castShadow = true;

const planeGeometry = new PlaneGeometry(2, 2, 1, 4);
const plane = new Mesh(planeGeometry, shaderMaterial);
plane.position.z = 17;
plane.position.x = 1;
plane.position.y = 0.5;
plane.scale.x = 0.5;
plane.scale.y = 0.5;
plane.scale.z = 0.5;
plane.castShadow = true;
const { scene } = useTresContext();

const ambientLight = new AmbientLight("#ffffff", 1);

onMounted(async () => {
  await nextTick();
  scene.value.add(sphere, plane);
  onLoop(() => {});
});
</script>

<template></template>
