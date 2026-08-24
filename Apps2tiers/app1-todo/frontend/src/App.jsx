import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3001/api';

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [status, setStatus] = useState('Connexion au backend...');

  useEffect(() => {
    // Vérification de la communication frontend <-> backend
    fetch(`${API_URL}/health`)
      .then((res) => res.json())
      .then((data) => setStatus(`✅ ${data.message}`))
      .catch(() => setStatus("❌ Backend inaccessible. Vérifiez qu'il est démarré sur le port 3001."));
    fetchTodos();
  }, []);

  const fetchTodos = () => {
    fetch(`${API_URL}/todos`)
      .then((res) => res.json())
      .then(setTodos)
      .catch((err) => console.error(err));
  };

  const addTodo = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    fetch(`${API_URL}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    })
      .then((res) => res.json())
      .then(() => {
        setText('');
        fetchTodos();
      });
  };

  const toggleTodo = (id) => {
    fetch(`${API_URL}/todos/${id}`, { method: 'PUT' }).then(fetchTodos);
  };

  const deleteTodo = (id) => {
    fetch(`${API_URL}/todos/${id}`, { method: 'DELETE' }).then(fetchTodos);
  };

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>📝 Gestion de Tâches</h1>
      <p>{status}</p>
      <form onSubmit={addTodo} style={{ display: 'flex', gap: 8 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Nouvelle tâche..."
          style={{ flex: 1, padding: 8 }}
        />
        <button type="submit">Ajouter</button>
      </form>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 0',
              borderBottom: '1px solid #eee'
            }}
          >
            <input type="checkbox" checked={!!todo.done} onChange={() => toggleTodo(todo.id)} />
            <span style={{ flex: 1, textDecoration: todo.done ? 'line-through' : 'none' }}>
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>🗑️</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
