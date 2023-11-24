-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Gegenereerd op: 30 okt 2023 om 12:48
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
-- Database: `pizzaxxl`
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
  `customerPhone` varchar(10) NOT NULL,
  `customerEmail` varchar(30) NOT NULL,
  `customerIsActive` tinyint(1) NOT NULL DEFAULT 1,
  `Customercreatedate` int(10) NOT NULL,
  `CustomerDescription` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `employees`
--

CREATE TABLE `employees` (
  `employeeId` varchar(4) NOT NULL,
  `employeeStoreId` varchar(4) NOT NULL,
  `employeeName` varchar(255) NOT NULL,
  `employeeRole` enum('Manager','chef','deliverer') NOT NULL,
  `employeeIsActive` tinyint(1) NOT NULL DEFAULT 1,
  `employeeCreateDate` int(10) NOT NULL,
  `employeeDescription` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `ingredients`
--

CREATE TABLE `ingredients` (
  `ingredientId` varchar(4) NOT NULL,
  `ingredientName` varchar(255) NOT NULL,
  `ingredientPrice` decimal(2,2) NOT NULL,
  `ingredientIsActive` tinyint(1) NOT NULL DEFAULT 1,
  `ingredientCreatedate` int(10) NOT NULL,
  `ingredientDescription` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `orderhasproducts`
--

CREATE TABLE `orderhasproducts` (
  `productId` varchar(4) NOT NULL,
  `orderId` varchar(4) NOT NULL,
  `productPrice` decimal(2,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `orders`
--

CREATE TABLE `orders` (
  `orderId` varchar(4) NOT NULL,
  `orderStoreId` varchar(4) NOT NULL,
  `orderState` varchar(255) NOT NULL,
  `orderPrice` decimal(6,2) NOT NULL,
  `orderStatus` enum('Succes','Pending','Failed') NOT NULL,
  `orderCustomerId` varchar(4) NOT NULL,
  `orderIsActive` tinyint(1) NOT NULL DEFAULT 1,
  `orderCreatedate` int(10) NOT NULL,
  `orderDescription` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `products`
--

CREATE TABLE `products` (
  `productId` varchar(4) NOT NULL,
  `productname` varchar(30) NOT NULL,
  `productCategory` enum('pizza','drinks','snacks','coupons','custompizza') NOT NULL,
  `productPrice` decimal(6,2) NOT NULL,
  `productIsActive` tinyint(1) NOT NULL DEFAULT 1,
  `productCreatedate` int(10) NOT NULL,
  `productDescription` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `productshasingredients`
--

CREATE TABLE `productshasingredients` (
  `ingredientId` varchar(4) NOT NULL,
  `productId` varchar(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `promotions`
--

CREATE TABLE `promotions` (
  `promotionId` varchar(4) NOT NULL,
  `promotionName` varchar(255) NOT NULL,
  `promotionStartDate` int(10) NOT NULL,
  `promotionEndDate` int(10) NOT NULL,
  `promotionPathA` varchar(255) NOT NULL,
  `promotionPathB` varchar(255) NOT NULL,
  `promotionPathC` int(255) NOT NULL,
  `promotionIsActive` tinyint(1) NOT NULL DEFAULT 1,
  `promotionCreateDate` int(10) NOT NULL,
  `promotionDescription` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `reviews`
--

CREATE TABLE `reviews` (
  `reviewId` varchar(4) NOT NULL,
  `reviewCustomerId` varchar(4) NOT NULL,
  `reviewOrderId` varchar(4) NOT NULL,
  `reviewRating` enum('1','2','3','4','5') NOT NULL,
  `reviewText` varchar(255) NOT NULL,
  `reviewIsActive` tinyint(1) NOT NULL DEFAULT 1,
  `reviewCreateDate` int(10) NOT NULL,
  `reviewDescription` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `stores`
--

CREATE TABLE `stores` (
  `storeId` varchar(4) NOT NULL,
  `storeName` varchar(255) NOT NULL,
  `storeAddress` varchar(255) NOT NULL,
  `storeLocation` varchar(255) NOT NULL,
  `storeZipcode` varchar(6) NOT NULL,
  `storeIsActive` tinyint(1) NOT NULL DEFAULT 1,
  `storeCreateDate` int(10) NOT NULL,
  `storeDescription` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `vehicles`
--

CREATE TABLE `vehicles` (
  `vehicleId` varchar(4) NOT NULL,
  `vehicleStoreId` varchar(4) NOT NULL,
  `vehicleType` enum('Car','Bike','Scooter') NOT NULL,
  `vehicleIsActive` tinyint(1) NOT NULL DEFAULT 1,
  `vehicleCreateDate` int(10) NOT NULL,
  `vehicleDescription` text DEFAULT NULL
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
-- Indexen voor tabel `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`employeeId`);

--
-- Indexen voor tabel `ingredients`
--
ALTER TABLE `ingredients`
  ADD PRIMARY KEY (`ingredientId`);

--
-- Indexen voor tabel `orderhasproducts`
--
ALTER TABLE `orderhasproducts`
  ADD PRIMARY KEY (`productId`,`orderId`);

--
-- Indexen voor tabel `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`orderId`);

--
-- Indexen voor tabel `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`productId`);

--
-- Indexen voor tabel `productshasingredients`
--
ALTER TABLE `productshasingredients`
  ADD PRIMARY KEY (`ingredientId`,`productId`);

--
-- Indexen voor tabel `promotions`
--
ALTER TABLE `promotions`
  ADD PRIMARY KEY (`promotionId`);

--
-- Indexen voor tabel `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`reviewId`);

--
-- Indexen voor tabel `stores`
--
ALTER TABLE `stores`
  ADD PRIMARY KEY (`storeId`);

--
-- Indexen voor tabel `vehicles`
--
ALTER TABLE `vehicles`
  ADD PRIMARY KEY (`vehicleId`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
