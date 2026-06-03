import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Download,
  Search,
  Sliders,
  RefreshCw,
  Eye,
  Check,
  Award,
  Flame,
  Globe,
  Terminal,
  FileText,
  Image as ImageIcon,
  Compass,
  FolderPlus,
  ArrowUpRight,
  Info
} from 'lucide-react';
import { BackgroundTheme, BlogPost, Comment } from '../types';

interface WildernessCrawlerProps {
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
  onImportToCameraRoll?: (newPhoto: {
    id: string;
    themeId: string;
    themeName: string;
    imageUrl: string;
    exif: {
      camera: string;
      lens: string;
      focalLength: string;
      aperture: string;
      iso: number;
      ev: string;
      filmSimulation: string;
      time: string;
    };
  }) => void;
  onImportAsPost?: (newPost: BlogPost) => void;
}

interface TempCrawledImage {
  id: string;
  title: string;
  location: string;
  imageUrl: string;
  photographer: string;
  category: string;
  exif: {
    camera: string;
    lens: string;
    focalLength: string;
    aperture: string;
    iso: number;
    ev: string;
    filmSimulation: string;
    time: string;
  };
  narrative: string;
}

// Highly curated high-resolution landscape images pool representing "crawled" results
const CRAWL_DATABASE: TempCrawledImage[] = [
  {
    id: 'crawl-01',
    title: '阿勒泰森林的深冬回弹',
    location: '新疆阿勒泰 · 哈纳斯森林',
    imageUrl: 'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1200&q=80',
    photographer: 'Sven-Erik',
    category: '森林林木',
    exif: {
      camera: 'Sony Alpha 7R V',
      lens: 'FE 24-70mm F2.8 GM II',
      focalLength: '35mm',
      aperture: 'f/5.6',
      iso: 200,
      ev: '-0.3',
      filmSimulation: 'None (Sony Cine-4)',
      time: '08:45 AM'
    },
    narrative: '深冬时节，松杉林漫天盖满冰壳，轻盈寒雾从林隙渗出。在微弱阳光投射的低角度逆光中，大树反射出淡蓝色光芒，犹如冰裂纹水晶。'
  },
  {
    id: 'crawl-02',
    title: '南极圈冰川山脉巨型裂缝',
    location: '南极 · 帕尔默群岛',
    imageUrl: 'https://images.unsplash.com/photo-1482862549707-f63cb32c5fd9?auto=format&fit=crop&w=1200&q=80',
    photographer: 'Ales Krivec',
    category: '极地冰川',
    exif: {
      camera: 'Phase One XF IQ4',
      lens: 'Rodenstock 45mm F4.0',
      focalLength: '45mm (Medium Format)',
      aperture: 'f/8.0',
      iso: 50,
      ev: '0.0',
      filmSimulation: 'None (Phase One Trichromatic)',
      time: '14:20 PM'
    },
    narrative: '极寒水域的巨大幽蓝浮冰矗立在大洋边缘，冰体吸收红光并散射蓝色光谱，展现出让人叹为观止的折射靛蓝，那是数万年暴风雪重压之后的深邃。'
  },
  {
    id: 'crawl-03',
    title: '喜马拉雅金山重叠层峦',
    location: '西藏日喀则 · 喜马拉雅山脉',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    photographer: 'Benoit',
    category: '雪山绝壁',
    exif: {
      camera: 'Fujifilm GFX 100S',
      lens: 'GF 100-200mm F5.6 R LM OIS WR',
      focalLength: '160mm',
      aperture: 'f/11',
      iso: 100,
      ev: '-0.7',
      filmSimulation: 'Velvia (Vivid)',
      time: '06:15 AM'
    },
    narrative: '东方将晓，超过八千米的高耸峰峦犹如一柄寒铁巨剑刺穿夜幕。一缕曙光点燃雪顶上的千载玄冰，由炽红渐变为融金之色，山峦重峦叠嶂极富压迫感。'
  },
  {
    id: 'crawl-04',
    title: '挪威罗弗敦群岛寂静星洋',
    location: '挪威罗弗敦半岛 · 雷讷',
    imageUrl: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=1200&q=80',
    photographer: 'Vincent Ledvina',
    category: '星空极光',
    exif: {
      camera: 'Sony Alpha 1',
      lens: 'FE 14mm F1.8 GM Ultra-wide',
      focalLength: '14mm',
      aperture: 'f/2.0',
      iso: 3200,
      ev: '+1.3',
      filmSimulation: 'None (Sony S-Log3)',
      time: '01:30 AM'
    },
    narrative: '夜空中跳跃着翠绿色飘带的欧若拉（北极光）照彻被冰霜封起的渔船。玄武岩巨脊下，峡湾海水清澈如冰种翡翠，极光投影随着海浪上下轻漾。'
  },
  {
    id: 'crawl-05',
    title: '江南天目山通天翠林',
    location: '浙江临安 · 天目古松径',
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
    photographer: 'Bailey Zindel',
    category: '森林林木',
    exif: {
      camera: 'Fujifilm GFX 50S II',
      lens: 'GF 35-70mm F4.5-5.6 WR',
      focalLength: '50mm',
      aperture: 'f/4.5',
      iso: 400,
      ev: '+0.3',
      filmSimulation: 'Provia (Standard)',
      time: '06:50 AM'
    },
    narrative: '春风吹拂江南，细软的白雾笼着繁茂翠竹与参天古木。柔和的天光在密林枝叶间碎成万点浮金，充满了水墨画苍凉而温润的国风意境。'
  },
  {
    id: 'crawl-06',
    title: '巴塔哥尼亚托雷峰的风暴交织',
    location: '阿根廷 · 托雷峰 Peak',
    imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
    photographer: 'Dave',
    category: '雪山绝壁',
    exif: {
      camera: 'Nikon Z8',
      lens: 'NIKKOR Z 24-120mm f/4 S',
      focalLength: '70mm',
      aperture: 'f/6.3',
      iso: 160,
      ev: '-0.3',
      filmSimulation: 'None (Nikon Landscape)',
      time: '17:40 PM'
    },
    narrative: '狂暴的大西洋飓风将托雷峰顶笼上一顶白色的旗云帽子。冰冷的石质尖塔傲视风雪，山体在怒放的高积云衬托下冷峻不羁。'
  },
  {
    id: 'crawl-07',
    title: '加利福尼亚大苏尔峭壁海澜',
    location: '美国加州 · Big Sur Cliff',
    imageUrl: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=1200&q=80',
    photographer: 'Kalen',
    category: '海洋听涛',
    exif: {
      camera: 'Leica SL2-S',
      lens: 'Vario-Elmarit-SL 24-90mm f/2.8-4',
      focalLength: '24mm',
      aperture: 'f/4.0',
      iso: 100,
      ev: '+0.5',
      filmSimulation: 'None (Leica Classic)',
      time: '06:12 AM'
    },
    narrative: '暗蓝的海水猛烈撞击着满布红褐色多肉和苔藓的沿海黑巨礁。一层湿咸的海雾卷过高耸的水杉崖边，海涛低语在大气中扩散，非常治愈。'
  },
  {
    id: 'crawl-08',
    title: '川西折多山垭口猎猎彩幡',
    location: '四川甘孜 · 折多山垭口',
    imageUrl: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=1200&q=80',
    photographer: 'Liao',
    category: '雪山绝壁',
    exif: {
      camera: 'Hasselblad X2D 100C',
      lens: 'XCD 2.5/55V Medium Format',
      focalLength: '55mm',
      aperture: 'f/5.6',
      iso: 64,
      ev: '-0.3',
      filmSimulation: 'None (Hasselblad HNCS)',
      time: '11:15 AM'
    },
    narrative: '四千高山狂怒，风雪漫溢垭口。经幡的五色绸缎被狂风撕扯着呼啸作响，这是荒原藏家奉献给土地、狂澜与生命的真挚吟咏。'
  }
];

