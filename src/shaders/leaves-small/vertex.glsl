varying vec2 vUv;
// #include <common>
// #include <shadowmap_pars_vertex>
// uniform float time;
// attribute vec3 offset;
// uniform vec3 uCharacterPosition;
// varying vec3 vNormal;
// varying vec3 vViewDir;

// float calculateDistance(vec3 vPosition, vec3 uCharacterPosition) {
//     float dx = vPosition.x - uCharacterPosition.x;
//     float dz = vPosition.z - uCharacterPosition.z;
//     return sqrt(dx * dx + dz * dz);
// }

float N(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float smoothNoise(vec2 ip) {
    vec2 lv = fract(ip);
    vec2 id = floor(ip);

    lv = lv * lv * (3. - 2. * lv);

    float bl = N(id);
    float br = N(id + vec2(1, 0));
    float b = mix(bl, br, lv.x);

    float tl = N(id + vec2(0, 1));
    float tr = N(id + vec2(1, 1));
    float t = mix(tl, tr, lv.x);

    return mix(b, t, lv.y);
}

// void main() {
//     #include <beginnormal_vertex>
//     #include <defaultnormal_vertex>

//     #include <begin_vertex>

//     #include <worldpos_vertex>
//     #include <shadowmap_vertex>
//     vUv = uv;
//     float t = time * 2.;

//     // VERTEX POSITION
//     vec4 mvPosition = vec4(position, 1.0);
//     #ifdef USE_INSTANCING
//         mvPosition = instanceMatrix * mvPosition;
//     #endif

//     // DISPLACEMENT
//     float noise = smoothNoise(mvPosition.xz * 0.2 + vec2(-0., t));
//     noise = pow(noise * 0.4 + 0.4, 2.) * 2.;

//     // here the displacement is made stronger on the blades tips.
//     float dispPower = 1. - cos(uv.y * 3.1416 * 0.7);

//     float displacement = noise * (0.3 * dispPower);
//     mvPosition.x += displacement;
//     mvPosition.z += displacement;

//     float distance = calculateDistance(mvPosition.xyz, uCharacterPosition);
//     if (distance < 2.0) {
//         float bendingFactor = smoothstep(0.0, 2.0, distance);
//         float newPositionY = mix(-0.6, 0.0, bendingFactor);
//         mvPosition.y += newPositionY;
//     }

//     vec4 modelPosition = modelMatrix * mvPosition;
//     vec4 viewPosition = viewMatrix * modelPosition;
//     vec4 clipPosition = projectionMatrix * viewPosition;

//     vNormal = normalize(normalMatrix * normal);

//     gl_Position = clipPosition;
// }
    uniform float time;
    uniform float u_WobbleAmplitude;


    void main() {
        vUv = uv;
        float t = time * 2.;
        float noise = smoothNoise(csm_Position.xz * 0.5 + vec2(-0., t));
        float dispPower = 1. - cos(uv.y * 3.1416 * 0.9);
        float displacement = noise * (0.9 * dispPower);
        // csm_Position.x += displacement;
        // csm_Position.z += displacement;
        // float wobble = sin(csm_Position.z * u_WobbleFrequency + time * u_WobbleSpeed);
        csm_Position += normal * displacement * u_WobbleAmplitude;

    }