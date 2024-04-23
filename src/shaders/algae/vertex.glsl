 precision highp float;
        attribute vec3 offset;
        varying vec3 vPosition;
        void main() {
            vPosition = position + offset;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);
        }