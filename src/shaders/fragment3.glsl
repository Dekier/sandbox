#include <common>
#include <packing>
#include <lights_pars_begin>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;
varying vec2 vUv;
varying vec3 vNormal;
uniform sampler2D alphaMap;
uniform vec3 hexColor;

void main() {
    float clarity = vUv.y / 1.3;
    
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

    vec3 baseColor = hexColor * 0.6;
    vec3 shadowColor = hexColor * 1.5 * (vUv.y + 0.6);
    
    // Adjust clarity to control the brightness of the shadow
    vec3 finalColor = baseColor * (ambientLightColor + directionalLight) + shadowColor ;

    if(texture2D(alphaMap, vUv).r < 0.15){
        discard;
    }

    // Tonemapping
    vec3 toneMappedColor = toneMapping(finalColor);

    gl_FragColor = vec4(toneMappedColor, 1.0);
}