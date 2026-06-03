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
  // Resource Sharing Support
  resourceLink?: string;
  resourcePassword?: string;
  resourceSize?: string;
  resourceName?: string;
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
