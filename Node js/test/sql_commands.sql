CREATE DATABASE FeedBack;

USE FeedBack;

CREATE TABLE user_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    mobileno VARCHAR(15) NOT NULL,
    password VARCHAR(100) NOT NULL
);
