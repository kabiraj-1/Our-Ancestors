<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once '../config/database.php';

class Users {
    private $db;
    private $conn;

    public function __construct() {
        $this->db = new Database();
        $this->conn = $this->db->getConnection();
    }

    public function getUserProfile($user_id) {
        $query = "SELECT id, name, username, avatar, bio, website, location, created_at FROM users WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("s", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();

            // Get user stats
            $user['stats'] = $this->getUserStats($user_id);

            return ['success' => true, 'user' => $user];
        } else {
            return ['success' => false, 'message' => 'User not found'];
        }
    }

    private function getUserStats($user_id) {
        // Post count
        $query = "SELECT COUNT(*) as post_count FROM posts WHERE user_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("s", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $post_count = $result->fetch_assoc()['post_count'];

        // Follower count
        $query = "SELECT COUNT(*) as follower_count FROM follows WHERE following_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("s", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $follower_count = $result->fetch_assoc()['follower_count'];

        // Following count
        $query = "SELECT COUNT(*) as following_count FROM follows WHERE follower_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("s", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $following_count = $result->fetch_assoc()['following_count'];

        return [
            'posts' => $post_count,
            'followers' => $follower_count,
            'following' => $following_count
        ];
    }
}

// Handle request
$users = new Users();
$user_id = $_GET['user_id'] ?? '';

if (!empty($user_id)) {
    echo json_encode($users->getUserProfile($user_id));
} else {
    echo json_encode(['success' => false, 'message' => 'User ID is required']);
}
?>
