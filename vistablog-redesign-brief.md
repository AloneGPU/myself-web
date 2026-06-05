# VistaBlog 全面重设计简报
**AI 可执行的结构化改造规范 · v2.0**
项目：myself-web · 定位：沉浸式数字花园 · 技术栈：React 19 + TypeScript + Vite 6 + Tailwind CSS v4

---

## 零、改造前必读（AI 执行前置检查）

```bash
# 1. 确认框架已就位
cd myself-web-main && cat package.json | grep '"react"\|"vite"\|"motion"'
# 期望输出：react ^19, vite ^6, motion ^12

# 2. 读取项目设计文档
cat PRODUCT.md && cat DESIGN.md

# 3. 激活 impeccable skill（项目内置，无需安装）
node .claude/skills/impeccable/scripts/context.mjs

# 4. 确认 CSS 变量入口
grep -n "accent-vibe-color\|--accent" src/index.css src/App.tsx
# App.tsx line 420-423 已有 CSS 变量注入点，后续所有 accent 改造接入此处
```

---

## 一、项目核心定位（改造基准）

| 维度 | 定义 |
|------|------|
| 项目名称 | VistaBlog |
| 定位 | 沉浸式数字花园：个人生活记录 + 风景摄影分享 + 学习资料整理 + 优质资源收藏 |
| 目标用户 | 同学、朋友、访客——移动端为主，校园网环境 |
| 视觉参考 | Apple 官网（高级感克制）+ 极客湾（暗色沉浸）+ Midjourney 官网（全屏视觉主导） |
| 情绪关键词 | 静谧 · 深邃 · 精致 · 有温度 · 探索感 |
| 禁止方向 | 纯作品集式（Owner 头像主导）· 过度玻璃化每个面板 · 依赖海外 CDN |

---

## 二、背景系统重构（最高优先级）

### 目标效果

参考 **Apple.com** 的全屏渐进沉浸 + **Midjourney** 的背景即内容 + **极客湾** 的视频环境氛围。背景不是"壁纸"，背景就是页面本身的一部分。

### 2.1 智能动静自动切换逻辑

**文件**：`src/components/DynamicBackground.tsx` + 新建 `src/hooks/useBackground.ts`

```typescript
// useBackground.ts — 新建文件
// 职责：统一管理背景模式、自动切换规则、时间感知

type BgMode = 'static' | 'video' | 'auto';

interface BackgroundController {
  mode: BgMode;
  setMode: (m: BgMode) => void;
  isVideoActive: boolean;
  shouldUseVideo: boolean; // 综合判断结果
}

// 自动切换规则（按优先级排列）：
// Rule 1: prefers-reduced-motion → 强制 static
// Rule 2: navigator.getBattery().level < 0.2 → 强制 static
// Rule 3: 用户最近 30s 内有鼠标移动/滚动 + 当前主题有 videoUrl → 升级为 video
// Rule 4: 页面隐藏（visibilitychange hidden）→ 暂停视频（不降级，恢复后继续）
// Rule 5: 连接类型 2g/slow-2g → 强制 static

// 时间感知主题自动匹配：
const getTimeBasedThemeId = (): string => {
  const h = new Date().getHours();
  if (h >= 5  && h < 10) return 'sunrise-ocean';  // 晨 → 暖调海岸
  if (h >= 10 && h < 18) return 'forest-lake';    // 日 → 翡翠湖
  if (h >= 18 && h < 21) return 'misty-mountain'; // 昏 → 雾山
  return 'starry-peaks';                           // 夜 → 星空（indigo）
};
// 仅首次加载应用，用户手动切换后存入 localStorage 覆盖
```

### 2.2 DynamicBackground 组件升级

**改造要点**：

