# VistaBlog

一个动态个人博客与资源发现台，重点用于整理学习资料、照片图集、风景素材和背景音乐，也支持同学通过评论、微言和投稿参与。

## 本地运行

1. 安装依赖：
   `npm ci`
2. 复制 `.env.example` 为 `.env.local`（本地可先不填 CDN，使用 `public/vistablog/manifest.json`）。
3. 启动开发服务器：
   `npm run dev`
4. 构建生产版本：
   `npm run build`

## 国内部署建议

- 静态站点可以部署到 Vercel、Netlify、Cloudflare Pages、阿里云 OSS、腾讯云 COS、七牛云或自建 Nginx。
- 如果图片来自海外图床，建议配置 `VITE_IMAGE_PROXY` 或把常用图片同步到对象存储/CDN。
- 学习资料、照片包、背景音乐建议放在国内对象存储，并通过 `VITE_ASSET_CDN` / `VITE_AUDIO_CDN` 统一管理。
- 真正的爬虫任务建议放在服务端，通过 `VITE_CRAWLER_ENDPOINT` 接入前端。前端只负责提交关键词、展示候选结果和导入博客，避免静态站点承担跨域、限流和合规风险。

## 本地资源清单

资源按类型分文件夹存放（详见 `public/vistablog/README.md`）：

| 文件夹 | 内容 |
|--------|------|
| `public/vistablog/bg/` | 主题壁纸；`bg/extra/` 为沙盘额外背景图 |
| `public/vistablog/video/` | 动态背景 MP4（与主题 id 同名） |
| `public/vistablog/audio/` | 背景音乐 MP3 |
| `public/vistablog/covers/` | 音乐封面小图 |

- 索引文件：`public/vistablog/manifest.json`（改 `version` 后刷新页面）。
- 检查资源：`npm run check:media`（对照清单扫描缺失/多余文件）。
- 尚未准备文件时：参考 `manifest.external.example.json` 临时使用外链。
- 上线阿里云：上传整个 `vistablog` 目录到 OSS，设置 `VITE_ASSET_CDN=https://cdn.你的域名.com/vistablog`。

## 当前功能重点

- 学习资料与照片发现台
- 文章、微言、评论、回复和点赞
- 风景主题切换与动态背景
- 阅读器、资源下载信息和提取码展示
- 荒野沙盘、照片采集、环境声混音与爬取候选导入
