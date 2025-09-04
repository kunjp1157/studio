-- Main tables for core entities

CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(255) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `password` VARCHAR(255),
  `phone` VARCHAR(255),
  `profilePictureUrl` VARCHAR(255),
  `dataAiHint` VARCHAR(255),
  `preferredSports` JSON,
  `favoriteFacilities` JSON,
  `membershipLevel` VARCHAR(50) DEFAULT 'Basic',
  `loyaltyPoints` INT DEFAULT 0,
  `achievements` JSON,
  `bio` TEXT,
  `preferredPlayingTimes` VARCHAR(255),
  `skillLevels` JSON,
  `role` VARCHAR(50) NOT NULL,
  `status` VARCHAR(50) NOT NULL,
  `joinedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `teamIds` JSON,
  `isProfilePublic` BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS `facilities` (
  `id` VARCHAR(255) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `address` VARCHAR(255) NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `location` VARCHAR(100) NOT NULL,
  `description` TEXT NOT NULL,
  `rating` FLOAT DEFAULT 0,
  `capacity` INT,
  `isPopular` BOOLEAN DEFAULT FALSE,
  `isIndoor` BOOLEAN DEFAULT FALSE,
  `dataAiHint` VARCHAR(255),
  `ownerId` VARCHAR(255),
  FOREIGN KEY (`ownerId`) REFERENCES `users`(`id`) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS `sports` (
  `id` VARCHAR(255) PRIMARY KEY,
  `name` VARCHAR(255) UNIQUE NOT NULL,
  `iconName` VARCHAR(100),
  `imageUrl` VARCHAR(255),
  `imageDataAiHint` VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS `amenities` (
  `id` VARCHAR(255) PRIMARY KEY,
  `name` VARCHAR(255) UNIQUE NOT NULL,
  `iconName` VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS `bookings` (
  `id` VARCHAR(255) PRIMARY KEY,
  `userId` VARCHAR(255),
  `facilityId` VARCHAR(255) NOT NULL,
  `facilityName` VARCHAR(255) NOT NULL,
  `dataAiHint` VARCHAR(255),
  `sportId` VARCHAR(255) NOT NULL,
  `sportName` VARCHAR(255) NOT NULL,
  `date` DATE NOT NULL,
  `startTime` VARCHAR(5) NOT NULL,
  `endTime` VARCHAR(5) NOT NULL,
  `durationHours` INT,
  `numberOfGuests` INT,
  `baseFacilityPrice` DECIMAL(10, 2),
  `equipmentRentalCost` DECIMAL(10, 2),
  `appliedPromotion` JSON,
  `totalPrice` DECIMAL(10, 2) NOT NULL,
  `status` VARCHAR(50) NOT NULL,
  `bookedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `reviewed` BOOLEAN DEFAULT FALSE,
  `rentedEquipment` JSON,
  `phoneNumber` VARCHAR(20),
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`facilityId`) REFERENCES `facilities`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `reviews` (
  `id` VARCHAR(255) PRIMARY KEY,
  `facilityId` VARCHAR(255) NOT NULL,
  `userId` VARCHAR(255) NOT NULL,
  `userName` VARCHAR(255) NOT NULL,
  `userAvatar` VARCHAR(255),
  `isPublicProfile` BOOLEAN,
  `rating` INT NOT NULL,
  `comment` TEXT,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `bookingId` VARCHAR(255),
  FOREIGN KEY (`facilityId`) REFERENCES `facilities`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `teams` (
  `id` VARCHAR(255) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `sportId` VARCHAR(255) NOT NULL,
  `captainId` VARCHAR(255) NOT NULL,
  `memberIds` JSON NOT NULL,
  FOREIGN KEY (`sportId`) REFERENCES `sports`(`id`),
  FOREIGN KEY (`captainId`) REFERENCES `users`(`id`)
);

CREATE TABLE IF NOT EXISTS `notifications` (
  `id` VARCHAR(255) PRIMARY KEY,
  `userId` VARCHAR(255) NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `isRead` BOOLEAN DEFAULT FALSE,
  `link` VARCHAR(255),
  `iconName` VARCHAR(100),
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- Junction tables for many-to-many relationships

CREATE TABLE IF NOT EXISTS `facility_sports` (
  `facilityId` VARCHAR(255),
  `sportId` VARCHAR(255),
  PRIMARY KEY (`facilityId`, `sportId`),
  FOREIGN KEY (`facilityId`) REFERENCES `facilities`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`sportId`) REFERENCES `sports`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `facility_amenities` (
  `facilityId` VARCHAR(255),
  `amenityId` VARCHAR(255),
  PRIMARY KEY (`facilityId`, `amenityId`),
  FOREIGN KEY (`facilityId`) REFERENCES `facilities`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`amenityId`) REFERENCES `amenities`(`id`) ON DELETE CASCADE
);

-- Configuration and metadata tables

CREATE TABLE IF NOT EXISTS `membership_plans` (
  `id` VARCHAR(255) PRIMARY KEY,
  `name` VARCHAR(100) UNIQUE NOT NULL,
  `pricePerMonth` DECIMAL(10, 2) NOT NULL,
  `benefits` JSON NOT NULL
);

CREATE TABLE IF NOT EXISTS `events` (
  `id` VARCHAR(255) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `facilityId` VARCHAR(255) NOT NULL,
  `facilityName` VARCHAR(255),
  `sportId` VARCHAR(255) NOT NULL,
  `startDate` TIMESTAMP NOT NULL,
  `endDate` TIMESTAMP NOT NULL,
  `description` TEXT,
  `entryFee` DECIMAL(10, 2) DEFAULT 0,
  `maxParticipants` INT DEFAULT 0,
  `registeredParticipants` INT DEFAULT 0,
  `imageUrl` VARCHAR(255),
  `imageDataAiHint` VARCHAR(255),
  FOREIGN KEY (`facilityId`) REFERENCES `facilities`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `pricing_rules` (
  `id` VARCHAR(255) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `daysOfWeek` JSON,
  `timeRange` JSON,
  `dateRange` JSON,
  `adjustmentType` VARCHAR(50) NOT NULL,
  `value` DECIMAL(10, 2) NOT NULL,
  `priority` INT,
  `isActive` BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS `promotion_rules` (
  `id` VARCHAR(255) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `code` VARCHAR(50) UNIQUE,
  `discountType` VARCHAR(50) NOT NULL,
  `discountValue` DECIMAL(10, 2) NOT NULL,
  `startDate` DATE,
  `endDate` DATE,
  `usageLimit` INT,
  `usageLimitPerUser` INT,
  `isActive` BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS `rental_equipment` (
  `id` VARCHAR(255) PRIMARY KEY,
  `facilityId` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `pricePerItem` DECIMAL(10, 2) NOT NULL,
  `priceType` VARCHAR(50) NOT NULL,
  `stock` INT NOT NULL,
  `sportIds` JSON NOT NULL,
  FOREIGN KEY (`facilityId`) REFERENCES `facilities`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `sport_prices` (
  `facilityId` VARCHAR(255),
  `sportId` VARCHAR(255),
  `price` DECIMAL(10, 2) NOT NULL,
  `pricingModel` VARCHAR(50) DEFAULT 'per_hour_flat',
  PRIMARY KEY (`facilityId`, `sportId`),
  FOREIGN KEY (`facilityId`) REFERENCES `facilities`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`sportId`) REFERENCES `sports`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `operating_hours` (
  `facilityId` VARCHAR(255),
  `day` VARCHAR(3),
  `open` VARCHAR(5),
  `close` VARCHAR(5),
  PRIMARY KEY (`facilityId`, `day`),
  FOREIGN KEY (`facilityId`) REFERENCES `facilities`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `blocked_slots` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `facilityId` VARCHAR(255) NOT NULL,
  `date` DATE NOT NULL,
  `startTime` VARCHAR(5) NOT NULL,
  `endTime` VARCHAR(5) NOT NULL,
  `reason` VARCHAR(255),
  FOREIGN KEY (`facilityId`) REFERENCES `facilities`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `maintenance_schedules` (
  `id` VARCHAR(255) PRIMARY KEY,
  `facilityId` VARCHAR(255) NOT NULL,
  `taskName` VARCHAR(255) NOT NULL,
  `recurrenceInDays` INT NOT NULL,
  `lastPerformedDate` DATE NOT NULL,
  FOREIGN KEY (`facilityId`) REFERENCES `facilities`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `lfg_requests` (
  `id` VARCHAR(255) PRIMARY KEY,
  `userId` VARCHAR(255) NOT NULL,
  `sportId` VARCHAR(255) NOT NULL,
  `facilityId` VARCHAR(255) NOT NULL,
  `facilityName` VARCHAR(255),
  `notes` TEXT,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `status` VARCHAR(50) NOT NULL,
  `interestedUserIds` JSON,
  `skillLevel` VARCHAR(50),
  `playersNeeded` INT,
  `preferredTime` VARCHAR(255),
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`),
  FOREIGN KEY (`sportId`) REFERENCES `sports`(`id`),
  FOREIGN KEY (`facilityId`) REFERENCES `facilities`(`id`)
);

CREATE TABLE IF NOT EXISTS `challenges` (
  `id` VARCHAR(255) PRIMARY KEY,
  `challengerId` VARCHAR(255) NOT NULL,
  `opponentId` VARCHAR(255),
  `sportId` VARCHAR(255) NOT NULL,
  `facilityId` VARCHAR(255) NOT NULL,
  `facilityName` VARCHAR(255),
  `proposedDate` TIMESTAMP NOT NULL,
  `notes` TEXT,
  `status` VARCHAR(50) NOT NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`challengerId`) REFERENCES `users`(`id`),
  FOREIGN KEY (`opponentId`) REFERENCES `users`(`id`),
  FOREIGN KEY (`sportId`) REFERENCES `sports`(`id`),
  FOREIGN KEY (`facilityId`) REFERENCES `facilities`(`id`)
);

-- Seed initial data for amenities and sports
-- This runs only if the tables are newly created and empty.

INSERT INTO `amenities` (`id`, `name`, `iconName`) VALUES
('amn-1', 'Parking', 'ParkingCircle'),
('amn-2', 'Wi-Fi', 'Wifi'),
('amn-3', 'Showers', 'ShowerHead'),
('amn-4', 'Lockers', 'Lock'),
('amn-5', 'First Aid', 'Feather'),
('amn-6', 'Refreshments', 'Utensils')
ON DUPLICATE KEY UPDATE `name`=`name`;

INSERT INTO `sports` (`id`, `name`, `iconName`, `imageUrl`, `imageDataAiHint`) VALUES
('sport-1', 'Soccer', 'Goal', 'https://images.unsplash.com/photo-1551958214-e641155da7e2?q=80&w=2070&auto=format&fit=crop', 'soccer stadium'),
('sport-2', 'Basketball', 'Dribbble', 'https://images.unsplash.com/photo-1515523110825-941c13349723?q=80&w=2070&auto=format&fit=crop', 'basketball court'),
('sport-3', 'Tennis', 'Dices', 'https://images.unsplash.com/photo-1559519961-ac7e0f0945b3?q=80&w=2070&auto=format&fit=crop', 'tennis court'),
('sport-4', 'Swimming', 'Bike', 'https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=2070&auto=format&fit=crop', 'swimming pool'),
('sport-5', 'Badminton', 'Feather', 'https://images.unsplash.com/photo-1521587508119-a3152c1a3e6c?q=80&w=2070&auto=format&fit=crop', 'badminton court'),
('sport-6', 'Cricket', 'Swords', 'https://images.unsplash.com/photo-1599395955043-6d75356935f1?q=80&w=2070&auto=format&fit=crop', 'cricket stadium')
ON DUPLICATE KEY UPDATE `name`=`name`;
