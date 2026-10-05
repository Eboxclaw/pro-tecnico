import { useEffect, useRef } from "react";

export function JapaneseAmbientScene({ className = "" }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let disposed = false;
    let cleanup = () => {};

    const start = async () => {
      const THREE = await import("three");
      if (disposed || !root) return;

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setClearColor(0x000000, 0);
      renderer.domElement.setAttribute("aria-hidden", "true");
      renderer.domElement.style.position = "absolute";
      renderer.domElement.style.inset = "0";
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.domElement.style.pointerEvents = "none";
      root.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
      camera.position.set(0, 0, 6.2);

      const group = new THREE.Group();
      scene.add(group);

      const vermilion = new THREE.MeshBasicMaterial({
        color: 0xc84b31,
        transparent: true,
        opacity: 0.18,
        depthWrite: false,
      });
      const charcoal = new THREE.MeshBasicMaterial({
        color: 0x201f1b,
        transparent: true,
        opacity: 0.14,
        wireframe: true,
        depthWrite: false,
      });

      const sun = new THREE.Mesh(new THREE.CircleGeometry(0.72, 64), vermilion);
      sun.position.set(1.65, 0.78, -1.5);
      group.add(sun);

      const ringA = new THREE.Mesh(new THREE.TorusGeometry(1.55, 0.007, 8, 160), charcoal);
      ringA.rotation.x = 0.62;
      ringA.rotation.y = 0.28;
      group.add(ringA);

      const ringB = new THREE.Mesh(new THREE.TorusGeometry(2.25, 0.006, 8, 180), charcoal.clone());
      ringB.rotation.x = -0.34;
      ringB.rotation.y = -0.48;
      ringB.position.x = -0.35;
      group.add(ringB);

      const count = 90;
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i += 1) {
        const t = i * 2.399963229728653;
        const radius = 0.4 + ((i % 17) / 17) * 2.8;
        positions[i * 3] = Math.cos(t) * radius;
        positions[i * 3 + 1] = Math.sin(t) * radius * 0.72;
        positions[i * 3 + 2] = -0.8 + ((i % 9) / 9) * 1.6;
      }
      const pointsGeometry = new THREE.BufferGeometry();
      pointsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const pointsMaterial = new THREE.PointsMaterial({
        color: 0x27241f,
        size: 0.022,
        transparent: true,
        opacity: 0.26,
        depthWrite: false,
      });
      const points = new THREE.Points(pointsGeometry, pointsMaterial);
      group.add(points);

      const pointer = { x: 0, y: 0 };
      const target = { x: 0, y: 0 };

      const onPointerMove = (event: PointerEvent) => {
        const rect = root.getBoundingClientRect();
        target.x = ((event.clientX - rect.left) / Math.max(rect.width, 1) - 0.5) * 0.34;
        target.y = ((event.clientY - rect.top) / Math.max(rect.height, 1) - 0.5) * -0.24;
      };
      root.addEventListener("pointermove", onPointerMove, { passive: true });

      const resize = () => {
        const rect = root.getBoundingClientRect();
        const width = Math.max(1, rect.width);
        const height = Math.max(1, rect.height);
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };
      const ro = new ResizeObserver(resize);
      ro.observe(root);
      resize();

      let raf = 0;
      const started = performance.now();
      const draw = (now: number) => {
        if (disposed) return;
        const time = (now - started) / 1000;
        pointer.x += (target.x - pointer.x) * 0.04;
        pointer.y += (target.y - pointer.y) * 0.04;

        group.rotation.y = pointer.x + (reducedMotion ? 0 : Math.sin(time * 0.16) * 0.055);
        group.rotation.x = pointer.y + (reducedMotion ? 0 : Math.cos(time * 0.13) * 0.035);
        points.rotation.z = reducedMotion ? 0 : time * 0.012;
        sun.position.y = 0.78 + (reducedMotion ? 0 : Math.sin(time * 0.5) * 0.055);

        renderer.render(scene, camera);
        if (!reducedMotion) raf = requestAnimationFrame(draw);
      };
      draw(performance.now());

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        root.removeEventListener("pointermove", onPointerMove);
        pointsGeometry.dispose();
        pointsMaterial.dispose();
        ringA.geometry.dispose();
        ringB.geometry.dispose();
        (ringB.material as typeof charcoal).dispose();
        charcoal.dispose();
        sun.geometry.dispose();
        vermilion.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          observer.disconnect();
          start();
        }
      },
      { rootMargin: "240px" },
    );
    observer.observe(root);

    return () => {
      disposed = true;
      observer.disconnect();
      cleanup();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    />
  );
}
