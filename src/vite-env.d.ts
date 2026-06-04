/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ASSET_CDN?: string;
  readonly VITE_AUDIO_CDN?: string;
  readonly VITE_MEDIA_MANIFEST_URL?: string;
  readonly VITE_IMAGE_PROXY?: string;
  readonly VITE_CRAWLER_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
