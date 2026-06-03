import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  ComposedChart
} from 'recharts';
import { TrendingUp, Eye, Heart, Clock, Award, Flame, Calendar, ChevronRight } from 'lucide-react';
import { BackgroundTheme } from '../types';

interface WeeklyViewsChartProps {
  currentTheme: BackgroundTheme;
  style: {
    accentText: string;
    accentBg: string;
    accentBorder: string;
    accentBtn: string;
    accentGlow: string;
    badgeClass: string;
    colorName: string;
  };
}

interface ViewRecord {
  date: string;
  views: number;
  likes: number;
  topPost: string;
  durationSec: number;
}

const WEEKLY_DATA: ViewRecord[] = [
  { date: '05-28 周四', views: 420, likes: 28, topPost: '西藏阿里 · 孤峰绝壁与极境心流', durationSec: 145 },
  { date: '05-29 周五', views: 580, likes: 42, topPost: '利用 Web Audio 纯代码合成大自然白噪音的技术探索', durationSec: 182 },
  { date: '05-30 周六', views: 850, likes: 78, topPost: '川西行纪：里索海暮色下的贡嘎群山', durationSec: 210 },
  { date: '05-31 周日', views: 920, likes: 112, topPost: '川西行纪：里索海暮色下的贡嘎群山', durationSec: 245 },
  { date: '06-01 周一', views: 610, likes: 49, topPost: '数字极简生活的第三年：远离噪音后，我收获了什么', durationSec: 155 },
  { date: '06-02 周二', views: 490, likes: 35, topPost: '数字极简生活的第三年：远离噪音后，我收获了什么', durationSec: 138 },
  { date: '06-03 今日', views: 530, likes: 48, topPost: '冰岛游记 · 玄武岩布迪尔教堂与欧若拉的挽歌', durationSec: 194 }
];

const THEME_HEX_COLORS: Record<string, string> = {
  'forest-lake': '#10b981',    // Emerald
  'misty-mountain': '#f59e0b',  // Amber
  'starry-peaks': '#6366f1',    // Indigo
  'sunrise-ocean': '#06b6d4',   // Cyan
  'winter-dawn': '#14b8a6'      // Teal
};

