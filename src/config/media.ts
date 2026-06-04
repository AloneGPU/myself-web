/** 资源 CDN 根路径。本地默认 `/vistablog`，上线后设为 `https://cdn.你的域名.com/vistablog` */
export function getAssetBase(): string {
  const raw = import.meta.env.VITE_ASSET_CDN?.trim();
  if (raw) return raw.replace(/\/$/, '');
  return '/vistablog';
}

export function getAudioBase(): string {
  const raw = import.meta.env.VITE_AUDIO_CDN?.trim();
  if (raw) return raw.replace(/\/$/, '');
  return `${getAssetBase()}/audio`;
}

/** manifest 完整 URL；未设置时走本地 public 目录 */
export function getManifestUrl(): string {
  const explicit = import.meta.env.VITE_MEDIA_MANIFEST_URL?.trim();
  if (explicit) return explicit;
  return `${getAssetBase()}/manifest.json`;
}

/** 将 manifest 中的相对路径解析为可访问 URL */
export function resolveMediaUrl(path: string): string {
  if (!path) return path;
  if (/^https?:\/\//i.test(path)) return path;
  const base = getAssetBase();
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (normalized.startsWith('/vistablog')) {
    return import.meta.env.VITE_ASSET_CDN?.trim()
      ? `${base}${normalized.replace(/^\/vistablog/, '')}`
      : normalized;
  }
  return `${base}${normalized.startsWith('/') ? normalized : `/${normalized}`}`;
}
