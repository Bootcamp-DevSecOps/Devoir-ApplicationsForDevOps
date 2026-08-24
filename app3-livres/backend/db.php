<?php
// Connexion à la base de données (Tier 3)
$host = '127.0.0.1';
$db   = 'bibliotheque';
$user = 'biblio_user';
$pass = 'biblio_pass';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Connexion à la base de données impossible: ' . $e->getMessage()]);
    exit;
}
