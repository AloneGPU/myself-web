
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
  }
];

const MOCK_VIDEOS = [
  {
    id: 'video-1',
    title: '山间溪流',
    url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400',
    description: '清澈溪水流动',
    duration: '0:05'
  }
];

// 搜索图片 API
app.get('/api/images/search', (req, res) => {
  const { query = 'landscape', page = 1, limit = 10 } = req.query;
  
  // 简单关键词过滤
  let results = MOCK_IMAGES;
  if (query &amp;&amp; query !== 'landscape') {
    const q = query.toLowerCase();
    results = MOCK_IMAGES.filter(img =&gt; 
      img.description.toLowerCase().includes(q) ||
      img.location.toLowerCase().includes(q)
    );
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
app.get('/api/music/search', (req, res) =&gt; {
  const { query = 'nature', page = 1, limit = 10 } = req.query;
  
  let results = MOCK_MUSIC;
  if (query &amp;&amp; query !== 'nature') {
    const q = query.toLowerCase();
    results = MOCK_MUSIC.filter(music =&gt; 
      music.title.toLowerCase().includes(q) ||
      music.tags.some(tag =&gt; tag.toLowerCase().includes(q))
    );
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
app.get('/api/videos/search', (req, res) =&gt; {
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
app.get('/api/images/random', (req, res) =&gt; {
  const randomIndex = Math.floor(Math.random() * MOCK_IMAGES.length);
  res.json({
    success: true,
    data: MOCK_IMAGES[randomIndex]
  });
});

// 健康检查
app.get('/api/health', (req, res) =&gt; {
  res.json({
    success: true,
    message: 'VistaBlog Media API is running',
    timestamp: new Date().toISOString()
  });
});

// 错误处理
app.use((err, req, res, next) =&gt; {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 启动服务器
app.listen(PORT, () =&gt; {
  console.log(`\n🚀 VistaBlog Media API Server running at http://localhost:${PORT}`);
  console.log(`📚 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`\n📖 Available endpoints:`);
  console.log(`   GET /api/images/search - Search landscape images`);
  console.log(`   GET /api/images/random - Get random landscape`);
  console.log(`   GET /api/music/search - Search music tracks`);
  console.log(`   GET /api/videos/search - Search videos`);
  console.log(`   GET /api/health - Health check`);
  console.log(`\n💡 Pro tip: Add API keys in .env file for real Unsplash/Pixabay/Pexels access!`);
});

export default app;
