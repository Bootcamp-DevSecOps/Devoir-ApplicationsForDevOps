const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Base de données SQLite intégrée (fichier local, pas de serveur SGBD)
const db = new Database(path.join(__dirname, 'todos.db'));
db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    done INTEGER NOT NULL DEFAULT 0
  )
`);

// Route de test pour vérifier la communication frontend <-> backend
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend Express opérationnel' });
});

app.get('/api/todos', (req, res) => {
  const todos = db.prepare('SELECT * FROM todos ORDER BY id DESC').all();
  res.json(todos);
});

app.post('/api/todos', (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Le texte est requis' });
  }
  const info = db.prepare('INSERT INTO todos (text, done) VALUES (?, 0)').run(text.trim());
  const newTodo = db.prepare('SELECT * FROM todos WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(newTodo);
});

app.put('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  const todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
  if (!todo) return res.status(404).json({ error: 'Tâche non trouvée' });
  db.prepare('UPDATE todos SET done = ? WHERE id = ?').run(todo.done ? 0 : 1, id);
  const updated = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
  res.json(updated);
});

app.delete('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM todos WHERE id = ?').run(id);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur http://localhost:${PORT}`);
});
