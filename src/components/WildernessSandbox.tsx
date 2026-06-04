import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Camera,
  Compass,
  MapPin,
  Sliders,
  Volume2,
  VolumeX,
  Flame,
  Sun,
  Sparkles,
  RefreshCw,
  Eye,
  Heart,
  Download,
  Check,
  Image as ImageIcon,
  FileText,
  X,
  Map,
  CameraOff,
  CloudRain,
  ChevronRight,
  Info,
  Waves
} from 'lucide-react';
import { BackgroundTheme, BlogPost, CrawledBackground, MusicTrack } from '../types';

interface WildernessSandboxProps {
  currentTheme: BackgroundTheme;
  crawledBackgrounds: CrawledBackground[];
  musicTracks: MusicTrack[];
  manifestVersion?: string;
  onRefreshManifest?: () => void;
  onApplyBackground?: (bg: CrawledBackground) => void;
  style: {
    accentText: string;
    accentBg: string;
    accentBorder: string;
    accentBtn: string;
    accentGlow: string;
    badgeClass: string;
    colorName: string;
  };
  onImportAsPost?: (newPost: BlogPost) => void;
}

interface EXIFData {
  camera: string;
  lens: string;
  focalLength: string;
  aperture: string;
  iso: number;
  ev: string;
  filmSimulation: string;
  time: string;
}

interface PhotoRecord {
  id: string;
  themeId: string;
  themeName: string;
  imageUrl: string;
  exif: EXIFData;
}

interface AdventureSpot {
  id: string;
  name: string;
  coords: string;
  location: string;
  elevation: string;
  temperature: string;
  bestTime: string;
  gear: string;
  note: string;
  imageUrl: string;
}

const ADVENTURE_SPOTS: AdventureSpot[] = [
  {
    id: 'tibet-ali',
    name: '西藏阿里 · 冈仁波齐',
    coords: '31.06° N, 81.31° E',
    location: '西藏阿里环线',
    elevation: '4,600米',
    temperature: '-3°C 至 12°C',
    bestTime: '6月 - 9月 清晨日出',
    gear: 'Fujifilm GFX 100S + GF 120mm Medium Format Macro Lens',
    note: '极境生命的终极圣地。当朝阳第一缕红光越过狂野的山脊，照亮神山那近乎完美对称的金字塔灰白锥体，世俗的一切都被抛诸脑后。晨间温度通常低于零下，需要携带保暖防护外套及重型阻尼三脚架。',
    imageUrl: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'sichuan-gongga',
    name: '川西 · 里索海贡嘎山',
    coords: '29.58° N, 101.88° E',
    location: '四川甘孜藏族自治州',
    elevation: '4,350米',
    temperature: '2°C 至 15°C',
    bestTime: '10月 - 11月 傍晚日照金山',
    gear: 'Hasselblad X2D 100C + XCD 38mm Lens / Mavic 3 Pro Cine Drone',
    note: '蜀山之王——贡嘎雪山的最佳仰望点之一。里索海犹如一双嵌在乱石深处的松石之眼。傍晚，高达7556米的主峰闪烁着如熔岩般的黄铜金辉，与黑魆魆的冰川倒融于水面，构成了风光摄影师向往的终极画幅。',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'iceland-aurora',
    name: '冰岛 · 斯奈山布迪尔教堂',
    coords: '64.92° N, 23.31° W',
    location: '冰岛斯奈山半岛',
    elevation: '85米',
    temperature: '-5°C 至 3°C',
    bestTime: '11月 - 次年2月 深夜极光季',
    gear: 'Sony Alpha 7R V + FE 24mm F1.4 GM Night Lens',
    note: '黑色的玄武岩寂静教堂，耸立在火山岩遍布的荒原边缘。深夜，星野浩渺，翠绿带卷的欧若拉（Aurora）北极光如绸带般横扫北天，雪山在闪烁的光粒子中呈现出幻妙的蔚蓝色轮廓。拍摄需要超宽动态及极高抗寒电池。',
    imageUrl: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'zhejiang-tianmu',
    name: '浙江天目 · 远黛松径',
    coords: '30.34° N, 119.42° E',
    location: '杭州临安天目山',
    elevation: '1,100米',
    temperature: '14°C 至 22°C',
    bestTime: '4月 - 5月 晨间翠林弥雾',
    gear: 'Fujifilm GFX 100S + GF 45-100mm Zoom Lens',
    note: '大江南部的原始森林，古杉通天。春末夏初，清风过林，林间漫起饱浸松脂香气的淡翠色浓雾。竹叶摇摆，松涛低啸。无需精巧技术，中焦人文镜头配以中性偏冷色调设定，即可轻松刻画如同水墨长卷一般的中国江南山野风骨。',
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80'
  }
];

