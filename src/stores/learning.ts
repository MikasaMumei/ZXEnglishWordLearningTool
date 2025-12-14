import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface Word {
  id: number
  word: string
  meaning: Array<{ partOfSpeech: string; meaning: string }>
  phonetic_uk: string
  phonetic_us: string
  type: string
  level: number
}

interface Progress {
  [wordId: string]: {
    status: 'new' | 'learning' | 'mastered'
    lastReview: string
    nextReview: string
    reviewInterval: number
    wrongCount: number
  }
}

export const useLearningStore = defineStore('learning', () => {
  const words = ref<Word[]>([])
  const progress = ref<Progress>({})
  const wrongWords = ref<{ wordId: number; type: string }[]>([])

  const getQuizOptions = (correctWordId: number) => {
    const correctWord = words.value.find(w => w.id === correctWordId)
    if (!correctWord) return []

    const options = [correctWord.meaning[0].meaning]

    // 生成3个干扰项
    const otherWords = words.value.filter(w => w.id !== correctWordId && w.level === correctWord.level)
    const distractors = otherWords.slice(0, 3).map(w => w.meaning[0].meaning)

    return [...options, ...distractors].sort(() => Math.random() - 0.5)
  }

  const addWrongWord = (wordId: number, type: string) => {
    wrongWords.value.push({ wordId, type })
  }

  const syncDataToBackend = async () => {
    const authStore = useAuthStore()
    try {
      const response = await fetch('/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: authStore.user.name,
          class: authStore.user.class,
          progress: progress.value,
          coins: authStore.user.coins,
          score: authStore.user.score,
        }),
      })
      if (!response.ok) throw new Error('Sync failed')
    } catch (error) {
      console.error('Sync error:', error)
    }
  }

  return {
    words,
    progress,
    wrongWords,
    getQuizOptions,
    addWrongWord,
    syncDataToBackend,
  }
})

// 导入 useAuthStore
import { useAuthStore } from './auth'
