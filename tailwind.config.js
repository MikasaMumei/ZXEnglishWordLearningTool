/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6', // 蓝色主题
        secondary: '#10B981', // 绿色
        accent: '#F59E0B', // 橙色
        background: '#F8FAFC', // 浅灰背景
        card: '#FFFFFF', // 卡片白色
        text: '#1F2937', // 深灰文本
      },
      fontFamily: {
        sans: ['"Comic Sans MS"', 'Arial', 'sans-serif'], // 卡通风格字体
      },
    },
  },
  plugins: [],
}
