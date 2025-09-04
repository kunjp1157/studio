
-- Main schema for the Sports Arena application

-- Drop tables if they exist to start fresh
DROP TABLE IF EXISTS `waitlist_entries`;
DROP TABLE IF EXISTS `challenges`;
DROP TABLE IF EXISTS `lfg_requests`;
DROP TABLE IF EXISTS `teams`;
DROP TABLE IF EXISTS `reviews`;
DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `bookings`;
DROP TABLE IF EXISTS `promotion_rules`;
DROP TABLE IF EXISTS `pricing_rules`;
DROP TABLE IF EXISTS `membership_plans`;
DROP TABLE IF EXISTS `events`;
DROP TABLE IF EXISTS `blog_posts`;
DROP TABLE IF EXISTS `rental_equipment`;
DROP TABLE IF EXISTS `maintenance_schedules`;
DROP TABLE IF EXISTS `blocked_slots`;
DROP TABLE IF EXISTS `facility_amenities`;
DROP TABLE IF EXISTS `amenities`;
DROP TABLE IF EXISTS `facility_sports`;
DROP TABLE IF EXISTS `sport_prices`;
DROP TABLE IF EXISTS `operating_hours`;
DROP TABLE IF EXISTS `sports`;
DROP TABLE IF EXISTS `facilities`;
DROP TABLE IF EXISTS `users`;

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
  `isProfilePublic` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =================================================================
