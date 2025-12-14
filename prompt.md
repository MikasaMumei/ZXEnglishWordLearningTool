##🚀 最终优化版 AI 编程提示词清单###Prompt 1: 核心系统架构与后端服务 (WebSocket & SQLite)> >
> **角色设定：** 你是一名精通 Node.js、SQLite 和 **WebSocket** 的全栈工程师。
> **目标：** 创建一个极简的 Node.js 后端服务，用于支持前端的离线局域网学习系统。此服务必须包含 Excel 词汇导入功能和实时对战功能。
> **要求：**
> 1. **服务环境：** 使用纯 Node.js，监听 **3678 端口**。
> * **实时通信：** 必须集成 **`ws` 库** 实现 **WebSocket** 服务器，用于处理学生间的实时双人对战 (`/ws` 路径)。
> * **初始化检查：** 启动时必须检查并创建 `data` 文件夹和所需的 `.db` 文件。
> * **依赖：** 请使用 **`sqlite3`**, **`multer`**, **`xlsx`** 和 **`ws`** 库。
> 
> 
> 2. **数据结构：**
> * `data/users.db`：核心表 `users` (`id`, `name`, `class`, `progress` [JSON], `coins`, `score`)。
> * `data/words.db`：核心表 `words`。结构为：(`id` INTEGER PRIMARY KEY, `word` TEXT, `meaning` JSON, `phonetic_uk` TEXT, `phonetic_us` TEXT, `type` TEXT, `level` INTEGER)。**注意：`meaning` 字段必须是结构化 JSON。**
> 
> 
> 3. **核心 API 接口 (HTTP)：**
> * **POST /sync：** 接收学生端 JSON 数据，将数据**合并或替换**到 `users.db`。
> * **GET /data：** 返回最新的全局排行榜数据和所有词库数据。
> * **GET /admin：** 返回一个极简的 **HTML 管理登录页面**（密码：`123456`）。
> * **POST /admin/export-wrong-words：** 接收学生ID、导出格式参数（如：`full`、`gap-fill`）。根据学生的错题本数据，生成并返回一个 **PDF 或 HTML 文档**，格式必须是 **A4 纸双列排版**，以节省纸张。
> 
> 
> 4. **Excel 导入接口 (新增)：**
> * **POST /admin/import-words：** 接收上传的 Excel 文件（.xlsx）。
> * **导入规则：** **请翻看 FileStruc.md 文件，参考其中的 Excel 结构**。
> * **释义解析：** 后端导入时，必须将释义字段中通过**换行符分隔**的词性-释义对，解析为结构化的 JSON 数组（例如 `[{ partOfSpeech: 'n.', meaning: '意思1' }, ...]`），并存储在 `meaning` 字段中。
> * 其他字段映射、空值处理和事务机制不变。
> 
> 
> 
> 
> 
> 
> **输出要求：**
> * 输出一个名为 `server.js` 的完整 Node.js 文件（包含 HTTP、WebSocket 逻辑和文件处理）。
> * 输出 `FileStruc.md` 文件内容。
> * 给出如何安装所需 Node.js 库的说明。
> 
> 

###Prompt 2: 前端项目初始化与配置> **角色设定：** 你是一名精通 Vue3、Vite 和 Tailwind CSS 的前端架构师。
> **目标：** 初始化一个完整的 Vue3 (Composition API + `<script setup>`) + Vite + TypeScript + Tailwind CSS 4.0 项目骨架。
> **要求：**
> 1. **项目配置：**
> * 创建 `package.json`，包含所有必要的依赖（`vue`, `vite`, `pinia`, `vue-router`, `typescript`, `tailwindcss`, **`websocket` 客户端库** 等）。
> * 配置 `vite.config.ts`，设置 `base: './'` 以确保项目是完全**离线单页应用 (SPA)**，并配置路径别名 `@`。
> * 配置 `tailwind.config.js`，包含适合 **6～15岁学生** 的**精美卡通风格**配色方案（清新、明亮），并设置字体。
> 
> 
> 2. **结构搭建：**
> * 保持原有结构，并新增 `src/stores/game.ts` 用于对战状态管理。
> * **音频说明：** 在 `public/audio` 文件夹说明中，明确音频文件应命名为 `[word_id].mp3` (推荐使用ID，以防特殊字符) 或 `[word].mp3`。
> 
> 
> 
> 
> **输出要求：** 完整输出 `package.json`、`vite.config.ts` 和 `tailwind.config.js` 的内容。

