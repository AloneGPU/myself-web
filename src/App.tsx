import React, { lazy, Suspense, useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Feather,
  Flame,
  Search,
  Filter,
  Volume2,
  VolumeX,
  PlusCircle,
  Clock,
  Heart,
  MessageSquare,
  ChevronRight,
  Compass,
  Instagram,
  Github,
  MapPin,
  Smile,
  Send,
  Sparkles,
  BookOpen,
  Info,
  Calendar,
  Layers,
  ChevronDown,
  Download,
  ArrowUp,
  Share2,
  Copy,
  Check,
  Trash2,
  Pencil,
  Settings2,
} from 'lucide-react';
import ConfirmDialog from './components/ConfirmDialog';
import CommandPalette, { paletteIcons } from './components/CommandPalette';
import EasterEggToasts from './components/EasterEggToasts';
import { HeartRain, SnowMode, SparkleEffect } from './components/EasterEggEffects';
import { useEasterEggs } from './hooks/useEasterEggs';
import { postHasShareableResource } from './utils/postResources';
import { animateCounter, animateCards, animateTitle, animateBounce, anime } from './utils/animations';
import MusicPlayer from './components/MusicPlayer';
import ClickEffect from './components/ClickEffect';
import Fireflies from './components/Fireflies';
import MouseGlow from './components/MouseGlow';

import { BackgroundTheme, BlogPost, Moment, ActiveTab, Comment, CrawledBackground } from './types';
import { BACKGROUND_THEMES, INITIAL_BLOG_POSTS, INITIAL_MOMENTS } from './data/defaultData';
import ResourceDiscoveryHub from './components/ResourceDiscoveryHub';
import DynamicBackground from './components/DynamicBackground';
import { findThemeById, useMediaManifest } from './hooks/useMediaManifest';
import { useBackground, useSavedTheme } from './hooks/useBackground';
import ReadingProgressBar from './components/ReadingProgress';
import ScrollToTop from './components/ScrollToTop';
import AdminPanel from './components/AdminPanel';

const ReaderModal = lazy(() => import('./components/ReaderModal'));
const WritePostModal = lazy(() => import('./components/WritePostModal'));
// WildernessSandbox removed
const WeeklyViewsChart = lazy(() => import('./components/WeeklyViewsChart'));
const DanmakuOverlay = lazy(() => import('./components/DanmakuOverlay'));

const LazyPanelFallback = ({ label = '正在加载互动模块...' }: { label?: string }) => (
  <div className="wallpaper-tuner glass-panel rounded-3xl p-6 text-center text-sm text-slate-300">
    {label}
  </div>
);

