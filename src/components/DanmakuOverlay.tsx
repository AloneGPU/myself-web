import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, Eye, EyeOff, Sparkles, Smile, Flame, Check } from 'lucide-react';
import { BlogPost, BackgroundTheme } from '../types';

interface DanmakuOverlayProps {
  posts: BlogPost[];
  currentTheme: BackgroundTheme;
  isGlobalVisible: boolean;
  setIsGlobalVisible: (visible: boolean) => void;
}

interface Bullet {
  id: string;
  text: string;
  author: string;
  avatar: string;
  color: string;
  speed: number; // Duration in seconds (e.g. 12 to 24)
  lane: number; // Horizontal lane index
  createdAt: number;
}

// Prefilled high-quality atmospheric danmakus matching our deep wilderness context
const ATMOSPHERIC_PRESETS = [
  { text: "川西里索海的日落金山，真的看哭了我...", author: "野松客", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Yisong" },
  { text: "数字极简修行，少去刷垃圾娱乐，人感觉轻松了一万倍", author: "字节拾荒者", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=ByteHunter" },
  { text: "摄影并不是征服，而是将灵魂融入极境瞬间的寂静中 📷", author: "HasselbladX", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Hass" },
  { text: "冰岛黑色布迪尔教堂的极光挽歌，配上松涛声太有氛围美了！", author: "AuroraWatcher", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Aurora" },
  { text: "请问博主最近去过川西的新都桥吗？求攻略 🧭", author: "徒步小林", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Xiaolin" },
  { text: "在这个高频吵闹的现代，这里是最温柔的信息避风港 🏕️", author: "幽谷漫步", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Valley" },
  { text: "用 Web Audio 纯代码合成的风和篝火声，真的太拟真了 ✨", author: "前端声学客", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=AudioMan" },
  { text: "阿里环线的冈仁波齐真的是神圣极光之巅，洗涤身心 🏔️", author: "拉萨单车", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Lhasa" },
  { text: "刚刚阅读了您的文章，关于摄影和生活的讨论写得非常深邃！", author: "木燃", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Muran" },
  { text: "每次写bug累了，就来这听雨看风景，效率瞬间拉满", author: "全栈风光客", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Pragmatist" }
];

const THEME_ACCENT_GLOWS: Record<string, string> = {
  'forest-lake': 'border-emerald-500/20 shadow-emerald-550/10 text-emerald-400',
  'misty-mountain': 'border-amber-500/20 shadow-amber-550/10 text-amber-400',
  'starry-peaks': 'border-indigo-500/20 shadow-indigo-550/10 text-indigo-400',
  'sunrise-ocean': 'border-cyan-500/20 shadow-cyan-550/10 text-cyan-400',
  'winter-dawn': 'border-teal-500/20 shadow-teal-550/10 text-teal-400'
};

const COLOURED_VARIANTS = [
  'text-indigo-300 border-indigo-500/20 bg-indigo-950/40 shadow-indigo-500/5',
  'text-emerald-300 border-emerald-500/20 bg-emerald-950/40 shadow-emerald-500/5',
  'text-amber-300 border-amber-500/20 bg-amber-950/40 shadow-amber-500/5',
  'text-teal-300 border-teal-500/20 bg-teal-950/40 shadow-teal-500/5',
  'text-cyan-300 border-cyan-500/20 bg-cyan-950/40 shadow-cyan-500/5',
  'text-purple-300 border-purple-500/20 bg-purple-950/40 shadow-purple-500/5',
  'text-white/90 border-slate-700 bg-slate-900/60 shadow-slate-500/5'
];

export default function DanmakuOverlay({ posts, currentTheme, isGlobalVisible, setIsGlobalVisible }: DanmakuOverlayProps) {
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [customText, setCustomText] = useState('');
  const [customAuthor, setCustomAuthor] = useState('');
  const [showControlPanel, setShowControlPanel] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const bulletIdCounterRef = useRef(0);
  const lastSpawnTimeRef = useRef(0);
  const totalLanes = 6; // Number of vertical lanes to prevent text overlap
  const commentPoolRef = useRef<Array<{text: string; author: string; avatar: string}>>([]);

  // Compile full user comments pool
  useEffect(() => {
    const list: Array<{text: string; author: string; avatar: string}> = [];
    
    // 1. Gather real comments from blog database
    posts.forEach(post => {
      if (post.comments && Array.isArray(post.comments)) {
        post.comments.forEach(c => {
          list.push({
            text: c.content,
            author: c.author,
            avatar: c.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(c.author)}`
          });
        });
      }
    });

    // 2. Combine with premium presets
    const combined = [...list, ...ATMOSPHERIC_PRESETS];
    commentPoolRef.current = combined;
  }, [posts]);

  // Periodic automatic bullet generator inside active loop if visible
  useEffect(() => {
    if (!isGlobalVisible) {
      setBullets([]);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      // Ensure we don't spawn too crowded (e.g. at least 1.5 seconds between spawn)
      if (now - lastSpawnTimeRef.current < 1600) return;

      const pool = commentPoolRef.current;
      if (pool.length === 0) return;

      // Select random item
      const randomItem = pool[Math.floor(Math.random() * pool.length)];
      
      // Select random parameters
      const lane = Math.floor(Math.random() * totalLanes);
      const speed = 14 + Math.random() * 10; // 14 to 24s duration
      const color = COLOURED_VARIANTS[Math.floor(Math.random() * COLOURED_VARIANTS.length)];
      const id = `auto-bullet-${bulletIdCounterRef.current++}-${now}`;

      const newBullet: Bullet = {
        id,
        text: randomItem.text,
        author: randomItem.author,
        avatar: randomItem.avatar,
        color,
        speed,
        lane,
        createdAt: now
      };

      setBullets(prev => [...prev, newBullet]);
      lastSpawnTimeRef.current = now;
    }, 2200);

    return () => clearInterval(interval);
  }, [isGlobalVisible]);

  // Clean up bullets that have completed their translation across screen to prevent memory buildup
  useEffect(() => {
    if (!isGlobalVisible) return;

    const cleaner = setInterval(() => {
      const now = Date.now();
      // Since speed represents duration in seconds, buffer with extra seconds
      setBullets(prev => prev.filter(b => now - b.createdAt < (b.speed * 1000 + 4000)));
    }, 4000);

    return () => clearInterval(cleaner);
  }, [isGlobalVisible]);

  // Action for sending raw custom bullet live
  const handleSendBullet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;

    const author = customAuthor.trim() || '过往行旅';
    const text = customText.trim();
    const now = Date.now();
    const lane = Math.floor(Math.random() * totalLanes);
    const speed = 12 + Math.random() * 4; // User bullets traverse slightly faster
    const color = 'text-white border-sky-400 bg-sky-950/50 shadow-sky-500/10 font-medium scale-102';
    const id = `user-bullet-${bulletIdCounterRef.current++}-${now}`;

    const newBullet: Bullet = {
      id,
      text,
      author,
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(author)}`,
      color,
      speed,
      lane,
      createdAt: now
    };

    // Ensure we also save to the local live pool
    commentPoolRef.current.unshift({ text, author, avatar: newBullet.avatar });

    setBullets(prev => [...prev, newBullet]);
    setCustomText('');
    
    // Success toast
    setToastMessage('心声成功汇入极境漂流河中 ✨');
    setTimeout(() => setToastMessage(null), 2500);
  };

  const activeColorGlow = THEME_ACCENT_GLOWS[currentTheme.id] || 'border-emerald-500/20 text-emerald-400';

  return (
    <>
      {/* 1. STUNNING BACKGROUND WATERFALL DANMAKU CANVAS */}
      {isGlobalVisible && (
        <div 
          className="fixed inset-0 top-16 bottom-20 z-10 pointer-events-none overflow-hidden select-none"
          id="danmaku-scenery-overlay"
        >
          {bullets.map((bullet) => {
            // Distribute lanes vertically
            // Total height to work with is roughly 65% of screen
            const verticalPercent = 12 + (bullet.lane * 14); // 12%, 26%, 40%, 54%, 68%, 82% 
            
            return (
              <div
                key={bullet.id}
                className={`absolute left-full flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border shadow-md backdrop-blur-[3px] select-none text-xs font-light tracking-wide shrink-0 transition-transform ${bullet.color}`}
                style={{
                  top: `${verticalPercent}%`,
                  transform: 'translateX(0px)',
                  willChange: 'transform',
                  animation: `danmakuMoveLine ${bullet.speed}s linear forwards`
                }}
              >
                <img 
                  src={bullet.avatar} 
                  alt={bullet.author}
                  className="w-5.5 h-5.5 rounded-full object-cover border border-white/10"
                  referrerPolicy="no-referrer"
                />
                <span className="opacity-70 font-semibold text-[10px] shrink-0">
                  {bullet.author}:
                </span>
                <span className="truncate max-w-[240px] font-['Noto_Serif_SC'] font-medium">
                  {bullet.text}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Inject custom global CSS keyframes for danmaku movement */}
      <style>{`
        @keyframes danmakuMoveLine {
          0% {
            transform: translateX(0px);
          }
          100% {
            transform: translateX(calc(-100vw - 450px));
          }
        }
      `}</style>

      {/* 2. FLOATING CONTROL CONSOLE (NICE TRANSLUCENT CAPSULE PINNED AT THE BOTTOM) */}
      <div className="fixed bottom-6 right-6 z-40 select-none font-mono" id="danmaku-controller-bubble">
        
        <div className="flex flex-col items-end gap-3.5">
          
          {/* Toast notifications */}
          <AnimatePresence>
            {toastMessage && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="px-4 py-2 bg-slate-950/90 border border-emerald-500/30 text-emerald-300 text-[11px] rounded-xl shadow-xl flex items-center gap-1.5 backdrop-blur-md"
              >
                <Check size={12} className="text-emerald-450" />
                <span>{toastMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Core Control Panel popover */}
          <AnimatePresence>
            {showControlPanel && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 15 }}
                className="w-[290px] bg-slate-950/85 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl space-y-4 text-left mr-1"
              >
                {/* Header title */}
                <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                  <div className="flex items-center gap-1.5">
                    <MessageSquare size={14} className="text-indigo-400" />
                    <span className="text-xs font-bold text-slate-100 font-['Noto_Serif_SC']">
                      荒野心声漂流控制台
                    </span>
                  </div>
                  
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${isGlobalVisible ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/15 animate-pulse' : 'bg-slate-800 text-slate-400 border-white/5'}`}>
                    {isGlobalVisible ? '漂流中' : '静止中'}
                  </span>
                </div>

                {/* Subtext description */}
                <p className="text-[10px] text-slate-400 leading-normal font-light">
                  开启漂流后，所有文章评论、林主信札及探索印记将幻化为碎语倒映在屏幕上，与您共同看山听涛。
                </p>

                {/* Switch button */}
                <div className="flex items-center justify-between p-2.5 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-xs text-slate-300">漂流弹幕开启状态:</span>
                  <button
                    onClick={() => setIsGlobalVisible(!isGlobalVisible)}
                    className={`w-11 h-6 rounded-full p-0.5 transition cursor-pointer flex items-center ${
                      isGlobalVisible ? 'bg-emerald-500 justify-end' : 'bg-slate-700 justify-start'
                    }`}
                  >
                    <motion.div layout className="w-5 h-5 rounded-full bg-white shadow-md" />
                  </button>
                </div>

                {/* Instant Send Bullet Form */}
                <form onSubmit={handleSendBullet} className="space-y-2.5 pt-1">
                  <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                    发送我的漂流心声 (Cast Bullet)
                  </div>
                  
                  <div className="grid grid-cols-12 gap-1.5">
                    <input
                      type="text"
                      placeholder="昵称 (选填)"
                      value={customAuthor}
                      onChange={(e) => setCustomAuthor(e.target.value)}
                      maxLength={14}
                      className="col-span-4 px-2 py-1.5 bg-slate-900 border border-white/5 focus:border-white/12 text-slate-100 text-[11px] rounded-lg focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="这一刻你在想什么..."
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      required
                      maxLength={80}
                      className="col-span-8 px-2.5 py-1.5 bg-slate-900 border border-white/5 focus:border-white/12 text-slate-100 text-[11px] rounded-lg focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-1.5 rounded-lg text-[11px] font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Send size={11} />
                    <span>汇入漂流长河</span>
                  </button>
                </form>

              </motion.div>
            )}
          </AnimatePresence>

          {/* The compact toggle knob itself */}
          <button
            onClick={() => setShowControlPanel(!showControlPanel)}
            className={`px-4 py-2.5 rounded-full bg-slate-950/80 backdrop-blur-md border hover:brightness-110 flex items-center gap-2 shadow-2xl transition cursor-pointer duration-300 ${
              isGlobalVisible ? activeColorGlow : 'border-white/5 text-slate-400'
            }`}
            title="点击展开荒野心声弹幕控制台"
          >
            {isGlobalVisible ? (
              <>
                <motion.div 
                  animate={{ scale: [1, 1.25, 1] }} 
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-2 h-2 rounded-full bg-emerald-450 shrink-0" 
                />
                <span className="text-xs font-bold text-white tracking-wide">
                  弹幕已开 ({bullets.length})
                </span>
                <Eye size={14} className="text-slate-400" />
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0" />
                <span className="text-xs text-slate-400 font-light">
                  弹幕漂流离线
                </span>
                <EyeOff size={14} className="text-slate-500" />
              </>
            )}
          </button>

        </div>

      </div>
    </>
  );
}
