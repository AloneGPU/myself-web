
import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  X,
  Maximize,
  Music,
  Video,
  SkipBack,
  SkipForward,
  Image
} from 'lucide-react';
import { MusicTrack, VideoTrack, CrawledBackground } from '../types';

interface MediaPlayerProps {
  track?: MusicTrack | null;
  video?: VideoTrack | null;
  background?: CrawledBackground | null;
  onClose: () =&gt; void;
}

export default function MediaPlayer({
  track,
  video,
  background,
  onClose
}: MediaPlayerProps) {
  const audioRef = useRef&lt;HTMLAudioElement&gt;(null);
  const videoRef = useRef&lt;HTMLVideoElement&gt;(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // 重置状态当媒体变化
  useEffect(() =&gt; {
    setIsPlaying(false);
    setCurrentTime(0);
  }, [track, video, background]);

  // 播放/暂停
  const togglePlay = () =&gt; {
    if (track &amp;&amp; audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
    if (video &amp;&amp; videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // 音量控制
  const toggleMute = () =&gt; {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent&lt;HTMLInputElement&gt;) =&gt; {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    if (newVolume &gt; 0) {
      setIsMuted(false);
    }
  };

  // 进度条
  const handleTimeUpdate = () =&gt; {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () =&gt; {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent&lt;HTMLInputElement&gt;) =&gt; {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  // 格式化时间
  const formatTime = (time: number) =&gt; {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const isAudio = !!track;
  const isVideo = !!video;
  const isImage = !!background;

  const currentTitle = track?.title || video?.title || background?.description || '';
  const currentArtist = track?.artist || background?.photographer || '';
  const currentCover = track?.coverUrl || video?.thumbnail || background?.url || '';

  return (
    &lt;div className="fixed inset-0 bg-black/90 z-50 flex flex-col"&gt;
      {/* 关闭按钮 */}
      &lt;button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition"
      &gt;
        &lt;X size={24} /&gt;
      &lt;/button&gt;

      {/* 媒体内容区域 */}
      &lt;div className="flex-1 flex items-center justify-center"&gt;
        {isAudio &amp;&amp; track &amp;&amp; (
          &lt;div className="text-center"&gt;
            &lt;div className="w-64 h-64 mx-auto mb-6 rounded-2xl overflow-hidden shadow-2xl"&gt;
              &lt;img
                src={track.coverUrl}
                alt={track.title}
                className="w-full h-full object-cover"
              /&gt;
            &lt;/div&gt;
            &lt;h2 className="text-2xl font-bold text-white mb-2"&gt;{track.title}&lt;/h2&gt;
            &lt;p className="text-slate-400"&gt;{track.artist}&lt;/p&gt;
            &lt;audio
              ref={audioRef}
              src={track.url}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() =&gt; setIsPlaying(false)}
            /&gt;
          &lt;/div&gt;
        )}

        {isVideo &amp;&amp; video &amp;&amp; (
          &lt;div className="w-full max-w-5xl mx-4"&gt;
            &lt;video
              ref={videoRef}
              src={video.url}
              className="w-full rounded-xl"
              poster={video.thumbnail}
              controls
              loop
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() =&gt; setIsPlaying(false)}
            /&gt;
          &lt;/div&gt;
        )}

        {isImage &amp;&amp; background &amp;&amp; (
          &lt;div className="w-full max-w-6xl mx-4"&gt;
            &lt;img
              src={background.url}
              alt={background.description}
              className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
            /&gt;
            &lt;div className="mt-4 text-center"&gt;
              &lt;h2 className="text-xl font-bold text-white"&gt;{background.description}&lt;/h2&gt;
              &lt;p className="text-slate-400 mt-1"&gt;
                📷 {background.photographer} • {background.location}
              &lt;/p&gt;
            &lt;/div&gt;
          &lt;/div&gt;
        )}
      &lt;/div&gt;

      {/* 控制栏 */}
      {!isImage &amp;&amp; (
        &lt;div className="bg-black/50 backdrop-blur-xl border-t border-white/10 p-4"&gt;
          &lt;div className="max-w-2xl mx-auto"&gt;
            {/* 进度条 */}
            &lt;div className="flex items-center gap-3 mb-4"&gt;
              &lt;span className="text-xs text-slate-400 font-mono w-12 text-right"&gt;
                {formatTime(currentTime)}
              &lt;/span&gt;
              &lt;input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="flex-1 h-1 bg-slate-700 rounded-full appearance-none cursor-pointer accent-white"
              /&gt;
              &lt;span className="text-xs text-slate-400 font-mono w-12"&gt;
                {formatTime(duration)}
              &lt;/span&gt;
            &lt;/div&gt;

            {/* 控制按钮 */}
            &lt;div className="flex items-center justify-between"&gt;
              &lt;div className="flex items-center gap-2"&gt;
                {isAudio ? (
                  &lt;Music size={20} className="text-slate-400" /&gt;
                ) : (
                  &lt;Video size={20} className="text-slate-400" /&gt;
                )}
                &lt;div className="text-sm text-white truncate max-w-[200px]"&gt;
                  {currentTitle}
                &lt;/div&gt;
              &lt;/div&gt;

              &lt;div className="flex items-center gap-4"&gt;
                &lt;button
                  className="p-2 text-slate-400 hover:text-white transition"
                  title="上一曲"
                &gt;
                  &lt;SkipBack size={20} /&gt;
                &lt;/button&gt;
                &lt;button
                  onClick={togglePlay}
                  className="p-3 bg-white rounded-full text-black hover:scale-105 transition"
                &gt;
                  {isPlaying ? &lt;Pause size={24} fill="currentColor" /&gt; : &lt;Play size={24} fill="currentColor" className="ml-0.5" /&gt;}
                &lt;/button&gt;
                &lt;button
                  className="p-2 text-slate-400 hover:text-white transition"
                  title="下一曲"
                &gt;
                  &lt;SkipForward size={20} /&gt;
                &lt;/button&gt;
              &lt;/div&gt;

              &lt;div className="flex items-center gap-2"&gt;
                &lt;button
                  onClick={toggleMute}
                  className="p-2 text-slate-400 hover:text-white transition"
                &gt;
                  {isMuted || volume === 0 ? &lt;VolumeX size={20} /&gt; : &lt;Volume2 size={20} /&gt;}
                &lt;/button&gt;
                &lt;input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-slate-700 rounded-full appearance-none cursor-pointer accent-white"
                /&gt;
              &lt;/div&gt;
            &lt;/div&gt;
          &lt;/div&gt;
        &lt;/div&gt;
      )}
    &lt;/div&gt;
  );
}
