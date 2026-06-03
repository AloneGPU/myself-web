import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Music,
  Image as ImageIcon,
  Download,
  Search,
  Play,
  Pause,
  Check,
  RefreshCw,
  Globe,
  Headphones,
  Wallpaper,
  Star,
  Clock,
  Tag
} from 'lucide-react';
import { BackgroundTheme, MusicTrack, CrawledBackground } from '../types';

interface MediaCrawlerProps {
  currentTheme: BackgroundTheme;
  style: {
    accentText: string;
    accentBtn: string;
    badgeClass: string;
  };
  onSetBackground?: (bg: CrawledBackground) => void;
  onPlayMusic?: (track: MusicTrack) => void;
}

// 精选背景图片库 - 使用国内可访问的 Pixabay CDN
const CRAWLED_BACKGROUNDS: CrawledBackground[] = [
  {
    id: 'bg-01',
    url: 'https://cdn.pixabay.com/photo/2017/02/01/22/02/mountain-landscape-2031539_1280.jpg',
    photographer: 'Pixabay',
    photographerUrl: 'https://pixabay.com',
    description: '阿尔卑斯山脉日出金光',
    location: '瑞士阿尔卑斯山'
  },
  {
    id: 'bg-02',
    url: 'https://cdn.pixabay.com/photo/2015/12/01/20/28/road-1072823_1280.jpg',
    photographer: 'Pixabay',
    photographerUrl: 'https://pixabay.com',
    description: '晨雾森林秘境',
    location: '德国黑森林'
  },
  {
    id: 'bg-03',
    url: 'https://cdn.pixabay.com/photo/2016/11/29/05/45/astronomy-1867616_1280.jpg',
    photographer: 'Pixabay',
    photographerUrl: 'https://pixabay.com',
    description: '星空银河拱桥',
    location: '澳大利亚乌鲁鲁'
  },
  {
    id: 'bg-04',
    url: 'https://cdn.pixabay.com/photo/2014/02/27/16/10/flowers-276014_1280.jpg',
    photographer: 'Pixabay',
    photographerUrl: 'https://pixabay.com',
    description: '高山湖泊倒影',
    location: '新西兰皇后镇'
  },
  {
    id: 'bg-05',
    url: 'https://cdn.pixabay.com/photo/2017/08/30/01/05/milky-way-2695569_1280.jpg',
    photographer: 'Pixabay',
    photographerUrl: 'https://pixabay.com',
    description: '银河夜空',
    location: '冰岛'
  },
  {
    id: 'bg-06',
    url: 'https://cdn.pixabay.com/photo/2016/10/13/11/06/beach-1737124_1280.jpg',
    photographer: 'Pixabay',
    photographerUrl: 'https://pixabay.com',
    description: '热带海滩日落',
    location: '马尔代夫'
  },
  {
    id: 'bg-07',
    url: 'https://cdn.pixabay.com/photo/2015/06/19/20/13/sunset-815270_1280.jpg',
    photographer: 'Pixabay',
    photographerUrl: 'https://pixabay.com',
    description: '海边夕阳',
    location: '三亚'
  },
  {
    id: 'bg-08',
    url: 'https://cdn.pixabay.com/photo/2014/01/18/16/27/forest-820289_1280.jpg',
    photographer: 'Pixabay',
    photographerUrl: 'https://pixabay.com',
    description: '森林小径',
    location: '四川九寨沟'
  },
  {
    id: 'bg-09',
    url: 'https://cdn.pixabay.com/photo/2013/10/14/16/22/snow-covered-mountain-195411_1280.jpg',
    photographer: 'Pixabay',
    photographerUrl: 'https://pixabay.com',
    description: '雪山雄峰',
    location: '西藏珠穆朗玛'
  }
];

