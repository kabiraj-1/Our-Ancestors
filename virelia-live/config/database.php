<?php
class Database {
    private $host = 'localhost';
    private $db_name = 'virelia_db';
    private $username = 'root';
    private $password = '';
    public $conn;

    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new mysqli($this->host, $this->username, $this->password, $this->db_name);
            
            if ($this->conn->connect_error) {
                // Create database if it doesn't exist
                $this->createDatabase();
            }
            
            $this->conn->set_charset("utf8mb4");
            
        } catch(Exception $e) {
            error_log("Connection error: " . $e->getMessage());
        }

        return $this->conn;
    }

    private function createDatabase() {
        // Create connection without database
        $temp_conn = new mysqli($this->host, $this->username, $this->password);
        
        if ($temp_conn->connect_error) {
            die("Connection failed: " . $temp_conn->connect_error);
        }
        
        // Create database
        $sql = "CREATE DATABASE IF NOT EXISTS " . $this->db_name;
        if ($temp_conn->query($sql) {
            // Select database
            $temp_conn->select_db($this->db_name);
            $this->conn = $temp_conn;
            
            // Create tables
            $this->createTables();
        } else {
            die("Error creating database: " . $temp_conn->error);
        }
    }

    private function createTables() {
        // Users table
        $users_table = "CREATE TABLE IF NOT EXISTS users (
            id VARCHAR(50) PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            username VARCHAR(50) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            avatar VARCHAR(255) DEFAULT 'assets/images/default-avatar.jpg',
            bio TEXT,
            website VARCHAR(255),
            location VARCHAR(100),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )";

        // Posts table
        $posts_table = "CREATE TABLE IF NOT EXISTS posts (
            id VARCHAR(50) PRIMARY KEY,
            user_id VARCHAR(50) NOT NULL,
            content TEXT NOT NULL,
            media_type ENUM('text', 'image', 'video') DEFAULT 'text',
            media_url VARCHAR(255),
            likes_count INT DEFAULT 0,
            comments_count INT DEFAULT 0,
            shares_count INT DEFAULT 0,
            is_ai_generated BOOLEAN DEFAULT FALSE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )";

        // Likes table
        $likes_table = "CREATE TABLE IF NOT EXISTS likes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id VARCHAR(50) NOT NULL,
            post_id VARCHAR(50) NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY unique_like (user_id, post_id),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
        )";

        // Execute table creation
        $this->conn->query($users_table);
        $this->conn->query($posts_table);
        $this->conn->query($likes_table);

        // Insert sample data
        $this->insertSampleData();
    }

    private function insertSampleData() {
        // Check if sample data already exists
        $check = $this->conn->query("SELECT COUNT(*) as count FROM users");
        $row = $check->fetch_assoc();
        
        if ($row['count'] == 0) {
            // Insert sample users
            $sample_users = [
                ["user_ai_explorer", "AI Explorer", "ai@virelia.com", "aiexplorer", password_hash("password123", PASSWORD_DEFAULT)],
                ["user_tech_vision", "Tech Vision", "tech@virelia.com", "techvision", password_hash("password123", PASSWORD_DEFAULT)],
                ["user_future_builder", "Future Builder", "future@virelia.com", "futurebuilder", password_hash("password123", PASSWORD_DEFAULT)]
            ];

            $user_stmt = $this->conn->prepare("INSERT INTO users (id, name, email, username, password) VALUES (?, ?, ?, ?, ?)");
            
            foreach ($sample_users as $user) {
                $user_stmt->bind_param("sssss", ...$user);
                $user_stmt->execute();
            }

            // Insert sample posts
            $sample_posts = [
                ["post_1", "user_ai_explorer", "Just discovered an amazing new AI model that can generate realistic images from text descriptions! The future is here 🤖 #AI #Innovation"],
                ["post_2", "user_tech_vision", "Building the next generation of social platforms with AI at its core. Virelia is just the beginning! #Tech #Future"],
                ["post_3", "user_future_builder", "The intersection of AI and human creativity is where magic happens. What are you building today? #Creativity #AI"]
            ];

            $post_stmt = $this->conn->prepare("INSERT INTO posts (id, user_id, content) VALUES (?, ?, ?)");
            
            foreach ($sample_posts as $post) {
                $post_stmt->bind_param("sss", ...$post);
                $post_stmt->execute();
            }
        }
    }
}
?>
