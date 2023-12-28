#include <common>
#include <packing>
#include <lights_pars_begin>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>

varying vec2 vUv;
uniform vec3 hexColor;
uniform sampler2D alphaMap;
uniform sampler2D colorMap;

varying vec3 vNormal;

void main() {

  vec2 repeatedUV = vUv * vec2(10.0, 10.0);

  DirectionalLightShadow directionalShadow = directionalLightShadows[0];

  // Calculate shadow
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
  vec3 baseColor = hexColor / 1.0;

    // Sample alpha value from the alpha map
    float alphaValue = texture2D(alphaMap, vUv).r;
  vec3 shadowColor = hexColor / 0.5;
    vec3 blackColor = shadowColor / 1.3;
    // Sample color value from the color map
    vec3 existingRoughness = texture2D(colorMap, repeatedUV).rgb;

    // Define start and end colors for smooth transition
    vec3 startColor = blackColor;  // Twój kolor dla obszarów z alpha równą 0.0
    vec3 endColor = baseColor * directionalLight * existingRoughness + shadowColor;

    // Wykorzystaj funkcję smoothstep do uzyskania łagodnego przejścia między kolorami
    vec3 finalColor = mix(startColor, endColor, smoothstep(0.0, 0.7, alphaValue));

    // Multiply by the color map to preserve existing color information
    finalColor *= existingRoughness;

    gl_FragColor = vec4(finalColor, 1.0);

    // Apply shadows and other fragments
    #include <tonemapping_fragment>
    #include <encodings_fragment>
    #include <fog_fragment>
    #include <premultiplied_alpha_fragment>
}