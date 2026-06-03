
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Music,
  Image as ImageIcon,
  Video,
  Download,
  Search,
  Play,
  Pause,
  Check,
  RefreshCw,
  Globe,
  Headphones,
  Wallpaper,
  Clock,
  Tag,
  X,
  Loader2,
  Zap,
  Heart
} from 'lucide-react';
import { BackgroundTheme, MusicTrack, CrawledBackground, VideoTrack } from '../types';
import { imagesAPI, musicAPI, videosAPI } from '../lib/api';

interface MediaCrawlerProps {
  currentTheme: BackgroundTheme;
  style: {
    accentText: string;
    accentBtn: string;
    badgeClass: string;
  };
  onSetBackground?: (bg: CrawledBackground) =&gt; void;
  onPlayMusic?: (track: MusicTrack) =&gt; void;
  onSetVideoBackground?: (video: VideoTrack) =&gt; void;
}

export default function MediaCrawler({
  currentTheme,
  style,
  onSetBackground,
  onPlayMusic,
  onSetVideoBackground,
}: MediaCrawlerProps) {
  const [activeTab, setActiveTab] = useState&lt;'images' | 'music' | 'videos'&gt;('images');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState&lt;string | null&gt;(null);

  // 数据状态
  const [images, setImages] = useState&lt;CrawledBackground[]&gt;([]);
  const [musicTracks, setMusicTracks] = useState&lt;MusicTrack[]&gt;([]);
  const [videos, setVideos] = useState&lt;VideoTrack[]&gt;([]);

  // UI状态
  const [isPlaying, setIsPlaying] = useState&lt;string | null&gt;(null);
  const [appliedBgId, setAppliedBgId] = useState&lt;string | null&gt;(null);
  const [appliedVideoId, setAppliedVideoId] = useState&lt;string | null&gt;(null);
  const [downloadedIds, setDownloadedIds] = useState&lt;Set&lt;string&gt;&gt;(new Set());
  const [favorites, setFavorites] = useState&lt;Set&lt;string&gt;&gt;(() =&gt; {
    const saved = localStorage.getItem('vistablog_favorites');
    return new Set(saved ? JSON.parse(saved) : []);
  });

  // 从 API 获取数据
  const fetchData = useCallback(async (tab: typeof activeTab, query = '') =&gt; {
    setIsLoading(true);
    setError(null);
    try {
      let response;
      const searchTerm = query || (tab === 'music' ? 'nature' : 'landscape');

      if (tab === 'images') {
        response = await imagesAPI.search(searchTerm);
        if (response.success) {
          setImages(response.data);
        }
      } else if (tab === 'music') {
        response = await musicAPI.search(searchTerm);
        if (response.success) {
          setMusicTracks(response.data);
        }
      } else if (tab === 'videos') {
        response = await videosAPI.search(searchTerm);
        if (response.success) {
          setVideos(response.data);
        }
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('加载数据失败，请检查网络连接');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 切换标签时加载数据
  useEffect(() =&gt; {
    fetchData(activeTab, searchQuery);
  }, [activeTab, fetchData]);

  // 处理搜索
  const handleSearch = (e: React.FormEvent) =&gt; {
    e.preventDefault();
    fetchData(activeTab, searchQuery);
  };

  // 切换收藏
  const toggleFavorite = (id: string) =&gt; {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
    localStorage.setItem('vistablog_favorites', JSON.stringify([...newFavorites]));
  };

  // 应用背景图片
  const handleApplyBackground = (bg: CrawledBackground) =&gt; {
    setAppliedBgId(bg.id);
    if (onSetBackground) {
      onSetBackground(bg);
    }
    // 保存到 localStorage
    localStorage.setItem('vistablog_custom_bg', JSON.stringify(bg));
  };

  // 应用视频背景
  const handleApplyVideoBackground = (video: VideoTrack) =&gt; {
    setAppliedVideoId(video.id);
    if (onSetVideoBackground) {
      onSetVideoBackground(video);
    }
    localStorage.setItem('vistablog_custom_video_bg', JSON.stringify(video));
  };

  // 播放/暂停音乐
  const handlePlayMusic = (track: MusicTrack) =&gt; {
    if (isPlaying === track.id) {
      setIsPlaying(null);
    } else {
      setIsPlaying(track.id);
      if (onPlayMusic) {
        onPlayMusic(track);
      }
    }
  };

  // 下载资源
  const handleDownload = (item: any, type: string) =&gt; {
    const url = item.url;
    const fileName = `${item.title || item.description || 'download'}.${type === 'music' ? 'mp3' : 'jpg'}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadedIds(prev =&gt; new Set(prev).add(item.id));
  };

  return (
    &lt;section className="glass-panel rounded-3xl overflow-hidden border border-white/10"&gt;
      {/* 标题栏 */}
      &lt;div className="p-5 border-b border-white/5"&gt;
        &lt;div className="flex items-center justify-between mb-4"&gt;
          &lt;div className="flex items-center gap-2"&gt;
            &lt;Globe size={18} className={style.accentText} /&gt;
            &lt;h3 className="text-lg font-bold text-white font-['Noto_Serif_SC']"&gt;
              媒体资源中心
            &lt;/h3&gt;
            &lt;span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-mono"&gt;
              &lt;Zap size={10} className="inline mr-1" /&gt;
              API Powered
            &lt;/span&gt;
          &lt;/div&gt;
        &lt;/div&gt;

        {/* 标签页切换 */}
        &lt;div className="flex gap-2"&gt;
          &lt;button
            onClick={() =&gt; setActiveTab('images')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
              activeTab === 'images'
                ? 'bg-white/10 text-white'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          &gt;
            &lt;Wallpaper size={16} /&gt;
            风景图片
          &lt;/button&gt;
          &lt;button
            onClick={() =&gt; setActiveTab('videos')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
              activeTab === 'videos'
                ? 'bg-white/10 text-white'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          &gt;
            &lt;Video size={16} /&gt;
            动态视频
          &lt;/button&gt;
          &lt;button
            onClick={() =&gt; setActiveTab('music')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
              activeTab === 'music'
                ? 'bg-white/10 text-white'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          &gt;
            &lt;Music size={16} /&gt;
            背景音乐
          &lt;/button&gt;
        &lt;/div&gt;
      &lt;/div&gt;

      {/* 搜索框 */}
      &lt;div className="p-4 border-b border-white/5"&gt;
        &lt;form onSubmit={handleSearch} className="relative"&gt;
          &lt;Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" /&gt;
          &lt;input
            type="text"
            value={searchQuery}
            onChange={(e) =&gt; setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'images'
                ? '搜索风景图片：山、海、星空、森林...'
                : activeTab === 'music'
                ? '搜索音乐：雨声、海浪、鸟鸣、白噪音...'
                : '搜索视频：溪流、海浪、延时摄影...'
            }
            className="w-full pl-9 pr-12 py-2.5 bg-black/20 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-white/20"
          /&gt;
          {isLoading ? (
            &lt;Loader2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 animate-spin" /&gt;
          ) : (
            &lt;button
              type="button"
              onClick={() =&gt; fetchData(activeTab, searchQuery)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
            &gt;
              &lt;RefreshCw size={16} /&gt;
            &lt;/button&gt;
          )}
        &lt;/form&gt;
      &lt;/div&gt;

      {/* 错误提示 */}
      {error &amp;&amp; (
        &lt;div className="mx-4 mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-300 flex items-center justify-between"&gt;
          &lt;span&gt;{error}&lt;/span&gt;
          &lt;button onClick={() =&gt; setError(null)} className="text-red-400 hover:text-red-300"&gt;
            &lt;X size={14} /&gt;
          &lt;/button&gt;
        &lt;/div&gt;
      )}

      {/* 内容区域 */}
      &lt;div className="p-4 max-h-[600px] overflow-y-auto"&gt;
        &lt;AnimatePresence mode="wait"&gt;
          {activeTab === 'images' &amp;&amp; (
            &lt;motion.div
              key="images"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-3"
            &gt;
              {images.map((img) =&gt; (
                &lt;div
                  key={img.id}
                  className="group relative rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition"
                &gt;
                  &lt;div className="aspect-video relative"&gt;
                    &lt;img
                      src={img.thumbnail || img.url}
                      alt={img.description}
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    /&gt;
                    &lt;div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" /&gt;

                    {/* 悬停操作按钮 */}
                    &lt;div className="absolute top-2 right-2 flex gap-1"&gt;
                      &lt;button
                        onClick={() =&gt; toggleFavorite(img.id)}
                        className={`p-1.5 rounded-lg transition ${
                          favorites.has(img.id)
                            ? 'bg-red-500/80 text-white'
                            : 'bg-black/60 text-white hover:bg-black/80'
                        }`}
                      &gt;
                        &lt;Heart size={14} fill={favorites.has(img.id) ? 'currentColor' : 'none'} /&gt;
                      &lt;/button&gt;
                    &lt;/div&gt;

                    &lt;div className="absolute bottom-0 left-0 right-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform"&gt;
                      &lt;p className="text-[10px] text-white font-medium truncate"&gt;{img.description}&lt;/p&gt;
                      &lt;p className="text-[9px] text-slate-300"&gt;{img.location}&lt;/p&gt;
                      &lt;div className="flex gap-2 mt-2"&gt;
                        &lt;button
                          onClick={() =&gt; handleApplyBackground(img)}
                          className={`flex-1 py-1 px-2 rounded text-[9px] font-semibold transition ${
                            appliedBgId === img.id
                              ? 'bg-emerald-500 text-white'
                              : 'bg-white/20 text-white hover:bg-white/30'
                          }`}
                        &gt;
                          {appliedBgId === img.id ? &lt;Check size={10} className="inline" /&gt; : '设为背景'}
                        &lt;/button&gt;
                        &lt;button
                          onClick={() =&gt; handleDownload(img, 'image')}
                          className="py-1 px-2 rounded text-[9px] font-semibold bg-white/20 text-white hover:bg-white/30 transition"
                        &gt;
                          &lt;Download size={10} /&gt;
                        &lt;/button&gt;
                      &lt;/div&gt;
                    &lt;/div&gt;
                  &lt;/div&gt;

                  {/* 底部信息 */}
                  &lt;div className="p-2 bg-slate-900/50"&gt;
                    &lt;p className="text-[10px] text-slate-300 truncate"&gt;📷 {img.photographer}&lt;/p&gt;
                  &lt;/div&gt;
                &lt;/div&gt;
              ))}
            &lt;/motion.div&gt;
          )}

          {activeTab === 'videos' &amp;&amp; (
            &lt;motion.div
              key="videos"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            &gt;
              {videos.map((video) =&gt; (
                &lt;div
                  key={video.id}
                  className="flex gap-3 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 transition"
                &gt;
                  {/* 缩略图 */}
                  &lt;div className="relative w-32 h-20 rounded-lg overflow-hidden shrink-0"&gt;
                    &lt;img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    /&gt;
                    &lt;div className="absolute inset-0 bg-black/30 flex items-center justify-center"&gt;
                      &lt;Play size={20} className="text-white" /&gt;
                    &lt;/div&gt;
                  &lt;/div&gt;

                  {/* 信息 */}
                  &lt;div className="flex-1 min-w-0 flex flex-col justify-between"&gt;
                    &lt;div&gt;
                      &lt;p className="text-sm font-medium text-white truncate"&gt;{video.title}&lt;/p&gt;
                      &lt;p className="text-[11px] text-slate-400 mt-1 line-clamp-2"&gt;{video.description}&lt;/p&gt;
                    &lt;/div&gt;
                    &lt;div className="flex items-center gap-2 mt-2"&gt;
                      &lt;span className="text-[10px] text-slate-500 flex items-center gap-1"&gt;
                        &lt;Clock size={10} /&gt;
                        {video.duration}
                      &lt;/span&gt;
                    &lt;/div&gt;
                  &lt;/div&gt;

                  {/* 操作按钮 */}
                  &lt;div className="flex flex-col gap-2"&gt;
                    &lt;button
                      onClick={() =&gt; handleApplyVideoBackground(video)}
                      className={`p-2 rounded-lg transition ${
                        appliedVideoId === video.id
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'text-slate-400 hover:text-white hover:bg-white/10'
                      }`}
                    &gt;
                      {appliedVideoId === video.id ? &lt;Check size={16} /&gt; : &lt;Wallpaper size={16} /&gt;}
                    &lt;/button&gt;
                    &lt;button
                      onClick={() =&gt; handleDownload(video, 'video')}
                      className={`p-2 rounded-lg transition ${
                        downloadedIds.has(video.id)
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'text-slate-400 hover:text-white hover:bg-white/10'
                      }`}
                      title="下载"
                    &gt;
                      {downloadedIds.has(video.id) ? &lt;Check size={16} /&gt; : &lt;Download size={16} /&gt;}
                    &lt;/button&gt;
                    &lt;button
                      onClick={() =&gt; toggleFavorite(video.id)}
                      className={`p-2 rounded-lg transition ${
                        favorites.has(video.id)
                          ? 'bg-red-500/20 text-red-400'
                          : 'text-slate-400 hover:text-white hover:bg-white/10'
                      }`}
                    &gt;
                      &lt;Heart size={16} fill={favorites.has(video.id) ? 'currentColor' : 'none'} /&gt;
                    &lt;/button&gt;
                  &lt;/div&gt;
                &lt;/div&gt;
              ))}
            &lt;/motion.div&gt;
          )}

          {activeTab === 'music' &amp;&amp; (
            &lt;motion.div
              key="music"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-2"
            &gt;
              {musicTracks.map((track) =&gt; (
                &lt;div
                  key={track.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 transition"
                &gt;
                  {/* 封面图 */}
                  &lt;div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0"&gt;
                    &lt;img
                      src={track.coverUrl}
                      alt={track.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    /&gt;
                    &lt;button
                      onClick={() =&gt; handlePlayMusic(track)}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition"
                    &gt;
                      {isPlaying === track.id ? (
                        &lt;Pause size={16} className="text-white" /&gt;
                      ) : (
                        &lt;Play size={16} className="text-white" /&gt;
                      )}
                    &lt;/button&gt;
                  &lt;/div&gt;

                  {/* 信息 */}
                  &lt;div className="flex-1 min-w-0"&gt;
                    &lt;p className="text-sm font-medium text-white truncate"&gt;{track.title}&lt;/p&gt;
                    &lt;p className="text-[11px] text-slate-400"&gt;{track.artist}&lt;/p&gt;
                    &lt;div className="flex items-center gap-1 mt-1"&gt;
                      {track.tags.slice(0, 2).map((tag) =&gt; (
                        &lt;span
                          key={tag}
                          className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400 flex items-center gap-1"
                        &gt;
                          &lt;Tag size={8} /&gt;
                          {tag}
                        &lt;/span&gt;
                      ))}
                    &lt;/div&gt;
                  &lt;/div&gt;

                  {/* 时长 */}
                  &lt;div className="text-[11px] text-slate-500 font-mono shrink-0"&gt;
                    &lt;Clock size={10} className="inline mr-1" /&gt;
                    {track.duration}
                  &lt;/div&gt;

                  {/* 操作按钮 */}
                  &lt;div className="flex gap-1"&gt;
                    &lt;button
                      onClick={() =&gt; toggleFavorite(track.id)}
                      className={`p-2 rounded-lg transition ${
                        favorites.has(track.id)
                          ? 'bg-red-500/20 text-red-400'
                          : 'text-slate-400 hover:text-white hover:bg-white/10'
                      }`}
                    &gt;
                      &lt;Heart size={16} fill={favorites.has(track.id) ? 'currentColor' : 'none'} /&gt;
                    &lt;/button&gt;
                    &lt;button
                      onClick={() =&gt; handleDownload(track, 'music')}
                      className={`p-2 rounded-lg transition ${
                        downloadedIds.has(track.id)
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'text-slate-400 hover:text-white hover:bg-white/10'
                      }`}
                      title="下载"
                    &gt;
                      {downloadedIds.has(track.id) ? &lt;Check size={16} /&gt; : &lt;Download size={16} /&gt;}
                    &lt;/button&gt;
                  &lt;/div&gt;
                &lt;/div&gt;
              ))}
            &lt;/motion.div&gt;
          )}
        &lt;/AnimatePresence&gt;

        {/* 空状态 */}
        {!isLoading &amp;&amp; ((activeTab === 'images' &amp;&amp; images.length === 0) ||
          (activeTab === 'music' &amp;&amp; musicTracks.length === 0) ||
          (activeTab === 'videos' &amp;&amp; videos.length === 0)) &amp;&amp; (
            &lt;div className="text-center py-12 text-slate-500"&gt;
              &lt;Search size={32} className="mx-auto mb-3 opacity-50" /&gt;
              &lt;p className="text-sm"&gt;未找到匹配的资源&lt;/p&gt;
              &lt;p className="text-[11px] mt-1"&gt;换个关键词试试&lt;/p&gt;
            &lt;/div&gt;
          )}
      &lt;/div&gt;

      {/* 底部提示 */}
      &lt;div className="p-4 border-t border-white/5 bg-black/20"&gt;
        &lt;p className="text-[10px] text-slate-500 text-center"&gt;
          💡 资源来自 Unsplash、Pixabay 等免费平台，均可免费商用。点击「设为背景」或「下载」使用。
        &lt;/p&gt;
      &lt;/div&gt;
    &lt;/section&gt;
  );
}
