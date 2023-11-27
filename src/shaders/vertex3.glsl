varying vec2 vUv;
uniform float time;
attribute vec3 offset;
uniform vec3 uCharacterPosition;
uniform sampler2D alphaMap;
float calculateDistance(vec3 vPosition, vec3 uCharacterPosition) {
    float dx = vPosition.x - uCharacterPosition.x;
    float dz = vPosition.z - uCharacterPosition.z;
    return sqrt(dx * dx + dz * dz);
}

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

float getYPosition(vec2 p){
	return 8.0*(2.0*texture2D(alphaMap, p/800.0).r - 1.0);
}

float placeOnSphere(vec3 v){
  float theta = acos(v.z/240.0);
  float phi = acos(v.x/(240.0 * sin(theta)));
  float sV = 240.0 * sin(theta) * sin(phi);
  //If undefined, set to default value
  if(sV != sV){
    sV = v.y;
  }
  return sV;
}

void main() {
    vUv = uv;
    float t = time * 2.;
	

    // VERTEX POSITION
    vec4 mvPosition = vec4(position, 1.0);
	#ifdef USE_INSTANCING
    	mvPosition = instanceMatrix * mvPosition;
	#endif

    // DISPLACEMENT
    float noise = smoothNoise(mvPosition.xz * 0.3 + vec2(0., t));
    noise = pow(noise * 0.4 + 0.4, 2.) * 2.;

    // here the displacement is made stronger on the blades tips.
    float dispPower = 1. - cos(uv.y * 3.1416 * 0.7);

    float displacement = noise * (0.3 * dispPower);
    mvPosition.z -= displacement;

   // Check if the vertex position is less than 2 units from the character position
	float distance = calculateDistance(mvPosition.xyz, uCharacterPosition);
	if (distance < 2.0) {
        // Calculate the direction from the grass to the character
		vec3 dirToCharacter = normalize(uCharacterPosition - mvPosition.xyz);

		// Scale the direction vector by the inverted distance
		float invertedDistance = 1.0 - distance;
		vec3 directionScaledByDistance  = dirToCharacter * invertedDistance;

        // Use smoothstep to determine the amount of bending based on distance
      	float newPositionY = mix(-0.6, 0.0, smoothstep(0.0, 2.1, distance));

        // Adjust the position based on whether the grass is already above a certain height
		if (mvPosition.y > 0.5) {
			// mvPosition.x -= directionScaledByDistance.z;
		} else {
			// If the grass is below a certain height, bend it more and raise its position
			// vec3 invertedDirectionScaledByDistance = directionScaledByDistance  * 0.7;
			// 	mvPosition.x -= invertedDirectionScaledByDistance.x;
			// 	mvPosition.z -= invertedDirectionScaledByDistance.z;
			// mvPosition.y += newPositionY;
		}
			mvPosition.y += newPositionY;

	}

	
    float noiseTex = texture2D(alphaMap, vUv).r;
    if (noiseTex < 0.15 ) {
        mvPosition.y += 0.5;

    }
	// vec3 pos = vec3(0.01, 0.0, 0.01);
	// vec3 globalPos;
	// vec3 tile;
	// float delta =  100.0;
	// float posX = 0.01;
	// float posZ = 0.01;

	// globalPos.x = offset.x-posX*delta;
	// globalPos.z = offset.z-posZ*delta;

	// tile.x = floor((globalPos.x + 0.5 * 100.0) / 100.0);
	// tile.z = floor((globalPos.z + 0.5 * 100.0) / 100.0);

	// pos.x = globalPos.x - tile.x * 100.0;
	// pos.z = globalPos.z - tile.z * 100.0;

	// pos.y = max(1.0, placeOnSphere(pos)) - 230.0;
	// pos.y += getYPosition(vec2(pos.x+delta*posX, pos.z+delta*posZ));

    // mvPosition.xyz += pos;

    vec4 modelViewPosition = modelViewMatrix * mvPosition;
    gl_Position =  projectionMatrix * modelViewPosition;
}