import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Camera,
  ChevronRight,
  Database,
  Download,
  FileText,
  Globe2,
  Image as ImageIcon,
  Music,
  Radio,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { BackgroundTheme, BlogPost, Moment } from '../types';

type HubMode = 'materials' | 'photos' | 'community';

interface ResourceDiscoveryHubProps {
  posts: BlogPost[];
  moments: Moment[];
  currentTheme: BackgroundTheme;
  style: {
    accentText: string;
    accentBtn: string;
    badgeClass: string;
  };
  onOpenPost: (post: BlogPost) => void;
  onOpenSandbox: () => void;
  onStartContribution: () => void;
}

const isPhotoResource = (post: BlogPost) => {
  const haystack = `${post.category} ${post.title} ${post.summary} ${post.resourceName || ''}`.toLowerCase();
  return (
    post.category === '图片分析' ||
    post.category === '旅行摄影' ||
    haystack.includes('风景') ||
    haystack.includes('照片') ||
    haystack.includes('图片') ||
    haystack.includes('壁纸') ||
    haystack.includes('scenery')
  );
};

const getResourceKind = (post: BlogPost) => {
  const name = (post.resourceName || post.title).toLowerCase();
  if (name.includes('.doc') || name.includes('word') || name.includes('文档')) return 'Word';
  if (name.includes('.ppt') || name.includes('powerpoint') || name.includes('幻灯')) return 'PPT';
  if (name.includes('.pdf')) return 'PDF';
  if (isPhotoResource(post)) return 'Photo';
  return 'Resource';
};

