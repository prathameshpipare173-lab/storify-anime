export type SubGenre = 'isekai' | 'cyberpunk' | 'academy';

export type MoodShader = 'sunset' | 'cyberpunk' | 'celestial';

export type CharacterEmotion = 'neutral' | 'excited' | 'serious' | 'shocked' | 'thinking' | 'victorious';

export interface Concept {
  id: string;
  name: string;
  tag: string; // e.g. [[Mitochondria]]
  category: string;
  textbookDefinition: string;
  animeLore: string;
  mnemonic: string;
  mastered?: boolean;
}

export interface DialogueLine {
  id: string;
  speakerId: string;
  speakerName: string;
  speakerTitle?: string;
  avatarUrl?: string;
  emotion: CharacterEmotion;
  side: 'left' | 'right' | 'center' | 'narrator';
  text: string; // May include [[Concept Name]] tags
  thought?: boolean;
  voicePitch?: number; // for audio clicks
}

export interface BattleAction {
  id: string;
  title: string;
  conceptId: string;
  conceptName: string;
  description: string;
  isCorrect: boolean;
  explanation: string;
  damage: number;
}

export interface BossBattle {
  id: string;
  title: string;
  bossName: string;
  bossTitle: string;
  bossAvatar: string;
  bossMaxHp: number;
  bossHp: number;
  playerMaxHp: number;
  playerHp: number;
  dialogueIntro: string;
  dialogueVictory: string;
  dialogueDefeat: string;
  actions: BattleAction[];
}

export interface Scene {
  id: string;
  sceneNumber: number;
  title: string;
  locationName: string;
  backgroundType: 'sunset_school' | 'cyber_neon' | 'celestial_shrine' | 'alchemist_lab' | 'subway_matrix' | 'sacred_forest';
  customBackgroundCss?: string;
  moodShader: MoodShader;
  particles: 'sakura' | 'dust' | 'data' | 'starlight' | 'none';
  dialogue: DialogueLine[];
  bossBattle?: BossBattle;
}

export interface Story {
  id: string;
  title: string;
  japaneseTitle?: string;
  subGenre: SubGenre;
  subjectCategory: string; // e.g., "Biology & Cell Metabolism", "Cybersecurity & Discrete Math"
  summary: string;
  coverImage: string;
  defaultMood: MoodShader;
  targetConcepts: Concept[];
  scenes: Scene[];
  estimatedMinutes: number;
  createdDate?: string;
  isCustom?: boolean;
}

export interface UserProgress {
  unlockedStoryIds: string[];
  currentStoryId?: string;
  currentSceneIndex: number;
  masteredConceptIds: string[];
  defeatedBossIds: string[];
  stats: {
    totalStoriesCompleted: number;
    totalConceptsLearned: number;
    totalBossBattlesWon: number;
    studyStreakDays: number;
  };
}
