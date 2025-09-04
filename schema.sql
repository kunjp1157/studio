-- SQL Dump for City Sports Hub
-- Version 1.1
--
-- Host: localhost
-- Generation Time: Jul 27, 2024 at 10:00 AM
-- Server version: 8.0.27
-- PHP Version: 8.1.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Database: `sports_arena`
--

-- =================================================================
-- USERS TABLE
-- =================================================================
CREATE TABLE `users` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `profilePictureUrl` varchar(255) DEFAULT NULL,
  `dataAiHint` varchar(255) DEFAULT NULL,
  `preferredSports` json DEFAULT NULL,
  `favoriteFacilities` json DEFAULT NULL,
  `membershipLevel` enum('Basic','Premium','Pro') DEFAULT 'Basic',
  `loyaltyPoints` int DEFAULT '0',
  `achievements` json DEFAULT NULL,
  `bio` text,
  `preferredPlayingTimes` varchar(255) DEFAULT NULL,
  `skillLevels` json DEFAULT NULL,
  `role` enum('Admin','FacilityOwner','User') NOT NULL DEFAULT 'User',
  `status` enum('Active','Suspended','PendingApproval') NOT NULL DEFAULT 'Active',
  `joinedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `teamIds` json DEFAULT NULL,
  `isProfilePublic` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =================================================================
-- FACILITIES TABLE
-- =================================================================
CREATE TABLE `facilities` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` enum('Complex','Court','Field','Studio','Pool','Box Cricket') NOT NULL,
  `address` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `rating` decimal(3,2) DEFAULT '0.00',
  `capacity` int DEFAULT NULL,
  `isPopular` tinyint(1) DEFAULT '0',
  `isIndoor` tinyint(1) DEFAULT '0',
  `dataAiHint` varchar(255) DEFAULT NULL,
  `ownerId` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =================================================================
-- SPORTS TABLE
-- =================================================================
CREATE TABLE `sports` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `iconName` varchar(255) DEFAULT NULL,
  `imageUrl` varchar(255) DEFAULT NULL,
  `imageDataAiHint` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =================================================================
