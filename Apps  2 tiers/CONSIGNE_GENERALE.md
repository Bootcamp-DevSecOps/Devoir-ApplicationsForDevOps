# Exercice — Déploiement d'applications web deux tiers

Vous disposez de **deux applications web** de type **deux tiers** (frontend / backend, avec une base de données intégrée, sans SGBD séparé à installer) : chacune utilise une technologie différente.

| Application | Frontend | Backend | Base de données |
|---|---|---|---|
| App 1 — Gestion de tâches | React | Node.js / Express | SQLite (intégrée) |
| App 2 — Carnet de contacts | Vue.js | Python / Flask | SQLite (intégrée) |

Soit **4 technologies différentes** au total (React, Node/Express, Vue.js, Flask), pour vous exercer sur des environnements variés.

## Ce que vous devez réussir à faire

Pour **chacune des deux applications**, vous devez impérativement :

1. **Démarrer l'application en local** :
   - Installer les dépendances du backend et le lancer.
   - Installer les dépendances du frontend et le lancer.
2. **Vous assurer que la communication entre le frontend et le backend fonctionne réellement** :
   - Le message de statut affiché sur la page doit confirmer que le backend répond (pas de message d'erreur "backend inaccessible").
   - Vous devez pouvoir ajouter une donnée depuis le frontend (une tâche pour l'App 1, un contact pour l'App 2) et vérifier qu'elle est bien enregistrée (elle doit rester visible après un rechargement de la page, preuve qu'elle est stockée côté backend/base de données, et pas seulement affichée temporairement côté frontend).

Chaque application contient son propre fichier `README.md` avec les instructions détaillées, pas à pas, pour l'installation et le démarrage.

## Conseils

- Chaque application a besoin de **deux terminaux ouverts en même temps** : un pour le backend, un pour le frontend. Ne fermez pas le terminal du backend pendant que vous testez le frontend.
- Notez bien les ports utilisés par chaque application (ils sont différents pour éviter les conflits si vous testez les deux applications en même temps) :
  - App 1 : backend sur le port 3001, frontend sur le port 5173
  - App 2 : backend sur le port 5000, frontend sur le port 5174
- Si un message d'erreur "backend inaccessible" apparaît, vérifiez d'abord que le processus backend est bien lancé et n'a pas planté (regardez le terminal correspondant).
