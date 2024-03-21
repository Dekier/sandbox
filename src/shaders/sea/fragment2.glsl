uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;
uniform vec3 uCharacterPosition;
uniform float uTime;
varying vec2 vUv;
precision lowp float;

varying float vElevation;

void main() {
    float radius = 0.11;
    vec2 center = vec2(0.5 + uCharacterPosition.x / 400.0, 0.5 - uCharacterPosition.z / 400.0);

    // Oblicz odległość od centrum obszaru
    float distanceToCenter = length(vUv - center);

    // Ustal wartości dla płynnego przejścia opacity
    float alpha = smoothstep(radius, radius + 0.52, distanceToCenter + 0.48); // Dodatkowy margines 0.02

    // Oblicz mnożnik koloru na podstawie elevacji i ustaw kolor
    float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
    vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);

    // Ustaw przezroczystość w zależności od odległości od centrum obszaru
    gl_FragColor = vec4(color, alpha);

    // Dołącz dodatkowe przekształcenia kolorów (jeśli potrzebne)
    #include <colorspace_fragment>
}