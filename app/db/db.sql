-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Gegenereerd op: 17 okt 2023 om 17:11
-- Serverversie: 10.4.27-MariaDB
-- PHP-versie: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pizzaxl`
--

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `customers`
--

CREATE TABLE `customers` (
  `customerId` varchar(4) NOT NULL,
  `customerFirstName` varchar(255) NOT NULL,
  `customerLastName` varchar(255) NOT NULL,
  `customerAdress` varchar(255) NOT NULL,
  `customerLocation` varchar(255) NOT NULL,
  `customerZipcode` varchar(10) NOT NULL,
  `customerPhone` varchar(10) NOT NULL,
  `customerEmail` varchar(30) NOT NULL,
  `customerIsActive` tinyint(1) NOT NULL DEFAULT 1,
  `customerCreateDate` varchar(10) NOT NULL,
  `Description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `ingedienten`
--

CREATE TABLE `ingedienten` (
  `ingedientenId` varchar(4) NOT NULL,
  `IngedientenName` varchar(255) NOT NULL,
  `ingedientenIsActive` tinyint(1) NOT NULL DEFAULT 1,
  `ingedientenCreateDate` varchar(10) NOT NULL,
  `ingedientenDescription` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `orderhaspizza`
--

CREATE TABLE `orderhaspizza` (
  `orderId` varchar(4) NOT NULL,
  `pizzaId` varchar(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `orders`
--

CREATE TABLE `orders` (
  `orderId` varchar(4) NOT NULL,
  `orderStatus` varchar(255) NOT NULL,
  `orderIsActive` tinyint(1) NOT NULL DEFAULT 1,
  `orderCreateDate` varchar(10) NOT NULL,
  `orderDescription` text NOT NULL,
  `CustomerId` varchar(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `pizza`
--

CREATE TABLE `pizza` (
  `pizzaId` varchar(4) NOT NULL,
  `pizzaName` varchar(30) NOT NULL,
  `pizzaPrice` float NOT NULL,
  `pizzaIsActive` tinyint(1) NOT NULL DEFAULT 1,
  `pizzaCreateDate` varchar(10) NOT NULL,
  `pizzaDescription` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `pizzahasingedienten`
--

CREATE TABLE `pizzahasingedienten` (
  `pizzaId` varchar(4) NOT NULL,
  `ingedientenId` varchar(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexen voor geëxporteerde tabellen
--

--
-- Indexen voor tabel `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`customerId`);

--
-- Indexen voor tabel `ingedienten`
--
ALTER TABLE `ingedienten`
  ADD PRIMARY KEY (`ingedientenId`);

--
-- Indexen voor tabel `orderhaspizza`
--
ALTER TABLE `orderhaspizza`
  ADD PRIMARY KEY (`orderId`,`pizzaId`),
  ADD KEY `pizzaId` (`pizzaId`);

--
-- Indexen voor tabel `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`orderId`),
  ADD KEY `CustomerId` (`CustomerId`);

--
-- Indexen voor tabel `pizza`
--
ALTER TABLE `pizza`
  ADD PRIMARY KEY (`pizzaId`);

--
-- Indexen voor tabel `pizzahasingedienten`
--
ALTER TABLE `pizzahasingedienten`
  ADD PRIMARY KEY (`pizzaId`,`ingedientenId`),
  ADD KEY `ingedientenId` (`ingedientenId`);

--
-- Beperkingen voor geëxporteerde tabellen
--

--
-- Beperkingen voor tabel `orderhaspizza`
--
ALTER TABLE `orderhaspizza`
  ADD CONSTRAINT `orderhaspizza_ibfk_1` FOREIGN KEY (`orderId`) REFERENCES `orders` (`orderId`),
  ADD CONSTRAINT `orderhaspizza_ibfk_2` FOREIGN KEY (`pizzaId`) REFERENCES `pizza` (`pizzaId`);

--
-- Beperkingen voor tabel `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`CustomerId`) REFERENCES `customers` (`customerId`);

--
-- Beperkingen voor tabel `pizzahasingedienten`
--
ALTER TABLE `pizzahasingedienten`
  ADD CONSTRAINT `pizzahasingedienten_ibfk_1` FOREIGN KEY (`pizzaId`) REFERENCES `pizza` (`pizzaId`),
  ADD CONSTRAINT `pizzahasingedienten_ibfk_2` FOREIGN KEY (`ingedientenId`) REFERENCES `ingedienten` (`ingedientenId`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
