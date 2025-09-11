--
-- Database: `sports_arena`
--
CREATE DATABASE IF NOT EXISTS `sports_arena` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `sports_arena`;

-- --------------------------------------------------------

--
-- Table structure for table `amenities`
--

CREATE TABLE `amenities` (
  `id` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `iconName` VARCHAR(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `amenities`
--

INSERT INTO `amenities` (`id`, `name`, `iconName`) VALUES
('amenity-1', 'Parking', 'ParkingCircle'),
('amenity-2', 'Changing Rooms', 'Users'),
('amenity-3', 'Showers', 'ShowerHead'),
('amenity-4', 'Lockers', 'Lock'),
('amenity-5', 'Wi-Fi', 'Wifi'),
('amenity-6', 'First Aid', 'Feather'),
('amenity-7', 'Refreshments', 'Utensils'),
('amenity-8', 'Floodlights', 'Zap');

-- --------------------------------------------------------

--
-- Table structure for table `blog_posts`
--

CREATE TABLE `blog_posts` (
  `id` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `excerpt` TEXT NOT NULL,
  `content` LONGTEXT NOT NULL,
  `authorName` VARCHAR(255) NOT NULL,
  `authorAvatarUrl` VARCHAR(255) DEFAULT NULL,
  `publishedAt` DATETIME NOT NULL,
  `tags` JSON DEFAULT NULL,
  `isFeatured` BOOLEAN DEFAULT FALSE,
  `dataAiHint` VARCHAR(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `blog_posts`
--

INSERT INTO `blog_posts` (`id`, `slug`, `title`, `excerpt`, `content`, `authorName`, `authorAvatarUrl`, `publishedAt`, `tags`, `isFeatured`, `dataAiHint`) VALUES
('blog-1', 'improve-your-cricket-batting', '5 Drills to Drastically Improve Your Cricket Batting', 'Whether you are a beginner or a seasoned player, these five fundamental drills will help you sharpen your batting skills, improve your timing, and score more runs.', '<h2>Introduction</h2><p>Cricket is a game of skill, and batting is its most celebrated art. To become a proficient batsman, one needs dedication, practice, and a clear understanding of the fundamentals. Here are five drills you can incorporate into your practice sessions to see a significant improvement in your batting.</p><h3>1. The Hanging Ball Drill</h3><p>This is a classic drill for a reason. It helps in developing hand-eye coordination, timing, and shot selection. Hang a cricket ball in a sock or a stocking from a ceiling or a tree branch at a height where it would naturally bounce. Practice playing different shots—drives, cuts, and pulls. The stationary nature of the ball allows you to focus purely on your technique.</p><h3>2. Shadow Batting</h3><p>Visualization is a powerful tool. Shadow batting in front of a mirror helps you analyze and correct your stance, grip, and swing. Focus on your form, backlift, and follow-through. This drill can be done anywhere and is excellent for muscle memory.</p>', 'Ravi Shastri', 'https://i.pravatar.cc/150?u=ravi', '2024-05-15 10:00:00', '[\"Cricket\", \"Batting\", \"Drills\"]', 1, 'cricket batting practice'),
('blog-2', 'choosing-the-right-running-shoes', 'How to Choose the Right Running Shoes', 'The right pair of running shoes can make all the difference in your performance and can help prevent injuries. This guide will walk you through the key factors to consider.', '<h2>Why It Matters</h2><p>Your feet are your foundation when you run. The wrong shoes can lead to discomfort, blisters, and even serious injuries like plantar fasciitis or stress fractures. Understanding your foot type and running style is crucial.</p><h3>1. Know Your Foot Type</h3><p>One of the most important factors is your foot\'s arch. You can have a neutral arch, a low arch (flat feet), or a high arch. A simple way to check is the \"wet test\": wet your foot, step on a piece of paper, and examine the footprint. A neutral arch will show about half of the arch, while a low arch will show the whole foot, and a high arch will show very little.</p><h3>2. Consider the Terrain</h3><p>Are you a road runner, a trail runner, or a treadmill user? Road running shoes are flexible and cushioned to absorb impact on hard surfaces. Trail running shoes offer more stability, support, and have rugged outsoles for better grip on uneven terrain.</p>', 'P. T. Usha', 'https://i.pravatar.cc/150?u=usha', '2024-05-20 11:30:00', '[\"Running\", \"Fitness\", \"Shoes\"]', 0, 'running shoes');

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` VARCHAR(255) NOT NULL,
  `userId` VARCHAR(255) DEFAULT NULL,
  `facilityId` VARCHAR(255) NOT NULL,
  `facilityName` VARCHAR(255) NOT NULL,
  `dataAiHint` VARCHAR(255) DEFAULT NULL,
  `sportId` VARCHAR(255) NOT NULL,
  `sportName` VARCHAR(255) NOT NULL,
  `date` DATE NOT NULL,
  `startTime` TIME NOT NULL,
  `endTime` TIME NOT NULL,
  `durationHours` INT DEFAULT 1,
  `numberOfGuests` INT DEFAULT NULL,
  `baseFacilityPrice` DECIMAL(10,2) NOT NULL,
  `equipmentRentalCost` DECIMAL(10,2) DEFAULT 0.00,
  `appliedPromotion` JSON DEFAULT NULL,
  `totalPrice` DECIMAL(10,2) NOT NULL,
  `status` ENUM('Confirmed','Pending','Cancelled') NOT NULL,
  `bookedAt` DATETIME NOT NULL,
  `reviewed` BOOLEAN DEFAULT FALSE,
  `rentedEquipment` JSON DEFAULT NULL,
  `phoneNumber` VARCHAR(20) DEFAULT NULL,
  `pricingModel` ENUM('per_hour_flat','per_hour_per_person') DEFAULT 'per_hour_flat'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `userId`, `facilityId`, `facilityName`, `sportId`, `sportName`, `date`, `startTime`, `endTime`, `totalPrice`, `status`, `bookedAt`, `reviewed`) VALUES
('booking-1', 'user-2', 'facility-pune-1', 'Deccan Arena', 'sport-1', 'Cricket', '2024-07-20', '18:00:00', '20:00:00', 3000.00, 'Confirmed', '2024-06-25 10:00:00', 0),
('booking-2', 'user-3', 'facility-mumbai-2', 'Andheri Sports Complex', 'sport-2', 'Football', '2024-07-22', '19:00:00', '21:00:00', 4000.00, 'Confirmed', '2024-06-26 11:00:00', 0);

-- --------------------------------------------------------

--
-- Table structure for table `challenges`
--

CREATE TABLE `challenges` (
  `id` VARCHAR(255) NOT NULL,
  `challengerId` VARCHAR(255) NOT NULL,
  `opponentId` VARCHAR(255) DEFAULT NULL,
  `sportId` VARCHAR(255) NOT NULL,
  `facilityId` VARCHAR(255) NOT NULL,
  `facilityName` VARCHAR(255) NOT NULL,
  `proposedDate` DATETIME NOT NULL,
  `notes` TEXT NOT NULL,
  `status` ENUM('open','accepted','completed','cancelled') NOT NULL DEFAULT 'open',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `challenges`
--

INSERT INTO `challenges` (`id`, `challengerId`, `sportId`, `facilityId`, `facilityName`, `proposedDate`, `notes`) VALUES
('challenge-1', 'user-2', 'sport-3', 'facility-delhi-1', 'Nehru Stadium', '2024-07-28 17:00:00', 'Friendly but competitive game of tennis, anyone? Loser buys chai!');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `facilityId` VARCHAR(255) NOT NULL,
  `facilityName` VARCHAR(255) NOT NULL,
  `sportId` VARCHAR(255) NOT NULL,
  `startDate` DATETIME NOT NULL,
  `endDate` DATETIME NOT NULL,
  `description` TEXT NOT NULL,
  `entryFee` DECIMAL(10,2) DEFAULT 0.00,
  `maxParticipants` INT DEFAULT 0,
  `registeredParticipants` INT DEFAULT 0,
  `imageUrl` VARCHAR(255) DEFAULT NULL,
  `imageDataAiHint` VARCHAR(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `name`, `facilityId`, `facilityName`, `sportId`, `startDate`, `endDate`, `description`, `entryFee`, `maxParticipants`) VALUES
('event-1', 'Monsoon Football League', 'facility-mumbai-master', 'Mumbai Football Arena', 'sport-2', '2024-08-01 09:00:00', '2024-08-15 18:00:00', 'Join the biggest 5-a-side football tournament of the season. Exciting prizes to be won!', 5000.00, 32);

-- --------------------------------------------------------

--
-- Table structure for table `facilities`
--

CREATE TABLE `facilities` (
  `id` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `type` ENUM('Complex','Court','Field','Studio','Pool','Box Cricket') NOT NULL,
  `address` VARCHAR(255) NOT NULL,
  `city` VARCHAR(255) NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `rating` DECIMAL(3,2) DEFAULT 0.00,
  `capacity` INT DEFAULT 0,
  `isPopular` BOOLEAN DEFAULT FALSE,
  `isIndoor` BOOLEAN DEFAULT FALSE,
  `dataAiHint` VARCHAR(255) DEFAULT NULL,
  `availableEquipment` JSON DEFAULT NULL,
  `ownerId` VARCHAR(255) DEFAULT NULL,
  `blockedSlots` JSON DEFAULT NULL,
  `maintenanceSchedules` JSON DEFAULT NULL,
  `status` ENUM('Active','PendingApproval','Rejected','Inactive') NOT NULL DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `facilities`
--

INSERT INTO `facilities` (`id`, `name`, `type`, `address`, `city`, `location`, `description`, `rating`, `capacity`, `isPopular`, `isIndoor`) VALUES
('facility-mumbai-master', 'Mumbai Football Arena', 'Complex', 'Andheri West, Mumbai', 'Mumbai', 'Andheri', 'State-of-the-art football complex with multiple pitches.', 4.80, 500, 1, 0),
('facility-mumbai-1', 'Juhu Sports Club', 'Court', 'Juhu, Mumbai', 'Mumbai', 'Juhu', 'Premier tennis and badminton courts.', 4.50, 100, 0, 1),
('facility-mumbai-2', 'Dadar Cricket Ground', 'Field', 'Dadar, Mumbai', 'Mumbai', 'Dadar', 'A lush green cricket field for professional matches.', 4.60, 200, 1, 0),
('facility-mumbai-3', 'Bandra Box Cricket', 'Box Cricket', 'Bandra, Mumbai', 'Mumbai', 'Bandra', 'Fast-paced cricket action in a caged turf.', 4.70, 20, 1, 0),
('facility-mumbai-4', 'Chembur Swimming Pool', 'Pool', 'Chembur, Mumbai', 'Mumbai', 'Chembur', 'Olympic size swimming pool with certified trainers.', 4.40, 50, 0, 1),
('facility-mumbai-5', 'Powai Badminton Courts', 'Court', 'Powai, Mumbai', 'Mumbai', 'Powai', 'Well-maintained indoor badminton courts.', 4.50, 30, 0, 1),

('facility-delhi-master', 'Delhi Sports Complex', 'Complex', 'Hauz Khas, New Delhi', 'Delhi', 'Hauz Khas', 'Multi-sport complex with facilities for various games.', 4.70, 1000, 1, 1),
('facility-delhi-1', 'Noida Cricket Stadium', 'Field', 'Sector 21A, Noida', 'Delhi', 'Noida', 'International standard cricket ground.', 4.80, 500, 1, 0),
('facility-delhi-2', 'Gurgaon Football Turf', 'Field', 'Sector 29, Gurgaon', 'Delhi', 'Gurgaon', 'FIFA-approved artificial turf for football.', 4.60, 100, 0, 0),
('facility-delhi-3', 'Saket Badminton Hall', 'Court', 'Saket, New Delhi', 'Delhi', 'Saket', 'Indoor badminton hall with wooden flooring.', 4.50, 50, 0, 1),
('facility-delhi-4', 'Vasant Kunj Tennis Academy', 'Court', 'Vasant Kunj, New Delhi', 'Delhi', 'Vasant Kunj', 'Clay courts for a professional tennis experience.', 4.70, 40, 0, 0),
('facility-delhi-5', 'Rohini Sports Center', 'Complex', 'Rohini, New Delhi', 'Delhi', 'Rohini', 'Community sports center with multiple facilities.', 4.30, 200, 0, 1),

('facility-bengaluru-master', 'Bengaluru Turf Park', 'Complex', 'Koramangala, Bengaluru', 'Bengaluru', 'Koramangala', 'A massive complex with turfs for cricket and football.', 4.90, 300, 1, 0),
('facility-bengaluru-1', 'Indiranagar Badminton Club', 'Court', 'Indiranagar, Bengaluru', 'Bengaluru', 'Indiranagar', 'Popular spot for badminton enthusiasts.', 4.60, 60, 1, 1),
('facility-bengaluru-2', 'Whitefield Football Club', 'Field', 'Whitefield, Bengaluru', 'Bengaluru', 'Whitefield', 'A dedicated 11-a-side football field.', 4.50, 150, 0, 0),
('facility-bengaluru-3', 'Jayanagar Swimming Centre', 'Pool', 'Jayanagar, Bengaluru', 'Bengaluru', 'Jayanagar', 'Clean and well-maintained swimming pool.', 4.70, 80, 0, 1),
('facility-bengaluru-4', 'HSR Layout Box Cricket', 'Box Cricket', 'HSR Layout, Bengaluru', 'Bengaluru', 'HSR Layout', 'Rooftop box cricket with a great view.', 4.80, 25, 1, 0),
('facility-bengaluru-5', 'Malleshwaram Tennis Courts', 'Court', 'Malleshwaram, Bengaluru', 'Bengaluru', 'Malleshwaram', 'Classic clay courts for tennis lovers.', 4.40, 30, 0, 0),

('facility-chennai-master', 'Marina Sports Arena', 'Complex', 'Besant Nagar, Chennai', 'Chennai', 'Besant Nagar', 'A beachside complex offering a variety of sports.', 4.60, 400, 1, 0),
('facility-chennai-1', 'Nungambakkam Tennis Stadium', 'Court', 'Nungambakkam, Chennai', 'Chennai', 'Nungambakkam', 'Host to international tennis tournaments.', 4.90, 200, 1, 0),
('facility-chennai-2', 'Adyar Cricket Nets', 'Field', 'Adyar, Chennai', 'Chennai', 'Adyar', 'Professional cricket practice nets.', 4.50, 50, 0, 0),
('facility-chennai-3', 'T. Nagar Badminton Hall', 'Court', 'T. Nagar, Chennai', 'Chennai', 'T. Nagar', 'Centrally located indoor badminton courts.', 4.40, 40, 0, 1),
('facility-chennai-4', 'Velachery Aquatic Complex', 'Pool', 'Velachery, Chennai', 'Chennai', 'Velachery', 'Modern swimming facility for all age groups.', 4.70, 100, 0, 1),
('facility-chennai-5', 'OMR Football Turf', 'Field', 'OMR, Chennai', 'Chennai', 'OMR', 'A popular 5-a-side football turf.', 4.60, 40, 0, 0),

('facility-kolkata-master', 'Maidan Sports Complex', 'Complex', 'Maidan, Kolkata', 'Kolkata', 'Maidan', 'An iconic location with facilities for football, cricket, and more.', 4.80, 1000, 1, 0),
('facility-kolkata-1', 'Salt Lake Stadium', 'Field', 'Salt Lake, Kolkata', 'Kolkata', 'Salt Lake', 'A world-famous stadium for football.', 4.90, 85000, 1, 0),
('facility-kolkata-2', 'South Club Tennis Courts', 'Court', 'Ballygunge, Kolkata', 'Kolkata', 'Ballygunge', 'One of the oldest and most prestigious tennis clubs.', 4.70, 100, 0, 0),
('facility-kolkata-3', 'New Town Box Cricket', 'Box Cricket', 'New Town, Kolkata', 'Kolkata', 'New Town', 'Modern box cricket facility.', 4.60, 30, 0, 0),
('facility-kolkata-4', 'Rabindra Sarobar Pool', 'Pool', 'Dhakuria, Kolkata', 'Kolkata', 'Dhakuria', 'A large swimming pool in a serene environment.', 4.50, 150, 0, 0),
('facility-kolkata-5', 'Howrah Indoor Badminton', 'Court', 'Howrah, Kolkata', 'Kolkata', 'Howrah', 'Indoor courts across the river.', 4.30, 50, 0, 1),

('facility-hyderabad-master', 'Gachibowli Sports Hub', 'Complex', 'Gachibowli, Hyderabad', 'Hyderabad', 'Gachibowli', 'A world-class complex for multiple sports.', 4.90, 5000, 1, 1),
('facility-hyderabad-1', 'Uppal Cricket Stadium', 'Field', 'Uppal, Hyderabad', 'Hyderabad', 'Uppal', 'International cricket venue.', 4.80, 39000, 1, 0),
('facility-hyderabad-2', 'Jubilee Hills Badminton Arena', 'Court', 'Jubilee Hills, Hyderabad', 'Hyderabad', 'Jubilee Hills', 'High-end badminton facility.', 4.70, 80, 0, 1),
('facility-hyderabad-3', 'Banjara Hills Football Turf', 'Field', 'Banjara Hills, Hyderabad', 'Hyderabad', 'Banjara Hills', 'A popular 7-a-side football turf.', 4.60, 60, 0, 0),
('facility-hyderabad-4', 'Hi-tech City Box Cricket', 'Box Cricket', 'Hi-tech City, Hyderabad', 'Hyderabad', 'Hi-tech City', 'Ideal for corporate cricket matches.', 4.70, 30, 1, 0),
('facility-hyderabad-5', 'Secunderabad Club Pool', 'Pool', 'Secunderabad, Hyderabad', 'Hyderabad', 'Secunderabad', 'A well-maintained pool with a legacy.', 4.50, 100, 0, 0),

('facility-pune-master', 'Balewadi Sports Complex', 'Complex', 'Balewadi, Pune', 'Pune', 'Balewadi', 'An international standard multi-disciplinary sports complex.', 4.80, 11000, 1, 1),
('facility-pune-1', 'Deccan Arena', 'Field', 'Deccan Gymkhana, Pune', 'Pune', 'Deccan', 'Spacious cricket and football ground in the heart of the city.', 4.60, 200, 1, 0),
('facility-pune-2', 'PYC Hindu Gymkhana', 'Court', 'Deccan Gymkhana, Pune', 'Pune', 'Deccan', 'Prestigious club with excellent tennis and badminton courts.', 4.70, 100, 0, 1),
('facility-pune-3', 'Turf Up Viman Nagar', 'Box Cricket', 'Viman Nagar, Pune', 'Pune', 'Viman Nagar', 'Rooftop turf for an exhilarating game of box cricket.', 4.50, 25, 0, 0),
('facility-pune-4', 'Kothrud Swimming Tank', 'Pool', 'Kothrud, Pune', 'Pune', 'Kothrud', 'A public swimming pool with coaching facilities.', 4.30, 80, 0, 0),
('facility-pune-5', 'Aundh Badminton Hall', 'Court', 'Aundh, Pune', 'Pune', 'Aundh', 'Well-lit indoor badminton courts for evening play.', 4.40, 40, 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `facility_amenities`
--

CREATE TABLE `facility_amenities` (
  `facilityId` VARCHAR(255) NOT NULL,
  `amenityId` VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `facility_amenities`
--

INSERT INTO `facility_amenities` (`facilityId`, `amenityId`) VALUES
('facility-mumbai-master', 'amenity-1'), ('facility-mumbai-master', 'amenity-2'),
('facility-pune-1', 'amenity-1'), ('facility-pune-1', 'amenity-7');

-- --------------------------------------------------------

--
-- Table structure for table `facility_operating_hours`
--

CREATE TABLE `facility_operating_hours` (
  `facilityId` VARCHAR(255) NOT NULL,
  `day` ENUM('Mon','Tue','Wed','Thu','Fri','Sat','Sun') NOT NULL,
  `open` TIME NOT NULL,
  `close` TIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `facility_operating_hours`
--

INSERT INTO `facility_operating_hours` (`facilityId`, `day`, `open`, `close`) VALUES
('facility-pune-1', 'Mon', '08:00:00', '22:00:00'),
('facility-pune-1', 'Tue', '08:00:00', '22:00:00'),
('facility-pune-1', 'Wed', '08:00:00', '22:00:00'),
('facility-pune-1', 'Thu', '08:00:00', '22:00:00'),
('facility-pune-1', 'Fri', '08:00:00', '23:00:00'),
('facility-pune-1', 'Sat', '07:00:00', '23:00:00'),
('facility-pune-1', 'Sun', '07:00:00', '21:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `facility_sports`
--

CREATE TABLE `facility_sports` (
  `facilityId` VARCHAR(255) NOT NULL,
  `sportId` VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `facility_sports`
--

INSERT INTO `facility_sports` (`facilityId`, `sportId`) VALUES
('facility-mumbai-master', 'sport-2'),
('facility-pune-1', 'sport-1'),
('facility-pune-1', 'sport-2');

-- --------------------------------------------------------

--
-- Table structure for table `facility_sport_prices`
--

CREATE TABLE `facility_sport_prices` (
  `facilityId` VARCHAR(255) NOT NULL,
  `sportId` VARCHAR(255) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `pricingModel` ENUM('per_hour_flat','per_hour_per_person') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `facility_sport_prices`
--

INSERT INTO `facility_sport_prices` (`facilityId`, `sportId`, `price`, `pricingModel`) VALUES
('facility-pune-1', 'sport-1', 1500.00, 'per_hour_flat'),
('facility-pune-1', 'sport-2', 2000.00, 'per_hour_flat');

-- --------------------------------------------------------

--
-- Table structure for table `lfg_requests`
--

CREATE TABLE `lfg_requests` (
  `id` VARCHAR(255) NOT NULL,
  `userId` VARCHAR(255) NOT NULL,
  `sportId` VARCHAR(255) NOT NULL,
  `facilityId` VARCHAR(255) NOT NULL,
  `facilityName` VARCHAR(255) NOT NULL,
  `notes` TEXT NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` ENUM('open','closed') NOT NULL DEFAULT 'open',
  `interestedUserIds` JSON DEFAULT NULL,
  `skillLevel` ENUM('Any','Beginner','Intermediate','Advanced') DEFAULT 'Any',
  `playersNeeded` INT DEFAULT NULL,
  `preferredTime` VARCHAR(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `lfg_requests`
--

INSERT INTO `lfg_requests` (`id`, `userId`, `sportId`, `facilityId`, `facilityName`, `notes`, `skillLevel`, `playersNeeded`) VALUES
('lfg-1', 'user-2', 'sport-1', 'facility-pune-1', 'Deccan Arena', 'Looking for 2 players for a friendly cricket match this weekend.', 'Intermediate', 2);

-- --------------------------------------------------------

--
-- Table structure for table `membership_plans`
--

CREATE TABLE `membership_plans` (
  `id` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `pricePerMonth` DECIMAL(10,2) NOT NULL,
  `benefits` JSON NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `pricing_rules`
--

CREATE TABLE `pricing_rules` (
  `id` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `facilityIds` JSON DEFAULT NULL,
  `daysOfWeek` JSON DEFAULT NULL,
  `timeRange` JSON DEFAULT NULL,
  `dateRange` JSON DEFAULT NULL,
  `adjustmentType` ENUM('percentage_increase','percentage_decrease','fixed_increase','fixed_decrease','fixed_price') NOT NULL,
  `value` DECIMAL(10,2) NOT NULL,
  `priority` INT DEFAULT NULL,
  `isActive` BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `promotion_rules`
--

CREATE TABLE `promotion_rules` (
  `id` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `code` VARCHAR(255) DEFAULT NULL,
  `discountType` ENUM('percentage','fixed_amount') NOT NULL,
  `discountValue` DECIMAL(10,2) NOT NULL,
  `startDate` DATE DEFAULT NULL,
  `endDate` DATE DEFAULT NULL,
  `usageLimit` INT DEFAULT NULL,
  `usageLimitPerUser` INT DEFAULT NULL,
  `isActive` BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` VARCHAR(255) NOT NULL,
  `facilityId` VARCHAR(255) NOT NULL,
  `userId` VARCHAR(255) NOT NULL,
  `userName` VARCHAR(255) NOT NULL,
  `userAvatar` VARCHAR(255) DEFAULT NULL,
  `isPublicProfile` BOOLEAN DEFAULT FALSE,
  `rating` INT NOT NULL,
  `comment` TEXT NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `bookingId` VARCHAR(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `facilityId`, `userId`, `userName`, `rating`, `comment`, `bookingId`) VALUES
('review-1', 'facility-pune-1', 'user-2', 'Charlie Davis', 5, 'Excellent ground with great maintenance. Had a wonderful time playing cricket here!', 'booking-1');

-- --------------------------------------------------------

--
-- Table structure for table `sports`
--

CREATE TABLE `sports` (
  `id` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `iconName` VARCHAR(255) DEFAULT NULL,
  `imageUrl` VARCHAR(255) DEFAULT NULL,
  `imageDataAiHint` VARCHAR(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `sports`
--

INSERT INTO `sports` (`id`, `name`, `iconName`) VALUES
('sport-1', 'Cricket', 'Dribbble'),
('sport-2', 'Football', 'Goal'),
('sport-3', 'Tennis', 'Dices'),
('sport-4', 'Badminton', 'Feather'),
('sport-5', 'Swimming', 'Wind');

-- --------------------------------------------------------

--
-- Table structure for table `teams`
--

CREATE TABLE `teams` (
  `id` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `sportId` VARCHAR(255) NOT NULL,
  `captainId` VARCHAR(255) NOT NULL,
  `memberIds` JSON NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `profilePictureUrl` VARCHAR(255) DEFAULT NULL,
  `dataAiHint` VARCHAR(255) DEFAULT NULL,
  `preferredSports` JSON DEFAULT NULL,
  `favoriteFacilities` JSON DEFAULT NULL,
  `membershipLevel` ENUM('Basic','Premium','Pro') DEFAULT 'Basic',
  `loyaltyPoints` INT DEFAULT 0,
  `achievements` JSON DEFAULT NULL,
  `bio` TEXT DEFAULT NULL,
  `preferredPlayingTimes` VARCHAR(255) DEFAULT NULL,
  `skillLevels` JSON DEFAULT NULL,
  `role` ENUM('Admin','FacilityOwner','User') NOT NULL DEFAULT 'User',
  `status` ENUM('Active','Suspended','PendingApproval') NOT NULL DEFAULT 'Active',
  `joinedAt` DATETIME NOT NULL,
  `teamIds` JSON DEFAULT NULL,
  `isProfilePublic` BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `joinedAt`) VALUES
('user-1', 'Admin User', 'admin@sportsarena.com', 'admin123', 'Admin', '2024-01-01 12:00:00'),
('user-2', 'Charlie Davis', 'charlie.davis@example.com', 'charlie123', 'User', '2024-02-15 14:30:00'),
('user-3', 'Facility Owner', 'owner@sportsarena.com', 'owner123', 'FacilityOwner', '2024-03-10 09:00:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `amenities`
--
ALTER TABLE `amenities`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `blog_posts`
--
ALTER TABLE `blog_posts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `facilityId` (`facilityId`);

--
-- Indexes for table `challenges`
--
ALTER TABLE `challenges`
  ADD PRIMARY KEY (`id`),
  ADD KEY `challengerId` (`challengerId`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `facilityId` (`facilityId`),
  ADD KEY `sportId` (`sportId`);

--
-- Indexes for table `facilities`
--
ALTER TABLE `facilities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ownerId` (`ownerId`);

--
-- Indexes for table `facility_amenities`
--
ALTER TABLE `facility_amenities`
  ADD PRIMARY KEY (`facilityId`,`amenityId`),
  ADD KEY `amenityId` (`amenityId`);

--
-- Indexes for table `facility_operating_hours`
--
ALTER TABLE `facility_operating_hours`
  ADD PRIMARY KEY (`facilityId`,`day`);

--
-- Indexes for table `facility_sports`
--
ALTER TABLE `facility_sports`
  ADD PRIMARY KEY (`facilityId`,`sportId`),
  ADD KEY `sportId` (`sportId`);

--
-- Indexes for table `facility_sport_prices`
--
ALTER TABLE `facility_sport_prices`
  ADD PRIMARY KEY (`facilityId`,`sportId`),
  ADD KEY `sportId` (`sportId`);

--
-- Indexes for table `lfg_requests`
--
ALTER TABLE `lfg_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `membership_plans`
--
ALTER TABLE `membership_plans`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pricing_rules`
--
ALTER TABLE `pricing_rules`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `promotion_rules`
--
ALTER TABLE `promotion_rules`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `facilityId` (`facilityId`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `sports`
--
ALTER TABLE `sports`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `teams`
--
ALTER TABLE `teams`
  ADD PRIMARY KEY (`id`),
  ADD KEY `captainId` (`captainId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);
COMMIT;