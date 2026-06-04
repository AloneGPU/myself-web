import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface Firefly {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

interface FirefliesProps {
  count?: number;
  enabled?: boolean;
}

export default function Fireflies({ count = 20, enabled = true }: FirefliesProps) {
  const [fireflies, setFireflies] = useState<Firefly[]>([]);

  useEffect(() => {
    if (!enabled) {
      setFireflies([]);
      return;
    }

    const newFireflies: Firefly[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 4,
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 2,
    }));
    setFireflies(newFireflies);
  }, [count, enabled]);

  if (!enabled || fireflies.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[5] pointer-events-none overflow-hidden">
      {fireflies.map((firefly) => (
        <motion.div
          key={firefly.id}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 1, 0.5, 1, 0],
            x: [0, Math.random() * 40 - 20, Math.random() * 40 - 20, 0],
            y: [0, Math.random() * 40 - 20, Math.random() * 40 - 20, 0],
          }}
          transition={{
            duration: firefly.duration,
            delay: firefly.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute rounded-full"
          style={{
            left: `${firefly.x}%`,
            top: `${firefly.y}%`,
            width: firefly.size,
            height: firefly.size,
            backgroundColor: '#fbbf24',
            boxShadow: `0 0 ${firefly.size * 2}px #fbbf24, 0 0 ${firefly.size * 4}px #fbbf24`,
          }}
        />
      ))}
    </div>
  );
}
