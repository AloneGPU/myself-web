import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, Eye, MessageSquare, CornerDownRight, Plus, Send, RefreshCw, ZoomIn, ZoomOut, Sparkles, BookOpen, Download, Key, FileCheck, Image as ImageIcon } from 'lucide-react';
import { BlogPost, Comment } from '../types';

interface ReaderModalProps {
  post: BlogPost | null;
  onClose: () => void;
  onLike: (postId: string) => void;
  onAddComment: (postId: string, comment: Comment) => void;
  accentClass: string;
}

export default function ReaderModal({ post, onClose, onLike, onAddComment, accentClass }: ReaderModalProps) {
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [commentImage, setCommentImage] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [commentError, setCommentError] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [copiedResourcePw, setCopiedResourcePw] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Calculate relative typography time elegantly
  const getRelativeTime = (dateStr: string): string => {
    try {
      const commentTime = new Date(dateStr).getTime();
      if (isNaN(commentTime)) return dateStr;
      
      const now = Date.now();
      const diffMs = now - commentTime;
      
      if (diffMs < 8000) {
        return '刚刚';
      }
      
      const diffSecs = Math.floor(diffMs / 1000);
      if (diffSecs < 60) {
        return `${diffSecs}秒前`;
      }
      
      const diffMins = Math.floor(diffSecs / 60);
      if (diffMins < 60) {
        return `${diffMins}分钟前`;
      }
      
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) {
        return `${diffHours}小时前`;
      }
      
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 30) {
        return `${diffDays}天前`;
      }
      
      const diffMonths = Math.floor(diffDays / 30);
      if (diffMonths < 12) {
        return `${diffMonths}个月前`;
      }
      
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const handleReplyToComment = (targetComment: Comment) => {
    setReplyingTo(targetComment);
    const formElement = document.getElementById('comment-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 200);
  };

  // Check if liked before
  useEffect(() => {
    if (post) {
      const likedPosts = JSON.parse(localStorage.getItem('liked_posts') || '[]');
      setIsLiked(likedPosts.includes(post.id));
      setScrollProgress(0);
      setReplyingTo(null);
    }
  }, [post]);

  // Track reading scroll progress
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const progress = (target.scrollTop / (target.scrollHeight - target.clientHeight)) * 100;
    setScrollProgress(Math.min(100, Math.max(0, progress)));
  };

  if (!post) return null;

  // Render font sizes cleanly
  const fontClass = {
    sm: 'text-sm leading-relaxed',
    base: 'text-base md:text-lg leading-relaxed',
    lg: 'text-lg md:text-xl leading-relaxed',
    xl: 'text-xl md:text-2xl leading-relaxed',
  }[fontSize];

  // Submit comment
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentName.trim()) {
      setCommentError('请填写您的昵称');
      return;
    }
    if (!newCommentText.trim()) {
      setCommentError('请填写评论内容');
      return;
    }

    const comment: Comment = {
      id: 'comment_' + Date.now(),
      author: newCommentName.trim(),
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(newCommentName)}`,
      content: newCommentText.trim(),
      date: new Date().toISOString(),
      replyToCommentId: replyingTo?.id || undefined,
      replyToAuthor: replyingTo?.author || undefined,
      image: commentImage.trim() || undefined
    };

    onAddComment(post.id, comment);
    setNewCommentText('');
    setCommentImage('');
    setCommentError('');
    setReplyingTo(null);
  };

  const handleLikeClick = () => {
    onLike(post.id);
    const likedPosts = JSON.parse(localStorage.getItem('liked_posts') || '[]');
    if (likedPosts.includes(post.id)) {
      const updated = likedPosts.filter((id: string) => id !== post.id);
      localStorage.setItem('liked_posts', JSON.stringify(updated));
      setIsLiked(false);
    } else {
      likedPosts.push(post.id);
      localStorage.setItem('liked_posts', JSON.stringify(likedPosts));
      setIsLiked(true);
    }
  };

  // Safe custom markdown-styled parsing
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    let inList = false;
    let listItems: string[] = [];
    const elements: React.ReactNode[] = [];

    const flushList = (keyPrefix: string) => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`ul-${keyPrefix}`} className="list-disc pl-6 my-4 space-y-2 text-slate-800 dark:text-slate-200">
            {listItems.map((item, idx) => (
              <li key={`li-${keyPrefix}-${idx}`}>{parseInlineMarkup(item)}</li>
            ))}
          </ul>
        );
        listItems = [];
        inList = false;
      }
    };

    const parseInlineMarkup = (text: string) => {
      // Bold **text**
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = boldRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          parts.push(text.substring(lastIndex, match.index));
        }
        parts.push(<strong key={match.index} className="font-bold text-slate-900 dark:text-white">{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }

      if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
      }

      return parts.length > 0 ? parts : text;
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      // Check lists
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        inList = true;
        listItems.push(trimmed.substring(2));
        return;
      } else if (trimmed === '' && inList) {
        flushList(String(index));
        return;
      } else if (!trimmed.startsWith('- ') && !trimmed.startsWith('* ') && inList) {
        flushList(String(index));
      }

      // Headings
      if (trimmed.startsWith('### ')) {
        elements.push(
          <h4 key={`h3-${index}`} className="text-xl font-semibold text-slate-950 dark:text-white mt-8 mb-4 tracking-tight border-l-4 pl-3" style={{ borderColor: 'var(--accent-color, #10b981)' }}>
            {parseInlineMarkup(trimmed.substring(4))}
          </h4>
        );
      } else if (trimmed.startsWith('## ')) {
        elements.push(
          <h3 key={`h2-${index}`} className="text-2xl font-bold text-slate-950 dark:text-white mt-9 mb-4 tracking-tight">
            {parseInlineMarkup(trimmed.substring(3))}
          </h3>
        );
      } else if (trimmed.startsWith('H1 ') || trimmed.startsWith('# ')) {
        elements.push(
          <h2 key={`h1-${index}`} className="text-3xl font-extrabold text-slate-950 dark:text-white mt-10 mb-6 tracking-tight">
            {parseInlineMarkup(trimmed.replace(/^#\s+/, ''))}
          </h2>
        );
      } else if (trimmed.startsWith('> ')) {
        // Blockquotes
        elements.push(
          <blockquote key={`quote-${index}`} className="border-l-4 pl-4 py-2 my-6 italic text-slate-600 dark:text-slate-300 bg-slate-50/50 dark:bg-zinc-900/30 rounded-r-lg">
            {parseInlineMarkup(trimmed.substring(2))}
          </blockquote>
        );
      } else if (trimmed.startsWith('```')) {
        // Simple code/note blocks (supports single line as simple blocks)
        const codeText = trimmed.endsWith('```') && trimmed.length > 3 ? trimmed.slice(3, -3) : trimmed;
        if (codeText !== '```') {
          elements.push(
            <pre key={`code-${index}`} className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-sm overflow-x-auto my-6 whitespace-pre-wrap">
              <code>{codeText}</code>
            </pre>
          );
        }
      } else if (trimmed !== '') {
        // Regular paragraphs
        elements.push(
          <p key={`p-${index}`} className="mb-4 text-slate-800 dark:text-slate-200 indent-0 md:indent-2">
            {parseInlineMarkup(trimmed)}
          </p>
        );
      }
    });

    // Flush any remaining active lists
    if (inList) {
      flushList('final');
    }

    return elements;
  };

  // Preset highlights
  const bgAccentMap: Record<string, string> = {
    emerald: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30 hover:text-white',
    amber: 'bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30 hover:text-white',
    indigo: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/30 hover:text-white',
    cyan: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/30 hover:text-white',
    teal: 'bg-teal-500/20 text-teal-300 border-teal-500/30 hover:bg-teal-500/30 hover:text-white',
  };

  const btnAccentMap: Record<string, string> = {
    emerald: 'bg-emerald-600 text-white hover:bg-emerald-500',
    amber: 'bg-amber-600 text-white hover:bg-amber-500',
    indigo: 'bg-indigo-600 text-white hover:bg-indigo-500',
    cyan: 'bg-cyan-600 text-white hover:bg-cyan-500',
    teal: 'bg-teal-600 text-white hover:bg-teal-500',
  };

  const ringAccentMap: Record<string, string> = {
    emerald: 'focus:ring-emerald-500',
    amber: 'focus:ring-amber-500',
    indigo: 'focus:ring-indigo-500',
    cyan: 'focus:ring-cyan-500',
    teal: 'focus:ring-teal-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-slate-950/80 backdrop-blur-md"
    >
      {/* Scroll indicator */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-800 z-50">
        <div
          className="h-full transition-all duration-150 rounded-r-full"
          style={{
            width: `${scrollProgress}%`,
            backgroundColor: `var(--accent-vibe-color, currentColor)`
          }}
        />
      </div>

      <motion.div
        initial={{ scale: 0.95, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 30 }}
        transition={{ type: 'spring', damping: 25, stiffness: 180 }}
        className="relative w-full max-w-4xl h-[90vh] flex flex-col bg-slate-900/90 border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl"
        id="reader-modal-body"
      >
        {/* Modal Controls Bar */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          {/* Font Sizer */}
          <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/50">
            <span className="text-xs text-slate-400 mr-1 hidden sm:inline">字号:</span>
            <button
              onClick={() => setFontSize('sm')}
              className={`p-1 text-xs rounded transition ${fontSize === 'sm' ? 'bg-white/20 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
              title="小字"
            >
              小
            </button>
            <button
              onClick={() => setFontSize('base')}
              className={`p-1 text-xs rounded transition ${fontSize === 'base' ? 'bg-white/20 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
              title="中字"
            >
              中
            </button>
            <button
              onClick={() => setFontSize('lg')}
              className={`p-1 text-xs rounded transition ${fontSize === 'lg' ? 'bg-white/20 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
              title="大字"
            >
              大
            </button>
            <button
              onClick={() => setFontSize('xl')}
              className={`p-1 text-xs rounded transition ${fontSize === 'xl' ? 'bg-white/20 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
              title="超大"
            >
              特
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-black/40 hover:bg-red-500/30 hover:border-red-500/50 transition-all border border-slate-700/50 rounded-full text-slate-300 hover:text-white"
            id="close-reader-btn"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Container */}
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto overflow-x-hidden"
          id="reader-scrollable-content"
        >
          {/* Cover Hero Block */}
          <div className="relative h-64 md:h-[40vh] w-full overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover select-none filter brightness-[0.7] contrast-[1.05]"
              referrerPolicy="no-referrer"
            />
            {/* Elegant overlay shadow */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

            {/* Post meta on cover bottom */}
            <div className="absolute bottom-6 left-6 right-6 md:left-10 md:right-10 flex flex-col justify-end">
              <span className="self-start text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-wide border border-opacity-50"
                  style={{
                    backgroundColor: `var(--accent-tag-bg, rgba(16, 185, 129, 0.2))`,
                    borderColor: `var(--accent-tag-border, rgba(16, 185, 129, 0.4))`,
                    color: `var(--accent-text-color, #34d399)`
                  }}>
                {post.category}
              </span>
              <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight select-text mb-3">
                {post.title}
              </h1>
              <div className="flex items-center gap-4 text-xs md:text-sm text-slate-300 font-medium">
                <span>发表于: {post.publishDate}</span>
                <span>•</span>
                <span>预计阅读: {post.readTime}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Eye size={14} /> {post.views} 次浏览</span>
              </div>
            </div>
          </div>

          {/* Reader Core Layout */}
          <div className="px-6 py-8 md:px-12 md:py-10 max-w-3xl mx-auto">
            {/* Highlights cards */}
            <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-2xl mb-8 leading-relaxed text-sm text-slate-400">
              <span className="font-bold text-slate-300 mr-2 border-r border-slate-700 pr-2">摘要</span>
              {post.summary}
            </div>

            {/* Core post contents */}
            <div className={`prose dark:prose-invert max-w-full text-slate-300 select-text ${fontClass}`} id="rendered-post-content"
              style={{
                '--accent-color': `var(--accent-vibe-color, #10b981)`
              } as React.CSSProperties}
            >
              {renderContent(post.content)}
            </div>

            {/* --- STUDY MATERIALS RESOURCE CORRIDOR --- */}
            {(post.category === '学习资料' || post.resourceLink) && (() => {
              // Parse the resource format dynamically
              const resNameLower = (post.resourceName || '').toLowerCase();
              let formatBadge = {
                icon: <BookOpen size={13} className="text-indigo-400" />,
                label: '高级备考讲义与共享链接',
                bgColor: 'bg-indigo-500/10',
                borderColor: 'border-indigo-500/20',
                textColor: 'text-indigo-300',
                detail: '支持各种学习浏览器一键浏览及传输'
              };

              if (resNameLower.includes('.doc') || resNameLower.includes('word') || resNameLower.includes('文档')) {
                formatBadge = {
                  icon: (
                    <svg className="w-3.5 h-3.5 text-blue-400 fill-current" viewBox="0 0 24 24">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 14H7v-2h10v2zm0-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                    </svg>
                  ),
                  label: 'Word高频考点文档 (.docx)',
                  bgColor: 'bg-blue-500/10',
                  borderColor: 'border-blue-500/20',
                  textColor: 'text-blue-300',
                  detail: '排版整洁完整 · 建议PC端双面打印背诵'
                };
              } else if (resNameLower.includes('.ppt') || resNameLower.includes('powerpoint')) {
                formatBadge = {
                  icon: (
                    <svg className="w-3.5 h-3.5 text-orange-400 fill-current" viewBox="0 0 24 24">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2zm0-4H7V7h10v2z"/>
                    </svg>
                  ),
                  label: 'PPT学术汇报演示稿 (.pptx)',
                  bgColor: 'bg-orange-500/10',
                  borderColor: 'border-orange-500/20',
                  textColor: 'text-orange-300',
                  detail: '内嵌高科技拓扑框架 · 课堂汇报满分模板'
                };
              } else if (resNameLower.includes('.pdf')) {
                formatBadge = {
                  icon: (
                    <svg className="w-3.5 h-3.5 text-rose-450 fill-current" viewBox="0 0 24 24">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 6H9v6h6v-6z"/>
                    </svg>
                  ),
                  label: 'PDF高清电子复习讲义 (.pdf)',
                  bgColor: 'bg-rose-500/10',
                  borderColor: 'border-rose-500/20',
                  textColor: 'text-rose-300',
                  detail: '高清矢量排版大图 · 兼容所有阅读器'
                };
              } else if (resNameLower.includes('风景') || resNameLower.includes('壁纸') || resNameLower.includes('照片') || resNameLower.includes('图片') || resNameLower.includes('scenery')) {
                formatBadge = {
                  icon: <ImageIcon size={13.5} className="text-emerald-400" />,
                  label: '自学景观风景摄影壁纸图库 (.zip/.png)',
                  bgColor: 'bg-emerald-500/15',
                  borderColor: 'border-emerald-500/25',
                  textColor: 'text-emerald-300',
                  detail: '100% 治愈备考风景照片 · 原片超高清下载'
                };
              } else if (resNameLower.includes('.zip') || resNameLower.includes('.rar') || resNameLower.includes('压缩包')) {
                formatBadge = {
                  icon: (
                    <svg className="w-3.5 h-3.5 text-amber-400 fill-current" viewBox="0 0 24 24">
                      <path d="M20 6h-8l-2-2H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 10H8v-2h6v2zm4-4H8v-2h10v2z"/>
                    </svg>
                  ),
                  label: 'ZIP归档资源压缩包 (.zip)',
                  bgColor: 'bg-amber-500/10',
                  borderColor: 'border-amber-500/20',
                  textColor: 'text-amber-300',
                  detail: '安全提取无病毒认证 · 解压一键使用'
                };
              }

              return (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900/90 to-indigo-950/20 border border-indigo-500/20 shadow-lg space-y-4 text-left font-sans"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-indigo-500/10 pb-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${formatBadge.bgColor} ${formatBadge.borderColor}`}>
                        {formatBadge.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider">学理资料 & 自学氛围风景分享通道</h4>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded border font-mono ${formatBadge.bgColor} ${formatBadge.textColor} ${formatBadge.borderColor}`}>
                            {formatBadge.label}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">{formatBadge.detail}</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-indigo-500/15 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/20 font-mono self-start sm:self-center">
                      资源体积: {post.resourceSize || '14.8 MB'}
                    </span>
                  </div>

                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 bg-slate-950/40 rounded-xl border border-slate-800">
                    <div className="space-y-1 min-w-0 flex-1">
                      <span className="text-[9px] text-indigo-300 font-bold uppercase tracking-wider block">共享文件 / 备考素材 / 高清壁纸原图</span>
                      <h5 className="text-xs font-semibold text-slate-200 truncate pr-2">
                        {post.resourceName || '【考研/期末复习】编译原理核心状态树与其LR1语法自解指南.pdf'}
                      </h5>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <FileCheck size={11} className="text-emerald-400" />
                          极速安全校验: 🟢 腾讯云管家与安全中心无卡顿认证
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 w-full md:w-auto mt-2 md:mt-0">
                      <button
                        type="button"
                        onClick={() => {
                          const targetPw = post.resourcePassword || 'MIT2026';
                          navigator.clipboard.writeText(targetPw);
                          setCopiedResourcePw(true);
                          setTimeout(() => setCopiedResourcePw(false), 2000);
                        }}
                        className="flex-1 md:flex-none px-3 py-1.5 bg-slate-800 hover:bg-slate-700 hover:text-white text-slate-300 rounded-lg text-[11px] font-medium transition flex items-center justify-center gap-1 border border-white/5 cursor-pointer active:scale-95"
                      >
                        <Key size={11} className="text-indigo-400" />
                        <span>{copiedResourcePw ? '提取码已复制！' : `提取码: ${post.resourcePassword || 'MIT2026'}`}</span>
                      </button>
                      <motion.button
                        whileHover={{ 
                          scale: 1.05,
                          y: [0, -3, 0],
                          transition: { 
                            y: {
                              repeat: Infinity,
                              duration: 0.6,
                              ease: "easeInOut"
                            }
                          } 
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          if (isDownloading) return;
                          setIsDownloading(true);
                          
                          // Open sharing/download URL safely
                          window.open(post.resourceLink || 'https://github.com/google/genai', '_blank');

                          // Self clear
                          setTimeout(() => {
                            setIsDownloading(false);
                          }, 1800);
                        }}
                        className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center justify-center gap-1.5 shadow cursor-pointer select-none ${
                          isDownloading
                            ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20 text-white'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/25'
                        }`}
                      >
                        {isDownloading ? (
                          <span className="animate-pulse flex items-center gap-1">
                            <span>资源获取中...</span>
                            <span className="animate-spin text-[10px]">⏳</span>
                          </span>
                        ) : (
                          <>
                            <span>前往下载</span>
                            <Download size={11} />
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-450 leading-normal bg-black/15 p-2.5 rounded-lg border border-white/5 space-y-1">
                    <p>💡 <strong>学习分享友情提醒:</strong> 以上分享资料占比中，高价值学习文档（Word笔记、PPT演讲模板、PDF教材）及风景美照（治愈系自习室风景照、微光校园保护色）各占一半（50%比50%分布），以此在繁琐解题与平静风景间构建完美的精力能量守恒。你可以打包一键保存！</p>
                  </div>
                </motion.div>
              );
            })()}

            {/* Content Divider line */}
            <hr className="border-slate-800 my-10" />

            {/* Likes & Actions Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-slate-950/30 border border-slate-800">
              <div className="text-slate-400 text-sm">
                如果这篇文章触动了你，点亮这颗心来鼓励作者吧。
              </div>
              <button
                onClick={handleLikeClick}
                className={`flex items-center gap-2.5 px-6 py-2.5 rounded-full font-semibold transition-all border ${
                  isLiked
                    ? 'bg-red-500/20 text-red-400 border-red-500/40 scale-105'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500 hover:bg-slate-700/60'
                }`}
                id="like-blog-btn"
              >
                <Heart size={18} className={isLiked ? 'fill-red-400 text-red-400' : 'text-slate-400'} />
                <span>{isLiked ? '已赞过' : '赞一个'} ({post.likes + (isLiked ? 1 : 0)})</span>
              </button>
            </div>

            {/* Dynamic Comments Area */}
            <div className="mt-12" id="comments-section-container">
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare size={22} style={{ color: `var(--accent-vibe-color, #10b981)` }} />
                <h3 className="text-xl font-bold text-white">
                  精选留言 ({post.comments.length})
                </h3>
              </div>

               {/* Comment Form */}
              <form id="comment-form" onSubmit={handleSubmitComment} className="bg-slate-950/40 border border-slate-800 p-5 rounded-2xl mb-8 space-y-4">
                {replyingTo && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between px-3.5 py-2 bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-350 rounded-xl"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <CornerDownRight size={13} className="shrink-0 text-indigo-400" />
                      <span className="font-semibold shrink-0">正在回复 @{replyingTo.author} :</span>
                      <span className="opacity-85 truncate text-slate-350 italic">"{replyingTo.content}"</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setReplyingTo(null)}
                      className="text-slate-400 hover:text-red-400 font-bold ml-3 text-[10px] cursor-pointer transition shrink-0 uppercase tracking-wider"
                    >
                      取消回复
                    </button>
                  </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-semibold text-slate-400 mb-1.5">您的昵称</label>
                    <input
                      type="text"
                      placeholder="例如: 极客漫步"
                      value={newCommentName}
                      onChange={(e) => setNewCommentName(e.target.value)}
                      className={`w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-opacity-150 transition ${ringAccentMap[accentClass] || 'focus:ring-emerald-500'}`}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase font-semibold text-slate-400 mb-1.5">评论内容</label>
                  <textarea
                    ref={textareaRef}
                    rows={3}
                     placeholder={replyingTo ? `编辑对 @${replyingTo.author} 的回复...` : "说点什么吧，支持友善而深刻的交流..."}
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    className={`w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-opacity-150 transition resize-none ${ringAccentMap[accentClass] || 'focus:ring-emerald-500'}`}
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-semibold text-slate-400 mb-1.5 flex items-center justify-between">
                    <span>分享风景/学习资料配图 (可选 Image Attachment)</span>
                    <span className="text-[10px] text-slate-500">粘贴图片外链或上传本地风景照片</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="url"
                      placeholder="网络大图 https://images.unsplash.com/..."
                      value={commentImage}
                      onChange={(e) => setCommentImage(e.target.value)}
                      className={`w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none transition ${ringAccentMap[accentClass] || 'focus:ring-emerald-500'}`}
                    />
                    <label className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-dashed border-slate-700 hover:border-slate-600 rounded-xl text-slate-400 hover:text-white cursor-pointer transition text-xs select-none">
                      <ImageIcon size={13} className="text-amber-400" />
                      <span>{commentImage.startsWith('data:image') ? '🟢 已成功载入本地大图' : '选择设备中的风景照...'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              if (typeof reader.result === 'string') {
                                setCommentImage(reader.result);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                  {commentImage && (
                    <div className="mt-3.5 relative w-28 aspect-video rounded-xl overflow-hidden border border-white/15 shadow-md group">
                      <img src={commentImage} className="w-full h-full object-cover" alt="Comment attachment thumbnail" />
                      <button
                        type="button"
                        onClick={() => setCommentImage('')}
                        className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-300 text-[10px] font-bold transition duration-200 select-none cursor-pointer"
                      >
                        ❌ 清除此图
                      </button>
                    </div>
                  )}
                </div>

                {commentError && (
                  <p className="text-red-400 text-xs font-semibold">{commentError}</p>
                )}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-semibold transition ${btnAccentMap[accentClass] || 'bg-emerald-600 hover:bg-emerald-500'}`}
                  >
                    <Send size={15} />
                    {replyingTo ? '发表回复' : '发表留言'}
                  </button>
                </div>
              </form>

              {/* Comments Thread */}
              {post.comments.length === 0 ? (
                <div className="text-center py-8 text-slate-500 bg-slate-950/10 border border-slate-800 border-dashed rounded-2xl">
                  暂无留言。留下你精心准备的思绪，成为第一位发声的人吧！
                </div>
              ) : (
                <div className="space-y-4">
                  {post.comments.map((comment, index) => (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      key={comment.id}
                      className="group p-4 bg-slate-950/20 border border-slate-800/80 rounded-2xl flex gap-4 hover:border-slate-700/60 transition"
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-800 border border-slate-700 shrink-0 self-start">
                        <img
                          src={comment.avatar}
                          alt={comment.author}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-200 text-sm">{comment.author}</span>
                            {comment.replyToAuthor && (
                              <>
                                <span className="text-[11px] text-slate-500 font-light select-none">回复</span>
                                <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-350 text-[10px] font-bold font-mono">
                                  @{comment.replyToAuthor}
                                </span>
                              </>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-500 font-mono select-none">
                              {getRelativeTime(comment.date)}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleReplyToComment(comment)}
                              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 py-1 px-2.5 bg-indigo-500/5 hover:bg-indigo-500/10 border border-indigo-500/10 rounded-lg cursor-pointer transition opacity-90 md:opacity-0 md:group-hover:opacity-100 focus:opacity-100 duration-200"
                              title={`回复 ${comment.author}`}
                            >
                              <CornerDownRight size={11} />
                              <span>回复</span>
                            </button>
                          </div>
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap select-text pt-0.5">
                          {comment.content}
                        </p>
                        {comment.image && (
                          <div className="mt-3 relative max-w-sm rounded-xl overflow-hidden border border-white/10 group-inside cursor-zoom-in">
                            <img
                              src={comment.image}
                              alt="Landscape attachment"
                              className="w-full object-cover max-h-56 select-none shadow hover:brightness-105 transition duration-300"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute top-1.5 left-1.5 bg-black/60 text-[9px] text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/20 font-mono tracking-wider">
                              🏞️ 学习配图 / 风景随影
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Back Button */}
            <div className="flex justify-center mt-12 mb-6">
              <button
                onClick={onClose}
                className="flex items-center gap-2 px-8 py-3 bg-slate-800 hover:bg-slate-700 transition font-bold text-slate-200 hover:text-white rounded-full border border-slate-700/80"
              >
                关闭阅读
              </button>
            </div>

          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
