CREATE DATABASE IF NOT EXISTS musics;
USE musics;

CREATE TABLE IF NOT EXISTS music (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    viewing INT NOT NULL,
    band VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO music (name, viewing, band) VALUES
('Puszi', 1450000, 'Krúbi'),
('Nehézlábérzés', 2930490, 'Krúbi'),
('Lidokain', 19000, 'BSW'),
('Dohánybolt', 255000, 'Beton.hofi'),
('Passport', 21400, 'BSW'),
('Mióta elhagytál', 141600, 'BSW'),
('Purgatórium', 984520, 'Carson Coma'),
('Kék Hullám Kemping', 30800, 'Carson Coma');