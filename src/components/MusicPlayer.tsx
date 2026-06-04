import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music, ChevronUp, ChevronDown, ListMusic, X } from 'lucide-react';

interface Song {
  id: string;
  title: string;
  artist: string;
  url: string;
  cover?: string;
  lrcText?: string;
}

const NCM_API = 'https://ncm-api.vercel.app';

// 从 NCM API 加载歌曲
const fetchSong = async (id: string): Promise<Song | null> => {
  try {
    // 先获取歌曲详情
    const detailRes = await fetch(`${NCM_API}/song/detail?ids=${id}`).then(r => r.json());
    const song = detailRes.songs?.[0];
    if (!song) return null;

    // 获取播放地址
    const urlRes = await fetch(`${NCM_API}/song/url?id=${id}`).then(r => r.json());
    const urlData = urlRes.data?.[0];
    if (!urlData?.url) return null;

    // 获取歌词
    let lrcText = '';
    try {
      const lrcRes = await fetch(`${NCM_API}/lyric?id=${id}`).then(r => r.json());
      lrcText = lrcRes.lrc?.lyric || '';
    } catch {}

    return {
      id: String(song.id),
      title: song.name || '未知',
      artist: song.ar?.[0]?.name || '未知',
      url: urlData.url,
      cover: song.al?.picUrl || '',
      lrcText,
    };
  } catch {
    return null;
  }
};

