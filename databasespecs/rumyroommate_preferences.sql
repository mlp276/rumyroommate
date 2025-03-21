CREATE DATABASE  IF NOT EXISTS `rumyroommate` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `rumyroommate`;
-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: rumyroommate
-- ------------------------------------------------------
-- Server version	8.4.4

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
-- Table structure for table `preferences`
--

DROP TABLE IF EXISTS `preferences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preferences` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `age` int unsigned NOT NULL,
  `major` varchar(255) NOT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `prefcampus` varchar(255) DEFAULT NULL,
  `prefroomtype` varchar(255) DEFAULT NULL,
  `prefroommate` varchar(255) DEFAULT NULL,
  `prefrace` varchar(255) DEFAULT NULL,
  `prefreligion` varchar(255) DEFAULT NULL,
  `prefsmoking` varchar(255) DEFAULT NULL,
  `prefdrinking` varchar(255) DEFAULT NULL,
  `sleepinghabits` varchar(255) DEFAULT NULL,
  `roombudget` int unsigned DEFAULT NULL,
  `sleepstarttime` datetime DEFAULT NULL,
  `sleependtime` datetime DEFAULT NULL,
  `sharedspacestarttime` datetime DEFAULT NULL,
  `sharedspaceendtime` datetime DEFAULT NULL,
  `studystarttime` datetime DEFAULT NULL,
  `studyendtime` datetime DEFAULT NULL,
  `prefmintemp` double DEFAULT NULL,
  `prefmaxtemp` double DEFAULT NULL,
  `prefguestfreq` int unsigned DEFAULT NULL,
  `prefnumroommates` int unsigned DEFAULT NULL,
  `prefnumrooms` int unsigned DEFAULT NULL,
  `clealinessscale` int unsigned DEFAULT NULL,
  `noisetolscale` int unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-10 23:12:47
