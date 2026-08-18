export const nightFragmentShader = String.raw`#version 300 es
precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;
out vec4 outColor;

float hash(float value) {
  return fract(sin(value * 127.1) * 43758.5453);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float fadeIn = smoothstep(0.0, 4.0, u_time);
  float verticalFlow = clamp(
    uv.y + sin(uv.y * 3.1 + u_time * 0.052) * 0.04 * fadeIn,
    0.0,
    1.0
  );
  vec3 nightDeep = vec3(0.027, 0.090, 0.149);
  vec3 night = vec3(0.039, 0.125, 0.204);
  vec3 messenger = vec3(0.082, 0.373, 0.741);
  vec3 starColor = vec3(0.353, 0.478, 0.588);
  vec3 color = mix(nightDeep, night, verticalFlow);

  float upperMask = smoothstep(0.65, 0.82, uv.y);
  float rightMask = smoothstep(0.62, 0.82, uv.x);
  float auroraWave = 0.5 + 0.5 * sin(uv.x * 5.0 - u_time * 0.070 + uv.y * 2.0);
  float auroraAlpha = upperMask * rightMask * auroraWave * 0.06 * fadeIn;
  color = mix(color, messenger, auroraAlpha);

  float stars = 0.0;
  float aspect = u_resolution.x / u_resolution.y;
  for (int i = 0; i < 90; i++) {
    float index = float(i) + 1.0;
    vec2 point = vec2(
      0.58 + hash(index * 1.37) * 0.40,
      0.66 + hash(index * 2.11) * 0.32
    );
    vec2 delta = (uv - point) * vec2(aspect, 1.0);
    float sparkle = 1.0 - smoothstep(0.001, 0.0035, length(delta));
    float brightness = mix(0.10, 0.25, hash(index * 4.71));
    float twinkle = 0.88 + 0.12 * sin(u_time * 0.09 + index * 2.4);
    stars += sparkle * brightness * twinkle;
  }
  float starAlpha = min(stars, 0.25) * 0.35 * fadeIn;
  color = mix(color, starColor, starAlpha);

  float vignette = smoothstep(0.56, 1.0, uv.x) * 0.08 * fadeIn;
  color = mix(color, nightDeep, vignette);
  outColor = vec4(color, fadeIn);
}
`;
