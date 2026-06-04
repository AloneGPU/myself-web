import React, { useState, useEffect, useRef, useCallback } from 'react';
import { anime } from '../utils/animations';

interface MouseGlowProps {
  enabled?: boolean;
  size?: number;
}

export default function MouseGlow({ enabled = true, size = 130 }: MouseGlowProps) {
  const [pos, setPos] = useState({ x: -300, y: -300 });
  const [visible, setVisible] = useState(false);
  const [scale, setScale] = useState(1);
  const [intensity, setIntensity] = useState(0.08);
  const raf = useRef<number>();
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const glowRef = useRef<HTMLDivElement>(null);

  // 检测交互元素并产生物理反馈
  const checkInteraction = useCallback((x: number, y: number) => {
    const el = document.elementFromPoint(x, y);
    if (!el) return;

    const isInteractive = el.closest('button, a, input, [role="button"], [role="tab"], .glass-card');
    const isGlassPanel = el.closest('.glass-panel');

    if (isInteractive) {
      setScale(1.3);
      setIntensity(0.15);
    } else if (isGlassPanel) {
      setScale(1.1);
      setIntensity(0.12);
    } else {
      setScale(1);
      setIntensity(0.08);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const move = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);
      checkInteraction(e.clientX, e.clientY);
    };

    const leave = () => {
      setVisible(false);
      setScale(1);
      setIntensity(0.08);
    };

    const enter = () => setVisible(true);

    // 平滑动画循环
    const tick = () => {
      const dx = target.current.x - current.current.x;
      const dy = target.current.y - current.current.y;

      // 使用更平滑的插值
      current.current.x += dx * 0.12;
      current.current.y += dy * 0.12;

      setPos({ x: current.current.x, y: current.current.y });
      raf.current = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', move, { passive: true });
    document.addEventListener('mouseleave', leave);
    document.addEventListener('mouseenter', enter);
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseleave', leave);
      document.removeEventListener('mouseenter', enter);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [enabled, visible, checkInteraction]);

  // 使用 anime.js 增强交互反馈
  useEffect(() => {
    if (!glowRef.current) return;
    anime({
      targets: glowRef.current,
      scale: scale,
      duration: 400,
      easing: 'easeOutBack',
    });
  }, [scale]);

  if (!enabled) return null;
  const h = size / 2;

  return (
    <div
      className="pointer-events-none"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.6s ease',
      }}
    >
      {/* 主光晕 - 外层柔光 */}
      <div
        ref={glowRef}
        style={{
          position: 'absolute',
          left: pos.x - h - 25,
          top: pos.y - h - 25,
          width: size + 50,
          height: size + 50,
          borderRadius: '50%',
          background: `radial-gradient(circle,
            rgba(255,255,255,${intensity}) 0%,
            rgba(255,255,255,${intensity * 0.5}) 30%,
            rgba(255,255,255,${intensity * 0.2}) 50%,
            transparent 70%)`,
          filter: 'blur(12px)',
          transform: 'translate3d(0,0,0)',
          willChange: 'left, top',
          transition: 'background 0.3s ease',
        }}
      />

      {/* 核心高光 - 更集中 */}
      <div style={{
        position: 'absolute',
        left: pos.x - h * 0.5,
        top: pos.y - h * 0.5,
        width: size * 0.5,
        height: size * 0.5,
        borderRadius: '50%',
        background: `radial-gradient(circle,
          rgba(255,255,255,${intensity * 1.5}) 0%,
          rgba(255,255,255,${intensity * 0.5}) 50%,
          transparent 70%)`,
        transform: 'translate3d(0,0,0)',
        willChange: 'left, top',
      }} />

      {/* 顶部反光 - 模拟凸起光泽 */}
      <div style={{
        position: 'absolute',
        left: pos.x - h * 0.25,
        top: pos.y - h * 0.55,
        width: size * 0.25,
        height: size * 0.15,
        borderRadius: '50%',
        background: `radial-gradient(ellipse,
          rgba(255,255,255,${intensity * 2}) 0%,
          transparent 70%)`,
        transform: 'translate3d(0,0,0)',
        willChange: 'left, top',
      }} />
    </div>
  );
}
