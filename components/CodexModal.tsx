'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Book, Search, Sparkles, ShieldCheck, Brain, ExternalLink } from 'lucide-react';
import { Concept, SubGenre } from '@/lib/types';
import { audio } from '@/lib/audio';

interface CodexModalProps {
  isOpen: boolean;
  onClose: () => void;
  concepts: Concept[];
  masteredIds: string[];
  onSelectConcept: (concept: Concept) => void;
}

export const CodexModal: React.FC<CodexModalProps> = ({
  isOpen,
  onClose,
  concepts,
  masteredIds,
  onSelectConcept,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  if (!isOpen) return null;

  const categories = ['all', ...Array.from(new Set(concepts.map((c) => c.category)))];

  const filtered = concepts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.textbookDefinition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.animeLore.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filterCategory === 'all' || c.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          className="relative w-full max-w-4xl max-h-[85vh] flex flex-col rounded-3xl border border-purple-500/40 bg-slate-950/95 text-white shadow-[0_0_50px_rgba(168,85,247,0.25)] p-6 md:p-8 backdrop-blur-xl"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-purple-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4" /> The Grand Anime Grimoire
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white font-anime">
                Syllabus Concept Codex
              </h2>
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

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 py-4 border-b border-slate-800/80">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search definitions, lore, or anime mnemonics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-400 transition-colors"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    audio.playMenuClick();
                    setFilterCategory(cat);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize whitespace-nowrap transition-colors ${
                    filterCategory === cat
                      ? 'bg-purple-600 text-white font-bold'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Concept Grid */}
          <div className="flex-1 overflow-y-auto py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.length === 0 ? (
              <div className="col-span-2 text-center text-slate-500 py-16">
                No syllabus runes matched your query.
              </div>
            ) : (
              filtered.map((c) => {
                const isMastered = masteredIds.includes(c.id);
                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      audio.playConceptReveal();
                      onSelectConcept(c);
                    }}
                    className="cursor-pointer group p-4 rounded-2xl border border-slate-800 hover:border-purple-400/70 bg-slate-900/60 hover:bg-slate-850/80 transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-500/40">
                          {c.category}
                        </span>
                        {isMastered ? (
                          <span className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-500/30">
                            <ShieldCheck className="w-3.5 h-3.5" /> Mastered
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-mono">
                            Unsealed
                          </span>
                        )}
                      </div>

                      <h4 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors font-anime mb-1">
                        {c.name}
                      </h4>

                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">
                        {c.textbookDefinition}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-purple-300/80 italic">
                      <span className="truncate max-w-[80%]">"{c.animeLore}"</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-300 shrink-0" />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Stats */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div>
              Runes Recorded: <span className="text-white font-bold">{concepts.length}</span> | Mastered:{' '}
              <span className="text-emerald-400 font-bold">{masteredIds.length}</span>
            </div>
            <div className="font-mono text-[11px] text-purple-400">
              Storyify Grimoire Engine v1.0
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
