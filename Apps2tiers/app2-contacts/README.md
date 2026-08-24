# App 2 — Carnet de Contacts (Vue.js + Flask + SQLite)

Application deux tiers :
- **Frontend** : Vue.js (Vite)
- **Backend** : Python / Flask
- **Base de données** : SQLite intégrée (fichier `contacts.db` créé automatiquement au démarrage du backend, aucun serveur de base de données à installer)

## Consigne pour les élèves

Vous devez :
1. **Faire démarrer l'application en local** (backend puis frontend).
2. **Vérifier que le frontend communique bien avec le backend** (voir section "Vérification" ci-dessous).

L'exercice n'est validé que lorsque ces deux points fonctionnent.

## Prérequis

- Python (version 3.9 ou supérieure) et pip installés
- Vérifier avec : `python3 --version` et `pip3 --version`
- Node.js et npm installés (pour le frontend)

## Étape 1 — Démarrer le backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate 
pip install -r requirements.txt
python app.py
```

Le backend démarre sur **http://localhost:5000**.
Au premier démarrage, le fichier `contacts.db` (base SQLite) est créé automatiquement dans le dossier `backend/`.

## Étape 2 — Démarrer le frontend

Dans un **second terminal** :

```bash
cd frontend
npm install
npm run dev
```

Le frontend démarre sur **http://localhost:5174**.

## Vérification de la communication frontend ↔ backend

1. Ouvrez http://localhost:5174 dans votre navigateur.
2. Sous le titre, un message doit s'afficher :
   - ✅ `Backend Flask opérationnel` → la communication fonctionne
   - ❌ `Backend inaccessible` → le backend n'est pas démarré ou n'est pas sur le port 5000
3. Ajoutez un contact via le formulaire, rechargez la page (F5) : le contact doit toujours être présent (preuve que les données sont bien enregistrées dans la base SQLite via le backend).
4. Vous pouvez aussi tester directement l'API dans le navigateur : http://localhost:5000/api/health

## En cas de problème

- Erreur CORS ou "Backend inaccessible" : vérifiez que le backend tourne bien (terminal 1) avant de recharger le frontend.
- Port déjà utilisé : fermez l'application qui occupe le port 5000 ou 5174, ou modifiez le port dans `backend/app.py` / `frontend/vite.config.js` (et dans `API_URL` de `App.vue`).
