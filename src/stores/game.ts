import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', {
  state: () => ({
    isConnected: false,
    currentMatch: null as any,
    score: 0
  }),

  actions: {
    connectWebSocket() {
      // TODO: 实现WebSocket连接
    },

    initiateMatch() {
      // TODO: 实现匹配逻辑
    },

    sendAnswer(answer: string) {
      // TODO: 实现发送答案逻辑
    }
  }
})
