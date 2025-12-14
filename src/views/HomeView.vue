<template>
  <div class="container mx-auto p-4">
    <header class="text-center mb-8">
      <h1 class="text-3xl font-bold text-primary mb-2">ZX English Word Learning</h1>
      <div class="flex justify-center items-center space-x-4">
        <div class="card">
          <p class="text-sm text-gray-600">金币</p>
          <p class="text-2xl font-bold text-accent">{{ authStore.user.coins }}</p>
        </div>
        <div class="card">
          <p class="text-sm text-gray-600">分数</p>
          <p class="text-2xl font-bold text-secondary">{{ authStore.user.score }}</p>
        </div>
      </div>
    </header>

    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
      <button @click="$router.push('/learn')" class="card hover:bg-blue-50 transition">
        <h3 class="text-xl font-semibold mb-2">单词学习</h3>
        <p class="text-gray-600">多种模式背单词</p>
      </button>

      <button @click="$router.push('/wrong-words')" class="card hover:bg-red-50 transition">
        <h3 class="text-xl font-semibold mb-2">我的错题本</h3>
        <p class="text-gray-600">复习错题</p>
      </button>

      <button @click="$router.push('/rank')" class="card hover:bg-yellow-50 transition">
        <h3 class="text-xl font-semibold mb-2">排行榜</h3>
        <p class="text-gray-600">查看排名</p>
      </button>

      <button @click="$router.push('/game')" class="card hover:bg-green-50 transition col-span-2 md:col-span-1">
        <h3 class="text-xl font-semibold mb-2">双人单词挑战</h3>
        <p class="text-gray-600">实时对战</p>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>
