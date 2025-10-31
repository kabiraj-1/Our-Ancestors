<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once '../config/database.php';

class Posts {
    private $db;
    private $conn;

    public function __construct() {
        $this->db = new Database();
        $this->conn = $this->db->getConnection();
    }

    public function createPost($data, $user_id) {
        $content = $data['content'] ?? '';
        $media_type = $data['media_type'] ?? 'text';
        $media_url = $data['media_url'] ?? '';

        if (empty($content)) {
            return ['success' => false, 'message' => 'Content is required'];
        }

        $post_id = uniqid('post_', true);
        $created_at = date('Y-m-d H:i:s');

        $query = "INSERT INTO posts (id, user_id, content, media_type, media_url, created_at) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ssssss", $post_id, $user_id, $content, $media_type, $media_url, $created_at);

        if ($stmt->execute()) {
            return ['success' => true, 'message' => 'Post created successfully', 'post_id' => $post_id];
        } else {
            return ['success' => false, 'message' => 'Failed to create post'];
        }
    }

    public function likePost($post_id, $user_id) {
        // Check if already liked
        $check_query = "SELECT id FROM likes WHERE user_id = ? AND post_id = ?";
        $stmt = $this->conn->prepare($check_query);
        $stmt->bind_param("ss", $user_id, $post_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            // Unlike
            $delete_query = "DELETE FROM likes WHERE user_id = ? AND post_id = ?";
            $stmt = $this->conn->prepare($delete_query);
            $stmt->bind_param("ss", $user_id, $post_id);
            $stmt->execute();

            // Update likes count
            $this->updateLikesCount($post_id, -1);

            return ['success' => true, 'liked' => false];
        } else {
            // Like
            $insert_query = "INSERT INTO likes (user_id, post_id) VALUES (?, ?)";
            $stmt = $this->conn->prepare($insert_query);
            $stmt->bind_param("ss", $user_id, $post_id);
            $stmt->execute();

            // Update likes count
            $this->updateLikesCount($post_id, 1);

            return ['success' => true, 'liked' => true];
        }
    }

    private function updateLikesCount($post_id, $change) {
        $query = "UPDATE posts SET likes_count = likes_count + ? WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("is", $change, $post_id);
        $stmt->execute();
    }
}

// Handle requests
$posts = new Posts();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $action = $_GET['action'] ?? '';

    // Get user ID from token (in a real app, you would validate the token)
    $user_id = $input['user_id'] ?? '';

    if ($action === 'create') {
        echo json_encode($posts->createPost($input, $user_id));
    } elseif ($action === 'like') {
        $post_id = $input['post_id'] ?? '';
        echo json_encode($posts->likePost($post_id, $user_id));
    }
}
?>
