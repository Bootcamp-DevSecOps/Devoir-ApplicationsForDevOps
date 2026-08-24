from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
CORS(app)

DB_PATH = os.path.join(os.path.dirname(__file__), 'contacts.db')


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT,
            email TEXT
        )
    ''')
    conn.commit()
    conn.close()


# Route de test pour vérifier la communication frontend <-> backend
@app.route('/api/health')
def health():
    return jsonify({'status': 'ok', 'message': 'Backend Flask opérationnel'})


@app.route('/api/contacts', methods=['GET'])
def get_contacts():
    conn = get_db()
    rows = conn.execute('SELECT * FROM contacts ORDER BY id DESC').fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])


@app.route('/api/contacts', methods=['POST'])
def add_contact():
    data = request.get_json() or {}
    name = (data.get('name') or '').strip()
    phone = (data.get('phone') or '').strip()
    email = (data.get('email') or '').strip()
    if not name:
        return jsonify({'error': 'Le nom est requis'}), 400
    conn = get_db()
    cur = conn.execute(
        'INSERT INTO contacts (name, phone, email) VALUES (?, ?, ?)',
        (name, phone, email)
    )
    conn.commit()
    new_id = cur.lastrowid
    row = conn.execute('SELECT * FROM contacts WHERE id = ?', (new_id,)).fetchone()
    conn.close()
    return jsonify(dict(row)), 201


@app.route('/api/contacts/<int:contact_id>', methods=['DELETE'])
def delete_contact(contact_id):
    conn = get_db()
    conn.execute('DELETE FROM contacts WHERE id = ?', (contact_id,))
    conn.commit()
    conn.close()
    return '', 204


if __name__ == '__main__':
    init_db()
    app.run(port=5000, debug=True)