export default function WildernessSandbox({
  currentTheme,
  crawledBackgrounds,
  musicTracks,
  manifestVersion,
  onRefreshManifest,
  onApplyBackground,
  style,
  onImportAsPost,
}: WildernessSandboxProps) {
  // --- STATE FOR CAMERA VIEWFINDER SIMULATOR ---
  const [focalLength, setFocalLength] = useState<number>(50); // 18, 35, 50, 85, 135, 200
  const [aperture, setAperture] = useState<string>('f/4.0'); // 'f/1.4', 'f/2.0', 'f/2.8', 'f/4.0', 'f/5.6', 'f/8.0', 'f/11', 'f/16'
  const [iso, setIso] = useState<number>(400); // 100, 200, 400, 800, 1650, 3200, 6400
  const [evValue, setEvValue] = useState<string>('0.0'); // '-2.0' to '+2.0'
  const [filmStyle, setFilmStyle] = useState<string>('Classic Chrome'); // Presets
  const [cameraRoll, setCameraRoll] = useState<PhotoRecord[]>([]);
  const [shutterFlashing, setShutterFlashing] = useState<boolean>(false);
  const [selectedPhotoForView, setSelectedPhotoForView] = useState<PhotoRecord | null>(null);

  // --- STATE FOR NATURE MIXER ---
  const [mixerActive, setMixerActive] = useState<boolean>(false);
  const [soundVolumes, setSoundVolumes] = useState<{ rain: number; fire: number; tide: number }>({
    rain: 0.15,
    fire: 0.20,
    tide: 0.10
  });
  const [soundMutes, setSoundMutes] = useState<{ rain: boolean; fire: boolean; tide: boolean }>({
    rain: false,
    fire: false,
    tide: false
  });

  // --- STATE FOR ADVENTURE MAP ---
  const [selectedSpot, setSelectedSpot] = useState<AdventureSpot>(ADVENTURE_SPOTS[1]);
  const [postcardModal, setPostcardModal] = useState<boolean>(false);
  const [postcardTo, setPostcardTo] = useState<string>('');
  const [postcardFrom, setPostcardFrom] = useState<string>('');
  const [postcardText, setPostcardText] = useState<string>('愿落日熔金的雪山、以及林间不归的清风，抚平你所有的疲劳与焦躁。我们在原野中见！');
  const [postcardTemplate, setPostcardTemplate] = useState<string>('polaroid'); // polaroid, retro-letter, alpine-card
  const [stampingPostcard, setStampingPostcard] = useState<boolean>(false);
  const [savedPostcards, setSavedPostcards] = useState<any[]>([]);

  // Synthesizer Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  
  // Rain Synth Web Audio nodes
  const rainSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const rainGainRef = useRef<GainNode | null>(null);

  // Fire Web Audio nodes
  const fireSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const fireGainRef = useRef<GainNode | null>(null);
  const fireCrackleIntervalRef = useRef<number | null>(null);

  // Tide Web Audio nodes
  const tideSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const tideGainRef = useRef<GainNode | null>(null);
  const tideOscillatorRef = useRef<any | null>(null);
  const tideSweepIntervalRef = useRef<number | null>(null);

  // Initialize and load saved data
  useEffect(() => {
    const savedRoll = localStorage.getItem('vistablog_sandbox_roll');
    if (savedRoll) {
      setCameraRoll(JSON.parse(savedRoll));
    }
    const savedCards = localStorage.getItem('vistablog_postcards');
    if (savedCards) {
      setSavedPostcards(JSON.parse(savedCards));
    }

    return () => {
      stopAllSynthesizers();
    };
  }, []);

  // --- CAMERA SIMULATION FORMULAS ---
  // Get scale for focal zoom
  const getFocalZoom = () => {
    switch (focalLength) {
      case 18: return 1.0;
      case 35: return 1.35;
      case 50: return 1.7;
      case 85: return 2.2;
      case 135: return 3.2;
      case 200: return 4.5;
      default: return 1.7;
    }
  };

  // Get Blur amount according to aperture and focal projection
  const getApertureBlurVal = () => {
    let baseBlur = 0;
    switch (aperture) {
      case 'f/1.4': baseBlur = 8; break;
      case 'f/2.0': baseBlur = 5; break;
      case 'f/2.8': baseBlur = 3; break;
      case 'f/4.0': baseBlur = 1.8; break;
      case 'f/5.6': baseBlur = 0.8; break;
      case 'f/8.0': baseBlur = 0.2; break;
      case 'f/11': baseBlur = 0; break;
      case 'f/16': baseBlur = 0; break;
      default: baseBlur = 1.0;
    }
    // Deep zoom enhances separation background blur
    return baseBlur * (getFocalZoom() * 0.7);
  };

  // Get brightness according to EV EV settings
  const getSimBrightness = () => {
    const fVal = parseFloat(evValue);
    return 100 + fVal * 15; // 70% to 130%
  };

  // Get CSS filter styling for film simulations
  const getFilmFilterCSS = () => {
    switch (filmStyle) {
      case 'Classic Chrome':
        return 'contrast(106%) saturate(72%) sepia(8%) hue-rotate(-2deg)';
      case 'Velvia':
        return 'contrast(120%) saturate(145%) brightness(98%)';
      case 'Acros':
        return 'grayscale(100%) contrast(140%)';
      case 'Astia':
        return 'saturate(90%) contrast(96%) brightness(102%)';
      case 'Classic Negative':
        return 'contrast(115%) saturate(85%) sepia(12%) hue-rotate(5deg)';
      default:
        return 'none';
    }
  };

  // Trigger synthesized physical shutter clack
  const triggerMechanicalShutterClack = () => {
    try {
      const AudioClass = window.AudioContext || (window as any).webkitAudioContext;
      const tCtx = audioCtxRef.current || new AudioClass();
      if (!audioCtxRef.current) audioCtxRef.current = tCtx;

      const sampleRate = tCtx.sampleRate;
      const bufferSize = sampleRate * 0.14;
      const buffer = tCtx.createBuffer(1, bufferSize, sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noiseSource = tCtx.createBufferSource();
      noiseSource.buffer = buffer;

      const hpFilter = tCtx.createBiquadFilter();
      hpFilter.type = 'highpass';
      hpFilter.frequency.value = 1400;

      const gain = tCtx.createGain();
      const now = tCtx.currentTime;
      gain.gain.setValueAtTime(0.001, now);
      // Main Shutter opens peak
      gain.gain.linearRampToValueAtTime(0.5, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);
      // Secondary focal shutter bounces back closing plate
      gain.gain.linearRampToValueAtTime(0.28, now + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      noiseSource.connect(hpFilter);
      hpFilter.connect(gain);
      gain.connect(tCtx.destination);
      noiseSource.start(now);
    } catch (e) {
      console.warn("Shutter audio synth error: ", e);
    }
  };

  // Capture Photo Action
  const handleCapturePhotoSnap = () => {
    setShutterFlashing(true);
    triggerMechanicalShutterClack();

    // Flash light screen effect
    setTimeout(() => {
      setShutterFlashing(false);
      
      const newSnap: PhotoRecord = {
        id: 'snap_' + Date.now(),
        themeId: selectedSpot.id,
        themeName: selectedSpot.name,
        imageUrl: selectedSpot.imageUrl,
        exif: {
          camera: 'Fujifilm GFX 100S',
          lens: 'GF 32-64mm F4 R LM WR',
          focalLength: `${focalLength}mm`,
          aperture: aperture,
          iso: iso,
          ev: evValue === '0.0' ? '±0.0 EV' : `${evValue} EV`,
          filmSimulation: filmStyle,
          time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        }
      };

      const updated = [newSnap, ...cameraRoll].slice(0, 30); // keep top 30
      setCameraRoll(updated);
      localStorage.setItem('vistablog_sandbox_roll', JSON.stringify(updated));
    }, 180);
  };

  const handleDeleteSnap = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = cameraRoll.filter(r => r.id !== id);
    setCameraRoll(updated);
    localStorage.setItem('vistablog_sandbox_roll', JSON.stringify(updated));
    if (selectedPhotoForView && selectedPhotoForView.id === id) {
      setSelectedPhotoForView(null);
    }
  };

  // --- AUDIO SYNTHESIS SOUNDSCAPE LOGIC ---
  const toggleSoundscapeMixer = async () => {
    if (mixerActive) {
      stopAllSynthesizers();
      setMixerActive(false);
    } else {
      await startAllSynthesizers();
      setMixerActive(true);
    }
  };

  // Lowpass deep Brown noise for Rain
  const createRainNoiseBuffer = (ctx: AudioContext) => {
    const size = 2.5 * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, size, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let prev = 0.0;
    for (let i = 0; i < size; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (prev + (0.022 * white)) / 1.022;
      prev = data[i];
      data[i] *= 3.8; // amplify
    }
    return buffer;
  };

  // Highpass pink-ish noise cracks for logs popping
  const playCracklePopSound = (ctx: AudioContext, gainNode: GainNode) => {
    const osc = ctx.createOscillator();
    const peakGain = ctx.createGain();
    
    osc.type = Math.random() > 0.45 ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(680 + Math.random() * 850, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(75 + Math.random() * 45, ctx.currentTime + 0.012);
    
    // Low level pop volume
    const popVolume = (soundVolumes.fire) * (soundMutes.fire ? 0 : 1) * (0.15 + Math.random() * 0.25);
    peakGain.gain.setValueAtTime(popVolume, ctx.currentTime);
    peakGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.012);
    
    osc.connect(peakGain);
    peakGain.connect(gainNode);
    osc.start();
    osc.stop(ctx.currentTime + 0.015);
  };

  const startAllSynthesizers = async () => {
    try {
      const AudioClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioClass();
      audioCtxRef.current = ctx;

      // --- 1. BOOT RAIN NODE ---
      const rainBuffer = createRainNoiseBuffer(ctx);
      const rSource = ctx.createBufferSource();
      rSource.buffer = rainBuffer;
      rSource.loop = true;

      const rainFilter = ctx.createBiquadFilter();
      rainFilter.type = 'lowpass';
      rainFilter.frequency.value = 580; // damp atmospheric frequencies

      const rGain = ctx.createGain();
      const actualRainVol = soundMutes.rain ? 0 : soundVolumes.rain;
      rGain.gain.setValueAtTime(actualRainVol, ctx.currentTime);

      rSource.connect(rainFilter);
      rainFilter.connect(rGain);
      rGain.connect(ctx.destination);
      rSource.start(0);

      rainSourceRef.current = rSource;
      rainGainRef.current = rGain;

      // --- 2. BOOT FIRE WOOD CRACKLES NODE ---
      // Woodfire needs background warm rumbling noise + random snaps in JavaScript thread
      const fSourceNode = ctx.createBufferSource();
      const fireBaseBuffer = createRainNoiseBuffer(ctx); // warm heavy wind hum
      fSourceNode.buffer = fireBaseBuffer;
      fSourceNode.loop = true;

      const fireFilter = ctx.createBiquadFilter();
      fireFilter.type = 'bandpass';
      fireFilter.frequency.value = 180; // warm heavy crackle core
      fireFilter.Q.value = 0.5;

      const fGain = ctx.createGain();
      const actualFireVol = soundMutes.fire ? 0 : soundVolumes.fire * 0.6; // lower baseline hum
      fGain.gain.setValueAtTime(actualFireVol, ctx.currentTime);

      fSourceNode.connect(fireFilter);
      fireFilter.connect(fGain);
      fGain.connect(ctx.destination);
      fSourceNode.start(0);

      fireSourceRef.current = fSourceNode;
      fireGainRef.current = fGain;

      // Fire snaps clock generator in background
      const intervalTimer = window.setInterval(() => {
        if (!soundMutes.fire && soundVolumes.fire > 0.01) {
          // Organically spawn pops
          const chance = Math.random();
          if (chance > 0.55) {
            playCracklePopSound(ctx, fGain);
          }
          if (chance > 0.93) {
            // double micro popping
            setTimeout(() => playCracklePopSound(ctx, fGain), 60 + Math.random() * 90);
          }
        }
      }, 160);
      fireCrackleIntervalRef.current = intervalTimer;

      // --- 3. BOOT WAVE MODULATION NODE ---
      // Tides: high-passed wide white noise buffer swelling periodically
      const tSourceNode = ctx.createBufferSource();
      const tideNoiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 3.5, ctx.sampleRate);
      const tideData = tideNoiseBuffer.getChannelData(0);
      for (let i = 0; i < tideNoiseBuffer.length; i++) {
        tideData[i] = Math.random() * 2 - 1; // pure white noise
      }
      tSourceNode.buffer = tideNoiseBuffer;
      tSourceNode.loop = true;

      const tideFilter = ctx.createBiquadFilter();
      tideFilter.type = 'lowpass';
      tideFilter.frequency.value = 280; // soft sea wash sound

      const tGain = ctx.createGain();
      const actualTideVol = soundMutes.tide ? 0 : soundVolumes.tide;
      tGain.gain.setValueAtTime(actualTideVol, ctx.currentTime);

      tSourceNode.connect(tideFilter);
      tideFilter.connect(tGain);
      tGain.connect(ctx.destination);
      tSourceNode.start(0);

      tideSourceRef.current = tSourceNode;
      tideGainRef.current = tGain;

      // Ocean swells waves breathing algorithm (6s cycle)
      let swellStep = 0;
      const waveInterval = window.setInterval(() => {
        if (!soundMutes.tide && soundVolumes.tide > 0.01 && tideGainRef.current) {
          swellStep = (swellStep + 1) % 12;
          // Calculate cosine breathing scale between 0.35x and 1.6x of target volume
          const tideTarget = soundVolumes.tide;
          const bounceFactor = 0.85 + Math.cos((swellStep * Math.PI) / 6) * 0.65;
          const targetLvl = Math.max(0.002, tideTarget * bounceFactor);
          // Gently scale filter frequency to simulate water foam roll-off too!
          const targetFreq = 180 + (0.85 + Math.cos((swellStep * Math.PI) / 6) * 0.45) * 180;
          
          tideGainRef.current.gain.setTargetAtTime(targetLvl, ctx.currentTime, 1.4);
          tideFilter.frequency.setTargetAtTime(targetFreq, ctx.currentTime, 1.4);
        }
      }, 500);
      tideSweepIntervalRef.current = waveInterval;

    } catch (e) {
      console.warn("Failed to boot soundscape synths: ", e);
    }
  };

  const stopAllSynthesizers = () => {
    // Rain source
    if (rainSourceRef.current) {
      try { rainSourceRef.current.stop(); } catch(e){}
      rainSourceRef.current.disconnect();
      rainSourceRef.current = null;
    }
    // Fire source
    if (fireSourceRef.current) {
      try { fireSourceRef.current.stop(); } catch(e){}
      fireSourceRef.current.disconnect();
      fireSourceRef.current = null;
    }
    if (fireCrackleIntervalRef.current) {
      clearInterval(fireCrackleIntervalRef.current);
      fireCrackleIntervalRef.current = null;
    }
    // Tide source
    if (tideSourceRef.current) {
      try { tideSourceRef.current.stop(); } catch(e){}
      tideSourceRef.current.disconnect();
      tideSourceRef.current = null;
    }
    if (tideSweepIntervalRef.current) {
      clearInterval(tideSweepIntervalRef.current);
      tideSweepIntervalRef.current = null;
    }
    if (audioCtxRef.current) {
      try { audioCtxRef.current.close(); } catch(e){}
      audioCtxRef.current = null;
    }
  };

  // Live adjustments of sound channels
  const handleLiveVolumeSlide = (channel: 'rain' | 'fire' | 'tide', val: number) => {
    setSoundVolumes(prev => ({ ...prev, [channel]: val }));
    const activeMute = soundMutes[channel];
    if (activeMute) return; // ignore visual volume setting if muted

    const ctx = audioCtxRef.current;
    if (!ctx) return;

    if (channel === 'rain' && rainGainRef.current) {
      rainGainRef.current.gain.setValueAtTime(val, ctx.currentTime);
    } else if (channel === 'fire' && fireGainRef.current) {
      fireGainRef.current.gain.setValueAtTime(val * 0.6, ctx.currentTime);
    } else if (channel === 'tide' && tideGainRef.current) {
      tideGainRef.current.gain.setValueAtTime(val, ctx.currentTime);
    }
  };

  const handleLiveToggleMute = (channel: 'rain' | 'fire' | 'tide') => {
    const nextMuteState = !soundMutes[channel];
    setSoundMutes(prev => ({ ...prev, [channel]: nextMuteState }));

    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const actualVol = nextMuteState ? 0 : soundVolumes[channel];
    if (channel === 'rain' && rainGainRef.current) {
      rainGainRef.current.gain.setValueAtTime(actualVol, ctx.currentTime);
    } else if (channel === 'fire' && fireGainRef.current) {
      fireGainRef.current.gain.setValueAtTime(actualVol * 0.6, ctx.currentTime);
    } else if (channel === 'tide' && tideGainRef.current) {
      tideGainRef.current.gain.setValueAtTime(actualVol, ctx.currentTime);
    }
  };

  // --- POSTCARD HANDLERS ---
  const handleTriggerPostcardMaker = () => {
    setPostcardModal(true);
    setPostcardTo('');
    setPostcardFrom('');
    setPostcardText(`在这幅拍摄自『${selectedSpot.name}』的巍巍风光中，我看到了星河之浩瀚、竹涛之沉潜。特写下这张数码明信片，愿林间的晚雨拂去你的辛勤，山巅的金辉送你满怀澄澈与平静。\n\n我们在行旅原野深处，终会相逢。`);
  };

  const handleStampAndSavePostcard = () => {
    if (!postcardTo.trim() || !postcardFrom.trim()) {
      alert("请填写明信片寄出人与收信人姓名。");
      return;
    }
    setStampingPostcard(true);

    setTimeout(() => {
      const newCard = {
        id: 'postcard_' + Date.now(),
        locationId: selectedSpot.id,
        locationName: selectedSpot.name,
        imageUrl: selectedSpot.imageUrl,
        coords: selectedSpot.coords,
        to: postcardTo,
        from: postcardFrom,
        text: postcardText,
        template: postcardTemplate,
        date: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
      };

      const updated = [newCard, ...savedPostcards];
      setSavedPostcards(updated);
      localStorage.setItem('vistablog_postcards', JSON.stringify(updated));
      setStampingPostcard(false);
      setPostcardModal(false);
    }, 1200);
  };

  const handleDeletePostcard = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedPostcards.filter(c => c.id !== id);
    setSavedPostcards(updated);
    localStorage.setItem('vistablog_postcards', JSON.stringify(updated));
  };


  return (
    <div className="space-y-8" id="wilderness-sandbox-view">
      
      {/* SECTION 1: SANDBOX EXPLANATION BLOCK */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-5 rounded-3xl flex flex-col md:flex-row items-center gap-4 text-center md:text-left justify-between"
      >
        <div className="flex items-center gap-3.5 flex-col md:flex-row">
          <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 flex items-center justify-center p-1 border border-indigo-500/20 shadow-md">
            <Compass size={22} className="text-indigo-400 animate-spin" style={{ animationDuration: '40s' }} />
          </div>
          <div>
            <h3 className="text-sm md:text-base font-black text-white font-['Noto_Serif_SC']">
              林暮野的「荒野数字交互沙盘」
            </h3>
            <p className="text-xs text-slate-350 mt-0.5 max-w-xl">
              这里是科技美学与风光记录折叠交汇的极客地带。在这里，您可以操控多音轨物理落雨声、利用风光相机取景模拟器拍摄自然、或者亲手签盖一枚邮戳以制作明信片。
            </p>
          </div>
        </div>

        {/* Quick sound indication badge */}
        <button
          onClick={toggleSoundscapeMixer}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold font-mono border flex items-center gap-2 cursor-pointer transition duration-300 shadow-md ${
            mixerActive
              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
              : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/5'
          }`}
        >
          {mixerActive ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>多轨白噪音：已开启</span>
            </>
          ) : (
            <>
              <Volume2 size={13} className="text-slate-400" />
              <span>多轨白噪音：离线中</span>
            </>
          )}
        </button>
      </motion.div>

      {/* THREE INTERACTIVE COLUMNS */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN (X/Y: 7 COLS) = CANVAS & ADVENTURE MAP */}
        <div className="xl:col-span-7 space-y-8">
          
          {/* COMPONENT A: ADVENTURE GEOMETRIC BOARD */}
          <div className="glass-panel p-6 rounded-3xl space-y-5">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Map size={16} className="text-indigo-400" />
                <h4 className="text-sm font-semibold text-white font-['Noto_Serif_SC']">
                  荒野行旅探索沙盘 (Landscape Footprints)
                </h4>
              </div>
              <span className="text-[10px] text-slate-450 font-mono">SELECT PATH PIN</span>
            </div>

            {/* Simulated Geometric Journey Grid */}
            <div className="relative h-[220px] rounded-2xl border border-white/5 bg-slate-950/40 overflow-hidden flex flex-col justify-between p-4 bg-gradient-to-br from-indigo-950/10 via-slate-950/60 to-slate-900/40">
              
              {/* Map grid lines overlay */}
              <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 pointer-events-none opacity-[0.03]">
                {[...Array(24)].map((_, i) => (
                  <div key={i} className="border border-white/70" />
                ))}
              </div>

              {/* Graphical trail line */}
              <div className="absolute inset-0 pointer-events-none pr-10">
                <svg className="w-full h-full" style={{ opacity: 0.12 }}>
                  <path
                    d="M 60 170 Q 180 80 290 120 T 520 40 T 640 160"
                    fill="none"
                    stroke="var(--accent-vibe-color)"
                    strokeWidth="2.5"
                    strokeDasharray="6 4"
                  />
                </svg>
              </div>

              {/* Floating map coordinate metadata info */}
              <div className="relative z-10 flex justify-between text-[11px] font-mono text-slate-500">
                <span>DIGITAL TOPO SANDBOX v1.2</span>
                <span className="text-slate-400 flex items-center gap-1">
                  🌐 {selectedSpot.coords}
                </span>
              </div>

              {/* Stylized clickable pins */}
              <div className="absolute inset-x-0 top-10 bottom-10">
                {ADVENTURE_SPOTS.map((spot, ind) => {
                  const isSel = spot.id === selectedSpot.id;
                  
                  // Position relative percentage slots
                  const coordsPos = [
                    { x: '10%', y: '70%' }, // forest
                    { x: '35%', y: '50%' }, // sichuan
                    { x: '68%', y: '16%' }, // iceland
                    { x: '88%', y: '65%' }  // zhejiang
                  ];
                  const pos = coordsPos[ind];

                  return (
                    <button
                      key={spot.id}
                      onClick={() => setSelectedSpot(spot)}
                      style={{ left: pos.x, top: pos.y }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 group/pin cursor-pointer flex flex-col items-center z-10 focus:outline-none"
                    >
                      {/* Pulse point glow */}
                      <span className={`absolute inline-flex h-8 w-8 rounded-full opacity-35 transition duration-700 ${
                        isSel ? 'animate-ping bg-indigo-400' : 'scale-0 group-hover/pin:scale-100 bg-slate-400 group-hover/pin:animate-pulse'
                      }`} />
                      
                      {/* Physical Pin */}
                      <div className={`relative px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all duration-300 ${
                        isSel
                          ? 'bg-slate-100 text-slate-900 border-white scale-110 shadow-lg shadow-indigo-950/40 z-20'
                          : 'bg-slate-950/80 text-slate-400 border-white/5 hover:border-white/15 hover:text-slate-200 hover:scale-105 shadow-md'
                      }`}>
                        <MapPin size={11} className={isSel ? 'text-indigo-600' : 'text-slate-500'} />
                        <span className="text-[10px] font-bold tracking-tight whitespace-nowrap">
                          {spot.name.split(' · ')[0]}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Bottom travel compass indicator */}
              <div className="relative z-10 flex items-end justify-between">
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                  Active footprint: <span className="text-white font-semibold">{selectedSpot.name}</span>
                </div>
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center p-1.5 text-slate-500">
                  <Compass size={14} className="animate-spin" style={{ animationDuration: '60s' }} />
                </div>
              </div>
            </div>

            {/* DETAIL CARD OF SELECTED SPOT */}
            <div className="glass-card p-5 rounded-2xl grid grid-cols-1 md:grid-cols-12 gap-5" id="sandbox-active-card">
              {/* Media preview */}
              <div className="md:col-span-5 aspect-video md:aspect-square rounded-xl overflow-hidden relative border border-white/5 bg-black/20 shrink-0">
                <img
                  src={selectedSpot.imageUrl}
                  alt={selectedSpot.name}
                  className="w-full h-full object-cover filter brightness-[0.7] hover:scale-105 transition duration-500"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-3 left-3 text-[9px] font-bold px-2 py-0.5 rounded-md bg-black/50 text-slate-300 border border-white/10 flex items-center gap-1 font-mono">
                  <Compass size={9} />
                  {selectedSpot.elevation}
                </span>
              </div>
              
              {/* Data list */}
              <div className="md:col-span-7 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-bold font-mono">
                      {selectedSpot.coords}
                    </span>
                    <span className="text-slate-500 text-xs">•</span>
                    <span className="text-xs text-slate-400 font-mono">温度: {selectedSpot.temperature}</span>
                  </div>
                  <h4 className="text-base font-bold text-white font-['Noto_Serif_SC'] leading-tight">
                    {selectedSpot.name}
                  </h4>
                  <p className="text-xs text-slate-350 leading-relaxed font-light">
                    {selectedSpot.note}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/5 space-y-2">
                  <div className="text-[10px] text-slate-400 leading-normal font-mono">
                    <span className="text-slate-500 block">推荐装备 (Recommended Outfit):</span>
                    <span className="text-white truncate font-light block mt-0.5">{selectedSpot.gear}</span>
                  </div>
                  
                  <div className="flex gap-2 pt-1 font-mono">
                    {/* postcard trigger */}
                    <button
                      onClick={handleTriggerPostcardMaker}
                      className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] rounded-xl flex items-center justify-center gap-1 cursor-pointer shadow-md transition"
                    >
                      <Sparkles size={11} />
                      制作山野寄信
                    </button>
                    {/* capture simulation trigger */}
                    <button
                      onClick={() => {
                        // Quick sync spot image to viewfinder and zoom trigger
                        // This triggers focus highlight on camera module
                        const element = document.getElementById('camera-viewfinder-block');
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                      }}
                      className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 font-bold text-[11px] rounded-xl flex items-center justify-center gap-1 cursor-pointer transition"
                    >
                      <Camera size={11} />
                      载入相机
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* COMPONENT B: STYLIZED CAMERA LCD VIEWFINDER */}
          <div className="glass-panel p-6 rounded-3xl space-y-5" id="camera-viewfinder-block">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Camera size={16} className="text-indigo-400" />
                <h4 className="text-sm font-semibold text-white font-['Noto_Serif_SC']">
                  风光相机取景器模拟器 (Exif Viewfinder Simulator)
                </h4>
              </div>
              <span className="text-[10px] text-slate-450 font-mono">MEDIUM FORMAT 100MP</span>
            </div>

            {/* Simulated DSLR LCD Shell */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border-4 border-slate-900 bg-slate-950 flex shadow-2xl">
              
              {/* Captured Shutter flashing white layer */}
              {shutterFlashing && (
                <div className="absolute inset-0 bg-white z-50 duration-75 ease" />
              )}

              {/* Viewfinder Display Backdrop with custom EXIF filters */}
              <div className="absolute inset-0 overflow-hidden select-none pointer-events-none">
                <motion.img
                  animate={{
                    scale: getFocalZoom(),
                    filter: `blur(${getApertureBlurVal()}px) brightness(${getSimBrightness()}%) ${getFilmFilterCSS()}`
                  }}
                  transition={{
                    scale: { type: 'spring', damping: 20, stiffness: 45 },
                    filter: { duration: 0.35 }
                  }}
                  src={selectedSpot.imageUrl}
                  alt="Viewfinder Focus Target"
                  className="w-full h-full object-cover origin-center"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Digital grain ISO overlay */}
              {iso >= 1600 && (
                <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-22 z-10" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }} />
              )}

              {/* Simulated Camera LCD HUD Overlay */}
              <div className="absolute inset-0 z-20 flex flex-col justify-between p-3 font-mono text-[10px] text-white/80 pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                
                {/* HUD Top Bar */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="font-bold">MF LATCHED</span>
                    <span className="text-slate-400">|</span>
                    <span>{selectedSpot.name.split(' · ')[0]}</span>
                  </div>
                  
                  <div className="flex items-center gap-2.5">
                    <span>AWB</span>
                    <span>[||||] 99%</span>
                    <span className="bg-slate-100 text-slate-950 font-bold px-1 rounded-sm">RAW+F</span>
                  </div>
                </div>

                {/* HUD Mid Autofocus Grid Lines */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {/* Rule of Thirds grid lines with low opacity */}
                  <div className="absolute inset-x-0 h-full grid grid-rows-3 pointer-events-none">
                    <div className="border-b border-white/20" />
                    <div className="border-b border-white/20" />
                  </div>
                  <div className="absolute inset-y-0 w-full grid grid-cols-3 pointer-events-none">
                    <div className="border-r border-white/20" />
                    <div className="border-r border-white/20" />
                  </div>
                  
                  {/* Central autofocus bracket box */}
                  <div className="w-16 h-16 border border-indigo-400/80 rounded-md relative flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-indigo-400/90 rounded-full animate-ping" />
                    <span className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 border-t-2 border-l-2 border-indigo-400" />
                    <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 border-t-2 border-r-2 border-indigo-400" />
                    <span className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 border-b-2 border-l-2 border-indigo-400" />
                    <span className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 border-b-2 border-r-2 border-indigo-400" />
                  </div>
                </div>

                {/* HUD Bottom Status Bar */}
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-slate-400">SHUTTER</span>
                      <span className="text-sm font-bold text-teal-300">1/250s</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-slate-400">APERTURE</span>
                      <span className="text-sm font-bold text-teal-300">{aperture}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-slate-400">ISO</span>
                      <span className="text-sm font-bold text-teal-300">{iso}</span>
                    </div>
                  </div>

                  {/* Exposure scale and film simulation readout */}
                  <div className="flex items-center gap-3 font-mono">
                    <div className="text-right">
                      <span className="text-[8px] text-slate-400 block uppercase">FILM PROFILE</span>
                      <span className="text-[10px] font-bold text-amber-300 uppercase">{filmStyle}</span>
                    </div>
                    <div className="text-right bg-black/60 px-1.5 py-0.5 rounded border border-white/5 text-[9px]">
                      EV {evValue}
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* VIEWFINDER CONTROLLERS GADGETS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-black/20 p-4 rounded-2xl border border-white/5">
              
              {/* Left sliders block */}
              <div className="space-y-3.5">
                {/* 1. Focal Length Segmented bar */}
                <div className="space-y-1.5">
                  <span className="text-xs text-slate-350 font-mono block">
                    焦距 (Focal Length): <strong className="text-indigo-400">{focalLength}mm</strong>
                  </span>
                  <div className="grid grid-cols-6 gap-1 bg-black/40 p-1 rounded-xl border border-white/5 text-center font-mono text-[9px] text-slate-450 font-semibold select-none">
                    {[18, 35, 50, 85, 135, 200].map(fl => {
                      const active = focalLength === fl;
                      return (
                        <button
                          key={fl}
                          onClick={() => setFocalLength(fl)}
                          className={`py-1 rounded-lg transition cursor-pointer ${
                            active ? 'bg-indigo-600 text-white font-bold' : 'hover:bg-white/5 hover:text-slate-200'
                          }`}
                        >
                          {fl}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Aperture Selective Select */}
                <div className="space-y-1.5">
                  <span className="text-xs text-slate-350 font-mono block">
                    焦内光圈 (Aperture Focus): <strong className="text-indigo-400">{aperture}</strong>
                  </span>
                  <div className="grid grid-cols-4 gap-1.5 font-mono text-[9px] select-none text-center">
                    {['f/1.4', 'f/2.8', 'f/4.0', 'f/5.6', 'f/8.0', 'f/11', 'f/16'].map(ap => {
                      const active = aperture === ap;
                      return (
                        <button
                          key={ap}
                          onClick={() => setAperture(ap)}
                          className={`py-1.5 border rounded-xl cursor-pointer font-bold transition ${
                            active
                              ? 'bg-slate-100 text-slate-900 border-white shadow-sm'
                              : 'bg-black/30 text-slate-400 border-white/5 hover:border-white/10 hover:text-white'
                          }`}
                        >
                          {ap}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right parameters block */}
              <div className="space-y-3.5">
                {/* 3. Film Simulation Presets */}
                <div className="space-y-1.5">
                  <span className="text-xs text-slate-350 font-mono block">
                    底片/胶片模拟 (Film Simulation): <strong className="text-indigo-400">{filmStyle}</strong>
                  </span>
                  <div className="relative select-none">
                    <select
                      value={filmStyle}
                      onChange={(e) => setFilmStyle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-white font-mono text-[11px] rounded-xl px-3.5 py-1.5 focus:outline-none focus:border-slate-700/80 cursor-pointer appearance-none"
                    >
                      <option value="Classic Chrome">FUJIFILM Classic Chrome (经底正片 - 复古暖调)</option>
                      <option value="Velvia">FUJIFILM Velvia (反转胶片 - 极为浓郁饱满)</option>
                      <option value="Acros">FUJIFILM Acros (高对比碳黑 - 极致寂静)</option>
                      <option value="Astia">FUJIFILM Astia (经典柔和 - 多彩风景)</option>
                      <option value="Classic Negative">FUJIFILM Classic Negative (老旧街头胶片)</option>
                    </select>
                    <div className="absolute right-3.5 top-2.5 pointer-events-none w-2 h-2 border-b-2 border-r-2 border-slate-400 transform rotate-45" />
                  </div>
                </div>

                {/* 4. ISO Meter & EV Slider side by side */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-400 font-mono block">ISO (数字感光):</span>
                    <input
                      type="range"
                      min="100"
                      max="6400"
                      step="100"
                      value={iso}
                      onChange={(e) => setIso(parseInt(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-500"
                    />
                    <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                      <span>100</span>
                      <span className="text-indigo-400 font-semibold">{iso}</span>
                      <span>6400</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-400 font-mono block">EV (曝光缩放):</span>
                    <input
                      type="range"
                      min="-2.0"
                      max="2.0"
                      step="0.5"
                      value={evValue}
                      onChange={(e) => setEvValue(parseFloat(e.target.value).toFixed(1))}
                      className="w-full h-1 bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-500"
                    />
                    <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                      <span>-2.0</span>
                      <span className="text-indigo-400 font-semibold">{evValue}</span>
                      <span>+2.0</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* ACTION TRIGGERS SHUTTER */}
            <div className="flex gap-4 items-center">
              <button
                onClick={handleCapturePhotoSnap}
                className="flex-1 py-3 bg-red-600 hover:bg-red-500 hover:scale-[1.01] text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-red-950/40 shadow-lg active:scale-99 transition-all duration-300 uppercase tracking-widest"
              >
                <Camera size={15} />
                按下快门 (Capture Snap!)
              </button>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN (X/Y: 5 COLS) = MIXER & CAMERA ROLL Persistence */}
        <div className="xl:col-span-5 space-y-8">
          
          {/* COMPONENT C: LANDSCAPE MULTI-TRACK AUDIO MIXER */}
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Volume2 size={16} className="text-indigo-400" />
                <h4 className="text-sm font-semibold text-white font-['Noto_Serif_SC']">
                  荒野多轨声景混音台 (Ambient Synth Deck)
                </h4>
              </div>
              <span className="text-[10px] text-indigo-400 font-mono font-bold uppercase">PHYSICAL SYNTH</span>
            </div>

            <p className="text-xs text-slate-350 leading-relaxed font-light">
              不仅仅是简单的雨声。本站依托现代 Web Audio API 高精正弦波及低通滤波器，在本地浏览器物理合成多声道风声、雨滴与篝火，打造最契合您的荒野专注环境。
            </p>

            {/* MASTER COUPLING CONTROL */}
            <button
              onClick={toggleSoundscapeMixer}
              className={`w-full py-2.5 rounded-2xl font-bold font-mono text-xs flex items-center justify-center gap-2 cursor-pointer border transition-all duration-300 ${
                mixerActive
                  ? 'bg-red-500/15 text-red-300 border-red-500/25 shadow-lg shadow-red-950/20'
                  : 'bg-white/10 hover:bg-white/15 text-white border-white/5 shadow-md'
              }`}
            >
              {mixerActive ? (
                <>
                  <VolumeX size={14} className="text-red-400" />
                  <span>停止声景合成 (Stop Ambient Synth)</span>
                </>
              ) : (
                <>
                  <Volume2 size={14} className="text-indigo-400" />
                  <span>启动实时物理声景 (Initiate Multi-Track Synth)</span>
                </>
              )}
            </button>

            {/* THE TRACKS MIX SLIDERS */}
            <div className="space-y-4 pt-2">
              
              {/* TRACK 1: RAIN */}
              <div className={`p-3.5 rounded-2xl border transition duration-300 ${
                mixerActive && !soundMutes.rain ? 'bg-slate-900/40 border-indigo-500/15' : 'bg-black/20 border-transparent opacity-65'
              }`}>
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                    <CloudRain size={13} className="text-indigo-400" />
                    <span>落叶松针雨 (Rhythm of Rain)</span>
                  </div>
                  <button
                    disabled={!mixerActive}
                    onClick={() => handleLiveToggleMute('rain')}
                    className="disabled:opacity-30 disabled:cursor-not-allowed text-[10px] font-mono px-2 py-0.5 rounded cursor-pointer hover:bg-white/5 transition text-slate-400"
                  >
                    {soundMutes.rain ? '已静音' : '激活中'}
                  </button>
                </div>
                
                <div className="grid grid-cols-12 gap-3 items-center">
                  <div className="col-span-10">
                    <input
                      type="range"
                      min="0.0"
                      max="0.35"
                      step="0.01"
                      disabled={!mixerActive}
                      value={soundVolumes.rain}
                      onChange={(e) => handleLiveVolumeSlide('rain', parseFloat(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-full appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed accent-indigo-500"
                    />
                  </div>
                  <span className="col-span-2 text-right font-mono text-[10px] text-slate-400">
                    {Math.round(soundVolumes.rain * 100 / 0.35)}%
                  </span>
                </div>
              </div>

              {/* TRACK 2: CRACKLING CAMPFIRE */}
              <div className={`p-3.5 rounded-2xl border transition duration-300 ${
                mixerActive && !soundMutes.fire ? 'bg-slate-900/40 border-indigo-500/15' : 'bg-black/20 border-transparent opacity-65'
              }`}>
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                    <Flame size={13} className="text-orange-400" />
                    <span>林间红松篝火 (Woodland Bonfire)</span>
                  </div>
                  <button
                    disabled={!mixerActive}
                    onClick={() => handleLiveToggleMute('fire')}
                    className="disabled:opacity-30 disabled:cursor-not-allowed text-[10px] font-mono px-2 py-0.5 rounded cursor-pointer hover:bg-white/5 transition text-slate-400"
                  >
                    {soundMutes.fire ? '已静音' : '激活中'}
                  </button>
                </div>

                <div className="grid grid-cols-12 gap-3 items-center">
                  <div className="col-span-10">
                    <input
                      type="range"
                      min="0.0"
                      max="0.35"
                      step="0.01"
                      disabled={!mixerActive}
                      value={soundVolumes.fire}
                      onChange={(e) => handleLiveVolumeSlide('fire', parseFloat(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-full appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed accent-indigo-500"
                    />
                  </div>
                  <span className="col-span-2 text-right font-mono text-[10px] text-slate-400">
                    {Math.round(soundVolumes.fire * 100 / 0.35)}%
                  </span>
                </div>
              </div>

              {/* TRACK 3: OCEAN TIDES OR HIGHLAND GALE */}
              <div className={`p-3.5 rounded-2xl border transition duration-300 ${
                mixerActive && !soundMutes.tide ? 'bg-slate-900/40 border-indigo-500/15' : 'bg-black/20 border-transparent opacity-65'
              }`}>
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                    <Waves size={13} className="text-sky-300" />
                    <span>潮起海浪呼吸 (Breathing Tides)</span>
                  </div>
                  <button
                    disabled={!mixerActive}
                    onClick={() => handleLiveToggleMute('tide')}
                    className="disabled:opacity-30 disabled:cursor-not-allowed text-[10px] font-mono px-2 py-0.5 rounded cursor-pointer hover:bg-white/5 transition text-slate-400"
                  >
                    {soundMutes.tide ? '已静音' : '激活中'}
                  </button>
                </div>

                <div className="grid grid-cols-12 gap-3 items-center">
                  <div className="col-span-10">
                    <input
                      type="range"
                      min="0.0"
                      max="0.35"
                      step="0.01"
                      disabled={!mixerActive}
                      value={soundVolumes.tide}
                      onChange={(e) => handleLiveVolumeSlide('tide', parseFloat(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-full appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed accent-indigo-500"
                    />
                  </div>
                  <span className="col-span-2 text-right font-mono text-[10px] text-slate-400">
                    {Math.round(soundVolumes.tide * 100 / 0.35)}%
                  </span>
                </div>
              </div>

            </div>

            {/* EQ GRAPHICAL MICRO VISUALIZER */}
            {mixerActive && (
              <div className="flex items-end justify-center gap-1 h-8 pt-3 border-t border-white/5 select-none overflow-hidden">
                {[...Array(24)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      height: [
                        '15%', 
                        `${20 + Math.random() * 80}%`, 
                        `${20 + Math.random() * 80}%`, 
                        '15%'
                      ]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.8 + Math.random() * 0.9,
                      ease: 'easeInOut'
                    }}
                    className="w-1.5 bg-indigo-500/40 rounded-full shrink-0"
                    style={{ height: '30%' }}
                  />
                ))}
              </div>
            )}

          </div>

          {/* COMPONENT D: LIGHTBOX PHOTOROLL / EXIF LOGS PERSISTENCE */}
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
              <div className="flex items-center gap-1.5">
                <ImageIcon size={15} className="text-indigo-400" />
                <h4 className="text-sm font-semibold text-white font-['Noto_Serif_SC']">
                  我的摄影轻胶卷 (My Captured Roll)
                </h4>
              </div>
              <span className="text-[10px] text-slate-500 font-mono font-bold uppercase bg-slate-905 px-2 py-0.5 rounded border border-white/5">
                EXIF DATALOG ({cameraRoll.length})
              </span>
            </div>

            <p className="text-[11px] text-slate-400 leading-normal font-light">
              您在上方 Viewfinder 模拟器中每一次按下的快门，都会用纯代数形式生成一卷数微底片，并精准捕捉您当时的各种透射指标设定，储存在您的浏览器存储介质中。
            </p>

            {cameraRoll.length === 0 ? (
              <div className="py-14 text-center border border-dashed border-white/5 rounded-2xl text-slate-450 text-xs text-light space-y-2 select-none">
                <CameraOff size={28} className="mx-auto text-slate-500/40" />
                <p>轻胶卷空空如也。</p>
                <p className="text-[10px] text-slate-500">点按上方红色大快门来捕获你的第一卷荒野瞬间吧！</p>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2.5 max-h-[285px] overflow-y-auto pr-1">
                {cameraRoll.map((snap) => (
                  <button
                    key={snap.id}
                    onClick={() => setSelectedPhotoForView(snap)}
                    className="aspect-square rounded-xl overflow-hidden relative border border-white/5 cursor-pointer bg-slate-900 group shrink-0 shadow"
                  >
                    <img
                      src={snap.imageUrl}
                      alt="Captured Polaroid"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300 filter saturate-[80%]"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Exif overlay tags readouts on hover */}
                    <div className="absolute inset-0 bg-slate-950/75 opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-between p-2 font-mono text-[8px] text-white select-none">
                      <div className="flex justify-between">
                        <span className="text-teal-400 font-bold">{snap.exif.focalLength}</span>
                        <span className="text-amber-400 font-bold">{snap.exif.aperture}</span>
                      </div>
                      <div className="truncate text-[7px] text-slate-400 text-left">
                        {snap.themeName.split(' · ')[0]}
                      </div>
                      <div className="flex justify-between items-center border-t border-white/10 pt-1 leading-none text-slate-400">
                        <span>ISO {snap.exif.iso}</span>
                        {/* delete button */}
                        <span
                          onClick={(e) => handleDeleteSnap(snap.id, e)}
                          className="text-red-400 hover:text-red-300 p-0.5 cursor-pointer text-[10px]"
                        >
                          ×
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* PERSISTED SOUVENIR POSTCARDS GALLERY */}
            <div className="pt-4 border-t border-white/5 space-y-3.5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-white font-['Noto_Serif_SC']">
                  我珍藏的荒野明信片 ({savedPostcards.length})
                </span>
                <span className="text-[9px] text-slate-500 font-mono">POSTCARDS STORAGE</span>
              </div>

              {savedPostcards.length === 0 ? (
                <p className="text-[10px] text-slate-500 text-center py-2 font-light">
                  您目前还没有制作过印花明信片。点击左侧的【制作山野寄信】为微信好友制作一张吧！
                </p>
              ) : (
                <div className="space-y-2.5 max-h-[140px] overflow-y-auto pr-1">
                  {savedPostcards.map(card => (
                    <div
                      key={card.id}
                      className="p-3 bg-slate-950/40 border border-white/5 rounded-2xl flex justify-between items-center hover:bg-slate-900/50 transition cursor-pointer"
                      onClick={() => {
                        // Quick popup postcard view
                        alert(`【明信片寄送预览】\n收信人: To ${card.to}\n寄信人: From ${card.from}\n位置: ${card.locationName} (${card.coords})\n日期: ${card.date}\n内容:\n${card.text}`);
                      }}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-lg overflow-hidden border border-white/5 bg-black/20 shrink-0">
                          <img
                            src={card.imageUrl}
                            alt="Souvenir"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="min-w-0 font-mono text-[10px]">
                          <div className="text-slate-100 font-semibold truncate flex items-center gap-1.5">
                            <span>To: {card.to}</span>
                            <span className="text-slate-500">|</span>
                            <span className="text-slate-400">From: {card.from}</span>
                          </div>
                          <p className="text-[9px] text-slate-450 truncate mt-0.5">{card.locationName.split(' · ')[0]} · {card.date}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 font-mono text-[9px] shrink-0">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[8px] font-bold">
                          已盖邮戳
                        </span>
                        <button
                          onClick={(e) => handleDeletePostcard(card.id, e)}
                          className="text-red-400 hover:text-red-300 p-1 cursor-pointer font-bold text-xs"
                          title="删除"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* --- POPUP LIGHTBOX PORTRAIT IMAGE FULL LOG PREVIEW --- */}
      <AnimatePresence>
        {selectedPhotoForView && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden p-6 shadow-2xl flex flex-col md:flex-row gap-6 font-mono select-none"
            >
              
              {/* Close node */}
              <button
                onClick={() => setSelectedPhotoForView(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-white/5 transition cursor-pointer z-10"
              >
                <X size={18} />
              </button>

              {/* Photo backdrop */}
              <div className="md:w-1/2 aspect-square rounded-2xl overflow-hidden relative border border-white/5 bg-black/40">
                <img
                  src={selectedPhotoForView.imageUrl}
                  alt={selectedPhotoForView.themeName}
                  className="w-full h-full object-cover"
                  style={{
                    filter: getFilmFilterCSS()
                  }}
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Exif and log side */}
              <div className="md:w-1/2 flex flex-col justify-between space-y-4 pt-1">
                <div className="space-y-4">
                  <div>
                    <span className="text-[9px] text-slate-450 block uppercase tracking-wider">LOCATION PHOTOGRAPH</span>
                    <h3 className="text-base font-black text-white font-['Noto_Serif_SC'] tracking-tight mt-0.5">
                      {selectedPhotoForView.themeName}
                    </h3>
                  </div>

                  <hr className="border-white/5" />

                  {/* EXIF Grid details */}
                  <div className="space-y-2 text-[11px] text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-500">相机机身:</span>
                      <span className="text-white text-right">{selectedPhotoForView.exif.camera}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">镜头画幅:</span>
                      <span className="text-slate-300 text-right truncate max-w-[160px]">{selectedPhotoForView.exif.lens}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">焦距尺度:</span>
                      <span className="text-indigo-400 font-bold">{selectedPhotoForView.exif.focalLength}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">镜头光圈:</span>
                      <span className="text-teal-400 font-bold">{selectedPhotoForView.exif.aperture}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">数字感光度:</span>
                      <span className="text-amber-400 font-bold">ISO {selectedPhotoForView.exif.iso}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">曝光标差:</span>
                      <span className="text-slate-300">{selectedPhotoForView.exif.ev}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">底片胶卷色彩:</span>
                      <span className="bg-amber-500/10 text-amber-300 px-1.5 rounded text-[10px] font-bold uppercase">{selectedPhotoForView.exif.filmSimulation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">离焦拍取时间:</span>
                      <span className="text-slate-400">{selectedPhotoForView.exif.time}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex gap-2">
                  <button
                    onClick={() => setSelectedPhotoForView(null)}
                    className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 text-[11px] font-bold rounded-xl cursor-pointer transition text-center"
                  >
                    返回胶卷
                  </button>
                  <button
                    onClick={() => alert("【摄影数码原片导出】\n正在导出高精度 100M 像素 DNG 底片数据到本地设备...\n由于 AI Studio 运行在沙盒容器中，目前已为您提供最高清晰度 Unsplash 源文件。可以直接右键图片进行保存。")}
                    className="py-1.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold rounded-xl cursor-pointer transition flex items-center justify-center gap-1 shadow"
                  >
                    <Download size={12} />
                    导出DNG
                  </button>
                </div>

              </div>

            </motion.div>

          </div>
        )}
      </AnimatePresence>

      {/* --- POSTCARD DYNAMIC FORMS MODAL --- */}
      <AnimatePresence>
        {postcardModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden p-6 md:p-8 flex flex-col lg:flex-row gap-6 shadow-2xl font-mono select-none"
            >
              
              <button
                onClick={() => setPostcardModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-white/5 transition cursor-pointer z-10"
              >
                <X size={18} />
              </button>

              {/* POSTCARD CHASSIS VISUAL DESIGN (LEFT FORM, RIGHT REAL-TIME PREVIEW) */}
              <div className="w-full lg:w-5/12 space-y-4">
                <div>
                  <span className="text-[9px] text-pink-400 font-bold uppercase tracking-widest block">POSTCARD EDITOR</span>
                  <h3 className="text-base font-black text-white font-['Noto_Serif_SC'] mt-0.5">
                    山野寄信编辑器
                  </h3>
                </div>

                <div className="space-y-3 font-sans text-xs">
                  
                  {/* Sender & Receiver Inputs */}
                  <div className="grid grid-cols-2 gap-3 font-mono">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 block font-mono">收件人 (To Name):</label>
                      <input
                        type="text"
                        maxLength={12}
                        placeholder="小王、阿鹿"
                        value={postcardTo}
                        onChange={(e) => setPostcardTo(e.target.value)}
                        className="w-full px-3 py-1.5 bg-black/40 border border-slate-800 rounded-xl focus:outline-none focus:border-slate-700/80 text-white text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 block font-mono">寄件人 (From Name):</label>
                      <input
                        type="text"
                        maxLength={12}
                        placeholder="林暮野、阿飞"
                        value={postcardFrom}
                        onChange={(e) => setPostcardFrom(e.target.value)}
                        className="w-full px-3 py-1.5 bg-black/40 border border-slate-800 rounded-xl focus:outline-none focus:border-slate-700/80 text-white text-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* Slogans preset buttons */}
                  <div className="space-y-1 block">
                    <span className="text-[10px] text-slate-400 block font-mono">诗意模板金句 (Mantra Selector):</span>
                    <div className="flex flex-wrap gap-1.5 pt-0.5 select-none">
                      {[
                        '愿你在繁琐的数字世界外，终会于高山松涛中获取不竭之纯净能量。',
                        '愿落日熔金的圣洁雪山，抚平你所有的疲劳。青山无恙，祝你夜夜安眠。',
                        '代码只是生活的落脚点，原野才是灵魂的重置器。愿你心里有雪，眼里有光。'
                      ].map((sentence, idx) => (
                        <button
                          key={sentence}
                          onClick={() => setPostcardText(sentence)}
                          className="px-2 py-1 bg-black/40 hover:bg-slate-800/80 rounded-lg text-[9px] text-slate-400 hover:text-white truncate max-w-[200px] text-left cursor-pointer border border-white/5"
                        >
                          金句 {idx + 1}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Core Text Box Area */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 block font-mono">自定义明信片内容 (Body Message):</label>
                    <textarea
                      rows={4}
                      maxLength={180}
                      placeholder="写下你真诚的荒野问候..."
                      value={postcardText}
                      onChange={(e) => setPostcardText(e.target.value)}
                      className="w-full px-3 py-2 bg-black/40 border border-slate-800 rounded-xl focus:outline-none focus:border-slate-700/80 text-white text-[11px] leading-relaxed resize-none"
                    />
                    <div className="text-right text-[8px] text-slate-500 select-none">
                      {postcardText.length} / 180 字符
                    </div>
                  </div>

                  {/* Theme Card Style presets */}
                  <div className="space-y-1 block">
                    <span className="text-[10px] text-slate-400 block font-mono">明信片视觉卡纸 (Theme Paper Preset):</span>
                    <div className="grid grid-cols-3 gap-1.5 font-mono text-[9px] select-none text-center pt-0.5">
                      {[
                        { id: 'polaroid', label: '拍立得白卡' },
                        { id: 'retro', label: '羊皮纸金黄' },
                        { id: 'cosmic', label: '太空灰寂夜' }
                      ].map(pap => {
                        const active = postcardTemplate === pap.id;
                        return (
                          <button
                            key={pap.id}
                            onClick={() => setPostcardTemplate(pap.id)}
                            className={`py-1 border rounded-lg cursor-pointer transition ${
                              active
                                ? 'bg-indigo-600 text-white border-indigo-500 font-bold shadow'
                                : 'bg-black/30 text-slate-400 border-white/5 hover:bg-white/5 hover:text-white'
                            }`}
                          >
                            {pap.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>

              </div>

              {/* REAL-TIME PREVIEWING CHASSIS (RIGHT PANEL - DESIGN) */}
              <div className="w-full lg:w-7/12 flex flex-col justify-between">
                
                {/* Visual rendering box */}
                <div className="h-full flex items-center justify-center p-3">
                  
                  {/* Polaroid Frame */}
                  <div className={`w-full max-w-sm rounded-xl p-4 shadow-2xl flex flex-col gap-3 text-slate-900 border ${
                    postcardTemplate === 'polaroid' 
                      ? 'bg-slate-100 border-slate-300' 
                      : postcardTemplate === 'retro'
                        ? 'bg-amber-50/95 border-amber-200 text-amber-950 font-serif'
                        : 'bg-slate-950 border-slate-800 text-slate-100'
                  }`} id="postcard-visual-canvas">
                    
                    {/* Picture border block */}
                    <div className="aspect-[4/3] rounded-lg overflow-hidden relative border border-black/5 bg-slate-200">
                      <img
                        src={selectedSpot.imageUrl}
                        alt="Postcard View"
                        className="w-full h-full object-cover filter brightness-[0.8] saturate-[95%]"
                        referrerPolicy="no-referrer"
                      />
                      {/* Top right postage stamp water stamp */}
                      <div className="absolute top-2.5 right-2.5 w-11 h-11 border border-dashed border-white/40 flex flex-col items-center justify-center rounded bg-black/35 font-mono text-[6px] text-white/70 select-none scale-90">
                        <Compass size={12} className="animate-spin text-white mb-0.5" style={{ animationDuration: '80s' }} />
                        <span>STAMP</span>
                      </div>

                      {/* Coordinates footprint */}
                      <div className="absolute bottom-2 left-2.5 px-2 py-0.5 bg-black/60 rounded text-[7px] text-slate-300 border border-white/10 font-mono">
                        🧭 {selectedSpot.coords}
                      </div>
                    </div>

                    {/* Writing bottom section block */}
                    <div className="flex justify-between items-start gap-4 p-1 leading-relaxed">
                      
                      {/* Left Letter Content */}
                      <div className="flex-1 space-y-2 text-left">
                        <div className="text-[11px] font-bold tracking-tight border-b border-black/10 pb-0.5 truncate">
                          To: <span className="font-semibold">{postcardTo || '_______'}</span>
                        </div>
                        <p className="text-[9px] min-h-[50px] leading-relaxed whitespace-pre-wrap select-text font-light antialiased">
                          {postcardText || '在此写下您对挚友的温柔问语...'}
                        </p>
                        <div className="text-[9px] font-bold text-right pr-2">
                          From: <span className="underline">{postcardFrom || '_______'}</span>
                        </div>
                      </div>

                      {/* Right stamp post marks details */}
                      <div className="w-[85px] border-l border-dashed border-black/15 pl-3 flex flex-col items-center justify-center text-center py-2 select-none shrink-0 text-[7px] text-slate-500 font-mono space-y-1 pt-4">
                        <div className="w-10 h-10 rounded-full border-2 border-indigo-500/25 flex flex-col items-center justify-center p-0.5 text-indigo-500/40 relative scale-95 uppercase leading-none font-bold">
                          <span>WILD</span>
                          <span className="text-[4px] mt-0.5">POSTAL</span>
                          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-indigo-500/10 transform -translate-y-1/2" />
                        </div>
                        <span className="text-[6px] text-slate-400 block font-sans font-light pt-1">VistaBlog © 2026</span>
                        <span className="text-[6px] text-slate-500 block">{selectedSpot.elevation}</span>
                      </div>

                    </div>

                  </div>

                </div>

                {/* Confirm trigger bottom */}
                <div className="flex gap-2 pt-3 border-t border-white/5 font-mono">
                  <button
                    onClick={() => setPostcardModal(false)}
                    className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 text-[11px] font-bold rounded-xl cursor-pointer transition text-center"
                  >
                    取消制作
                  </button>
                  <button
                    onClick={handleStampAndSavePostcard}
                    disabled={stampingPostcard}
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-[11px] font-bold rounded-xl cursor-pointer transition flex items-center justify-center gap-1 shadow"
                  >
                    {stampingPostcard ? (
                      <>
                        <RefreshCw size={11} className="animate-spin text-white" />
                        <span>正在盖印邮戳...</span>
                      </>
                    ) : (
                      <>
                        <Check size={12} />
                        <span>签盖邮戳并珍藏</span>
                      </>
                    )}
                  </button>
                </div>

              </div>

            </motion.div>

          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