```typescript
// 现状问题：
// - 图片切换使用 AnimatePresence mode="wait"（串行，感觉慢）
// - 视频/图片各自独立 AnimatePresence，切换时黑屏闪烁
// - 右上角状态指示器"🎬 视频背景"信息密度低

// 目标方案：

// ① 背景层叠结构（z-index 从下到上）：
// Layer 0: 纯色底 bg-slate-950（防加载空白）
// Layer 1: 静态图片（始终存在，作为视频的兜底）
// Layer 2: 视频层（opacity 0→1 淡入，不使用 wait 模式）
// Layer 3: CSS 渐变遮罩（固定，不参与动画）
// Layer 4: 视差位移层（mousePos / gyroscope 驱动）

// ② 图片切换过渡升级：
// 使用 crossfade（新图淡入同时旧图淡出）替代 wait 模式
// 配合 scale(1.04→1.0) + blur(4px→0)，参考 Apple 官网
// duration: 1.2s ease-out-quart

// ③ 视差效果：
// PC端：mousePos.x/y → translateX/Y（已有 mousePos state，接入即可）
//   transform: `translateX(${mousePos.x * -0.018}px) translateY(${mousePos.y * -0.012}px) scale(1.04)`
// 移动端：DeviceOrientationEvent gamma/beta → 等效 mousePos（需 iOS requestPermission）
// 强度：最大位移 ±16px，scale 始终保持 1.04 防边缘露白

// ④ 新增背景 HUD（替换右上角状态角标）：
// 位置：左下角 fixed，z-50
// 形态：紧凑胶囊（默认态）→ 点击展开主题选择器
// 默认态：主题名 + 动/静图标 + 小圆点（视频播放脉冲动画）
// 展开态：最多 6 个主题缩略图（用 thumbnailUrl 200×120 webp）+ "自动"切换开关
// 动画：展开用 motion 的 height: 0→auto + opacity + stagger 子元素

// ⑤ 移除右上角现有状态角标（已被 HUD 取代）
```

### 2.3 manifest.json 扩展

```json
// 每个 theme 新增以下字段：
{
  "thumbnailUrl": "/vistablog/bg/thumbnails/forest-lake-thumb.webp",
  "mood": "tranquil",
  "timeSlot": "morning",
  "hasVideo": false
}
// thumbnailUrl: 200×120 WebP，用于 HUD 主题缩略图预览
// mood: tranquil / mysterious / ethereal / vibrant（影响粒子颜色）
// timeSlot: morning / day / dusk / night（时间感知自动匹配）
```

---

## 三、音乐播放器（保留 + 深度增强）

**文件**：`src/components/MusicPlayer.tsx`

### 3.1 三态交互设计

```
状态机：mini（默认）→ expanded（展开）→ focus（专注全屏）
                ↑_____________________________↑
                    任意态点击收起/关闭

mini 态（悬浮角落，不遮挡内容）：
  - 左下角固定，z-40，尺寸约 300×64px
  - 专辑封面圆形旋转（CSS animation rotate 8s linear infinite，暂停时 pause）
  - 曲名跑马灯：单行超长文字 marquee（CSS animation）
  - 当前歌词单行：opacity 0.7，字号 11px
  - 按钮：上一曲 · 播放/暂停 · 下一曲（各 32×32px）
  - 进度条：2px 高，hover → 6px（CSS transition）

expanded 态（底部 sheet）：
  - 从 mini 态向上展开，高度约 420px
  - 专辑封面 120×120px，左侧；信息 + 控制，右侧
  - 歌词滚动区：当前句 accent color + font-size 1.05 + glow
    其余行 opacity: 0.4，过渡 0.35s ease
  - 播放列表切换按钮（ListMusic icon）
  - 进度条可拖拽，touch 设备 padding: 12px 上下扩大触控区
  - 移动端：作为 bottom sheet，支持手势下滑关闭（motion drag）

focus 态（全屏专注模式）：
  - 点击封面触发，覆盖整个视口
  - 背景：专辑封面高斯模糊 40px + 暗化，类似 iOS 锁屏音乐
  - 大号专辑封面居中旋转（200×200px）
  - 歌词大字体居中滚动（font-size clamp(1.1rem, 3vw, 1.5rem)）
  - ESC / 点击空白 / 向下滑动 → 退出
  - 进度条在底部，宽度 60vw，居中
```

### 3.2 白噪音 + 音乐联动

