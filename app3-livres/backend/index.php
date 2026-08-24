<?php
// API backend (Tier 2) - fait le lien entre le frontend Nginx et la base MySQL

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

header('Content-Type: application/json');
require __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Route de test pour vérifier la communication et la connexion à la base
if ($uri === '/api/health' && $method === 'GET') {
    echo json_encode(['status' => 'ok', 'message' => 'Backend PHP opérationnel, connecté à MySQL']);
    exit;
}

if ($uri === '/api/livres' && $method === 'GET') {
    $stmt = $pdo->query('SELECT * FROM livres ORDER BY id DESC');
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}

if ($uri === '/api/livres' && $method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $titre = trim($data['titre'] ?? '');
    $auteur = trim($data['auteur'] ?? '');
    $annee = $data['annee'] ?? null;

    if ($titre === '' || $auteur === '') {
        http_response_code(400);
        echo json_encode(['error' => "Le titre et l'auteur sont requis"]);
        exit;
    }

    $stmt = $pdo->prepare('INSERT INTO livres (titre, auteur, annee) VALUES (?, ?, ?)');
    $stmt->execute([$titre, $auteur, $annee]);
    $id = $pdo->lastInsertId();

    $stmt = $pdo->prepare('SELECT * FROM livres WHERE id = ?');
    $stmt->execute([$id]);
    http_response_code(201);
    echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
    exit;
}

if (preg_match('#^/api/livres/(\d+)$#', $uri, $matches) && $method === 'DELETE') {
    $id = $matches[1];
    $stmt = $pdo->prepare('DELETE FROM livres WHERE id = ?');
    $stmt->execute([$id]);
    http_response_code(204);
    exit;
}

http_response_code(404);
echo json_encode(['error' => 'Route non trouvée']);
