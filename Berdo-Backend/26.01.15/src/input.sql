-- Adatbázis létrehozása (ha még nem létezik)
CREATE DATABASE IF NOT EXISTS tinder_app_db 
CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci;
USE tinder_app_db;

-- 1. FELHASZNÁLÓK TÁBLA
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    birth_date DATE NOT NULL,
    gender ENUM('male', 'female', 'other') NOT NULL,
    bio TEXT,
    latitude DECIMAL(10, 8), -- Földrajzi szélesség a távolsághoz
    longitude DECIMAL(11, 8), -- Földrajzi hosszúság a távolsághoz
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. SWIPE (Húzások) TÁBLA
CREATE TABLE swipes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,   -- Aki húz
    receiver_id INT NOT NULL, -- Akit elhúztak
    type ENUM('like', 'dislike', 'superlike') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_swipe (sender_id, receiver_id) -- Ne lehessen ugyanazt kétszer lájkolni
) ENGINE=InnoDB;

-- 4. MATCHES (Párosítások) TÁBLA
CREATE TABLE matches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_one_id INT NOT NULL,
    user_two_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_one_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (user_two_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- MINTAADATOK FELTÖLTÉSE
INSERT INTO users (username, email, password_hash, full_name, birth_date, gender, bio, latitude, longitude) VALUES
('kovacs_bela', 'bela@example.com', '$argon2i$v=19$m=16,t=2,p=1$YXNkenNhZGFkc2FzZA$qw7SuZvr19Ev7T9EVPE3qg', 'Kovács Béla', '2000-05-15', 'male', 'Szeretem a kutyákat és a kódolást.', 47.4979, 19.0402),
('nagy_anna', 'anna@example.com', '$argon2i$v=19$m=16,t=2,p=1$YXNkenNhZGFkc2FzZA$URhJ8JM+pGJ8SxZDMmhocA', 'Nagy Anna', '2002-08-22', 'female', 'Kávéfüggő és világutazó.', 47.4733, 19.0597),
('szabo_zoli', 'zoli@example.com', '$argon2i$v=19$m=16,t=2,p=1$YXNkenNhZGFkc2FzZA$uVW5SBZVyP5qklkFZqQZ9A', 'Szabó Zoltán', '1998-12-01', 'male', 'Gitározom és túrázom.', 47.5316, 19.0307);

-- Egy példa Like: Béla lájkolja Annát
INSERT INTO swipes (sender_id, receiver_id, type) VALUES (1, 2, 'like');