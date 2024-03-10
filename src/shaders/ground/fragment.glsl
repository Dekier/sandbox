#include <common>
#include <packing>
#include <lights_pars_begin>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
precision lowp float;

varying vec2 vUv;
uniform vec3 hexColor;
uniform sampler2D roughMap;

varying vec3 vNormal;

void main() {
  DirectionalLightShadow directionalShadow = directionalLightShadows[0];

  float shadow = getShadow(
    directionalShadowMap[0],
    directionalShadow.shadowMapSize ,
    directionalShadow.shadowBias,
    directionalShadow.shadowRadius,
    vDirectionalShadowCoord[0]
  );

  float NdotL = dot(vNormal, directionalLights[0].direction);
  float lightIntensity = smoothstep(0.0, 0.61, NdotL * shadow);
  vec3 directionalLight = directionalLights[0].color * lightIntensity;

    
  vec3 baseColor = hexColor * 0.20;
  vec3 shadowColor = hexColor * 0.27;

  vec3 finalColor = hexColor + baseColor * (ambientLightColor + directionalLight ) + shadowColor;

  vec3 toneMappedColor = toneMapping(finalColor);

  gl_FragColor = vec4(toneMappedColor, 1.0);
}