varying vec2 vUv;
uniform sampler2D alphaMap;
  
  void main() {
	  float noise = texture2D(alphaMap, vUv).r;
	  //If transparent, don't draw
    if(texture2D(alphaMap, vUv).r < 0.15){
      discard;
    }
  	// vec3 baseColor =vec3(0.851,0.706,0.529);
    // float clarity = ( vUv.y * 0.9 ) ;
    // gl_FragColor = vec4( baseColor * clarity, 0.8 );
	  vec3 baseColor = vec3(0.498,0.439,0.337);
    
    // Adjust clarity based on the vertical UV coordinate
    float clarity = vUv.y * 1.0 + 0.7; // Adjust the coefficients as needed
    
    // Apply the adjusted clarity to the base color
    gl_FragColor = vec4(baseColor * clarity, 1.0);
  }