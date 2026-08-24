-- Script d'initialisation de la base de données (Tier 3)
-- À exécuter avec un utilisateur ayant les droits d'administration MySQL,
-- par exemple : sudo mysql -u root -p < db/init.sql

SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS bibliotheque CHARACTER SET utf8mb4;

CREATE USER IF NOT EXISTS 'biblio_user'@'localhost' IDENTIFIED BY 'biblio_pass';
GRANT ALL PRIVILEGES ON bibliotheque.* TO 'biblio_user'@'localhost';
FLUSH PRIVILEGES;

USE bibliotheque;

CREATE TABLE IF NOT EXISTS livres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    auteur VARCHAR(255) NOT NULL,
    annee INT
);

INSERT INTO livres (titre, auteur, annee) VALUES
    ('Le Petit Prince', 'Antoine de Saint-Exupéry', 1943),
    ('1984', 'George Orwell', 1949);
