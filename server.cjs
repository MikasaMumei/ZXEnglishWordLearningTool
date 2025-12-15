const express = require('express');
const Database = require('better-sqlite3');
const multer = require('multer');
const XLSX = require('xlsx');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3678;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // 支持表单数据
// multer中间件只用于文件上传路由

// Ensure data directory and databases exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

// Initialize users.db
const usersDbPath = path.join(dataDir, 'users.db');
const usersDb = new Database(usersDbPath);
usersDb.exec(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    name TEXT,
    class TEXT,
    progress TEXT,
    coins INTEGER DEFAULT 0,
    score INTEGER DEFAULT 0
)`);

// Initialize words.db
const wordsDbPath = path.join(dataDir, 'words.db');
const wordsDb = new Database(wordsDbPath);
wordsDb.exec(`CREATE TABLE IF NOT EXISTS words (
    id INTEGER PRIMARY KEY,
    word TEXT,
    meaning TEXT,
    phonetic_uk TEXT,
    phonetic_us TEXT,
    type TEXT,
    level INTEGER
)`);

// WebSocket server - attach to Express server instead of separate port
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server, path: '/ws' });
wss.on('connection', (ws) => {
    console.log('WebSocket connection established');
    // Placeholder for game logic
});

// API Routes

// POST /sync
app.post('/sync', (req, res) => {
    const data = req.body;
    // Placeholder: merge or replace user data in users.db
    // Assuming data has id, name, class, progress (JSON string), coins, score
    const stmt = usersDb.prepare(`INSERT OR REPLACE INTO users (id, name, class, progress, coins, score) VALUES (?, ?, ?, ?, ?, ?)`);
    stmt.run(data.id, data.name, data.class, JSON.stringify(data.progress), data.coins, data.score);
    res.status(200).send({ message: 'Data synced' });
});

// GET /data
app.get('/data', (req, res) => {
    // Get ranking and words data
    const rankingStmt = usersDb.prepare(`SELECT name, score FROM users ORDER BY score DESC LIMIT 10`);
    const ranking = rankingStmt.all();
    const wordsStmt = wordsDb.prepare(`SELECT * FROM words`);
    const words = wordsStmt.all();
    res.json({ ranking, words });
});

// GET /admin
app.get('/admin', (req, res) => {
    const html = `
    <!DOCTYPE html>
    <html>
    <head><title>Admin Login</title></head>
    <body>
        <form action="/admin/login" method="POST">
            Password: <input type="password" name="password"><br>
            <input type="submit" value="Login">
        </form>
    </body>
    </html>
    `;
    res.send(html);
});

// POST /admin/login (simple check)
app.post('/admin/login', (req, res) => {
    if (req.body.password === '123456') {
        res.send('Login successful - placeholder for admin dashboard');
    } else {
        res.status(401).send('Invalid password');
    }
});

// POST /admin/import-words
app.post('/admin/import-words', multer().any(), (req, res) => {
    const file = req.files[0];
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // Assuming structure: Word, Phonetic_UK, Phonetic_US, Meaning
    rows.slice(1).forEach(row => {
        const word = row[0];
        const phonetic_uk = row[1];
        const phonetic_us = row[2];
        const meaningRaw = row[3];
        // Parse meaning: split by newline into JSON array
        const meanings = meaningRaw.split('\n').map(m => {
            const [type, def] = m.split('. ');
            return { type: type || '', definition: def || m };
        });
        const stmt = wordsDb.prepare(`INSERT INTO words (word, meaning, phonetic_uk, phonetic_us, type, level) VALUES (?, ?, ?, ?, ?, ?)`);
        stmt.run(word, JSON.stringify(meanings), phonetic_uk, phonetic_us, '', 1); // Placeholder for type and level
    });
    res.status(200).send({ message: 'Words imported' });
});

// POST /admin/export-wrong-words
app.post('/admin/export-wrong-words', (req, res) => {
    const { studentId, format } = req.body;
    // Placeholder: generate HTML or PDF based on wrong words
    // For now, just return a simple response
    res.status(200).send({ message: `Exported wrong words for student ${studentId} in format ${format}` });
});

// Start server after DB init
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
