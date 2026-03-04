-- データベースの切り替え
USE todo_db;

-- TODOテーブルの作成
CREATE TABLE IF NOT EXISTS todos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'NOT_STARTED', -- NOT_STARTED, IN_PROGRESS, DONE
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- サンプルデータの挿入
INSERT INTO todos (title, description, status) VALUES 
('Spring Bootの環境構築', 'Dockerで開発環境を整える', 'IN_PROGRESS'),
('Todoアプリの作成', 'Spring Data JPAを使ってCRUDを実装する', 'NOT_STARTED'),
('DB接続の確認', 'initialize_data.sqlが読み込まれているか確認する', 'NOT_STARTED');
