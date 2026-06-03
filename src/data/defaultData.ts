import { BackgroundTheme, BlogPost, Moment } from '../types';

export const BACKGROUND_THEMES: BackgroundTheme[] = [
  {
    id: 'forest-lake',
    name: '翡翠湖畔',
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&q=85',
    description: '静谧的晨雾中，远山倒映在碧绿的湖水中，绿意盎然。',
    photographer: 'Bailey Zindel',
    photographerUrl: 'https://unsplash.com/@baileyzindel',
    accentColor: 'emerald'
  },
  {
    id: 'misty-mountain',
    name: '雾锁秋峦',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=85',
    description: '云雾缭绕的山谷，潺潺的溪流与斑斓的秋树交相辉映。',
    photographer: 'Kalen Emsley',
    photographerUrl: 'https://unsplash.com/@kalenemsley',
    accentColor: 'amber'
  },
  {
    id: 'starry-peaks',
    name: '璀璨星岳',
    url: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=1920&q=85',
    description: '浩瀚夜空下，群星在巍峨的雪山之巅闪烁，银河如丝带般悬挂。',
    photographer: 'Vincent Ledvina',
    photographerUrl: 'https://unsplash.com/@vincentledvina',
    accentColor: 'indigo'
  },
  {
    id: 'sunrise-ocean',
    name: '暮色听涛',
    url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=1920&q=85',
    description: '暖洋洋的晨光漫过悬崖，椰树与无垠的海平面在潮声中苏醒。',
    photographer: 'Ishak Kacel',
    photographerUrl: 'https://unsplash.com/@ishakkacel',
    accentColor: 'cyan'
  },
  {
    id: 'winter-dawn',
    name: '极境冬雪',
    url: 'https://images.unsplash.com/photo-1482862549707-f63cb32c5fd9?auto=format&fit=crop&w=1920&q=85',
    description: '白雪皑皑的水杉林在冬日的粉色霞光中静静站立，绝尘脱俗。',
    photographer: 'Ales Krivec',
    photographerUrl: 'https://unsplash.com/@aleskrivec',
    accentColor: 'teal'
  }
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: '重返荒野：川西高原的秋日漫步与感悟',
    summary: '在这个一切都加速运转的时代，我背起行囊逃入山野。去川西不仅仅是一次摄影之旅，更是一次重新寻找内心微光的心灵修行。',
    content: `
在无数个被城市喧嚣填满的深夜，闭上眼，总能听到西风拂过松针的沙沙声。在这个十月，我终于下定决心，推迟所有非紧急的任务，独自踏上了前往川西高原的旅途。

### 📌 翻越折多山：高原的风与稀薄的空气
当越野车穿过折多山的垭口，海拔攀升至4298米，冷冽而纯净的空气瞬间灌入胸腔。山顶彩色的经幡在狂风中猎猎作响，它们承载着世世代代旅人的祈愿。那一瞬，稀薄的不仅仅是氧气，还有城市生活中堆积的繁琐与浮躁。在高原烈日与雪峰交织的白光中，时间仿佛失去了刻度。

### 🌲 墨石公园：荒凉星体与时光剪影
在八美镇，有一处神奇的灰色地质奇观——墨石公园。黑色的糜棱岩在微弱的秋阳中泛着金属的光泽，重峦叠嶂，像极了一处不属于地球的异域星球。我坐在一块突出的岩石上，看天空中的云影迅速划过山脊。在这个由地表漫长挤压与剥蚀而成的旷野中，“一日”与“万年”的界限变得模糊。

### 🌾 慢下来，倾听自然的频率
在一所藏式客栈的院子里，我点了一壶酥油茶，看着远处的贡嘎群峰从白亮逐渐染成金黄（日照金山），最后隐入神秘的苍蓝。

我的旅宿日志中写道：
> “风是山的呼吸，水是地的血液。在重返荒野的日子里，不需要思考‘如何输出生产力’，只需做一个贪婪的记录者，将落日的光影、云朵的变幻、溪流的吟唱原封不动地装入心房。我们在这个世界的大部分追逐都是身外之物，而当你双脚踩着泥土，面对千万年不动的圣洁雪峰，你需要的不过是一餐热饭，和一顶可以避风的帐篷。”

### 📷 结语
川西的秋天很短，就像我们生命中那些清醒而纯粹的瞬间。下山后，我会重新置身写字楼的冷光灯下，但我知道，只要闭上眼，那座被金光照亮的雪山将永远在我心底，静默伫立，提供源源不断的平静与勇气。
`,
    category: '旅行摄影',
    coverImage: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=1000&q=80',
    publishDate: '2026-05-18',
    readTime: '6 分钟',
    likes: 124,
    views: 890,
    pinned: true,
    comments: [
      {
        id: 'c1',
        author: '林深见鹿',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        content: '“风是山的呼吸，水是地的血液”这句写得太好了，看着图文，仿佛自己也置身那冰冷但炽热的空气中了。',
        date: '2026-05-19'
      },
      {
        id: 'c2',
        author: '极客行者',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        content: '墨石公园真的很震撼！非常棒的文字，最近正被bug折磨得焦头烂额，看完文字突然也想出去走走了。',
        date: '2026-05-20'
      }
    ]
  },
  {
    id: '2',
    title: '极简数字生活：我的信息“轻量化”实践指南',
    summary: '我们每天都在海量信息的洪流中沉浮，大脑被算法喂养，疲倦不堪。这是一份关于我如何在数字世界中夺回主权、过上专注生活的探索报告。',
    content: `
你是否也曾有过这样的体验：
- 每天清醒的第一天是摸手机，翻看没有意义的通知红点；
- 临睡前习惯性地刷短视频，一抬头已是次日两点，伴随而来的只有空虚和焦虑；
- 收藏夹里躺着数百篇“以后再看”的文章，却从未点开第二次。

我们活在一个信息极端过载的丰饶时代，但我们的大脑却依然停留在原始社会。如果不加筛选，我们的注意力将会被现代科技巨头的信息垃圾快速剥夺。以下是我近半年来践行的**信息轻量化三法**，它们极大地改善了我的心流状态与生活质量。

### 🧘‍♂️ 第一步：彻底整理数字入口（物理隔绝）
1. **手机桌面无Icon化**：只把最核心的应用（如日历、相机、备忘录）放在首页，其他娱乐和社交App一概隐藏在应用库中。每当想无意识点击时，增加这一下滑动和搜索的交互成本，能有效掐断多巴胺渴求。
2. **通知权限“零容忍”**：除了电话、必要的即时通讯软件，关闭所有推送、电商推荐和新闻通知。你应该是“主动去获取信息”的主人，而非“被信息敲门唤醒”的奴隶。
3. **彻底卸载那些让人感到成瘾而焦虑的娱乐系统**，取而代之的是纸质书、本地高保真乐曲。

### 📚 第二步：建立精细的“输入漏斗”（内容重构）
- **从推送源中解脱**：取消订阅所有贩卖焦虑的博主、浮躁的热点解读。
- **拥抱 RSS 订阅与深度播客**：把每日阅读的频率降下来，不再追逐“热乎的新闻”，转而阅读“经得起时间考验的专著或访谈”。
- **“周精读”计划**：每天不再浏览碎裂的卡片文章，周五下午集中花两个小时精读2-3篇长文，并用纸笔手写摘录，进行深加工。

### ✍️ 第三步：从被动摄入到主动输出（知识重构）
很多人的焦虑来源于“收藏而不用产生的隐性负债”。克服这一点的唯一方法就是**以写代阅**、**以做代学**。
每当阅读了一篇好的长文或思考了一个问题，强迫自己用一两百字总结，或者跟朋友讨论。在这个高度重构和表达的过程中，信息才真正内化成你生命里的见识。

### 🌱 见证改变
在坚持“轻量化数字生活”三个月后，我重新拥有了能够连续阅读文学专著两小时而不走神的能力。我的入睡效率显著提高，早上的神清气爽是任何昂贵保健品无法给予的。

> 你的注意力就是你一生的资产。在数字洪流里，学会闭关锁国，才能成就内心富饶的帝国。
`,
    category: '成长思考',
    coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1000&q=80',
    publishDate: '2026-04-25',
    readTime: '4 分钟',
    likes: 98,
    views: 450,
    comments: [
      {
        id: 'c3',
        author: '莫奈花园',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        content: '看完默默地把小红书和推特的通知给关机了，深有感触！收藏夹真的就是一种心智负担。',
        date: '2026-04-26'
      }
    ]
  },
  {
    id: '3',
    title: '代码中的美学：给前端开发者的感官设计法则',
    summary: '优秀的前端应该像一位优雅的建筑师或产品设计师，不仅仅去拼凑排版和控制逻辑，更要理解比例、流动性、对比度与隐形心理学。',
    content: `
作为一名前端开发者，我们常说“代码能够跑起来就行”。但是在当今这个交互体验至上的时代，代码只是基础，而在屏幕上呈现的视觉张力和流畅的细节，才是拉开“工程师”和“艺术家”距离的关键。

在这篇文章里，我们将通过几个感官设计法则，聊聊如何让网页“活起来”。

### 📐 1. 黄金比例与不均匀节奏感 (Aesthetic Variation)
很多时候我们习惯用一统的间距，比如所有地方都是 \`padding: 16px\`、\`margin: 16px\`。这种平盘设计在视觉上会让人感到呆板机械。
优秀的设计需要有“呼吸感”。
- **主次有别**：重要的卡片首发区域，应该拥有更充裕的留白。
- **动态比例**：大标题与正文之间应该遵循 1.5 - 1.618 倍的信息密度压缩，不仅要让眼球停留，更要有舒适的阅读动线。

### 🍃 2. 隐形动效：不抢戏的过渡 (Intentional Micro-interactions)
动效不是为了“炫技”，而是为了“引导认知”。
当用户将鼠标悬停在按钮上时，一个突兀的突变会破坏视神经的连贯性。我们可以使用渐变、微小的缩放，或者基于弹性物理规律的动画去实现。

例如在 React 中配合 Tailwind，可以通过非常质朴的贝塞尔曲线完成：
\`\`\`css
/* 舒适有层次的阴影与形变过渡 */
.interactive-card {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.interactive-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}
\`\`\`
这种微弹性的物理缓动能给用户极高的高级心理抚慰。

### 🌌 3. 玻璃态与光影穿透 (Glassmorphism & Depth)
就像这套博客系统一样，当我们不使用纯色的、死板的静态背景，而是投身于充满生命变幻的高清大自然风光时，内容层就需要一套优雅的“透度法则”。
- **毛玻璃效果 (Backdrop Filter)**：利用 Tailwind 的 \`backdrop-blur-md\` 结合半透明的白/黑色底层：\`bg-white/40\`。它既保留了背景风光的色泽透润，又让前景文字保持高抗干扰能力，字迹对比十分强烈。
- **自适应暗部投影**：在明亮背景卡片下，投影应该混入主背景的色相，而不是死黑。可以通过细微的混合色（如 \`shadow-emerald-900/10\`）使内容更加自然地融入环境。

### 🌟 总结
优秀的代码，在实现逻辑的同时，也应该在屏幕的物理像素世界中体现出对人类眼球的体贴。多关注那几毫秒的弹性波动，多抠下几个像素的对齐与留白，你的应用将自带呼吸。
`,
    category: '技术笔记',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80',
    publishDate: '2026-03-12',
    readTime: '5 分钟',
    likes: 156,
    views: 1205,
    comments: [
      {
        id: 'c4',
        author: '像素偏执狂',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
        content: '非常赞同！毛玻璃和不抢戏的微弹动效真的能瞬间提升质感，学到了！这个博客的背景切换做得极其顺滑。',
        date: '2026-03-13'
      }
    ]
  },
  {
    id: '4',
    title: '【高值分享】MIT 编译技术与高级算法树分析自研笔记归结',
    summary: '这是我结合 MIT OpenCourseWare 经典编译大纲以及 LR(1) 状态语法树的个人梳理笔记。内附高清拓扑分析图与 PDF 完整索引下载，供技术考研与高阶学习查阅。',
    content: `
在梳理现代编译原理算法的过程中，由于经典课本（如龙书、虎书）推导极其繁琐，很多人容易在第二章状态机构建和 LR 冲突处迷失。我将核心概念、知识树大纲与费曼白话叙说整理成了一份 15 页的精美手写复习大纲，希望能够助各位彻底吃透痛点。

### 🧩 核心认知框架与核心考点脑图
1. **LR(1) 语法树构建元理**:
   - 包含前瞻符的决策转移过程。利用转移矩阵避免死推导。
2. **三因子幂等性校验**:
   - 保证事件分发在有限编译状态内的重置安全性。
3. **抗冲突（Shift-Reduce / Reduce-Reduce）消解规范**:
   - 给定符号优先级列表，实现零解析歧义状态构建。

### 📚 精美复习资料说明
- **页数**: 共 15 页全彩矢量大图
- **文件包体积**: 14.8 MB (PDF 版本)
- **提取密码**: MIT2026

欢迎点击下方“前往下载”并输入对应的配发秘钥。若在学习中存在疑问，也可以随时在文章下方评论区提问！
`,
    category: '学习资料',
    coverImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1000&q=80',
    publishDate: '2026-06-03',
    readTime: '4 分钟',
    likes: 87,
    views: 412,
    comments: [
      {
        id: 'c-stud-1',
        author: '学无止境的小王',
        avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=wang',
        content: '天啊，这个提取码复制真的太体贴了！大图很清晰，正好下周大作业要用，万分感谢博主！',
        date: '2026-06-03'
      }
    ],
    resourceName: '【林间精选】MIT 编译自研笔记与状态语法树完整归结 (矢量PDF版).pdf',
    resourceSize: '14.8 MB (PDF格式)',
    resourceLink: 'https://github.com/google/genai',
    resourcePassword: 'MITCS'
  },
  {
    id: 'study-word-1',
    title: '【高分大沙龙】2026考研思想道德与法治(思修)核心背诵大纲.docx',
    summary: '由高分上岸学长整理的高分思修核心考点Word版，整理了全部重难点与历年高频真题考点，排版干净工整，支持Word本地直接下载打印默写。',
    content: `
为了方便各位同学在考前或复习阶段快速梳里考点，我将思政教育科目中“思想道德与法治”部分的考点重新规划整理成了一份 **Microsoft Word 文档格式** 的核心默写大纲。本大纲紧扣大纲逻辑，并排除了大段废话，均以单线条要点式呈现。

### 📊 文档核心亮点介绍
1. **多级目录逻辑树**: 对应教材核心八大章节，涵盖树根到分支结构。
2. **重点高燃红色标注**: 历届全网最高概率真题题眼已高亮。
3. **极简排版布局**: 已经过页面尺寸微调，可直接A4双面激光打印。

### 📁 共享资源属性
- **资源类型**: Microsoft Word格式核心文档 (.docx)
- **文档体积**: 3.6 MB (无损排版)
- **提取秘钥**: WORD26

欢迎点击下方“前往下载”地址获取提取通道！祝诸位一战成硕，心流飞扬！
`,
    category: '学习资料',
    coverImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1000&q=80',
    publishDate: '2026-06-03',
    readTime: '3 分钟',
    likes: 92,
    views: 310,
    comments: [],
    resourceName: '【林间笔记】2026考研思想教育及政治核心背诵模板(完美排版).docx',
    resourceSize: '3.6 MB (Word文档格式)',
    resourceLink: 'https://github.com/google/genai',
    resourcePassword: 'WORD'
  },
  {
    id: 'study-ppt-1',
    title: '【学术汇报】全套极简深色学术论文汇报/大作业汇报通用.pptx',
    summary: '一套精美沉稳的深色学术风Microsoft PPT汇报模板，内附完整的图表组合、科技结构图、物理运算公式排布与渐变缓动，期末满分答辩推荐。',
    content: `
在日常学术报告中，一个干净得体、排版专业的 PPT 往往能在第一瞬间赢得导师和答辩评委的心。我结合了多年参加学术研讨与系统汇报的经验，用精细的心流设计法则打磨了这款 **PowerPoint 演示文稿 (.pptx)**。

### 🎨 PPT 主题与美学风格
- **基调色彩**: 由经典太空煤炭黑与荧光靛蓝/翡翠绿相融合，高级质感呼之欲出。
- **页面框架**: 16:9 极清幻灯片，内嵌过渡页、团队介绍页、成果对比表和高科技逻辑流向图。
- **动效处理**: 页面间采用 0.3 秒顺滑淡出擦除 (Fade-through) 缓动。

### 📁 配发资源说明
- **资源类型**: 微软 Office PowerPoint 模板文件 (.pptx)
- **资料体积**: 12.4 MB (超大素材库)
- **解压密码**: PPTX8

点击下方“前往下载”按钮一键拉取。如果有任何学术格式排版的问题，欢迎随时在下方留言区讨论！
`,
    category: '学习资料',
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80',
    publishDate: '2026-06-02',
    readTime: '5 分钟',
    likes: 114,
    views: 520,
    comments: [
      {
        id: 'c-ppt-1',
        author: '算法小能手',
        avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=ppt',
        content: '太棒了博主！这个PPT排版完全踩在我的审美点上，下周课题组组会汇报直接套用！',
        date: '2026-06-02'
      }
    ],
    resourceName: '【林间学术】深色高分辨率通用答辩及组会汇报演示排版.pptx',
    resourceSize: '12.4 MB (PPTX演示文档)',
    resourceLink: 'https://github.com/google/genai',
    resourcePassword: 'PPTX'
  },
  {
    id: 'study-scenery-1',
    title: '【自习风景图片】阳光透过晨雾洒在复旦图书馆原木桌椅上的静心瞬间',
    summary: '这组高清风景照片承载了每天陪伴我备考的心流瞬间。50% 的学习资料并不仅仅是硬核文档，也来自温暖治愈的风景。附原图打包。',
    content: `
在备考的孤寂长旅中，能够让我的心态重置、心率下降的，除了定理的解通，就是清晨时分洒在原木学习桌上的第一缕光线。

### 🌅 风景照片蕴藏的力量
这组风景照片拍摄于大学城阅览室，窗外是摇曳的翠绿法桐，室内是静穆的手写香。这里空气中充满了书卷、墨水和咖啡烘焙的复合温暖。当你疲惫时，抬头看看窗外的云合，那也是一种生命的解压和学习。

为了造福各位备考的同学，我将这组图片发布为超高分辨率无损壁纸，并包含了一段 30 分钟在考研教室里收集的纯净无杂音环境白噪音（白书声、纸张翻阅声、偶有笔尖沙沙声）。

### 📁 风景画报资源
- **资源类型**: 静心自习室实景 4K 宽景壁纸 (.jpg / .png 无损合集)
- **资料体积**: 44.5 MB (高清矢量风景打包)
- **解密码**: SUN66

点击下方“前往下载”即可将这一抹治愈的晨光，保存到你自己的设备中。
`,
    category: '学习资料',
    coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1000&q=80',
    publishDate: '2026-06-03',
    readTime: '3 分钟',
    likes: 148,
    views: 630,
    comments: [],
    resourceName: '【学习风景】阅览室原木桌椅与林间晨曦治愈系电脑壁纸图集.zip',
    resourceSize: '44.5 MB (高清风景照片集)',
    resourceLink: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1920&q=85',
    resourcePassword: 'SUN6'
  },
  {
    id: 'study-scenery-2',
    title: '【自习风景图片】落日余晖落满校园树林与考研备用多维学习图库',
    summary: '傍晚自学结束时，正好看见橘红的晚霞温柔铺满一整排林荫小道。我用相机捕捉下了这段落日风景大图，附包含高清PNG分享链接。',
    content: `
这幅林间校园落日风景不仅是我每日复习的风景见证，更是大自然对每一位挑灯夜读者的无言犒赏。

### 🍂 光与荫的交响
当把数学题本合上，抬起发酸的脖子，正好看见巨大的夕阳缓慢滑落。天边被染成温柔的橙红与紫黛。我们既要埋头看满桌的 Word 与 PPT，也要抬头望一望这无边的原墅原野。

我将我在学校角角落落拍摄的十多张落日自习角、树荫卡座、古铜台灯等风景照片整合，裁剪成了 16:9 的桌面保护壁纸，希望给在微光中笃行的人们带去一份温暖与坚守。

### 📁 风景素材提取属性
- **资源类型**: 考研备考氛围日界风景图合集 (.png 格式)
- **包大小**: 25.8 MB (高清自习美图)
- **提取秘钥**: GLOW26

欢迎点击下方“前往下载”提取！我们在同一个落日校园里，并肩同行。
`,
    category: '学习资料',
    coverImage: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1000&q=80',
    publishDate: '2026-06-01',
    readTime: '4 分钟',
    likes: 125,
    views: 480,
    comments: [],
    resourceName: '【学习风景】夕阳晚霞射入图书馆与金光台灯高燃氛围图集.zip',
    resourceSize: '25.8 MB (风景照片压缩包)',
    resourceLink: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1920&q=85',
    resourcePassword: 'GLOW'
  },
  {
    id: '5',
    title: '日常碎片：在写字楼窗外捕捉的一抹暮色与自省',
    summary: '今日工作结束后，习惯性站在绿树荫外的窗台看天边。在写下十几行随记的同时，也对自己的时间和身体能效做了一次理性的自检。',
    content: `
### 📝 博主今日日常记录
*   **记录日期**: 2026-06-03
*   **今日心流评估**: 🔋 9/10 (非常充沛)
*   **生活关键词**: [平静, 费曼学习法, 原野漫步]

下午整理好了上周关于分布式大底座的复习重点，在心流极好的两小时里，顺带把这周的研究日志写成了卡片。临近傍晚时分，窗外的余晖斜照在书架上，那种橙金色的光圈，让我感觉身体和心跳在慢慢安稳下来。

### 💡 意识的反思与极简断舍离
这周我制定了“信息轻量化”的新一轮限额。在排除社交网站短信息高毒性轰炸后，脑海对逻辑定理的存留速度有了直观的高幅提升。看来，越是在碎片化丰饶的时代，做减法、做结构化沉淀，越能换来对自我的深层重塑。

希望每位路过我林间博客的朋友，在今晚关机后，也能到外面去深长呼吸，感受这无边的原野与秋峦。
`,
    category: '日常随记',
    coverImage: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=1000&q=80',
    publishDate: '2026-06-02',
    readTime: '3 分钟',
    likes: 54,
    views: 218,
    comments: []
  }
];

