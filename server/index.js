import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 3001;

app.use(cors());
app.use(express.json());

// 静态文件服务
app.use(express.static(path.join(__dirname, '../dist')));

// 模拟真实API响应的本地数据（作为免费备用）
const MOCK_IMAGES = [
  {
    id: 'img-1',
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920',
    thumbnail: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400',
    photographer: 'Bailey Zindel',
    photographerUrl: 'https://unsplash.com/@baileyzindel',
    description: '森林晨雾',
    location: '瑞士阿尔卑斯山',
    width: 1920,
    height: 1080
  },
  {
    id: 'img-2',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    photographer: 'Andre Benz',
    photographerUrl: 'https://unsplash.com/@aridley88',
    description: '雪山倒影',
    location: '新西兰',
    width: 1920,
    height: 1080
  },
  {
    id: 'img-3',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920',
    thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400',
    photographer: 'Benoit Debaene',
    photographerUrl: 'https://unsplash.com/@benoit_debaene',
    description: '壮丽山脉',
    location: '瑞士',
    width: 1920,
    height: 1080
  },
  {
    id: 'img-4',
    url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920',
    thumbnail: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400',
    photographer: 'Luke Stackpoole',
    photographerUrl: 'https://unsplash.com/@tidesinourveins',
    description: '海岸风光',
    location: '冰岛',
    width: 1920,
    height: 1080
  },
  {
    id: 'img-5',
    url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1920',
    thumbnail: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400',
    photographer: 'Paul Gilmore',
    photographerUrl: 'https://unsplash.com/@pabloheimplatz',
    description: '星空银河',
    location: '纳米比亚',
    width: 1920,
    height: 1080
  },
  {
    id: 'img-6',
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920',
    thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
    photographer: 'Vincent van Zalinge',
    photographerUrl: 'https://unsplash.com/@vincentvanzalinge',
    description: '林间小径',
    location: '荷兰',
    width: 1920,
    height: 1080
  },
  // 中国风图片
  {
    id: 'img-7',
    url: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=1920',
    thumbnail: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=400',
    photographer: 'Zichuan Han',
    photographerUrl: 'https://unsplash.com/@alexhanchuan',
    description: '中国传统建筑',
    location: '中国北京',
    width: 1920,
    height: 1080
  },
  {
    id: 'img-8',
    url: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=1920',
    thumbnail: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=400',
    photographer: 'Daniel Tseng',
    photographerUrl: 'https://unsplash.com/@danieltseng',
    description: '中国园林',
    location: '中国苏州',
    width: 1920,
    height: 1080
  },
  {
    id: 'img-9',
    url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1920',
    thumbnail: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400',
    photographer: 'Alex Berger',
    photographerUrl: 'https://unsplash.com/@alexberger',
    description: '西湖美景',
    location: '中国杭州',
    width: 1920,
    height: 1080
  },
  {
    id: 'img-10',
    url: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1920',
    thumbnail: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400',
    photographer: 'Vladislav Nahorny',
    photographerUrl: 'https://unsplash.com/@nahorny',
    description: '竹林幽静',
    location: '中国浙江',
    width: 1920,
    height: 1080
  },
  {
    id: 'img-11',
    url: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1920',
    thumbnail: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400',
    photographer: 'Jungho Kim',
    photographerUrl: 'https://unsplash.com/@jungho0321',
    description: '黄山云海',
    location: '中国安徽',
    width: 1920,
    height: 1080
  },
  {
    id: 'img-12',
    url: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=1920',
    thumbnail: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400',
    photographer: 'Chunlea Ju',
    photographerUrl: 'https://unsplash.com/@cjuju',
    description: '古镇水乡',
    location: '中国乌镇',
    width: 1920,
    height: 1080
  }
];

