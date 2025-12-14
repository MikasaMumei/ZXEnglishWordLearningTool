import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGameStore = defineStore('game', () => {
  const isConnected = ref(false)
  const gameId = ref('')
  const opponentName = ref('')
  const myScore = ref(0)
  const opponentScore = ref(0)
  const quizList = ref<any[]>([])

  let ws: WebSocket | null = null

  const connectWebSocket = () => {
    ws = new WebSocket('ws://localhost:3678/ws')

    ws.onopen = () => {
      isConnected.value = true
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      // 处理对战消息
      if (data.type === 'gameStart') {
        gameId.value = data.gameId
        opponentName.value = data.opponentName
        quizList.value = data.quizList
      } else if (data.type === 'scoreUpdate') {
        if (data.player === 'me') {
          myScore.value = data.score
        } else {
          opponentScore.value = data.score
        }
      }
    }

    ws.onclose = () => {
      isConnected.value = false
    }
  }

  const initiateMatch = (targetWordCount: number) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'join',
        wordCount: targetWordCount,
      }))
    }
  }

  const sendAnswer = (answer: string) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'answer',
        answer,
        gameId: gameId.value,
      }))
    }
  }

  return {
    isConnected,
    gameId,
    opponentName,
    myScore,
    opponentScore,
    quizList,
    connectWebSocket,
    initiateMatch,
    sendAnswer,
  }
})
