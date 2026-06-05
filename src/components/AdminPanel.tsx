import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X, PlusCircle, Pencil, Trash2, Save, Eye, Heart, MessageSquare,
  Settings2, FileText, Image as ImageIcon, Layers, Search, LogIn,
  Users, ChevronLeft, AlertCircle, LogOut, Camera, Music, Palette,
  Key, Shield,
} from "lucide-react";
import { BlogPost, Moment, Comment, BackgroundTheme } from "../types";

// 默认账号（仅前端验证）
const ADMIN_USER = "admin";
const ADMIN_PASS = "vista2026";

interface AdminPanelProps {
  posts: BlogPost[];
  moments: Moment[];
  themes: BackgroundTheme[];
  currentTheme: BackgroundTheme;
  onUpdatePost: (post: BlogPost) => void;
  onDeletePost: (id: string) => void;
  onAddPost: (post: BlogPost) => void;
  onUpdateMoment: (moment: Moment) => void;
  onDeleteMoment: (id: string) => void;
  onAddMoment: (moment: Moment) => void;
  onDeleteComment: (postId: string, commentId: string) => void;
  onThemeChange: (theme: BackgroundTheme) => void;
  onClose: () => void;
}

type AdminTab = "overview" | "posts" | "moments" | "comments" | "themes" | "music" | "settings";
const CATEGORIES = ["摄影游记", "技术探索", "学习笔记", "资源收藏", "生活随想"];

const emptyPost = (): BlogPost => ({
  id: crypto.randomUUID?.() || Date.now().toString(36),
  title: "", summary: "", category: "生活随想", content: "",
  publishDate: new Date().toISOString().slice(0, 10), coverImage: "",
  readTime: "5 min", views: 0, likes: 0, comments: [],
  resourceKind: "none", resourceName: "", resourceSize: "",
});

const emptyMoment = (): Moment => ({
  id: crypto.randomUUID?.() || Date.now().toString(36),
  content: "", publishDate: new Date().toISOString().slice(0, 10),
  image: "", likes: 0, location: "", mood: "😊",
});