```typescript
// 现状：Web Audio Noise Synthesizer 与 MusicPlayer 完全独立
// 问题：同时开启会互相干扰

// 改造：在 App.tsx 中协调两个 gain node
// 当 MusicPlayer 开始播放：
//   gainNode.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 2); // 白噪音淡至 0.03
// 当 MusicPlayer 暂停/停止：
//   gainNode.gain.linearRampToValueAtTime(originalVolume, ctx.currentTime + 2); // 白噪音恢复

// MusicPlayer 暴露 onPlayStateChange: (isPlaying: boolean) => void 回调
// App.tsx 中 handlePlayStateChange 协调两个音频系统
```

### 3.3 FALLBACK 音源替换

```typescript
// 现有 FALLBACK 使用 freesound.org（国内访问不稳定）
// 替换为：
const FALLBACK: Song[] = [
  {
    id: 'local-1',
    title: '白噪音 - 森林',
    artist: 'VistaBlog 内置',
    url: '/vistablog/audio/forest-ambient.mp3', // 本地托管
    cover: '/vistablog/covers/forest.webp'
  },
  // NCM API 作为主要来源，FALLBACK 仅作离线兜底
];
// .env.local 新增：VITE_NCM_API=https://ncm-api.vercel.app（可配置）
```

---

## 四、视觉系统重构（Apple / 极客湾 高级感）

### 4.1 CSS 变量体系统一

**文件**：`src/index.css`

```css
/* 现状：accentColor 为 Tailwind class 字符串，注入有限 */
/* 目标：所有 accent 改为 CSS 变量驱动 */

:root {
  /* 主题动态注入（App.tsx line 420 已有此机制，扩展即可）*/
  --bg-accent:        oklch(0.72 0.18 155);  /* emerald 示例 */
  --bg-accent-dim:    oklch(0.55 0.14 155);
  --bg-accent-glow:   oklch(0.72 0.18 155 / 0.25);
  --bg-accent-subtle: oklch(0.72 0.18 155 / 0.08);

  /* 固定系统色 */
  --surface-0:  oklch(0.08 0.01 240);   /* 最深底面 */
  --surface-1:  oklch(0.12 0.015 240);  /* 卡片底面 */
  --surface-2:  oklch(0.18 0.015 240);  /* 悬浮面板 */
  --ink-primary:   oklch(0.97 0 0);
  --ink-secondary: oklch(0.72 0.015 240);
  --ink-muted:     oklch(0.52 0.01 240);

  /* 玻璃拟态标准化 */
  --glass-bg:     oklch(0.12 0.015 240 / 0.55);
  --glass-border: oklch(1 0 0 / 0.08);
  --glass-blur:   16px;
}

/* 统一 .glass-panel 使用 CSS 变量而非硬编码 rgba */
.glass-panel {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
}

/* focus-visible 使用变量 */
button:focus-visible,
a:focus-visible {
  outline: 2px solid var(--bg-accent);
  outline-offset: 3px;
}

/* 滚动条使用变量 */
::-webkit-scrollbar-thumb {
  background: var(--bg-accent-subtle);
}
::-webkit-scrollbar-thumb:hover {
  background: var(--bg-accent-dim);
}
```

### 4.2 字体系统（无 Google Fonts 依赖）

```css
/* 遵循 DESIGN.md 规范，补充变量化 */
:root {
  --font-display: "Noto Serif SC", "Songti SC", "SimSun", Georgia, serif;
  --font-body: system-ui, -apple-system, BlinkMacSystemFont,
               "Segoe UI", "Microsoft YaHei", "PingFang SC",
               "Hiragino Sans GB", sans-serif;
  --font-mono: "SFMono-Regular", Consolas, "Liberation Mono", monospace;

  --text-display:  clamp(1.75rem, 4vw, 3rem);   /* 页面主标题 */
  --text-heading:  clamp(1.25rem, 2.5vw, 1.75rem);
  --text-body:     1rem;
  --text-small:    0.875rem;
  --text-caption:  0.75rem;
}

h1, h2 {
  font-family: var(--font-display);
  letter-spacing: -0.02em;   /* 不低于 -0.04em 的底限 */
  text-wrap: balance;
}

p {
  max-width: 65ch;
  text-wrap: pretty;
}
```