// 精选背景音乐库 - 使用免费商用音效资源
const CRAWLED_MUSIC: MusicTrack[] = [
  {
    id: 'music-01',
    title: '森林雨声白噪音',
    artist: 'Freesound',
    duration: '5:23',
    url: 'https://cdn.freesound.org/previews/528/528006_11542807-lq.mp3',
    coverUrl: 'https://cdn.pixabay.com/photo/2016/11/29/05/45/astronomy-1867616_200.jpg',
    category: '自然白噪音',
    tags: ['雨声', '雷声', '森林', '白噪音']
  },
  {
    id: 'music-02',
    title: '海浪轻拍沙滩',
    artist: 'Freesound',
    duration: '3:45',
    url: 'https://cdn.freesound.org/previews/467/467853_9497060-lq.mp3',
    coverUrl: 'https://cdn.pixabay.com/photo/2016/10/13/11/06/beach-1737124_200.jpg',
    category: '自然白噪音',
    tags: ['海浪', '沙滩', '放松', '冥想']
  },
  {
    id: 'music-03',
    title: '篝火噼啪声',
    artist: 'Freesound',
    duration: '4:12',
    url: 'https://cdn.freesound.org/previews/423/423215_1038808-lq.mp3',
    coverUrl: 'https://cdn.pixabay.com/photo/2015/06/19/20/13/sunset-815270_200.jpg',
    category: '自然白噪音',
    tags: ['篝火', '露营', '温暖', '氛围']
  },
  {
    id: 'music-04',
    title: '山谷鸟鸣晨曲',
    artist: 'Freesound',
    duration: '6:30',
    url: 'https://cdn.freesound.org/previews/456/456910_9497060-lq.mp3',
    coverUrl: 'https://cdn.pixabay.com/photo/2014/01/18/16/27/forest-820289_200.jpg',
    category: '自然白噪音',
    tags: ['鸟鸣', '清晨', '森林', '活力']
  },
  {
    id: 'music-05',
    title: '溪流潺潺水声',
    artist: 'Freesound',
    duration: '4:56',
    url: 'https://cdn.freesound.org/previews/435/435744_5366985-lq.mp3',
    coverUrl: 'https://cdn.pixabay.com/photo/2013/10/14/16/22/snow-covered-mountain-195411_200.jpg',
    category: '自然白噪音',
    tags: ['溪流', '水声', '山谷', '宁静']
  },
  {
    id: 'music-06',
    title: '风穿过松林',
    artist: 'Freesound',
    duration: '3:28',
    url: 'https://cdn.freesound.org/previews/472/472186_9497060-lq.mp3',
    coverUrl: 'https://cdn.pixabay.com/photo/2017/08/30/01/05/milky-way-2695569_200.jpg',
    category: '自然白噪音',
    tags: ['风声', '松林', '呼吸', '沉思']
  }
];

