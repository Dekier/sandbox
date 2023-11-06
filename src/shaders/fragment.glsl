uniform sampler2D uCloud;
uniform bool uFloor;

varying vec3 vPosition;
varying vec2 cloudUV;
varying vec3 vNormal;

vec3 green = vec3(0.9, 0.7, 0.4);

void main() {
    vec3 color = mix(green * 0.7, green, vPosition.y);
    if (uFloor) {

    color = mix(color, texture2D(uCloud, cloudUV).rgb, 0.01);
    } else {
    color = mix(color, texture2D(uCloud, cloudUV).rgb, 0.2);

    }

    float lighting = dot(vNormal, vec3(0.1));
    gl_FragColor = vec4(color + lighting * 0.001, 1.0);
}