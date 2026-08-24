# App 3 — Catalogue de Livres (Nginx + PHP + MySQL)

Application **3 tiers**, cette fois avec une vraie base de données séparée :

| Tier | Rôle | Technologie |
|---|---|---|
| Tier 1 — Présentation | Sert la page web | **Nginx** |
| Tier 2 — Application | API qui traite les requêtes | **PHP** |
| Tier 3 — Données | Stocke les données | **MySQL** |

Contrairement aux applications précédentes, la base de données est ici un **vrai serveur SGBD**, complètement séparé du backend : c'est le tier 3.

## Consigne pour les élèves

Vous devez :
1. **Faire démarrer les trois tiers en local** (base de données, backend, puis frontend).
2. **Vous assurer que la communication fonctionne de bout en bout** : Nginx → PHP → MySQL (voir "Vérification" ci-dessous).

⚠️ **Concernant Nginx (Tier 1) : aucune configuration à faire.** Nginx est déjà installé et configuré par défaut pour servir des fichiers statiques sur le port 80. Votre seule tâche pour ce tier est de **remplacer le fichier de page par défaut** par celui fourni (`frontend/index.html`). Ne modifiez pas les fichiers de configuration de Nginx (`nginx.conf`, `sites-available/...`) : ce n'est pas nécessaire et ce n'est pas l'objet de cet exercice.

## Prérequis

Sur Ubuntu/Debian :

```bash
sudo apt update
sudo apt install mysql-server php-cli php-mysql nginx
```

⚠️ **Important : n'installez pas le paquet `php` générique.** Sur Ubuntu/Debian, celui-ci entraîne l'installation d'Apache comme dépendance (`libapache2-mod-php`). Or Apache et Nginx écoutent tous les deux sur le **port 80** par défaut : s'ils sont installés tous les deux, l'un empêchera l'autre de démarrer. La commande ci-dessus (`php-cli` + `php-mysql`) installe uniquement ce dont on a besoin — le serveur de développement PHP intégré (utilisé à l'étape 2) — sans toucher à Apache.

Si Apache a déjà été installé par erreur (par exemple après un `apt install php`), désinstallez-le avant de continuer :

```bash
sudo systemctl stop apache2
sudo systemctl disable apache2
sudo apt remove --purge apache2 apache2-bin apache2-data apache2-utils libapache2-mod-php*
```

(Sur une autre distribution ou sur macOS/Windows, installez les équivalents : MySQL ou MariaDB, PHP en ligne de commande avec l'extension `pdo_mysql`, et Nginx — en veillant à ne pas avoir Apache actif sur le port 80 en même temps.)

## Étape 1 — Préparer la base de données (Tier 3)

Démarrez MySQL s'il n'est pas déjà lancé :

```bash
sudo service mysql start          # ou : sudo systemctl start mysql
```

Exécutez le script d'initialisation fourni, qui crée la base, un utilisateur dédié et une table avec quelques données de départ :

```bash
sudo mysql -u root < db/init.sql
```

Vérifiez que les données sont bien là :

```bash
mysql -u biblio_user -pbiblio_pass bibliotheque -e "SELECT * FROM livres;"
```

Vous devez voir 2 lignes (Le Petit Prince, 1984).

> Identifiants créés par le script : utilisateur `biblio_user`, mot de passe `biblio_pass`, base `bibliotheque`. Ce sont ceux utilisés par le backend PHP dans `backend/db.php` — ne les changez pas sans adapter ce fichier également.

## Étape 2 — Démarrer le backend (Tier 2)

Dans un **nouveau terminal** :

```bash
cd backend
php -S 0.0.0.0:8000
```

Le serveur de développement intégré à PHP suffit pour cet exercice (pas besoin d'installer/configurer Apache).

Testez que le backend répond et arrive à joindre la base :

```bash
curl http://localhost:8000/api/health
```

Vous devez obtenir : `{"status":"ok","message":"Backend PHP opérationnel, connecté à MySQL"}`

## Étape 3 — Mettre en place le frontend (Tier 1)

Assurez-vous que Nginx est démarré :

```bash
sudo service nginx start          # ou : sudo systemctl start nginx
```

Repérez le dossier racine servi par Nginx (généralement `/var/www/html` sur Ubuntu/Debian) :

```bash
sudo nginx -T | grep root
```

Remplacez simplement le fichier de page par défaut par celui fourni :

```bash
sudo cp frontend/index.html /var/www/html/index.html
```

C'est tout — aucune autre modification n'est nécessaire côté Nginx.

## Vérification de la communication de bout en bout

1. Ouvrez **http://localhost** dans votre navigateur (Tier 1, Nginx).
2. Un message doit s'afficher :
   - ✅ `Backend PHP opérationnel, connecté à MySQL` → les 3 tiers communiquent
   - ❌ `Backend inaccessible` → le serveur PHP (Tier 2) n'est pas démarré sur le port 8000
   - Une erreur de connexion à la base (visible sur `http://localhost:8000/api/health`) → MySQL (Tier 3) n'est pas démarré, ou les identifiants ne correspondent pas
3. La liste des 2 livres initiaux doit s'afficher.
4. Ajoutez un livre via le formulaire, puis rechargez la page (F5) : le livre doit toujours être présent.
5. Vérifiez directement en base que la donnée y est bien arrivée :
   ```bash
   mysql -u biblio_user -pbiblio_pass bibliotheque -e "SELECT * FROM livres;"
   ```
   Le livre ajouté doit apparaître : preuve que la chaîne Nginx → PHP → MySQL fonctionne réellement, et pas seulement l'affichage côté navigateur.

## En cas de problème

- **"Backend inaccessible"** : vérifiez que `php -S 0.0.0.0:8000` tourne toujours dans son terminal (il ne doit pas avoir été fermé ou avoir planté).
- **Erreur de connexion à la base** dans la réponse de `/api/health` : vérifiez que MySQL est démarré (`sudo service mysql status`) et que le script `db/init.sql` a bien été exécuté sans erreur.
- **Nginx refuse de démarrer / erreur "Address already in use" sur le port 80** : un autre serveur web (souvent Apache) occupe déjà le port 80. Vérifiez avec `sudo ss -tlnp | grep :80` quel processus l'utilise, puis arrêtez-le (`sudo systemctl stop apache2` si c'est Apache) avant de relancer Nginx.
- **La page par défaut de Nginx s'affiche toujours** : vérifiez que vous avez bien copié le fichier au bon endroit (`sudo nginx -T | grep root` pour confirmer le chemin), et videz le cache de votre navigateur (Ctrl+Shift+R).
- **Erreur d'accès refusé MySQL** : si vous avez déjà un utilisateur `biblio_user` d'une tentative précédente avec un autre mot de passe, supprimez-le avant de relancer le script :
  ```bash
  sudo mysql -u root -e "DROP USER IF EXISTS 'biblio_user'@'localhost'; DROP DATABASE IF EXISTS bibliotheque;"
  ```
  puis relancez `sudo mysql -u root < db/init.sql`.
