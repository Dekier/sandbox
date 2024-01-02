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

  // Poniżej dodano warunek logiczny do wyboru koloru światła kierunkowego
  vec3 directionalLightColor;
  // if (alphaValue > 0.5) {
  //   // Jeśli alphaValue jest większe niż 0.5, użyj koloru dla hexColorRoads
  //   directionalLightColor = directionalLights[0].color * smoothstep(0.2, 0.71, dot(vNormal, directionalLights[0].direction) * shadow);
  // } else {
  //   // W przeciwnym razie użyj koloru dla hexColor
  //   directionalLightColor = directionalLights[0].color * smoothstep(0.2, 0.71, dot(vNormal, directionalLights[0].direction) * shadow);
  // }
  directionalLightColor = directionalLights[0].color * smoothstep(0.2, 0.71, dot(vNormal, directionalLights[0].direction) * shadow);

  vec3 baseColor = hexColor;

  float existingRoughness = texture2D(roughMap, repeatedUV).r;
  
  vec3 finalColor = mix(hexColorRoads, hexColor, alphaValue) * (2.2 - existingRoughness) + baseColor * directionalLightColor;

  // Dodaj teksturę (jeśli używasz roughMap do tekstury)
  // vec3 roughColor = texture2D(roughMap, repeatedUV).rgb;
  // finalColor *= roughColor;

  gl_FragColor = vec4(finalColor, 1.0);
}