export default function WildernessCrawler({ currentTheme, style, onImportToCameraRoll, onImportAsPost }: WildernessCrawlerProps) {
  const [keyword, setKeyword] = useState('');
  const [selectedSource, setSelectedSource] = useState('unsplash-expedition');
  const [resolutionFilter, setResolutionFilter] = useState('4k'); // hd, 4k, 8k
  const [parallelThreads, setParallelThreads] = useState(4); // 2, 4, 8

  // Crawling process states
  const [isCrawling, setIsCrawling] = useState(false);
  const [progress, setProgress] = useState(0);
  const [crawlerLogs, setCrawlerLogs] = useState<string[]>([]);
  const [crawledResults, setCrawledResults] = useState<TempCrawledImage[]>([]);
  const [importedIds, setImportedIds] = useState<string[]>([]);
  const [postedIds, setPostedIds] = useState<string[]>([]);
  const [searchTriggered, setSearchTriggered] = useState(false);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll terminal logs
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [crawlerLogs]);

  // Simulated crawler logic
  const handleStartCrawl = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCrawling) return;

    setIsCrawling(true);
    setProgress(0);
    setSearchTriggered(true);
    setCrawledResults([]);
    setCrawlerLogs([
      `⚙️ [CRAWLER] Loading node request cluster with high-entropy pool...`,
      `📡 [DNS] Resolving image host nodes for ${selectedSource}...`,
    ]);

    const logTemplates = [
      `🔐 [SSL] Establishing handshake with securely crypted TLS key chain...`,
      `🕵️‍♂️ [HEADER] Forging random high-entropy HTTP headers (Safari/WebKit MacOS Mojave)...`,
      `⚡ [HTTP GET] Transmitting fetch request payload to scraping node...`,
      `💾 [STREAM] Recieving response HTML body: 1.84 MB raw payload parsed...`,
      `🧬 [DOM SECTOR] Identifying image nodes... Executing RegEx tree searching: '<img src="https://[^"]+"[^>]*>'`,
      `📦 [UNPACK] Found candidates matching parameters - Resolution Filter: >= ${resolutionFilter.toUpperCase()} ...`,
      `🎨 [METADATA EXIF] Reading raw Exif payload structures from TIFF headers...`,
      `🏆 [COMPLETED] Crawl process reached termination loop safe. Displaying imagery catalog.`
    ];

    let logIdx = 0;
    const totalSteps = logTemplates.length;
    
    // Progress interval
    const progressTimer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return p + 4;
      });
    }, 120);

    // Logs sequencing timer
    const sequenceTimer = setInterval(() => {
      if (logIdx < totalSteps) {
        setCrawlerLogs(prev => [...prev, `${new Date().toLocaleTimeString()} ${logTemplates[logIdx]}`]);
        logIdx++;
      } else {
        clearInterval(sequenceTimer);
        setIsCrawling(false);
        setProgress(100);
        
        // Populate results based on keyword or default beautiful list
        const key = keyword.trim().toLowerCase();
        let matched = CRAWL_DATABASE;
        
        if (key) {
          matched = CRAWL_DATABASE.filter(item => 
            item.title.toLowerCase().includes(key) ||
            item.location.toLowerCase().includes(key) ||
            item.category.toLowerCase().includes(key) ||
            item.narrative.toLowerCase().includes(key)
          );
          
          if (matched.length === 0) {
            // Fallback to provide content rather than blank, but tell them we fetched nearest alternatives
            matched = CRAWL_DATABASE.slice(0, 3);
            setCrawlerLogs(prev => [...prev, `⚠️ [WARN] Keyword '${keyword}' produced empty lookup. Auto-routing to top high-quality风光 collections for backup.`]);
          }
        }
        
        setCrawledResults(matched);
      }
    }, 380);
  };

  // Deep Integration 1: Save to Camera Roll
  const handleSaveToCameraRoll = (img: TempCrawledImage) => {
    try {
      // Load current roll from LS
      const savedRoll = JSON.parse(localStorage.getItem('vistablog_sandbox_roll') || '[]');
      
      const newPhotoObj = {
        id: `scraped-${img.id}-${Date.now()}`,
        themeId: 'scraped-lands',
        themeName: img.location,
        imageUrl: img.imageUrl,
        exif: img.exif
      };

      const updatedRoll = [newPhotoObj, ...savedRoll];
      localStorage.setItem('vistablog_sandbox_roll', JSON.stringify(updatedRoll));

      setImportedIds(prev => [...prev, img.id]);

      // Call sandbox callback to sync state instantly
      if (onImportToCameraRoll) {
        onImportToCameraRoll(newPhotoObj);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Deep Integration 2: Convert to New Blog Draft instantly
  const handleImportAsBlogPost = (img: TempCrawledImage) => {
    try {
      const postsLS = JSON.parse(localStorage.getItem('vistablog_posts') || '[]');
      
      const draftPost: BlogPost = {
        id: `crawled-draft-${Date.now()}`,
        title: `【极境探索】${img.title} 风光志`,
        summary: `这是一篇本站爬虫系统从极境网络自动析取的摄影纪实。聚焦于${img.location}这一神奇的秘境进行自然美学的剖析。`,
        content: `
### 🌲 极境探索生态：${img.location}
我们利用VistaBlog智能爬虫采集中心从优质摄影媒介成功获取了本张风光巨构并完成EXIF分析。

### 🏔️ 博文摄影故事描述：
${img.narrative}

---

### 📷 风光摄影EXIF数据记录：
*   **相机机身**: ${img.exif.camera}
*   **镜头焦段**: ${img.exif.lens} (${img.exif.focalLength})
*   **光圈快门**: ${img.exif.aperture} | ISO ${img.exif.iso} | 曝光补偿 ${img.exif.ev} EV
*   **胶片模拟**: ${img.exif.filmSimulation}
*   **探索时间**: ${img.exif.time}

这个作品不仅定格了极致冷艳的视角，更保留了属于自然原始脉搏的舒张。欢迎广大风景行旅在下方评论区发表关于本张图片的意境分享，或者在这里留下你漂流的思绪。
        `,
        category: '旅行摄影',
        coverImage: img.imageUrl,
        publishDate: new Date().toISOString().split('T')[0],
        readTime: '4 分钟',
        likes: 12,
        views: 65,
        pinned: false,
        comments: [
          {
            id: `cmt-sc-${Date.now()}`,
            author: 'VistaCrawler Bot',
            avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=BotCloud',
            content: `智能数据爬取线程于当地时间 ${new Date().toLocaleTimeString()} 自动导入此高能博文模板并完成EXIF元数据校对，欢迎博主二次精细校改！`,
            date: new Date().toISOString()
          }
        ]
      };

      const updatedPosts = [draftPost, ...postsLS];
      localStorage.setItem('vistablog_posts', JSON.stringify(updatedPosts));

      setPostedIds(prev => [...prev, img.id]);

      // Call callback to sync posts on home screen instantly if supplied
      if (onImportAsPost) {
        onImportAsPost(draftPost);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const activeColorHex = THEME_HEX_COLORS_CRAWL[currentTheme.id] || '#10b981';

  return (
    <div className="glass-panel p-6 rounded-3xl space-y-6" id="scenery-crawler-module">
      
      {/* Module Title */}
      <div className="flex justify-between items-center border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <Terminal size={17} className="text-indigo-400" />
          <div>
            <h4 className="text-sm font-semibold text-white font-['Noto_Serif_SC'] flex items-center gap-1.5">
              高精风光图片智能爬虫采集中心
              <span className="text-[10px] bg-indigo-500/10 text-indigo-350 px-1.5 py-0.5 rounded font-mono border border-indigo-500/15">
                CRAWLER ENGINE v2.5
              </span>
            </h4>
          </div>
        </div>
        <Globe size={15} style={{ color: activeColorHex, animationDuration: '30s' }} className="animate-spin" />
      </div>

      <p className="text-xs text-slate-350 leading-relaxed font-light">
        聚焦您输入的风光关键词，建立高维 HTTP 连接线程。从 Unsplash、Bing、Pexels 等极度摄影平台检索极境原野风光、获取嵌入式的元 Exif 指标，
        <span className="text-white hover:underline cursor-pointer"> 一一映射嵌入在相机轻胶卷及新文章草稿中</span>。
      </p>

      {/* CRAWL SETTING CONTROLLER FORM */}
      <form onSubmit={handleStartCrawl} className="bg-slate-950/40 border border-white/5 p-4 rounded-2xl gap-4 grid grid-cols-1 md:grid-cols-12 items-end">
        
        <div className="md:col-span-4 space-y-1.5">
          <label className="block text-[10px] text-slate-450 uppercase font-bold tracking-wider">风光搜索索引 (Keyword index)</label>
          <div className="relative">
            <input
              type="text"
              placeholder="例如: 冰岛, 川西, 雪山, 湖泊..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full bg-slate-900 border border-white/5 focus:border-white/15 px-3.5 pl-8 py-2 text-xs rounded-xl text-white outline-none font-medium"
            />
            <Search size={12} className="absolute left-2.5 top-3 text-slate-500" />
          </div>
        </div>

        <div className="md:col-span-3 space-y-1.5">
          <label className="block text-[10px] text-slate-450 uppercase font-bold tracking-wider">目标采集源 (Scraper Metasource)</label>
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="w-full bg-slate-900 border border-white/5 px-3.5 py-2 text-xs rounded-xl text-slate-300 outline-none cursor-pointer font-mono"
          >
            <option value="unsplash-expedition">📸 Unsplash Pro-Expedition</option>
            <option value="bing-scenic-api">🌐 Bing Scenic Daily Restful</option>
            <option value="nasa-earth-scraper">🌍 NASA Earth-Observing Scraper</option>
            <option value="pexels-cc-finder">🦁 Pexels Wilderness Collective</option>
          </select>
        </div>

        <div className="md:col-span-2 space-y-1.5">
          <label className="block text-[10px] text-slate-450 uppercase font-bold tracking-wider">过滤分辨率 (Filter Resolution)</label>
          <select
            value={resolutionFilter}
            onChange={(e) => setResolutionFilter(e.target.value)}
            className="w-full bg-slate-900 border border-white/5 px-3.5 py-2 text-xs rounded-xl text-slate-300 outline-none cursor-pointer font-mono"
          >
            <option value="hd">Full HD (1080P)</option>
            <option value="4k">Extreme 4K (Ultra)</option>
            <option value="8k">Cine 8K (Medium Format)</option>
          </select>
        </div>

        <div className="md:col-span-3">
          <button
            type="submit"
            disabled={isCrawling}
            className="w-full py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-505 disabled:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-950/20"
          >
            {isCrawling ? (
              <>
                <RefreshCw size={12} className="animate-spin" />
                <span>爬虫火力运行中...</span>
              </>
            ) : (
              <>
                <Download size={12} className="text-white" />
                <span>立即启动高精爬取</span>
              </>
            )}
          </button>
        </div>

      </form>

      {/* LIVE PROGRESS & LOG RUN TERMINAL */}
      {searchTriggered && (
        <div className="bg-slate-950 border border-white/5 rounded-2xl overflow-hidden shadow-2xl space-y-2">
          
          {/* Progress bar container */}
          <div className="bg-slate-900/50 px-4 py-2 border-b border-white/5 flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400 flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isCrawling ? 'bg-indigo-400 animate-ping' : 'bg-emerald-400'}`} />
              {isCrawling ? 'SCRA_THREAD_ACTIVE' : 'SCRA_THREAD_STANDBY'}
            </span>
            <span className="text-white font-bold">{progress}% completed</span>
          </div>
          
          {/* Active progress color-line */}
          <div className="w-full h-1 bg-slate-900">
            <motion.div 
              className="h-full bg-indigo-500 shadow-glow" 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'linear' }}
            />
          </div>

          {/* Terminal Console Logs */}
          <div className="h-[125px] overflow-y-auto p-3.5 space-y-1.5 font-mono text-[9.5px] text-slate-350 select-text bg-black/40">
            {crawlerLogs.map((log, index) => (
              <div key={index} className="leading-relaxed flex items-start gap-1">
                <span className="text-indigo-500 shrink-0 select-none">&gt;&gt;</span>
                <span>{log}</span>
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>

        </div>
      )}

      {/* GRID DISPLAY OF CRAWLED IMAGES - CRAWL CARDS WITH DIRECT INTEGRATIONS */}
      <AnimatePresence>
        {!isCrawling && crawledResults.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-bold tracking-widest pl-1 uppercase font-mono flex items-center gap-1.5">
                <ImageIcon size={11} />
                采集结果映射 ({crawledResults.length} 张高解析风光图载入)
              </span>
              <span className="text-[9px] text-slate-500 font-mono">CC-BY OUTSIDE SOURCES</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {crawledResults.map((img) => {
                const isImported = importedIds.includes(img.id);
                const isPosted = postedIds.includes(img.id);

                return (
                  <motion.div
                    key={img.id}
                    className="p-3 bg-slate-950/40 rounded-2xl border border-white/5 space-y-3 flex flex-col justify-between hover:bg-slate-950/60 hover:border-white/10 transition duration-300"
                  >
                    {/* Visual Photo Section wrapper */}
                    <div className="relative aspect-[16/10] bg-black/20 rounded-xl overflow-hidden border border-white/5 shrink-0 group">
                      <img
                        src={img.imageUrl}
                        alt={img.title}
                        className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Location floating pin */}
                      <span className="absolute bottom-2.5 left-2.5 px-2 py-1.5 rounded-lg bg-black/70 backdrop-blur-md border border-white/5 text-[9.5px] font-medium text-slate-200 select-none tracking-tight flex items-center gap-1">
                        <Compass size={10} className="text-indigo-400" />
                        {img.location}
                      </span>

                      {/* Exif summary metadata float right */}
                      <span className="absolute top-2.5 right-2.5 px-1.5 py-0.5 rounded font-mono text-[9px] text-amber-300 bg-black/80 backdrop-blur-md border border-amber-500/20 tracking-wider">
                        📸 {img.exif.camera.replace('Alpha ', 'A')}
                      </span>
                    </div>

                    {/* text narrative block */}
                    <div className="space-y-1 px-1">
                      <div className="flex justify-between items-baseline">
                        <h5 className="text-[12.5px] font-bold text-white font-['Noto_Serif_SC'] truncate pr-1">
                          {img.title}
                        </h5>
                        <span className="text-[9px] text-slate-500 font-mono shrink-0">作者: @{img.photographer}</span>
                      </div>
                      <p className="text-[10.5px] text-slate-400 font-light leading-relaxed line-clamp-2">
                        {img.narrative}
                      </p>
                    </div>

                    {/* EXIF parameters pill badge info */}
                    <div className="grid grid-cols-4 gap-1.5 px-1 text-center font-mono text-[9px] text-slate-400 bg-white/5 p-1.5 rounded-lg border border-white/5">
                      <div>
                        <span className="text-[7.5px] text-slate-550 block uppercase text-[8px]">焦距</span>
                        <span className="text-slate-200 font-bold">{img.exif.focalLength}</span>
                      </div>
                      <div>
                        <span className="text-[7.5px] text-slate-550 block uppercase text-[8px]">光圈</span>
                        <span className="text-slate-200 font-bold">{img.exif.aperture}</span>
                      </div>
                      <div>
                        <span className="text-[7.5px] text-slate-550 block uppercase text-[8px]">感光</span>
                        <span className="text-slate-200 font-bold">ISO {img.exif.iso}</span>
                      </div>
                      <div>
                        <span className="text-[7.5px] text-slate-550 block uppercase text-[8px]">时间</span>
                        <span className="text-indigo-450 font-bold">{img.exif.time}</span>
                      </div>
                    </div>

                    {/* Interactive Callback Tool Actions */}
                    <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[10.5px]">
                      
                      <button
                        onClick={() => handleSaveToCameraRoll(img)}
                        disabled={isImported}
                        className={`py-2 px-1 focus:ring-1 focus:ring-indigo-500 rounded-xl font-bold flex items-center justify-center gap-1 transition-all shrink-0 cursor-pointer ${
                          isImported 
                            ? 'bg-emerald-550/15 text-emerald-450 border border-emerald-550/20' 
                            : 'bg-indigo-500/10 hover:bg-indigo-500/15 text-indigo-350 border border-indigo-500/15'
                        }`}
                      >
                        {isImported ? (
                          <>
                            <Check size={11} className="text-emerald-450" />
                            <span>已导入我的轻胶卷</span>
                          </>
                        ) : (
                          <>
                            <FolderPlus size={11} className="text-indigo-400" />
                            <span>存入相机胶卷</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleImportAsBlogPost(img)}
                        disabled={isPosted}
                        className={`py-2 px-1 focus:ring-1 focus:ring-emerald-500 rounded-xl font-bold flex items-center justify-center gap-1 transition-all shrink-0 cursor-pointer ${
                          isPosted 
                            ? 'bg-emerald-550/15 text-emerald-405 border border-emerald-555/20' 
                            : 'bg-white/5 hover:bg-white/10 text-slate-250 border border-white/5'
                        }`}
                      >
                        {isPosted ? (
                          <>
                            <Check size={11} className="text-emerald-450" />
                            <span>已建立博文草稿</span>
                          </>
                        ) : (
                          <>
                            <ArrowUpRight size={11} className="text-slate-400" />
                            <span>一键生成博文草稿</span>
                          </>
                        )}
                      </button>

                    </div>

                  </motion.div>
                );
              })}
            </div>

            <div className="bg-slate-900/40 p-3 rounded-xl border border-white/5 flex gap-2 text-[10px] text-slate-400 leading-normal select-none">
              <Info size={14} className="text-indigo-400 shrink-0 mt-0.5" />
              <span>
                💡 <b>深层价值穿透：</b>点击「存入相机胶卷」，图片将实时添加至您的沙盘轻底片库中，您可以直接配合风景相机取景器进行印刷及 stamping 制作专属明信片；点击「生成博文草稿」，将在前台「深度博文」列表头部自动预留一篇高还原风光日志，供您尽情抒发心声。
              </span>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

const THEME_HEX_COLORS_CRAWL: Record<string, string> = {
  'forest-lake': '#10b981',
  'misty-mountain': '#f59e0b',
  'starry-peaks': '#6366f1',
  'sunrise-ocean': '#06b6d4',
  'winter-dawn': '#14b8a6'
};
