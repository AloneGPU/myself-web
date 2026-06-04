export interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  date: string;
  replyToCommentId?: string;
  replyToAuthor?: string;
  image?: string;
}

/** 分享资源类型：网盘链接 / 网页 / 纯文本笔记 */
export type ResourceKind = 'none' | 'cloud' | 'web' | 'text';

export interface ExtraLink {
  id: string;
  label: string;
  url: string;
}

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string; // supports simple markdown/text paragraphs
  category: string;
  coverImage: string;
  publishDate: string;
  readTime: string;
  likes: number;
  views: number;
  comments: Comment[];
  pinned?: boolean;
  /** 资源分享 */
  resourceKind?: ResourceKind;
  resourceLink?: string;
  resourcePassword?: string;
  resourceSize?: string;
  resourceName?: string;
  /** 纯文本资料：笔记、提纲、代码片段等 */
  resourceText?: string;
  /** 附加链接（教程、文档、Repo 等） */
  extraLinks?: ExtraLink[];
}

export interface Moment {
  id: string;
  content: string;
  image?: string;
  publishDate: string;
  location?: string;
  likes: number;
  mood?: string;
}

export interface BackgroundTheme {
  id: string;
  name: string;
  url: string;
  description: string;
  blur?: boolean;
  photographer: string;
  photographerUrl: string;
  accentColor: string; // Tailwind color name like 'emerald', 'sky', 'amber', etc.
}

export interface PhotoSnap {
  id: string;
  themeId: string;
  themeName: string;
  photoUrl: string;
  aperture: string;
  focalLength: string;
  iso: number;
  ev: string;
  filmSimulation: string;
  timestamp: string;
  location: string;
}

export type ActiveTab = 'posts' | 'moments' | 'about' | 'sandbox';

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: string;
  url: string;
  coverUrl: string;
  category: string;
  tags: string[];
}

export interface CrawledBackground {
  id: string;
  url: string;
  photographer: string;
  photographerUrl: string;
  description: string;
  location: string;
}

export interface ThemeVideoConfig {
  videoUrl: string;
  posterUrl: string;
}

/** 由 manifest.json 或本地 public 提供，上线后改为阿里云 CDN 地址即可 */
export interface MediaManifest {
  version: string;
  updatedAt: string;
  themes: BackgroundTheme[];
  crawledBackgrounds: CrawledBackground[];
  music: MusicTrack[];
  themeVideos: Record<string, ThemeVideoConfig>;
}