export default function MediaCrawler({
  currentTheme,
  style,
  onSetBackground,
  onPlayMusic
}: MediaCrawlerProps) {
  const [activeTab, setActiveTab] = useState<'backgrounds' | 'music'>('backgrounds');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [appliedBgId, setAppliedBgId] = useState<string | null>(null);
  const [downloadedMusicIds, setDownloadedMusicIds] = useState<Set<string>>(new Set());

  // 过滤背景图片
  const filteredBackgrounds = useMemo(() => {
    if (!searchQuery.trim()) return CRAWLED_BACKGROUNDS;
    const q = searchQuery.toLowerCase();
    return CRAWLED_BACKGROUNDS.filter(bg =>
      bg.description.toLowerCase().includes(q) ||
      bg.location.toLowerCase().includes(q) ||
      bg.photographer.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // 过滤音乐
  const filteredMusic = useMemo(() => {
    if (!searchQuery.trim()) return CRAWLED_MUSIC;
    const q = searchQuery.toLowerCase();
    return CRAWLED_MUSIC.filter(track =>
      track.title.toLowerCase().includes(q) ||
      track.artist.toLowerCase().includes(q) ||
      track.tags.some(tag => tag.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  // 应用背景
  const handleApplyBackground = (bg: CrawledBackground) => {
    setAppliedBgId(bg.id);
    if (onSetBackground) {
      onSetBackground(bg);
    }
    // 保存到 localStorage
    localStorage.setItem('vistablog_custom_bg', JSON.stringify(bg));
  };

  // 播放/暂停音乐
  const handlePlayMusic = (track: MusicTrack) => {
    if (isPlaying === track.id) {
      setIsPlaying(null);
    } else {
      setIsPlaying(track.id);
      if (onPlayMusic) {
        onPlayMusic(track);
      }
    }
  };

  // 下载音乐
  const handleDownloadMusic = (track: MusicTrack) => {
    const link = document.createElement('a');
    link.href = track.url;
    link.download = `${track.title}.wav`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadedMusicIds(prev => new Set(prev).add(track.id));
  };

  return (
    <section className="glass-panel rounded-3xl overflow-hidden border border-white/10">
      {/* 标题栏 */}
      <div className="p-5 border-b border-white/5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Globe size={18} className={style.accentText} />
            <h3 className="text-lg font-bold text-white font-['Noto_Serif_SC']">
              媒体资源爬取中心
            </h3>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-mono">
              MEDIA CRAWLER v1.0
            </span>
          </div>
        </div>

        {/* 标签页切换 */}
        <div className="flex gap-2">
          <button
            onClick={() => { setActiveTab('backgrounds'); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
              activeTab === 'backgrounds'
                ? 'bg-white/10 text-white'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Wallpaper size={16} />
            背景图爬取
          </button>
          <button
            onClick={() => { setActiveTab('music'); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
              activeTab === 'music'
                ? 'bg-white/10 text-white'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Music size={16} />
            背景音乐爬取
          </button>
        </div>
      </div>

      {/* 搜索框 */}
      <div className="p-4 border-b border-white/5">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={activeTab === 'backgrounds' ? '搜索风景、地点、摄影师...' : '搜索音乐、标签、氛围...'}
            className="w-full pl-9 pr-4 py-2.5 bg-black/20 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-white/20"
          />
        </div>
      </div>

      {/* 内容区域 */}
      <div className="p-4 max-h-[500px] overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'backgrounds' ? (
            <motion.div
              key="backgrounds"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-3"
            >
              {filteredBackgrounds.map((bg) => (
                <div
                  key={bg.id}
                  className="group relative rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition"
                >
                  <div className="aspect-video relative">
                    <img
                      src={bg.url}
                      alt={bg.description}
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* 悬停信息 */}
                    <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform">
                      <p className="text-[10px] text-white font-medium truncate">{bg.description}</p>
                      <p className="text-[9px] text-slate-300">{bg.location}</p>
                    </div>

                    {/* 应用按钮 */}
                    <button
                      onClick={() => handleApplyBackground(bg)}
                      className={`absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition ${
                        appliedBgId === bg.id
                          ? 'bg-emerald-500 text-white'
                          : 'bg-black/60 text-white hover:bg-white/20'
                      }`}
                    >
                      {appliedBgId === bg.id ? <Check size={14} /> : <Download size={14} />}
                    </button>
                  </div>

                  {/* 底部信息 */}
                  <div className="p-2 bg-slate-900/50">
                    <p className="text-[10px] text-slate-300 truncate">{bg.photographer}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="music"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-2"
            >
              {filteredMusic.map((track) => (
                <div
                  key={track.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 transition"
                >
                  {/* 封面图 */}
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <button
                      onClick={() => handlePlayMusic(track)}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition"
                    >
                      {isPlaying === track.id ? (
                        <Pause size={16} className="text-white" />
                      ) : (
                        <Play size={16} className="text-white" />
                      )}
                    </button>
                  </div>

                  {/* 信息 */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{track.title}</p>
                    <p className="text-[11px] text-slate-400">{track.artist}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {track.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 时长 */}
                  <div className="text-[11px] text-slate-500 font-mono shrink-0">
                    <Clock size={10} className="inline mr-1" />
                    {track.duration}
                  </div>

                  {/* 播放按钮 */}
                  <button
                    onClick={() => handlePlayMusic(track)}
                    className={`p-2 rounded-lg transition ${
                      isPlaying === track.id
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {isPlaying === track.id ? <Pause size={16} /> : <Play size={16} />}
                  </button>

                  {/* 下载按钮 */}
                  <button
                    onClick={() => handleDownloadMusic(track)}
                    className={`p-2 rounded-lg transition ${
                      downloadedMusicIds.has(track.id)
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                    title="下载音乐"
                  >
                    {downloadedMusicIds.has(track.id) ? <Check size={16} /> : <Download size={16} />}
                  </button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 空状态 */}
        {((activeTab === 'backgrounds' && filteredBackgrounds.length === 0) ||
          (activeTab === 'music' && filteredMusic.length === 0)) && (
          <div className="text-center py-12 text-slate-500">
            <Search size={32} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm">未找到匹配的资源</p>
            <p className="text-[11px] mt-1">换个关键词试试</p>
          </div>
        )}
      </div>

      {/* 底部提示 */}
      <div className="p-4 border-t border-white/5 bg-black/20">
        <p className="text-[10px] text-slate-500 text-center">
          💡 背景图片来自 Pixabay (免费商用)，音乐来自 Freesound (CC协议)。点击按钮可直接应用背景或下载音乐。
        </p>
      </div>
    </section>
  );
}
