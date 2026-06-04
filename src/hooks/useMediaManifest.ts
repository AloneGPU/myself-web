import { useCallback, useEffect, useState } from 'react';
import { loadMediaManifest } from '../services/mediaManifest';
import { BackgroundTheme, CrawledBackground, MediaManifest, MusicTrack, ThemeVideoConfig } from '../types';

export function useMediaManifest() {
  const [manifest, setManifest] = useState<MediaManifest | null>(null);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<'network' | 'cache' | 'fallback' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await loadMediaManifest();
      setManifest(result.manifest);
      setSource(result.source);
    } catch (e) {
      setError(e instanceof Error ? e.message : '加载失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    manifest,
    loading,
    source,
    error,
    refresh,
    themes: manifest?.themes ?? [],
    crawledBackgrounds: manifest?.crawledBackgrounds ?? [],
    music: manifest?.music ?? [],
    themeVideos: manifest?.themeVideos ?? ({} as Record<string, ThemeVideoConfig>),
  };
}

export function findThemeById(themes: BackgroundTheme[], id: string | null): BackgroundTheme | undefined {
  if (!id) return undefined;
  return themes.find((t) => t.id === id);
}

export type { CrawledBackground, MusicTrack };
