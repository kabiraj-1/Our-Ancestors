<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once '../config/database.php';

class Chat {
    private $db;
    private $conn;

    public function __construct() {
        $this->db = new Database();
        $this->conn = $this->db->getConnection();
    }

    public function sendMessage($message) {
        // This is a simplified version. In a real app, you would integrate with an AI service.

        // For now, we'll return a static response based on the message.
        $response = $this->generateResponse($message);

        return [
            'success' => true,
            'response' => $response
        ];
    }

    private function generateResponse($message) {
        $message = strtolower($message);

        if (strpos($message, 'hello') !== false || strpos($message, 'hi') !== false) {
            return "Hello! How can I assist you today?";
        } elseif (strpos($message, 'how are you') !== false) {
            return "I'm just a program, but I'm functioning as expected! How can I help you?";
        } elseif (strpos($message, 'post') !== false) {
            return "I can help you create a post. Just go to the post creation page and start typing!";
        } elseif (strpos($message, 'ai') !== false) {
            return "AI is fascinating, isn't it? I'm here to help you with various tasks on Virelia.";
        } else {
            return "I'm sorry, I didn't understand that. I can help you with creating posts, finding content, and more!";
        }
    }
}

// Handle request
$chat = new Chat();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $message = $input['message'] ?? '';

    if (!empty($message)) {
        echo json_encode($chat->sendMessage($message));
    } else {
        echo json_encode(['success' => false, 'message' => 'Message is required']);
    }
}
?>