-- AMENITIES TABLE
-- =================================================================
CREATE TABLE `amenities` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `iconName` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =================================================================
-- BOOKINGS TABLE
-- =================================================================
CREATE TABLE `bookings` (
  `id` varchar(255) NOT NULL,
  `userId` varchar(255) DEFAULT NULL,
  `facilityId` varchar(255) NOT NULL,
  `facilityName` varchar(255) NOT NULL,
  `dataAiHint` varchar(255) DEFAULT NULL,
  `sportId` varchar(255) NOT NULL,
  `sportName` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `startTime` time NOT NULL,
  `endTime` time NOT NULL,
  `durationHours` int DEFAULT '1',
  `pricingModel` enum('per_hour_flat','per_hour_per_person') DEFAULT 'per_hour_flat',
  `numberOfGuests` int DEFAULT NULL,
  `baseFacilityPrice` decimal(10,2) NOT NULL,
  `equipmentRentalCost` decimal(10,2) DEFAULT '0.00',
  `appliedPromotion` json DEFAULT NULL,
  `totalPrice` decimal(10,2) NOT NULL,
  `status` enum('Confirmed','Pending','Cancelled') NOT NULL,
  `bookedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `reviewed` tinyint(1) DEFAULT '0',
  `rentedEquipment` json DEFAULT NULL,
  `phoneNumber` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =================================================================
-- REVIEWS TABLE
-- =================================================================
CREATE TABLE `reviews` (
  `id` varchar(255) NOT NULL,
  `facilityId` varchar(255) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `userName` varchar(255) NOT NULL,
  `userAvatar` varchar(255) DEFAULT NULL,
  `isPublicProfile` tinyint(1) DEFAULT '1',
  `rating` int NOT NULL,
  `comment` text,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `bookingId` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =================================================================
-- NOTIFICATIONS TABLE
-- =================================================================
CREATE TABLE `notifications` (
  `id` varchar(255) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `type` enum('booking_confirmed','booking_cancelled','review_submitted','reminder','promotion','general','user_status_changed','facility_approved','waitlist_opening','matchmaking_interest') NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `isRead` tinyint(1) DEFAULT '0',
  `link` varchar(255) DEFAULT NULL,
  `iconName` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =================================================================
-- JOIN TABLES
-- =================================================================
CREATE TABLE `facility_sports` (
  `facilityId` varchar(255) NOT NULL,
  `sportId` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `facility_amenities` (
  `facilityId` varchar(255) NOT NULL,
  `amenityId` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `sport_prices` (
    `facilityId` VARCHAR(255) NOT NULL,
    `sportId` VARCHAR(255) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `pricingModel` ENUM('per_hour_flat', 'per_hour_per_person') NOT NULL DEFAULT 'per_hour_flat'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `operating_hours` (
    `facilityId` VARCHAR(255) NOT NULL,
    `day` ENUM('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun') NOT NULL,
    `open` TIME NOT NULL,
    `close` TIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `rental_equipment` (
    `id` VARCHAR(255) NOT NULL PRIMARY KEY,
    `facilityId` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `pricePerItem` DECIMAL(10, 2) NOT NULL,
    `priceType` ENUM('per_booking', 'per_hour') NOT NULL,
    `stock` INT NOT NULL,
    `sportIds` JSON
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `blocked_slots` (
    `id` int NOT NULL AUTO_INCREMENT,
    `facilityId` VARCHAR(255) NOT NULL,
    `date` DATE NOT NULL,
    `startTime` TIME NOT NULL,
    `endTime` TIME NOT NULL,
    `reason` VARCHAR(255),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =================================================================
-- EVENTS, MEMBERSHIPS, PRICING & PROMOTIONS
-- =================================================================

CREATE TABLE `events` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `facilityId` varchar(255) NOT NULL,
  `facilityName` varchar(255) DEFAULT NULL,
  `sportId` varchar(255) NOT NULL,
  `startDate` datetime NOT NULL,
  `endDate` datetime NOT NULL,
  `description` text NOT NULL,
  `entryFee` decimal(10,2) DEFAULT '0.00',
  `maxParticipants` int DEFAULT '0',
  `registeredParticipants` int DEFAULT '0',
  `imageUrl` varchar(255) DEFAULT NULL,
  `imageDataAiHint` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `membership_plans` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `pricePerMonth` decimal(10,2) NOT NULL,
  `benefits` json NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `pricing_rules` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `daysOfWeek` json DEFAULT NULL,
  `timeRange` json DEFAULT NULL,
  `dateRange` json DEFAULT NULL,
  `adjustmentType` enum('percentage_increase','percentage_decrease','fixed_increase','fixed_decrease','fixed_price') NOT NULL,
  `value` decimal(10,2) NOT NULL,
  `priority` int DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `promotion_rules` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `code` varchar(255) DEFAULT NULL,
  `discountType` enum('percentage','fixed_amount') NOT NULL,
  `discountValue` decimal(10,2) NOT NULL,
  `startDate` date DEFAULT NULL,
  `endDate` date DEFAULT NULL,
  `usageLimit` int DEFAULT NULL,
  `usageLimitPerUser` int DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =================================================================
-- COMMUNITY FEATURES: TEAMS, LFG, CHALLENGES
-- =================================================================
CREATE TABLE `teams` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `sportId` varchar(255) NOT NULL,
  `captainId` varchar(255) NOT NULL,
  `memberIds` json NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `lfg_requests` (
  `id` varchar(255) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `sportId` varchar(255) NOT NULL,
  `facilityId` varchar(255) NOT NULL,
  `facilityName` varchar(255) NOT NULL,
  `notes` text NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('open','closed') NOT NULL DEFAULT 'open',
  `interestedUserIds` json DEFAULT NULL,
  `skillLevel` enum('Any','Beginner','Intermediate','Advanced') DEFAULT 'Any',
  `playersNeeded` int DEFAULT NULL,
  `preferredTime` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `challenges` (
  `id` varchar(255) NOT NULL,
  `challengerId` varchar(255) NOT NULL,
  `opponentId` varchar(255) DEFAULT NULL,
  `sportId` varchar(255) NOT NULL,
  `facilityId` varchar(255) NOT NULL,
  `facilityName` varchar(255) NOT NULL,
  `proposedDate` datetime NOT NULL,
  `notes` text,
  `status` enum('open','accepted','completed','cancelled') NOT NULL DEFAULT 'open',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `maintenance_schedules` (
    `id` VARCHAR(255) NOT NULL PRIMARY KEY,
    `facilityId` VARCHAR(255) NOT NULL,
    `taskName` VARCHAR(255) NOT NULL,
    `recurrenceInDays` INT NOT NULL,
    `lastPerformedDate` DATE NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- =================================================================
-- PRIMARY KEYS & FOREIGN KEYS
-- =================================================================

ALTER TABLE `users` ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `email` (`email`);
ALTER TABLE `facilities` ADD PRIMARY KEY (`id`), ADD KEY `ownerId` (`ownerId`);
ALTER TABLE `sports` ADD PRIMARY KEY (`id`);
ALTER TABLE `amenities` ADD PRIMARY KEY (`id`);
ALTER TABLE `bookings` ADD PRIMARY KEY (`id`), ADD KEY `userId` (`userId`), ADD KEY `facilityId` (`facilityId`);
ALTER TABLE `reviews` ADD PRIMARY KEY (`id`), ADD KEY `facilityId` (`facilityId`), ADD KEY `userId` (`userId`);
ALTER TABLE `notifications` ADD PRIMARY KEY (`id`), ADD KEY `userId` (`userId`);
ALTER TABLE `facility_sports` ADD PRIMARY KEY (`facilityId`,`sportId`), ADD KEY `sportId` (`sportId`);
ALTER TABLE `facility_amenities` ADD PRIMARY KEY (`facilityId`,`amenityId`), ADD KEY `amenityId` (`amenityId`);
ALTER TABLE `sport_prices` ADD PRIMARY KEY (`facilityId`, `sportId`), ADD KEY `sportId` (`sportId`);
ALTER TABLE `operating_hours` ADD PRIMARY KEY (`facilityId`, `day`);
ALTER TABLE `events` ADD PRIMARY KEY (`id`), ADD KEY `facilityId` (`facilityId`), ADD KEY `sportId`(`sportId`);
ALTER TABLE `membership_plans` ADD PRIMARY KEY (`id`);
ALTER TABLE `pricing_rules` ADD PRIMARY KEY (`id`);
ALTER TABLE `promotion_rules` ADD PRIMARY KEY (`id`);
ALTER TABLE `teams` ADD PRIMARY KEY (`id`);
ALTER TABLE `lfg_requests` ADD PRIMARY KEY (`id`);
ALTER TABLE `challenges` ADD PRIMARY KEY (`id`);

-- Constraints can be added here in a real production environment
-- ALTER TABLE `facilities` ADD CONSTRAINT `facilities_ibfk_1` FOREIGN KEY (`ownerId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;


-- =================================================================
-- SEED DATA
-- =================================================================

-- Seed Amenities
INSERT INTO `amenities` (`id`, `name`, `iconName`) VALUES
('amenity-1', 'Parking', 'ParkingCircle'),
('amenity-2', 'Lockers', 'Lock'),
('amenity-3', 'WiFi', 'Wifi'),
('amenity-4', 'Showers', 'ShowerHead'),
('amenity-5', 'Equipment Rental', 'PackageSearch'),
('amenity-6', 'Cafe', 'Utensils');

-- Seed Sports
INSERT INTO `sports` (`id`, `name`, `iconName`, `imageUrl`, `imageDataAiHint`) VALUES
('sport-1', 'Soccer', 'Goal', 'https://picsum.photos/400/300?random=1', 'soccer field'),
('sport-2', 'Basketball', 'Dribbble', 'https://picsum.photos/400/300?random=2', 'basketball court'),
('sport-3', 'Tennis', 'Feather', 'https://picsum.photos/400/300?random=3', 'tennis court'),
('sport-4', 'Cricket', 'Zap', 'https://picsum.photos/400/300?random=4', 'cricket pitch'),
('sport-5', 'Swimming', 'Wind', 'https://picsum.photos/400/300?random=5', 'swimming pool'),
('sport-6', 'Badminton', 'Feather', 'https://picsum.photos/400/300?random=6', 'badminton court');

-- Seed Facilities
INSERT INTO `facilities` (`id`, `name`, `type`, `address`, `city`, `location`, `description`, `rating`, `capacity`, `isPopular`, `isIndoor`, `dataAiHint`, `ownerId`) VALUES
('facility-1', 'Grand Arena', 'Complex', '123 Main St, Pune', 'Pune', 'Koregaon Park', 'A state-of-the-art sports complex with multiple courts and fields.', 4.5, 200, 1, 1, 'sports complex modern', 'owner-1'),
('facility-2', 'City Sports Club', 'Court', '456 Oak Ave, Pune', 'Pune', 'Viman Nagar', 'Premium courts for Tennis and Basketball enthusiasts.', 4.8, 50, 1, 0, 'tennis court outdoors', 'owner-1');

-- Associate Sports with Facilities
INSERT INTO `facility_sports` (`facilityId`, `sportId`) VALUES
('facility-1', 'sport-1'), ('facility-1', 'sport-2'), ('facility-1', 'sport-4'),
('facility-2', 'sport-2'), ('facility-2', 'sport-3'), ('facility-2', 'sport-6');

-- Associate Amenities with Facilities
INSERT INTO `facility_amenities` (`facilityId`, `amenityId`) VALUES
('facility-1', 'amenity-1'), ('facility-1', 'amenity-2'), ('facility-1', 'amenity-3'), ('facility-1', 'amenity-4'),
('facility-2', 'amenity-1'), ('facility-2', 'amenity-2'), ('facility-2', 'amenity-6');

-- Seed Sport Prices
INSERT INTO `sport_prices` (`facilityId`, `sportId`, `price`, `pricingModel`) VALUES
('facility-1', 'sport-1', 1500.00, 'per_hour_flat'), ('facility-1', 'sport-2', 1200.00, 'per_hour_flat'), ('facility-1', 'sport-4', 2000.00, 'per_hour_flat'),
('facility-2', 'sport-2', 1300.00, 'per_hour_flat'), ('facility-2', 'sport-3', 800.00, 'per_hour_per_person'), ('facility-2', 'sport-6', 600.00, 'per_hour_per_person');

-- Seed Operating Hours
INSERT INTO `operating_hours` (`facilityId`, `day`, `open`, `close`) VALUES
('facility-1', 'Mon', '06:00:00', '23:00:00'), ('facility-1', 'Tue', '06:00:00', '23:00:00'), ('facility-1', 'Wed', '06:00:00', '23:00:00'),
('facility-1', 'Thu', '06:00:00', '23:00:00'), ('facility-1', 'Fri', '06:00:00', '23:00:00'), ('facility-1', 'Sat', '07:00:00', '23:59:00'),
('facility-1', 'Sun', '07:00:00', '23:59:00'),
('facility-2', 'Mon', '07:00:00', '22:00:00'), ('facility-2', 'Tue', '07:00:00', '22:00:00'), ('facility-2', 'Wed', '07:00:00', '22:00:00'),
('facility-2', 'Thu', '07:00:00', '22:00:00'), ('facility-2', 'Fri', '07:00:00', '22:00:00'), ('facility-2', 'Sat', '08:00:00', '22:00:00'),
('facility-2', 'Sun', '08:00:00', '20:00:00');

-- Seed Users
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `status`) VALUES
('admin-1', 'Admin User', 'admin@example.com', 'admin123', 'Admin', 'Active'),
('owner-1', 'Alice Owner', 'owner@example.com', 'owner123', 'FacilityOwner', 'Active'),
('user-1', 'Bob User', 'bob@example.com', 'user123', 'User', 'Active'),
('user-2', 'Charlie Player', 'charlie@example.com', 'user123', 'User', 'Active');