### 4.3 卡片系统升级（Spotlight + 层次感）

```typescript
// src/components/CardSpotlight.tsx 已存在但使用率极低
// 目标：在所有 PostCard / MomentCard 上包裹 CardSpotlight

// CardSpotlight 升级要点：
// 1. spotlight radial-gradient 颜色跟随 var(--bg-accent-glow)
// 2. 卡片 hover 时 border-color → var(--bg-accent) / 0.35
// 3. hover 时顶部出现 1px accent 色高光线（::before pseudo）
// 4. 移动端禁用 spotlight（仅 pointer: fine 设备启用）

// 示例 CSS-in-JS（或 Tailwind arbitrary value）：
// background: `radial-gradient(400px circle at ${x}px ${y}px,
//   var(--bg-accent-glow), transparent 60%)`
```

---

## 五、交互效果升级（高级感核心）

### 5.1 页面进入 Stagger 动画

```typescript
// Tab 切换时卡片列表 stagger 入场
// 使用 motion variants，现有 AnimatePresence 已就位，补充即可

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.055, delayChildren: 0.05 }
  }
};

const itemVariants = {
  hidden:  { opacity: 0, y: 18, filter: 'blur(4px)' },
  visible: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } // ease-out-quint
  }
};

// 注意：最多 stagger 前 8 个卡片，之后的卡片同时出现（防止等待感）
// stagger 上限：Math.min(items.length, 8) * 0.055 = 0.44s 总延迟
```

### 5.2 Hero 区域滚动视差

```typescript
// 左侧 Profile Panel 头像 + 名字区域
// 使用 motion useScroll + useTransform

import { useScroll, useTransform, motion } from 'motion/react';

const { scrollY } = useScroll();
const avatarY    = useTransform(scrollY, [0, 200], [0, -30]);
const nameOpacity = useTransform(scrollY, [0, 150], [1, 0.4]);
const nameFontW  = useTransform(scrollY, [0, 150], [600, 400]); // font-weight 动态变化
// 注意：font-weight 动画需用 fontVariationSettings 或 Tailwind JIT，不是原生 CSS 过渡

// <motion.div style={{ y: avatarY }}><Avatar /></motion.div>
// <motion.h1 style={{ opacity: nameOpacity }}>Alone</motion.h1>
```

### 5.3 ClickEffect 多色涟漪升级

```typescript
// 现状：ClickEffect.tsx 效果单一（白色圆圈）
// 目标：涟漪颜色跟随 var(--bg-accent)

// 改造：将 ClickEffect 的涟漪颜色改为读取 CSS 变量
const color = getComputedStyle(document.documentElement)
  .getPropertyValue('--bg-accent').trim() || '#10b981';

// 移动端改为 scale 弹跳反馈，不做涟漪（避免性能问题）
// if (window.matchMedia('(pointer: coarse)').matches) → scale 0.97 bounce
```

### 5.4 骨架屏（替换现有 loading 文字）

```typescript
// 现状：LazyPanelFallback 显示"正在加载互动模块..."纯文字
// 目标：与 glass-card 等比例骨架屏 + shimmer 扫光动画

// CSS shimmer（与主题色联动）：
@keyframes shimmer {
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--surface-1) 25%,
    var(--bg-accent-subtle) 50%,
    var(--surface-1) 75%
  );
  background-size: 400px 100%;
  animation: shimmer 1.4s ease-in-out infinite;
  border-radius: 12px;
}

// 骨架结构模拟真实卡片：
// - 封面占位（16:9 ratio）
// - 标题行（80% 宽）
// - 副标题行（60% 宽）
// - 底部元数据行（40% 宽）
```

### 5.5 导航 Tab 升级

```typescript
// 现状：Tab 点击区域约 36px，低于 WCAG 44px
// 目标：
// - 高度 → min-height: 48px（desktop）/ 52px（mobile）
// - 激活态：accent color 下划线 2px + 文字 + 内侧 glow
// - 激活下划线动画：用 layoutId="tab-indicator" 实现 motion 共享元素过渡
//   （同一 DOM 树内 layout 动画，类似 iOS tab bar 胶囊效果）
// - 未读动态 Badge：小红点（绝对定位，右上角）

