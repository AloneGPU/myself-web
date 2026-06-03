import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Zap,
  BookOpen,
  Image as ImageIcon,
  CheckCircle,
  Cpu,
  Bookmark,
  Share2,
  Maximize2,
  Flame,
  Activity,
  Award
} from 'lucide-react';
import { BlogPost, BackgroundTheme } from '../types';

interface AnalyticalWorkbenchProps {
  currentTheme: BackgroundTheme;
  style: {
    accentText: string;
    accentBg: string;
    accentBorder: string;
    accentBtn: string;
    accentGlow: string;
    badgeClass: string;
    colorName: string;
  };
  onImportAsPost: (newPost: BlogPost) => void;
}

const PRESET_IMAGES_FOR_ANALYSIS = [
  {
    name: '翡翠秋林 (Misty Autumn Reflection)',
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
    composition: '三分法引导 (Rule of Thirds) + 漫反射镜面对称',
    palette: '翡翠重绿、秋金落黄、晨光霜蓝 (High Contrast Natural)',
    story: '定格冷暖空气交替时的松针吐息，具有极高的空旷美感。',
    exif: { camera: 'Sony Alpha 7R V', lens: 'FE 24-70mm F2.8 GM II', ss: '1/160s', f: 'f/8.0', iso: 'ISO 100', ev: '-0.3' }
  },
  {
    name: '极境冬雪 (WinterDawn Birchwood)',
    url: 'https://images.unsplash.com/photo-1482862549707-f63cb32c5fd9?auto=format&fit=crop&w=800&q=80',
    composition: '放射引导线 (Radial Converging Points) + 框式构图',
    palette: '莫兰迪柔粉、冰川灰蓝、沉寂霜白 (Chilled Low Saturation)',
    story: '粉黛霞光透射过银装素裹的白桦林，纯净出尘，寂然安守。',
    exif: { camera: 'Fujifilm GFX 100S', lens: 'GF 32-64mm F4 R LM WR', ss: '1/80s', f: 'f/11', iso: 'ISO 160', ev: '0' }
  },
  {
    name: '落日金沙 (Sunset Shore Wave)',
    url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=800&q=80',
    composition: '黄金螺旋引导 (Golden Spiral) + 对角斜线纵深',
    palette: '暖阳赤金、深邃苍蓝、海沙微褐 (Complementary Warm-Cool contrast)',
    story: '潮头退却时，斜阳最后一缕烈金在极细海岸沙流中跳跃。',
    exif: { camera: 'Leica Q3', lens: 'Summilux 28mm F1.7 ASPH', ss: '1/500s', f: 'f/4.0', iso: 'ISO 200', ev: '-0.7' }
  }
];

