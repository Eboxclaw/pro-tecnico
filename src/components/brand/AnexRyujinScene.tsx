import { useEffect, useRef, useState } from "react";

/** Decorative only: the complete product experience remains in HTML. */
export function AnexRyujinScene() {
  const [paused, setPaused] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = rootRef.current;
    if (!root || paused) return;
    let disposed = false;
    let started = false;
    let visible = false;
    let renderFrame: (() => void) | undefined;
    let cleanup = () => {};
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const start = async () => {
      if (started || disposed || motion.matches) return;
      started = true;
      try {
        const THREE = await import("three");
        if (disposed || motion.matches) { started = false; return; }
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "low-power" });
        renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
        renderer.domElement.setAttribute("aria-hidden", "true");
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 50);
        camera.position.z = 7;
        const group = new THREE.Group();
        scene.add(group);
        const sun = new THREE.Mesh(new THREE.CircleGeometry(1.35, 48), new THREE.MeshBasicMaterial({ color: 0xb34430, transparent: true, opacity: .22 }));
        sun.position.set(.7, .5, -2);
        group.add(sun);
        for (let ribbon = 0; ribbon < 3; ribbon++) {
          const vertices = new Float32Array(150 * 3);
          for (let i = 0; i < 150; i++) {
            const t = i / 149 * Math.PI * 2;
            vertices[i * 3] = Math.cos(t + ribbon * .35) * (1.4 + ribbon * .4);
            vertices[i * 3 + 1] = Math.sin(t * 2 + ribbon) * .6;
            vertices[i * 3 + 2] = Math.sin(t) * .6;
          }
          const geometry = new THREE.BufferGeometry();
          geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
          group.add(new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0x9b7151, size: .025, transparent: true, opacity: .6 })));
          const ring = new THREE.Mesh(new THREE.TorusGeometry(1.7 + ribbon * .35, .006, 4, 90), new THREE.MeshBasicMaterial({ color: 0x38352e, transparent: true, opacity: .2 }));
          ring.rotation.set(.5 + ribbon * .25, .2, ribbon * .2);
          group.add(ring);
        }
        let raf = 0;
        let lost = false;
        let px = 0;
        let py = 0;
        const stop = () => { cancelAnimationFrame(raf); raf = 0; };
        const draw = () => {
          raf = 0;
          if (disposed || lost || !visible || document.hidden || motion.matches) return;
          const t = performance.now() / 1000;
          group.rotation.y += (px - group.rotation.y) * .025;
          group.rotation.x += (py - group.rotation.x) * .025;
          sun.scale.setScalar(1 + Math.sin(t * .5) * .04);
          renderer.render(scene, camera);
          raf = requestAnimationFrame(draw);
        };
        renderFrame = () => {
          stop();
          renderer.domElement.hidden = motion.matches || lost;
          if (!motion.matches) draw();
        };
        const resize = () => {
          const { width, height } = root.getBoundingClientRect();
          renderer.setSize(Math.max(width, 1), Math.max(height, 1));
          camera.aspect = Math.max(width, 1) / Math.max(height, 1);
          camera.updateProjectionMatrix();
          renderFrame?.();
        };
        const pointer = (event: PointerEvent) => {
          if (event.pointerType !== "mouse") return;
          const rect = root.getBoundingClientRect();
          px = (event.clientX - rect.left) / rect.width * .2 - .1;
          py = (event.clientY - rect.top) / rect.height * .1 - .05;
        };
        const contextLost = () => { lost = true; stop(); renderer.domElement.hidden = true; };
        const observer = new ResizeObserver(resize);
        cleanup = () => {
          stop(); observer.disconnect();
          root.parentElement?.removeEventListener("pointermove", pointer);
          renderer.domElement.removeEventListener("webglcontextlost", contextLost);
          group.traverse((object) => {
            if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
              object.geometry.dispose();
              const materials = Array.isArray(object.material) ? object.material : [object.material];
              materials.forEach((material) => material.dispose());
            }
          });
          renderer.dispose(); renderer.domElement.remove();
        };
        root.appendChild(renderer.domElement);
        observer.observe(root);
        root.parentElement?.addEventListener("pointermove", pointer, { passive: true });
        renderer.domElement.addEventListener("webglcontextlost", contextLost);
        resize();
      } catch {
        cleanup(); // Static CSS sun remains when WebGL/import is unavailable.
      }
    };
    const update = () => { if (!started && visible && !document.hidden) void start(); renderFrame?.(); };
    const observer = new IntersectionObserver(([entry]) => { visible = !!entry?.isIntersecting; update(); });
    observer.observe(root);
    document.addEventListener("visibilitychange", update);
    motion.addEventListener("change", update);
    return () => {
      disposed = true; observer.disconnect(); cleanup();
      document.removeEventListener("visibilitychange", update);
      motion.removeEventListener("change", update);
    };
  }, [paused]);
  return <>
    <div ref={rootRef} className="anex-ryujin-scene" aria-hidden="true" />
    <button type="button" className="anex-motion-control" aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? "Retomar animação" : "Pausar animação"}</button>
  </>;
}