// 示例：
<AnimatePresence>
  {isActive && (
    <motion.div
      layoutId="tab-indicator"
      className="absolute bottom-0 left-0 right-0 h-0.5"
      style={{ background: 'var(--bg-accent)' }}
      transition={{ type: 'spring', stiffness: 500, damping: 40 }}
    />
  )}
</AnimatePresence>
```

---

## 六、信息架构优化

### 6.1 页面区域层级重新定义

```
当前问题：ResourceDiscoveryHub 与 PostFeed 视觉层级并列，
          用户不清楚从何开始；左侧 Profile 面板占据过多屏幕空间

目标布局（desktop）：

┌──────────────────────────────────────────────────────┐
│  全屏背景（DynamicBackground 占据整个视口）             │
├──────────┬───────────────────────────────────────────┤
│  左侧     │  顶部：快速入口区（ResourceDiscoveryHub）    │
│  Profile │  ─────────────────────────────────────── │
│  Panel   │  主内容：PostFeed / MomentFeed / About     │
│  (粘性)   │                                          │
│          │                                          │
└──────────┴───────────────────────────────────────────┘

左侧 Profile Panel 变化：
- 不再占满高度，仅展示头像 + 名字 + 简介 + 导航 + 社交链接
- 宽度从 ~ 280px 缩减至 240px（视口 > 1024px 才展示）
- 移动端：完全折叠为顶部 header bar

ResourceDiscoveryHub：
- 独立为"快速入口区"，置于主内容上方
- 使用 3 列图标卡片（学习资料 / 风景摄影 / 资源收藏）
- 不再与 PostFeed 列表混排
```

### 6.2 搜索体验升级

```typescript
// 现状：搜索框始终可见，但样式普通
// 目标：
// - 默认状态：透明，仅显示搜索图标（占位符"搜索文章、资源..."）
// - 聚焦时：展开为全宽，backdrop-blur 增强，border accent color
// - 输入时：实时高亮匹配文字（<mark> 标签包裹）
// - Ctrl+K 已绑定 CommandPalette，保持不变

// 搜索结果高亮：
const highlight = (text: string, query: string) => {
  if (!query) return text;
  const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(re, '<mark class="bg-[var(--bg-accent-subtle)] text-[var(--bg-accent)] rounded-sm px-0.5">$1</mark>');
};
```

---

## 七、移动端体验补强

```typescript
// 问题清单及方案：

// 1. 视差改为陀螺仪驱动
if ('DeviceOrientationEvent' in window) {
  // iOS 13+ 需申请权限
  if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    // 在用户手势事件中调用（如点击背景）
    DeviceOrientationEvent.requestPermission().then(state => {
      if (state === 'granted') listenOrientation();
    });
  } else {
    listenOrientation();
  }
}
// gamma（±90°，左右倾斜）→ mousePos.x 等效
// beta （±180°，前后倾斜）→ mousePos.y 等效（仅取 ±30° 范围内）
// 映射：x = (gamma / 30) * 8, y = ((beta - 45) / 30) * 8（单位 px）

// 2. MusicPlayer 移动端 bottom sheet
// expanded 状态 → position: fixed, bottom: 0, left: 0, right: 0
// height: 65vh，rounded-t-3xl
// motion drag="y" dragConstraints={{ top: 0 }} onDragEnd: 下滑超过 80px → 收起
// 背景遮罩：AnimatePresence + motion.div opacity 0→0.4

// 3. PostFeed 响应式网格
// grid-cols-1 (< 640px) → grid-cols-2 (640–1024px) → grid-cols-3 (> 1280px)
// Tailwind: className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"

// 4. Touch 反馈替代 hover
// @media (hover: none)：禁用 glass-card 的 translateY hover（已有，确保保留）
// 替代：active:scale-[0.98] active:brightness-90（触碰时的缩放暗化反馈）
```

---

## 八、性能优化

### 8.1 Bundle 瘦身

```bash
# 检查 bundle 体积
npx vite build --analyze
# 预期问题：animejs + motion 重叠，defaultData.ts 长文内容占 ~23KB

