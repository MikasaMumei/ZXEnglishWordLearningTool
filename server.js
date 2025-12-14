const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const xlsx = require('xlsx');
const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');

// 初始化 Express 应用
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: '/ws' });

// 中间件
app.use(express.json());
app.use(express.static('dist')); // 静态文件服务

// 初始化数据库
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

const usersDb = new sqlite3.Database(path.join(dataDir, 'users.db'));
const wordsDb = new sqlite3.Database(path.join(dataDir, 'words.db'));

// 创建表
usersDb.serialize(() => {
  usersDb.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      class TEXT,
      progress TEXT, -- JSON
      coins INTEGER DEFAULT 0,
      score INTEGER DEFAULT 0
    )
  `);
});

wordsDb.serialize(() => {
  wordsDb.run(`
    CREATE TABLE IF NOT EXISTS words (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      word TEXT,
      meaning TEXT, -- JSON
      phonetic_uk TEXT,
      phonetic_us TEXT,
      type TEXT,
      level INTEGER
    )
  `);
});

// WebSocket 处理对战
const games = new Map();

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const data = JSON.parse(message.toString());
    // 处理对战逻辑
    if (data.type === 'join') {
      // 匹配逻辑
    }
    // ... 其他对战消息
  });
});

// API 接口
app.post('/sync', (req, res) => {
  const { name, class: userClass, progress, coins, score } = req.body;
  usersDb.run(
    `INSERT OR REPLACE INTO users (name, class, progress, coins, score) VALUES (?, ?, ?, ?, ?)`,
    [name, userClass, JSON.stringify(progress), coins, score],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

app.get('/data', (req, res) => {
  usersDb.all(`SELECT name, class, score FROM users ORDER BY score DESC LIMIT 10`, (err, users) => {
    if (err) return res.status(500).json({ error: err.message });
    wordsDb.all(`SELECT * FROM words`, (err, words) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ ranking: users, words });
    });
  });
});

app.get('/admin', (req, res) => {
  res.send(`
    <html>
      <body>
        <form action="/admin/login" method="POST">
          <input name="password" type="password" placeholder="Password">
          <button type="submit">Login</button>
        </form>
      </body>
    </html>
  `);
});

app.post('/admin/login', (req, res) => {
  if (req.body.password === '123456') {
    res.redirect('/admin/dashboard');
  } else {
    res.send('Invalid password');
  }
});

// 简化的管理后台
app.get('/admin/dashboard', (req, res) => {
  res.send('<h1>Admin Dashboard</h1>'); // 简化
});

// 词汇导入
const upload = multer({ dest: 'uploads/' });
app.post('/admin/import-words', upload.single('file'), (req, res) => {
  const workbook = xlsx.readFile(req.file.path);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(worksheet);

  wordsDb.serialize(() => {
    const stmt = wordsDb.prepare(`
      INSERT OR REPLACE INTO words (word, meaning, phonetic_uk, phonetic_us, type, level)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    data.forEach(row => {
      const meaning = row['释义'].split('\n').map(line => {
        const parts = line.split('\t');
        return { partOfSpeech: parts[0], meaning: parts[1] || parts[0] };
      });
      stmt.run(row['单词'], JSON.stringify(meaning), row['英音'], row['美音'], row['type'] || 'vocabulary', row['level'] || 1);
    });

    stmt.finalize();
    res.json({ success: true });
  });

  fs.unlinkSync(req.file.path);
});

// 启动服务器
const PORT = 3678;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
