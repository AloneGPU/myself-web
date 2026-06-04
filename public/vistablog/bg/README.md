# 图片资源（bg）

## 主题壁纸（全站动态背景 / 左侧切换）

| 文件名 | 对应主题 id |
|--------|-------------|
| `forest-lake.webp` | forest-lake |
| `misty-mountain.webp` | misty-mountain |
| `starry-peaks.webp` | starry-peaks |
| `sunrise-ocean.webp` | sunrise-ocean |
| `winter-dawn.webp` | winter-dawn |

建议宽度 ≥ 1920px，格式 `.webp` 或 `.jpg`（若用 `.jpg` 请同步修改 `manifest.json` 里的扩展名）。

## 额外背景（沙盘 → 媒体资源 → 背景图）

放在 `extra/` 子目录：

| 文件名 |
|--------|
| `extra/bg-01.webp` … `extra/bg-09.webp` |

新增图片：放入 `extra/`，并在 `manifest.json` → `crawledBackgrounds` 增加一条记录。