export default function App() {
  const {
    themes,
    themeVideos,
    crawledBackgrounds,
    music,
    manifest,
    source: manifestSource,
    refresh: refreshManifest,
  } = useMediaManifest();

  const backgroundThemes = themes.length > 0 ? themes : BACKGROUND_THEMES;

  // ----- States -----
  const [activeTab, setActiveTab] = useState<ActiveTab>('posts');
  const [currentTheme, setCurrentTheme] = useState<BackgroundTheme>(BACKGROUND_THEMES[0]);
  const [customBgUrl, setCustomBgUrl] = useState<string | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [moments, setMoments] = useState<Moment[]>([]);
  const [downloadingPostId, setDownloadingPostId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [currentGreeting, setCurrentGreeting] = useState('');
  const [isDanmakuVisible, setIsDanmakuVisible] = useState(false);

  // Modals
  const [readingPost, setReadingPost] = useState<BlogPost | null>(null);
  const [isWriteOpen, setIsWriteOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [editingMoment, setEditingMoment] = useState<Moment | null>(null);
  const [isManageMode, setIsManageMode] = useState(
    () => localStorage.getItem('vistablog_manage_mode') === '1',
  );
  const [confirmDialog, setConfirmDialog] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const { mode: bgMode, setMode: setBgMode, isVideoActive } = useBackground(backgroundThemes, !!themeVideos[currentTheme.id]);
  const { useAutoTheme, setUseAutoTheme, saveThemeId } = useSavedTheme();
  const handleThemeChange = useCallback((theme: BackgroundTheme) => {
    setCurrentTheme(theme);
    setCustomBgUrl(null);
    localStorage.removeItem('vistablog_custom_bg');
    localStorage.setItem('vistablog_theme_id', theme.id);
    saveThemeId(theme.id);
  }, [saveThemeId]);

  // Background Parallax Mouse Tracking
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Web Audio Noise Synthesizer States
  const [isSoundOn, setIsSoundOn] = useState(false);
  const [soundVolume, setSoundVolume] = useState(0.12);
  const audioContextRef = useRef<AudioContext | null>(null);
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // New features states
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [shareTooltip, setShareTooltip] = useState<string | null>(null);
  const [adminOpen, setAdminOpen] = useState(false);

  const toggleManageMode = useCallback(() => {
    setIsManageMode((prev) => {
      const next = !prev;
      localStorage.setItem('vistablog_manage_mode', next ? '1' : '0');
      return next;
    });
  }, []);

  const {
    toasts: easterToasts,
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
  } = useEasterEggs({
    onToggleManageMode: toggleManageMode,
    onShuffleTheme: () => {
      if (!backgroundThemes.length) return;
      const pick = backgroundThemes[Math.floor(Math.random() * backgroundThemes.length)];
      setCurrentTheme(pick);
      setCustomBgUrl(null);
      localStorage.removeItem('vistablog_custom_bg');
      localStorage.setItem('vistablog_theme_id', pick.id);
      pushToast('随机意境', `已切换为「${pick.name}」`, '🎲');
    },
  });

  const openWriter = useCallback((post?: BlogPost | null, moment?: Moment | null) => {
    setEditingPost(post ?? null);
    setEditingMoment(moment ?? null);
    setIsWriteOpen(true);
  }, []);

  const closeWriter = useCallback(() => {
    setIsWriteOpen(false);
    setEditingPost(null);
    setEditingMoment(null);
  }, []);

  // ----- Lifecycle Methods -----
  useEffect(() => {
    // 1. Establish database storage
    const storedPosts = localStorage.getItem('vistablog_posts');
    const storedMoments = localStorage.getItem('vistablog_moments');
    const storedThemeId = localStorage.getItem('vistablog_theme_id');

    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    } else {
      setPosts(INITIAL_BLOG_POSTS);
      localStorage.setItem('vistablog_posts', JSON.stringify(INITIAL_BLOG_POSTS));
    }

    if (storedMoments) {
      setMoments(JSON.parse(storedMoments));
    } else {
      setMoments(INITIAL_MOMENTS);
      localStorage.setItem('vistablog_moments', JSON.stringify(INITIAL_MOMENTS));
    }

    try {
      const customRaw = localStorage.getItem('vistablog_custom_bg');
      if (customRaw) {
        const bg = JSON.parse(customRaw) as CrawledBackground;
        if (bg.url) setCustomBgUrl(bg.url);
      }
    } catch {
      /* ignore */
    }

    // 2. Setup dynamic time-based greeting in Chinese
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 9) {
      setCurrentGreeting('清晨，山岚正起，愿新的一天带给您纯净与宁静 🌤️');
    } else if (hour >= 9 && hour < 12) {
      setCurrentGreeting('上午好！阳光漫步进松林，正是专注与沉思的良机 ✨');
    } else if (hour >= 12 && hour < 14) {
      setCurrentGreeting('午后小憩，泡上一杯清茶，来读几篇散文吧 🍵');
    } else if (hour >= 14 && hour < 18) {
      setCurrentGreeting('斜阳微暖，看群山染上碎金，愿文字抚平你一下午的劳顿 🍂');
    } else if (hour >= 18 && hour < 23) {
      setCurrentGreeting('华灯初上，暮色凝水。静听潮涌，欢迎来到思想的避风港 🌙');
    } else {
      setCurrentGreeting('夜深了，群星闪烁雪山之巅。让大自然低述，枕松涛好眠 🌌');
    }
  }, []);

  useEffect(() => {
    if (!backgroundThemes.length) return;
    const storedThemeId = localStorage.getItem('vistablog_theme_id');
    const match = findThemeById(backgroundThemes, storedThemeId);
    if (match) setCurrentTheme(match);
  }, [backgroundThemes]);

  const displayTheme = useMemo(() => {
    if (customBgUrl) {
      return { ...currentTheme, url: customBgUrl };
    }
    return currentTheme;
  }, [currentTheme, customBgUrl]);

  // Back to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync to local storage on changes
  const savePostsToLS = (updated: BlogPost[]) => {
    setPosts(updated);
    localStorage.setItem('vistablog_posts', JSON.stringify(updated));
  };

  const saveMomentsToLS = (updated: Moment[]) => {
    setMoments(updated);
    localStorage.setItem('vistablog_moments', JSON.stringify(updated));
  };

  const handleApplyCrawledBackground = (bg: CrawledBackground) => {
    setCustomBgUrl(bg.url);
    localStorage.setItem('vistablog_custom_bg', JSON.stringify(bg));
  };


  // Anime.js 动画效果
  useEffect(() => {
    // 数字滚动动画
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach((el) => {
      const target = parseInt(el.getAttribute('data-target') || '0');
      animateCounter(el as HTMLElement, target, 1500);
    });

    // 卡片入场动画
    setTimeout(() => {
      animateCards('.glass-card');
    }, 300);

    // 标题动画
    animateTitle('h2');
  }, []);

  // Backgorund Parallax Tracker
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const x = (clientX - window.innerWidth / 2) / 35;
    const y = (clientY - window.innerHeight / 2) / 35;
    setMousePos({ x, y });
  };

  // Web Audio Synth - Generates realistic rain/pink noise locally inside browser
  const toggleAmbientSound = () => {
    if (isSoundOn) {
      stopSynthesizer();
      setIsSoundOn(false);
    } else {
      startSynthesizer();
      setIsSoundOn(true);
    }
  };

  const startSynthesizer = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      // 1. Create a 2-second loop buffer filled with Brown Noise formula
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Brown noise generation filter
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 4.0; // amplify to standard level
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      // 2. Generate a Lowpass BiquadFilter (sound like deep rain through autumn leaves & wind)
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 650; // soft and comforting damp frequency

      // 3. Connect gain volume
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(soundVolume, ctx.currentTime);

      noiseSource.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      noiseSource.start(0);

      noiseSourceRef.current = noiseSource;
      filterNodeRef.current = filter;
      gainNodeRef.current = gainNode;
    } catch (e) {
      console.warn("AudioContext failed to boot:", e);
    }
  };

  const stopSynthesizer = () => {
    if (noiseSourceRef.current) {
      try { noiseSourceRef.current.stop(); } catch(err){}
      noiseSourceRef.current.disconnect();
      noiseSourceRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  // Handle live volume sliding
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setSoundVolume(vol);
    if (gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current.gain.setValueAtTime(vol, audioContextRef.current.currentTime);
    }
  };

  useEffect(() => {
    return () => {
      stopSynthesizer(); // cleanup
    };
  }, []);

  // Theme styling configuration (pure computation, no side effects)
  const THEME_STYLES: Record<string, {
    cssVars: { vibe: string; tagBg: string; tagBorder: string; textColor: string };
    classes: { accentText: string; accentBg: string; accentBorder: string; accentBtn: string; accentGlow: string; badgeClass: string; colorName: string };
  }> = {
    'forest-lake': {
      cssVars: { vibe: '#10b981', tagBg: 'rgba(16, 185, 129, 0.15)', tagBorder: 'rgba(16, 185, 129, 0.3)', textColor: '#34d399' },
      classes: { accentText: 'text-emerald-400 group-hover:text-emerald-300', accentBg: 'bg-emerald-500', accentBorder: 'border-emerald-500/35', accentBtn: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/40', accentGlow: 'shadow-emerald-500/10', badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', colorName: 'emerald' }
    },
    'misty-mountain': {
      cssVars: { vibe: '#f59e0b', tagBg: 'rgba(245, 158, 11, 0.15)', tagBorder: 'rgba(245, 158, 11, 0.3)', textColor: '#fbbf24' },
      classes: { accentText: 'text-amber-400 group-hover:text-amber-300', accentBg: 'bg-amber-500', accentBorder: 'border-amber-500/35', accentBtn: 'bg-amber-600 hover:bg-amber-500 shadow-amber-900/40', accentGlow: 'shadow-amber-500/10', badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30', colorName: 'amber' }
    },
    'starry-peaks': {
      cssVars: { vibe: '#6366f1', tagBg: 'rgba(99, 102, 241, 0.15)', tagBorder: 'rgba(99, 102, 241, 0.3)', textColor: '#818cf8' },
      classes: { accentText: 'text-indigo-400 group-hover:text-indigo-300', accentBg: 'bg-indigo-500', accentBorder: 'border-indigo-500/35', accentBtn: 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-900/40', accentGlow: 'shadow-indigo-500/10', badgeClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30', colorName: 'indigo' }
    },
    'sunrise-ocean': {
      cssVars: { vibe: '#06b6d4', tagBg: 'rgba(6, 182, 212, 0.15)', tagBorder: 'rgba(6, 182, 212, 0.3)', textColor: '#22d3ee' },
      classes: { accentText: 'text-cyan-400 group-hover:text-cyan-300', accentBg: 'bg-cyan-500', accentBorder: 'border-cyan-500/35', accentBtn: 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-900/40', accentGlow: 'shadow-cyan-500/10', badgeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30', colorName: 'cyan' }
    },
    'winter-dawn': {
      cssVars: { vibe: '#14b8a6', tagBg: 'rgba(20, 184, 166, 0.15)', tagBorder: 'rgba(20, 184, 166, 0.3)', textColor: '#2dd4bf' },
      classes: { accentText: 'text-teal-400 group-hover:text-teal-300', accentBg: 'bg-teal-500', accentBorder: 'border-teal-500/35', accentBtn: 'bg-teal-600 hover:bg-teal-500 shadow-teal-900/40', accentGlow: 'shadow-teal-500/10', badgeClass: 'bg-teal-500/20 text-teal-300 border-teal-500/30', colorName: 'teal' }
    }
  };

  const DEFAULT_STYLE = {
    accentText: 'text-slate-200 group-hover:text-white',
    accentBg: 'bg-slate-500',
    accentBorder: 'border-slate-500/30',
    accentBtn: 'bg-slate-600 hover:bg-slate-500',
    accentGlow: 'shadow-slate-500/10',
    badgeClass: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    colorName: 'emerald'
  };

  // Pure computation - no DOM side effects
  const style = useMemo(() => {
    return THEME_STYLES[currentTheme.id]?.classes ?? DEFAULT_STYLE;
  }, [currentTheme.id]);

  // Side effect isolated in useEffect - only runs when theme changes
  useEffect(() => {
    const themeConfig = THEME_STYLES[currentTheme.id];
    if (themeConfig) {
      const { vibe, tagBg, tagBorder, textColor } = themeConfig.cssVars;
      document.documentElement.style.setProperty('--accent-vibe-color', vibe);
      document.documentElement.style.setProperty('--accent-tag-bg', tagBg);
      document.documentElement.style.setProperty('--accent-tag-border', tagBorder);
      document.documentElement.style.setProperty('--accent-text-color', textColor);
    }
  }, [currentTheme.id]);

  // ----- Actions Handlers -----
  const handleAddNewPost = (newPost: BlogPost) => {
    const updated = [newPost, ...posts];
    savePostsToLS(updated);
  };

  const handleAddNewMoment = (newMoment: Moment) => {
    const updated = [newMoment, ...moments];
    saveMomentsToLS(updated);
  };

  const handleLikePost = (postId: string) => {
    const updated = posts.map(p => {
      if (p.id === postId) {
        const likedPosts = JSON.parse(localStorage.getItem('liked_posts') || '[]');
        const isCurrentlyLiked = likedPosts.includes(postId);
        return {
          ...p,
          likes: p.likes + (isCurrentlyLiked ? -1 : 1)
        };
      }
      return p;
    });
    savePostsToLS(updated);
    
    // Update active reading modal post state so reading modal syncs state live
    if (readingPost && readingPost.id === postId) {
      const match = updated.find(p => p.id === postId);
      if (match) setReadingPost(match);
    }
  };

  const handleLikeMoment = (momentId: string) => {
    const likedMoments = JSON.parse(localStorage.getItem('liked_moments') || '[]');
    const isCurrentlyLiked = likedMoments.includes(momentId);
    let nextLiked;
    if (isCurrentlyLiked) {
      nextLiked = likedMoments.filter((id: string) => id !== momentId);
    } else {
      nextLiked = [...likedMoments, momentId];
    }
    localStorage.setItem('liked_moments', JSON.stringify(nextLiked));

    const updated = moments.map(m => {
      if (m.id === momentId) {
        return {
          ...m,
          likes: m.likes + (isCurrentlyLiked ? -1 : 1)
        };
      }
      return m;
    });
    saveMomentsToLS(updated);
  };

  const handleUpdatePost = (post: BlogPost) => {
    const updated = posts.map((p) => (p.id === post.id ? post : p));
    savePostsToLS(updated);
    if (readingPost?.id === post.id) setReadingPost(post);
  };

  const handleUpdateMoment = (moment: Moment) => {
    const updated = moments.map((m) => (m.id === moment.id ? moment : m));
    saveMomentsToLS(updated);
  };

  const handleDeletePost = (postId: string) => {
    const updated = posts.filter((p) => p.id !== postId);
    savePostsToLS(updated);
    if (readingPost?.id === postId) setReadingPost(null);
  };

  const handleDeleteMoment = (momentId: string) => {
    saveMomentsToLS(moments.filter((m) => m.id !== momentId));
  };

  const handleDeleteComment = (postId: string, commentId: string) => {
    const updated = posts.map((p) => {
      if (p.id !== postId) return p;
      return { ...p, comments: p.comments.filter((c) => c.id !== commentId) };
    });
    savePostsToLS(updated);
    if (readingPost?.id === postId) {
      const match = updated.find((p) => p.id === postId);
      if (match) setReadingPost(match);
    }
  };

  const requestDeletePost = (post: BlogPost) => {
    setConfirmDialog({
      title: '删除文章',
      message: `确定删除「${post.title}」？此操作不可恢复。`,
      onConfirm: () => {
        handleDeletePost(post.id);
        setConfirmDialog(null);
      },
    });
  };

  const requestDeleteMoment = (moment: Moment) => {
    setConfirmDialog({
      title: '删除微言',
      message: '确定删除这条微言？',
      onConfirm: () => {
        handleDeleteMoment(moment.id);
        setConfirmDialog(null);
      },
    });
  };

  const handleAddComment = (postId: string, comment: Comment) => {
    const updated = posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [comment, ...p.comments]
        };
      }
      return p;
    });
    savePostsToLS(updated);

    // Sync active reading post live
    if (readingPost && readingPost.id === postId) {
      const match = updated.find(p => p.id === postId);
      if (match) setReadingPost(match);
    }
  };

  const openPostForReading = (post: BlogPost) => {
    // Increment view locally
    const updated = posts.map(p => {
      if (p.id === post.id) {
        return { ...p, views: p.views + 1 };
      }
      return p;
    });
    savePostsToLS(updated);
    
    const incrementedPost = updated.find(p => p.id === post.id);
    setReadingPost(incrementedPost || post);
  };

  // ----- Filtering Logic -----
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === '全部' || 
                            post.category === selectedCategory ||
                            (selectedCategory === '日常随记' && post.category === '生活随笔') ||
                            (selectedCategory === '图片分析' && post.category === '旅行摄影');
    return matchesSearch && matchesCategory;
  });

  const CATEGORIES = ['全部', '日常随记', '学习资料', '资源链接', '图片分析', '成长思考', '技术笔记'];

  const commandActions = useMemo(
    () => [
      {
        id: 'write',
        label: '开启新创作',
        hint: '博文 / 微言',
        icon: paletteIcons.write,
        run: () => openWriter(),
      },
      {
        id: 'manage',
        label: isManageMode ? '退出博主管理' : '进入博主管理',
        hint: '增删改',
        icon: paletteIcons.manage,
        run: toggleManageMode,
      },
      {
        id: 'theme',
        label: '随机切换风景',
        icon: paletteIcons.theme,
        run: () => {
          if (!backgroundThemes.length) return;
          const pick = backgroundThemes[Math.floor(Math.random() * backgroundThemes.length)];
          setCurrentTheme(pick);
          setCustomBgUrl(null);
          localStorage.removeItem('vistablog_custom_bg');
          localStorage.setItem('vistablog_theme_id', pick.id);
          pushToast('意境切换', pick.name, '🏔️');
        },
      },
      {
        id: 'danmaku',
        label: '开关弹幕层',
        icon: paletteIcons.sparkles,
        run: () => setIsDanmakuVisible((v) => !v),
      },
      // 彩蛋命令
      {
        id: 'egg-snow',
        label: '❄️ 雪花飘落',
        hint: '彩蛋',
        icon: paletteIcons.sparkles,
        run: () => pushToast('❄️ 雪花飘落', '冬日暖阳，雪花轻轻飘落。', '❄️'),
      },
      {
        id: 'egg-love',
        label: '❤️ 爱心飘落',
        hint: '彩蛋',
        icon: paletteIcons.sparkles,
        run: () => pushToast('❤️ 爱心飘落', '你输入了「love」，全站爱心飘落！', '❤️'),
      },
      {
        id: 'egg-sparkle',
        label: '✨ 星尘模式',
        hint: '彩蛋',
        icon: paletteIcons.sparkles,
        run: () => pushToast('✨ 星尘模式', '全站微微闪烁，像山野里的萤火。', '✨'),
      },
      {
        id: 'egg-coffee',
        label: '☕ 咖啡时间',
        hint: '彩蛋',
        icon: paletteIcons.sparkles,
        run: () => pushToast('☕ 咖啡时间', '来一杯咖啡？阅读时光更惬意。', '☕'),
      },
      {
        id: 'egg-cat',
        label: '🐱 猫咪彩蛋',
        hint: '彩蛋',
        icon: paletteIcons.sparkles,
        run: () => pushToast('🐱 猫咪彩蛋', '喵~ 一只小猫路过。', '🐱'),
      },
    ],
    [isManageMode, backgroundThemes, openWriter, toggleManageMode, pushToast],
  );

  const getMomentLikingStatus = (momentId: string) => {
    const likedMoments = JSON.parse(localStorage.getItem('liked_moments') || '[]');
    return likedMoments.includes(momentId);
  };

  return (
    <div
      className={`relative min-h-screen w-full font-sans text-slate-100 overflow-x-hidden selection:bg-slate-700 pb-20 ${sparkleMode ? 'sparkle-mode' : ''}`}
      id="root-viewport-container"
    >
      <ReadingProgressBar />
      <EasterEggToasts toasts={easterToasts} onDismiss={dismissToast} />
      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} actions={commandActions} />
      <ConfirmDialog
        open={Boolean(confirmDialog)}
        title={confirmDialog?.title ?? ''}
        message={confirmDialog?.message ?? ''}
        danger
        confirmLabel="删除"
        onConfirm={() => confirmDialog?.onConfirm()}
        onCancel={() => setConfirmDialog(null)}
      />
      {/* Easter Egg Effects */}
      <HeartRain active={heartRain} />
      <SnowMode active={snowMode} />
      <SparkleEffect active={sparkleMode} />

      {/* New Features */}
      <MusicPlayer />
      <ClickEffect enabled={true} />
      <Fireflies count={15} enabled={sparkleMode} />
      <MouseGlow enabled={true} />
      {/* 1. Dynamic Background with Video/Image Support */}
      <DynamicBackground
        currentTheme={displayTheme}
        themeVideos={themeVideos}
        onMouseMove={handleMouseMove}
      />

      {/* 2. Visual Layer Wrapper */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 pt-6 md:px-8 md:pt-10 select-none">
        
        {/* TOP Atmospheric Branding & Weather Grid */}
        <header className="glass-panel mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-3xl">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleLogoClick}
              className="w-11 h-11 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800 border border-slate-700/60 flex items-center justify-center cursor-pointer hover:scale-105 transition active:scale-95"
              title="VistaBlog"
            >
              <Compass size={22} className={style.accentText} />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-white font-['Noto_Serif_SC'] tracking-tight flex items-center gap-2">
                <span>VistaBlog </span>
                <span className="text-sm font-normal text-slate-400 font-sans hidden sm:inline">| 动态自然风景博客</span>
              </h1>
              <p className="text-xs text-slate-350 mt-0.5">{currentGreeting}</p>
            </div>
          </div>

          {/* Quick theme status badge / photographer credit */}
          <div className="theme-badge-header flex items-center gap-2 text-[11px] font-mono bg-black/35 pl-3 pr-4 py-2 border border-white/5 rounded-2xl">
            <div className="w-2 h-2 rounded-full alive-indicator shrink-0" style={{ backgroundColor: 'var(--accent-vibe-color)' }} />
            <span className="text-slate-400">当前壁纸: </span>
            <span className="font-semibold text-white mr-1">{displayTheme.name}</span>
            {customBgUrl ? (
              <span className="text-slate-400">自定义采集背景</span>
            ) : (
              <a
                href={currentTheme.photographerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white underline cursor-pointer"
              >
                @{currentTheme.photographer}
              </a>
            )}
            {manifestSource && (
              <span className="text-slate-600 font-mono text-[10px] ml-1" title="资源清单来源">
                · {manifestSource}
              </span>
            )}

          </div>
        </header>

        {isManageMode && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel mb-6 px-4 py-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 border border-amber-500/25 bg-amber-500/5"
          >
            <span className="text-xs text-amber-200 font-semibold flex items-center gap-2">
              <Settings2 size={14} />
              博主管理模式：可编辑 / 删除文章、微言与评论
            </span>
            <span className="text-[10px] text-slate-500 font-mono">快捷键 Ctrl+K · 输入 guanli 切换</span>
          </motion.div>
        )}

        {/* CORE GRID LAYOUT: Left sidebar + Middle content body */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* COLUMN 1: Profiles & Interactive Sound machine */}
          <section className="lg:col-span-1 space-y-6">
            
            {/* PROFILE CARD */}
            <div className="wallpaper-tuner glass-panel p-6 rounded-3xl flex flex-col items-center text-center">
              
              {/* Avatar block */}
              <div className="relative group mb-4">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-teal-500 via-emerald-400 to-indigo-500 opacity-65 blur-md group-hover:opacity-100 transition duration-1000" />
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
                  alt="博主头像"
                  className="relative w-20 h-20 rounded-full border border-white/10 object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Identity labels */}
              <div className="space-y-1">
                <h2 className="text-lg font-black text-white font-['Noto_Serif_SC'] flex items-center justify-center gap-1.5">
                  林暮野 (Wilderness)
                  <Smile size={15} className={style.accentText} />
                </h2>
                <p className="text-xs text-slate-350 tracking-wide font-mono">前沿技术探索者 / 旅行摄影师</p>
                <p className="text-xs text-slate-400 flex items-center justify-center gap-1 mt-1 font-mono">
                  <MapPin size={12} className="text-slate-400" />
                  栖居于 · 浙中山野
                </p>
              </div>

              <hr className="border-white/5 w-full my-4" />

              {/* Bio motto paragraph */}
              <p className="text-xs text-slate-300 leading-relaxed text-justify px-1.5 mb-5 font-light">
                “凡是能在深林竹径、璀璨星岳和晨涛海岸中获取平静的人，都值得被大自然永久拥抱。代码是我的画笔，原野是我的精神归宿。”
              </p>

              {/* Small interactive blog metrics */}
              <div className="profile-stats-grid grid grid-cols-3 gap-2 w-full p-2 bg-black/25 rounded-2xl border border-white/5 text-center mb-5 font-mono">
                <div className="stat-item">
                  <span className="block text-sm font-black text-white stat-number" data-target={posts.length}>{posts.length}</span>
                  <span className="text-[10px] text-slate-400">文章</span>
                </div>
                <div className="stat-item">
                  <span className="block text-sm font-black text-white stat-number" data-target={moments.length}>{moments.length}</span>
                  <span className="text-[10px] text-slate-400">微言</span>
                </div>
                <div className="stat-item">
                  <span className="block text-sm font-black text-white stat-number" data-target={posts.reduce((sum, p) => sum + p.views, 0) + 120}>
                    {posts.reduce((sum, p) => sum + p.views, 0) + 120}
                  </span>
                  <span className="text-[10px] text-slate-400">总博阅</span>
                </div>
              </div>

              {/* Social Channels */}
              <div className="social-channels-row flex gap-4">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 border border-white/5 hover:border-white/20 transition rounded-full text-slate-350 hover:text-white bg-black/20">
                  <Github size={15} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 border border-white/5 hover:border-white/20 transition rounded-full text-slate-350 hover:text-white bg-black/20">
                  <Instagram size={15} />
                </a>
                <button
                  type="button"
                  onClick={() => alert("博主微信号: wilderness_camp (欢迎学术技术交流与摄影约稿)")}
                  className="px-3.5 py-1.5 border border-white/5 hover:border-white/20 transition rounded-2xl text-[11px] text-slate-350 hover:text-white bg-black/20 font-semibold cursor-pointer"
                >
                  微信联络
                </button>
              </div>

              <button
                type="button"
                onClick={toggleManageMode}
                className={`mt-4 w-full py-2 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  isManageMode
                    ? 'bg-amber-500/20 text-amber-200 border-amber-500/40'
                    : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                }`}
              >
                <Settings2 size={14} />
                {isManageMode ? '退出管理' : '博主管理'}
              </button>

            </div>

            {/* INTERACTIVE AMBIENT SOUND GENERATOR (Web Audio Binaural Synth) */}
            <div className="ambient-sound-wrapper glass-panel p-5 rounded-3xl">
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <Volume2 size={16} className={style.accentText} />
                  <h3 className="text-sm font-semibold text-white font-['Noto_Serif_SC']">山林雨落白噪音</h3>
                </div>
                <div className="px-1.5 py-0.5 rounded text-[9px] bg-indigo-500/10 text-indigo-300 font-mono font-bold uppercase tracking-wide">
                  WebSynth
                </div>
              </div>

              <p className="text-[11px] text-slate-350 leading-relaxed mb-4 font-light">
                阅读深度好文时，欢迎点亮以下伴奏。由浏览器实时物理生成的舒缓落雨声，让专注更加纯粹。
              </p>

              {/* Sound Controllers */}
              <div className="space-y-3.5">
                <button
                  onClick={toggleAmbientSound}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
                    isSoundOn
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : 'bg-white/10 hover:bg-white/15 text-white border border-white/5'
                  }`}
                  id="ambient-sound-toggle"
                >
                  {isSoundOn ? (
                    <>
                      <VolumeX size={14} />
                      停止落雨声
                    </>
                  ) : (
                    <>
                      <Volume2 size={14} />
                      开启落雨声
                    </>
                  )}
                </button>

                {isSoundOn && (
                  <div className="space-y-1.5 px-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>音量调节:</span>
                      <span className="font-mono">{Math.round(soundVolume * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.0"
                      max="0.4"
                      step="0.01"
                      value={soundVolume}
                      onChange={handleVolumeChange}
                      className="w-full h-1 bg-slate-800 rounded-full appearance-none cursor-pointer accent-emerald-400"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* LANDSCAPE FLUID WALLPAPER TUNER */}
            <div className="glass-panel p-5 rounded-3xl">
              <div className="flex items-center gap-1.5 mb-3">
                <Layers size={15} className={style.accentText} />
                <h3 className="text-sm font-semibold text-white font-['Noto_Serif_SC']">更换风景意境</h3>
              </div>
              <p className="text-[10px] text-slate-400 mb-3 leading-relaxed">
                点击切换博客的主题意境，整体界面色温与色标将自适应随之渐变。
              </p>

              <div className="flex flex-col gap-2">
                {backgroundThemes.map((theme) => {
                  const isActive = currentTheme.id === theme.id;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => handleThemeChange(theme)}
                      className={`group p-2 rounded-2xl flex items-center gap-2.5 transition text-left border cursor-pointer ${
                        isActive
                          ? 'bg-white/10 border-white/20 shadow-sm'
                          : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/5'
                      }`}
                      title={theme.description}
                    >
                      <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-white/5">
                        <img
                          src={theme.url}
                          alt={theme.name}
                          className="w-full h-full object-cover filter brightness-75 group-hover:scale-110 transition duration-500"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-200">{theme.name}</span>
                          {isActive && (
                            <span className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse" style={{ backgroundColor: 'var(--accent-vibe-color)' }} />
                          )}
                        </div>
                        <p className="text-[9px] text-slate-400 truncate mt-0.5">{theme.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </section>

          {/* COLUMN 2, 3, 4: Content Feed Container */}
          <section className="lg:col-span-3 space-y-6">

            <ResourceDiscoveryHub
              posts={posts}
              moments={moments}
              currentTheme={currentTheme}
              style={style}
              onOpenPost={openPostForReading}
              onStartContribution={() => openWriter()}
            />

            {/* TAB SELECTOR & ADD POST BUTTON */}
            <div className="glass-panel p-2 sm:p-2.5 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
              
              {/* Nav Tabs list */}
              <div className="flex items-center gap-1 bg-black/25 p-1 rounded-2xl border border-white/5 w-full sm:w-auto font-mono" role="tablist" aria-label="内容分类">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'posts'}
                  aria-controls="panel-posts"
                  onClick={() => setActiveTab('posts')}
                  className={`flex-1 sm:flex-none px-4.5 py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition flex items-center justify-center gap-2 cursor-pointer ${
                    activeTab === 'posts'
                      ? 'bg-white/10 font-bold text-white shadow-sm'
                      : 'text-slate-355 hover:text-white hover:bg-white/5'
                  }`}
                  id="tab-btn-posts"
                >
                  <BookOpen size={15} />
                  深度博文
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'moments'}
                  aria-controls="panel-moments"
                  onClick={() => setActiveTab('moments')}
                  className={`flex-1 sm:flex-none px-4.5 py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition flex items-center justify-center gap-2 cursor-pointer ${
                    activeTab === 'moments'
                      ? 'bg-white/10 font-bold text-white shadow-sm'
                      : 'text-slate-355 hover:text-white hover:bg-white/5'
                  }`}
                  id="tab-btn-moments"
                >
                  <Feather size={15} />
                  微言片刻
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'about'}
                  aria-controls="panel-about"
                  onClick={() => setActiveTab('about')}
                  className={`flex-1 sm:flex-none px-4.5 py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition flex items-center justify-center gap-2 cursor-pointer ${
                    activeTab === 'about'
                      ? 'bg-white/10 font-bold text-white shadow-sm'
                      : 'text-slate-355 hover:text-white hover:bg-white/5'
                  }`}
                  id="tab-btn-about"
                >
                  <Info size={15} />
                  关于博主
                </button>
                </div>

              {/* Creator Pen button */}
              <button
                type="button"
                onClick={() => openWriter()}
                className={`w-full sm:w-auto px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-lg select-none shrink-0 cursor-pointer ${style.accentBtn}`}
                id="open-write_post-btn"
              >
                <PlusCircle size={16} />
                开启新创作
              </button>
            </div>

            {/* TAB CONTENT PANELS */}
            <div id="dynamic-tab-contents">
              
              {/* Tab 1: Articles / Blog posts */}
              {activeTab === 'posts' && (
                <div className="space-y-6" id="blog-posts-view" role="tabpanel" aria-labelledby="tab-btn-posts">
                  
                  {/* Category filters & Search search */}
                  <div className="glass-panel grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 rounded-3xl">
                    {/* Categories tag groups */}
                    <div className="md:col-span-8 flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs text-slate-400 mr-1 flex items-center gap-1 font-mono">
                        <Filter size={12} />
                        分类:
                      </span>
                      {CATEGORIES.map(cat => {
                        const isSel = selectedCategory === cat;
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${
                              isSel
                                ? 'bg-slate-100 text-slate-900 border-white scale-102 font-bold'
                                : 'bg-black/20 text-slate-350 border-white/5 hover:border-white/10 hover:text-white'
                            }`}
                          >
                            {cat}
                          </button>
                        );
                      })}
                    </div>

                    {/* Simple search field */}
                    <div className="md:col-span-4 relative">
                      <input
                        type="text"
                        placeholder="搜索我的文章及思考..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-1.5 bg-black/20 border border-white/5 focus:border-white/12 text-slate-100 text-xs rounded-xl focus:outline-none transition"
                      />
                      <Search size={13} className="absolute left-3 top-2.5 text-slate-500" />
                    </div>
                  </div>

                  {/* Pinned post highlight if all categories is active */}
                  {selectedCategory === '全部' && searchQuery === '' && posts.some(p => p.pinned) && (
                    <div className="space-y-3">
                      <span className="text-xs text-amber-500 font-bold uppercase tracking-widest pl-2 flex items-center gap-1 font-mono">
                        <Flame size={13} />
                        置顶特推 (Features)
                      </span>
                      {posts.filter(p => p.pinned).map(post => (
                        <div
                          key={post.id}
                          className="glass-card group relative rounded-3xl overflow-hidden flex flex-col md:flex-row"
                        >
                          <div className="md:w-2/5 aspect-video md:aspect-auto overflow-hidden relative">
                            <img
                              src={post.coverImage}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                              referrerPolicy="no-referrer"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-950 via-slate-950/20 to-transparent" />
                          </div>
                          
                          <div className="p-6 md:p-8 md:w-3/5 flex flex-col justify-between">
                            <div className="space-y-3">
                              <div className="flex items-center gap-2 text-xs font-mono">
                                <span className="px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold uppercase tracking-wide">
                                  置顶
                                </span>
                                <span className={`px-2.5 py-0.5 rounded font-bold uppercase tracking-wide ${style.badgeClass}`}
                                    style={{
                                      backgroundColor: 'var(--accent-tag-bg)',
                                      borderColor: 'var(--accent-tag-border)',
                                      color: 'var(--accent-text-color)'
                                    }}>
                                  {post.category}
                                </span>
                                <span className="text-slate-500">•</span>
                                <span className="text-slate-505">{post.publishDate}</span>
                              </div>
                              <h3 className="text-xl md:text-2xl font-bold text-white font-['Noto_Serif_SC'] tracking-tight leading-tight group-hover:text-slate-100 transition">
                                {post.title}
                              </h3>
                              <p className="text-sm text-slate-350 leading-relaxed font-light line-clamp-3">
                                {post.summary}
                              </p>
                            </div>

                            <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                              <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
                                <span className="flex items-center gap-1">
                                  <Heart size={12} className="text-slate-500" />
                                  {post.likes} 赞
                                </span>
                                <span className="flex items-center gap-1">
                                  <MessageSquare size={12} className="text-slate-505" />
                                  {post.comments.length} 评论
                                </span>
                              </div>

                              <button
                                onClick={() => openPostForReading(post)}
                                className="flex items-center gap-1 text-xs font-bold text-white hover:underline uppercase transition cursor-pointer min-h-[44px] px-2 py-1"
                              >
                                浸入阅读
                                <ChevronRight size={14} className={style.accentText} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Regular Posts Grid */}
                  <div className="space-y-3">
                    <div className="pl-2 flex items-center justify-between">
                      <span className="text-xs text-slate-400 uppercase font-black tracking-widest font-mono">
                        全部文章群落 (Discovering Stories)
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        共 {filteredPosts.length} 篇
                      </span>
                    </div>

                    {filteredPosts.length === 0 ? (
                      <div className="glass-panel text-center py-12 text-slate-400 rounded-3xl col-span-full">
                        没有找到匹配的文章，换个关键词试试吧。
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredPosts.map(post => (
                          <div
                            key={post.id}
                            className="glass-card group p-5 rounded-2xl flex flex-col justify-between"
                          >
                            <div className="space-y-4">
                              <div className="aspect-video w-full rounded-xl overflow-hidden relative border border-white/5 shadow-sm">
                                <img
                                  src={post.coverImage}
                                  alt={post.title}
                                  className="w-full h-full object-cover filter brightness-[0.7] group-hover:scale-104 transition duration-500"
                                  referrerPolicy="no-referrer"
                                  loading="lazy"
                                />
                                <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border"
                                      style={{
                                        backgroundColor: 'var(--accent-tag-bg)',
                                        borderColor: 'var(--accent-tag-border)',
                                        color: 'var(--accent-text-color)'
                                      }}>
                                    {post.category}
                                  </span>
                                  {post.category === '学习资料' && (() => {
                                    const resNameLower = (post.resourceName || '').toLowerCase();
                                    if (resNameLower.includes('.doc') || resNameLower.includes('word') || resNameLower.includes('文档')) {
                                      return <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-blue-600/90 text-white border border-blue-500/30 flex items-center gap-1 shadow-sm backdrop-blur-sm"><span className="text-[10px]">📄</span> Word 考研文档</span>;
                                    }
                                    if (resNameLower.includes('.ppt') || resNameLower.includes('powerpoint')) {
                                      return <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-orange-600/90 text-white border border-orange-500/30 flex items-center gap-1 shadow-sm backdrop-blur-sm"><span className="text-[10px]">📊</span> PPT 答辩幻灯片</span>;
                                    }
                                    if (resNameLower.includes('.pdf')) {
                                      return <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-rose-600/90 text-white border border-rose-500/30 flex items-center gap-1 shadow-sm backdrop-blur-sm"><span className="text-[10px]">📕</span> PDF 电子讲义</span>;
                                    }
                                    if (resNameLower.includes('风景') || resNameLower.includes('壁纸') || resNameLower.includes('照片') || resNameLower.includes('图片') || resNameLower.includes('scenery')) {
                                      return <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-emerald-600/90 text-white border border-emerald-500/30 flex items-center gap-1 shadow-sm backdrop-blur-sm"><span className="text-[11px]">🌅</span> 自习风景大图</span>;
                                    }
                                    return <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded ${style.accentBtn} text-white border ${style.accentBorder} flex items-center gap-1 shadow-sm backdrop-blur-sm`}>📚 核心下载包</span>;
                                  })()}
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
                                  <span>{post.publishDate}</span>
                                  <span>阅时: {post.readTime}</span>
                                </div>
                                <h4 className="text-base font-bold text-white font-['Noto_Serif_SC'] leading-snug group-hover:text-slate-250 transition line-clamp-1">
                                  {post.title}
                                </h4>
                                <p className="text-xs text-slate-350 leading-relaxed font-light line-clamp-2">
                                  {post.summary}
                                </p>

                                {/* --- CARD QUICK DOWNLOAD BAR & METADATA ACCELERATOR --- */}
                                {postHasShareableResource(post) && (
                                  <div className="mt-3.5 p-2.5 rounded-xl bg-slate-950/50 border border-white/5 flex items-center justify-between gap-3 text-left">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <div className="shrink-0 w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center text-[15px]">
                                        {(() => {
                                          const rName = (post.resourceName || '').toLowerCase();
                                          if (rName.includes('.doc') || rName.includes('word') || rName.includes('文档')) {
                                            return <span title="Word 资料" className="filter drop-shadow-sm select-none">📄</span>;
                                          }
                                          if (rName.includes('.ppt') || rName.includes('powerpoint')) {
                                            return <span title="PPTx 演示" className="filter drop-shadow-sm select-none">📊</span>;
                                          }
                                          if (rName.includes('.pdf')) {
                                            return <span title="PDF 讲义" className="filter drop-shadow-sm select-none">📕</span>;
                                          }
                                          if (rName.includes('风景') || rName.includes('壁纸') || rName.includes('照片') || rName.includes('图集') || rName.includes('scenery')) {
                                            return <span title="治愈系自学风景壁纸" className="filter drop-shadow-sm select-none">🌅</span>;
                                          }
                                          return <span className="filter drop-shadow-sm select-none">📚</span>;
                                        })()}
                                      </div>
                                      <div className="min-w-0">
                                        <h5 className="text-[11px] text-slate-200 font-bold truncate max-w-[120px] sm:max-w-[150px]" title={post.resourceName || '学习共享文件'}>
                                          {post.resourceName || '学习共享大礼包'}
                                        </h5>
                                        <p className="text-[9px] text-slate-500 font-mono tracking-tight">
                                          {post.resourceSize || '大小未知'} • {post.resourcePassword ? `提取: ${post.resourcePassword}` : '免密'}
                                        </p>
                                      </div>
                                    </div>

                                    <motion.button
                                      whileHover={{ 
                                        scale: 1.05,
                                        y: [0, -3, 0],
                                        transition: { 
                                          y: {
                                            repeat: Infinity,
                                            duration: 0.6,
                                            ease: "easeInOut"
                                          }
                                        } 
                                      }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={(e) => {
                                        e.stopPropagation(); // Avoid triggering card modals
                                        if (downloadingPostId === post.id) return;
                                        setDownloadingPostId(post.id);
                                        
                                        // Open link safely in browser
                                        window.open(post.resourceLink || 'https://github.com/google/genai', '_blank');

                                        // Set state back after short duration
                                        setTimeout(() => {
                                          setDownloadingPostId(null);
                                        }, 1800);
                                      }}
                                      className={`shrink-0 h-7 px-2.5 rounded-lg flex items-center gap-1 transition-all shadow-sm cursor-pointer select-none text-[10px] font-bold text-white ${
                                        downloadingPostId === post.id
                                          ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20'
                                          : style.accentBtn
                                      }`}
                                    >
                                      {downloadingPostId === post.id ? (
                                        <span className="flex items-center gap-0.5 text-[9px]">
                                          <span>资源获取中...</span>
                                          <span className="animate-spin text-[8px]">⏳</span>
                                        </span>
                                      ) : (
                                        <>
                                          <span>下载</span>
                                          <Download size={9} />
                                        </>
                                      )}
                                    </motion.button>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="mt-5 pt-3.5 border-t border-white/5 space-y-2">
                              {isManageMode && (
                                <div className="flex gap-1 justify-end">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openWriter(post);
                                    }}
                                    className="p-2 rounded-lg bg-white/10 text-slate-300 hover:text-white cursor-pointer"
                                    title="编辑"
                                  >
                                    <Pencil size={14} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      requestDeletePost(post);
                                    }}
                                    className="p-2 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 cursor-pointer"
                                    title="删除"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              )}
                              <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleLikePost(post.id); }}
                                  className="flex items-center gap-1 hover:text-red-400 transition cursor-pointer min-h-[44px] min-w-[44px] px-2 py-1 -my-1"
                                  title="点赞"
                                  aria-label={`点赞，当前 ${post.likes} 个赞`}
                                >
                                  <Heart size={14} className="fill-transparent text-slate-400 hover:text-red-400 hover:fill-red-400" />
                                  <span>{post.likes}</span>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
                                    setCopySuccess(true);
                                    setTimeout(() => setCopySuccess(false), 2000);
                                  }}
                                  className="flex items-center gap-1 hover:text-blue-400 transition cursor-pointer min-h-[44px] min-w-[44px] px-2 py-1 -my-1"
                                  title="复制链接"
                                  aria-label="分享文章链接"
                                >
                                  {copySuccess ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} className="text-slate-400" />}
                                </button>
                                <span className="flex items-center gap-1">
                                  <MessageSquare size={11} className="text-slate-500" />
                                  <span>{post.comments.length}</span>
                                </span>
                                <span>|</span>
                                <span>{post.views} 阅读</span>
                              </div>

                              <button
                                onClick={() => openPostForReading(post)}
                                className="flex items-center gap-1 text-[11px] font-bold text-white hover:underline transition cursor-pointer min-h-[44px] px-2 py-1"
                              >
                                展开阅读
                                <ChevronRight size={12} className={style.accentText} />
                              </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2: Moments */}
              {activeTab === 'moments' && (
                <div className="space-y-5" id="moments-view-feed" role="tabpanel" aria-labelledby="tab-btn-moments">
                  
                  <div className="pl-2 flex items-center justify-between">
                    <span className="text-xs text-slate-400 uppercase font-black tracking-widest font-mono">
                      生活刻度 (Micro Moments Feed)
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">共 {moments.length} 条</span>
                  </div>

                  <div className="space-y-4">
                    {moments.map((mom, idx) => {
                      const isLiked = getMomentLikingStatus(mom.id);
                      return (
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          key={mom.id}
                          className="glass-card p-5 sm:p-6 rounded-2xl space-y-4"
                        >
                          {/* Item head */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-800 border border-white/5">
                                <img
                                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100s&q=80"
                                  alt="小头像"
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-white">林暮野</span>
                                  {mom.mood && (
                                    <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 text-[9px] border border-indigo-500/20 font-semibold uppercase tracking-wider">
                                      {mom.mood}
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                                  <Clock size={10} />
                                  {mom.publishDate}
                                </span>
                              </div>
                            </div>

                            {mom.location && (
                              <span className="text-[10px] text-slate-350 bg-black/25 pl-2.5 pr-3.5 py-1 rounded-full border border-white/5 flex items-center gap-1 font-mono">
                                <MapPin size={10} style={{ color: 'var(--accent-vibe-color)' }} />
                                {mom.location}
                              </span>
                            )}
                          </div>

                          {/* Item text */}
                          <p className="text-sm text-slate-100 leading-relaxed whitespace-pre-wrap select-text pl-1">
                            {mom.content}
                          </p>

                          {/* Image if available */}
                          {mom.image && (
                            <div className="max-w-md aspect-video rounded-xl overflow-hidden border border-white/5 bg-black/20">
                              <img
                                src={mom.image}
                                alt="微言配图"
                                className="w-full h-full object-cover max-h-[300px] hover:scale-[1.02] transition duration-500"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          )}

                          {isManageMode && (
                            <div className="flex justify-end gap-1 pt-1">
                              <button
                                type="button"
                                onClick={() => openWriter(null, mom)}
                                className="p-2 rounded-lg bg-white/10 text-slate-300 hover:text-white cursor-pointer"
                                title="编辑微言"
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => requestDeleteMoment(mom)}
                                className="p-2 rounded-lg bg-red-500/15 text-red-400 cursor-pointer"
                                title="删除微言"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-3 border-t border-white/5 pl-1">
                            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">
                              Wilderness moment
                            </span>
                            <button
                              onClick={() => handleLikeMoment(mom.id)}
                              className={`flex items-center gap-1.5 px-4.5 py-1.5 rounded-full border text-xs font-medium cursor-pointer transition ${
                                isLiked
                                  ? 'bg-red-500/15 text-red-400 border-red-500/30 font-semibold'
                                  : 'bg-transparent text-slate-400 border-white/5 hover:border-white/10 hover:text-slate-200'
                              }`}
                            >
                              <Heart size={12} className={isLiked ? 'fill-red-400 text-red-500' : 'text-slate-400'} />
                              <span>{isLiked ? '已赞过' : '赞一个'} ({mom.likes})</span>
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab 3: About block */}
              {activeTab === 'about' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.99 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-panel p-6 sm:p-8 rounded-3xl space-y-8 select-text"
                  id="about-me-section"
                  role="tabpanel"
                  aria-labelledby="tab-btn-about"
                >
                  {/* Photo row */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-4 aspect-square rounded-2xl overflow-hidden border border-white/5">
                      <img
                        src="https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=600&q=80"
                        alt="工作摄影现场"
                        className="w-full h-full object-cover hover:scale-104 transition duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="md:col-span-8 space-y-4">
                      <h3 className="text-xl md:text-2xl font-black text-white font-['Noto_Serif_SC'] tracking-tight flex items-center gap-2">
                        “在荒野中，找寻数字边界的和谐”
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-light">
                        您好！我是林暮野（Wilderness），野外生活爱好者兼网络全栈工程师。我在上海陆家嘴等核心技术企业担任过多年的 system architect，后因极度迷恋在西藏 and 川西进行风光摄影，过上了半技术、半旅旅的生活。
                      </p>
                      <p className="text-xs sm:text-sm text-slate-350 leading-relaxed font-light">
                        这个名为 **VistaBlog** 的风景个人网络是我关于技术美学的一次探索，它抛弃了传统枯燥的纯色平面卡片，意在让观者在浏览各种思想沉淀时，能够拥有一幅随季节与心情变幻的高保真大自然背景，感受宇宙群山给予我们的沉潜能量。
                      </p>
                    </div>
                  </div>

                  {/* Skills lists */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
                    
                    <div className="glass-card p-5 rounded-2xl space-y-3">
                      <h4 className="text-sm font-semibold text-white flex items-center gap-1.5 border-b border-white/5 pb-2 font-['Noto_Serif_SC']">
                        <BookOpen size={14} className={style.accentText} />
                        技术与装备栈 (Tools & Techs)
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-300 font-mono">
                        <li>• Frontend: React 19 / TypeScript / Vite</li>
                        <li>• Style: Tailwind CSS / Motion Engineering</li>
                        <li>• Backend & DB: Node context / Firestore Admin</li>
                        <li>• Camera & Lens: Fujifilm GFX 100S / Hasselblad X2D</li>
                        <li>• Primary Drone: DJI Mavic 3 Pro Cine</li>
                      </ul>
                    </div>

                    <div className="p-5 bg-slate-950/30 border border-slate-800/80 rounded-2xl space-y-3">
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5 border-b border-slate-900 pb-2">
                        <Compass size={14} className={style.accentText} />
                        探索过并喜爱的绝境 (Adventures)
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-400 font-light">
                        <li>• **西藏阿里大环线** — 极境生命圣地 (2025年6月)</li>
                        <li>• **川西甘孜墨石公园/贡嘎** — 荒凉金辉折叠 (2026年10月)</li>
                        <li>• **冰岛斯奈山半岛** — 神秘黑夜与银闪极光 (2024年11月)</li>
                        <li>• **天目山古老竹道** — 自建茶寮与冥想室 (常驻)</li>
                      </ul>
                    </div>

                  </div>

                  {/* Recent 7 Days Blog Views Chart */}
                  <Suspense fallback={<LazyPanelFallback label="正在加载浏览趋势..." />}>
                    <WeeklyViewsChart currentTheme={currentTheme} style={style} />
                  </Suspense>

                  {/* Copyright quote */}
                  <div className="text-center text-slate-400 text-[11px] pt-4 leading-relaxed font-light">
                    “生命的密度，取决于你凝视风景的时间，以及你创造真实价值的纯净心流程度。” <br />
                    所有发布的博文图片均拥有 CC-BY 版权协议。商业约稿及旅行定制计划请通过社交账户与我联络。
                  </div>

                </motion.div>
              )}

              {/* Tab 4 removed - Wilderness Sandbox */}

            </div>

          </section>

        </div>

        {/* BOTTOM FOOLPROOF STATIC COPYRIGHT */}
        <footer
          className="mt-14 pt-6 border-t border-slate-850 text-center text-xs text-slate-400 leading-normal flex flex-col items-center gap-2 select-none cursor-default"
          onClick={handleFooterClick}
          role="presentation"
        >
          <div className="flex items-center gap-2">
            <span>© 2026 VistaBlog. All rights reserved.</span>
            <span>•</span>
            <span className="flex items-center gap-0.5">
              Powered by <span className="font-semibold text-slate-400">Google AI Studio</span>
            </span>
          </div>
          <div className="text-[10px] text-slate-650 max-w-lg font-light">
            本站使用毛玻璃界面与 Web Audio 合成环境白噪音。风景与音乐资源由 manifest 清单加载。
          </div>
        </footer>

      </div>

      <ScrollToTop />

      {/* 3. MODALS LIGHT BOXES */}
      <AnimatePresence>
        
        {/* Full screen blog reader modal */}
        {readingPost && (
          <Suspense fallback={<LazyPanelFallback label="正在打开阅读器..." />}>
            <ReaderModal
              post={readingPost}
              onClose={() => setReadingPost(null)}
              onLike={handleLikePost}
              onAddComment={handleAddComment}
              onDeleteComment={handleDeleteComment}
              onDeletePost={requestDeletePost}
              onEditPost={(p) => {
                setReadingPost(null);
                openWriter(p);
              }}
              isManageMode={isManageMode}
              accentClass={style.colorName}
            />
          </Suspense>
        )}

        {/* Dynamic Writer Creator editor modal */}
        {isWriteOpen && (
          <Suspense fallback={<LazyPanelFallback label="正在打开投稿编辑器..." />}>
            <WritePostModal
              onClose={closeWriter}
              onSavePost={handleAddNewPost}
              onSaveMoment={handleAddNewMoment}
              onUpdatePost={handleUpdatePost}
              onUpdateMoment={handleUpdateMoment}
              editingPost={editingPost}
              editingMoment={editingMoment}
              accentClass={style.colorName}
            />
          </Suspense>
        )}

      </AnimatePresence>

      {/* Global Wilderness Whispers Danmaku Overlay */}
      <Suspense fallback={null}>
        <DanmakuOverlay
          posts={posts}
          currentTheme={currentTheme}
          isGlobalVisible={isDanmakuVisible}
          setIsGlobalVisible={setIsDanmakuVisible}
        />
      </Suspense>

    </div>
  );
}