export default function ResourceDiscoveryHub({
  posts,
  moments,
  currentTheme,
  style,
  onOpenPost,
  onOpenSandbox,
  onStartContribution,
}: ResourceDiscoveryHubProps) {
  const [mode, setMode] = useState<HubMode>('materials');
  const [query, setQuery] = useState('');
  const [crawlerKeyword, setCrawlerKeyword] = useState('复习资料 风景图');
  const [isQueued, setIsQueued] = useState(false);

  const learningPosts = useMemo(
    () => posts.filter((post) => post.category === '学习资料' || Boolean(post.resourceLink)),
    [posts],
  );

  const photoPosts = useMemo(
    () => posts.filter((post) => isPhotoResource(post)),
    [posts],
  );

  const activePosts = mode === 'photos' ? photoPosts : learningPosts;
  const filteredPosts = activePosts
    .filter((post) => {
      const text = `${post.title} ${post.summary} ${post.category} ${post.resourceName || ''}`.toLowerCase();
      return text.includes(query.toLowerCase());
    })
    .slice(0, 4);

  const communitySignals = [
    { label: '同学评论', value: posts.reduce((sum, post) => sum + post.comments.length, 0), icon: Users },
    { label: '可下载资料', value: learningPosts.length, icon: FileText },
    { label: '照片线索', value: photoPosts.length, icon: Camera },
  ];

  const handleQueueCrawler = () => {
    setIsQueued(true);
    window.setTimeout(() => setIsQueued(false), 2200);
  };

  return (
    <section className="resource-hub glass-panel rounded-3xl overflow-hidden border border-white/10">
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
        <div className="p-5 sm:p-6 lg:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-slate-300">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/25 px-3 py-1 font-semibold">
                  <ShieldCheck size={13} className={style.accentText} />
                  国内部署友好
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/25 px-3 py-1 font-semibold">
                  <Database size={13} className={style.accentText} />
                  资料与照片优先
                </span>
              </div>
              <h2 className="max-w-[16ch] text-2xl font-black leading-tight text-white sm:text-3xl font-['Noto_Serif_SC']">
                学习资料与照片发现台
              </h2>
              <p className="mt-3 max-w-[68ch] text-sm leading-6 text-slate-200">
                先找资料和照片，再慢慢读文章。这里把考研文档、PPT、PDF、风景图集、背景音乐和采集入口集中到一个工作区，方便同学参与补充。
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-black/25 p-2 text-center">
              {communitySignals.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-xl bg-white/[0.04] px-3 py-2">
                    <Icon size={15} className={`mx-auto mb-1 ${style.accentText}`} />
                    <div className="font-mono text-lg font-black text-white">{item.value}</div>
                    <div className="text-[10px] text-slate-400">{item.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex rounded-2xl border border-white/10 bg-black/25 p-1">
              {[
                { id: 'materials' as const, label: '学习资料', icon: BookOpen },
                { id: 'photos' as const, label: '照片图集', icon: ImageIcon },
                { id: 'community' as const, label: '同学参与', icon: Users },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = mode === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setMode(item.id)}
                    className={`min-h-11 flex-1 rounded-xl px-3 text-xs font-bold transition md:flex-none md:px-4 ${
                      isActive ? 'bg-white text-slate-950' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="inline-flex items-center justify-center gap-1.5">
                      <Icon size={14} />
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {mode !== 'community' && (
              <label className="relative block md:w-72">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={mode === 'photos' ? '搜索风景、壁纸、照片...' : '搜索 PDF、Word、PPT...'}
                  className="min-h-11 w-full rounded-2xl border border-white/10 bg-black/25 pl-9 pr-3 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-white/25"
                />
              </label>
            )}
          </div>

          <AnimatePresence mode="wait">
            {mode === 'community' ? (
              <motion.div
                key="community"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3"
              >
                <button
                  type="button"
                  onClick={onStartContribution}
                  className="min-h-32 rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-left transition hover:border-white/20 hover:bg-white/[0.09]"
                >
                  <Users size={20} className={style.accentText} />
                  <h3 className="mt-3 text-sm font-bold text-white">投稿资料</h3>
                  <p className="mt-1 text-xs leading-5 text-slate-300">上传笔记、模板、题单或照片线索，保存后进入博客资源流。</p>
                </button>
                <button
                  type="button"
                  onClick={onOpenSandbox}
                  className="min-h-32 rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-left transition hover:border-white/20 hover:bg-white/[0.09]"
                >
                  <Music size={20} className={style.accentText} />
                  <h3 className="mt-3 text-sm font-bold text-white">背景音乐与环境声</h3>
                  <p className="mt-1 text-xs leading-5 text-slate-300">在荒野沙盘里混合雨声、潮声和篝火声，为照片或自习场景配氛围。</p>
                </button>
                <div className="min-h-32 rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                  <Sparkles size={20} className={style.accentText} />
                  <h3 className="mt-3 text-sm font-bold text-white">最近参与</h3>
                  <p className="mt-1 text-xs leading-5 text-slate-300">
                    {moments[0]?.content || '暂无动态。发布第一条微言后，这里会显示最新的参与线索。'}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2"
              >
                {filteredPosts.length === 0 ? (
                  <div className="col-span-full rounded-2xl border border-dashed border-white/15 bg-black/20 p-6 text-center text-sm text-slate-300">
                    没有匹配资源。换个关键词，或打开投稿窗口补充新的资料。
                  </div>
                ) : (
                  filteredPosts.map((post) => (
                    <article key={post.id} className="group overflow-hidden rounded-2xl border border-white/10 bg-black/25">
                      <div className="grid grid-cols-[112px_minmax(0,1fr)] gap-3 p-3">
                        <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-900">
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            loading="lazy"
                            className="h-full w-full object-cover brightness-75 transition duration-500 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute left-2 top-2 rounded-full bg-black/65 px-2 py-0.5 text-[10px] font-bold text-white">
                            {getResourceKind(post)}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <div className="mb-2 flex items-center gap-2 text-[10px] text-slate-400">
                            <span className={`rounded-full border px-2 py-0.5 ${style.badgeClass}`}>{post.category}</span>
                            <span>{post.publishDate}</span>
                          </div>
                          <h3 className="line-clamp-2 text-sm font-bold leading-5 text-white">{post.title}</h3>
                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-300">{post.summary}</p>
                          <div className="mt-3 flex items-center justify-between gap-3">
                            <span className="min-w-0 truncate text-[10px] text-slate-400">
                              {post.resourceName || `${post.likes} 赞 · ${post.views} 浏览`}
                            </span>
                            <button
                              type="button"
                              onClick={() => onOpenPost(post)}
                              className="inline-flex min-h-9 shrink-0 items-center gap-1 rounded-xl bg-white px-3 text-xs font-bold text-slate-950 transition hover:bg-slate-200"
                            >
                              查看
                              <ChevronRight size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <aside className="border-t border-white/10 bg-slate-950/40 p-5 sm:p-6 xl:border-l xl:border-t-0">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-white font-['Noto_Serif_SC']">采集队列</h3>
              <p className="mt-1 text-xs leading-5 text-slate-400">把爬虫当成候选采集器，先预览来源，再导入博客或相册。</p>
            </div>
            <Radio size={20} className={style.accentText} />
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-3">
            <label className="text-xs font-semibold text-slate-300" htmlFor="crawler-keyword">
              采集关键词
            </label>
            <div className="mt-2 flex gap-2">
              <input
                id="crawler-keyword"
                value={crawlerKeyword}
                onChange={(event) => setCrawlerKeyword(event.target.value)}
                className="min-h-11 min-w-0 flex-1 rounded-xl border border-white/10 bg-slate-950/70 px-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-white/25"
              />
              <button
                type="button"
                onClick={handleQueueCrawler}
                disabled={!crawlerKeyword.trim() || isQueued}
                className={`min-h-11 rounded-xl px-4 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-50 ${style.accentBtn}`}
              >
                {isQueued ? '排队中' : '加入'}
              </button>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {[
              { icon: Globe2, title: '国内静态部署', body: '资源通过环境变量切换到对象存储、图床代理或自建 CDN。' },
              { icon: Download, title: '下载资源优先', body: 'Word、PPT、PDF 和照片包都显示格式、大小和提取码。' },
              { icon: Camera, title: '照片导入路径', body: `当前主题：${currentTheme.name}，可进入荒野沙盘采集照片。` },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                  <Icon size={17} className={`mt-0.5 shrink-0 ${style.accentText}`} />
                  <div>
                    <h4 className="text-xs font-bold text-white">{item.title}</h4>
                    <p className="mt-1 text-xs leading-5 text-slate-400">{item.body}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={onOpenSandbox}
            className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 text-sm font-bold text-white transition hover:bg-white/15"
          >
            打开照片与爬取工作台
            <ChevronRight size={15} />
          </button>
        </aside>
      </div>
    </section>
  );
}
