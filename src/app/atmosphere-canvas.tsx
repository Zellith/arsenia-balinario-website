"use client";

import { useEffect, useRef } from "react";

type AtmosphereCanvasProps = Readonly<{
  activationMedia?: string;
  fragmentShader: string;
  framesPerSecond: number;
}>;

type NavigatorWithMemory = Navigator & { deviceMemory?: number };
type WindowWithIdle = Window & {
  cancelIdleCallback?: (id: number) => void;
  requestIdleCallback?: (
    callback: IdleRequestCallback,
    options?: IdleRequestOptions,
  ) => number;
};

const vertexShader = `#version 300 es
void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

function compileShader(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function AtmosphereCanvas({
  activationMedia,
  fragmentShader,
  framesPerSecond,
}: AtmosphereCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const idleWindow = window as WindowWithIdle;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const activation = activationMedia
      ? window.matchMedia(activationMedia)
      : null;
    const deviceMemory = (navigator as NavigatorWithMemory).deviceMemory;
    const dataset = document.documentElement.dataset;
    let idleId: number | undefined;
    let fallbackId: ReturnType<typeof setTimeout> | undefined;
    let initialized = false;
    let disposed = false;
    let cleanupRuntime = () => {};

    const atmosphereIsOff = () => dataset.atmosphere === "off";
    const isAllowed = () =>
      !reducedMotion.matches &&
      (!activation || activation.matches) &&
      (deviceMemory === undefined || deviceMemory >= 4) &&
      !atmosphereIsOff();

    const initialize = () => {
      if (initialized || disposed || !isAllowed()) return;

      const gl = canvas.getContext("webgl2", {
        alpha: true,
        antialias: false,
        depth: false,
        powerPreference: "low-power",
        premultipliedAlpha: false,
        preserveDrawingBuffer: false,
        stencil: false,
      });
      if (!gl) return;

      const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexShader);
      const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShader);
      const program = gl.createProgram();
      if (!vertex || !fragment || !program) return;

      gl.attachShader(program, vertex);
      gl.attachShader(program, fragment);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        gl.deleteProgram(program);
        gl.deleteShader(vertex);
        gl.deleteShader(fragment);
        return;
      }

      initialized = true;
      const resolution = gl.getUniformLocation(program, "u_resolution");
      const time = gl.getUniformLocation(program, "u_time");
      const frameInterval = 1000 / framesPerSecond;
      const startedAt = performance.now();
      let frame = 0;
      let inView = false;
      let previousFrame = -frameInterval;

      const resize = () => {
        const scale = Math.min(window.devicePixelRatio, 1.5) * 0.5;
        canvas.width = Math.max(1, Math.round(canvas.clientWidth * scale));
        canvas.height = Math.max(1, Math.round(canvas.clientHeight * scale));
        gl.viewport(0, 0, canvas.width, canvas.height);
      };

      const isActive = () =>
        inView && document.visibilityState === "visible" && isAllowed();

      const draw = (now: number) => {
        frame = 0;
        if (!isActive()) return;
        if (now - previousFrame >= frameInterval) {
          previousFrame = now;
          gl.clearColor(0, 0, 0, 0);
          gl.clear(gl.COLOR_BUFFER_BIT);
          gl.useProgram(program);
          gl.uniform2f(resolution, canvas.width, canvas.height);
          gl.uniform1f(time, (now - startedAt) / 1000);
          gl.drawArrays(gl.TRIANGLES, 0, 3);
        }
        frame = requestAnimationFrame(draw);
      };

      const updatePlayback = () => {
        if (isActive() && !frame) frame = requestAnimationFrame(draw);
        if (!isActive() && frame) {
          cancelAnimationFrame(frame);
          frame = 0;
        }
      };

      const intersection = new IntersectionObserver(
        ([entry]) => {
          inView = entry.isIntersecting;
          updatePlayback();
        },
        { rootMargin: "10%" },
      );
      const resizeObserver = new ResizeObserver(resize);
      const atmosphereObserver = new MutationObserver(updatePlayback);
      const onContextLost = () => {
        inView = false;
        updatePlayback();
      };

      resize();
      intersection.observe(canvas);
      resizeObserver.observe(canvas);
      atmosphereObserver.observe(document.documentElement, {
        attributeFilter: ["data-atmosphere"],
      });
      document.addEventListener("visibilitychange", updatePlayback);
      reducedMotion.addEventListener("change", updatePlayback);
      activation?.addEventListener("change", updatePlayback);
      canvas.addEventListener("webglcontextlost", onContextLost);
      updatePlayback();

      cleanupRuntime = () => {
        if (frame) cancelAnimationFrame(frame);
        intersection.disconnect();
        resizeObserver.disconnect();
        atmosphereObserver.disconnect();
        document.removeEventListener("visibilitychange", updatePlayback);
        reducedMotion.removeEventListener("change", updatePlayback);
        activation?.removeEventListener("change", updatePlayback);
        canvas.removeEventListener("webglcontextlost", onContextLost);
        gl.deleteProgram(program);
        gl.deleteShader(vertex);
        gl.deleteShader(fragment);
      };
    };

    const scheduleInitialization = () => {
      if (idleWindow.requestIdleCallback) {
        idleId = idleWindow.requestIdleCallback(initialize, { timeout: 800 });
      } else {
        fallbackId = setTimeout(initialize, 800);
      }
    };

    if (document.readyState === "complete") scheduleInitialization();
    else window.addEventListener("load", scheduleInitialization, { once: true });
    activation?.addEventListener("change", initialize);
    reducedMotion.addEventListener("change", initialize);

    return () => {
      disposed = true;
      window.removeEventListener("load", scheduleInitialization);
      activation?.removeEventListener("change", initialize);
      reducedMotion.removeEventListener("change", initialize);
      if (idleId !== undefined) idleWindow.cancelIdleCallback?.(idleId);
      if (fallbackId !== undefined) clearTimeout(fallbackId);
      cleanupRuntime();
    };
  }, [activationMedia, fragmentShader, framesPerSecond]);

  return (
    <canvas
      aria-hidden="true"
      className="atmosphere-canvas"
      data-atmosphere-canvas=""
      ref={canvasRef}
    />
  );
}
