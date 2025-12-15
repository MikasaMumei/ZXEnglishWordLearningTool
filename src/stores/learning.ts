import { defineStore } from 'pinia'

interface WordProgress {
  status: 'new' | 'learning' | 'mastered';
  lastReview: string;
  nextReview: string;
  reviewInterval: number;
  wrongCount: number;
}

interface Word {
  id: number;
  word: string;
  meaning: any[]; // JSON array
  phonetic_uk: string;
  phonetic_us: string;
  type: string;
  level: number;
}

export const useLearningStore = defineStore('learning', {
  state: () => ({
    progress: {} as Record<string, WordProgress>,
    wrongWords: [] as string[],
    words: [] as Word[]
  }),

  getters: {
    getTodayWords(): string[] {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      return Object.keys(this.progress).filter(wordId => {
        const prog = this.progress[wordId];
        return prog.status === 'new' || prog.nextReview <= today;
      });
    },

    getQuizOptions: (state) => (correctWordId: string) => {
      const correctWord = state.words.find(w => w.id.toString() === correctWordId);
      if (!correctWord) return [];

      // Get 3 random words as distractors
      const distractors = state.words
        .filter(w => w.id.toString() !== correctWordId)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(w => w.word);

      return [correctWord.word, ...distractors].sort(() => 0.5 - Math.random());
    }
  },

  actions: {
    addWrongWord(wordId: string, type: string) {
      if (!this.wrongWords.includes(wordId)) {
        this.wrongWords.push(wordId);
      }
    },

    async loadWords() {
      try {
        const response = await fetch('http://backend:3678/data');
        if (!response.ok) throw new Error('Failed to load data');
        const data = await response.json();
        this.words = data.words || [];
      } catch (error) {
        console.error('Failed to load words:', error);
      }
    },

    async syncDataToBackend() {
      // This will be called from auth store or elsewhere
      // For now, just sync progress
      // In auth store, it's already syncing basic info
    }
  }
})
