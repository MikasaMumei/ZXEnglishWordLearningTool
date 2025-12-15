import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    userId: null as number | null,
    name: '',
    class: '',
    coins: 0
  }),

  actions: {
    async login() {
      // TODO: 实现登录逻辑
    }
  }
})