# 方案 A：animejs 逐步替换为 motion（已安装）
# animateCounter → motion.animate(el, { value: [0, target] }, { duration })
# animateCards / animateTitle → motion variants（已在 5.1 中定义）

# 方案 B：长文内容外移
# src/data/defaultData.ts 中的 BlogPost.content 字段（每篇 ~2000 字）
# 移入 public/vistablog/posts/{id}.md
# 阅读时动态 fetch：
const content = await fetch(`/vistablog/posts/${post.id}.md`).then(r => r.text());
# defaultData.ts 中 content 字段替换为 '' 或 summary 文本
```

### 8.2 图片优化

```typescript
// 新建 src/components/LazyImage.tsx
interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string; // 如 "16/9"
}

// 实现：
// 1. loading="lazy" + decoding="async"
// 2. 占位符：与主题 accent 色相关的渐变，尺寸与实际图片一致（避免布局偏移）
// 3. onLoad → 图片淡入：opacity 0 → 1，transition 0.4s
// 4. onError → 显示 fallback（accent 色背景 + 图标）

// 背景图额外处理：
// manifest.json 中每个主题新增 thumbnailUrl（200×120 WebP）
// 主题 HUD 选择器使用 thumbnailUrl，不加载全尺寸背景
```

### 8.3 代码分割优化

```typescript
// 现有懒加载（已有，确认保留）：
const ReaderModal     = lazy(() => import('./components/ReaderModal'));     // 44KB
const WritePostModal  = lazy(() => import('./components/WritePostModal'));   // 39KB
const WeeklyViewsChart= lazy(() => import('./components/WeeklyViewsChart')); // recharts
const DanmakuOverlay  = lazy(() => import('./components/DanmakuOverlay'));  // 16KB

// 新增懒加载：
const WildernessSandbox = lazy(() => import('./components/WildernessSandbox')); // 82KB！最大
// 注意：WildernessSandbox 是最大的懒加载目标，目前注释说 "removed" 但文件仍存在
```

---

## 九、App.tsx 架构拆分（技术债）

**当前问题**：1686 行单文件，包含所有 state + handler + JSX

**目标结构**：

```
src/
├── App.tsx                        ← 仅顶层 Provider + 骨架（目标 < 120 行）
├── layouts/
│   └── MainLayout.tsx             ← 左栏 + 右栏布局逻辑
├── features/
│   ├── background/
│   │   ├── BackgroundController.tsx
│   │   └── useBackground.ts       ← 新建（第二节）
│   ├── blog/
│   │   ├── PostFeed.tsx           ← 从 App.tsx 提取
│   │   ├── PostCard.tsx
│   │   └── usePosts.ts            ← posts / setPosts + 持久化逻辑
│   ├── moments/
│   │   └── MomentFeed.tsx
│   └── profile/
│       └── ProfilePanel.tsx
├── store/
│   └── useAppStore.ts             ← 集中 state（useReducer 或 Zustand）
└── components/                    ← 保持现有通用组件不动
    ├── MusicPlayer.tsx
    ├── DynamicBackground.tsx
    ├── CardSpotlight.tsx
    ├── CommandPalette.tsx
    └── ...
