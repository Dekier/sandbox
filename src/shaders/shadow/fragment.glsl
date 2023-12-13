varying vec2 vUv;
varying vec4 vPosition;
uniform sampler2D alphaMap;
uniform vec3 hexColor;

void main() {
    // Odrzuć fragmenty zbyt małej wartości alpha
    if (texture2D(alphaMap, vUv).r < 0.15) {
        discard;
    }
    
    // Wycięcie cienia dla customDepthMaterial
    #ifdef USE_DEPTH
        #ifdef USE_CUSTOM_DEPTH_MATERIAL
            if (vPosition.z < 0.0) {
                discard;
            }
        #endif
    #endif
    
    float clarity = vUv.y * 1.0 + 0.5;
    gl_FragColor = vec4(hexColor, 1.0);
}