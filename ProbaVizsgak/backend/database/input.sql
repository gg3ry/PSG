CREATE DATABASE IF NOT EXISTS games;
USE games;

CREATE TABLE IF NOT EXISTS users (
    id int auto_increment primary key,
    username varchar(255) unique,
    email varchar(255) unique,
    password varchar(255)
);

CREATE TABLE IF NOT EXISTS games (
    id int auto_increment primary key,
    owner int,
    developer varchar(255),
    name varchar(255),
    price int,
    
    FOREIGN KEY (owner) REFERENCES users(id)
);
INSERT INTO users (username, email, password) VALUES
    ("admin", "admin@admin.hu", "$argon2i$v=19$m=16,t=2,p=1$YXNkc2FkZHNh$G9U48XjKBOWA7VLXSKR7oA"),
    ("gery", "gery@gerync.com", "$argon2i$v=19$m=16,t=2,p=1$YXNkc2FkZHNh$G9U48XjKBOWA7VLXSKR7oA"),
    ("szaki", "szaki@admin.hu", "$argon2i$v=19$m=16,t=2,p=1$YXNkc2FkZHNh$G9U48XjKBOWA7VLXSKR7oA");