export const INITIAL_MOMENTS: Moment[] = [
  {
    id: 'm1',
    content: '今天上海迎来了难得的绝美晚霞，落日熔金，天空被染成了厚重的粉紫色。特意跑到顶楼，拍下了这抹在大都市森林中跳跃的温暖瞬间。祝各位今夜好梦 🌅✨',
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    publishDate: '2026-06-02 18:45',
    location: '上海 · 外滩中心陆家嘴',
    likes: 42,
    mood: '平静愉悦'
  },
  {
    id: 'm2',
    content: '终于把书架上买来一年多的《瓦尔登湖》读完了。卢梭在湖畔的寂然独处，那种对繁琐现代生活的主动退役，在这个信息爆炸的时代，依然是一记强力的清醒剂。有些书是需要等生活经历到了，才能真正看懂。',
    publishDate: '2026-05-30 22:15',
    location: '书斋 · 独处时光',
    likes: 31,
    mood: '思索中'
  },
  {
    id: 'm3',
    content: '清晨早起跑步，穿过落满梧桐叶的小道。空气里满是泥土和清晨露珠的咸湿味。带上耳机，随机播放一首民谣，那一刻我觉得自己正真切地活着、体验着这个世界。',
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&q=80',
    publishDate: '2026-05-25 07:30',
    location: '街角公园',
    likes: 56,
    mood: '活力满满'
  }
];
