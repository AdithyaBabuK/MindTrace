import { useEffect, useRef } from "react";

type Petal = {
  x: number;
  y: number;
  size: number;
  speed: number;
  drift: number;
  angle: number;
  spin: number;
  opacity: number;
  hue: number;
};

export function PetalField({ density = 40 }: { density?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let petals: Petal[] = [];
    let raf = 0;

    const makePetal = (initial = false): Petal => ({
      x: Math.random() * width,
      y: initial ? Math.random() * height : -20,
      size: 4 + Math.random() * 7,
      speed: 0.25 + Math.random() * 0.9,
      drift: (Math.random() - 0.5) * 0.6,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.02,
      opacity: 0.25 + Math.random() * 0.55,
      hue: 335 + Math.random() * 25,
    });

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round((density * width) / 1280);
      petals = Array.from({ length: Math.max(12, count) }, () => makePetal(true));
    };

    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 78%, 72%, ${p.opacity})`;
      ctx.shadowColor = `hsla(${p.hue}, 90%, 60%, 0.7)`;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.restore();
    };

    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 16.67, 3);
      last = now;
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        p.y += p.speed * dt;
        p.x += (p.drift + Math.sin((p.y + p.x) * 0.008) * 0.4) * dt;
        p.angle += p.spin * dt;
        if (p.y - p.size > height || p.x < -40 || p.x > width + 40) {
          petals[i] = makePetal();
        }
        drawPetal(p);
      }
      raf = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);

    if (reduced) {
      ctx.clearRect(0, 0, width, height);
      petals.forEach(drawPetal);
    } else {
      raf = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