```

**迁移注意**：
- localStorage key 全部保持不变（`vistablog_*`），确保数据向后兼容
- CSS 变量注入逻辑（App.tsx line 417-424）迁移至 `useBackground.ts`
- `style` 对象（accentText / accentBg / accentBorder 等）迁移至 `useAppStore`

---

## 十、新增功能建议

### 10.1 "时光胶囊"区块

```typescript
// 在 Profile Panel 下方新增小模块：
// 显示今日日期 + 该日期历史上的一篇文章（随机）
// 标题："🕰️ 历史上的今天" 或 "一年前的 Alone"
// 实现：从 posts 中按 publishDate 月/日匹配
const todayMD = `${new Date().getMonth() + 1}-${new Date().getDate()}`;
const capsule = posts.find(p => p.publishDate.slice(5) === todayMD.padStart(5, '0'));
```

### 10.2 阅读进度指示器

```typescript
// ReaderModal 内文章阅读时，顶部显示阅读进度条
// 颜色：var(--bg-accent)，高度 2px
// 计算：(scrollTop / (scrollHeight - clientHeight)) * 100
// 实现：在 ReaderModal 的滚动容器上监听 scroll 事件
```

### 10.3 相机感 EXIF 信息卡

```typescript
// 风景摄影类文章（category === '旅行摄影'）封面图悬停时
// 显示仿相机 EXIF 信息浮层：
// 📷 f/2.8 · 1/250s · ISO 400 · 24mm
// 数据来源：BlogPost 新增 exif 字段（可选）
// 样式：底部条带，等宽数字字体，var(--font-mono)
```

---

## 十一、文件改动优先级清单

| 优先级 | 文件/模块 | 改动类型 | 目标效果 |
|--------|-----------|----------|----------|
| **P0** | `src/components/DynamicBackground.tsx` | 重构 | 视差 + 交叉淡入 + 自动切换 |
| **P0** | `src/hooks/useBackground.ts` (新建) | 新建 | 背景状态统一管理 |
| **P0** | `src/components/MusicPlayer.tsx` | 增强 | 三态 + 歌词高亮 + 联动 |
| **P0** | `src/index.css` | 重构 | CSS 变量体系 + OKLCH |
| **P1** | `src/components/CardSpotlight.tsx` | 扩展 | 全面启用 accent 色 spotlight |
| **P1** | `src/App.tsx` (Tab 导航部分) | 改造 | layoutId 胶囊动画 + 44px 触控 |
| **P1** | `public/vistablog/manifest.json` | 扩展 | thumbnailUrl + mood + timeSlot |
| **P2** | `src/App.tsx` → `src/features/` | 拆分 | 架构健康度 |
| **P2** | `src/data/defaultData.ts` | 精简 | 长文外移 public/ |
| **P2** | `src/utils/animations.ts` | 重构 | animejs → motion 统一 |
| **P3** | `src/components/LazyImage.tsx` (新建) | 新建 | 图片懒加载 + 占位符 |
| **P3** | `src/App.tsx` (搜索部分) | 改造 | 实时高亮搜索结果 |

---

## 十二、绝对约束（AI 改造时不得违反）

```
[HARD_CONSTRAINTS]
1. 不引入任何中国大陆不可访问的外部 CDN
   × Google Fonts  × unpkg.com（部分被墙）× fonts.googleapis.com
   ✓ 系统字体栈  ✓ jsDelivr (cdnjs.cloudflare.com)  ✓ 本地 public/ 托管

2. localStorage 兼容性
   不得修改或删除以下 key：
   - vistablog_manage_mode
   - vistablog_theme_id
   - vistablog_custom_bg
   - vistablog_posts（如存在）

3. prefers-reduced-motion 必须支持
   所有新增动画必须在 @media (prefers-reduced-motion: reduce) 中提供替代方案
   (src/index.css 底部已有全局覆盖规则，扩展时继续维护)

4. 背景亮度不得提升
   DynamicBackground 中 brightness-[0.4] 为文字可读性保障，
   任何背景图/视频的 filter brightness 值不得高于 0.5

5. TypeScript 严格模式不降级
   tsconfig.json strict: true 保持，新代码必须通过 npm run lint

6. 音乐功能必须保留
   MusicPlayer、useBackgroundMusic、NCM API 集成全部保留，
   仅允许增强，不允许删除

7. 所有新增动画 duration < 700ms
   超过 700ms 的动画会造成"卡顿感"，除背景切换（1.2s）外均须遵守

8. 移动端 touch target ≥ 44×44px
   所有可交互元素（按钮、Tab、链接）的实际点击区域不得小于 44px