###Prompt 3: 核心功能与状态管理 (Pinia)> **目标：** 实现前端系统的核心状态管理和数据逻辑。
> **要求：**
> 1. **用户认证 Store (`stores/auth.ts`)：** State 和 Action 保持不变。
> 2. **学习数据 Store (`stores/learning.ts`)：**
> * **进度存储结构：** 明确 `progress` JSON 结构为：`{'wordId': { status: 'new'/'learning'/'mastered', lastReview: 'YYYY-MM-DD', nextReview: 'YYYY-MM-DD', reviewInterval: 1, wrongCount: 0 }}`。
> * **错题本 Action：** 增加 Action `addWrongWord(wordId, type)`，记录单词ID和错误类型（如 `meaning-quiz`）。
> * **干扰项生成：** Getter 增加 `getQuizOptions(correctWordId)` 方法。该方法必须能够访问结构化 `meaning` 字段，并生成包含 **3 个相关干扰项**的选项列表（干扰项应来自同难度或同词书）。
> 
> 
> 3. **对战 Store (`stores/game.ts` - 新增)：**
> * State：`isConnected`, `gameId`, `opponentName`, `myScore`, `opponentScore`, `quizList`。
> * Action：`connectWebSocket()`, `initiateMatch(targetWordCount)`, `sendAnswer(answer)`.
> 
> 
> 4. **同步 Action：** `syncDataToBackend()` 保持不变。
> 
> 
> **输出要求：** 完整输出 `src/stores/learning.ts` 和 `src/stores/game.ts` 的核心代码结构。

###Prompt 4: 用户界面与学习模式组件> **目标：** 实现前端的关键用户界面、背词功能组件和对战入口。
> **要求：**
> 1. **首页 (`views/HomeView.vue`)：**
> * 保持原有的圆环进度、金币显示。
> * **学习模式入口：** 增加**第 5 个模式：“我的错题本”**。
> * **对战入口：** 增加一个醒目的“**双人单词挑战**”按钮。
> 
> 
> 2. **对战视图 (`views/GameView.vue` - 新增)：** 实现一个简单的双人对战界面，显示自己的分数、对手的分数、当前题目和倒计时。界面通过 WebSocket Store 进行状态交互。
> 3. **错题本视图 (`views/WrongWordsView.vue` - 新增)：** 允许学生查看和练习自己的错题列表。
> 
> 
> **输出要求：** 完整输出 `src/views/HomeView.vue` 的 `<template>` 和 `<script setup>` 部分。

###Prompt 5: 老师管理后台 (Admin)> **目标：** 实现老师管理后台（`/admin`）的关键功能，特别是数据导出。
> **要求：**
> 1. **路由保护：** 保持不变。
> 2. **管理后台首页 (`views/Admin/AdminDashboard.vue`)：**
> * **导入/管理词库模块：** 保持不变。
> * **布置任务模块：** 保持不变。
> * **数据查看模块：** 显示学生排行榜和详细学习数据列表。
> * **错题本导出功能：** 界面上必须提供一个按钮，调用后端 **POST /admin/export-wrong-words** 接口，并允许老师选择以下**导出格式**：
> * **格式 1 (完整)：** 单词、英/美音标、完整释义。
> * **格式 2 (挖空)：** 单词、英/美音标、释义挖空（仅保留词性或首字母）。
> 
> 
> * **手动调整模块：** 保持不变。
> 
> 
> 
> 
> **输出要求：** 给出 `views/Admin/AdminDashboard.vue` 中关于**错题本导出功能**界面的 `<template>` 和相关方法调用代码。

###Prompt 6: 打包与部署脚本> **目标：** 创建一个简单的**一键启动脚本**，用于老师在 Windows 环境下部署和启动整个系统。
> **要求：** 保持不变。

现在，这个完整的提示词清单已经将您的所有需求（包括实时对战、详细的错题导出格式和结构化数据处理）整合进了前后端架构中。您可以开始您的 AI 编程任务了。