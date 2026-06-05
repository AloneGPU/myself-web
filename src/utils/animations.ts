import anime from 'animejs';

// ===== 数字滚动 =====
export const animateCounter = (el: HTMLElement, target: number, duration = 1500) => {
  const obj = { value: 0 };
  return anime({ targets: obj, value: target, duration, easing: 'easeOutExpo', round: true, update: () => { el.textContent = obj.value.toString(); } });
};

// ===== 交错入场（卡片/列表） =====
export const animateCards = (selector: string, opts?: { delay?: number; duration?: number }) => {
  return anime({
    targets: selector,
    opacity: [0, 1],
    translateY: [40, 0],
    scale: [0.92, 1],
    duration: opts?.duration ?? 600,
    delay: anime.stagger(opts?.delay ?? 80, { start: 100 }),
    easing: 'easeOutExpo',
  });
};

// ===== 标题动画 =====
export const animateTitle = (selector: string) => {
  return anime({ targets: selector, opacity: [0, 1], translateY: [20, 0], duration: 800, easing: 'easeOutExpo' });
};

// ===== 淡入 =====
export const animateFadeIn = (selector: string, duration = 500) => {
  return anime({ targets: selector, opacity: [0, 1], duration, easing: 'easeOutExpo' });
};

// ===== 滑入 =====
export const animateSlideIn = (selector: string, dir: 'up' | 'down' | 'left' | 'right' = 'up') => {
  const map = { up: [30, 0], down: [-30, 0], left: [30, 0], right: [-30, 0] };
  const axis = dir === 'up' || dir === 'down' ? 'translateY' : 'translateX';
  return anime({ targets: selector, opacity: [0, 1], [axis]: map[dir], duration: 600, easing: 'easeOutExpo' });
};

// ===== 弹跳 =====
export const animateBounce = (el: HTMLElement) => {
  return anime({ targets: el, scale: [1, 1.15, 1], duration: 400, easing: 'easeOutElastic(1, .6)' });
};

// ===== 悬停进入（弹簧） =====
export const animateHover = (el: HTMLElement) => {
  return anime({ targets: el, scale: 1.03, translateY: -4, duration: 400, easing: 'spring(1, 80, 12, 0)' });
};

// ===== 悬停离开 =====
export const animateHoverOut = (el: HTMLElement) => {
  return anime({ targets: el, scale: 1, translateY: 0, duration: 300, easing: 'easeOutExpo' });
};

// ===== 波纹 =====
export const animateRipple = (el: HTMLElement) => {
  return anime({ targets: el, scale: [0.97, 1], duration: 300, easing: 'easeOutExpo' });
};

// ===== 序列 =====
export const animateSequence = (els: HTMLElement[], opts?: { delay?: number; duration?: number }) => {
  return anime({ targets: els, opacity: [0, 1], translateY: [20, 0], duration: opts?.duration ?? 500, delay: anime.stagger(opts?.delay ?? 60), easing: 'easeOutExpo' });
};

// ===== ✨ 新增：时间线编排 =====
export function createEntranceTimeline(container: string, childSelector: string) {
  const children = document.querySelectorAll(`${container} ${childSelector}`);
  if (!children.length) return null;

  const tl = anime.timeline({ easing: 'easeOutExpo' });
  tl.add({ targets: container, opacity: [0, 1], duration: 300 })
    .add({ targets: children, opacity: [0, 1], translateY: [30, 0], scale: [0.95, 1], duration: 500, delay: anime.stagger(60) }, '-=200');
  return tl;
}

// ===== ✨ 新增：弹簧悬停效果（卡片用） =====
export function springHover(el: HTMLElement, enter: boolean) {
  if (enter) {
    return anime({
      targets: el,
      scale: 1.02,
      translateY: -6,
      boxShadow: '0 20px 50px -12px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06)',
      duration: 500,
      easing: 'spring(1, 80, 10, 0)',
    });
  }
  return anime({
    targets: el,
    scale: 1,
    translateY: 0,
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',
    duration: 350,
    easing: 'easeOutExpo',
  });
}

// ===== ✨ 新增：滚动驱动视差 =====
export function createScrollParallax(selector: string, speed = 0.15) {
  const els = document.querySelectorAll(selector);
  const update = () => {
    els.forEach((el) => {
      const rect = (el as HTMLElement).getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const vh = window.innerHeight;
      if (center > -rect.height && center < vh + rect.height) {
        const offset = (center - vh / 2) * speed;
        (el as HTMLElement).style.transform = `translate3d(0, ${offset}px, 0)`;
      }
    });
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
  return () => window.removeEventListener('scroll', update);
}

// ===== ✨ 新增：平滑惯性滚动 =====
export function smoothScrollTo(target: number, duration = 800) {
  const start = window.scrollY;
  const diff = target - start;
  return anime({
    targets: { val: 0 },
    val: 1,
    duration,
    easing: 'easeInOutExpo',
    update: (anim) => window.scrollTo(0, start + diff * (anim.animations[0].currentValue as number)),
  });
}

export { anime };
