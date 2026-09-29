'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Sparkles, Brain, CheckCircle, ShieldCheck } from 'lucide-react';
import { Concept, SubGenre } from '@/lib/types';
import { audio } from '@/lib/audio';

interface ConceptModalProps {
  concept: Concept | null;
  subGenre?: SubGenre;
  isMastered?: boolean;
  onClose: () => void;
  onMaster?: (conceptId: string) => void;
}

export const ConceptModal: React.FC<ConceptModalProps> = ({
  concept,
  subGenre = 'isekai',
  isMastered = false,
  onClose,
  onMaster,
}) => {
  if (!concept) return null;

  const handleMasterClick = () => {
    audio.playConceptReveal();
    if (onMaster) {
      onMaster(concept.id);
    }
  };

  // Aesthetic colors based on subgenre
  const isCyber = subGenre === 'cyberpunk';
  const isAcademy = subGenre === 'academy';

  const accentBorder = isCyber
    ? 'border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.4)]'
    : isAcademy
    ? 'border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.4)]'
    : 'border-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.4)]';

  const badgeColor = isCyber
    ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40'
    : isAcademy
    ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
    : 'bg-purple-950/80 text-purple-300 border-purple-500/40';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`relative w-full max-w-lg overflow-hidden rounded-2xl border-2 bg-slate-950/95 text-slate-100 p-6 md:p-8 backdrop-blur-xl ${accentBorder}`}
        >
          {/* Header decorative runes / lines */}
          <div className="flex items-start justify-between pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-full border ${badgeColor}`}>
                  {concept.category}
                </span>
                {isMastered && (
                  <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    <ShieldCheck className="w-3.5 h-3.5" /> Mastered
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2 font-anime">
                <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                {concept.name}
              </h3>
            </div>
            <button
              onClick={() => {
                audio.playMenuClick();
                onClose();
              }}
              className="rounded-full p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="space-y-4 my-6">
            {/* Textbook Definition */}
            <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-400 mb-2">
                <BookOpen className="w-4 h-4" /> Textbook Syllabus Definition
              </div>
              <p className="text-sm md:text-base text-slate-200 leading-relaxed">
                {concept.textbookDefinition}
              </p>
            </div>

            {/* In-Universe Anime Lore */}
            <div className="rounded-xl bg-gradient-to-br from-purple-950/40 to-slate-900/80 border border-purple-500/30 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-300 mb-2">
                <Sparkles className="w-4 h-4 text-purple-400" /> In-Universe Anime Lore
              </div>
              <p className="text-sm md:text-base text-purple-100 leading-relaxed italic">
                "{concept.animeLore}"
              </p>
            </div>

            {/* Mnemonic Hook */}
            {concept.mnemonic && (
              <div className="rounded-xl bg-amber-950/30 border border-amber-500/30 p-3.5 flex items-start gap-3">
                <Brain className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                    Memory Anchor / Rune Mnemonic
                  </div>
                  <div className="text-xs md:text-sm text-amber-200/90 mt-0.5">
                    {concept.mnemonic}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
            <span className="text-xs text-slate-400 font-mono">
              Grimoire Index: #{concept.id}
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleMasterClick}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isMastered
                    ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                {isMastered ? 'Mastered in Grimoire' : 'Seal into Grimoire (+50 XP)'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
