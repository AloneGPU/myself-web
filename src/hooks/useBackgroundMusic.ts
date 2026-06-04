import { useCallback, useEffect, useRef, useState } from 'react';
import { MusicTrack } from '../types';

export function useBackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setPlayingId(null);
  }, []);

  const toggle = useCallback(
    (track: MusicTrack) => {
      if (playingId === track.id) {
        stop();
        return;
      }

      let audio = audioRef.current;
      if (!audio) {
        audio = new Audio();
        audio.loop = true;
        audio.volume = 0.35;
        audioRef.current = audio;
        audio.addEventListener('ended', () => setPlayingId(null));
      }

      audio.pause();
      audio.src = track.url;
      audio
        .play()
        .then(() => setPlayingId(track.id))
        .catch((err) => {
          console.warn('[VistaBlog] 音乐播放失败:', err);
          setPlayingId(null);
        });
    },
    [playingId, stop],
  );

  useEffect(() => () => stop(), [stop]);

  return { playingId, toggle, stop, isPlaying: (id: string) => playingId === id };
}
