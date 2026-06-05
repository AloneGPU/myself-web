import { useEffect, useRef, useCallback } from 'react';
import { springHover } from '../utils/animations';

/** 为卡片添加弹簧悬停效果 */
export function useCardSpring<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const onMouseEnter = useCallback(() => {
    if (ref.current) springHover(ref.current, true);
  }, []);
  const onMouseLeave = useCallback(() => {
    if (ref.current) springHover(ref.current, false);
  }, []);
  return { ref, onMouseEnter, onMouseLeave };
}

/** 为卡片列表添加交错入场动画 */
export function useStaggerEntrance(selector: string, deps: unknown[] = []) {
  useEffect(() => {
    const timer = setTimeout(() => {
      const els = document.querySelectorAll(selector);
      if (els.length === 0) return;
      els.forEach((el, i) => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.opacity = '0';
        htmlEl.style.transform = 'translateY(40px) scale(0.95)';
        htmlEl.style.transition = `all 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 60}ms`;
        requestAnimationFrame(() => {
          htmlEl.style.opacity = '1';
          htmlEl.style.transform = 'translateY(0) scale(1)';
        });
      });
    }, 100);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
