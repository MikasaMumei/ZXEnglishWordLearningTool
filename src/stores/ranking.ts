import { defineStore } from 'pinia'

export const useRankingStore = defineStore('ranking', {
  state: () => ({
    ranking: [] as any[]
  }),

  actions: {
    async loadRanking() {
      try {
        const response = await fetch('http://backend:3678/data');
        if (!response.ok) throw new Error('Failed to load data');
        const data = await response.json();
        this.ranking = data.ranking || [];
      } catch (error) {
        console.error('Failed to load ranking:', error);
      }
    },

    async syncDataToBackend() {
      // Ranking store typically doesn't sync data, it loads from backend
    }
  }
})