export default function AdminPanel(props: AdminPanelProps) {
  const {
    posts, moments, themes, currentTheme,
    onUpdatePost, onDeletePost, onAddPost,
    onUpdateMoment, onDeleteMoment, onAddMoment,
    onDeleteComment, onThemeChange, onClose,
  } = props;

  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [tab, setTab] = useState<AdminTab>("overview");
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("全部");
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [editingMoment, setEditingMoment] = useState<Moment | null>(null);
  const [showNewPost, setShowNewPost] = useState(false);
  const [showNewMoment, setShowNewMoment] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{
    type: "post" | "moment" | "comment"; id: string; subId?: string;
  } | null>(null);

  // ===== Login =====
  const handleLogin = useCallback(() => {
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      setLoggedIn(true); setLoginError("");
    } else {
      setLoginError("账号或密码错误");
    }
  }, [username, password]);

  const handleLogout = useCallback(() => {
    setLoggedIn(false); setUsername(""); setPassword("");
  }, []);

  // ===== Stats =====
  const stats = useMemo(() => ({
    totalPosts: posts.length, totalMoments: moments.length,
    allComments: posts.reduce((s, p) => s + p.comments.length, 0),
    totalViews: posts.reduce((s, p) => s + p.views, 0),
    totalLikes: posts.reduce((s, p) => s + p.likes, 0) + moments.reduce((s, m) => s + m.likes, 0),
  }), [posts, moments]);

  // ===== Filters =====
  const filteredPosts = useMemo(() => posts.filter(p => {
    const ms = !search || p.title.includes(search) || p.summary.includes(search) || (p.content || "").includes(search);
    const mc = catFilter === "全部" || p.category === catFilter;
    return ms && mc;
  }), [posts, search, catFilter]);

  const filteredMoments = useMemo(() =>
    moments.filter(m => !search || m.content.includes(search) || (m.location || "").includes(search)),
  [moments, search]);

  const allComments = useMemo(() =>
    posts.flatMap(p => p.comments.map(c => ({ ...c, postId: p.id, postTitle: p.title }))),
  [posts]);

  const filteredComments = useMemo(() =>
    allComments.filter(c => !search || (c.author || "").includes(search) || c.content.includes(search)),
  [allComments, search]);

  // ===== Save =====
  const savePost = useCallback(() => {
    if (!editingPost || !editingPost.title.trim()) return;
    posts.find(p => p.id === editingPost.id) ? onUpdatePost(editingPost) : onAddPost(editingPost);
    setEditingPost(null); setShowNewPost(false);
  }, [editingPost, posts, onAddPost, onUpdatePost]);

  const saveMoment = useCallback(() => {
    if (!editingMoment || !editingMoment.content.trim()) return;
    moments.find(m => m.id === editingMoment.id) ? onUpdateMoment(editingMoment) : onAddMoment(editingMoment);
    setEditingMoment(null); setShowNewMoment(false);
  }, [editingMoment, moments, onAddMoment, onUpdateMoment]);

  const doDelete = useCallback(() => {
    if (!confirmDelete) return;
    if (confirmDelete.type === "post") onDeletePost(confirmDelete.id);
    else if (confirmDelete.type === "moment") onDeleteMoment(confirmDelete.id);
    else if (confirmDelete.type === "comment" && confirmDelete.subId)
      onDeleteComment(confirmDelete.id, confirmDelete.subId);
    setConfirmDelete(null);
  }, [confirmDelete, onDeletePost, onDeleteMoment, onDeleteComment]);

  // ===== Login Screen =====
  if (!loggedIn) {
    return (
      <>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-md" onClick={onClose} />
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
          className="fixed inset-0 z-[210] flex items-center justify-center p-4">
          <div className="glass-panel rounded-3xl p-8 w-full max-w-sm">
            <div className="text-center mb-6">
              <Shield size={40} className="mx-auto mb-3 text-amber-400" />
              <h2 className="text-xl font-bold text-white">管理员登录</h2>
              <p className="text-xs text-slate-400 mt-1">请输入账号密码进入后台</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">账号</label>
                <div className="flex items-center gap-2 bg-white/5 rounded-xl px-4 py-3">
                  <Users size={16} className="text-slate-500" />
                  <input value={username} onChange={e => setUsername(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleLogin()}
                    placeholder="admin" autoFocus
                    className="bg-transparent text-white text-sm outline-none flex-1 placeholder-slate-600" />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">密码</label>
                <div className="flex items-center gap-2 bg-white/5 rounded-xl px-4 py-3">
                  <Key size={16} className="text-slate-500" />
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleLogin()}
                    placeholder="••••••••"
                    className="bg-transparent text-white text-sm outline-none flex-1 placeholder-slate-600" />
                </div>
              </div>
              {loginError && <p className="text-red-400 text-xs text-center">{loginError}</p>}
              <button onClick={handleLogin}
                className="w-full py-3 rounded-xl bg-amber-500/20 text-amber-300 font-bold hover:bg-amber-500/30 transition flex items-center justify-center gap-2">
                <LogIn size={16} />登录后台
              </button>
              <button onClick={onClose}
                className="w-full py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition text-sm">返回首页</button>
            </div>
          </div>
        </motion.div>
      </>
    );
  }

  // ===== Admin Dashboard =====
  const TABS: { key: AdminTab; label: string; icon: React.FC<{ size?: number }> }[] = [
    { key: "overview", label: "概览", icon: Layers },
    { key: "posts", label: "文章", icon: FileText },
    { key: "moments", label: "微言", icon: ImageIcon },
    { key: "comments", label: "评论", icon: MessageSquare },
    { key: "themes", label: "背景", icon: Camera },
    { key: "music", label: "音乐", icon: Music },
    { key: "settings", label: "设置", icon: Settings2 },
  ];

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        className="fixed inset-3 sm:inset-6 z-[210] glass-panel rounded-3xl shadow-2xl overflow-hidden flex flex-col max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <Shield size={20} className="text-amber-400" />
            <h2 className="text-lg font-bold text-white">VistaBlog 管理后台</h2>
            <span className="text-[10px] text-amber-400/70 bg-amber-400/10 px-2 py-0.5 rounded-full">已登录</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleLogout}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition">
              <LogOut size={14} />退出
            </button>
            <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 py-3 border-b border-white/5 shrink-0 overflow-x-auto">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition whitespace-nowrap ${
                tab === t.key ? "bg-amber-500/15 text-amber-300" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
              <t.icon size={14} />{t.label}
            </button>
          ))}
        </div>

        {/* Search bar */}
        {["posts", "moments", "comments"].includes(tab) && (
          <div className="flex items-center gap-3 px-6 py-3 border-b border-white/5 shrink-0">
            <div className="flex-1 flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
              <Search size={14} className="text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="搜索..." className="bg-transparent text-sm text-white placeholder-slate-500 outline-none flex-1" />
            </div>
            {tab === "posts" && (
              <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
                className="bg-white/5 text-sm text-slate-300 rounded-xl px-3 py-2 outline-none border border-white/5">
                <option value="全部">全部分类</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            )}
            {tab !== "comments" && (
              <button onClick={() => {
                if (tab === "posts") { setEditingPost(emptyPost()); setShowNewPost(true); }
                else if (tab === "moments") { setEditingMoment(emptyMoment()); setShowNewMoment(true); }
              }} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/15 text-amber-300 text-sm font-medium hover:bg-amber-500/25 transition shrink-0">
                <PlusCircle size={14} />新建
              </button>
            )}
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {/* ===== Overview ===== */}
          {tab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {[
                  { label: "文章", value: stats.totalPosts, color: "text-emerald-400" },
                  { label: "微言", value: stats.totalMoments, color: "text-sky-400" },
                  { label: "评论", value: stats.allComments, color: "text-amber-400" },
                  { label: "浏览", value: stats.totalViews, color: "text-violet-400" },
                  { label: "主题", value: themes.length, color: "text-rose-400" },
                ].map(s => (
                  <div key={s.label} className="glass-panel rounded-2xl p-4 text-center">
                    <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-slate-400 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="glass-panel rounded-2xl p-5">
                <h3 className="text-sm font-bold text-white mb-3">快捷操作</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: "写文章", action: () => { setTab("posts"); setEditingPost(emptyPost()); setShowNewPost(true); } },
                    { label: "发微言", action: () => { setTab("moments"); setEditingMoment(emptyMoment()); setShowNewMoment(true); } },
                    { label: "审评论", action: () => setTab("comments") },
                    { label: "换背景", action: () => setTab("themes") },
                    { label: "管理音乐", action: () => setTab("music") },
                    { label: "系统设置", action: () => setTab("settings") },
                  ].map(s => (
                    <button key={s.label} onClick={s.action}
                      className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition text-sm text-slate-300">{s.label}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===== Posts ===== (same as before) ===== */}
          {tab === "posts" && !showNewPost && !editingPost && (
            filteredPosts.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                <FileText size={48} className="mx-auto mb-4 opacity-20" />
                <p className="text-sm">暂无文章</p>
              </div>
            ) : filteredPosts.map(p => (
              <div key={p.id} className="glass-panel rounded-2xl p-4 flex items-start gap-4">
                {p.coverImage && <img src={p.coverImage} className="w-20 h-14 rounded-lg object-cover shrink-0" alt="" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400">{p.category}</span>
                    <span className="text-[10px] text-slate-500">{p.publishDate}</span>
                  </div>
                  <p className="text-sm font-bold text-white truncate">{p.title || "无标题"}</p>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{p.summary}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Eye size={11} />{p.views}</span>
                    <span className="flex items-center gap-1"><Heart size={11} />{p.likes}</span>
                    <span className="flex items-center gap-1"><MessageSquare size={11} />{p.comments.length}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => setEditingPost(p)} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"><Pencil size={15} /></button>
                  <button onClick={() => setConfirmDelete({ type: "post", id: p.id })} className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition"><Trash2 size={15} /></button>
                </div>
              </div>
            ))
          )}

          {/* ===== Post Editor ===== */}
          {(showNewPost || (editingPost && tab === "posts")) && editingPost && (
            <div className="space-y-4">
              <button onClick={() => { setEditingPost(null); setShowNewPost(false); }}
                className="flex items-center gap-1 text-sm text-slate-400 hover:text-white transition"><ChevronLeft size={16} />返回</button>
              <div className="glass-panel rounded-2xl p-5 space-y-4">
                <input value={editingPost.title} onChange={e => setEditingPost({ ...editingPost, title: e.target.value })}
                  placeholder="文章标题" className="w-full bg-white/5 rounded-xl px-4 py-3 text-white text-lg font-bold outline-none placeholder-slate-500" />
                <div className="flex gap-3">
                  <input value={editingPost.summary} onChange={e => setEditingPost({ ...editingPost, summary: e.target.value })}
                    placeholder="摘要" className="flex-1 bg-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none placeholder-slate-500" />
                  <select value={editingPost.category} onChange={e => setEditingPost({ ...editingPost, category: e.target.value })}
                    className="bg-white/5 text-sm text-slate-300 rounded-xl px-3 py-2 outline-none border border-white/5">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex gap-3">
                  <input value={editingPost.coverImage} onChange={e => setEditingPost({ ...editingPost, coverImage: e.target.value })}
                    placeholder="封面图 URL" className="flex-1 bg-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none placeholder-slate-500" />
                  <input value={editingPost.publishDate} onChange={e => setEditingPost({ ...editingPost, publishDate: e.target.value })}
                    type="date" className="bg-white/5 text-sm text-slate-300 rounded-xl px-3 py-2 outline-none border border-white/5" />
                </div>
                <textarea value={editingPost.content || ""} onChange={e => setEditingPost({ ...editingPost, content: e.target.value })}
                  placeholder="正文 (Markdown)" rows={14}
                  className="w-full bg-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none placeholder-slate-500 font-mono resize-y" />
                <div className="flex gap-3 pt-2">
                  <button onClick={savePost} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-medium hover:bg-emerald-500/30 transition"><Save size={16} />保存</button>
                  <button onClick={() => { setEditingPost(null); setShowNewPost(false); }} className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition text-sm">取消</button>
                </div>
              </div>
            </div>
          )}

          {/* ===== Moments ===== */}
          {tab === "moments" && !showNewMoment && !editingMoment && (
            filteredMoments.length === 0 ? (
              <div className="text-center py-16 text-slate-500"><ImageIcon size={48} className="mx-auto mb-4 opacity-20" /><p className="text-sm">暂无微言</p></div>
            ) : filteredMoments.map(m => (
              <div key={m.id} className="glass-panel rounded-2xl p-4 flex items-start gap-4">
                {m.image && <img src={m.image} className="w-14 h-14 rounded-lg object-cover shrink-0" alt="" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm">{m.mood}</span><span className="text-[10px] text-slate-500">{m.publishDate}</span>
                    {m.location && <span className="text-[10px] text-slate-500">- {m.location}</span>}
                  </div>
                  <p className="text-sm text-slate-300 line-clamp-2">{m.content}</p>
                  <span className="text-xs text-slate-500 mt-1 flex items-center gap-1"><Heart size={11} />{m.likes}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => setEditingMoment(m)} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"><Pencil size={15} /></button>
                  <button onClick={() => setConfirmDelete({ type: "moment", id: m.id })} className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition"><Trash2 size={15} /></button>
                </div>
              </div>
            ))
          )}

          {/* ===== Moment Editor ===== */}
          {(showNewMoment || (editingMoment && tab === "moments")) && editingMoment && (
            <div className="space-y-4">
              <button onClick={() => { setEditingMoment(null); setShowNewMoment(false); }}
                className="flex items-center gap-1 text-sm text-slate-400 hover:text-white transition"><ChevronLeft size={16} />返回</button>
              <div className="glass-panel rounded-2xl p-5 space-y-4">
                <textarea value={editingMoment.content} onChange={e => setEditingMoment({ ...editingMoment, content: e.target.value })}
                  placeholder="此刻的想法..." rows={4} className="w-full bg-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none placeholder-slate-500 resize-y" />
                <div className="flex gap-3">
                  <input value={editingMoment.image || ""} onChange={e => setEditingMoment({ ...editingMoment, image: e.target.value })}
                    placeholder="图片 URL" className="flex-1 bg-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none placeholder-slate-500" />
                  <input value={editingMoment.location || ""} onChange={e => setEditingMoment({ ...editingMoment, location: e.target.value })}
                    placeholder="地点" className="w-32 bg-white/5 rounded-xl px-3 py-2 text-sm text-white outline-none placeholder-slate-500" />
                  <input value={editingMoment.mood || ""} onChange={e => setEditingMoment({ ...editingMoment, mood: e.target.value })}
                    maxLength={4} className="w-16 bg-white/5 rounded-xl px-3 py-2 text-sm outline-none text-center" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={saveMoment} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500/20 text-sky-300 font-medium hover:bg-sky-500/30 transition"><Save size={16} />保存</button>
                  <button onClick={() => { setEditingMoment(null); setShowNewMoment(false); }} className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition text-sm">取消</button>
                </div>
              </div>
            </div>
          )}

          {/* ===== Comments ===== */}
          {tab === "comments" && (
            filteredComments.length === 0 ? (
              <div className="text-center py-16 text-slate-500"><MessageSquare size={48} className="mx-auto mb-4 opacity-20" /><p className="text-sm">暂无评论</p></div>
            ) : filteredComments.map(c => (
              <div key={`${c.postId}-${c.id}`} className="glass-panel rounded-2xl p-4 flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center shrink-0"><Users size={16} className="text-slate-400" /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-white">{c.author || "匿名"}</span>
                    <span className="text-[10px] text-slate-500">{c.date}</span>
                    <span className="text-[10px] text-slate-500 bg-white/5 px-2 py-0.5 rounded-full truncate max-w-[140px]">来自: {c.postTitle}</span>
                  </div>
                  <p className="text-sm text-slate-300">{c.content}</p>
                </div>
                <button onClick={() => setConfirmDelete({ type: "comment", id: c.postId, subId: c.id })}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition shrink-0"><Trash2 size={15} /></button>
              </div>
            ))
          )}

          {/* ===== Themes Management ===== */}
          {tab === "themes" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">背景主题管理 ({themes.length} 个)</h3>
                <span className="text-xs text-slate-500">点击切换当前背景</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {themes.map(theme => (
                  <div key={theme.id} onClick={() => onThemeChange(theme)}
                    className={`glass-panel rounded-2xl overflow-hidden cursor-pointer transition hover:scale-[1.02] ${
                      currentTheme.id === theme.id ? "ring-2 ring-amber-400 shadow-lg shadow-amber-400/10" : ""}`}>
                    <div className="relative h-32">
                      <img src={theme.url} alt={theme.name} className="w-full h-full object-cover" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="text-white font-bold text-sm">{theme.name}</p>
                        <p className="text-slate-300 text-xs mt-0.5">{theme.description}</p>
                      </div>
                      {currentTheme.id === theme.id && (
                        <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-amber-400 ring-2 ring-amber-400/30" />
                      )}
                    </div>
                    <div className="px-4 py-2 flex items-center justify-between text-xs text-slate-400">
                      <span>@{theme.photographer}</span>
                      <span className="capitalize">{theme.accentColor}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== Music Management ===== */}
          {tab === "music" && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">音乐管理</h3>
              <div className="glass-panel rounded-2xl p-6 text-center space-y-3">
                <Music size={40} className="mx-auto text-slate-500" />
                <p className="text-sm text-slate-400">音乐播放列表由 /music.json 配置文件管理</p>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  修改项目根目录的 music.json 文件即可更新播放列表。
                  支持网易云音乐歌单 ID 导入（需 NCM API 可用）。
                </p>
                <div className="bg-black/30 rounded-xl p-4 text-left font-mono text-xs text-slate-300 overflow-x-auto">
                  <pre>{`{
  "neteaseIds": ["songId1", "songId2"],
  "fallbackPlaylist": [
    {
      "id": "1",
      "title": "歌曲名",
      "artist": "歌手",
      "url": "https://...",
      "cover": "https://..."
    }
  ]
}`}</pre>
                </div>
                <p className="text-[11px] text-slate-500">当前播放列表: {props.posts.length > 0 ? "已加载" : "默认列表"}</p>
              </div>
            </div>
          )}

          {/* ===== Settings ===== */}
          {tab === "settings" && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">系统设置</h3>
              <div className="glass-panel rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white font-medium">账号信息</p>
                    <p className="text-xs text-slate-400">当前登录: {ADMIN_USER}</p>
                  </div>
                  <button onClick={handleLogout}
                    className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 text-sm hover:bg-red-500/20 transition">退出登录</button>
                </div>
                <hr className="border-white/5" />
                <div>
                  <p className="text-sm text-white font-medium mb-2">数据统计</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                    <span>文章总数: {stats.totalPosts}</span>
                    <span>微言总数: {stats.totalMoments}</span>
                    <span>评论总数: {stats.allComments}</span>
                    <span>总浏览量: {stats.totalViews}</span>
                    <span>总点赞数: {stats.totalLikes}</span>
                    <span>背景主题: {themes.length}</span>
                  </div>
                </div>
                <hr className="border-white/5" />
                <div>
                  <p className="text-sm text-white font-medium mb-2">VistaBlog 信息</p>
                  <p className="text-xs text-slate-400">
                    版本 v2.0 · React 19 + TypeScript + Vite 6 + Tailwind CSS v4
                    <br />数据存储在浏览器 localStorage 中
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Delete confirm modal */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[220] bg-black/50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="glass-panel rounded-2xl p-6 max-w-sm w-full text-center">
              <AlertCircle size={36} className="mx-auto mb-3 text-red-400" />
              <h3 className="text-lg font-bold text-white mb-1">确认删除</h3>
              <p className="text-sm text-slate-400 mb-5">此操作不可撤销</p>
              <div className="flex gap-3 justify-center">
                <button onClick={doDelete} className="px-5 py-2.5 rounded-xl bg-red-500/20 text-red-300 font-medium hover:bg-red-500/30 transition">确认删除</button>
                <button onClick={() => setConfirmDelete(null)} className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition">取消</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