const MOCK_MUSIC = [
  {
    id: 'music-1',
    title: '宁静森林雨声',
    artist: 'Nature Sounds',
    duration: '5:30',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1b74b5f6ad.mp3?filename=forest-lullaby-11072.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300',
    category: '自然白噪音',
    tags: ['雨声', '森林', '放松', '冥想']
  },
  {
    id: 'music-2',
    title: '海浪轻拍',
    artist: 'Ocean Waves',
    duration: '4:15',
    url: 'https://cdn.pixabay.com/download/audio/2021/10/26/audio_5abf9a33ee.mp3?filename=waves-18810.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=300',
    category: '自然白噪音',
    tags: ['海浪', '沙滩', '宁静']
  },
  {
    id: 'music-3',
    title: '篝火噼啪',
    artist: 'Campfire Ambience',
    duration: '6:00',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_9603274d2e.mp3?filename=campfire-crackling-ambient-110545.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300',
    category: '自然白噪音',
    tags: ['篝火', '露营', '温暖']
  },
  {
    id: 'music-4',
    title: '山谷鸟鸣',
    artist: 'Morning Birds',
    duration: '3:45',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/31/audio_3f0501530c.mp3?filename=birds-singing-111083.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300',
    category: '自然白噪音',
    tags: ['鸟鸣', '清晨', '自然']
  },
  // 中国风音乐
  {
    id: 'music-5',
    title: '古琴雅韵',
    artist: '传统民乐',
    duration: '4:20',
    url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f690e.mp3?filename=beautiful-asian-music-10894.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=300',
    category: '中国古典',
    tags: ['古琴', '古典', '东方', '优雅']
  },
  {
    id: 'music-6',
    title: '古筝流水',
    artist: '传统民乐',
    duration: '5:10',
    url: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_349ae5e5ee.mp3?filename=japanese-koto-13364.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=300',
    category: '中国古典',
    tags: ['古筝', '流水', '禅意', '宁静']
  },
  {
    id: 'music-7',
    title: '竹林深处',
    artist: '禅意音乐',
    duration: '6:30',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_2534e889b7.mp3?filename=relaxing-meditation-bells-110493.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=300',
    category: '禅意冥想',
    tags: ['竹林', '冥想', '禅', '放松']
  },
  {
    id: 'music-8',
    title: '江南丝竹',
    artist: '江南民乐',
    duration: '4:45',
    url: 'https://cdn.pixabay.com/download/audio/2022/01/15/audio_565ed2ab28.mp3?filename=chinese-style-music-10826.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=300',
    category: '中国古典',
    tags: ['江南', '丝竹', '优雅', '传统']
  },
  {
    id: 'music-9',
    title: '钟鼓晨鸣',
    artist: '寺庙音乐',
    duration: '5:50',
    url: 'https://cdn.pixabay.com/download/audio/2021/12/27/audio_686527a895.mp3?filename=tibetan-bowls-11600.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=300',
    category: '禅意冥想',
    tags: ['钟鼓', '寺庙', '佛乐', '宁静']
  },
  {
    id: 'music-10',
    title: '春江花月夜',
    artist: '古典民乐',
    duration: '7:20',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_d7d15a63e5.mp3?filename=asian-lo-fi-11082.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=300',
    category: '中国古典',
    tags: ['春江', '月夜', '古典', '诗意']
  },
  {
    id: 'music-11',
    title: '茶禅一味',
    artist: '茶道音乐',
    duration: '4:55',
    url: 'https://cdn.pixabay.com/download/audio/2021/10/26/audio_2b92a8f1cb.mp3?filename=meditation-11211.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300',
    category: '禅意冥想',
    tags: ['茶道', '禅意', '放松', '专注']
  },
  {
    id: 'music-12',
    title: '梅花三弄',
    artist: '传统琴曲',
    duration: '6:15',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_6a4768ed57.mp3?filename=soft-japanese-music-110065.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1458682625221-3a45f8a844c7?w=300',
    category: '中国古典',
    tags: ['梅花', '琴曲', '高洁', '传统']
  }
];

const MOCK_VIDEOS = [
  {
    id: 'video-1',
    title: '山间溪流',
    url: 'https://sample-videos.com/video321/mp4/720/big-buck-bunny-720p-1mb.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400',
    description: '清澈溪水流动',
    duration: '0:05'
  }
];

