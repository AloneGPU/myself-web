import anime from 'animejs';

// 数字滚动动画
export const animateCounter = (
  element: HTMLElement,
  target: number,
  duration: number = 1500
) => {
  const obj = { value: 0 };
  return anime({
    targets: obj,
    value: target,
    duration: duration,
    easing: 'easeOutExpo',
    round: true,
    update: () => {
      element.textContent = obj.value.toString();
    }
  });
};

// 卡片交错入场动画
export const animateCards = (selector: string) => {
  return anime({
    targets: selector,
    opacity: [0, 1],
    translateY: [30, 0],
    scale: [0.95, 1],
    duration: 600,
    delay: anime.stagger(100),
    easing: 'easeOutCubic'
  });
};

// 标题文字动画
export const animateTitle = (selector: string) => {
  return anime({
    targets: selector,
    opacity: [0, 1],
    translateY: [-20, 0],
    scale: [0.9, 1],
    duration: 800,
    easing: 'easeOutBack'
  });
};

// 脉冲光效动画
export const animatePulse = (selector: string) => {
  return anime({
    targets: selector,
    scale: [1, 1.05, 1],
    opacity: [0.7, 1, 0.7],
    duration: 2000,
    loop: true,
    easing: 'easeInOutSine'
  });
};

// 悬停弹性效果
export const animateHover = (element: HTMLElement) => {
  return anime({
    targets: element,
    scale: 1.02,
    duration: 200,
    easing: 'easeOutQuad'
  });
};

// 悬停恢复效果
export const animateHoverOut = (element: HTMLElement) => {
  return anime({
    targets: element,
    scale: 1,
    duration: 200,
    easing: 'easeOutQuad'
  });
};

// 波纹点击效果
export const animateRipple = (element: HTMLElement) => {
  return anime({
    targets: element,
    scale: [0.95, 1],
    duration: 150,
    easing: 'easeOutQuad'
  });
};

// 渐入动画
export const animateFadeIn = (selector: string, delay: number = 0) => {
  return anime({
    targets: selector,
    opacity: [0, 1],
    translateY: [20, 0],
    duration: 500,
    delay: delay,
    easing: 'easeOutCubic'
  });
};

// 滑入动画
export const animateSlideIn = (
  selector: string,
  direction: 'left' | 'right' | 'up' | 'down' = 'up'
) => {
  const transforms: Record<string, string[]> = {
    left: ['translateX(-30px)', 'translateX(0)'],
    right: ['translateX(30px)', 'translateX(0)'],
    up: ['translateY(30px)', 'translateY(0)'],
    down: ['translateY(-30px)', 'translateY(0)']
  };

  return anime({
    targets: selector,
    opacity: [0, 1],
    translateX: transforms[direction][0],
    translateY: transforms[direction][1],
    duration: 600,
    easing: 'easeOutCubic'
  });
};

// 闪烁动画
export const animateBlink = (selector: string) => {
  return anime({
    targets: selector,
    opacity: [1, 0.5, 1],
    duration: 1000,
    loop: true,
    easing: 'easeInOutSine'
  });
};

// 弹跳动画
export const animateBounce = (selector: string) => {
  return anime({
    targets: selector,
    translateY: [0, -10, 0],
    duration: 600,
    easing: 'easeOutBounce'
  });
};

// 旋转动画
export const animateRotate = (selector: string, degrees: number = 360) => {
  return anime({
    targets: selector,
    rotate: `+=${degrees}deg`,
    duration: 800,
    easing: 'easeOutCubic'
  });
};

// 缩放呼吸效果
export const animateBreath = (selector: string) => {
  return anime({
    targets: selector,
    scale: [1, 1.03, 1],
    duration: 3000,
    loop: true,
    easing: 'easeInOutSine'
  });
};

// 进度条动画
export const animateProgress = (element: HTMLElement, progress: number) => {
  return anime({
    targets: element,
    width: `${progress}%`,
    duration: 1000,
    easing: 'easeOutCubic'
  });
};

// 序列动画
export const animateSequence = (elements: HTMLElement[], options?: {
  delay?: number;
  duration?: number;
  easing?: string;
}) => {
  const timeline = anime.timeline({
    easing: options?.easing || 'easeOutCubic',
    duration: options?.duration || 500
  });

  elements.forEach((el, index) => {
    timeline.add({
      targets: el,
      opacity: [0, 1],
      translateY: [20, 0],
      scale: [0.95, 1]
    }, index * (options?.delay || 100));
  });

  return timeline;
};

// 导出 anime 实例供高级用法
export { anime };
