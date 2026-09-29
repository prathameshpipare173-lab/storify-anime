'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, History, Sparkles } from 'lucide-react';
import { DialogueLine } from '@/lib/types';
import { audio } from '@/lib/audio';

interface BacklogModalProps {
  dialogues: DialogueLine[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onSelectConcept?: (name: string) => void;
}

export const BacklogModal: React.FC<BacklogModalProps> = ({
  dialogues,
  currentIndex,
  isOpen,
  onClose,
  onSelectConcept,
}) => {
  if (!isOpen) return null;

  const pastLines = dialogues.slice(0, currentIndex + 1);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="relative w-full max-w-2xl max-h-[80vh] flex flex-col rounded-3xl border border-slate-700 bg-slate-950/95 text-white shadow-2xl p-6 backdrop-blur-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-amber-400" />
              <h3 className="text-xl font-bold font-anime">Dialogue Backlog / Chronicle</h3>
            </div>
            <button
              onClick={() => {
                audio.playMenuClick();
                onClose();
              }}
              className="rounded-full p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Lines list */}
          <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-2">
            {pastLines.length === 0 ? (
              <div className="text-center text-slate-500 py-12">No previous dialogue yet.</div>
            ) : (
              pastLines.map((line, idx) => (
                <div
                  key={line.id || idx}
                  className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3"
                >
                  {line.avatarUrl && line.side !== 'narrator' ? (
                    <img
                      src={line.avatarUrl}
                      alt={line.speakerName}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-700 shrink-0 mt-0.5"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-mono text-slate-400 shrink-0">
                      SYS
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-cyan-300">
                        {line.speakerName}
                      </span>
                      {line.speakerTitle && (
                        <span className="text-[11px] text-slate-500">
                          {line.speakerTitle}
                        </span>
                      )}
                    </div>
                    <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
                      {line.text.replace(/\[\[(.*?)\]\]/g, '$1')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-slate-800 text-xs text-slate-500 flex justify-between">
            <span>Logged lines: {pastLines.length}</span>
            <span className="font-mono">Visual Novel Narrative Engine</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
