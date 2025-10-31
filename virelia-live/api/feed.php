<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once '../config/database.php';

class Feed {
    private $db;
    private $conn;

    public function __construct() {
        $this->db = new Database();
        $this->conn = $this->db->getConnection();
    }

    public function getFeed($page = 1, $filter = 'all') {
        $limit = 10;
        $offset = ($page - 1) * $limit;

        // Base query
        $query = "SELECT p.*, u.name as user_name, u.username as user_handle, u.avatar as user_avatar 
                  FROM posts p 
                  JOIN users u ON p.user_id = u.id 
                  WHERE 1=1";

        // Apply filters
        if ($filter === 'following') {
            // This would require a follows table and the current user id
            // For now, we'll return all posts
            // $query .= " AND u.id IN (SELECT following_id FROM follows WHERE follower_id = ?)";
        } elseif ($filter === 'trending') {
            $query .= " ORDER BY (p.likes_count + p.comments_count * 2 + p.shares_count * 3) DESC";
        } elseif ($filter === 'ai') {
            $query .= " AND p.is_ai_generated = 1";
        } else {
            $query .= " ORDER BY p.created_at DESC";
        }

        $query .= " LIMIT ? OFFSET ?";

        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ii", $limit, $offset);
        $stmt->execute();
        $result = $stmt->get_result();

        $posts = [];
        while ($row = $result->fetch_assoc()) {
            // Check if the current user has liked the post
            $row['user_liked'] = $this->checkIfUserLiked($row['id']);
            $posts[] = $row;
        }

        return [
            'success' => true,
            'posts' => $posts,
            'hasMore' => count($posts) === $limit
        ];
    }

    private function checkIfUserLiked($post_id) {
        // This should check from the likes table for the current user
        // For now, return false
        return false;
    }
}

// Handle request
$feed = new Feed();
$page = $_GET['page'] ?? 1;
$filter = $_GET['filter'] ?? 'all';

echo json_encode($feed->getFeed($page, $filter));
?>
