<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Validate production line
$allowedLines = ['H3', 'H4', 'H5', 'H6', 'D1'];
$line = isset($_GET['line']) ? strtoupper($_GET['line']) : '';

if (!in_array($line, $allowedLines)) {
    http_response_code(400);
    die(json_encode(['error' => 'Invalid production line']));
}

// Validate directory
$imagePath = realpath($_SERVER['DOCUMENT_ROOT'] . "/Resources/images/$line/");
if (!$imagePath || !is_dir($imagePath)) {
    http_response_code(404);
    die(json_encode(['error' => 'Directory not found']));
}

// Get images
$images = [];
foreach (new DirectoryIterator($imagePath) as $file) {
    if ($file->isFile()) {
        $ext = strtolower($file->getExtension());
        if (in_array($ext, ['jpg', 'jpeg', 'png', 'webp'])) {
            $images[] = [
                'url' => "/Resources/images/$line/" . rawurlencode($file->getFilename()),
                'timestamp' => $file->getMTime()
            ];
        }
    }
}

if (empty($images)) {
    http_response_code(404);
    die(json_encode(['error' => 'No images found']));
}

echo json_encode(['images' => $images]);
?>