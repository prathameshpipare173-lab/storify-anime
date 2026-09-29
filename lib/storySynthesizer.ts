import { Story, SubGenre, MoodShader, Concept, Scene, BossBattle } from './types';

interface SynthesizerInput {
  title: string;
  rawText: string;
  subGenre: SubGenre;
  mood?: MoodShader;
}

export function synthesizeAnimeStory(input: SynthesizerInput): Story {
  const { title, rawText, subGenre } = input;
  const storyId = 'story-' + Date.now();

  // Extract key terms or lines
  const lines = rawText
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 0);

  // Extract likely concepts (capitalized terms, colon definitions, bold terms)
  const extractedConcepts: Concept[] = [];
  const conceptRegex = /([A-Z][a-zA-Z0-9\s-]{2,25}):\s*([^.\n]+)/g;
  let match;
  let cIndex = 1;

  while ((match = conceptRegex.exec(rawText)) !== null && extractedConcepts.length < 5) {
    const name = match[1].trim();
    const def = match[2].trim();
    if (name.length > 2 && def.length > 5) {
      extractedConcepts.push({
        id: `concept-${cIndex++}`,
        name: name,
        tag: `[[${name}]]`,
        category: 'Core Syllabus Concept',
        textbookDefinition: def,
        animeLore: mapConceptToAnimeLore(name, subGenre),
        mnemonic: `Master the secret of ${name} to unlock its tactical power!`,
      });
    }
  }

  // Fallbacks if regex didn't find enough structured definitions
  if (extractedConcepts.length < 3) {
    const candidateWords = lines
      .slice(0, 8)
      .join(' ')
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 4 && /^[A-Z]/.test(w));
    
    const uniqueCandidates = Array.from(new Set(candidateWords)).slice(0, 4);

    uniqueCandidates.forEach((word, idx) => {
      if (!extractedConcepts.some(c => c.name.toLowerCase() === word.toLowerCase())) {
        extractedConcepts.push({
          id: `concept-gen-${idx + 1}`,
          name: word,
          tag: `[[${word}]]`,
          category: 'Key Principle',
          textbookDefinition: `A fundamental property and governing rule regarding ${word} in modern curriculum studies.`,
          animeLore: mapConceptToAnimeLore(word, subGenre),
          mnemonic: `Remember: ${word} is the linchpin that balances the story universe!`,
        });
      }
    });
  }

  // If still empty, supply solid thematic curriculum concepts
  if (extractedConcepts.length === 0) {
    extractedConcepts.push(
      {
        id: 'c1',
        name: 'Equilibrium State',
        tag: '[[Equilibrium State]]',
        category: 'Syllabus Law',
        textbookDefinition: 'The state where opposing forces or actions are completely balanced.',
        animeLore: 'The sacred balance of universal mana.',
        mnemonic: 'Balance in all things preserves the realm.',
      },
      {
        id: 'c2',
        name: 'Conservation Law',
        tag: '[[Conservation Law]]',
        category: 'Fundamental Principle',
        textbookDefinition: 'A principle stating that a certain physical property does not change in the course of time within an isolated system.',
        animeLore: 'The Unbreakable Rune of Eternal Exchange.',
        mnemonic: 'Energy cannot be created or destroyed, only transmuted.',
      }
    );
  }

  // Genre specific configurations
  let defaultMood: MoodShader = 'celestial';
  let coverImage = 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80';
  let charName1 = 'Ren';
  let charTitle1 = 'Apprentice';
  let charAvatar1 = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80';
  let charName2 = 'Seraphina';
  let charTitle2 = 'High Sorceress';
  let charAvatar2 = 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80';
  let bossName = 'Archmage Vane';
  let bossTitle = 'Sovereign of the Void';
  let bossAvatar = 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80';

  if (subGenre === 'cyberpunk') {
    defaultMood = 'cyberpunk';
    coverImage = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80';
    charName1 = 'Zero';
    charTitle1 = 'Netrunner';
    charAvatar1 = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80';
    charName2 = 'K1-RA';
    charTitle2 = 'Sentient Sub-Routine';
    charAvatar2 = 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=400&q=80';
    bossName = 'Daemon VEX-9';
    bossTitle = 'Corporate Sub-System Overseer';
    bossAvatar = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80';
  } else if (subGenre === 'academy') {
    defaultMood = 'sunset';
    coverImage = 'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=1200&q=80';
    charName1 = 'Haruto';
    charTitle1 = 'Science Club Member';
    charAvatar1 = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80';
    charName2 = 'Aoi';
    charTitle2 = 'Honors Transfer Student';
    charAvatar2 = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80';
    bossName = 'President Tachibana';
    bossTitle = 'Student Council Grand Inquisitor';
    bossAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
  }

  // Construct scenes
  const c1 = extractedConcepts[0];
  const c2 = extractedConcepts[1] || extractedConcepts[0];
  const c3 = extractedConcepts[2] || extractedConcepts[0];

  const scene1: Scene = {
    id: `${storyId}-scene-1`,
    sceneNumber: 1,
    title: `Chapter 1: The Call of ${c1.name}`,
    locationName: subGenre === 'cyberpunk' ? 'Neon Alley 09' : subGenre === 'academy' ? 'Sunset Rooftop' : 'Ancient Mana Gateway',
    backgroundType: subGenre === 'cyberpunk' ? 'cyber_neon' : subGenre === 'academy' ? 'sunset_school' : 'sacred_forest',
    moodShader: defaultMood,
    particles: subGenre === 'cyberpunk' ? 'data' : subGenre === 'academy' ? 'sakura' : 'starlight',
    dialogue: [
      {
        id: 'sd1',
        speakerId: 'narrator',
        speakerName: 'Narrator',
        emotion: 'neutral',
        side: 'narrator',
        text: `The atmosphere vibrates with unfamiliar energy. A mysterious surge of knowledge pulses through your thoughts as ${title} begins.`,
      },
      {
        id: 'sd2',
        speakerId: 'char2',
        speakerName: charName2,
        speakerTitle: charTitle2,
        avatarUrl: charAvatar2,
        emotion: 'serious',
        side: 'left',
        text: `Listen to me closely! If we do not stabilize the anomaly, the entire sector will fracture. The key lies in understanding ${c1.tag}!`,
      },
      {
        id: 'sd3',
        speakerId: 'char1',
        speakerName: `${charName1} (You)`,
        speakerTitle: charTitle1,
        avatarUrl: charAvatar1,
        emotion: 'thinking',
        side: 'right',
        text: `Wait... ${c1.tag}? That textbook concept: "${c1.textbookDefinition.slice(0, 100)}..." It actually controls physical reality here?!`,
        thought: true,
      },
      {
        id: 'sd4',
        speakerId: 'char2',
        speakerName: charName2,
        speakerTitle: charTitle2,
        avatarUrl: charAvatar2,
        emotion: 'excited',
        side: 'left',
        text: `Exactly! Combine that with ${c2.tag}, and we can forge a defensive matrix before the guardian detects our presence!`,
      },
    ],
  };

  const scene2: Scene = {
    id: `${storyId}-scene-2`,
    sceneNumber: 2,
    title: `Chapter 2: The Trial of Mastery`,
    locationName: subGenre === 'cyberpunk' ? 'Mainframe Central Core' : subGenre === 'academy' ? 'Academy Lecture Hall Omega' : 'Sanctuary of the Ancients',
    backgroundType: subGenre === 'cyberpunk' ? 'subway_matrix' : subGenre === 'academy' ? 'sunset_school' : 'alchemist_lab',
    moodShader: defaultMood,
    particles: subGenre === 'cyberpunk' ? 'data' : subGenre === 'academy' ? 'sakura' : 'dust',
    dialogue: [
      {
        id: 'sd5',
        speakerId: 'narrator',
        speakerName: 'Narrator',
        emotion: 'neutral',
        side: 'narrator',
        text: `The final gate looms ahead. A formidable aura radiates from the center, testing whether you truly comprehend the curriculum principles.`,
      },
      {
        id: 'sd6',
        speakerId: 'char1',
        speakerName: `${charName1} (You)`,
        speakerTitle: charTitle1,
        avatarUrl: charAvatar1,
        emotion: 'victorious',
        side: 'right',
        text: `We have mastered ${c1.tag} and uncovered the secrets of ${c3.tag}. We won't back down now!`,
      },
      {
        id: 'sd7',
        speakerId: 'boss',
        speakerName: bossName,
        speakerTitle: bossTitle,
        avatarUrl: bossAvatar,
        emotion: 'serious',
        side: 'left',
        text: `Foolish challengers! Many claim knowledge, yet crumble when tested under pressure. Show me your mastery, or be erased!`,
      },
    ],
    bossBattle: {
      id: `${storyId}-boss`,
      title: `FINAL CLASH: ${bossName} (${bossTitle})`,
      bossName,
      bossTitle,
      bossAvatar,
      bossMaxHp: 100,
      bossHp: 100,
      playerMaxHp: 100,
      playerHp: 100,
      dialogueIntro: `Prove that you grasp ${c1.name}! One miscalculation and you will fail this encounter!`,
      dialogueVictory: `Unbelievable... your theoretical foundation and practical execution are flawless!`,
      dialogueDefeat: `Your knowledge was lacking. Return to your studies and try again!`,
      actions: [
        {
          id: 'b-act-1',
          title: `Invoke ${c1.name}: Principle Execution`,
          conceptId: c1.id,
          conceptName: c1.name,
          description: `Apply the core formula and rule of ${c1.name} to breach their shields: ${c1.textbookDefinition.slice(0, 90)}...`,
          isCorrect: true,
          explanation: `Direct critical hit! Correct application of ${c1.name} dissolves the barrier completely!`,
          damage: 55,
        },
        {
          id: 'b-act-2',
          title: `Activate ${c2.name} Resonance`,
          conceptId: c2.id,
          conceptName: c2.name,
          description: `Leverage ${c2.name} to reinforce energy channels and disrupt the boss's frequency.`,
          isCorrect: true,
          explanation: `Super effective! The systematic property of ${c2.name} delivers sustained damage.`,
          damage: 45,
        },
        {
          id: 'b-act-3',
          title: `Blind Guess / Superficial Heuristic`,
          conceptId: 'guess',
          conceptName: 'Erroneous Conjecture',
          description: `Ignore the formal definition and rely on random guesses.`,
          isCorrect: false,
          explanation: `Backfire! Guessing without theoretical rigor fails the exam and inflicts recoil damage!`,
          damage: 5,
        },
      ],
    },
  };

  return {
    id: storyId,
    title: title || `The Chronicles of ${c1.name}`,
    japaneseTitle: getJapaneseStyleTitle(title || c1.name, subGenre),
    subGenre,
    subjectCategory: 'Custom Interactive Curriculum',
    summary: `An epic interactive anime visual novel transforming the study of ${extractedConcepts.map(c => c.name).join(', ')} into a high-stakes adventure.`,
    coverImage,
    defaultMood,
    estimatedMinutes: 5,
    targetConcepts: extractedConcepts,
    scenes: [scene1, scene2],
    isCustom: true,
  };
}

function mapConceptToAnimeLore(conceptName: string, genre: SubGenre): string {
  switch (genre) {
    case 'isekai':
      return `The sacred bio-alchemical seal of ${conceptName}, passed down through the royal archives of Eldoria.`;
    case 'cyberpunk':
      return `Encrypted sub-routine [${conceptName.toUpperCase().replace(/\s+/g, '_')}] buried within the deep neural architecture of Neo-Shibuya.`;
    case 'academy':
      return `The golden theorem of ${conceptName}, celebrated in the high school science olympiad archives under the sakura trees.`;
  }
}

function getJapaneseStyleTitle(base: string, genre: SubGenre): string {
  if (genre === 'cyberpunk') return `電脳都市の記録 ～${base}～`;
  if (genre === 'academy') return `放課後の奇跡 ～${base}～`;
  return `異世界の理 ～${base}の覚醒～`;
}
