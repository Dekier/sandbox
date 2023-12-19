#include <common>
#include <packing>
#include <lights_pars_begin>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>

varying vec2 vUv;
uniform vec3 hexColor;
uniform vec3 hexColorRoads;
uniform sampler2D roughMap;
uniform sampler2D alphaMap;

varying vec3 vNormal;

void main() {

  vec2 repeatedUV = vUv * vec2(30.0, 30.0); 
  float alphaValue = texture2D(alphaMap, vUv).r;

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
  float lightIntensity = smoothstep(0.0, 0.71, NdotL * shadow);
  vec3 directionalLight = directionalLights[0].color * lightIntensity;
  vec3 baseColor = hexColor * 0.7;

  float existingRoughness = texture2D(roughMap, repeatedUV).r;
    // Adjust clarity based on roughness
  float clarity = 1.0 - existingRoughness;
  
  vec3 finalColor = mix(hexColorRoads, hexColor, alphaValue) * (2.0 - existingRoughness) + hexColor * existingRoughness * directionalLight;

  // Dodaj teksturę (jeśli używasz roughMap do tekstury)
  vec3 roughColor = texture2D(roughMap, repeatedUV).rgb;
  finalColor *= roughColor;

  gl_FragColor = vec4(finalColor, 1.0);
}