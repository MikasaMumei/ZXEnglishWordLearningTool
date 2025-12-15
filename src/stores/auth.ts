import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    userId: null as number | null,
    name: '',
    class: '',
    coins: 0
  }),

  actions: {
    async login(userData: { name: string; class: string }) {
      // Generate a simple user ID (in a real app, this would be from backend)
      this.userId = Math.floor(Math.random() * 10000) + 1;
      this.name = userData.name;
      this.class = userData.class;
      this.coins = 0; // Initialize coins to 0

      // Optionally sync to backend immediately
      await this.syncDataToBackend();
    },

    async syncDataToBackend() {
      if (!this.userId) return;

      try {
        const response = await fetch('http://backend:3678/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: this.userId,
            name: this.name,
            class: this.class,
            progress: {}, // Will be filled by learning store
            coins: this.coins,
            score: 0, // Placeholder
          }),
        });

        if (!response.ok) {
          throw new Error('Sync failed');
        }
      } catch (error) {
        console.error('Sync failed:', error);
      }
    }
  }
})
