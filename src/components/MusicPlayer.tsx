import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Music, ChevronUp, ChevronDown, ListMusic, X, Maximize2, Minimize2,
} from "lucide-react";

interface Song {
  id: string; title: string; artist: string; url: string;
  cover?: string; lrcText?: string;
}

const NCM_API = "https://ncm-api.vercel.app";

const fetchSong = async (id: string): Promise<Song | null> => {
  try {
    const detailRes = await fetch(`${NCM_API}/song/detail?ids=${id}`).then(r => r.json());
    const song = detailRes.songs?.[0];
    if (!song) return null;
    const urlRes = await fetch(`${NCM_API}/song/url?id=${id}`).then(r => r.json());
    const urlData = urlRes.data?.[0];
    if (!urlData?.url) return null;
    let lrcText = "";
    try { const lrcRes = await fetch(`${NCM_API}/lyric?id=${id}`).then(r => r.json()); lrcText = lrcRes.lrc?.lyric || ""; } catch {}
    return { id: String(song.id), title: song.name || "未知", artist: song.ar?.[0]?.name || "未知", url: urlData.url, cover: song.al?.picUrl || "", lrcText };
  } catch { return null; }
};

const FALLBACK: Song[] = [
  { id: "1", title: "森林雨声白噪音", artist: "Nature Sounds", url: "https://cdn.freesound.org/previews/528/528006_11542807-lq.mp3", cover: "https://cdn.pixabay.com/photo/2016/11/29/05/45/astronomy-1867616_200.jpg" },
  { id: "2", title: "海浪轻拍沙滩", artist: "Ocean Waves", url: "https://cdn.freesound.org/previews/467/467853_9497060-lq.mp3", cover: "https://cdn.pixabay.com/photo/2016/10/13/11/06/beach-1737124_200.jpg" },
  { id: "3", title: "篝火噼啪声", artist: "Campfire", url: "https://cdn.freesound.org/previews/423/423215_1038808-lq.mp3", cover: "https://cdn.pixabay.com/photo/2015/06/19/20/13/sunset-815270_200.jpg" },
];

type PlayerMode = "mini" | "expanded" | "focus";

// ===== 音频可视化 Hook =====
function useVisualizer(audioEl: HTMLAudioElement | null, isPlaying: boolean) {
  const [bars, setBars] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const srcRef = useRef<MediaElementAudioSourceNode | null>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!audioEl || !isPlaying) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      setBars(Array(16).fill(0));
      return;
    }
    if (!ctxRef.current) {
      try {
        const ctx = new AudioContext();
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64;
        analyser.smoothingTimeConstant = 0.7;
        const src = ctx.createMediaElementSource(audioEl);
        src.connect(analyser);
        analyser.connect(ctx.destination);
        ctxRef.current = ctx;
        analyserRef.current = analyser;
        srcRef.current = src;
      } catch { return; }
    }
    const dataArray = new Uint8Array(analyserRef.current!.frequencyBinCount);
    const tick = () => {
      analyserRef.current!.getByteFrequencyData(dataArray);
      const b = Array.from({ length: 16 }, (_, i) => dataArray[Math.floor(i * 1.5)] / 255);
      setBars(b);
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(rafRef.current);
  }, [audioEl, isPlaying]);

  return bars;
}

