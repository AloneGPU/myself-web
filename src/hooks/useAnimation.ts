import { useEffect, useRef, useCallback } from 'react';
import {
  animateCounter,
  animateCards,
  animateTitle,
  animateFadeIn,
  animateSlideIn,
  animateBounce,
  animateHover,
  animateHoverOut,
  animateRipple,
  animateSequence,
  anime
} from '../utils/animations';

// 数字滚动动画 Hook
export const useCounter = (target: number, duration?: number) => {
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (ref.current && !hasAnimated.current) {
      hasAnimated.current = true;
      animateCounter(ref.current, target, duration);
    }
  }, [target, duration]);

  return ref;
};

// 卡片入场动画 Hook
export const useCardAnimation = (selector: string, deps: any[] = []) => {
  useEffect(() => {
    animateCards(selector);
  }, deps);
};

// 标题动画 Hook
export const useTitleAnimation = (selector: string) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (ref.current) {
      animateTitle(selector);
    }
  }, [selector]);

  return ref;
};

// 滚动触发动画 Hook
export const useScrollAnimation = (
  selector: string,
  options?: {
    threshold?: number;
    rootMargin?: string;
  }
) => {
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            animateFadeIn(selector);
          }
        });
      },
      {
        threshold: options?.threshold || 0.1,
        rootMargin: options?.rootMargin || '0px'
      }
    );

    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [selector, options?.threshold, options?.rootMargin]);
};

// 悬停动画 Hook
export const useHoverAnimation = () => {
  const ref = useRef<HTMLElement>(null);

  const onMouseEnter = useCallback(() => {
    if (ref.current) {
      animateHover(ref.current);
    }
  }, []);

  const onMouseLeave = useCallback(() => {
    if (ref.current) {
      animateHoverOut(ref.current);
    }
  }, []);

  return { ref, onMouseEnter, onMouseLeave };
};

// 点击波纹 Hook
export const useRippleAnimation = () => {
  const ref = useRef<HTMLElement>(null);

  const onClick = useCallback(() => {
    if (ref.current) {
      animateRipple(ref.current);
    }
  }, []);

  return { ref, onClick };
};

// 弹跳动画 Hook
export const useBounceAnimation = (trigger: any) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (ref.current && trigger) {
      animateBounce(ref.current);
    }
  }, [trigger]);

  return ref;
};

// 列表序列动画 Hook
export const useSequenceAnimation = (
  items: any[],
  options?: {
    delay?: number;
    duration?: number;
  }
) => {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const children = Array.from(containerRef.current.children) as HTMLElement[];
      animateSequence(children, options);
    }
  }, [items, options?.delay, options?.duration]);

  return containerRef;
};

// 简化的动画 Hook - 用于组件挂载动画
export const useMountAnimation = (selector: string, delay: number = 0) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      animateFadeIn(selector);
    }, delay);

    return () => clearTimeout(timer);
  }, [selector, delay]);
};

// 导出 anime 实例
export { anime };
