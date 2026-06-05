import React, { useState, useEffect, useRef, useCallback } from "react";
import anime from "animejs";

// ===== 弹簧物理 =====
function springStep(c: number, v: number, t: number, k: number, d: number, dt: number) {
  const f = -k * (c - t) - d * v;
  const nv = v + f * dt;
  return { pos: c + nv * dt, vel: nv };
}

// ===== 粒子 =====
interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
}

export default function MouseGlow({ enabled = true }: { enabled?: boolean }) {
  // --- 弹簧位置 ---
  const px = useRef(-100); const py = useRef(-100);
  const vx = useRef(0);   const vy = useRef(0);
  const tx = useRef(-100); const ty = useRef(-100);

  // --- 速度感测 ---
  const prevX = useRef(-100); const prevY = useRef(-100);
  const speed = useRef(0);

  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const [accent, setAccent] = useState(false);

  // --- 粒子 ---
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleId = useRef(0);
  const particlesRef = useRef<Particle[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // --- 凸起偏移 ---
  const [bumpOffset, setBumpOffset] = useState({ x: 0, y: 0 });
  const bumpVX = useRef(0); const bumpVY = useRef(0);
  const bumpTX = useRef(0); const bumpTY = useRef(0);

  // 保持 particlesRef 同步
  useEffect(() => { particlesRef.current = particles; }, [particles]);

  useEffect(() => {
    if (!enabled) return;

    // --- 鼠标追踪 ---
    const move = (e: MouseEvent) => {
      tx.current = e.clientX; ty.current = e.clientY;
      if (!visible) setVisible(true);

      // 检测交互元素 → accent
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const interactive = !!el?.closest("button, a, [role=\"button\"], [role=\"tab\"], .glass-card, .glass-panel");
      setAccent(interactive);

      // 凸起目标：交互元素中心偏移
      if (interactive && el) {
        const rect = (el.closest("button, a, [role=\"button\"], [role=\"tab\"], .glass-card, .glass-panel") as HTMLElement)?.getBoundingClientRect();
        if (rect) {
          bumpTX.current = (rect.left + rect.width / 2 - e.clientX) * 0.15;
          bumpTY.current = (rect.top + rect.height / 2 - e.clientY) * 0.15;
        }
      } else {
        bumpTX.current = 0; bumpTY.current = 0;
      }
    };
    const leave = () => { setVisible(false); };
    const enter = () => setVisible(true);

    const lt = { current: 0 };
    const tick = (now: number) => {
      if (!lt.current) lt.current = now;
      const dt = Math.min((now - lt.current) / 1000, 0.033);
      lt.current = now;

      // 主弹簧
      const sx = springStep(px.current, vx.current, tx.current, 220, 26, dt);
      const sy = springStep(py.current, vy.current, ty.current, 220, 26, dt);
      px.current = sx.pos; py.current = sy.pos;
      vx.current = sx.vel; vy.current = sy.vel;

      // 凸起弹簧
      const bx = springStep(bumpTX.current, bumpVX.current, bumpTX.current, 80, 14, dt);
      const by = springStep(bumpTY.current, bumpVY.current, bumpTY.current, 80, 14, dt);
      bumpTX.current = bx.pos; bumpTY.current = by.pos;

      // 速度计算
      const dx = px.current - prevX.current;
      const dy = py.current - prevY.current;
      prevX.current = px.current; prevY.current = py.current;
      speed.current = Math.sqrt(dx * dx + dy * dy);

      setPos({ x: px.current, y: py.current });
      setBumpOffset({ x: bumpTX.current, y: bumpTY.current });

      // --- 粒子生成 ---
      if (speed.current > 3 && Math.random() < speed.current * 0.12) {
        const id = particleId.current++;
        const newP: Particle = {
          id,
          x: px.current + (Math.random() - 0.5) * 6,
          y: py.current + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2 - speed.current * 0.03,
          life: 1,
          maxLife: 0.5 + Math.random() * 0.5,
          size: 1.5 + Math.random() * 3,
          hue: 200 + Math.random() * 40,
        };
        const next = [...particlesRef.current, newP].slice(-40);
        particlesRef.current = next;
      }

      // --- 粒子衰减 ---
      const dtSec = dt;
      const alive = particlesRef.current
        .map((p) => ({ ...p, life: p.life - dtSec / p.maxLife, x: p.x + p.vx, y: p.y + p.vy, vy: p.vy + 0.5 * dtSec }))
        .filter((p) => p.life > 0);
      particlesRef.current = alive;
      setParticles([...alive]);

      requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseenter", enter);
    lt.current = performance.now();
    const raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseenter", enter);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;
  const { x, y } = pos;

  return (
    <div ref={containerRef} className="pointer-events-none" style={{ position: "fixed", inset: 0, zIndex: 9999 }}>
      {/* === 环境光 — 柔和圆形照明 === */}
      <div
        style={{
          position: "absolute",
          left: x - 220, top: y - 220,
          width: 440, height: 440,
          borderRadius: "50%",
          background: accent
            ? "radial-gradient(circle, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.008) 50%, transparent 70%)"
            : "radial-gradient(circle, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.004) 50%, transparent 70%)",
          willChange: "left, top",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />

      {/* === 光标点 — 纯净白点 + 亚光晕 === */}
      <div
        style={{
          position: "absolute",
          left: x - 3, top: y - 3,
          width: 6, height: 6,
          borderRadius: "50%",
          background: "#fff",
          boxShadow: "0 0 6px rgba(255,255,255,0.7), 0 0 18px rgba(255,255,255,0.25)",
          willChange: "left, top",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.15s ease",
        }}
      />

      {/* === 粒子轨迹 === */}
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: p.x - p.size / 2,
            top: p.y - p.size / 2,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: `hsla(${p.hue}, 80%, 80%, ${p.life * 0.5})`,
            boxShadow: `0 0 ${p.size * 2}px hsla(${p.hue}, 80%, 90%, ${p.life * 0.3})`,
            willChange: "left, top, opacity",
          }}
        />
      ))}
    </div>
  );
}
