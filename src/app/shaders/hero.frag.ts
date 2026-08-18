export const heroFragmentShader = String.raw`#version 300 es
precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;
out vec4 outColor;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float valueNoise(vec2 p) {
  vec2 cell = floor(p);
  vec2 blend = fract(p);
  blend = blend * blend * (3.0 - 2.0 * blend);
  return mix(
    mix(hash(cell), hash(cell + vec2(1.0, 0.0)), blend.x),
    mix(hash(cell + vec2(0.0, 1.0)), hash(cell + 1.0), blend.x),
    blend.y
  );
}

float softNoise(vec2 p) {
  return valueNoise(p) * 0.67 + valueNoise(p * 2.03) * 0.33;
}

vec2 domainWarp(vec2 p) {
  return p + 0.28 * vec2(
    softNoise(p + vec2(1.7, 5.2)),
    softNoise(p + vec2(8.3, 2.8))
  );
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 ellipse = (uv - vec2(0.16, 0.12)) / vec2(0.34, 0.21);
  float field = 1.0 - smoothstep(0.45, 1.0, length(ellipse));
  field *= 1.0 - smoothstep(0.31, 0.45, uv.x);
  field *= 1.0 - smoothstep(0.29, 0.39, uv.y);

  vec2 warped = domainWarp(uv * 2.2);
  float warmDrift = softNoise(warped + vec2(u_time * 0.006, 0.0));
  float coolDrift = softNoise(warped * 1.3 + vec2(u_time * -0.011, 4.0));
  float fadeIn = smoothstep(0.0, 4.0, u_time);
  float movement = (warmDrift - coolDrift) * fadeIn;
  vec3 warmSand = vec3(0.82, 0.62, 0.38);
  vec3 coolSky = vec3(0.48, 0.70, 0.82);
  vec3 color = mix(warmSand, coolSky, clamp(uv.y * 1.9 + movement * 0.18, 0.0, 1.0));
  outColor = vec4(color, field * max(0.0, (0.008 + movement * 0.015) * fadeIn));
}
`;