// ===== 旋律跳动条组件 =====
const VisualizerBars: React.FC<{ bars: number[]; color?: string; className?: string }> = ({ bars, color = "var(--accent-vibe-color)", className = "" }) => (
  <div className={`flex items-end justify-center gap-[3px] h-8 ${className}`}>
    {bars.map((v, i) => (
      <div
        key={i}
        className="w-[3px] rounded-full"
        style={{
          height: `${Math.max(3, v * 100)}%`,
          backgroundColor: color,
          opacity: 0.4 + v * 0.6,
          transition: "height 0.08s ease, opacity 0.08s ease",
        }}
      />
    ))}
  </div>
);

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [idx, setIdx] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);
  const [mode, setMode] = useState<PlayerMode>("mini");
  const [showList, setShowList] = useState(false);
    const [list, setList] = useState<Song[]>(FALLBACK);
  
  const audio = useRef<HTMLAudioElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
    const loadedRef = useRef(false);

  const song = list[idx];
  const bars = useVisualizer(audio.current, isPlaying);

  // 点击外部收起
  useEffect(() => {
    if (mode === "mini") return;
    const h = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setMode("mini"); setShowList(false);
      }
    };
    const t = setTimeout(() => document.addEventListener("mousedown", h), 100);
    return () => { clearTimeout(t); document.removeEventListener("mousedown", h); };
  }, [mode]);

  // ESC 退出
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mode !== "mini") { setMode("mini"); setShowList(false); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [mode]);

  // 加载歌单
  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    const load = async () => {
      try {
        const res = await fetch("/music.json");
        const cfg = await res.json();
        const ids: string[] = cfg.neteaseIds || [];
        if (ids.length > 0) {
          const songs: Song[] = [];
          for (const id of ids) { try { const s = await fetchSong(id); if (s) songs.push(s); } catch {} }
          if (songs.length > 0) { setList(songs); return; }
        }
      } catch {}
      try { const res = await fetch("/music.json"); const cfg = await res.json(); if (cfg.fallbackPlaylist?.length > 0) setList(cfg.fallbackPlaylist); } catch {}
    };
    load();
  }, []);

  const togglePlay = useCallback(() => {
    if (!audio.current) return;
    if (isPlaying) { audio.current.pause(); } else { audio.current.play().catch(() => {}); }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const next = useCallback(() => { setIdx(i => (i + 1) % list.length); setCur(0);  }, [list.length]);
  const prev = useCallback(() => { setIdx(i => (i - 1 + list.length) % list.length); setCur(0);  }, [list.length]);
  const seek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => { if (audio.current) audio.current.currentTime = parseFloat(e.target.value); }, []);
  const changeVol = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value); setVolume(v);
    if (audio.current) audio.current.volume = v;
    if (v > 0) setMuted(false);
  }, []);
  const toggleMute = useCallback(() => { setMuted(!muted); if (audio.current) audio.current.muted = !muted; }, [muted]);
  const play = useCallback((i: number) => {
    setIdx(i); setCur(0); setIsPlaying(true); setShowList(false); 
    setTimeout(() => audio.current?.play().catch(() => {}), 100);
  }, []);



  // 音频事件
  useEffect(() => {
    const a = audio.current; if (!a) return;
    const onTime = () => setCur(a.currentTime);
    const onMeta = () => setDur(a.duration || 0);
    const onEnd = () => next();
    const onErr = () => {};
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("ended", onEnd);
    a.addEventListener("error", onErr);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("ended", onEnd);
      a.removeEventListener("error", onErr);
    };
  }, [next]);

  // 切歌
  useEffect(() => {
    if (audio.current && song) { audio.current.src = song.url; audio.current.load(); if (isPlaying) audio.current.play().catch(() => {}); }
  }, [idx]);

  const fmt = (t: number) => {
    if (!t || !isFinite(t)) return "0:00";
    return `${Math.floor(t / 60)}:${Math.floor(t % 60).toString().padStart(2, "0")}`;
  };



  return (
    <>
      <audio ref={audio} preload="metadata" crossOrigin="anonymous" />

      {/* ===== Mini 态 ===== */}
      <AnimatePresence>
        {mode === "mini" && (
          <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed bottom-5 left-5 z-40 sm:bottom-6 sm:left-6">
            <button onClick={() => setMode("expanded")}
              className="glass-panel rounded-2xl p-3 flex items-center gap-3 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer group">
              <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 bg-slate-800 ring-2 ring-white/10"
                style={{ animation: isPlaying ? "spin 8s linear infinite" : "none" }}>
                {song?.cover ? <img src={song.cover} alt="" className="w-full h-full object-cover" /> :
                  <div className="w-full h-full flex items-center justify-center"><Music size={18} className="text-slate-500" /></div>}
              </div>
              <div className="hidden sm:block min-w-0 max-w-[100px]">
                <p className="text-xs font-semibold text-white truncate">{song?.title || "加载中..."}</p>
                <p className="text-[10px] text-slate-400 truncate">{song?.artist || ""}</p>
              </div>
              {/* 播放控件 */}
              <div className="flex items-center gap-1">
                <button onClick={e => { e.stopPropagation(); prev(); }} className="p-1.5 rounded-lg text-slate-400 hover:text-white transition"><SkipBack size={14} /></button>
                <button onClick={e => { e.stopPropagation(); togglePlay(); }} className="p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition">
                  {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                </button>
                <button onClick={e => { e.stopPropagation(); next(); }} className="p-1.5 rounded-lg text-slate-400 hover:text-white transition"><SkipForward size={14} /></button>
              </div>
              {/* 迷你旋律条 */}
              {isPlaying && <VisualizerBars bars={bars} className="w-12" />}
              <ChevronUp size={14} className="text-slate-400 group-hover:text-white transition" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== Expanded / Focus 态 ===== */}
      <AnimatePresence>
        {mode !== "mini" && (
          <motion.div ref={boxRef}
            initial={{ opacity: 0, y: mode === "focus" ? 100 : 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: mode === "focus" ? 100 : 50 }}
            transition={{ type: "spring", damping: 25 }}
            className={`fixed z-[100] glass-panel shadow-2xl overflow-hidden
              ${mode === "focus"
                ? "inset-4 sm:inset-8 md:inset-16 rounded-3xl"
                : "bottom-20 left-4 right-4 max-h-[65vh] rounded-3xl sm:bottom-6 sm:left-6 sm:right-auto sm:w-[380px] sm:max-h-[560px] sm:rounded-3xl"}`}
          >
            {mode === "focus" && song?.cover && (
              <div className="absolute inset-0 z-0">
                <img src={song.cover} alt="" className="w-full h-full object-cover" style={{ filter: "blur(50px) brightness(0.25)" }} />
                <div className="absolute inset-0 bg-black/45" />
              </div>
            )}

            <div className="relative z-10 flex flex-col max-h-[65vh] sm:max-h-[560px]">
              {/* 头部 */}
              <div className="flex items-center justify-between px-5 pt-4 pb-2 shrink-0">
                <span className="text-sm font-bold text-white">{mode === "focus" ? "专注模式" : "正在播放"}</span>
                <div className="flex items-center gap-1">

                  <button onClick={() => { setShowList(!showList); }}
                    className={`p-2 rounded-lg transition ${showList ? "bg-white/15 text-white" : "text-slate-400 hover:text-white hover:bg-white/10"}`}><ListMusic size={16} /></button>
                  <button onClick={() => setMode(mode === "focus" ? "expanded" : "focus")}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition hidden sm:block">
                    {mode === "focus" ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                  </button>
                  <button onClick={() => { setMode("mini"); setShowList(false); }}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition">
                    {mode === "focus" ? <X size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>
              </div>

              {/* 可滚动主体 */}
              <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-4">
                {/* 封面 / 信息 */}
                <div className={`flex flex-col items-center ${mode === "focus" ? "gap-4" : "flex-row gap-4"}`}>
                  <div className={`shrink-0 rounded-2xl overflow-hidden bg-slate-800 ring-1 ring-white/10 ${mode === "focus" ? "w-48 h-48 sm:w-56 sm:h-56" : "w-16 h-16 sm:w-20 sm:h-20"}`}>
                    {song?.cover ? <img src={song.cover} alt="" className="w-full h-full object-cover" /> :
                      <div className="w-full h-full flex items-center justify-center"><Music size={mode === "focus" ? 48 : 24} className="text-slate-600" /></div>}
                  </div>
                  <div className={`min-w-0 text-center ${mode === "expanded" && !mode.includes("focus") ? "flex-1 text-left" : ""}`}>
                    <p className={`font-bold text-white truncate ${mode === "focus" ? "text-lg" : "text-sm"}`}>{song?.title || "加载中..."}</p>
                    <p className={`text-slate-400 truncate ${mode === "focus" ? "text-sm mt-1" : "text-xs"}`}>{song?.artist || ""}</p>
                  </div>
                </div>

                {/* 旋律跳动条 */}
                {isPlaying && (
                  <VisualizerBars bars={bars} className="py-2 h-12" />
                )}

                {/* 进度条 */}
                <div className="space-y-1.5">
                  <input type="range" min={0} max={dur || 0} step={0.1} value={cur} onChange={seek}
                    className="w-full h-1.5 bg-white/15 rounded-full appearance-none cursor-pointer accent-white" />
                  <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                    <span className="font-mono">{fmt(cur)}</span><span className="font-mono">{fmt(dur)}</span>
                  </div>
                </div>

                {/* 控制 */}
                <div className={`flex items-center justify-center gap-6 ${mode === "focus" ? "gap-8" : ""}`}>
                  <button onClick={prev} className={`rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition ${mode === "focus" ? "p-3" : "p-2.5"}`}><SkipBack size={mode === "focus" ? 24 : 20} /></button>
                  <button onClick={togglePlay} className={`rounded-full bg-white/15 text-white hover:bg-white/25 transition shadow-lg ${mode === "focus" ? "p-5" : "p-4"}`}>
                    {isPlaying ? <Pause size={mode === "focus" ? 28 : 24} /> : <Play size={mode === "focus" ? 28 : 24} className="ml-0.5" />}
                  </button>
                  <button onClick={next} className={`rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition ${mode === "focus" ? "p-3" : "p-2.5"}`}><SkipForward size={mode === "focus" ? 24 : 20} /></button>
                </div>

                {/* 音量 */}
                {mode === "expanded" && (
                  <div className="flex items-center gap-3">
                    <button onClick={toggleMute} className="text-slate-400 hover:text-white transition shrink-0">
                      {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                    <input type="range" min={0} max={1} step={0.01} value={muted ? 0 : volume} onChange={changeVol}
                      className="flex-1 h-1 bg-white/15 rounded-full appearance-none cursor-pointer accent-white" />
                  </div>
                )}



                {/* 播放列表 */}
                <AnimatePresence>
                  {showList && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                      <p className="text-xs font-medium text-slate-400 mb-2">播放列表 · {list.length}首</p>
                      <div className="space-y-1">
                        {list.map((s, i) => (
                          <button key={s.id} onClick={() => play(i)}
                            className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition text-left ${
                              i === idx ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>
                            <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-slate-800">
                              {s.cover ? <img src={s.cover} alt="" className="w-full h-full object-cover" /> :
                                <div className="w-full h-full flex items-center justify-center"><Music size={14} className="text-slate-600" /></div>}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium truncate">{s.title}</p>
                              <p className="text-xs text-slate-500 truncate">{s.artist}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
