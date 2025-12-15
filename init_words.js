const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

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

// Insert test words
const words = [
    ['hello', '[{"type":"greeting","definition":"你好"}]', '/ˈhələʊ/', '/ˈhɛloʊ/', 'greeting', 1],
    ['world', '[{"type":"noun","definition":"世界"}]', '/wɜːld/', '/wɜːrld/', 'noun', 1],
    ['apple', '[{"type":"noun","definition":"苹果"}]', '/ˈæpəl/', '/ˈæpəl/', 'noun', 1],
    ['book', '[{"type":"noun","definition":"书"}]', '/bʊk/', '/bʊk/', 'noun', 1],
    ['cat', '[{"type":"noun","definition":"猫"}]', '/kæt/', '/kæt/', 'noun', 1],
    ['dog', '[{"type":"noun","definition":"狗"}]', '/dɒɡ/', '/dɔːɡ/', 'noun', 1],
    ['run', '[{"type":"verb","definition":"跑"}]', '/rʌn/', '/rʌn/', 'verb', 1],
    ['jump', '[{"type":"verb","definition":"跳"}]', '/dʒʌmp/', '/dʒʌmp/', 'verb', 1]
];

const stmt = wordsDb.prepare(`INSERT OR REPLACE INTO words (word, meaning, phonetic_uk, phonetic_us, type, level) VALUES (?, ?, ?, ?, ?, ?)`);

words.forEach(word => {
    stmt.run(word[0], word[1], word[2], word[3], word[4], word[5]);
});

console.log('Test words inserted successfully');
wordsDb.close();
