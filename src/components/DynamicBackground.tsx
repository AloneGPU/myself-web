import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BackgroundTheme, ThemeVideoConfig } from '../types';

interface DynamicBackgroundProps {
  currentTheme: BackgroundTheme;
  themeVideos?: Record<string, ThemeVideoConfig>;
  onMouseMove?: (e: React.MouseEvent) => void;
}

export default function DynamicBackground({
  currentTheme,
  themeVideos = {},
  onMouseMove
}: DynamicBackgroundProps) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 当主题切换时，重置视频状态
  useEffect(() => {
    setIsVideoLoaded(false);
    setIsVideoPlaying(false);
  }, [currentTheme.id]);

  // 视频加载完成
  const handleVideoLoaded = useCallback(() => {
    setIsVideoLoaded(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // 自动播放被阻止时的处理
        setIsVideoPlaying(false);
      });
    }
  }, []);

  // 视频开始播放
  const handleVideoPlay = useCallback(() => {
    setIsVideoPlaying(true);
  }, []);

  // 视频暂停
  const handleVideoPause = useCallback(() => {
    setIsVideoPlaying(false);
  }, []);

  // 视频播放结束时重新开始
  const handleVideoEnded = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  // 视频错误处理 - 回退到图片
  const handleVideoError = useCallback(() => {
    setIsVideoLoaded(false);
  }, []);

  const videoConfig = themeVideos[currentTheme.id];
  const videoUrl = videoConfig?.videoUrl;
  const posterUrl = videoConfig?.posterUrl ?? currentTheme.url;

  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden bg-slate-950"
      onMouseMove={onMouseMove}
    >
      {/* 静态图片背景（作为视频加载前的占位） */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`img-${currentTheme.id}`}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <img
            src={currentTheme.url}
            alt={currentTheme.name}
            className="w-full h-full object-cover filter brightness-[0.4] contrast-[1.05] saturate-[1.02]"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </AnimatePresence>

      {videoUrl && (
        <AnimatePresence mode="wait">
          <motion.div
            key={`vid-${currentTheme.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: isVideoLoaded ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            <video
              ref={videoRef}
              src={videoUrl}
              poster={posterUrl}
              muted
              loop
              playsInline
              onLoadedData={handleVideoLoaded}
              onPlay={handleVideoPlay}
              onPause={handleVideoPause}
              onEnded={handleVideoEnded}
              onError={handleVideoError}
              className="w-full h-full object-cover filter brightness-[0.4] contrast-[1.05] saturate-[1.02]"
            />
          </motion.div>
        </AnimatePresence>
      )}

      {/* 渐变遮罩 */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/10 via-transparent to-slate-950/70 pointer-events-none" />

      {/* 视频状态指示器（右上角） */}
      <div className="absolute top-8 right-8 z-50 pointer-events-none bg-status-indicator">
        <div className="glass-panel rounded-xl px-3 py-1.5 flex items-center gap-2">
          <span className="text-xs text-slate-300">
            {isVideoLoaded ? '🎬 视频背景' : '🖼️ 图片背景'}
          </span>
          {isVideoLoaded && (
            <div className={`w-2 h-2 rounded-full ${isVideoPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
          )}
        </div>
      </div>
    </div>
  );
}
