import React, { useState, useRef, useCallback } from 'react';

interface CardSpotlightProps {
  children: React.ReactNode;
  className?: string;
}

export default function CardSpotlight({ children, className = '' }: CardSpotlightProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden ${className}`}
    >
      {/* accent色 spotlight */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, var(--bg-accent-glow, rgba(16,185,129,0.25)), transparent 60%)`,
        }}
      />
      {/* 顶部高光线 */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-px z-0 transition-opacity duration-300"
        style={{
          opacity: opacity * 0.5,
          background: `linear-gradient(90deg, transparent, var(--bg-accent, #10b981), transparent)`,
        }}
      />
      {/* 内容 */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
