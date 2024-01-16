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

  // vec2 repeatedUV = vUv * vec2(10.0, 30.0); 
  vec2 repeatedUV = vUv * vec2(2.0, 2.0);

  DirectionalLightShadow directionalShadow = directionalLightShadows[0];

  float shadow = getShadow(
    directionalShadowMap[0],
    directionalShadow.shadowMapSize ,
    directionalShadow.shadowBias + 0.0002,
    directionalShadow.shadowRadius,
    vDirectionalShadowCoord[0]
  );

 
  // Poniżej dodano warunek logiczny do wyboru koloru światła kierunkowego
  vec3 directionalLightColor = directionalLights[0].color * smoothstep(0.28, 0.60, dot(vNormal, directionalLights[0].direction) * shadow);

  // Modyfikacja koloru cienia (shadow color) - można dostosować wartość 1.0, aby uzyskać pożądany efekt
    vec3 shadowColor = hexColor * 0.2;

  vec3 baseColor = hexColor;

  // Mieszanie koloru cienia z kolorami ostatecznymi
  vec3 finalColor = hexColor + baseColor * (ambientLightColor + directionalLightColor ) + shadowColor;

  // Tonemapping
  vec3 toneMappedColor = toneMapping(finalColor);

  gl_FragColor = vec4(toneMappedColor, 1.0);
}



// #include <common>
// #include <packing>
// #include <lights_pars_begin>
// #include <shadowmap_pars_fragment>
// #include <shadowmask_pars_fragment>

// varying vec2 vUv;
// uniform vec3 hexColor;
// uniform vec3 hexColorRoads;
// uniform sampler2D roughMap;
// uniform sampler2D alphaMap;

// varying vec3 vNormal;

// void main() {

//   // vec2 repeatedUV = vUv * vec2(10.0, 30.0); 
//   vec2 repeatedUV = vUv * vec2(2.0, 2.0);
//   float alphaValue = texture2D(alphaMap, vUv).r;

//   DirectionalLightShadow directionalShadow = directionalLightShadows[0];

//   float shadow = getShadow(
//     directionalShadowMap[0],
//     directionalShadow.shadowMapSize,
//     directionalShadow.shadowBias,
//     directionalShadow.shadowRadius,
//     vDirectionalShadowCoord[0]
//   );

//   // Poniżej dodano warunek logiczny do wyboru koloru światła kierunkowego
//   vec3 directionalLightColor;
//   directionalLightColor = directionalLights[0].color * smoothstep(0.26, 0.`60, dot(vNormal, directionalLights[0].direction) * shadow);

//   vec3 baseColor = hexColor;

//   float existingRoughness = texture2D(roughMap, repeatedUV).r * 0.8;
  
//   // vec3 finalColor = mix(hexColorRoads, hexColor, alphaValue) * (2.2 - existingRoughness) + baseColor * directionalLightColor;

//   // Tonemapping
//   vec3 toneMappedColor = toneMapping(finalColor);

//   gl_FragColor = vec4(toneMappedColor, 1.0);
// }