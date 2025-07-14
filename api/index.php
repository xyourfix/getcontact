<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Health check endpoint
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $_SERVER['REQUEST_URI'] === '/api/health') {
    echo json_encode([
        'status' => 'OK',
        'timestamp' => date('c')
    ]);
    exit();
}

// Phone number check endpoint
if ($_SERVER['REQUEST_METHOD'] === 'POST' && strpos($_SERVER['REQUEST_URI'], '/api/check-number') !== false) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['phone']) || !isset($input['token']) || !isset($input['finalKey'])) {
        http_response_code(400);
        echo json_encode([
            'error' => 'Missing required fields: phone, token, and finalKey are required'
        ]);
        exit();
    }
    
    try {
        require_once 'GetContact.php';
        
        $getContact = new GetContact($input['token'], $input['finalKey']);
        $result = $getContact->checkNumber($input['phone']);
        
        echo json_encode($result);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'error' => $e->getMessage()
        ]);
    }
    exit();
}

// 404 handler
http_response_code(404);
echo json_encode([
    'error' => 'Endpoint not found'
]);
?>