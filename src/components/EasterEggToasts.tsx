import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import type { EasterEggToast } from '../hooks/useEasterEggs';

interface EasterEggToastsProps {
  toasts: EasterEggToast[];
  onDismiss: (id: string) => void;
}

export default function EasterEggToasts({ toasts, onDismiss }: EasterEggToastsProps) {
  return (
    <div className="fixed top-20 right-4 z-[60] flex flex-col gap-2 pointer-events-none max-w-xs">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 40, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20 }}
            className="pointer-events-auto glass-panel rounded-2xl p-4 border border-amber-500/20 shadow-lg"
          >
            <div className="flex gap-3">
              <span className="text-2xl">{t.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white">{t.title}</p>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{t.body}</p>
              </div>
              <button
                type="button"
                onClick={() => onDismiss(t.id)}
                className="text-slate-500 hover:text-white shrink-0 cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
