# Design

## Summary

VistaBlog is a dark, image-led product interface for discovering study resources and photo collections. The visual system keeps the existing natural landscape identity, but resource actions now carry the hierarchy.

## Color

The app uses a restrained dark surface with theme-specific accent colors from the selected landscape. Accents are reserved for active tabs, primary actions, status dots, and source badges. Text contrast should stay high on translucent panels.

## Typography

Use fast-loading local/system font stacks for China-friendly deployment:

- UI/body: `system-ui`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Microsoft YaHei`, `PingFang SC`, sans-serif
- Chinese editorial headings: `Noto Serif SC` only when locally available, then `Songti SC`, `SimSun`, serif
- Mono/data: `SFMono-Regular`, `Consolas`, `Liberation Mono`, monospace

No remote Google Fonts are required for the core experience.

## Layout

The primary desktop layout is a left profile/control column plus a wider resource/content column. The resource discovery hub appears above the older tabbed feed so users can immediately choose between learning files, photos, community activity, and crawler import paths. Mobile stacks into one column with 44px touch targets.

## Components

- Resource discovery hub: segmented mode switch, source policy strip, resource cards, crawler queue preview, and participation rail.
- Blog cards: image-led cards with resource metadata and clear reading/download actions.
- Sandbox and crawler: dynamic tools for image capture, crawler candidates, sound mixing, and blog import.

## Motion

Use short state transitions around selection, import progress, and card hover. Respect `prefers-reduced-motion` by disabling long ambient animation and hover transforms.

## Deployment Notes

Use `.env.local` to configure `VITE_ASSET_CDN`, `VITE_IMAGE_PROXY`, `VITE_AUDIO_CDN`, and `VITE_CRAWLER_ENDPOINT` when deploying domestically. Core UI should remain usable even if overseas image hosts load slowly.