export default function AnalyticalWorkbench({ currentTheme, style, onImportAsPost }: AnalyticalWorkbenchProps) {
  const [activeSubTab, setActiveSubTab] = useState<'life' | 'study' | 'image'>('life');
  const [reportResult, setReportResult] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);
  const [notification, setNotification] = useState<string>('');

  // --- STATE 1: Life Analyzer ---
  const [energyLevel, setEnergyLevel] = useState<number>(8);
  const [focusHours, setFocusHours] = useState<number>(5);
  const [digitalDistraction, setDigitalDistraction] = useState<number>(2); // 1-10
  const [lifeNotes, setLifeNotes] = useState<string>('');

  // --- STATE 2: Study Analyzer ---
  const [studyTopic, setStudyTopic] = useState<string>('');
  const [difficulty, setDifficulty] = useState<string>('中等 (Intermediate)');
  const [rawStudyDraft, setRawStudyDraft] = useState<string>('');

  // --- STATE 3: Image Analyzer ---
  const [selectedImage, setSelectedImage] = useState(PRESET_IMAGES_FOR_ANALYSIS[0]);
  const [customImageUrl, setCustomImageUrl] = useState<string>('');
  const [showAestheticGrid, setShowAestheticGrid] = useState<boolean>(true);

  // Trigger brief alert
  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 2500);
  };

  // --- HANDLER: Life Report Generator ---
  const handleGenerateLifeReport = () => {
    const score = Math.round((energyLevel * 1.2 + focusHours * 1.5 - digitalDistraction * 0.8) * 10) / 10;
    const finalScore = Math.max(1, Math.min(10, score));

    let diagnosticSummary = '';
    if (finalScore >= 8) {
      diagnosticSummary = '🏆 深度心流状态，注意保持水份，可以尝试进难度最高的研究课题。';
    } else if (finalScore >= 5) {
      diagnosticSummary = '✨ 处于稳定心智充能期。建议暂时放下细碎通知，深呼吸并开启小段专注。';
    } else {
      diagnosticSummary = '⚠️ 脑力能级进入黄昏枯竭层，存在明显数字信息中毒迹象。请立即到原野舒缓散步。';
    }

    const report = `### 🔋 每日生活能效与行为心智综判
*   **评测日期**: ${new Date().toLocaleDateString()}
*   **综合能效分值**: ⭐ ${finalScore} / 10分 (评级: ${finalScore >= 8 ? '高度充沛' : finalScore >= 5 ? '平稳状态' : '能级警告'})
*   **关键指标参数**: 身体素质能效 [${energyLevel}/10] | 有效专注时长 [${focusHours}小时] | 社交数字焦虑值 [${digitalDistraction}/10]

### 🔍 微观行为记录与内省
${lifeNotes.trim() ? lifeNotes.trim() : '未填写特定日常备忘。博主今日习惯良好，信息摄入平稳。'}

### 💡 专家级心智调整建议 (Cognitive Action Steps)
> ${diagnosticSummary}

- [ ] **行动阻力降低**: 顺延非紧迫任务，清空任务栏中多余的收藏夹负荷。
- [ ] **物理感官回归**: 远眺林木树冠或落叶溪流 20 分钟，释放额前叶压力。`;

    setReportResult(report);
    showNotification('日常能效剖析完成！已在下方渲染分析报告。');
  };

  // --- HANDLER: Study Material Organizer ---
  const handleGenerateStudyReport = () => {
    if (!studyTopic.trim()) {
      showNotification('请先输入至少一个学习资料主题。');
      return;
    }

    const report = `### 📚 核心知识树与学习资料整理：${studyTopic.trim()}
*   **资料主题/学科**: ${studyTopic.trim()}
*   **难易度划定级**: ${difficulty}
*   **整理录归日期**: ${new Date().toLocaleDateString()}

### 🧩 核心认知脑图与要素框架
1.  **最简前置定理 (Basics Axiom)**:
    - 确保系统在加载前具备隔离性，规避依赖交叉带来的死锁风险。
2.  **方法论运转机制 (Core Operational Paradigm)**:
    - ${rawStudyDraft.trim() ? rawStudyDraft.trim() : '核心技术要点一：通过结构化分层对知识细节进行分发，构建费曼卡片并重复温习巩固。'}
3.  **实践避坑指南 (Anti-patterns & Rules)**:
    - 大面积堆叠未内化的资料是没有产生实际效率增益的，应强迫采取“以输出代阅读”实践。

### 💡 通俗费曼解释法 (Feynman Conceptual Translation)
> “用最通俗易懂的简练大白话，将这个困难的知识解释给一个孩童听：”
> 就像给不同颜色的小球分配专门的彩色轨道。当球太多堵塞时，我们不应塞进更多球，而是应该在轨道口建立分流漏斗，依次通过，这样就不会发生混乱。

### 📝 实践落地进度指引 (Action Items)
- [ ] 针对 ${studyTopic.trim()} 核心难点进行一次无原稿阻力的费曼自述。
- [ ] 设计一个最简可玩案例 (Minimum Viable Prototype) 并同步至博客上。`;

    setReportResult(report);
    showNotification('学理资料结构化体系构建成功！已在下端输出报告。');
  };

  // --- HANDLER: Image Aesthetic Analyzer ---
  const handleGenerateImageReport = () => {
    const isCustom = customImageUrl.trim().length > 0;
    const currentImg = isCustom ? {
      name: '自定外链美学定格 (Custom Analyzed Canvas)',
      url: customImageUrl.trim(),
      composition: '交叉螺旋交界线 + 高阶动态黄金比例平衡',
      palette: '自适应对比度色彩、暗部冷调投影、亮部微光透色',
      story: '基于外部输入的高画质图片分析，呈现博主独特的对焦感官。',
      exif: { camera: 'Sony ILCE-7RM5', lens: 'FE 50mm F1.2 GM', ss: '1/250s', f: 'f/2.0', iso: 'ISO 100', ev: '-0.3' }
    } : selectedImage;

    const report = `### 📸 视觉美学与感官工艺评析：${currentImg.name}
*   **美学定格名称**: ${currentImg.name}
*   **图片视觉链接**: ${currentImg.url}

### 📐 构图美感与光感色阶分析 (Aesthetic Appraisal)
*   **骨架与构图流派**: ${currentImg.composition}
*   **色彩配比与影调律动**: ${currentImg.palette}
*   **第一视线聚焦落点**: 图像明暗焦点与对角线交互的几何重心地带。

### ⚙️ 相机内部工艺与透射 (Exif Specs)
*   **拍摄机身**: ${currentImg.exif.camera}
*   **视场透镜**: ${currentImg.exif.lens}
*   **曝光三角参数**: ${currentImg.exif.f} | ${currentImg.exif.ss} | ${currentImg.exif.iso} (曝光补偿: ${currentImg.exif.ev})

### 💭 画面故事叙事 (Visual Sentiment)
> ${currentImg.story} 每一颗像素都在为寂静叙述，使整个页面主旨相映，带来天然的高抗干扰专注感。`;

    setReportResult(report);
    showNotification('图像感官工艺与美学透射分析报告已生成。');
  };

  // --- ACTION: Copy analytical sheet ---
  const handleCopyClipboard = () => {
    if (!reportResult) return;
    navigator.clipboard.writeText(reportResult);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // --- ACTION: Import Report as blog post ---
  const handleImportAsBlogPost = () => {
    if (!reportResult) return;

    let importedTitle = '分析研究报告';
    let importedCategory = '日常随记';
    let importedSummary = '基于林间分析工作台自主生成的综合性结构剖析学理卡片。';
    let imgCover = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1000&q=80';

    if (activeSubTab === 'life') {
      importedTitle = `博主日常行为与心智状态全谱分析报告 (${new Date().toLocaleDateString()})`;
      importedCategory = '日常随记';
      importedSummary = '借助身体能效、专注深度及抗干扰参数，对生活节奏进行的量化与自省实践。';
      imgCover = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80';
    } else if (activeSubTab === 'study') {
      importedTitle = studyTopic ? `【学理体系】${studyTopic} 的核心认知结构与脑图归集` : '新归纳高价值学习资料索引与教学费曼模型';
      importedCategory = '学习资料';
      importedSummary = '运用分类索引树与费曼直觉翻译，对繁琐的前沿学习资料进行深度重组。';
      imgCover = 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80';
    } else if (activeSubTab === 'image') {
      const isCustom = customImageUrl.trim().length > 0;
      const currentImg = isCustom ? { name: '自选外网美学定格画布', url: customImageUrl.trim() } : selectedImage;
      importedTitle = `【图像美学】数码硬核工艺与 EXIF 参数透射分析：《${currentImg.name}》`;
      importedCategory = '图片分析';
      importedSummary = '深度剖析典型自然山川大图中黄金构图流派、色彩光谱与微观物理曝光。';
      imgCover = currentImg.url;
    }

    const newPost: BlogPost = {
      id: 'analysis_post_' + Date.now(),
      title: importedTitle,
      summary: importedSummary,
      content: reportResult,
      category: importedCategory,
      coverImage: imgCover,
      publishDate: new Date().toISOString().split('T')[0],
      readTime: '4 分钟',
      likes: 0,
      views: 1,
      comments: []
    };

    onImportAsPost(newPost);
    showNotification(`成功发布博文！分类为：[${importedCategory}]`);
  };

  return (
    <div className="glass-panel p-6 rounded-3xl space-y-5" id="analytical-workbench-panel">
      
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-300 animate-pulse">
            <Cpu size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-['Noto_Serif_SC'] flex items-center gap-1.5">
              林间智能研究分析工作台
              <span className="text-[10px] font-normal bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/20 font-mono">
                Studio V2.3
              </span>
            </h3>
            <p className="text-[11px] text-slate-350 mt-0.5">面向日常节奏、高维学习资料和图片美学进行量化梳理，一键引入博客文章</p>
          </div>
        </div>

        {/* Diagnostic notifications */}
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-[11px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/35 px-3 py-1 rounded-full flex items-center gap-1.5 self-start md:self-auto"
          >
            <CheckCircle size={11} />
            <span>{notification}</span>
          </motion.div>
        )}
      </div>

      {/* Internal Sub-Tabs Navigation */}
      <div className="flex items-center gap-2 bg-black/35 p-1 rounded-2xl border border-white/5 w-fit font-mono">
        <button
          type="button"
          onClick={() => { setActiveSubTab('life'); setReportResult(''); }}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
            activeSubTab === 'life'
              ? 'bg-white/10 text-white font-bold'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Activity size={13} />
          日常状态分析
        </button>
        <button
          type="button"
          onClick={() => { setActiveSubTab('study'); setReportResult(''); }}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
            activeSubTab === 'study'
              ? 'bg-white/10 text-white font-bold'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <BookOpen size={13} />
          学习资料重组
        </button>
        <button
          type="button"
          onClick={() => { setActiveSubTab('image'); setReportResult(''); }}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
            activeSubTab === 'image'
              ? 'bg-white/10 text-white font-bold'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <ImageIcon size={13} />
          图片美学透视
        </button>
      </div>

      {/* Tab Panels Contents */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Interactive Side Settings */}
        <div className="lg:col-span-5 bg-black/10 border border-white/5 p-5 rounded-2xl space-y-4">
          
          {/* LIFE TAB PANEL SETTING */}
          {activeSubTab === 'life' && (
            <div className="space-y-4 text-xs">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-450 flex items-center gap-1.5 mb-1">
                <Zap size={11} className="text-amber-400" />
                生活要素评测指标 (Life Quantifiers)
              </span>

              {/* Slider 1 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-slate-350">
                  <span>身体状态能级:</span>
                  <span className="font-semibold text-white">{energyLevel} / 10分</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={energyLevel}
                  onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: 'var(--accent-vibe-color)' }}
                />
              </div>

              {/* Slider 2 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-slate-350">
                  <span>无干扰专注深度时长:</span>
                  <span className="font-semibold text-white">{focusHours} 小时 / 日</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="12"
                  step="1"
                  value={focusHours}
                  onChange={(e) => setFocusHours(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: 'var(--accent-vibe-color)' }}
                />
              </div>

              {/* Slider 3 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-slate-350">
                  <span>数字生活多巴胺中毒度:</span>
                  <span className="font-semibold text-white">{digitalDistraction} / 10分</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={digitalDistraction}
                  onChange={(e) => setDigitalDistraction(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: 'var(--accent-vibe-color)' }}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-350 block">今日碎片行为及心理感悟 (内省日志):</label>
                <textarea
                  rows={4}
                  placeholder="例如: 连续看盘2小时感到头部太阳穴胀，下午彻底断网去小树林中奔跑了半里路，回来后极有心流..."
                  value={lifeNotes}
                  onChange={(e) => setLifeNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-950/40 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-slate-700 transition text-xs resize-none"
                />
              </div>

              <button
                type="button"
                onClick={handleGenerateLifeReport}
                className={`w-full py-2.5 rounded-xl font-bold text-xs select-none shadow hover:brightness-110 active:scale-98 transition flex items-center justify-center gap-1.5 text-white ${style.accentBtn}`}
              >
                <Activity size={13} />
                深度剖析日常能级报告
              </button>
            </div>
          )}

          {/* STUDY TAB PANEL SETTING */}
          {activeSubTab === 'study' && (
            <div className="space-y-4 text-xs">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-450 flex items-center gap-1.5 mb-1">
                <BookOpen size={11} className="text-indigo-400" />
                学术与专业学习资料体系梳理
              </span>

              <div className="space-y-1.5">
                <label className="text-slate-350 block">学习资料主题 (Theme Topics):</label>
                <input
                  type="text"
                  placeholder="例如: React 并行并发与渲染微调"
                  value={studyTopic}
                  onChange={(e) => setStudyTopic(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950/40 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-slate-700 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-350 block">资料学术深度 (Academic Depth):</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950/40 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-slate-700"
                >
                  <option value="入门级 (Elementary)">入门级 (Elementary)</option>
                  <option value="中等 (Intermediate)" className="bg-slate-900">中等 (Intermediate)</option>
                  <option value="高级与前沿探究 (Advanced Core)" className="bg-slate-900">高级与前沿探究 (Advanced Core)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-350 block">核心论域 / 技术点摘要备忘:</label>
                <textarea
                  rows={4}
                  placeholder="在这里输入零星的技术逻辑或草稿摘录，稍后我们将为您归结成费曼脑图大纲..."
                  value={rawStudyDraft}
                  onChange={(e) => setRawStudyDraft(e.target.value)}
                  className="w-full p-2.5 bg-slate-950/40 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-slate-700 transition text-xs resize-none"
                />
              </div>

              <button
                type="button"
                onClick={handleGenerateStudyReport}
                className={`w-full py-2.5 rounded-xl font-bold text-xs select-none shadow hover:brightness-110 active:scale-98 transition flex items-center justify-center gap-1.5 text-white ${style.accentBtn}`}
              >
                <Award size={13} />
                构建资料体系与归纳脑图
              </button>
            </div>
          )}

          {/* IMAGE TAB PANEL SETTING */}
          {activeSubTab === 'image' && (
            <div className="space-y-4 text-xs">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-450 flex items-center gap-1.5 mb-1">
                <ImageIcon size={11} className="text-cyan-400" />
                图像感官美学与相机物理性能
              </span>

              <div className="space-y-2">
                <label className="text-slate-350 block">选择待剖析的名家大图画布:</label>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_IMAGES_FOR_ANALYSIS.map((img, idx) => (
                    <button
                      key={img.name}
                      type="button"
                      onClick={() => { setSelectedImage(img); setCustomImageUrl(''); }}
                      className={`relative aspect-video rounded-lg overflow-hidden border-2 transition ${
                        selectedImage.name === img.name && !customImageUrl ? 'border-amber-400 scale-[1.03]' : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <img src={img.url} className="w-full h-full object-cover brightness-75" alt={img.name} />
                      <div className="absolute inset-x-0 bottom-0 bg-black/60 py-0.5 text-center text-[8px] text-slate-300 truncate px-1">
                        图 {idx + 1}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-slate-350 block">或输入自定大图 (支持粘贴外链或直接本地上传):</label>
                  {customImageUrl && (
                    <span className="text-[9px] bg-emerald-500/10 text-emerald-300 px-1.5 py-0.5 rounded-full border border-emerald-500/20 font-sans">
                      自定义配图已启用
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950/40 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-slate-700 text-xs text-ellipsis"
                  />
                  <label className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-950/40 hover:bg-slate-800/40 border border-dashed border-slate-800 hover:border-slate-700 rounded-xl text-slate-300 hover:text-white cursor-pointer transition text-xs select-none h-[38px] font-sans">
                    <ImageIcon size={13} className="text-amber-400 font-extrabold" />
                    <span className="truncate">{customImageUrl.startsWith('data:image') ? '🟢 已成功载入本地风景' : '选择本地风景/资料照...'}</span>
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
                              setCustomImageUrl(reader.result);
                              showNotification('📸 本地学习资料或风景大图加载成功！');
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-400">在画布中悬挂三分线格栅:</span>
                <button
                  type="button"
                  onClick={() => setShowAestheticGrid(!showAestheticGrid)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition ${
                    showAestheticGrid
                      ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      : 'bg-black/25 text-slate-450 border-white/5'
                  }`}
                >
                  {showAestheticGrid ? '开启格栅' : '已关闭'}
                </button>
              </div>

              <button
                type="button"
                onClick={handleGenerateImageReport}
                className={`w-full py-2.5 rounded-xl font-bold text-xs select-none shadow hover:brightness-110 active:scale-98 transition flex items-center justify-center gap-1.5 text-white ${style.accentBtn}`}
              >
                <Maximize2 size={13} />
                进行美学谱透视
              </button>
            </div>
          )}

        </div>

        {/* Right Smart Report Render Panel */}
        <div className="lg:col-span-7 bg-slate-950/30 border border-white/5 rounded-2xl p-5 flex flex-col justify-between min-h-[360px] relative">
          
          {/* IMAGE GRID PREVIEW COVERING IN REAL-TIME IF IMAGE TAB ACTIVE */}
          {activeSubTab === 'image' && (
            <div className="absolute top-4 right-4 z-20 w-32 md:w-36 aspect-video rounded-xl overflow-hidden border border-white/10 shadow-xl group">
              <div className="relative w-full h-full">
                <img
                  src={customImageUrl.trim() || selectedImage.url}
                  className="w-full h-full object-cover"
                  alt="preview"
                  referrerPolicy="no-referrer"
                />
                
                {/* Simulated aesthetic grid lines */}
                {showAestheticGrid && (
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                    <div className="border-r border-b border-white/35 border-dashed" />
                    <div className="border-r border-b border-white/35 border-dashed" />
                    <div className="border-b border-white/35 border-dashed" />
                    <div className="border-r border-b border-white/35 border-dashed" />
                    <div className="border-r border-b border-white/35 border-dashed" />
                    <div className="border-b border-white/35 border-dashed" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Report Body */}
          <div className="flex-1 overflow-y-auto max-h-[300px] mb-4 pr-1 font-mono text-[11px] leading-relaxed text-slate-300">
            {reportResult ? (
              <div className="space-y-4 whitespace-pre-wrap select-text markdown-body">
                {reportResult}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3.5 py-12">
                <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-slate-500 animate-pulse">
                  <Bookmark size={24} />
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-slate-400">目前暂无诊断数据输出</p>
                  <p className="text-[10px] text-slate-500 max-w-[280px]">
                    请在左侧设置好参数后，点击大按钮。智能分析引擎将在此为您建立专业的评估档案。
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Interactive Actions */}
          <div className="pt-3 border-t border-white/5 flex items-center justify-between flex-wrap gap-2">
            <span className="text-[10px] text-slate-500 flex items-center gap-1">
              <Flame size={12} className="text-amber-500" />
              分析完成后，可一键将该报告正式发布成一篇博文。
            </span>

            {/* Quick buttons */}
            {reportResult && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyClipboard}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-[11px] font-semibold transition cursor-pointer flex items-center gap-1"
                >
                  <Share2 size={12} />
                  {isCopied ? '已复制！' : '复制Markdown'}
                </button>
                <button
                  type="button"
                  onClick={handleImportAsBlogPost}
                  className={`px-4 py-1.5 rounded-xl text-[11px] font-bold text-white shadow select-none flex items-center gap-1 group cursor-pointer ${style.accentBtn}`}
                >
                  <Sparkles size={11} className="group-hover:rotate-12 transition duration-300" />
                  一键发表上线
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
