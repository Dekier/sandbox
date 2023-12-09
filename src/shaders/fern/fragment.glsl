#include <common>
#include <packing>
#include <lights_pars_begin>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>

varying vec2 vUv;
varying vec3 vNormal;
uniform sampler2D alphaMap;
uniform vec3 hexColor;


  void main() {
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
    float lightIntensity = smoothstep(-1.2, 0.1, NdotL * shadow);
    vec3 directionalLight = directionalLights[0].color * lightIntensity;
    
    if(texture2D(alphaMap, vUv).r < 0.5){
      discard;
    }

     // Sample roughness value from the existing roughness map
    float existingRoughness = texture2D(alphaMap, vUv).r;
    
    gl_FragColor = vec4(hexColor * existingRoughness * directionalLight , 1.0);
  }