-- MySQL Schema for Sports Arena

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for amenities
-- ----------------------------
DROP TABLE IF EXISTS `amenities`;
CREATE TABLE `amenities` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `iconName` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of amenities
-- ----------------------------
BEGIN;
INSERT INTO `amenities` VALUES ('amenity-1', 'Parking', 'ParkingCircle');
INSERT INTO `amenities` VALUES ('amenity-2', 'Locker Rooms', 'Lock');
INSERT INTO `amenities` VALUES ('amenity-3', 'Showers', 'ShowerHead');
INSERT INTO `amenities` VALUES ('amenity-4', 'Wi-Fi', 'Wifi');
INSERT INTO `amenities` VALUES ('amenity-5', 'First Aid', 'Feather');
INSERT INTO `amenities` VALUES ('amenity-6', 'Refreshments', 'Utensils');
INSERT INTO `amenities` VALUES ('amenity-7', 'Equipment Rental', 'PackageSearch');
INSERT INTO `amenities` VALUES ('amenity-8', 'Floodlights', 'Lightbulb');
COMMIT;

-- ----------------------------
-- Table structure for sports
-- ----------------------------
DROP TABLE IF EXISTS `sports`;
CREATE TABLE `sports` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `iconName` varchar(255) DEFAULT NULL,
  `imageUrl` varchar(255) DEFAULT NULL,
  `imageDataAiHint` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of sports
-- ----------------------------
BEGIN;
INSERT INTO `sports` VALUES ('sport-1', 'Cricket', 'Dribbble', 'https://images.unsplash.com/photo-1595784121252-878c43719942', 'cricket stadium');
INSERT INTO `sports` VALUES ('sport-2', 'Football', 'Goal', 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55', 'football stadium');
INSERT INTO `sports` VALUES ('sport-3', 'Tennis', 'Dribbble', 'https://images.unsplash.com/photo-1554062132-729a3a195a9a', 'tennis court');
INSERT INTO `sports` VALUES ('sport-4', 'Badminton', 'Feather', 'https://images.unsplash.com/photo-1521587585386-3a6a2b29f44a', 'badminton racket');
INSERT INTO `sports` VALUES ('sport-5', 'Basketball', 'Dribbble', 'https://images.unsplash.com/photo-1518649424451-926de1ab85c7', 'basketball hoop');
INSERT INTO `sports` VALUES ('sport-6', 'Swimming', 'Wind', 'https://images.unsplash.com/photo-1590794056226-3527a5b3f233', 'swimming pool');
INSERT INTO `sports` VALUES ('sport-7', 'Table Tennis', 'Dices', 'https://images.unsplash.com/photo-1599303537233-d8534343a417', 'table tennis');
COMMIT;


-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
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
  `joinedAt` datetime NOT NULL,
  `teamIds` json DEFAULT NULL,
  `isProfilePublic` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- ----------------------------
-- Records of users
-- ----------------------------
BEGIN;
INSERT INTO `users` VALUES ('user-admin', 'Admin User', 'admin@sportsarena.com', 'admin123', '9876543210', 'https://picsum.photos/seed/admin/200/200', 'admin user avatar', NULL, NULL, 'Pro', 1000, NULL, 'Administrator of the Sports Arena platform.', NULL, NULL, 'Admin', 'Active', '2023-01-01 10:00:00', NULL, 1);
INSERT INTO `users` VALUES ('user-owner', 'Arena Owner', 'owner@sportsarena.com', 'owner123', '9876543211', 'https://picsum.photos/seed/owner/200/200', 'facility owner avatar', NULL, '[\"facility-pune-1\"]', 'Premium', 500, NULL, 'Proud owner of multiple sports facilities.', 'Weekends', NULL, 'FacilityOwner', 'Active', '2023-01-15 12:00:00', NULL, 1);
INSERT INTO `users` VALUES ('user-1', 'Charlie Davis', 'charlie@example.com', 'charlie123', '9123456789', 'https://picsum.photos/seed/charlie/200/200', 'regular user avatar', NULL, '[\"facility-mumbai-2\"]', 'Basic', 150, NULL, 'Casual weekend cricketer.', 'Weekends', '[{\"sportId\": \"sport-1\", \"sportName\": \"Cricket\", \"level\": \"Intermediate\"}]', 'User', 'Active', '2023-02-20 18:00:00', NULL, 1);
COMMIT;


-- Add more tables and data as needed...

SET FOREIGN_KEY_CHECKS = 1;
