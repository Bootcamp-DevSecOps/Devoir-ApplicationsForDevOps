# App 1 — Gestion de Tâches (React + Express + SQLite)

Application deux tiers :
- **Frontend** : React (Vite)
- **Backend** : Node.js / Express
- **Base de données** : SQLite intégrée (fichier `todos.db` créé automatiquement au démarrage du backend, aucun serveur de base de données à installer)

## Consigne pour les élèves

Vous devez :
1. **Faire démarrer l'application en local** (backend puis frontend).
2. **Vérifier que le frontend communique bien avec le backend** (voir section "Vérification" ci-dessous).

L'exercice n'est validé que lorsque ces deux points fonctionnent.

## Prérequis

- Node.js (version 18 ou supérieure) et npm installés
- Vérifier avec : `node -v` et `npm -v`

## Étape 1 — Démarrer le backend

```bash
cd backend
npm install
npm start
```

Le backend démarre sur **http://localhost:3001**.
Au premier démarrage, le fichier `todos.db` (base SQLite) est créé automatiquement dans le dossier `backend/`.

## Étape 2 — Démarrer le frontend

Dans un **second terminal** :

```bash
cd frontend
npm install
npm run dev
```

Le frontend démarre sur **http://localhost:5173**.

## Vérification de la communication frontend ↔ backend

1. Ouvrez http://localhost:5173 dans votre navigateur.
2. Sous le titre, un message doit s'afficher :
   - ✅ `Backend Express opérationnel` → la communication fonctionne
   - ❌ `Backend inaccessible` → le backend n'est pas démarré ou n'est pas sur le port 3001
3. Ajoutez une tâche via le formulaire, rechargez la page (F5) : la tâche doit toujours être présente (preuve que les données sont bien enregistrées dans la base SQLite via le backend).
4. Vous pouvez aussi tester directement l'API dans le navigateur : http://localhost:3001/api/health

## En cas de problème

- Erreur CORS ou "Backend inaccessible" : vérifiez que le backend tourne bien (terminal 1) avant de recharger le frontend.
- Port déjà utilisé : fermez l'application qui occupe le port 3001 ou 5173, ou modifiez le port dans `backend/server.js` / `frontend/vite.config.js` (et dans `API_URL` de `App.jsx`).
