import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface FloatingItem {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
}

// 爱心飘落效果
export function HeartRain({ active }: { active: boolean }) {
  const [hearts, setHearts] = useState<FloatingItem[]>([]);

  useEffect(() => {
    if (!active) {
      setHearts([]);
      return;
    }

    const newHearts: FloatingItem[] = Array.from({ length: 30 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 4,
      size: 16 + Math.random() * 24,
    }));
    setHearts(newHearts);
  }, [active]);

  if (!active || hearts.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none overflow-hidden">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          initial={{ y: -50, x: `${heart.x}vw`, opacity: 1 }}
          animate={{ y: '110vh', opacity: 0 }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            ease: 'linear',
          }}
          className="absolute text-red-400"
          style={{ fontSize: heart.size }}
        >
          ❤️
        </motion.div>
      ))}
    </div>
  );
}

// 雪花飘落效果
export function SnowMode({ active }: { active: boolean }) {
  const [snowflakes, setSnowflakes] = useState<FloatingItem[]>([]);

  useEffect(() => {
    if (!active) {
      setSnowflakes([]);
      return;
    }

    const newSnowflakes: FloatingItem[] = Array.from({ length: 50 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 5 + Math.random() * 5,
      size: 8 + Math.random() * 16,
    }));
    setSnowflakes(newSnowflakes);
  }, [active]);

  if (!active || snowflakes.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none overflow-hidden">
      {snowflakes.map((flake) => (
        <motion.div
          key={flake.id}
          initial={{ y: -50, x: `${flake.x}vw`, opacity: 1, rotate: 0 }}
          animate={{
            y: '110vh',
            x: `${flake.x + (Math.random() - 0.5) * 20}vw`,
            opacity: 0,
            rotate: 360,
          }}
          transition={{
            duration: flake.duration,
            delay: flake.delay,
            ease: 'linear',
          }}
          className="absolute text-white"
          style={{ fontSize: flake.size }}
        >
          ❄️
        </motion.div>
      ))}
    </div>
  );
}

// 星尘闪烁效果
export function SparkleEffect({ active }: { active: boolean }) {
  const [sparkles, setSparkles] = useState<FloatingItem[]>([]);

  useEffect(() => {
    if (!active) {
      setSparkles([]);
      return;
    }

    const interval = setInterval(() => {
      const newSparkle: FloatingItem = {
        id: Date.now(),
        x: Math.random() * 100,
        delay: 0,
        duration: 1 + Math.random() * 2,
        size: 4 + Math.random() * 8,
      };
      setSparkles((prev) => [...prev.slice(-20), newSparkle]);
    }, 300);

    return () => clearInterval(interval);
  }, [active]);

  if (!active || sparkles.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[199] pointer-events-none overflow-hidden">
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
          transition={{ duration: sparkle.duration }}
          className="absolute text-yellow-300"
          style={{
            left: `${sparkle.x}%`,
            top: `${Math.random() * 100}%`,
            fontSize: sparkle.size,
          }}
        >
          ✨
        </motion.div>
      ))}
    </div>
  );
}
