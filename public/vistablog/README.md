# VistaBlog 资源目录

把文件放进对应文件夹，**保持文件名与下表一致**（或在 `manifest.json` 里改路径）。保存后刷新页面即可。

```
vistablog/
├── manifest.json      ← 资源索引（改 version 可强制浏览器更新缓存）
├── bg/                ← 静态图片
│   ├── forest-lake.webp …（5 套主题壁纸）
│   └── extra/         ← 沙盘「背景图库」额外图片
├── video/             ← 动态视频背景（与主题 id 同名）
├── audio/             ← 背景音乐 MP3
└── covers/            ← 音乐封面小图
```

## 检查资源是否齐全

在项目根目录运行：

```bash
npm run check:media
```

会对照 `manifest.json` 列出：**已存在**、**缺失**、**文件夹里但未登记** 的文件。

## 更新资源的两种方式

### 方式 A：替换文件（推荐）

1. 把新图放进 `bg/`，文件名不变（例如仍叫 `forest-lake.webp`）。
2. 打开 `manifest.json`，把 `version` 改成新日期，例如 `"1.1.1-20260605"`。
3. 刷新博客页面（沙盘里可点刷新按钮）。

### 方式 B：新增一条资源

1. 放入新文件，例如 `bg/extra/bg-10.webp`、`audio/music-07.mp3`。
2. 在 `manifest.json` 的 `crawledBackgrounds` 或 `music` 数组里增加一条，写好 `url` 路径。
3. 更新 `version` 后刷新。

## 尚未准备本地文件时

可参考 `manifest.external.example.json`（外链示例）。需要临时用外链时，把其中 `url` 复制进 `manifest.json` 对应字段即可。

## 上线阿里云

将整个 `vistablog` 文件夹上传到 OSS，目录结构保持不变，并设置：

`VITE_ASSET_CDN=https://cdn.你的域名.com/vistablog`