```

---

## 十三、Skill 调用索引（含地址）

### 项目内置 Skill（推荐优先使用）

| Skill 名称 | 调用路径 | 核心用途 | 适用改造项 |
|-----------|---------|---------|-----------|
| **impeccable** (主入口) | `.claude/skills/impeccable/SKILL.src.md` | 全套前端精工改造 | 所有视觉/交互改造 |
| impeccable/**animate** | `.claude/skills/impeccable/reference/animate.md` | 动画实现规范（stagger/entrance/micro） | 第五节交互升级 |
| impeccable/**delight** | `.claude/skills/impeccable/reference/delight.md` | 微交互惊喜感设计 | ClickEffect 涟漪、EasterEgg |
| impeccable/**colorize** | `.claude/skills/impeccable/reference/colorize.md` | 战略色彩系统 OKLCH | 第四节 CSS 变量体系 |
| impeccable/**craft** | `.claude/skills/impeccable/reference/craft.md` | 从 brief 到生产代码完整流程 | 背景 HUD、音乐播放器三态 |
| impeccable/**polish** | `.claude/skills/impeccable/reference/polish.md` | 最终精修 QA | 全面上线前检查 |
| impeccable/**overdrive** | `.claude/skills/impeccable/reference/overdrive.md` | 突破常规的技术雄心效果 | 全屏视差背景、专注模式 |
| impeccable/**interaction-design** | `.claude/skills/impeccable/reference/interaction-design.md` | 8 态交互规范、焦点环 | Tab 导航、MusicPlayer 手势 |
| impeccable/**layout** | `.claude/skills/impeccable/reference/layout.md` | 布局/间距/容器规范 | App.tsx 架构拆分 |
| impeccable/**typeset** | `.claude/skills/impeccable/reference/typeset.md` | 字体选择/层级/OpenType | 第四节字体系统 |
| impeccable/**optimize** | `.claude/skills/impeccable/reference/optimize.md` | 性能优化规范 | 第八节 bundle 瘦身 |
| impeccable/**adapt** | `.claude/skills/impeccable/reference/adapt.md` | 响应式适配 | 第七节移动端补强 |
| impeccable/**bolder** | `.claude/skills/impeccable/reference/bolder.md` | 视觉加强/冲击力提升 | 背景系统高级感 |
| impeccable/**shape** | `.claude/skills/impeccable/reference/shape.md` | 设计方向确认 brief | 开始任何新功能前 |
| impeccable/**critique** | `.claude/skills/impeccable/reference/critique.md` | 系统性 UX/UI 审查 | 改造完成后审计 |

**激活方式**：
```bash
# 在 myself-web-main 目录下，告知 Claude 读取对应 reference 文件
# 例如要做动画改造，在 prompt 中附上：
# "请先读取 .claude/skills/impeccable/reference/animate.md 作为动画规范"
```

### 公共 Skill（Claude.ai 系统级）

| Skill 名称 | 调用位置 | 用途 | 适用场景 |
|-----------|---------|------|---------|
| **frontend-design** | `/mnt/skills/public/frontend-design/SKILL.md` | 生成高质量视觉组件代码，避免 AI 通用审美 | 重构背景 HUD、骨架屏、新增组件 |
| **docx** | `/mnt/skills/public/docx/SKILL.md` | Word 文档生成 | 导出项目文档（非本次重点） |
| **pdf** | `/mnt/skills/public/pdf/SKILL.md` | PDF 处理 | 学习资料 PDF 预览（扩展需求） |

### 热门第三方资源（直接引用）

| 资源 | 地址 | 用途 |
|------|------|------|
| Motion (motion/react) 文档 | https://motion.dev/docs | stagger / layout / useScroll |
| OKLCH 色彩工具 | https://oklch.com | 生成主题色 token |
| Tailwind CSS v4 文档 | https://tailwindcss.com/docs | 新语法确认 |
| Lucide Icons（已安装） | https://lucide.dev/icons | 图标搜索，不引入新图标库 |
| cdnjs（备用 CDN） | https://cdnjs.cloudflare.com | 国内可访问的脚本 CDN |

---

*本文档可直接作为 Claude AI 改造任务的系统上下文输入。AI 执行前请先运行第零节的前置检查命令。*
