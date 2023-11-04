uniform sampler2D uCloud;

  varying vec3 vPosition;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec2 cloudUV;

  vec3 green = vec3(0.9,0.7,0.4);

  void main() {
    vec3 color = mix(green * 0.7, green, vPosition.y) ;
    color = mix(color, texture2D(uCloud, cloudUV).rgb, 0.3);
    // vec3 color = mix(green * 0.7, green, vPosition.y);
    // color = mix(color, texture2D(uCloud, vUv).rgb, 0.4);

    float lighting = normalize(dot(vNormal, vec3(10)));
    gl_FragColor = vec4(color + lighting * 0.03, 1.0);
  }