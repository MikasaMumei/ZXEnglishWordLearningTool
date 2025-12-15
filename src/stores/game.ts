import { defineStore } from 'pinia'

interface Match {
  matchId: string;
  opponent: string;
  questions: any[];
  currentQuestionIndex: number;
  score: number;
}

export const useGameStore = defineStore('game', {
  state: () => ({
    isConnected: false,
    currentMatch: null as Match | null,
    score: 0,
    ws: null as WebSocket | null
  }),

  actions: {
    connectWebSocket() {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) return;

      this.ws = new WebSocket('ws://backend:3678/ws');

      this.ws.onopen = () => {
        this.isConnected = true;
        console.log('WebSocket connected');
      };

      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        // Handle match start, questions, etc.
        if (data.type === 'match_found') {
          this.currentMatch = {
            matchId: data.matchId,
            opponent: data.opponent,
            questions: [],
            currentQuestionIndex: 0,
            score: 0
          };
        } else if (data.type === 'question') {
          if (this.currentMatch) {
            this.currentMatch.questions.push(data.question);
          }
        }
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        console.log('WebSocket disconnected');
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    },

    initiateMatch() {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

      this.ws.send(JSON.stringify({
        type: 'find_match'
      }));
    },

    sendAnswer(answer: string) {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN || !this.currentMatch) return;

      this.ws.send(JSON.stringify({
        type: 'answer',
        matchId: this.currentMatch.matchId,
        answer: answer
      }));
    },

    async syncDataToBackend() {
      // Game store might not need separate sync, or sync score
      // For now, placeholder
    }
  }
})
