import { getManifestUrl, resolveMediaUrl } from '../config/media';
import {
  FALLBACK_CRAWLED_BACKGROUNDS,
  FALLBACK_MANIFEST_VERSION,
  FALLBACK_MUSIC,
  FALLBACK_THEME_VIDEOS,
  FALLBACK_THEMES,
} from '../data/mediaFallback';
import {
  BackgroundTheme,
  CrawledBackground,
  MediaManifest,
  MusicTrack,
  ThemeVideoConfig,
} from '../types';

const LS_MANIFEST_KEY = 'vistablog_media_manifest';
const LS_VERSION_KEY = 'vistablog_media_manifest_version';

function normalizeTheme(theme: BackgroundTheme): BackgroundTheme {
  return { ...theme, url: resolveMediaUrl(theme.url) };
}

function normalizeBackground(bg: CrawledBackground): CrawledBackground {
  return { ...bg, url: resolveMediaUrl(bg.url) };
}

function normalizeMusic(track: MusicTrack): MusicTrack {
  return {
    ...track,
    url: resolveMediaUrl(track.url),
    coverUrl: resolveMediaUrl(track.coverUrl),
  };
}

function normalizeVideos(
  videos: Record<string, ThemeVideoConfig>,
): Record<string, ThemeVideoConfig> {
  return Object.fromEntries(
    Object.entries(videos).map(([id, cfg]) => [
      id,
      {
        videoUrl: resolveMediaUrl(cfg.videoUrl),
        posterUrl: resolveMediaUrl(cfg.posterUrl),
      },
    ]),
  );
}

function normalizeManifest(raw: MediaManifest): MediaManifest {
  return {
    ...raw,
    themes: raw.themes.map(normalizeTheme),
    crawledBackgrounds: raw.crawledBackgrounds.map(normalizeBackground),
    music: raw.music.map(normalizeMusic),
    themeVideos: normalizeVideos(raw.themeVideos),
  };
}

function buildFallbackManifest(): MediaManifest {
  return normalizeManifest({
    version: FALLBACK_MANIFEST_VERSION,
    updatedAt: new Date().toISOString(),
    themes: FALLBACK_THEMES,
    crawledBackgrounds: FALLBACK_CRAWLED_BACKGROUNDS,
    music: FALLBACK_MUSIC,
    themeVideos: FALLBACK_THEME_VIDEOS,
  });
}

function readCachedManifest(): MediaManifest | null {
  try {
    const raw = localStorage.getItem(LS_MANIFEST_KEY);
    if (!raw) return null;
    return normalizeManifest(JSON.parse(raw) as MediaManifest);
  } catch {
    return null;
  }
}

function cacheManifest(manifest: MediaManifest) {
  localStorage.setItem(LS_MANIFEST_KEY, JSON.stringify(manifest));
  localStorage.setItem(LS_VERSION_KEY, manifest.version);
}

export async function loadMediaManifest(): Promise<{
  manifest: MediaManifest;
  source: 'network' | 'cache' | 'fallback';
}> {
  const fallback = buildFallbackManifest();

  try {
    const response = await fetch(getManifestUrl(), { cache: 'no-cache' });
    if (!response.ok) throw new Error(`manifest ${response.status}`);

    const raw = (await response.json()) as MediaManifest;
    if (!raw.themes?.length) throw new Error('manifest themes empty');

    const manifest = normalizeManifest(raw);
    cacheManifest(manifest);
    return { manifest, source: 'network' };
  } catch (error) {
    console.warn('[VistaBlog] manifest 加载失败，尝试缓存或内置数据:', error);
    const cached = readCachedManifest();
    if (cached) return { manifest: cached, source: 'cache' };
    return { manifest: fallback, source: 'fallback' };
  }
}
