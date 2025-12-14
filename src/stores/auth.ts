import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref({
    name: '',
    class: '',
    coins: 0,
    score: 0,
  })

  const isLoggedIn = ref(false)

  const login = (name: string, className: string) => {
    user.value.name = name
    user.value.class = className
    isLoggedIn.value = true
  }

  const logout = () => {
    user.value = { name: '', class: '', coins: 0, score: 0 }
    isLoggedIn.value = false
  }

  const updateCoins = (amount: number) => {
    user.value.coins += amount
  }

  const updateScore = (amount: number) => {
    user.value.score += amount
  }

  return {
    user,
    isLoggedIn,
    login,
    logout,
    updateCoins,
    updateScore,
  }
})
