import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      setVisible(scrollTop > 400);
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0);
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  const circumference = 2 * Math.PI * 16;

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-50 flex items-center justify-center cursor-pointer min-h-[44px] min-w-[44px]"
          aria-label="返回顶部"
        >
          {/* 圆形进度环 */}
          <svg width="44" height="44" className="absolute" viewBox="0 0 44 44">
            <circle
              cx="22" cy="22" r="16"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="2"
            />
            <circle
              cx="22" cy="22" r="16"
              fill="none"
              stroke="var(--accent-vibe-color, #10b981)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              transform="rotate(-90 22 22)"
              style={{ transition: 'stroke-dashoffset 0.15s linear' }}
            />
          </svg>
          {/* 箭头 */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
