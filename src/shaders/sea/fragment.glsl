#include <common>
#include <packing>
#include <fog_pars_fragment>

varying vec2 vUv;
uniform sampler2D tDepth;
uniform sampler2D tDudv;
uniform vec3 waterColor;
uniform vec3 foamColor;
uniform float cameraNear;
uniform float cameraFar;
uniform float time;
uniform float threshold;
uniform vec2 resolution;

float getDepth( const in vec2 screenPosition ) {
    return unpackRGBAToDepth( texture2D( tDepth, screenPosition ) );
}

float getViewZ( const in float depth ) {
    return perspectiveDepthToViewZ( depth, cameraNear, cameraFar );
}

void main() {

    vec2 screenUV = gl_FragCoord.xy / resolution;

    float fragmentLinearEyeDepth = getViewZ( gl_FragCoord.z );
    float linearEyeDepth = getViewZ( getDepth( screenUV ) );

    float diff = saturate( fragmentLinearEyeDepth - linearEyeDepth );

    float foamForce = 0.05;

    float thickness = 0.01;

    float foamScale = 1.0;  // Adjust the foam scale value to control the fineness of the foam

    vec2 displacement = texture2D( tDudv, ( vUv * foamScale ) - time * 0.05 ).rg;
    displacement = ( ( displacement * 2.0 ) - 1.0 ) * 1.0;

    float waveAmount = sin((vUv.x + vUv.y) * 10.0 + time * 5.0) * foamForce;  // Adjust the parameters to control the wave effect
    displacement.x += waveAmount;
    displacement.y += waveAmount;

    diff += displacement.x;

    gl_FragColor.rgb = mix( foamColor, waterColor, step( threshold / (0.1 / thickness), diff ) );
    gl_FragColor.a = 1.0;

    #include <tonemapping_fragment>
    #include <encodings_fragment>
    #include <fog_fragment>

}


    //     vec2 displacement = texture2D( tDudv, ( vUv * foamScale ) - time * 0.05 ).rg;
    //     displacement = ( ( displacement * 2.0 ) - 1.0 ) * 1.0;

    //     float waveAmount = sin((vUv.x + vUv.y) * 10.0 + time * 5.0) * foamForce;  // Adjust the parameters to control the wave effect
    //     displacement.x += waveAmount;
    //     displacement.y += waveAmount;

    //     diff += displacement.x;

    //   	gl_FragColor.rgb = mix( foamColor, waterColor, step( threshold / (0.1 / thickness), diff ) );
    //   	gl_FragColor.a = 1.0;

    //   	#include <tonemapping_fragment>
    //   	#include <encodings_fragment>
    //   	#include <fog_fragment>