const FALLBACK: Song[] = [
  { id: '1', title: '森林雨声白噪音', artist: 'Nature Sounds', url: 'https://cdn.freesound.org/previews/528/528006_11542807-lq.mp3', cover: 'https://cdn.pixabay.com/photo/2016/11/29/05/45/astronomy-1867616_200.jpg' },
  { id: '2', title: '海浪轻拍沙滩', artist: 'Ocean Waves', url: 'https://cdn.freesound.org/previews/467/467853_9497060-lq.mp3', cover: 'https://cdn.pixabay.com/photo/2016/10/13/11/06/beach-1737124_200.jpg' },
  { id: '3', title: '篝火噼啪声', artist: 'Campfire', url: 'https://cdn.freesound.org/previews/423/423215_1038808-lq.mp3', cover: 'https://cdn.pixabay.com/photo/2015/06/19/20/13/sunset-815270_200.jpg' },
];

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [idx, setIdx] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [showList, setShowList] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [list, setList] = useState<Song[]>(FALLBACK);
  const [loaded, setLoaded] = useState(false);

  const audio = useRef<HTMLAudioElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const lyricRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);

  const song = list[idx];

  // 点击外部收起
  useEffect(() => {
    if (!expanded) return;
    const h = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setExpanded(false); setShowList(false); setShowLyrics(false);
      }
    };
    const t = setTimeout(() => document.addEventListener('mousedown', h), 100);
    return () => { clearTimeout(t); document.removeEventListener('mousedown', h); };
  }, [expanded]);

  // 加载歌单 - 只执行一次
  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    const load = async () => {
      // 1. 尝试加载网易云音乐
      try {
        const res = await fetch('/music.json');
        const cfg = await res.json();
        const ids: string[] = cfg.neteaseIds || [];

        if (ids.length > 0) {
          const songs: Song[] = [];
          for (const id of ids) {
            try {
              const song = await fetchSong(id);
              if (song) songs.push(song);
            } catch {}
          }
          if (songs.length > 0) {
            setList(songs);
            setLoaded(true);
            return;
          }
        }
      } catch {}

      // 2. 网易云加载失败，使用备用音乐
      try {
        const res = await fetch('/music.json');
        const cfg = await res.json();
        if (cfg.fallbackPlaylist?.length > 0) {
          setList(cfg.fallbackPlaylist);
        }
      } catch {}
      setLoaded(true);
    };
    load();
  }, []);

  // 播放控制
  const togglePlay = useCallback(() => {
    if (!audio.current) return;
    isPlaying ? audio.current.pause() : audio.current.play().catch(() => {});
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const next = useCallback(() => { setIdx(i => (i + 1) % list.length); setCur(0); }, [list.length]);
  const prev = useCallback(() => { setIdx(i => (i - 1 + list.length) % list.length); setCur(0); }, [list.length]);
  const seek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => { if (audio.current) audio.current.currentTime = parseFloat(e.target.value); }, []);
  const changeVol = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value); setVolume(v);
    if (audio.current) audio.current.volume = v;
    if (v > 0) setMuted(false);
  }, []);
  const toggleMute = useCallback(() => { setMuted(!muted); if (audio.current) audio.current.muted = !muted; }, [muted]);

  const play = useCallback((i: number) => {
    setIdx(i); setCur(0); setIsPlaying(true); setShowList(false); setShowLyrics(false);
    setTimeout(() => audio.current?.play().catch(() => {}), 100);
  }, []);

  // 歌词解析
  const lyrics = useMemo(() => {
    const raw = song?.lrcText || '';
    if (!raw) return [];
    const parsed: { t: number; text: string }[] = [];
    const re = /\[(\d{2,}):(\d{2})(?:[.:](\d{2,3}))?\]/g;
    for (const line of raw.split('\n')) {
      const text = line.replace(/\[\d{2,}:\d{2}(?:[.:]\d{2,3})?\]/g, '').trim();
      if (!text) continue;
      let m; const times: number[] = [];
      while ((m = re.exec(line)) !== null) times.push(parseInt(m[1]) * 60 + parseInt(m[2]) + (m[3] ? parseFloat(`0.${m[3]}`) : 0));
      times.forEach(t => parsed.push({ t, text }));
    }
    return parsed.sort((a, b) => a.t - b.t);
  }, [song?.lrcText]);

  const activeLyric = useMemo(() => {
    if (!lyrics.length) return -1;
    let i = lyrics.findIndex(l => l.t > cur) - 1;
    return Math.max(0, i === -2 ? lyrics.length - 1 : i);
  }, [cur, lyrics]);

  // 音频事件
  useEffect(() => {
    const a = audio.current; if (!a) return;
    const onTime = () => setCur(a.currentTime);
    const onMeta = () => setDur(a.duration);
    const onEnd = () => next();
    a.addEventListener('timeupdate', onTime);
    a.addEventListener('loadedmetadata', onMeta);
    a.addEventListener('ended', onEnd);
    return () => { a.removeEventListener('timeupdate', onTime); a.removeEventListener('loadedmetadata', onMeta); a.removeEventListener('ended', onEnd); };
  }, [next]);

  useEffect(() => {
    if (audio.current && song) {
      audio.current.src = song.url; audio.current.load();
      if (isPlaying) audio.current.play().catch(() => {});
    }
  }, [idx]);

  // 歌词滚动
  useEffect(() => {
    if (lyricRef.current && showLyrics && activeLyric >= 0) {
      (lyricRef.current.children[activeLyric] as HTMLElement)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeLyric, showLyrics]);

  const fmt = (t: number) => { if (!t || isNaN(t)) return '0:00'; return `${Math.floor(t / 60)}:${Math.floor(t % 60).toString().padStart(2, '0')}`; };

  return (
    <>
      <audio ref={audio} preload="metadata" />

      {/* 迷你播放器 */}
      <AnimatePresence>
        {!expanded && (
          <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed bottom-5 left-5 z-50 sm:bottom-6 sm:left-6">
            <button onClick={() => setExpanded(true)}
              className="glass-panel rounded-2xl p-3 flex items-center gap-3 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer group">
              <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 bg-slate-800 ring-2 ring-white/10">
                {song?.cover ? <img src={song.cover} alt="" className="w-full h-full object-cover" /> :
                  <div className="w-full h-full flex items-center justify-center"><Music size={18} className="text-slate-500" /></div>}
              </div>
              <div className="hidden sm:block min-w-0 max-w-[100px]">
                <p className="text-xs font-semibold text-white truncate">{song?.title || '加载中...'}</p>
                <p className="text-[10px] text-slate-400 truncate">{song?.artist || ''}</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={e => { e.stopPropagation(); prev(); }} className="p-1.5 rounded-lg text-slate-400 hover:text-white transition"><SkipBack size={14} /></button>
                <button onClick={e => { e.stopPropagation(); togglePlay(); }} className="p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition">
                  {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                </button>
                <button onClick={e => { e.stopPropagation(); next(); }} className="p-1.5 rounded-lg text-slate-400 hover:text-white transition"><SkipForward size={14} /></button>
              </div>
              <ChevronUp size={14} className="text-slate-400 group-hover:text-white transition" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 完整播放器 */}
      <AnimatePresence>
        {expanded && (
          <motion.div ref={boxRef}
            initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed z-50 glass-panel shadow-2xl overflow-hidden
              bottom-0 left-0 right-0 max-h-[85vh] rounded-t-3xl
              sm:bottom-6 sm:left-6 sm:right-auto sm:w-[380px] sm:rounded-3xl">
            <div className="flex flex-col max-h-[85vh] sm:max-h-[600px]">
              {/* 头部 */}
              <div className="flex items-center justify-between px-5 pt-4 pb-2 shrink-0">
                <span className="text-sm font-bold text-white">正在播放</span>
                <div className="flex items-center gap-1">
                  {lyrics.length > 0 && (
                    <button onClick={() => { setShowLyrics(!showLyrics); setShowList(false); }}
                      className={`px-2.5 py-1 rounded-lg text-xs transition ${showLyrics ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}>词</button>
                  )}
                  <button onClick={() => { setShowList(!showList); setShowLyrics(false); }}
                    className={`p-2 rounded-lg transition ${showList ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}><ListMusic size={16} /></button>
                  <button onClick={() => { setExpanded(false); setShowList(false); setShowLyrics(false); }}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition hidden sm:block"><ChevronDown size={16} /></button>
                  <button onClick={() => { setExpanded(false); setShowList(false); setShowLyrics(false); }}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition sm:hidden"><X size={16} /></button>
                </div>
              </div>

              {/* 可滚动内容 */}
              <div className="flex-1 overflow-y-auto min-h-0">
                {/* 封面 */}
                <div className="px-5 pb-3">
                  <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-slate-800 shadow-lg max-w-[240px] mx-auto">
                    {song?.cover ? <img src={song.cover} alt="" className="w-full h-full object-cover" /> :
                      <div className="w-full h-full flex items-center justify-center"><Music size={48} className="text-slate-600" /></div>}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                  <p className="text-base font-bold text-white truncate text-center">{song?.title || '未知'}</p>
                  <p className="text-sm text-slate-400 mt-0.5 text-center">{song?.artist || ''}</p>
                </div>

                {/* 进度条 */}
                <div className="px-5 mb-3">
                  <input type="range" min={0} max={dur || 0} value={cur} onChange={seek}
                    className="w-full h-1.5 bg-white/15 rounded-full appearance-none cursor-pointer accent-white" />
                  <div className="flex justify-between text-[11px] text-slate-500 mt-1.5">
                    <span>{fmt(cur)}</span><span>{fmt(dur)}</span>
                  </div>
                </div>

                {/* 控制 */}
                <div className="flex items-center justify-center gap-6 px-5 mb-4">
                  <button onClick={prev} className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition"><SkipBack size={20} /></button>
                  <button onClick={togglePlay} className="p-4 rounded-full bg-white/15 text-white hover:bg-white/25 transition shadow-lg">
                    {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-0.5" />}
                  </button>
                  <button onClick={next} className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition"><SkipForward size={20} /></button>
                </div>

                {/* 音量 */}
                <div className="flex items-center gap-3 px-5 mb-4">
                  <button onClick={toggleMute} className="text-slate-400 hover:text-white transition shrink-0">
                    {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>
                  <input type="range" min={0} max={1} step={0.01} value={muted ? 0 : volume} onChange={changeVol}
                    className="flex-1 h-1 bg-white/15 rounded-full appearance-none cursor-pointer accent-white" />
                </div>

                {/* 歌词 */}
                <AnimatePresence>
                  {showLyrics && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-5 pb-3">
                      <div className="max-h-44 overflow-y-auto rounded-xl bg-black/20 p-3" ref={lyricRef}>
                        {lyrics.length > 0 ? lyrics.map((l, i) => (
                          <div key={i} className={`py-1.5 text-center transition-all duration-300 ${
                            i === activeLyric ? 'text-white font-bold text-sm scale-105' :
                            i < activeLyric ? 'text-slate-500 text-xs' : 'text-slate-400 text-xs'}`}>{l.text}</div>
                        )) : <p className="text-center text-xs text-slate-500 py-4">暂无歌词</p>}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 播放列表 */}
                <AnimatePresence>
                  {showList && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-5 pb-4">
                      <p className="text-xs font-medium text-slate-400 mb-2">播放列表 · {list.length}首</p>
                      <div className="space-y-1">
                        {list.map((s, i) => (
                          <button key={s.id} onClick={() => play(i)}
                            className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition text-left ${
                              i === idx ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                            <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-slate-800">
                              {s.cover ? <img src={s.cover} alt="" className="w-full h-full object-cover" /> :
                                <div className="w-full h-full flex items-center justify-center"><Music size={14} className="text-slate-600" /></div>}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium truncate">{s.title}</p>
                              <p className="text-xs text-slate-500 truncate">{s.artist}</p>
                            </div>
                            {i === idx && isPlaying && (
                              <div className="flex gap-0.5 items-end h-4">
                                {[1, 2, 3].map(n => (
                                  <motion.div key={n} animate={{ height: ['40%', '100%', '40%'] }}
                                    transition={{ duration: 0.6, repeat: Infinity, delay: n * 0.15 }}
                                    className="w-0.5 bg-white rounded-full" />
                                ))}
                              </div>
                            )}
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
    </>
  );
}
