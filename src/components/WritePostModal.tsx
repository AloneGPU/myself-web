import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Feather, FileText, Check, Camera, Image as ImageIcon, Sparkles, BookOpen } from 'lucide-react';
import { BlogPost, Moment } from '../types';

interface WritePostModalProps {
  onClose: () => void;
  onSavePost: (post: BlogPost) => void;
  onSaveMoment: (moment: Moment) => void;
  accentClass: string;
}

const CONSTANT_COVERS = [
  { name: '山小屋 (Misty Cabin)', url: 'https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=800&q=80' },
  { name: '云间公路 (Rhythm Route)', url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80' },
  { name: '蔚蓝礁石 (Ocean Sea)', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
  { name: '竹径清听 (Green Bamboo)', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80' },
  { name: '秋叶斑斓 (Golden Leaves)', url: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80' },
];

const MOODS = ['平静愉悦', '思索中', '活力满满', '惬意慢活', '摄影漫步', '放空感悟'];

const TEMPLATE_DAILY_LIFE = `### 📝 日常行为与生活节奏分析
*   **记录时间**: 2026/06/03
*   **今日能量评估**: 🔋 8/10分 (状态良好)
*   **生活关键词**: [沉思, 效率, 户外散步]

### 🔍 每日状态深度剖析
1.  **最饱满的心流时刻**: 
    - 早上在写字楼窗前独立编写核心模块，两小时无间断心流。
2.  **情绪内耗点与断舍离状态**:
    - 关闭了非必要的社交媒体通知，干扰度大幅降低，脑力负荷显著变轻。
3.  **身体精神能量平衡**:
    - 晚饭后在河畔绿道散步 40 分钟，双腿踩在泥土感觉真实、疗愈。

### 🕊️ 调整或改进方案
- [ ] 限制睡前看手机的时间在10分钟以内
- [ ] 晨间增加 10 分钟深呼吸与冥想练习`;

const TEMPLATE_STUDY_MATERIAL = `### 📚 高质量学习资料索引归纳
*   **资料主题/学科**: 计算机编译技术与算法设计
*   **难度评价分级**: ⭐⭐⭐ (中等难度)
*   **推荐检索/下载源**: MIT OpenCourseWare Lecture Node 4
*   **媒介核心形态**: [官方设计白皮书 / 核心架构拓扑图]

### 🧠 核心知识树结构 (Key Cognitive Map)
1.  **基础元定理 / 前言假设 (Basics)**:
    - 引入最简单的状态机转移方程，保证事件分发的幂等性。
2.  **方法论运作内核 (Internal Paradigm)**:
    - 利用 LR(1) 语法树进行静态剖析，保证递归在编译前安全退出。
3.  **实践红线与规避机制 (Anti-patterns)**:
    - 避免在大面积递归循环中多次声明中间内存变量，防止堆栈漫溢。

### 💡 费曼学习法深度推敲 (Feynman Technique Reflection)
> “用最直白普通的一句话，将这个困难的知识剖析给一个5岁孩童听：”
> 就像给小玩具堆积木。只要每个积木块上刻着只能塞进特定颜色的孔里（状态转移限缩），不管风怎么摇晃怎么玩，拼好后的城堡永远是一模一样的。

### 📝 实践案例转化计划
- [ ] 基于此资料完成一份本地核心原型库重构`;

const TEMPLATE_IMAGE_ANALYSIS = `### 📸 视觉构图与极境美学分析 (Visual Philosophy)
*   **核心构图流派**: [三分法则 / 向心引导线 / 极简留白]
*   **明暗调性与色彩配比**: [莫兰迪低饱和度 / 漫反射温暖金黄色调]
*   **第一视线落点 (Focal Point)**: 画面左侧延伸至地平线的独栋小木屋。

### ⚙️ 精细工艺相机参数 (Technical Exif Specification)
*   **机身透射**: Fujifilm GFX 100S
*   **透镜视场**: GF 45mm F2.8 Medium Format
*   **曝光三角参数**: f/5.6 | 1/125s | ISO 100 | EV -0.3

### 💭 画面故事与生命脉搏映射 (Spatial Resonance)
> 该作品不仅仅定格了瞬间的光影。其美学价值更在于，在整片被幽蓝寒雾统治的冬晨中，那抹透亮的红橘色灯光代表了人在旷野之中的一种不被寒冬妥协、温存而坚定的生息呼吸。`;

export default function WritePostModal({ onClose, onSavePost, onSaveMoment, accentClass }: WritePostModalProps) {
  const [type, setType] = useState<'post' | 'moment'>('post');

  // Blog states
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('日常随记');
  const [coverImage, setCoverImage] = useState(CONSTANT_COVERS[0].url);
  const [customCover, setCustomCover] = useState('');

  // Share Study Material States
  const [resName, setResName] = useState('');
  const [resLink, setResLink] = useState('');
  const [resPassword, setResPassword] = useState('');
  const [resSize, setResSize] = useState('');

  // Moment states
  const [momentContent, setMomentContent] = useState('');
  const [momentLocation, setMomentLocation] = useState('');
  const [momentMood, setMomentMood] = useState(MOODS[0]);
  const [momentImage, setMomentImage] = useState('');

  const [errorMsg, setErrorMsg] = useState('');

  // Submit hander
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (type === 'post') {
      if (!title.trim()) { return setErrorMsg('请输入博文标题'); }
      if (!summary.trim()) { return setErrorMsg('请输入博文摘要'); }
      if (!content.trim()) { return setErrorMsg('请输入正文内容'); }

      const finalCover = customCover.trim() || coverImage;

      const newPost: BlogPost = {
        id: 'post_' + Date.now(),
        title: title.trim(),
        summary: summary.trim(),
        content: content,
        category: category,
        coverImage: finalCover,
        publishDate: new Date().toISOString().split('T')[0],
        readTime: `${Math.max(1, Math.ceil(content.length / 450))} 分钟`,
        likes: 0,
        views: 1,
        comments: [],
        resourceLink: category === '学习资料' ? resLink.trim() || undefined : undefined,
        resourcePassword: category === '学习资料' ? resPassword.trim() || undefined : undefined,
        resourceSize: category === '学习资料' ? resSize.trim() || undefined : undefined,
        resourceName: category === '学习资料' ? resName.trim() || undefined : undefined,
      };

      onSavePost(newPost);
    } else {
      if (!momentContent.trim()) { return setErrorMsg('请写点此刻的心情吧'); }

      const newMoment: Moment = {
        id: 'moment_' + Date.now(),
        content: momentContent.trim(),
        image: momentImage.trim() || undefined,
        publishDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
        location: momentLocation.trim() || undefined,
        likes: 0,
        mood: momentMood
      };

      onSaveMoment(newMoment);
    }

    onClose();
  };

  const btnAccentMap: Record<string, string> = {
    emerald: 'bg-emerald-600 hover:bg-emerald-500',
    amber: 'bg-amber-600 hover:bg-amber-500',
    indigo: 'bg-indigo-600 hover:bg-indigo-500',
    cyan: 'bg-cyan-600 hover:bg-cyan-500',
    teal: 'bg-teal-600 hover:bg-teal-500',
  };

  const ringAccentMap: Record<string, string> = {
    emerald: 'focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/40',
    amber: 'focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/40',
    indigo: 'focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/40',
    cyan: 'focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/40',
    teal: 'focus:border-teal-500/80 focus:ring-1 focus:ring-teal-500/40',
  };

  const textAccentMap: Record<string, string> = {
    emerald: 'text-emerald-400',
    amber: 'text-amber-400',
    indigo: 'text-indigo-400',
    cyan: 'text-cyan-400',
    teal: 'text-teal-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="write-modal-title"
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] backdrop-blur-xl"
        id="write-modal-container"
      >
        {/* Header toolbar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950/40 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <Feather size={18} className={textAccentMap[accentClass]} />
            <h3 id="write-modal-title" className="font-bold text-white text-lg">开启新创作</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 transition rounded-full text-slate-400 hover:text-white"
            id="close-writer-btn-top"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-slate-950/20 border-b border-slate-800 shrink-0">
          <button
            onClick={() => { setType('post'); setErrorMsg(''); }}
            className={`flex-1 py-3 text-sm font-semibold transition flex items-center justify-center gap-2 border-b-2 ${
              type === 'post'
                ? 'text-white border-b-white'
                : 'text-slate-400 border-b-transparent hover:text-slate-200 hover:bg-slate-800/20'
            }`}
          >
            <FileText size={16} />
            深度博文 (Long-form Post)
          </button>
          <button
            onClick={() => { setType('moment'); setErrorMsg(''); }}
            className={`flex-1 py-3 text-sm font-semibold transition flex items-center justify-center gap-2 border-b-2 ${
              type === 'moment'
                ? 'text-white border-b-white'
                : 'text-slate-400 border-b-transparent hover:text-slate-200 hover:bg-slate-800/20'
            }`}
          >
            <Camera size={16} />
            片刻简评 (Micro-Moment)
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5" id="writer-form-body">
          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2.5 rounded-xl text-xs font-semibold">
              ⚠️ {errorMsg}
            </div>
          )}

          {type === 'post' ? (
            /* Blog Post Form items */
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">文章标题</label>
                <input
                  type="text"
                  placeholder="给您的创作起一个引人共鸣的标题..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full px-4 py-2.5 bg-slate-950/40 border border-slate-800 rounded-xl text-white text-sm focus:outline-none transition ${ringAccentMap[accentClass]}`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">文章分类</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950/40 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-slate-700 transition font-sans"
                  >
                    <option value="日常随记" className="bg-slate-900">日常随记 (Life Records)</option>
                    <option value="学习资料" className="bg-slate-900">学习资料 (Study Materials)</option>
                    <option value="图片分析" className="bg-slate-900">图片分析 (Image Analysis)</option>
                    <option value="成长思考" className="bg-slate-900">成长思考</option>
                    <option value="技术笔记" className="bg-slate-900">技术笔记</option>
                  </select>
                </div>
              </div>

              {/* Conditional Study Resource Attachment Form Section */}
              {category === '学习资料' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/20 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-indigo-500/10 pb-2">
                    <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                      <BookOpen size={13} className="text-indigo-400" />
                      学习资料/共享资源元属性设置 (Study Asset Metadata)
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        type="button"
                        onClick={() => {
                          setResName('【精选】2026年思想道德法治重点核心考点突破整理.docx');
                          setResLink('https://github.com/google/genai');
                          setResPassword('WORD99');
                          setResSize('3.5 MB (Word版)');
                        }}
                        className="text-[9px] text-blue-300 hover:text-white bg-blue-500/10 hover:bg-blue-600/20 px-2 py-0.5 rounded border border-blue-500/20 transition"
                      >
                        📄 Word版模板
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setResName('【答辩通用】高吞吐并行流系统学术课题汇报模板.pptx');
                          setResLink('https://github.com/google/genai');
                          setResPassword('PPTX8');
                          setResSize('12.8 MB (PowerPoint版)');
                        }}
                        className="text-[9px] text-orange-300 hover:text-white bg-orange-500/10 hover:bg-orange-600/20 px-2 py-0.5 rounded border border-orange-500/20 transition"
                      >
                        📊 PPT演示稿模板
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setResName('【唯美风景】晨曦阅览室法桐绿影治愈壁纸包.zip');
                          setResLink('https://github.com/google/genai');
                          setResPassword('WALL66');
                          setResSize('44.2 MB (高清风景合集)');
                        }}
                        className="text-[9px] text-emerald-300 hover:text-white bg-emerald-500/10 hover:bg-emerald-600/20 px-2 py-0.5 rounded border border-emerald-500/20 transition"
                      >
                        🌅 治愈自修风景
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block mb-1">资源显示名称 (e.g. 课件PDF/代码包)</span>
                      <input
                        type="text"
                        placeholder="例：React 18 心流架构全套指南"
                        value={resName}
                        onChange={(e) => setResName(e.target.value)}
                        className={`w-full px-3 py-1.5 bg-slate-950/40 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none transition ${ringAccentMap[accentClass]}`}
                      />
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-1">资源体积大小 / 类别详情</span>
                      <input
                        type="text"
                        placeholder="例：12.5 MB (PDF格式)"
                        value={resSize}
                        onChange={(e) => setResSize(e.target.value)}
                        className={`w-full px-3 py-1.5 bg-slate-950/40 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none transition ${ringAccentMap[accentClass]}`}
                      />
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-1">下载提取外链 (或网盘/GitHub链接)</span>
                      <input
                        type="text"
                        placeholder="例：https://pan.baidu.com/s/..."
                        value={resLink}
                        onChange={(e) => setResLink(e.target.value)}
                        className={`w-full px-3 py-1.5 bg-slate-950/40 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none transition ${ringAccentMap[accentClass]}`}
                      />
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-1">提取码 / 解密密码 (如果有)</span>
                      <input
                        type="text"
                        placeholder="例：MIT88 / 留空免密码"
                        value={resPassword}
                        onChange={(e) => setResPassword(e.target.value)}
                        className={`w-full px-3 py-1.5 bg-slate-950/40 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none transition ${ringAccentMap[accentClass]}`}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">摘要简评 (1~2句话)</label>
                <input
                  type="text"
                  placeholder="一句话提炼文章核心灵感，展示在博客首页卡片中"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className={`w-full px-4 py-2.5 bg-slate-950/40 border border-slate-800 rounded-xl text-white text-sm focus:outline-none transition ${ringAccentMap[accentClass]}`}
                />
              </div>

              {/* Landscape Preset Covers Gallery */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">选择风景封面 (Landscape Cover)</label>
                <div className="grid grid-cols-5 gap-2">
                  {CONSTANT_COVERS.map((cov) => (
                    <button
                      key={cov.url}
                      type="button"
                      onClick={() => { setCoverImage(cov.url); setCustomCover(''); }}
                      className={`relative aspect-video rounded-lg overflow-hidden border-2 transition ${
                        coverImage === cov.url && !customCover ? 'border-amber-400 scale-[1.03]' : 'border-slate-800 hover:border-slate-700'
                      }`}
                      title={cov.name}
                    >
                      <img src={cov.url} className="w-full h-full object-cover filter brightness-75" alt={cov.name} />
                      {coverImage === cov.url && !customCover && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Check size={16} className="text-amber-300 font-extrabold" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="mt-2.5 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-1">或自定大图 URL:</span>
                    <input
                      type="url"
                      placeholder="输入自定义的高清图片链接..."
                      value={customCover}
                      onChange={(e) => setCustomCover(e.target.value)}
                      className={`w-full px-3 py-2 bg-slate-950/40 border border-slate-800 rounded-lg text-slate-300 text-xs focus:outline-none transition ${ringAccentMap[accentClass]}`}
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-1">或本地上传拍摄的风景/学习照:</span>
                    <label className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-950/40 hover:bg-slate-800/40 border border-dashed border-slate-800 hover:border-slate-700 rounded-lg text-slate-300 hover:text-white cursor-pointer transition text-xs select-none h-[34px]">
                      <ImageIcon size={13} className="text-amber-400" />
                      <span className="truncate">{customCover.startsWith('data:image') ? '🟢 已成功载入本地大图' : '选择风景照片文件...'}</span>
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
                                setCustomCover(reader.result);
                                setCoverImage(reader.result);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-400 uppercase">正文内容 (支持 Markdown 风格排版)</label>
                  <span className="text-[10px] text-slate-500">
                    支持 ### 三级标题，&gt; 引用块，* 加粗，- 列表等
                  </span>
                </div>

                {/* Analytical Templates Blueprint Selector Button Row */}
                <div className="mb-3 p-3 bg-slate-950/40 rounded-2xl border border-slate-800/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-350 flex items-center gap-1.5 font-sans">
                      <Sparkles size={12} className="text-amber-400" />
                      快捷智能分析模板助推器:
                    </span>
                    <span className="text-[9px] text-slate-500 font-mono">点击一键载入标准的学术/行为大纲</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setContent(TEMPLATE_DAILY_LIFE);
                        setCategory('日常随记');
                        if(!title) setTitle('日常随记与能量行为剖析报告');
                        if(!summary) setSummary('通过时间维度与日常微观要素，深入理清真实行为轨迹。');
                      }}
                      className="px-2.5 py-1.5 rounded-xl text-[10px] font-semibold bg-slate-800 hover:bg-slate-700 hover:text-white transition cursor-pointer flex items-center gap-1 border border-white/5"
                    >
                      🔋 载入日常随记模板
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setContent(TEMPLATE_STUDY_MATERIAL);
                        setCategory('学习资料');
                        if(!title) setTitle('高质量学习资料剖析与核心概念知识树');
                        if(!summary) setSummary('基于多阶段逻辑推导与费曼机制，完美归纳核心知识体系。');
                      }}
                      className="px-2.5 py-1.5 rounded-xl text-[10px] font-semibold bg-slate-800 hover:bg-slate-700 hover:text-white transition cursor-pointer flex items-center gap-1 border border-white/5"
                    >
                      📚 载入学习资料脑图
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setContent(TEMPLATE_IMAGE_ANALYSIS);
                        setCategory('图片分析');
                        if(!title) setTitle('视觉图像美学深度剖析与相机Exif解读');
                        if(!summary) setSummary('数码机身技术镜头透射与经典画幅美感构图的综合评析。');
                      }}
                      className="px-2.5 py-1.5 rounded-xl text-[10px] font-semibold bg-slate-800 hover:bg-slate-700 hover:text-white transition cursor-pointer flex items-center gap-1 border border-white/5"
                    >
                      📸 载入图片美学大纲
                    </button>
                  </div>
                </div>

                <textarea
                  rows={9}
                  placeholder={`川西漫步，心境在群山中安顿...\n\n### 💡 空旷的旷野\n墨色的岩石在夕阳中金黄，让我倍感平静...\n\n> "风是山的呼吸，水是地的血液。"，这便是我最喜欢的话...`}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className={`w-full px-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl text-white text-sm focus:outline-none transition resize-none font-sans ${ringAccentMap[accentClass]}`}
                />
              </div>
            </div>
          ) : (
            /* Moment Post Form items */
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">此刻微言 (Thoughts)</label>
                <textarea
                  rows={5}
                  placeholder="分享你当下的闪念、一首喜欢的曲子或者是刚刚定格的风景..."
                  value={momentContent}
                  onChange={(e) => setMomentContent(e.target.value)}
                  className={`w-full px-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl text-white text-sm focus:outline-none transition resize-none ${ringAccentMap[accentClass]}`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">发布位置 (可选)</label>
                  <input
                    type="text"
                    placeholder="例如: 杭州 · 天目山路"
                    value={momentLocation}
                    onChange={(e) => setMomentLocation(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-950/40 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">今日心境 (Mood)</label>
                  <select
                    value={momentMood}
                    onChange={(e) => setMomentMood(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950/40 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-slate-750"
                  >
                    {MOODS.map(m => (
                      <option key={m} value={m} className="bg-slate-900">{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <ImageIcon size={14} className="text-slate-400" />
                    附图 (景致 / 学习大图配图)
                  </span>
                  <span className="text-[10px] text-slate-500">支持外链或本地直接上传</span>
                </label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-... (输入配图链接)"
                    value={momentImage}
                    onChange={(e) => setMomentImage(e.target.value)}
                    className={`w-full px-4 py-2.5 bg-slate-950/40 border border-slate-800 rounded-xl text-slate-300 text-xs focus:outline-none transition ${ringAccentMap[accentClass]}`}
                  />
                  <label className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-950/40 hover:bg-slate-800/40 border border-dashed border-slate-800 hover:border-slate-700/80 rounded-xl text-slate-300 hover:text-white cursor-pointer transition text-xs select-none h-[38px]">
                    <ImageIcon size={13} className="text-amber-400 font-extrabold" />
                    <span className="truncate">{momentImage.startsWith('data:image') ? '🟢 已成功载入本地风景' : '选择设备中的风景照片...'}</span>
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
                              setMomentImage(reader.result);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
                <span className="text-[10px] text-slate-500 mt-2 block">留空为纯内容。你可以选择风景文件将其上传，也可以复制粘贴网络的高清图片地址。</span>
              </div>
            </div>
          )}
        </form>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-slate-950/40 border-t border-slate-800 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 text-sm font-semibold rounded-xl text-slate-300 hover:text-white transition"
          >
            取消
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className={`px-6 py-2 rounded-xl text-sm font-bold shadow-md transition text-white ${btnAccentMap[accentClass] || 'bg-emerald-600'}`}
            id="publish-submit-btn"
          >
            发布上线
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