-- Seed Events
INSERT INTO `events` (`id`, `name`, `facilityId`, `facilityName`, `sportId`, `startDate`, `endDate`, `description`, `entryFee`, `maxParticipants`, `registeredParticipants`) VALUES
('event-1', 'Summer Cricket Tournament', 'facility-1', 'Grand Arena', 'sport-4', '2024-08-10 09:00:00', '2024-08-11 18:00:00', 'Annual summer T20 cricket tournament. Exciting prizes to be won!', 500.00, 16, 4);

-- Seed Matchmaking (LFG)
INSERT INTO `lfg_requests` (`id`, `userId`, `sportId`, `facilityId`, `facilityName`, `notes`, `status`, `skillLevel`, `playersNeeded`) VALUES
('lfg-1', 'user-2', 'sport-3', 'facility-2', 'City Sports Club', 'Looking for an intermediate level player for a friendly singles match this weekend. Flexible on time.', 'open', 'Intermediate', 1);

-- Seed Challenges
INSERT INTO `challenges` (`id`, `challengerId`, `sportId`, `facilityId`, `facilityName`, `proposedDate`, `notes`, `status`) VALUES
('chl-1', 'user-1', 'sport-2', 'facility-1', 'Grand Arena', '2024-08-05 18:00:00', 'Open challenge for a 3v3 basketball game. Winner gets bragging rights!', 'open');

COMMIT;