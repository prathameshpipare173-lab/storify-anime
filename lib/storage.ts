import { UserProgress, Story } from './types';

const PROGRESS_KEY = 'storyify_anime_user_progress_v1';
const CUSTOM_STORIES_KEY = 'storyify_anime_custom_stories_v1';

const defaultProgress: UserProgress = {
  unlockedStoryIds: ['isekai-cellular-respiration', 'cyberpunk-rsa-cryptography', 'academy-special-relativity'],
  currentSceneIndex: 0,
  masteredConceptIds: [],
  defeatedBossIds: [],
  stats: {
    totalStoriesCompleted: 0,
    totalConceptsLearned: 0,
    totalBossBattlesWon: 0,
    studyStreakDays: 1,
  },
};

export function getStoredProgress(): UserProgress {
  if (typeof window === 'undefined') return defaultProgress;
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return defaultProgress;
    return { ...defaultProgress, ...JSON.parse(raw) };
  } catch {
    return defaultProgress;
  }
}

export function saveStoredProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save user progress', e);
  }
}

export function unlockConceptInStorage(conceptId: string): void {
  const current = getStoredProgress();
  if (!current.masteredConceptIds.includes(conceptId)) {
    current.masteredConceptIds.push(conceptId);
    current.stats.totalConceptsLearned = current.masteredConceptIds.length;
    saveStoredProgress(current);
  }
}

export function recordBossVictoryInStorage(bossId: string): void {
  const current = getStoredProgress();
  if (!current.defeatedBossIds.includes(bossId)) {
    current.defeatedBossIds.push(bossId);
    current.stats.totalBossBattlesWon = current.defeatedBossIds.length;
    saveStoredProgress(current);
  }
}

export function recordStoryCompletionInStorage(storyId: string): void {
  const current = getStoredProgress();
  if (!current.unlockedStoryIds.includes(storyId)) {
    current.unlockedStoryIds.push(storyId);
  }
  current.stats.totalStoriesCompleted += 1;
  saveStoredProgress(current);
}

export function getCustomStories(): Story[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CUSTOM_STORIES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomStory(story: Story): void {
  if (typeof window === 'undefined') return;
  try {
    const list = getCustomStories().filter(s => s.id !== story.id);
    list.unshift(story);
    localStorage.setItem(CUSTOM_STORIES_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save custom story', e);
  }
}
