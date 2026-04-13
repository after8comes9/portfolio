varying vec2 vUv;
uniform sampler2D uTexture;
uniform float uTime;
uniform vec2 uMouse;
uniform float uHover;
uniform float uOpacity;

void main() {
  vec2 uv = vUv;

  // Chromatic aberration on hover
  float dist = distance(uv, uMouse);
  float aberration = 0.003 * uHover * (1.0 - smoothstep(0.0, 0.5, dist));

  vec4 r = texture2D(uTexture, uv + vec2(aberration, 0.0));
  vec4 g = texture2D(uTexture, uv);
  vec4 b = texture2D(uTexture, uv - vec2(aberration, 0.0));

  vec4 color = vec4(r.r, g.g, b.b, g.a);

  // Slight vignette
  float vignette = smoothstep(0.8, 0.3, distance(uv, vec2(0.5)));
  color.rgb *= mix(0.7, 1.0, vignette);

  color.a *= uOpacity;

  gl_FragColor = color;
}
