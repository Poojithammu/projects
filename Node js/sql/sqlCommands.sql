CREATE DATABASE feedback;

USE feedback;



SHOW TABLES;

CREATE TABLE feedBackDetails(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20),
    phoneNo VARCHAR(10),
    rollNo VARCHAR(10),
    email VARCHAR(30),
    subject VARCHAR(20),
    branch VARCHAR(10),
    section VARCHAR(7),
    feedback VARCHAR(100)
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    roll_number VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    department ENUM('general cse', 'cse(cs)', 'cse(ds)', 'cse(aiml)') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO admin (username, password, email)
VALUES ('admin', '123', 'admin@gmail.com');
