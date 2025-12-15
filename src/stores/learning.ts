import { defineStore } from 'pinia'

export const useLearningStore = defineStore('learning', {
  state: () => ({
    progress: {} as Record<string, any>,
    wrongWords: [] as string[]
  }),

  getters: {
    getTodayWords(): string[] {
      // TODO: 实现艾宾浩斯算法获取今日单词
      return []
    }
  },

  actions: {
    addWrongWord(wordId: string, type: string) {
      // TODO: 实现添加错题逻辑
    }
  }
})
