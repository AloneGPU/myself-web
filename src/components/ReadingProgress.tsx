import { useEffect, useState } from 'react';

interface ReadingProgressProps {
  /** 进度条颜色，默认跟随主题 */
  color?: string;
  /** 进度条高度 */
  height?: number;
}

export default function ReadingProgressBar({ color = 'var(--accent-vibe-color)', height = 2 }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0);
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 z-[10000] pointer-events-none"
      style={{
        width: `${progress * 100}%`,
        height,
        background: color,
        transition: 'width 0.15s linear',
        boxShadow: '0 0 6px rgba(255,255,255,0.15)',
      }}
    />
  );
}
