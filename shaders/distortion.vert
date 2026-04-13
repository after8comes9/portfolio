varying vec2 vUv;
uniform float uTime;
uniform vec2 uMouse;
uniform float uHover;

void main() {
  vUv = uv;
  vec3 pos = position;

  // Cursor-reactive displacement
  float dist = distance(uv, uMouse);
  float wave = sin(dist * 10.0 - uTime * 2.0) * 0.02 * uHover;
  pos.z += wave;

  // Subtle breathing
  pos.z += sin(uTime * 0.5 + uv.x * 3.14) * 0.005;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