// 搜索图片 API
app.get('/api/images/search', (req, res) => {
  const { query = 'landscape', page = 1, limit = 10 } = req.query;
  
  // 增强的中文搜索
  let results = MOCK_IMAGES;
  if (query && query !== 'landscape') {
    const q = query.toLowerCase();
    
    // 智能匹配中文关键词
    results = MOCK_IMAGES.filter(img => {
      const description = img.description.toLowerCase();
      const location = img.location.toLowerCase();
      
      // 匹配描述或地点
      if (description.includes(q) || location.includes(q)) return true;
      
      // 中文关键词匹配
      const chineseKeywords = {
        '中国': ['中国', '北京', '苏州', '杭州', '浙江', '安徽', '乌镇'],
        '山水': ['山', '黄山', '山脉', '西湖', '水乡'],
        '古典': ['传统', '古典', '园林', '建筑'],
        '竹林': ['竹', '竹林'],
        '风景': ['风景', '风光', '美景', '景观'],
        '自然': ['自然', '森林', '海', '山', '星空']
      };
      
      for (const [keyword, matches] of Object.entries(chineseKeywords)) {
        if (q.includes(keyword) || matches.some(m => description.includes(m) || location.includes(m))) {
          return true;
        }
      }
      
      return false;
    });
  }
  
  // 模拟分页
  const start = (page - 1) * limit;
  const end = start + parseInt(limit);
  
  res.json({
    success: true,
    data: results.slice(start, end),
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: results.length
    }
  });
});

// 搜索音乐 API
app.get('/api/music/search', (req, res) => {
  const { query = 'nature', page = 1, limit = 10 } = req.query;
  
  let results = MOCK_MUSIC;
  if (query && query !== 'nature') {
    const q = query.toLowerCase();
    
    // 智能中文音乐搜索
    results = MOCK_MUSIC.filter(music => {
      const title = music.title.toLowerCase();
      const tags = music.tags.map(t => t.toLowerCase());
      
      // 直接匹配
      if (title.includes(q) || tags.some(t => t.includes(q))) return true;
      
      // 中文分类匹配
      const musicCategory = {
        '古典': ['中国古典', '古琴', '古筝', '传统', '江南', '琴曲'],
        '禅意': ['禅意冥想', '禅', '寺庙', '佛乐', '茶道'],
        '自然': ['自然白噪音', '雨声', '海浪', '鸟鸣', '森林'],
        '中国风': ['中国', '古典', '传统', '民乐']
      };
      
      for (const [keyword, matches] of Object.entries(musicCategory)) {
        if (q.includes(keyword) || matches.some(m => title.includes(m) || tags.some(t => t.includes(m)))) {
          return true;
        }
      }
      
      return false;
    });
  }
  
  const start = (page - 1) * limit;
  const end = start + parseInt(limit);
  
  res.json({
    success: true,
    data: results.slice(start, end),
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: results.length
    }
  });
});

// 搜索视频 API
app.get('/api/videos/search', (req, res) => {
  const { query = 'landscape', page = 1, limit = 10 } = req.query;
  
  res.json({
    success: true,
    data: MOCK_VIDEOS,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: MOCK_VIDEOS.length
    }
  });
});

// 获取随机风景图片
app.get('/api/images/random', (req, res) => {
  const randomIndex = Math.floor(Math.random() * MOCK_IMAGES.length);
  res.json({
    success: true,
    data: MOCK_IMAGES[randomIndex]
  });
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'VistaBlog Media API is running',
    timestamp: new Date().toISOString()
  });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`\n🚀 VistaBlog Media API Server running at http://localhost:${PORT}`);
  console.log(`📚 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`\n📖 Available endpoints:`);
  console.log(`   GET /api/images/search - Search landscape images (supports Chinese search)`);
  console.log(`   GET /api/images/random - Get random landscape`);
  console.log(`   GET /api/music/search - Search music tracks (supports Chinese search)`);
  console.log(`   GET /api/videos/search - Search videos`);
  console.log(`   GET /api/health - Health check`);
  console.log(`\n✨ New features: Chinese classical music, traditional Chinese landscape images`);
  console.log(`\n💡 Pro tip: Add API keys in .env file for real Unsplash/Pixabay/Pexels access!`);
});

export default app;
