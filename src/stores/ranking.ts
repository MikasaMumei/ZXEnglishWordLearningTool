import { defineStore } from 'pinia'

export const useRankingStore = defineStore('ranking', {
  state: () => ({
    ranking: [] as any[]
  }),

  actions: {
    async loadRanking() {
      // TODO: 实现加载排行榜逻辑
    }
  }
})
