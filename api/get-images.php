<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://127.0.0.1:8000/'); // Restrict to your domain

// Validate production line
$allowedLines = ['H3', 'H4', 'H5', 'H6', 'D1'];
$line = isset($_GET['line']) ? strtoupper($_GET['line']) : '';

if (!in_array($line, $allowedLines)) {
    error_log("Invalid production line: $line");
    http_response_code(400);
    die(json_encode(['error' => 'Invalid production line']));
}

// Validate directory
$basePath = realpath(__DIR__ . '../Resources/images/');
$imagePath = realpath("$basePath/$line");

if (!$imagePath || strpos($imagePath, $basePath) !== 0 || !is_dir($imagePath)) {
    error_log("Directory not found for line: $line");
    http_response_code(404);
    die(json_encode(['error' => 'Directory not found']));
}

// Get images
$images = [];
foreach (scandir($imagePath) as $file) {
    if (preg_match('/\.(jpg|jpeg|png|webp)$/i', $file)) {
        $images[] = [
            'url' => "/Resources/images/$line/" . rawurlencode($file),
            'timestamp' => filemtime("$imagePath/$file")
        ];
    }
}

// Return response
echo json_encode(['images' => $images], JSON_UNESCAPED_SLASHES);
?>