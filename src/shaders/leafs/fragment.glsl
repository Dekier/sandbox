#include <common>
#include <packing>
#include <lights_pars_begin>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>

varying vec2 vUv;
uniform vec3 hexColor;
uniform sampler2D alphaMap;

varying vec3 vNormal;

void main() {
    float clarity = vUv.y / 1.0;
    
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
    float lightIntensity = smoothstep(0.0, 0.61, NdotL * shadow);
    vec3 directionalLight = directionalLights[0].color * lightIntensity;

    vec3 baseColor = hexColor * 0.6 ;
    vec3 shadowColor = hexColor * 1.5 ;
    
    // Adjust clarity to control the brightness of the shadow
    vec3 finalColor = baseColor * (ambientLightColor + directionalLight) + shadowColor ;

    if(texture2D(alphaMap, vUv).r < 0.15){
        discard;
    }

    gl_FragColor = vec4(finalColor, 1.0);
}