-- FACILITIES TABLE
-- =================================================================
CREATE TABLE `facilities` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` enum('Complex','Court','Field','Studio','Pool','Box Cricket') NOT NULL,
  `address` text NOT NULL,
  `city` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `description` text,
  `rating` float DEFAULT '0',
  `capacity` int DEFAULT '0',
  `isPopular` tinyint(1) DEFAULT '0',
  `isIndoor` tinyint(1) DEFAULT '0',
  `dataAiHint` varchar(255) DEFAULT NULL,
  `ownerId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ownerId` (`ownerId`),
  CONSTRAINT `facilities_ibfk_1` FOREIGN KEY (`ownerId`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =================================================================
-- SPORTS TABLE
-- =================================================================
CREATE TABLE `sports` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `iconName` varchar(255) DEFAULT NULL,
  `imageUrl` varchar(255) DEFAULT NULL,
  `imageDataAiHint` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =================================================================
-- AMENITIES TABLE
-- =================================================================
CREATE TABLE `amenities` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `iconName` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =================================================================
-- JOIN TABLES & OTHER FACILITY-RELATED TABLES
-- =================================================================
CREATE TABLE `facility_sports` (
  `facilityId` varchar(255) NOT NULL,
  `sportId` varchar(255) NOT NULL,
  PRIMARY KEY (`facilityId`,`sportId`),
  KEY `sportId` (`sportId`),
  CONSTRAINT `facility_sports_ibfk_1` FOREIGN KEY (`facilityId`) REFERENCES `facilities` (`id`) ON DELETE CASCADE,
  CONSTRAINT `facility_sports_ibfk_2` FOREIGN KEY (`sportId`) REFERENCES `sports` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `facility_amenities` (
  `facilityId` varchar(255) NOT NULL,
  `amenityId` varchar(255) NOT NULL,
  PRIMARY KEY (`facilityId`,`amenityId`),
  KEY `amenityId` (`amenityId`),
  CONSTRAINT `facility_amenities_ibfk_1` FOREIGN KEY (`facilityId`) REFERENCES `facilities` (`id`) ON DELETE CASCADE,
  CONSTRAINT `facility_amenities_ibfk_2` FOREIGN KEY (`amenityId`) REFERENCES `amenities` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `sport_prices` (
  `facilityId` varchar(255) NOT NULL,
  `sportId` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `pricingModel` enum('per_hour_flat','per_hour_per_person') NOT NULL DEFAULT 'per_hour_flat',
  PRIMARY KEY (`facilityId`,`sportId`),
  KEY `sportId` (`sportId`),
  CONSTRAINT `sport_prices_ibfk_1` FOREIGN KEY (`facilityId`) REFERENCES `facilities` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sport_prices_ibfk_2` FOREIGN KEY (`sportId`) REFERENCES `sports` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `operating_hours` (
  `facilityId` varchar(255) NOT NULL,
  `day` enum('Mon','Tue','Wed','Thu','Fri','Sat','Sun') NOT NULL,
  `open` time NOT NULL,
  `close` time NOT NULL,
  PRIMARY KEY (`facilityId`,`day`),
  CONSTRAINT `operating_hours_ibfk_1` FOREIGN KEY (`facilityId`) REFERENCES `facilities` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `blocked_slots` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `facilityId` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `startTime` time NOT NULL,
  `endTime` time NOT NULL,
  `reason` varchar(255) DEFAULT NULL,
  FOREIGN KEY (`facilityId`) REFERENCES `facilities`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `maintenance_schedules` (
  `id` varchar(255) NOT NULL,
  `facilityId` varchar(255) NOT NULL,
  `taskName` varchar(255) NOT NULL,
  `recurrenceInDays` int NOT NULL,
  `lastPerformedDate` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `facilityId` (`facilityId`),
  CONSTRAINT `maintenance_schedules_ibfk_1` FOREIGN KEY (`facilityId`) REFERENCES `facilities` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `rental_equipment` (
  `id` varchar(255) NOT NULL,
  `facilityId` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `pricePerItem` decimal(10,2) NOT NULL,
  `priceType` enum('per_booking','per_hour') NOT NULL,
  `stock` int NOT NULL,
  `sportIds` json NOT NULL,
  PRIMARY KEY (`id`),
  KEY `facilityId` (`facilityId`),
  CONSTRAINT `rental_equipment_ibfk_1` FOREIGN KEY (`facilityId`) REFERENCES `facilities` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- =================================================================
-- BOOKINGS & REVIEWS
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
  `durationHours` int DEFAULT NULL,
  `numberOfGuests` int DEFAULT NULL,
  `baseFacilityPrice` decimal(10,2) NOT NULL,
  `equipmentRentalCost` decimal(10,2) DEFAULT '0.00',
  `appliedPromotion` json DEFAULT NULL,
  `totalPrice` decimal(10,2) NOT NULL,
  `status` enum('Confirmed','Pending','Cancelled') NOT NULL,
  `bookedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `reviewed` tinyint(1) DEFAULT '0',
  `rentedEquipment` json DEFAULT NULL,
  `phoneNumber` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `facilityId` (`facilityId`),
  KEY `sportId` (`sportId`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`facilityId`) REFERENCES `facilities` (`id`) ON DELETE CASCADE,
  CONSTRAINT `bookings_ibfk_3` FOREIGN KEY (`sportId`) REFERENCES `sports` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `reviews` (
  `id` varchar(255) NOT NULL,
  `facilityId` varchar(255) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `userName` varchar(255) NOT NULL,
  `userAvatar` varchar(255) DEFAULT NULL,
  `isPublicProfile` tinyint(1) DEFAULT '1',
  `rating` float NOT NULL,
  `comment` text,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `bookingId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `bookingId` (`bookingId`),
  KEY `facilityId` (`facilityId`),
  KEY `userId` (`userId`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`facilityId`) REFERENCES `facilities` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`bookingId`) REFERENCES `bookings` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- =================================================================
-- APP CONTENT & SETTINGS
-- =================================================================
CREATE TABLE `notifications` (
  `id` varchar(255) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `isRead` tinyint(1) NOT NULL DEFAULT '0',
  `link` varchar(255) DEFAULT NULL,
  `iconName` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `events` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `facilityId` varchar(255) NOT NULL,
  `facilityName` varchar(255) DEFAULT NULL,
  `sportId` varchar(255) NOT NULL,
  `startDate` timestamp NOT NULL,
  `endDate` timestamp NOT NULL,
  `description` text,
  `entryFee` decimal(10,2) DEFAULT '0.00',
  `maxParticipants` int DEFAULT '0',
  `registeredParticipants` int DEFAULT '0',
  `imageUrl` varchar(255) DEFAULT NULL,
  `imageDataAiHint` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `facilityId` (`facilityId`),
  KEY `sportId` (`sportId`),
  CONSTRAINT `events_ibfk_1` FOREIGN KEY (`facilityId`) REFERENCES `facilities` (`id`) ON DELETE CASCADE,
  CONSTRAINT `events_ibfk_2` FOREIGN KEY (`sportId`) REFERENCES `sports` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `membership_plans` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `pricePerMonth` decimal(10,2) NOT NULL,
  `benefits` json NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- =================================================================
-- COMMUNITY & MATCHMAKING
-- =================================================================
CREATE TABLE `teams` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `sportId` varchar(255) NOT NULL,
  `captainId` varchar(255) NOT NULL,
  `memberIds` json NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sportId` (`sportId`),
  KEY `captainId` (`captainId`),
  CONSTRAINT `teams_ibfk_1` FOREIGN KEY (`sportId`) REFERENCES `sports` (`id`) ON DELETE CASCADE,
  CONSTRAINT `teams_ibfk_2` FOREIGN KEY (`captainId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `lfg_requests` (
  `id` varchar(255) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `sportId` varchar(255) NOT NULL,
  `facilityId` varchar(255) NOT NULL,
  `facilityName` varchar(255) NOT NULL,
  `notes` text,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('open','closed') NOT NULL DEFAULT 'open',
  `interestedUserIds` json DEFAULT NULL,
  `skillLevel` enum('Any','Beginner','Intermediate','Advanced') DEFAULT 'Any',
  `playersNeeded` int DEFAULT NULL,
  `preferredTime` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `sportId` (`sportId`),
  KEY `facilityId` (`facilityId`),
  CONSTRAINT `lfg_requests_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `lfg_requests_ibfk_2` FOREIGN KEY (`sportId`) REFERENCES `sports` (`id`) ON DELETE CASCADE,
  CONSTRAINT `lfg_requests_ibfk_3` FOREIGN KEY (`facilityId`) REFERENCES `facilities` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `challenges` (
  `id` varchar(255) NOT NULL,
  `challengerId` varchar(255) NOT NULL,
  `opponentId` varchar(255) DEFAULT NULL,
  `sportId` varchar(255) NOT NULL,
  `facilityId` varchar(255) NOT NULL,
  `facilityName` varchar(255) NOT NULL,
  `proposedDate` timestamp NOT NULL,
  `notes` text,
  `status` enum('open','accepted','completed','cancelled') NOT NULL DEFAULT 'open',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `challengerId` (`challengerId`),
  KEY `opponentId` (`opponentId`),
  KEY `sportId` (`sportId`),
  KEY `facilityId` (`facilityId`),
  CONSTRAINT `challenges_ibfk_1` FOREIGN KEY (`challengerId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `challenges_ibfk_2` FOREIGN KEY (`opponentId`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `challenges_ibfk_3` FOREIGN KEY (`sportId`) REFERENCES `sports` (`id`) ON DELETE CASCADE,
  CONSTRAINT `challenges_ibfk_4` FOREIGN KEY (`facilityId`) REFERENCES `facilities` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- =================================================================
-- SEED DATA
-- =================================================================

-- Amenities
INSERT INTO `amenities` (`id`, `name`, `iconName`) VALUES
('amenity-1', 'Parking', 'ParkingCircle'),
('amenity-2', 'Lockers', 'Lock'),
('amenity-3', 'WiFi', 'Wifi'),
('amenity-4', 'Showers', 'ShowerHead'),
('amenity-5', 'Equipment Rental', 'PackageSearch'),
('amenity-6', 'Cafe', 'Utensils');

-- Sports
INSERT INTO `sports` (`id`, `name`, `iconName`, `imageUrl`, `imageDataAiHint`) VALUES
('sport-1', 'Soccer', 'Goal', 'https://picsum.photos/400/300?random=1', 'soccer field'),
('sport-2', 'Basketball', 'Dribbble', 'https://picsum.photos/400/300?random=2', 'basketball court'),
('sport-3', 'Tennis', 'Dices', 'https://picsum.photos/400/300?random=3', 'tennis court'),
('sport-4', 'Badminton', 'Feather', 'https://picsum.photos/400/300?random=4', 'badminton shuttlecock'),
('sport-5', 'Swimming', 'Wind', 'https://picsum.photos/400/300?random=5', 'swimming pool'),
('sport-6', 'Cricket', 'Zap', 'https://picsum.photos/400/300?random=6', 'cricket pitch');

-- Users
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `isProfilePublic`, `loyaltyPoints`, `preferredSports`, `skillLevels`) VALUES
('user-admin-1', 'Admin Alice', 'admin@sportsarena.com', 'adminpass', 'Admin', 1, 100, '[]', '[]'),
('user-owner-1', 'Owner Oscar', 'owner@sportsarena.com', 'ownerpass', 'FacilityOwner', 1, 50, '[]', '[]'),
('user-1', 'Charlie Player', 'charlie@example.com', 'charliepass', 'User', 1, 250, '[{"id": "sport-1", "name": "Soccer"}, {"id": "sport-6", "name": "Cricket"}]', '[{"sportId": "sport-1", "sportName": "Soccer", "level": "Intermediate"}, {"sportId": "sport-6", "sportName": "Cricket", "level": "Advanced"}]'),
('user-2', 'Diana Competitor', 'diana@example.com', 'dianapass', 'User', 1, 150, '[{"id": "sport-3", "name": "Tennis"}]', '[{"sportId": "sport-3", "sportName": "Tennis", "level": "Beginner"}]');

-- Facilities
INSERT INTO `facilities` (`id`, `name`, `type`, `address`, `city`, `location`, `description`, `rating`, `capacity`, `isPopular`, `isIndoor`, `ownerId`) VALUES
('facility-1', 'Grand City Arena', 'Complex', '123 Sports Rd, Koregaon Park', 'Pune', 'Koregaon Park', 'A state-of-the-art multi-sport complex with top-notch amenities.', 4.8, 200, 1, 1, 'user-owner-1'),
('facility-2', 'Greenfield Pitch', 'Field', '456 Meadow Lane, Hinjewadi', 'Pune', 'Hinjewadi', 'A lush green outdoor field perfect for soccer and cricket.', 4.5, 100, 0, 0, 'user-owner-1');

-- Facility Sports & Prices
INSERT INTO `facility_sports` (`facilityId`, `sportId`) VALUES
('facility-1', 'sport-2'), ('facility-1', 'sport-3'), ('facility-1', 'sport-4'),
('facility-2', 'sport-1'), ('facility-2', 'sport-6');

INSERT INTO `sport_prices` (`facilityId`, `sportId`, `price`, `pricingModel`) VALUES
('facility-1', 'sport-2', 1200.00, 'per_hour_flat'),
('facility-1', 'sport-3', 1000.00, 'per_hour_flat'),
('facility-1', 'sport-4', 800.00, 'per_hour_flat'),
('facility-2', 'sport-1', 1500.00, 'per_hour_flat'),
('facility-2', 'sport-6', 2000.00, 'per_hour_flat');

-- Facility Amenities
INSERT INTO `facility_amenities` (`facilityId`, `amenityId`) VALUES
('facility-1', 'amenity-1'), ('facility-1', 'amenity-2'), ('facility-1', 'amenity-3'), ('facility-1', 'amenity-4'), ('facility-1', 'amenity-5'), ('facility-1', 'amenity-6'),
('facility-2', 'amenity-1'), ('facility-2', 'amenity-4');

-- Operating Hours
INSERT INTO `operating_hours` (`facilityId`, `day`, `open`, `close`) VALUES
('facility-1', 'Mon', '08:00:00', '22:00:00'), ('facility-1', 'Tue', '08:00:00', '22:00:00'), ('facility-1', 'Wed', '08:00:00', '22:00:00'), ('facility-1', 'Thu', '08:00:00', '22:00:00'), ('facility-1', 'Fri', '08:00:00', '23:00:00'), ('facility-1', 'Sat', '09:00:00', '23:00:00'), ('facility-1', 'Sun', '09:00:00', '20:00:00'),
('facility-2', 'Mon', '07:00:00', '21:00:00'), ('facility-2', 'Tue', '07:00:00', '21:00:00'), ('facility-2', 'Wed', '07:00:00', '21:00:00'), ('facility-2', 'Thu', '07:00:00', '21:00:00'), ('facility-2', 'Fri', '07:00:00', '21:00:00'), ('facility-2', 'Sat', '06:00:00', '22:00:00'), ('facility-2', 'Sun', '06:00:00', '22:00:00');

-- Events
INSERT INTO `events` (`id`, `name`, `facilityId`, `facilityName`, `sportId`, `startDate`, `endDate`, `description`, `entryFee`, `maxParticipants`, `registeredParticipants`) VALUES
('event-1', 'Summer Cricket Tournament', 'facility-2', 'Greenfield Pitch', 'sport-6', '2024-08-10 09:00:00', '2024-08-11 18:00:00', 'An exciting weekend cricket tournament for all amateur teams.', 5000.00, 16, 4);

-- LFG Request
INSERT INTO `lfg_requests` (`id`, `userId`, `sportId`, `facilityId`, `facilityName`, `notes`, `status`, `interestedUserIds`, `skillLevel`, `playersNeeded`, `preferredTime`) VALUES
('lfg-1', 'user-2', 'sport-3', 'facility-1', 'Grand City Arena', 'Looking for a friendly tennis partner for a singles match this weekend. I am a beginner, just want to practice.', 'open', '[]', 'Beginner', 1, 'Weekend afternoons');

-- Challenges
INSERT INTO `challenges` (`id`, `challengerId`, `sportId`, `facilityId`, `facilityName`, `proposedDate`, `notes`, `status`) VALUES
('chl-1', 'user-1', 'sport-1', 'facility-2', 'Greenfield Pitch', '2024-07-28 17:00:00', 'Open challenge for a 5-a-side soccer game. Bring your team!', 'open');
