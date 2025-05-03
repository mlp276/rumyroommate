-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: rumyroommate
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `useraccounts`
--

DROP TABLE IF EXISTS `useraccounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `useraccounts` (
  `userid` int unsigned NOT NULL,
  `netid` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `realname` varchar(255) NOT NULL,
  `age` int unsigned NOT NULL,
  PRIMARY KEY (`userid`),
  UNIQUE KEY `userid_UNIQUE` (`userid`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

ALTER TABLE useraccounts
ADD COLUMN email VARCHAR(255) UNIQUE NOT NULL,
ADD COLUMN password VARCHAR(255) NOT NULL;

-- Add a column to store CAS user information
ALTER TABLE users ADD COLUMN cas_user_id VARCHAR(255) UNIQUE;

-- Add a column to store Google user information
ALTER TABLE users ADD COLUMN google_user_id VARCHAR(255) UNIQUE;

-- Update the useraccounts table to include CAS authentication
CREATE TABLE IF NOT EXISTS cas_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cas_user_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create a new table for Google users
CREATE TABLE IF NOT EXISTS google_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    google_user_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ensure only Rutgers emails are allowed
CREATE TRIGGER validate_rutgers_email
BEFORE INSERT ON cas_users
FOR EACH ROW
BEGIN
    IF NOT (NEW.email LIKE '%@rutgers.edu' OR NEW.email LIKE '%@scarletmail.rutgers.edu') THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Only Rutgers emails are allowed';
    END IF;
END;

-- Ensure only Google emails are allowed
CREATE TRIGGER validate_google_email
BEFORE INSERT ON google_users
FOR EACH ROW
BEGIN
    IF NOT (NEW.email LIKE '%@gmail.com') THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Only Google emails are allowed';
    END IF;
END;

-- Ensure password meets security guidelines before insertion or update
CREATE TRIGGER validate_password_strength
BEFORE INSERT OR UPDATE ON users
FOR EACH ROW
BEGIN
    IF NOT (NEW.password REGEXP '^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{4,16}$') THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Password does not meet security guidelines: At least 4–16 characters long, with a mix of uppercase, lowercase, numbers, and symbols (! @ # $ % ^ & *).';
    END IF;
END;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-21  0:42:23
