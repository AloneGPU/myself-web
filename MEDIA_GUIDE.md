# VistaBlog 媒体资源中心使用指南

## 📝 功能概述

我们为VistaBlog添加了专业的**媒体资源中心**，支持：

1. 🖼️ **高质量风景图片搜索** - 来自Unsplash、Pixabay等免费图库
2. 🎵 **白噪音/背景音乐** - 雨声、海浪声、鸟鸣等助眠白噪音
3. 📹 **动态背景视频** - 自然风光视频作为页面背景
4. 📥 **一键设为背景/下载** - 直接将喜欢的图片设为博客背景

**重要提示**：我们使用合法的免费API，**不进行任何侵权爬虫**，所有资源都遵循CC0/Unsplash协议。

---

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动应用（同时启动前端和后端）

```bash
npm start
```

或者分开启动：

```bash
# 终端1：启动后端API服务器
npm run server

# 终端2：启动前端开发服务器
npm run dev
```

### 3. 访问应用

- 前端：http://localhost:3000
- 后端API：http://localhost:3001/api

---

## 🎯 使用方法

### 在博客中使用媒体资源

1. 点击导航栏的 **"荒野沙盘"** 标签
2. 向下滚动找到 **"媒体资源中心"**
3. 在标签页间切换：
   - **风景图片** - 浏览高清风景照片
   - **动态视频** - 查看自然景观视频
   - **背景音乐** - 收听白噪音和助眠音乐

### 主要功能

#### 👉 设为背景
- 点击图片卡片上的 **"设为背景"** 按钮
- 图片将立即成为博客的动态背景

#### 👉 下载资源
- 点击下载按钮保存资源到本地

#### 👉 播放音乐/视频
- 在媒体播放器中预览内容

---

## 🔧 配置说明（可选）

如果想要获取更丰富的真实API资源，你可以：

1. 复制 `.env.example` 为 `.env`
2. 申请免费的API密钥并填入：

```bash
cp .env.example .env
```

### 获取免费API密钥

| 服务 | 获取地址 | 免费额度 |
|------|---------|---------|
| Unsplash | https://unsplash.com/developers | 50次/小时 |
| Pixabay | https://pixabay.com/service/about/api/ | 无限 |
| Pexels | https://www.pexels.com/api/ | 200次/小时 |

---

## 📁 新增文件结构

```
/workspace
├── server/
│   └── index.js          # 后端API服务器
├── src/
│   ├── components/
│   │   ├── MediaCrawler.tsx  # 媒体资源浏览器
│   │   └── MediaPlayer.tsx   # 媒体播放器
│   ├── lib/
│   │   └── api.js          # API客户端
│   └── types.ts          # 类型定义更新
├── .env.example          # 环境变量示例
└── MEDIA_GUIDE.md        # (本文件)
```

---

## 🎨 界面预览

### 媒体资源中心
- 三个分类标签：图片、视频、音乐
- 搜索功能：支持关键词搜索
- 收藏功能：将喜欢的资源加入收藏
- 缩略图预览，悬停显示详情

### 媒体播放器
- 全屏体验
- 播放/暂停控制
- 音量调节
- 进度条拖拽
- 视频/音频/图片三种模式

---

## 💡 开发者提示

### API接口文档

```
GET /api/health              - 健康检查
GET /api/images/search      - 搜索图片
GET /api/images/random      - 随机图片
GET /api/music/search       - 搜索音乐
GET /api/videos/search      - 搜索视频
```

### 扩展真实API

要集成真实的Unsplash/Pixabay API，修改 `server/index.js` 文件：

```javascript
// 示例：真实API集成代码
app.get('/api/images/search', async (req, res) => {
  // 使用真实API替换MOCK_IMAGES
});
```

---

## ⚖️ 版权声明

本项目中的媒体资源均来自以下合法渠道：

- **图片**：Unsplash（免费商用）
- **音乐**：Pixabay（CC0协议）
- **视频**：公共领域内容

所有资源均可放心用于个人和商业用途。

---

## 🎉 享受你的VistaBlog！

希望这个新功能让你的博客体验更加美好！
