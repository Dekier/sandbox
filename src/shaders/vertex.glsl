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
      if (vPosition.y > 1.0) {
       vec3 dirToCharacter = uCharacterPosition - vPosition;

      // Znormalizuj kierunek
      dirToCharacter = normalize(dirToCharacter);

      // Przesuń wierzchołek w kierunku postaci
      vPosition -= dirToCharacter * 0.6;
      vPosition.y -= 0.6;
      } else {
        vPosition.y -= 0.4;
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