'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, ShieldAlert, Zap, Trophy, AlertTriangle, Check, RefreshCw } from 'lucide-react';
import { BossBattle, BattleAction } from '@/lib/types';
import { audio } from '@/lib/audio';

interface BossBattleOverlayProps {
  battle: BossBattle;
  onVictory: () => void;
  onConceptLearnMore?: (conceptName: string) => void;
}

export const BossBattleOverlay: React.FC<BossBattleOverlayProps> = ({
  battle,
  onVictory,
  onConceptLearnMore,
}) => {
  const [bossHp, setBossHp] = useState<number>(battle.bossHp);
  const [playerHp, setPlayerHp] = useState<number>(battle.playerHp);
  const [feedback, setFeedback] = useState<{
    type: 'hit' | 'miss' | 'none';
    message: string;
    damage?: number;
  }>({ type: 'none', message: '' });
  const [isDefeated, setIsDefeated] = useState<boolean>(false);
  const [isPlayerDefeated, setIsPlayerDefeated] = useState<boolean>(false);
  const [isAttacking, setIsAttacking] = useState<boolean>(false);

  // Play boss alarm on mount
  React.useEffect(() => {
    audio.playBossAlarm();
  }, []);

  const handleActionSelect = (action: BattleAction) => {
    if (isAttacking || isDefeated || isPlayerDefeated) return;
    setIsAttacking(true);

    if (action.isCorrect) {
      audio.playAttackSound(true);
      const newBossHp = Math.max(0, bossHp - action.damage);
      setBossHp(newBossHp);
      setFeedback({
        type: 'hit',
        message: action.explanation,
        damage: action.damage,
      });

      if (newBossHp === 0) {
        setTimeout(() => {
          setIsDefeated(true);
          audio.playVictoryJingle();
        }, 800);
      }
    } else {
      audio.playAttackSound(false);
      const newPlayerHp = Math.max(0, playerHp - 25);
      setPlayerHp(newPlayerHp);
      setFeedback({
        type: 'miss',
        message: action.explanation,
        damage: 25,
      });

      if (newPlayerHp === 0) {
        setTimeout(() => {
          setIsPlayerDefeated(true);
        }, 800);
      }
    }

    setTimeout(() => {
      setIsAttacking(false);
    }, 1200);
  };

  const handleRetry = () => {
    setBossHp(battle.bossMaxHp);
    setPlayerHp(battle.playerMaxHp);
    setIsPlayerDefeated(false);
    setIsDefeated(false);
    setFeedback({ type: 'none', message: '' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-lg">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border-2 border-red-500/40 bg-slate-950/95 text-white shadow-[0_0_50px_rgba(239,68,68,0.25)] flex flex-col max-h-[92vh]">
        {/* Top Warning Banner */}
        <div className="bg-gradient-to-r from-red-950 via-rose-900 to-red-950 border-b border-red-500/30 px-6 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-300 font-bold tracking-wider text-xs md:text-sm uppercase font-mono animate-pulse">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            Curriculum Boss Gate: Concept Mastery Checkpoint
          </div>
          <div className="text-xs text-rose-200/80 font-mono">
            {battle.title}
          </div>
        </div>

        {/* Arena View: Boss & Player Stats */}
        <div className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-800 bg-gradient-to-b from-slate-900/60 to-transparent">
          {/* Boss Section */}
          <div className="flex items-center gap-4 w-full md:w-1/2">
            <motion.div
              animate={isAttacking && feedback.type === 'hit' ? { x: [-10, 10, -5, 5, 0], scale: 0.95 } : { y: [-3, 3, -3] }}
              transition={isAttacking ? { duration: 0.4 } : { repeat: Infinity, duration: 3 }}
              className="relative shrink-0"
            >
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-red-600/50 to-rose-400/30 blur-md" />
              <img
                src={battle.bossAvatar}
                alt={battle.bossName}
                className="h-20 w-20 md:h-24 md:w-24 rounded-2xl object-cover border-2 border-red-500 shadow-xl"
              />
            </motion.div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-base md:text-lg text-red-400 font-anime">
                  {battle.bossName}
                </span>
                <span className="font-mono text-xs text-red-300">
                  {bossHp}/{battle.bossMaxHp} HP
                </span>
              </div>
              <div className="text-xs text-slate-400 mb-2">{battle.bossTitle}</div>
              {/* Boss HP Bar */}
              <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden border border-red-950">
                <motion.div
                  className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-500"
                  animate={{ width: `${(bossHp / battle.bossMaxHp) * 100}%` }}
                  transition={{ type: 'spring', damping: 15 }}
                />
              </div>
            </div>
          </div>

          {/* Versus Divider */}
          <div className="hidden md:flex flex-col items-center justify-center px-4">
            <Swords className="w-8 h-8 text-amber-400 animate-pulse" />
            <span className="text-[10px] font-mono text-amber-300/80 uppercase tracking-widest mt-1">
              VS
            </span>
          </div>

          {/* Player HP Section */}
          <div className="w-full md:w-1/3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-1 text-xs font-semibold">
              <span className="text-cyan-300 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-cyan-400" /> Student Comprehension
              </span>
              <span className="font-mono text-cyan-200">
                {playerHp}/{battle.playerMaxHp} HP
              </span>
            </div>
            {/* Player HP Bar */}
            <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden border border-cyan-950">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                animate={{ width: `${(playerHp / battle.playerMaxHp) * 100}%` }}
                transition={{ type: 'spring', damping: 15 }}
              />
            </div>
          </div>
        </div>

        {/* Dialogue / Intro line */}
        <div className="px-6 py-3 bg-slate-900/40 border-b border-slate-800/80 text-xs md:text-sm text-slate-300 italic flex items-center gap-2">
          <span className="text-red-400 font-bold not-italic">{battle.bossName}:</span>
          <span>"{battle.dialogueIntro}"</span>
        </div>

        {/* Tactical Action Deck (The Textbook Choices) */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
            <span>Select Concept-Based Tactical Action:</span>
            <span className="text-[11px] text-amber-300 font-normal">
              Apply the correct textbook law to deal damage
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {battle.actions.map((act) => (
              <button
                key={act.id}
                disabled={isAttacking || isDefeated || isPlayerDefeated}
                onClick={() => handleActionSelect(act)}
                className="group text-left p-4 rounded-xl border border-slate-700 hover:border-amber-400 bg-slate-900/70 hover:bg-slate-800/80 transition-all duration-200 relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {act.conceptName}
                  </span>
                  <span className="text-xs font-mono text-rose-400">
                    +{act.damage} DMG
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                  {act.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                  {act.description}
                </p>
              </button>
            ))}
          </div>

          {/* Feedback & Damage Alert Box */}
          <AnimatePresence>
            {feedback.type !== 'none' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`p-4 rounded-xl border flex items-start gap-3 mt-4 ${
                  feedback.type === 'hit'
                    ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200'
                    : 'bg-rose-950/70 border-rose-500/50 text-rose-200'
                }`}
              >
                {feedback.type === 'hit' ? (
                  <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold text-sm">
                    {feedback.type === 'hit' ? 'CRITICAL HIT!' : 'MISCALCULATION!'}
                  </div>
                  <div className="text-xs md:text-sm mt-0.5 opacity-90">
                    {feedback.message}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Victory Modal Overlay */}
        {isDefeated && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 bg-slate-950/95 z-20 flex flex-col items-center justify-center p-8 text-center"
          >
            <div className="h-16 w-16 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center mb-4">
              <Trophy className="w-8 h-8 text-amber-400 animate-bounce" />
            </div>
            <h2 className="text-3xl font-extrabold text-amber-300 font-anime mb-2">
              BOSS GATE BREACHED!
            </h2>
            <p className="text-sm md:text-base text-slate-300 max-w-md italic mb-6">
              "{battle.dialogueVictory}"
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  audio.playMenuClick();
                  onVictory();
                }}
                className="px-6 py-2.5 rounded-xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-lg shadow-amber-500/30 transition-all transform hover:scale-105"
              >
                Claim Victory & Proceed
              </button>
            </div>
          </motion.div>
        )}

        {/* Defeat / Retry Overlay */}
        {isPlayerDefeated && (
          <div className="absolute inset-0 bg-slate-950/95 z-20 flex flex-col items-center justify-center p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-rose-500 mb-3" />
            <h3 className="text-2xl font-bold text-rose-400 font-anime mb-2">
              COMPREHENSION DEPLETED
            </h3>
            <p className="text-sm text-slate-300 max-w-md mb-6 italic">
              "{battle.dialogueDefeat}"
            </p>
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold bg-rose-600 hover:bg-rose-500 text-white transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
