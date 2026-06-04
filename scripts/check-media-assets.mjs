#!/usr/bin/env node
/**
 * 扫描 public/vistablog 资源目录，对照 manifest.json 检查缺失与多余文件。
 *
 * 用法: npm run check:media
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'public');
const VISTABLOG_DIR = path.join(PUBLIC_DIR, 'vistablog');
const MANIFEST_PATH = path.join(VISTABLOG_DIR, 'manifest.json');

const SCAN_DIRS = [
  { dir: 'bg', label: '主题壁纸 (bg)' },
  { dir: path.join('bg', 'extra'), label: '额外背景 (bg/extra)' },
  { dir: 'video', label: '视频 (video)' },
  { dir: 'audio', label: '音乐 (audio)' },
  { dir: 'covers', label: '封面 (covers)' },
];

const MEDIA_EXT = new Set([
  '.webp',
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.mp4',
  '.webm',
  '.mp3',
  '.wav',
  '.ogg',
  '.m4a',
]);

const SKIP_NAMES = new Set(['README.md', '.gitkeep', 'manifest.json', 'manifest.external.example.json']);

function isMediaFile(name) {
  return MEDIA_EXT.has(path.extname(name).toLowerCase());
}

/** @param {string} urlPath 如 /vistablog/bg/foo.webp */
function urlToDiskPath(urlPath) {
  if (!urlPath || typeof urlPath !== 'string') return null;
  if (/^https?:\/\//i.test(urlPath)) return null;
  const normalized = urlPath.startsWith('/') ? urlPath.slice(1) : urlPath;
  return path.join(PUBLIC_DIR, normalized.split('/').join(path.sep));
}

function collectManifestPaths(manifest) {
  /** @type {{ path: string, label: string }[]} */
  const entries = [];

  const add = (urlPath, label) => {
    const disk = urlToDiskPath(urlPath);
    if (disk) entries.push({ path: disk, label });
  };

  for (const theme of manifest.themes ?? []) {
    add(theme.url, `主题 [${theme.id}] ${theme.name}`);
  }

  for (const [id, cfg] of Object.entries(manifest.themeVideos ?? {})) {
    add(cfg.videoUrl, `视频 [${id}]`);
    add(cfg.posterUrl, `视频封面 [${id}]`);
  }

  for (const bg of manifest.crawledBackgrounds ?? []) {
    add(bg.url, `背景库 [${bg.id}] ${bg.description}`);
  }

  for (const track of manifest.music ?? []) {
    add(track.url, `音乐 [${track.id}] ${track.title}`);
    add(track.coverUrl, `音乐封面 [${track.id}]`);
  }

  return entries;
}

function listMediaFilesRecursive(dirAbs, baseRel = '') {
  /** @type {string[]} */
  const files = [];
  if (!fs.existsSync(dirAbs)) return files;

  for (const name of fs.readdirSync(dirAbs)) {
    const abs = path.join(dirAbs, name);
    const rel = baseRel ? `${baseRel}/${name}` : name;
    const stat = fs.statSync(abs);
    if (stat.isDirectory()) {
      files.push(...listMediaFilesRecursive(abs, rel));
    } else if (isMediaFile(name) && !SKIP_NAMES.has(name)) {
      files.push(rel.replace(/\\/g, '/'));
    }
  }
  return files;
}

function manifestPathToVistablogRel(diskPath) {
  const rel = path.relative(VISTABLOG_DIR, diskPath).replace(/\\/g, '/');
  return `/vistablog/${rel}`;
}

function main() {
  console.log('VistaBlog 资源检查\n');
  console.log(`清单: ${path.relative(ROOT, MANIFEST_PATH)}\n`);

  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error('❌ 未找到 manifest.json');
    process.exit(1);
  }

  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  } catch (e) {
    console.error('❌ manifest.json 解析失败:', e.message);
    process.exit(1);
  }

  const manifestEntries = collectManifestPaths(manifest);
  const referencedDisk = new Set(manifestEntries.map((e) => path.normalize(e.path)));

  const externalUrls = [];
  const missing = [];
  const ok = [];

  for (const entry of manifestEntries) {
    if (!entry.path) continue;
    if (fs.existsSync(entry.path)) {
      ok.push(entry);
    } else {
      missing.push(entry);
    }
  }

  // 收集 manifest 内外链（仅提示）
  const collectUrls = (obj) => {
    if (typeof obj === 'string' && /^https?:\/\//i.test(obj)) externalUrls.push(obj);
    else if (obj && typeof obj === 'object') {
      for (const v of Object.values(obj)) collectUrls(v);
    }
  };
  collectUrls(manifest);

  /** @type {string[]} */
  const orphans = [];

  for (const { dir } of SCAN_DIRS) {
    const abs = path.join(VISTABLOG_DIR, dir);
    const relPrefix = dir.replace(/\\/g, '/');
    for (const file of listMediaFilesRecursive(abs)) {
      const disk = path.join(abs, ...file.split('/'));
      const normalized = path.normalize(disk);
      if (!referencedDisk.has(normalized)) {
        orphans.push(`/vistablog/${relPrefix}/${file}`.replace(/\/+/g, '/'));
      }
    }
  }

  console.log(`manifest 版本: ${manifest.version ?? '(未设置)'}`);
  console.log(`本地路径条目: ${manifestEntries.length}`);
  console.log(`外链条目: ${externalUrls.length > 0 ? '有（见下方提示）' : '无'}\n`);

  if (ok.length > 0) {
    console.log(`✅ 已存在 (${ok.length}):`);
    for (const e of ok) {
      console.log(`   ${path.relative(ROOT, e.path)}  ← ${e.label}`);
    }
    console.log('');
  }

  if (missing.length > 0) {
    console.log(`❌ 缺失文件 (${missing.length}) — 请放入对应目录或修改 manifest:`);
    for (const e of missing) {
      console.log(`   ${path.relative(ROOT, e.path)}`);
      console.log(`      ${e.label}`);
    }
    console.log('');
  }

  if (orphans.length > 0) {
    console.log(`⚠️  未在 manifest 中登记的文件 (${orphans.length}):`);
    for (const p of orphans) {
      console.log(`   ${p}`);
    }
    console.log('   提示: 在 manifest.json 增加条目，或删除多余文件。\n');
  }

  if (externalUrls.length > 0) {
    console.log(`ℹ️  manifest 含 ${externalUrls.length} 个 http(s) 外链（本脚本不检查外链是否可访问）。\n`);
  }

  const summary = [
    `合计: ${ok.length} 通过`,
    missing.length ? `${missing.length} 缺失` : null,
    orphans.length ? `${orphans.length} 未登记` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  console.log(summary);

  if (missing.length > 0) {
    process.exit(1);
  }
}

main();
