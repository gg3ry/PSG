CREATE DATABASE IF NOT EXISTS MongiShop;
USE MongiShop;

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price INT NOT NULL,
    category VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Példa adatok beszúrása
INSERT INTO products (name, price, category) VALUES
('Laptop Pro', 450000, 'elektronika'),
('Regény: Az Éjszaka', 3500, 'könyv'),
('Tavaszi Pulóver', 12000, 'ruha'),
('Fejhallgató X', 55000, 'elektronika'),
('Képes Album', 7800, 'könyv'),
('JavaScript Tutorial', 11700, 'könyv'),
('Ryzen 9 5900x', 170000, 'elektronika'),
('Régi televízió', 80000, 'elektronika'),
('Nadrág', 7000, 'ruha');