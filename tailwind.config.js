/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 卡通风格配色 - 适合6-15岁学生
        primary: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444', // 鲜艳红色
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        secondary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6', // 明亮蓝色
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        accent: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e', // 鲜艳绿色
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        fun: {
          yellow: '#fbbf24', // 卡通黄色
          pink: '#ec4899', // 卡通粉色
          purple: '#a855f7', // 卡通紫色
          orange: '#f97316', // 卡通橙色
        },
        cartoon: {
          sky: '#87ceeb', // 天蓝色
          grass: '#90EE90', // 草绿色
          sun: '#FFD700', // 金黄色
        }
      },
      fontFamily: {
        cartoon: ['Comic Sans MS', 'cursive'], // 卡通字体
      },
      borderRadius: {
        'cartoon': '1rem', // 卡通圆角
      }
    },
  },
  plugins: [],
}
