<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once '../config/database.php';

class Auth {
    private $db;
    private $conn;

    public function __construct() {
        $this->db = new Database();
        $this->conn = $this->db->getConnection();
    }

    public function register($data) {
        $name = $data['name'] ?? '';
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';
        $username = $data['username'] ?? '';

        // Validate input
        if (empty($name) || empty($email) || empty($password) || empty($username)) {
            return ['success' => false, 'message' => 'All fields are required'];
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return ['success' => false, 'message' => 'Invalid email format'];
        }

        if (strlen($password) < 6) {
            return ['success' => false, 'message' => 'Password must be at least 6 characters'];
        }

        // Check if user already exists
        $check_query = "SELECT id FROM users WHERE email = ? OR username = ?";
        $stmt = $this->conn->prepare($check_query);
        $stmt->bind_param("ss", $email, $username);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            return ['success' => false, 'message' => 'User already exists with this email or username'];
        }

        // Hash password
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        $user_id = uniqid('user_', true);
        $created_at = date('Y-m-d H:i:s');

        // Insert user
        $insert_query = "INSERT INTO users (id, name, email, username, password, created_at) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($insert_query);
        $stmt->bind_param("ssssss", $user_id, $name, $email, $username, $hashed_password, $created_at);

        if ($stmt->execute()) {
            // Generate JWT token
            $token = $this->generateToken($user_id);
            
            return [
                'success' => true,
                'message' => 'User registered successfully',
                'token' => $token,
                'user' => [
                    'id' => $user_id,
                    'name' => $name,
                    'email' => $email,
                    'username' => $username
                ]
            ];
        } else {
            return ['success' => false, 'message' => 'Registration failed'];
        }
    }

    public function login($data) {
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';

        if (empty($email) || empty($password)) {
            return ['success' => false, 'message' => 'Email and password are required'];
        }

        $query = "SELECT id, name, email, username, password FROM users WHERE email = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            return ['success' => false, 'message' => 'Invalid email or password'];
        }

        $user = $result->fetch_assoc();

        if (password_verify($password, $user['password'])) {
            $token = $this->generateToken($user['id']);
            
            return [
                'success' => true,
                'message' => 'Login successful',
                'token' => $token,
                'user' => [
                    'id' => $user['id'],
                    'name' => $user['name'],
                    'email' => $user['email'],
                    'username' => $user['username']
                ]
            ];
        } else {
            return ['success' => false, 'message' => 'Invalid email or password'];
        }
    }

    public function verifyToken($token) {
        // Simple token verification (in production, use JWT library)
        $query = "SELECT id, name, email, username FROM users WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("s", $token);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            return $result->fetch_assoc();
        }
        return null;
    }

    private function generateToken($user_id) {
        // Simple token generation (in production, use JWT)
        return $user_id;
    }
}

// Handle requests
$auth = new Auth();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $action = $_GET['action'] ?? '';

    if ($action === 'register') {
        echo json_encode($auth->register($input));
    } elseif ($action === 'login') {
        echo json_encode($auth->login($input));
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
    }
} elseif ($method === 'GET') {
    $action = $_GET['action'] ?? '';
    
    if ($action === 'verify') {
        $token = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        $token = str_replace('Bearer ', '', $token);
        
        if ($user = $auth->verifyToken($token)) {
            echo json_encode(['success' => true, 'user' => $user]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid token']);
        }
    }
}
?>
