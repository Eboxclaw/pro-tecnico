import { useEffect, useRef, useState } from "react";

type LegendaryProductStageProps = {
  imageUrl?: string | null | undefined;
  alt: string;
  eyebrow?: string;
  className?: string;
};

const VERTEX = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT = `
precision highp float;
uniform vec2 u_resolution;
uniform vec2 u_pointer;
uniform float u_time;

float line(float value, float width) {
  return 1.0 - smoothstep(0.0, width, abs(value));
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv - 0.5;
  p.x *= u_resolution.x / max(u_resolution.y, 1.0);

  vec2 pointer = (u_pointer - 0.5) * 0.12;
  p -= pointer;

  float radius = length(p);
  float ringA = line(radius - 0.25, 0.0025);
  float ringB = line(radius - 0.36, 0.0015);
  float ringC = line(radius - 0.49, 0.001);

  vec2 gridUv = uv * vec2(22.0, 15.0);
  float gx = line(fract(gridUv.x) - 0.5, 0.012);
  float gy = line(fract(gridUv.y) - 0.5, 0.012);
  float grid = max(gx, gy) * 0.12;

  float sweep = line(sin(atan(p.y, p.x) + u_time * 0.18), 0.025) * 0.16;
  float glow = smoothstep(0.72, 0.05, radius) * 0.18;

  vec3 ink = vec3(0.035, 0.038, 0.044);
  vec3 steel = vec3(0.17, 0.18, 0.20);
  vec3 signal = vec3(0.96, 0.29, 0.09);

  vec3 color = mix(ink, steel, glow + grid);
  color += signal * (ringA * 0.52 + ringB * 0.20 + ringC * 0.10 + sweep);
  color += vec3(0.7, 0.74, 0.78) * grid * 0.18;

  gl_FragColor = vec4(color, 1.0);
}
`;

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
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

export function LegendaryProductStage({
  imageUrl,
  alt,
  eyebrow = "名品 · OBJETO DE DESTAQUE",
  className = "",
}: LegendaryProductStageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const pointerRef = useRef({ x: 0.5, y: 0.5 });
  const [webglReady, setWebglReady] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let stop = false;
    let started = false;
    let cleanupGl = () => {};

    const start = () => {
      if (started || stop) return;
      started = true;

      const gl = canvas.getContext("webgl2", {
        alpha: false,
        antialias: true,
        powerPreference: "low-power",
      });
      if (!gl) return;

      const vs = compile(gl, gl.VERTEX_SHADER, VERTEX);
      const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
      if (!vs || !fs) return;

      const program = gl.createProgram();
      if (!program) return;
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        gl.STATIC_DRAW,
      );

      const position = gl.getAttribLocation(program, "a_position");
      const resolution = gl.getUniformLocation(program, "u_resolution");
      const pointer = gl.getUniformLocation(program, "u_pointer");
      const time = gl.getUniformLocation(program, "u_time");

      gl.useProgram(program);
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

      const resize = () => {
        const rect = root.getBoundingClientRect();
        const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
        const width = Math.max(1, Math.floor(rect.width * ratio));
        const height = Math.max(1, Math.floor(rect.height * ratio));
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
          gl.viewport(0, 0, width, height);
        }
      };

      const ro = new ResizeObserver(resize);
      ro.observe(root);
      resize();

      const startedAt = performance.now();
      const draw = (now: number) => {
        if (stop) return;
        resize();
        gl.useProgram(program);
        gl.uniform2f(resolution, canvas.width, canvas.height);
        gl.uniform2f(pointer, pointerRef.current.x, 1 - pointerRef.current.y);
        gl.uniform1f(time, reducedMotion ? 0 : (now - startedAt) / 1000);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        if (!reducedMotion) raf = requestAnimationFrame(draw);
      };

      setWebglReady(true);
      draw(performance.now());

      cleanupGl = () => {
        ro.disconnect();
        cancelAnimationFrame(raf);
        gl.deleteBuffer(buffer);
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
      };
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          start();
          observer.disconnect();
        }
      },
      { rootMargin: "240px" },
    );
    observer.observe(root);

    const onPointerMove = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      const x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
      const y = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
      pointerRef.current = { x, y };

      if (!reducedMotion && imageRef.current) {
        const ry = (x - 0.5) * 6;
        const rx = (0.5 - y) * 5;
        imageRef.current.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(12px)`;
      }
    };

    const onPointerLeave = () => {
      pointerRef.current = { x: 0.5, y: 0.5 };
      if (imageRef.current) {
        imageRef.current.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)";
      }
    };

    root.addEventListener("pointermove", onPointerMove);
    root.addEventListener("pointerleave", onPointerLeave);

    return () => {
      stop = true;
      observer.disconnect();
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerleave", onPointerLeave);
      cleanupGl();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={`legendary-stage relative isolate min-h-[360px] overflow-hidden border border-border bg-[#0b0c0f] ${className}`}
    >
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${webglReady ? "opacity-100" : "opacity-0"}`}
        aria-hidden="true"
      />
      <div className="absolute inset-0 technical-grid opacity-60" aria-hidden="true" />
      <div className="absolute left-5 top-5 z-20 flex items-center gap-3">
        <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_20px_currentColor]" />
        <span className="tech-label text-white/70">{eyebrow}</span>
      </div>
      <div className="absolute right-5 top-5 z-20 font-mono text-[10px] tracking-[0.18em] text-white/40">
        WEBGL / MODO SEGURO
      </div>
      <div className="relative z-10 flex min-h-[360px] items-center justify-center p-10 sm:p-14">
        {imageUrl ? (
          <img
            ref={imageRef}
            src={imageUrl}
            alt={alt}
            className="legendary-object max-h-[420px] w-full max-w-[620px] object-contain transition-transform duration-300 ease-out"
            loading="eager"
          />
        ) : (
          <div className="hatch h-52 w-52 rounded-full border border-white/10 opacity-60" aria-hidden="true" />
        )}
      </div>
      <span className="measure-line measure-line-x" aria-hidden="true" />
      <span className="measure-line measure-line-y" aria-hidden="true" />
      <div className="absolute bottom-5 left-5 z-20 font-mono text-[10px] text-white/45">
        精密選定 / CURADORIA REJENDARI
      </div>
    </div>
  );
}
