  uniform float uTime;
  uniform vec3 uCharacterPosition;

  varying vec2 cloudUV;
  varying vec3 vPosition;
  varying vec2 vUv;
  varying vec3 vNormal;

  float wave(float waveSize, float tipDistance, float centerDistance) {
    // Tip is the fifth vertex drawn per blade
    bool isTip = (gl_VertexID + 1) % 5 == 0;

    float waveDistance = isTip ? tipDistance : centerDistance;
    return sin(uTime + waveSize) * waveDistance;
  }

  float calculateDistance(vec3 vPosition, vec3 uCharacterPosition) {
    float dx = vPosition.x - uCharacterPosition.x;
    float dz = vPosition.z - uCharacterPosition.z;
    return sqrt(dx * dx + dz * dz);
  }



  void main() {
    vPosition = position;
    vUv = uv;
    cloudUV = uv;
    vNormal = normalize(normalMatrix * normal);
   

    float distance = calculateDistance(vPosition, uCharacterPosition);
    if (distance < 2.0) {
      vec3 dirToCharacter = uCharacterPosition - vPosition;

      dirToCharacter = normalize(dirToCharacter);
      float invertedDistance = 2.0 - distance;
      vec3 directionScaledByDistance  = dirToCharacter * invertedDistance;
      float newPositionY = mix(-0.6, 0.0, smoothstep(0.0, 2.0, distance));
      if (vPosition.y > 1.0) {
        vPosition.x -= directionScaledByDistance .x;
        vPosition.z -= directionScaledByDistance .z;
        vPosition.y += newPositionY;
      } else {
        vec3 invertedDirectionScaledByDistance = directionScaledByDistance  * 0.1;
        vPosition.x -= invertedDirectionScaledByDistance.x;
        vPosition.z -= invertedDirectionScaledByDistance.z;
        vPosition.y += newPositionY;
      }
      vPosition.x += wave(uv.x * 20.0, 0.3, 0.1);
    } else {
      if (vPosition.y < 0.0) {
        vPosition.y = 0.0;
      } else {
        vPosition.x += wave(uv.x * 20.0, 0.3, 0.1);
      }
    }

    cloudUV.x += uTime / 80.;
    cloudUV.y += uTime / 40.;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);
  }