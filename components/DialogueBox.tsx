'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause, ChevronRight, History, Sparkles } from 'lucide-react';
import { DialogueLine, CharacterEmotion, SubGenre } from '@/lib/types';
import { audio } from '@/lib/audio';

interface DialogueBoxProps {
  dialogue: DialogueLine;
  subGenre?: SubGenre;
  onNext: () => void;
  onConceptClick: (conceptName: string) => void;
  onOpenBacklog: () => void;
  isAutoPlay: boolean;
  onToggleAutoPlay: () => void;
  autoPlayDelay?: number;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({
  dialogue,
  subGenre = 'isekai',
  onNext,
  onConceptClick,
  onOpenBacklog,
  isAutoPlay,
  onToggleAutoPlay,
  autoPlayDelay = 3500,
}) => {
  const [displayedLength, setDisplayedLength] = useState<number>(0);
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const [soundClicksEnabled, setSoundClicksEnabled] = useState<boolean>(true);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Full clean text for typing comparison
  const rawText = dialogue.text;

  // Reset and restart typewriter on dialogue change
  useEffect(() => {
    setDisplayedLength(0);
    setIsTyping(true);

    if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);

    let current = 0;
    const typingSpeed = 22; // ms per char

    typingTimerRef.current = setInterval(() => {
      current++;
      setDisplayedLength(current);

      // Play soft audio click every 2nd or 3rd char
      if (soundClicksEnabled && current % 3 === 0) {
        audio.playTypewriterClick();
      }

      if (current >= rawText.length) {
        if (typingTimerRef.current) clearInterval(typingTimerRef.current);
        setIsTyping(false);
      }
    }, typingSpeed);

    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    };
  }, [dialogue.id, rawText, soundClicksEnabled]);

  // Handle Auto-Play when typing finishes
  useEffect(() => {
    if (!isTyping && isAutoPlay) {
      autoPlayTimerRef.current = setTimeout(() => {
        onNext();
      }, autoPlayDelay);
    }
    return () => {
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    };
  }, [isTyping, isAutoPlay, onNext, autoPlayDelay]);

  // Complete text immediately or advance
  const handleBoxClick = () => {
    if (isTyping) {
      // Fast forward: show all text immediately
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
      setDisplayedLength(rawText.length);
      setIsTyping(false);
    } else {
      audio.playMenuClick();
      onNext();
    }
  };

  // Parse text slice and render interactive concept chips
  const renderTextWithConcepts = () => {
    const currentSlice = rawText.slice(0, displayedLength);
    // Regex matches [[Concept Name]]
    const parts = currentSlice.split(/(\[\[.*?\]\])/g);

    return parts.map((part, index) => {
      if (part.startsWith('[[') && part.endsWith(']]')) {
        const conceptName = part.slice(2, -2);
        return (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              audio.playConceptReveal();
              onConceptClick(conceptName);
            }}
            className="inline-flex items-center gap-1 mx-1 px-2.5 py-0.5 rounded-lg text-xs md:text-sm font-semibold tracking-wide bg-amber-500/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/50 shadow-[0_0_12px_rgba(245,158,11,0.5)] transition-all transform hover:scale-105 animate-pulse"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            {conceptName}
          </button>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  // Emotional avatar animation
  const emotionVariants = {
    neutral: { y: 0, scale: 1 },
    excited: { y: [-2, 2, -2], scale: 1.03, transition: { repeat: Infinity, duration: 1.5 } },
    serious: { y: 0, scale: 1.01 },
    shocked: { x: [-3, 3, -3, 3, 0], scale: 1.05, transition: { duration: 0.3 } },
    thinking: { rotate: [-1, 1, -1], transition: { repeat: Infinity, duration: 2.5 } },
    victorious: { y: -6, scale: 1.05, transition: { type: 'spring', stiffness: 200 } },
  };

  // Genre theme styling
  const namePlateColor =
    subGenre === 'cyberpunk'
      ? 'border-cyan-400/70 bg-gradient-to-r from-cyan-950/90 to-slate-900/90 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
      : subGenre === 'academy'
      ? 'border-amber-400/70 bg-gradient-to-r from-amber-950/90 to-slate-900/90 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
      : 'border-purple-400/70 bg-gradient-to-r from-purple-950/90 to-slate-900/90 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]';

  const isNarrator = dialogue.side === 'narrator';

  return (
    <div className="absolute bottom-6 inset-x-4 md:inset-x-12 z-30 flex flex-col items-center">
      {/* Visual Novel Character Sprite (Left or Right) */}
      {!isNarrator && dialogue.avatarUrl && (
        <div
          className={`absolute -top-36 md:-top-48 z-10 pointer-events-none transition-all duration-300 ${
            dialogue.side === 'right' ? 'right-6 md:right-20' : 'left-6 md:left-20'
          }`}
        >
          <motion.div
            variants={emotionVariants}
            animate={dialogue.emotion || 'neutral'}
            className="relative"
          >
            {/* Glow Aura */}
            <div className="absolute -inset-2 rounded-full bg-gradient-to-t from-purple-500/20 to-transparent blur-xl" />
            <img
              src={dialogue.avatarUrl}
              alt={dialogue.speakerName}
              className="h-36 w-36 md:h-48 md:w-48 rounded-2xl object-cover border-2 border-white/30 shadow-2xl drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
            />
          </motion.div>
        </div>
      )}

      {/* Main Glassmorphic Dialogue Panel */}
      <div
        onClick={handleBoxClick}
        className="w-full max-w-5xl cursor-pointer rounded-2xl border border-white/20 bg-slate-950/80 p-5 md:p-7 text-white backdrop-blur-xl shadow-dialogue-glass relative transition-all hover:border-white/30 select-none"
      >
        {/* Name Plate & Status Controls */}
        <div className="flex items-center justify-between mb-3 -mt-2">
          {!isNarrator ? (
            <div className={`px-4 py-1 rounded-xl border text-sm md:text-base font-bold tracking-wide flex items-center gap-2 ${namePlateColor}`}>
              <span>{dialogue.speakerName}</span>
              {dialogue.speakerTitle && (
                <span className="text-xs font-normal opacity-75 hidden sm:inline">
                  | {dialogue.speakerTitle}
                </span>
              )}
            </div>
          ) : (
            <div className="px-3 py-0.5 rounded-lg border border-slate-700 bg-slate-900/80 text-xs font-medium text-slate-400">
              NARRATIVE CHRONICLE
            </div>
          )}

          {/* Quick Controls Bar */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/70 px-3 py-1 rounded-full border border-slate-800"
          >
            {/* Backlog */}
            <button
              onClick={() => {
                audio.playMenuClick();
                onOpenBacklog();
              }}
              title="Dialogue History (Log)"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <History className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Log</span>
            </button>

            <span className="text-slate-700">|</span>

            {/* Auto Play */}
            <button
              onClick={() => {
                audio.playMenuClick();
                onToggleAutoPlay();
              }}
              title="Toggle Auto Play"
              className={`hover:text-white transition-colors flex items-center gap-1 ${
                isAutoPlay ? 'text-amber-400 font-bold' : ''
              }`}
            >
              {isAutoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">Auto</span>
            </button>

            <span className="text-slate-700">|</span>

            {/* Typing SFX Toggle */}
            <button
              onClick={() => setSoundClicksEnabled(!soundClicksEnabled)}
              title="Typing Click SFX"
              className="hover:text-white transition-colors"
            >
              {soundClicksEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-slate-500" />
              )}
            </button>
          </div>
        </div>

        {/* Dialogue Text Content with Concept Highlights */}
        <div className="min-h-[4.5rem] md:min-h-[5.5rem] text-sm md:text-lg leading-relaxed text-slate-100 font-medium font-anime">
          {dialogue.thought && <span className="text-slate-400 italic">( </span>}
          {renderTextWithConcepts()}
          {dialogue.thought && <span className="text-slate-400 italic"> )</span>}

          {/* Typing cursor blink */}
          {isTyping && (
            <span className="inline-block w-2 h-4 ml-1 bg-cyan-400 animate-pulse align-middle" />
          )}
        </div>

        {/* Advance Indicator Prompt */}
        <div className="flex items-center justify-end mt-2">
          {!isTyping && (
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="flex items-center gap-1 text-xs text-amber-300 font-semibold tracking-wide"
            >
              <span>Click to advance</span>
              <ChevronRight className="w-4 h-4 text-amber-400" />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
