import { useCallback, useEffect, useRef, useState } from 'react';

export type EasterEggToast = {
  id: string;
  title: string;
  body: string;
  emoji: string;
};

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
const SECRET_WORDS: Record<string, { title: string; body: string; emoji: string }> = {
  vista: { title: 'Vista 密语', body: '欢迎回到博客营地。资源分享入口在「开启新创作」。', emoji: '🌲' },
  love: { title: '❤️ 爱的密语', body: '你输入了「love」，全站爱心飘落！', emoji: '❤️' },
  hello: { title: '👋 打招呼', body: '你好呀！欢迎来到林暮野的博客。', emoji: '👋' },
  coffee: { title: '☕ 咖啡时间', body: '来一杯咖啡？阅读时光更惬意。', emoji: '☕' },
  moon: { title: '🌙 月光模式', body: '月光皎洁，适合夜读。', emoji: '🌙' },
  star: { title: '⭐ 星光闪烁', body: '星星点灯，照亮你的阅读之路。', emoji: '⭐' },
  cat: { title: '🐱 猫咪彩蛋', body: '喵~ 一只小猫路过。', emoji: '🐱' },
  snow: { title: '❄️ 雪花飘落', body: '冬日暖阳，雪花轻轻飘落。', emoji: '❄️' },
  music: { title: '🎵 音乐彩蛋', body: '音乐响起，享受阅读时光。', emoji: '🎵' },
  code: { title: '💻 代码彩蛋', body: '程序员的浪漫，藏在代码里。', emoji: '💻' },
};

export function useEasterEggs(options: {
  onToggleManageMode?: () => void;
  onShuffleTheme?: () => void;
}) {
  const { onToggleManageMode, onShuffleTheme } = options;

  const [toasts, setToasts] = useState<EasterEggToast[]>([]);
  const [sparkleMode, setSparkleMode] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [konamiProgress, setKonamiProgress] = useState(0);
  const [heartRain, setHeartRain] = useState(false);
  const [snowMode, setSnowMode] = useState(false);

  const keyBuffer = useRef('');
  const konamiIndex = useRef(0);
  const logoClicks = useRef(0);
  const logoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const footerClicks = useRef(0);
  const footerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pushToast = useCallback((title: string, body: string, emoji: string) => {
    const id = `egg_${Date.now()}`;
    setToasts((prev) => [...prev, { id, title, body, emoji }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5200);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleLogoClick = useCallback(() => {
    logoClicks.current += 1;
    if (logoTimer.current) clearTimeout(logoTimer.current);
    logoTimer.current = setTimeout(() => {
      logoClicks.current = 0;
    }, 600);

    if (logoClicks.current === 3) {
      logoClicks.current = 0;
      setCommandOpen(true);
      pushToast('秘密指令台', '按 Esc 关闭 · 试试搜索「管理」「主题」「彩蛋」', '🧭');
    }
  }, [pushToast]);

  const handleFooterClick = useCallback(() => {
    footerClicks.current += 1;
    if (footerTimer.current) clearTimeout(footerTimer.current);
    footerTimer.current = setTimeout(() => {
      footerClicks.current = 0;
    }, 1200);

    if (footerClicks.current >= 7) {
      footerClicks.current = 0;
      setSparkleMode((s) => !s);
      pushToast(
        sparkleMode ? '星尘已休眠' : '星尘模式开启',
        sparkleMode ? '界面恢复平静。' : '全站微微闪烁，像山野里的萤火。',
        '✨',
      );
    }
  }, [pushToast, sparkleMode]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // 忽略输入框内的按键
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandOpen((o) => !o);
        return;
      }

      if (e.key === 'Escape' && commandOpen) {
        setCommandOpen(false);
        return;
      }

      // Konami Code
      if (e.key === KONAMI[konamiIndex.current]) {
        konamiIndex.current += 1;
        setKonamiProgress(konamiIndex.current);
        if (konamiIndex.current === KONAMI.length) {
          konamiIndex.current = 0;
          setKonamiProgress(0);
          setSparkleMode(true);
          pushToast(
            'Konami 已解锁',
            '你找到了老式游戏机密码！星尘模式已开启。',
            '🎮',
          );
          onShuffleTheme?.();
        }
      } else {
        konamiIndex.current = 0;
        setKonamiProgress(0);
      }

      // Secret words
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        keyBuffer.current = (keyBuffer.current + e.key).slice(-12).toLowerCase();
        if (keyBuffer.current.endsWith('guanli')) {
          keyBuffer.current = '';
          onToggleManageMode?.();
          pushToast('博主模式', '已切换内容管理：可编辑或删除你的文章与微言。', '🛠️');
          return;
        }
        // Check all secret words
        for (const [word, toast] of Object.entries(SECRET_WORDS)) {
          if (keyBuffer.current.endsWith(word)) {
            keyBuffer.current = '';
            pushToast(toast.title, toast.body, toast.emoji);
            // Special effects for certain words
            if (word === 'love') {
              setHeartRain(true);
              setTimeout(() => setHeartRain(false), 5000);
            }
            if (word === 'snow') {
              setSnowMode(true);
              setTimeout(() => setSnowMode(false), 8000);
            }
            break;
          }
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [commandOpen, onShuffleTheme, onToggleManageMode, pushToast]);

  return {
    toasts,
    dismissToast,
    sparkleMode,
    commandOpen,
    setCommandOpen,
    konamiProgress,
    handleLogoClick,
    handleFooterClick,
    pushToast,
    heartRain,
    snowMode,
  };
}