export default function WeeklyViewsChart({ currentTheme, style }: WeeklyViewsChartProps) {
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(6); // Default to today (index 6)

  const activeColorHex = THEME_HEX_COLORS[currentTheme.id] || '#10b981';
  const activeDay = WEEKLY_DATA[selectedDayIdx];

  // Calculate aggregates
  const totalViews = WEEKLY_DATA.reduce((sum, item) => sum + item.views, 0);
  const totalLikes = WEEKLY_DATA.reduce((sum, item) => sum + item.likes, 0);
  const avgDuration = Math.round(WEEKLY_DATA.reduce((sum, item) => sum + item.durationSec, 0) / WEEKLY_DATA.length);
  const likeRatio = ((totalLikes / totalViews) * 100).toFixed(1);

  // Formatting utility for reading duration
  const formatDurationHex = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainingSecs = sec % 60;
    return `${mins}分${remainingSecs}秒`;
  };

  // Custom Tick styling for X & Y Axes to keep theme unified
  const renderCustomAxisTick = (props: any) => {
    const { x, y, payload } = props;
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={12}
          textAnchor="middle"
          fill="#94a3b8"
          fontSize={10}
          fontFamily="monospace"
          className="opacity-80"
        >
          {payload.value}
        </text>
      </g>
    );
  };

  // Custom tooltips styling for dark/atmospheric look
  const CustomChartTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as ViewRecord;
      return (
        <div className="bg-slate-950/90 border border-white/10 backdrop-blur-md px-3.5 py-2.5 rounded-xl shadow-xl flex flex-col gap-1 select-none pointer-events-none text-left">
          <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
            <Calendar size={10} />
            {data.date}
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeColorHex }} />
            <span className="text-xs font-bold text-white font-mono">阅读量(Views): {data.views} 次</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            <span className="text-xs text-slate-350 font-mono">获得互动: {data.likes} 个赞</span>
          </div>
          <span className="text-[9px] text-slate-450 mt-1 max-w-[170px] truncate block">
            ⭐ 焦点博文: {data.topPost}
          </span>
        </div>
      );
    };
    return null;
  };

  return (
    <div className="p-5 bg-slate-950/20 border border-white/5 rounded-2xl space-y-6" id="personal-reading-analytics">
      
      {/* Visual Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-white/5 pb-4">
        <div>
          <h4 className="text-sm font-semibold text-white flex items-center gap-2 font-['Noto_Serif_SC']">
            <TrendingUp size={15} style={{ color: activeColorHex }} />
            最近一周博文阅读趋势 (Past 7 Days Engagement Trend)
          </h4>
          <p className="text-[11px] text-slate-400 mt-1 font-light">
            通过高精度记录评估内容传播热度，用流动折线感知群友心中的思想共振。
          </p>
        </div>
        
        {/* Dynamic Badge indicating current highlight */}
        <span className={`px-2.5 py-1 rounded-xl text-[10px] font-mono border self-start sm:self-center font-bold tracking-tight shadow-md flex items-center gap-1 ${style.badgeClass}`}>
          <Flame size={11} />
          周累积阅读量: {totalViews} 次
        </span>
      </div>

      {/* Grid of aggregates */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="p-3 bg-slate-950/40 rounded-xl border border-white/5 flex flex-col justify-between">
          <span className="text-[9px] text-slate-450 font-mono tracking-wider flex items-center gap-1 uppercase">
            <Eye size={10} /> WEEKLY VIEWS
          </span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-lg font-black text-white font-mono">{totalViews}</span>
            <span className="text-[9px] text-emerald-400 font-mono font-bold">+18.5%</span>
          </div>
        </div>

        <div className="p-3 bg-slate-950/40 rounded-xl border border-white/5 flex flex-col justify-between">
          <span className="text-[9px] text-slate-450 font-mono tracking-wider flex items-center gap-1 uppercase">
            <Heart size={10} className="text-red-400" /> TOTAL ENGAGING
          </span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-lg font-black text-white font-mono">{totalLikes}</span>
            <span className="text-[9px] text-emerald-400 font-mono font-bold">{likeRatio}% 赞率</span>
          </div>
        </div>

        <div className="p-3 bg-slate-950/40 rounded-xl border border-white/5 flex flex-col justify-between">
          <span className="text-[9px] text-slate-450 font-mono tracking-wider flex items-center gap-1 uppercase">
            <Clock size={10} /> AVG RETENTION
          </span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-lg font-black text-white font-mono">{formatDurationHex(avgDuration).replace('分', '′').replace('秒', '″')}</span>
            <span className="text-[9px] text-slate-400 font-mono">深度长读</span>
          </div>
        </div>

        <div className="p-3 bg-slate-950/40 rounded-xl border border-white/5 flex flex-col justify-between">
          <span className="text-[9px] text-slate-450 font-mono tracking-wider flex items-center gap-1 uppercase">
            <Award size={10} /> ACTIVE RETENTION
          </span>
          <div className="mt-1">
            <span className="text-[11px] font-semibold text-white block truncate leading-tight mt-0.5">
              生活与绝境摄影
            </span>
          </div>
        </div>

      </div>

      {/* THE COPOSED/LINE CHART IN OUTLINE */}
      <div className="h-[220px] w-full bg-slate-950/20 rounded-xl border border-white/5 p-2" id="recharts-linechart-wrap">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={WEEKLY_DATA}
            margin={{ top: 12, right: 8, left: -22, bottom: 4 }}
            onClick={(state) => {
              if (state && state.activeTooltipIndex !== undefined) {
                setSelectedDayIdx(state.activeTooltipIndex);
              }
            }}
          >
            <defs>
              <linearGradient id="viewsChartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={activeColorHex} stopOpacity={0.16} />
                <stop offset="95%" stopColor={activeColorHex} stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.03)" />
            
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={renderCustomAxisTick}
            />
            
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#94a3b8', fontSize: 9, fontFamily: 'monospace', opacity: 0.7 }}
            />
            
            <Tooltip content={<CustomChartTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.06)', strokeWidth: 1 }} />
            
            {/* Soft gradient underneath views line */}
            <Area
              type="monotone"
              dataKey="views"
              stroke="none"
              fill="url(#viewsChartGradient)"
              activeDot={false}
            />

            {/* Main Views Line Trend */}
            <Line
              type="monotone"
              dataKey="views"
              stroke={activeColorHex}
              strokeWidth={2.5}
              dot={{ r: 4, strokeWidth: 1.5, stroke: '#020617', fill: activeColorHex }}
              activeDot={{ r: 6, strokeWidth: 2, stroke: '#ffffff', fill: activeColorHex }}
              animationDuration={800}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white/5 p-1 rounded-xl flex font-mono text-[9px] text-slate-400 justify-between items-center px-3 border border-white/5 select-none">
        <span>💡 点击折线图对应节点，即可在下方实时穿透查看当天的多维数据面板</span>
        <span className="text-white font-bold opacity-60">RECHARTS ENGINE v2.12</span>
      </div>

      {/* SELECTED DAY FULL DETAIL DETAILS */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedDayIdx}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="p-4 bg-slate-950/40 rounded-xl border border-white/5 space-y-3"
          id="detailed-day-panel"
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-black text-white font-['Noto_Serif_SC'] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: activeColorHex }} />
              {activeDay.date} 详细穿透指标
            </span>
            <span className="text-[10px] text-slate-400 font-mono">DETAILED TELEMETRY LATCHED</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1.5">
            
            <div className="flex items-center gap-2.5 bg-black/35 p-2 rounded-lg border border-white/5">
              <div className="py-1 px-1.5 rounded bg-white/5 text-[10px] font-semibold text-slate-350 shrink-0">PV</div>
              <div className="min-w-0 font-mono">
                <span className="text-[9px] text-slate-500 block uppercase">阅览次数</span>
                <span className="text-sm font-black text-white">{activeDay.views} 次</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-black/35 p-2 rounded-lg border border-white/5">
              <div className="py-1 px-1.5 rounded bg-red-550/10 text-[10px] font-semibold text-red-400 shrink-0">LIKES</div>
              <div className="min-w-0 font-mono">
                <span className="text-[9px] text-slate-500 block uppercase">收到互动</span>
                <span className="text-sm font-black text-red-400">{activeDay.likes} 人赞过</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-black/35 p-2 rounded-lg border border-white/5">
              <div className="py-1 px-1.5 rounded bg-white/5 text-[10px] font-semibold text-slate-350 shrink-0">STAY</div>
              <div className="min-w-0 font-mono">
                <span className="text-[9px] text-slate-500 block uppercase">平均阅读时长</span>
                <span className="text-sm font-black text-teal-300">{formatDurationHex(activeDay.durationSec)}</span>
              </div>
            </div>

          </div>

          <div className="mt-2.5 p-2.5 bg-slate-900/40 rounded-lg border border-white/5 flex items-start gap-1.5">
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/15 shrink-0 font-mono flex items-center gap-1 mt-0.5 select-none">
              <Award size={10} />
              榜首聚焦文
            </span>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-slate-100 hover:underline cursor-pointer block truncate">
                {activeDay.topPost}
              </span>
              <span className="text-[10px] text-slate-455 block leading-normal mt-0.5">
                当天阅读总量中约有 {Math.round(activeDay.views * (0.32 + 0.12 * (selectedDayIdx % 3)))} 次 (约 {Math.round((0.32 + 0.12 * (selectedDayIdx % 3)) * 100)}%) 来源于此核心文章及其评论互动区。
              </span>
            </div>
          </div>

        </motion.div>
      </AnimatePresence>

    </div>
  );
}
