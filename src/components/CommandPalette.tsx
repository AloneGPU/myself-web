import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Command, Search, Sparkles, Trash2, PenLine, Compass, Volume2 } from 'lucide-react';

export interface CommandAction {
  id: string;
  label: string;
  hint?: string;
  icon?: React.ReactNode;
  run: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  actions: CommandAction[];
}

export default function CommandPalette({ open, onClose, actions }: CommandPaletteProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (open) setQuery('');
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter(
      (a) =>
        a.label.toLowerCase().includes(q) ||
        a.hint?.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q),
    );
  }, [actions, query]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-start justify-center pt-[12vh] p-4 bg-slate-950/70 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, y: -8 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: -8 }}
            className="w-full max-w-lg glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
              <Command size={18} className="text-slate-500" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索指令：管理、创作、彩蛋、主题…"
                className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
              />
              <kbd className="text-[10px] text-slate-500 font-mono px-1.5 py-0.5 rounded border border-white/10">Esc</kbd>
            </div>
            <ul className="max-h-72 overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <li className="text-center text-sm text-slate-500 py-8">没有匹配的指令</li>
              ) : (
                filtered.map((action) => (
                  <li key={action.id}>
                    <button
                      type="button"
                      onClick={() => {
                        action.run();
                        onClose();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm text-slate-200 hover:bg-white/10 transition cursor-pointer"
                    >
                      <span className="text-slate-400">{action.icon ?? <Search size={16} />}</span>
                      <span className="flex-1 font-medium">{action.label}</span>
                      {action.hint && <span className="text-[10px] text-slate-500 font-mono">{action.hint}</span>}
                    </button>
                  </li>
                ))
              )}
            </ul>
            <div className="px-4 py-2 border-t border-white/5 text-[10px] text-slate-500 font-mono flex gap-3">
              <span className="flex items-center gap-1"><Sparkles size={10} /> 输入 vista 有惊喜</span>
              <span>↑↑↓↓←→←→BA</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const paletteIcons = {
  write: <PenLine size={16} />,
  manage: <Trash2 size={16} />,
  theme: <Compass size={16} />,
  sound: <Volume2 size={16} />,
  sparkles: <Sparkles size={16} />,
};
