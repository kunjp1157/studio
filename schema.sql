
-- Main Tables
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(255) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255),
  `phone` VARCHAR(20),
  `profilePictureUrl` VARCHAR(255),
  `role` ENUM('Admin', 'FacilityOwner', 'User') NOT NULL,
  `status` ENUM('Active', 'Suspended', 'PendingApproval') NOT NULL,
  `joinedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `isProfilePublic` BOOLEAN DEFAULT TRUE,
  `loyaltyPoints` INT DEFAULT 0,
  `membershipLevel` VARCHAR(50) DEFAULT 'Basic',
  `bio` TEXT,
  `preferredPlayingTimes` VARCHAR(255),
  `favoriteFacilities` JSON,
  `preferredSports` JSON,
  `skillLevels` JSON,
  `achievements` JSON,
  `teamIds` JSON
);

CREATE TABLE IF NOT EXISTS `facilities` (
  `id` VARCHAR(255) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `type` ENUM('Complex', 'Court', 'Field', 'Studio', 'Pool', 'Box Cricket') NOT NULL,
  `address` VARCHAR(255) NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `location` VARCHAR(100) NOT NULL,
  `description` TEXT NOT NULL,
  `rating` DECIMAL(3, 2) DEFAULT 0.00,
  `capacity` INT,
  `isPopular` BOOLEAN DEFAULT FALSE,
  `isIndoor` BOOLEAN DEFAULT FALSE,
  `dataAiHint` VARCHAR(255),
  `ownerId` VARCHAR(255),
  FOREIGN KEY (`ownerId`) REFERENCES `users`(`id`) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS `sports` (
  `id` VARCHAR(255) NOT NULL PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `iconName` VARCHAR(100),
  `imageUrl` VARCHAR(255),
  `imageDataAiHint` VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS `amenities` (
  `id` VARCHAR(255) NOT NULL PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `iconName` VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS `bookings` (
  `id` VARCHAR(255) NOT NULL PRIMARY KEY,
  `userId` VARCHAR(255),
  `facilityId` VARCHAR(255) NOT NULL,
  `facilityName` VARCHAR(255),
  `sportId` VARCHAR(255) NOT NULL,
  `sportName` VARCHAR(255),
  `date` DATE NOT NULL,
  `startTime` TIME NOT NULL,
  `endTime` TIME NOT NULL,
  `numberOfGuests` INT,
  `baseFacilityPrice` DECIMAL(10, 2) NOT NULL,
  `equipmentRentalCost` DECIMAL(10, 2) NOT NULL,
  `totalPrice` DECIMAL(10, 2) NOT NULL,
  `status` ENUM('Confirmed', 'Pending', 'Cancelled') NOT NULL,
  `bookedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `reviewed` BOOLEAN DEFAULT FALSE,
  `phoneNumber` VARCHAR(20),
  `appliedPromotion` JSON,
  `rentedEquipment` JSON,
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`facilityId`) REFERENCES `facilities`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `reviews` (
    `id` VARCHAR(255) NOT NULL PRIMARY KEY,
    `facilityId` VARCHAR(255) NOT NULL,
    `userId` VARCHAR(255) NOT NULL,
    `bookingId` VARCHAR(255),
    `userName` VARCHAR(255),
    `userAvatar` VARCHAR(255),
    `isPublicProfile` BOOLEAN,
    `rating` INT NOT NULL,
    `comment` TEXT,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`facilityId`) REFERENCES `facilities`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE
);


-- Junction Tables
CREATE TABLE IF NOT EXISTS `facility_sports` (
  `facilityId` VARCHAR(255) NOT NULL,
  `sportId` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`facilityId`, `sportId`),
  FOREIGN KEY (`facilityId`) REFERENCES `facilities`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`sportId`) REFERENCES `sports`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `facility_amenities` (
  `facilityId` VARCHAR(255) NOT NULL,
  `amenityId` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`facilityId`, `amenityId`),
  FOREIGN KEY (`facilityId`) REFERENCES `facilities`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`amenityId`) REFERENCES `amenities`(`id`) ON DELETE CASCADE
);

-- Supporting Tables
CREATE TABLE IF NOT EXISTS `operating_hours` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `facilityId` VARCHAR(255) NOT NULL,
  `day` ENUM('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun') NOT NULL,
  `open` TIME NOT NULL,
  `close` TIME NOT NULL,
  UNIQUE (`facilityId`, `day`),
  FOREIGN KEY (`facilityId`) REFERENCES `facilities`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `sport_prices` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `facilityId` VARCHAR(255) NOT NULL,
  `sportId` VARCHAR(255) NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `pricingModel` ENUM('per_hour_flat', 'per_hour_per_person') NOT NULL,
  UNIQUE (`facilityId`, `sportId`),
  FOREIGN KEY (`facilityId`) REFERENCES `facilities`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`sportId`) REFERENCES `sports`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `rental_equipment` (
    `id` VARCHAR(255) NOT NULL PRIMARY KEY,
    `facilityId` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `pricePerItem` DECIMAL(10, 2) NOT NULL,
    `priceType` ENUM('per_booking', 'per_hour') NOT NULL,
    `stock` INT NOT NULL,
    `sportIds` JSON NOT NULL,
    FOREIGN KEY (`facilityId`) REFERENCES `facilities`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `blocked_slots` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `facilityId` VARCHAR(255) NOT NULL,
  `date` DATE NOT NULL,
  `startTime` TIME NOT NULL,
  `endTime` TIME NOT NULL,
  `reason` VARCHAR(255),
  FOREIGN KEY (`facilityId`) REFERENCES `facilities`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `maintenance_schedules` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `facilityId` VARCHAR(255) NOT NULL,
  `taskName` VARCHAR(255) NOT NULL,
  `recurrenceInDays` INT NOT NULL,
  `lastPerformedDate` DATE NOT NULL,
  FOREIGN KEY (`facilityId`) REFERENCES `facilities`(`id`) ON DELETE CASCADE
);

-- Seed initial data
INSERT IGNORE INTO `sports` (`id`, `name`, `iconName`) VALUES
('sport-1', 'Soccer', 'Goal'),
('sport-2', 'Basketball', 'Dribbble'),
('sport-3', 'Tennis', 'Drama'),
('sport-4', 'Badminton', 'Feather'),
('sport-5', 'Swimming', 'Bike'),
('sport-6', 'Cricket', 'Cricket'),
('sport-7', 'Gym', 'Dumbbell'),
('sport-8', 'Yoga', 'PersonStanding');

INSERT IGNORE INTO `amenities` (`id`, `name`, `iconName`) VALUES
('amenity-1', 'Parking', 'ParkingCircle'),
('amenity-2', 'WiFi', 'Wifi'),
('amenity-3', 'Showers', 'ShowerHead'),
('amenity-4', 'Lockers', 'Lock'),
('amenity-5', 'Equipment Rental', 'PackageSearch'),
('amenity-6', 'Cafe', 'Utensils'),
('amenity-7', 'Accessible', 'Users');
