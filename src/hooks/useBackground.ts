import { useState, useEffect, useCallback, useRef } from 'react';
import { BackgroundTheme } from '../types';

export type BgMode = 'static' | 'video' | 'auto';

interface BackgroundController {
  mode: BgMode;
  setMode: (m: BgMode) => void;
  isVideoActive: boolean;
  shouldUseVideo: boolean;
  userInteracted: boolean;
}

const STORAGE_KEY_MODE = 'vistablog_bg_mode';
const STORAGE_KEY_THEME = 'vistablog_bg_theme_id';
const STORAGE_KEY_AUTO = 'vistablog_bg_auto_theme';

/** 根据时间段自动匹配主题 ID */
export function getTimeBasedThemeId(): string {
  const h = new Date().getHours();
  if (h >= 5 && h < 10) return 'sunrise-ocean';
  if (h >= 10 && h < 18) return 'forest-lake';
  if (h >= 18 && h < 21) return 'misty-mountain';
  return 'starry-peaks';
}

export function useBackground(
  themes: BackgroundTheme[],
  hasVideoUrl: boolean,
): BackgroundController {
  const [mode, setModeState] = useState<BgMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_MODE);
    return (saved === 'static' || saved === 'video' || saved === 'auto') ? saved : 'auto';
  });
  const [userInteracted, setUserInteracted] = useState(false);
  const [batteryLow, setBatteryLow] = useState(false);
  const [slowConnection, setSlowConnection] = useState(false);
  const interactionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Rule 1: prefers-reduced-motion → force static
  const prefersReducedMotion = useRef(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion.current = mq.matches;
    const handler = (e: MediaQueryListEvent) => { prefersReducedMotion.current = e.matches; };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Rule 2: battery < 0.2 → force static
  useEffect(() => {
    const nav = navigator as Navigator & { getBattery?: () => Promise<{ level: number; addEventListener: (e: string, fn: () => void) => void }> };
    if (nav.getBattery) {
      nav.getBattery().then((battery) => {
        setBatteryLow(battery.level < 0.2);
        battery.addEventListener('levelchange', () => setBatteryLow(battery.level < 0.2));
      }).catch(() => {});
    }
  }, []);

  // Rule 5: 2g/slow-2g → force static
  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: { effectiveType: string; addEventListener: (e: string, fn: () => void) => void; removeEventListener: (e: string, fn: () => void) => void } }).connection;
    if (conn) {
      setSlowConnection(conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g');
      const handler = () => setSlowConnection(conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g');
      conn.addEventListener('change', handler);
      return () => conn.removeEventListener('change', handler);
    }
  }, []);

  // Rule 3: 用户最近 30s 内有交互 + 有 videoUrl → 升级为 video
  useEffect(() => {
    const markInteraction = () => {
      setUserInteracted(true);
      if (interactionTimer.current) clearTimeout(interactionTimer.current);
      interactionTimer.current = setTimeout(() => setUserInteracted(false), 30000);
    };
    const events = ['mousemove', 'scroll', 'touchmove', 'keydown'] as const;
    events.forEach((e) => window.addEventListener(e, markInteraction, { passive: true }));
    return () => {
      events.forEach((e) => window.removeEventListener(e, markInteraction));
      if (interactionTimer.current) clearTimeout(interactionTimer.current);
    };
  }, []);

  const setMode = useCallback((m: BgMode) => {
    setModeState(m);
    localStorage.setItem(STORAGE_KEY_MODE, m);
  }, []);

  // 综合判断 shouldUseVideo
  const shouldUseVideo = (() => {
    if (prefersReducedMotion.current) return false;
    if (batteryLow) return false;
    if (slowConnection) return false;
    if (mode === 'static') return false;
    if (mode === 'video') return true;
    return userInteracted && hasVideoUrl;
  })();

  const isVideoActive = shouldUseVideo && hasVideoUrl;

  return { mode, setMode, isVideoActive, shouldUseVideo, userInteracted };
}

/** 保存用户手动选择的主题，覆盖时间自动匹配 */
export function useSavedTheme(): {
  savedThemeId: string | null;
  saveThemeId: (id: string) => void;
  clearSavedTheme: () => void;
  useAutoTheme: boolean;
  setUseAutoTheme: (v: boolean) => void;
} {
  const [savedThemeId, setSavedThemeId] = useState<string | null>(() =>
    localStorage.getItem(STORAGE_KEY_THEME),
  );
  const [useAutoTheme, setUseAutoThemeState] = useState(() => {
    const v = localStorage.getItem(STORAGE_KEY_AUTO);
    return v !== 'false';
  });

  const saveThemeId = useCallback((id: string) => {
    setSavedThemeId(id);
    localStorage.setItem(STORAGE_KEY_THEME, id);
  }, []);

  const clearSavedTheme = useCallback(() => {
    setSavedThemeId(null);
    localStorage.removeItem(STORAGE_KEY_THEME);
  }, []);

  const setUseAutoTheme = useCallback((v: boolean) => {
    setUseAutoThemeState(v);
    localStorage.setItem(STORAGE_KEY_AUTO, String(v));
  }, []);

  return { savedThemeId, saveThemeId, clearSavedTheme, useAutoTheme, setUseAutoTheme };
}
