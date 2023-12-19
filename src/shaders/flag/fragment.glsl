uniform vec2 resolution;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  uv.y = 1.0 - uv.y;  

 vec3 redColor = vec3(0.78, 0.16, 0.16);  
  vec3 grayColor = vec3(0.89, 0.89, 0.89);    

  float stripeHeight = 0.4;  

  if (uv.y < stripeHeight) {
    gl_FragColor = vec4(redColor, 1.0);
  } else {
    gl_FragColor = vec4(grayColor, 1.0);
  }
}