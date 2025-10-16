

--
-- Database: `sports_arena`
--

-- --------------------------------------------------------

--
-- Table structure for table `amenities`
--

CREATE TABLE `amenities` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `iconName` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `amenities`
--

INSERT INTO `amenities` (`id`, `name`, `iconName`) VALUES
('amenity-01', 'Parking', 'ParkingCircle'),
('amenity-02', 'Locker Room', 'Lock'),
('amenity-03', 'Showers', 'ShowerHead'),
('amenity-04', 'Wi-Fi', 'Wifi'),
('amenity-05', 'First Aid', 'BriefcaseMedical'),
('amenity-06', 'Cafe', 'Utensils'),
('amenity-07', 'Equipment Rental', 'Swords'),
('amenity-08', 'Night Lights', 'Moon');

-- --------------------------------------------------------

--
-- Table structure for table `blog_posts`
--

CREATE TABLE `blog_posts` (
  `id` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `excerpt` text NOT NULL,
  `content` text NOT NULL,
  `authorName` varchar(255) NOT NULL,
  `authorAvatarUrl` varchar(255) DEFAULT NULL,
  `publishedAt` datetime NOT NULL,
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `isFeatured` tinyint(1) DEFAULT 0,
  `dataAiHint` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blog_posts`
--

INSERT INTO `blog_posts` (`id`, `slug`, `title`, `excerpt`, `content`, `authorName`, `authorAvatarUrl`, `publishedAt`, `tags`, `isFeatured`, `dataAiHint`) VALUES
('blog-1', '5-benefits-of-playing-box-cricket', '5 Benefits of Playing Box Cricket', 'Discover why box cricket is more than just a game. From fitness to team building, here are five reasons to book your next match.', '<h2>Introduction</h2><p>Box cricket is rapidly gaining popularity in urban areas. It\'s a fast-paced, high-energy version of cricket that can be played by anyone, regardless of skill level. But beyond the fun, it offers a plethora of health and social benefits.</p><h3>1. Great Cardiovascular Workout</h3><p>The constant running, batting, and bowling in a confined space makes for an intense cardio session, improving heart health.</p><h3>2. Enhanced Teamwork and Communication</h3><p>With a smaller team, each player\'s role is crucial. This fosters better communication and strategic teamwork.</p><h3>3. Improved Reflexes and Agility</h3><p>The fast nature of the game, with balls ricocheting off the walls, sharpens your reflexes and agility.</p><h3>4. Accessible to Everyone</h3><p>You don\'t need a full-sized cricket ground or 11 players. It\'s a more accessible and inclusive format for casual players.</p><h3>5. Stress Buster</h3><p>Engaging in a quick, fun game is a perfect way to de-stress after a long day at work or on weekends.</p><p>Ready to play? <a href=\"/facilities?sport=sport-cricket\">Book a box cricket facility now!</a></p>', 'Rohan Sharma', 'https://randomuser.me/api/portraits/men/32.jpg', '2024-05-10 09:00:00', '[\"Cricket\", \"Fitness\", \"Team Sports\"]', 1, 'box cricket game night'),
('blog-2', 'choosing-the-right-badminton-racquet', 'How to Choose the Right Badminton Racquet', 'Your racquet is your weapon on the court. Learn how to choose one that complements your playing style, whether you\'re a beginner or a pro.', '<p>Choosing a badminton racquet can be daunting with so many options available. Here’s a simple guide:</p><ul><li><strong>Weight:</strong> Lighter racquets (80-84g) are easier to maneuver, ideal for beginners. Heavier ones offer more power.</li><li><strong>Balance Point:</strong> Head-heavy racquets provide more power, head-light racquets offer faster handling for defense, and even-balance racquets offer a middle ground.</li><li><strong>String Tension:</strong> Lower tension provides more power and a larger sweet spot (good for beginners). Higher tension offers more control (for advanced players).</li></ul>', 'Priya Mehta', 'https://randomuser.me/api/portraits/women/44.jpg', '2024-05-15 11:30:00', '[\"Badminton\", \"Gear\", \"Tips\"]', 0, 'badminton racquet shuttlecock');

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `userId` varchar(255) DEFAULT NULL,
  `facilityId` varchar(255) NOT NULL,
  `facilityName` varchar(255) NOT NULL,
  `sportId` varchar(255) NOT NULL,
  `sportName` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `startTime` time NOT NULL,
  `endTime` time NOT NULL,
  `durationHours` int(11) DEFAULT 1,
  `numberOfGuests` int(11) DEFAULT NULL,
  `baseFacilityPrice` decimal(10,2) NOT NULL,
  `equipmentRentalCost` decimal(10,2) DEFAULT 0.00,
  `appliedPromotion` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `totalPrice` decimal(10,2) NOT NULL,
  `status` enum('Confirmed','Pending','Cancelled') NOT NULL,
  `bookedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `reviewed` tinyint(1) DEFAULT 0,
  `rentedEquipment` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `phoneNumber` varchar(20) DEFAULT NULL,
  `pricingModel` enum('per_hour_flat','per_hour_per_person') DEFAULT 'per_hour_flat'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `userId`, `facilityId`, `facilityName`, `sportId`, `sportName`, `date`, `startTime`, `endTime`, `durationHours`, `numberOfGuests`, `baseFacilityPrice`, `equipmentRentalCost`, `appliedPromotion`, `totalPrice`, `status`, `bookedAt`, `reviewed`, `rentedEquipment`, `phoneNumber`, `pricingModel`) VALUES
(1, 'user-charlie', 'facility-pune-01', 'Pune Nets Arena', 'sport-cricket', 'Cricket', '2024-06-25', '18:00:00', '19:00:00', 1, NULL, 1500.00, 0.00, NULL, 1500.00, 'Confirmed', '2024-06-20 10:00:00', 1, NULL, '9876543210', 'per_hour_flat'),
(2, 'user-diana', 'facility-mumbai-02', 'Mumbai Smash Court', 'sport-badminton', 'Badminton', '2024-06-26', '10:00:00', '11:00:00', 1, NULL, 1200.00, 0.00, NULL, 1200.00, 'Confirmed', '2024-06-21 14:30:00', 0, NULL, '9876543211', 'per_hour_flat'),
(3, 'user-charlie', 'facility-delhi-03', 'Delhi Goals', 'sport-football', 'Football', '2024-06-28', '20:00:00', '21:00:00', 1, NULL, 2500.00, 0.00, NULL, 2500.00, 'Cancelled', '2024-06-22 08:00:00', 0, NULL, '9876543210', 'per_hour_flat');

-- --------------------------------------------------------

--
-- Table structure for table `challenges`
--

CREATE TABLE `challenges` (
  `id` int(11) NOT NULL,
  `challengerId` varchar(255) NOT NULL,
  `opponentId` varchar(255) DEFAULT NULL,
  `sportId` varchar(255) NOT NULL,
  `facilityId` varchar(255) NOT NULL,
  `facilityName` varchar(255) NOT NULL,
  `proposedDate` datetime NOT NULL,
  `notes` text NOT NULL,
  `status` enum('open','accepted','completed','cancelled') NOT NULL DEFAULT 'open',
  `createdAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `challenges`
--

INSERT INTO `challenges` (`id`, `challengerId`, `opponentId`, `sportId`, `facilityId`, `facilityName`, `proposedDate`, `notes`, `status`, `createdAt`) VALUES
(1, 'user-charlie', NULL, 'sport-tennis', 'facility-pune-02', 'Serve & Volley Pune', '2024-07-05 17:00:00', 'Looking for an intermediate level singles match. Winner buys coffee!', 'open', '2024-06-23 11:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `facilityId` varchar(255) NOT NULL,
  `facilityName` varchar(255) NOT NULL,
  `sportId` varchar(255) NOT NULL,
  `startDate` datetime NOT NULL,
  `endDate` datetime NOT NULL,
  `description` text NOT NULL,
  `entryFee` decimal(10,2) DEFAULT 0.00,
  `maxParticipants` int(11) DEFAULT 0,
  `registeredParticipants` int(11) DEFAULT 0,
  `imageUrl` varchar(255) DEFAULT NULL,
  `imageDataAiHint` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `name`, `facilityId`, `facilityName`, `sportId`, `startDate`, `endDate`, `description`, `entryFee`, `maxParticipants`, `registeredParticipants`, `imageUrl`, `imageDataAiHint`) VALUES
(1, 'Monsoon Football League', 'facility-pune-master', 'Pune Mega Sports Complex', 'sport-football', '2024-07-20 09:00:00', '2024-07-21 18:00:00', 'Gear up for the most exciting 5-a-side football tournament of the season. Cash prizes and trophies to be won!', 5000.00, 16, 5, 'https://picsum.photos/seed/event1/800/400', 'football tournament rain'),
(2, 'Corporate Badminton Championship', 'facility-mumbai-master', 'Mumbai Arena Complex', 'sport-badminton', '2024-08-03 10:00:00', '2024-08-03 17:00:00', 'Battle it out with corporates from across the city. Categories: Men\'s Singles, Women\'s Singles, Mixed Doubles.', 1500.00, 32, 10, 'https://picsum.photos/seed/event2/800/400', 'badminton indoors competition');

-- --------------------------------------------------------

--
-- Table structure for table `facilities`
--

CREATE TABLE `facilities` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` enum('Complex','Court','Field','Studio','Pool','Box Cricket') NOT NULL,
  `address` text NOT NULL,
  `city` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `rating` float DEFAULT 0,
  `capacity` int(11) DEFAULT 0,
  `isPopular` tinyint(1) DEFAULT 0,
  `isIndoor` tinyint(1) DEFAULT 0,
  `imageUrl` text DEFAULT NULL,
  `dataAiHint` varchar(255) DEFAULT NULL,
  `ownerId` varchar(255) DEFAULT NULL,
  `blockedSlots` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `status` enum('Active','PendingApproval','Rejected','Inactive') NOT NULL DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `facilities`
--

INSERT INTO `facilities` (`id`, `name`, `type`, `address`, `city`, `location`, `description`, `rating`, `capacity`, `isPopular`, `isIndoor`, `imageUrl`, `dataAiHint`, `ownerId`, `blockedSlots`, `status`) VALUES
('facility-pune-01', 'Pune Nets Arena', 'Box Cricket', 'Viman Nagar, Pune', 'Pune', 'Viman Nagar', 'State-of-the-art box cricket facility with electronic scoring and night lights.', 4.8, 15, 1, 1, 'https://picsum.photos/seed/facility-pune-01/400/300', 'box cricket night', 'user-bob', '[]', 'Active'),
('facility-pune-02', 'Serve & Volley Pune', 'Court', 'Koregaon Park, Pune', 'Pune', 'Koregaon Park', 'Professional tennis courts with clay and hard surfaces. Coaching available.', 4.5, 4, 0, 0, 'https://picsum.photos/seed/facility-pune-02/400/300', 'tennis court day', 'user-bob', '[]', 'Active'),
('facility-mumbai-02', 'Mumbai Smash Court', 'Court', 'Andheri, Mumbai', 'Mumbai', 'Andheri', 'Premier badminton courts with wooden flooring and excellent lighting.', 4.7, 6, 1, 1, 'https://picsum.photos/seed/facility-mumbai-02/400/300', 'badminton court indoor', NULL, '[]', 'Active'),
('facility-delhi-03', 'Delhi Goals', 'Field', 'Saket, New Delhi', 'Delhi', 'Saket', 'A 5-a-side football turf with premium artificial grass.', 4.6, 20, 1, 0, 'https://picsum.photos/seed/facility-delhi-03/400/300', 'football turf kids', NULL, '[]', 'Active'),
('facility-pune-master', 'Pune Mega Sports Complex', 'Complex', 'Baner, Pune', 'Pune', 'Baner', 'A multi-sport complex offering cricket, football, and swimming facilities.', 4.9, 200, 1, 0, 'https://picsum.photos/seed/facility-pune-master/400/300', 'sports complex aerial', 'user-bob', '[]', 'Active'),
('facility-mumbai-master', 'Mumbai Arena Complex', 'Complex', 'Bandra, Mumbai', 'Mumbai', 'Bandra', 'The biggest sports complex in Mumbai with facilities for all major sports.', 4.8, 500, 1, 1, 'https://picsum.photos/seed/facility-mumbai-master/400/300', 'large stadium indoor', NULL, '[]', 'Active'),
('facility-jaipur-01', 'Pink City Racquets', 'Court', 'C-Scheme, Jaipur', 'Jaipur', 'C-Scheme', 'Centrally located badminton and squash courts.', 4.5, 20, 0, 1, 'https://picsum.photos/seed/facility-jaipur-01/400/300', 'badminton court', NULL, '[]', 'Active'),
('facility-jaipur-master', 'Rajwada Sports Hub', 'Complex', 'Mansarovar, Jaipur', 'Jaipur', 'Mansarovar', 'A modern sports hub with cricket nets, football turf, and a swimming pool.', 4.7, 150, 1, 0, 'https://picsum.photos/seed/facility-jaipur-master/400/300', 'sports complex modern', NULL, '[]', 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `facility_amenities`
--

CREATE TABLE `facility_amenities` (
  `facilityId` varchar(255) NOT NULL,
  `amenityId` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `facility_amenities`
--

INSERT INTO `facility_amenities` (`facilityId`, `amenityId`) VALUES
('facility-pune-01', 'amenity-01'),
('facility-pune-01', 'amenity-08'),
('facility-pune-02', 'amenity-01'),
('facility-pune-02', 'amenity-02'),
('facility-pune-master', 'amenity-01'),
('facility-pune-master', 'amenity-02'),
('facility-pune-master', 'amenity-03'),
('facility-pune-master', 'amenity-06'),
('facility-jaipur-01', 'amenity-01'),
('facility-jaipur-01', 'amenity-02');

-- --------------------------------------------------------

--
-- Table structure for table `facility_operating_hours`
--

CREATE TABLE `facility_operating_hours` (
  `id` int(11) NOT NULL,
  `facilityId` varchar(255) NOT NULL,
  `day` enum('Mon','Tue','Wed','Thu','Fri','Sat','Sun') NOT NULL,
  `open` time NOT NULL,
  `close` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `facility_operating_hours`
--

INSERT INTO `facility_operating_hours` (`id`, `facilityId`, `day`, `open`, `close`) VALUES
(1, 'facility-pune-01', 'Mon', '08:00:00', '23:00:00'),
(2, 'facility-pune-01', 'Tue', '08:00:00', '23:00:00'),
(3, 'facility-pune-01', 'Wed', '08:00:00', '23:00:00'),
(4, 'facility-pune-01', 'Thu', '08:00:00', '23:00:00'),
(5, 'facility-pune-01', 'Fri', '08:00:00', '23:59:00'),
(6, 'facility-pune-01', 'Sat', '07:00:00', '23:59:00'),
(7, 'facility-pune-01', 'Sun', '07:00:00', '23:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `facility_sports`
--

CREATE TABLE `facility_sports` (
  `facilityId` varchar(255) NOT NULL,
  `sportId` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `facility_sports`
--

INSERT INTO `facility_sports` (`facilityId`, `sportId`) VALUES
('facility-pune-01', 'sport-cricket'),
('facility-pune-02', 'sport-tennis'),
('facility-pune-master', 'sport-cricket'),
('facility-pune-master', 'sport-football'),
('facility-pune-master', 'sport-swimming'),
('facility-mumbai-02', 'sport-badminton'),
('facility-delhi-03', 'sport-football'),
('facility-mumbai-master', 'sport-badminton'),
('facility-mumbai-master', 'sport-basketball'),
('facility-jaipur-01', 'sport-badminton'),
('facility-jaipur-01', 'sport-squash'),
('facility-jaipur-master', 'sport-cricket'),
('facility-jaipur-master', 'sport-football');

-- --------------------------------------------------------

--
-- Table structure for table `facility_sport_prices`
--

CREATE TABLE `facility_sport_prices` (
  `id` int(11) NOT NULL,
  `facilityId` varchar(255) NOT NULL,
  `sportId` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `pricingModel` enum('per_hour_flat','per_hour_per_person') NOT NULL DEFAULT 'per_hour_flat'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `facility_sport_prices`
--

INSERT INTO `facility_sport_prices` (`id`, `facilityId`, `sportId`, `price`, `pricingModel`) VALUES
(1, 'facility-pune-01', 'sport-cricket', 1500.00, 'per_hour_flat'),
(2, 'facility-pune-02', 'sport-tennis', 800.00, 'per_hour_flat'),
(3, 'facility-mumbai-02', 'sport-badminton', 1200.00, 'per_hour_flat'),
(4, 'facility-delhi-03', 'sport-football', 2500.00, 'per_hour_flat'),
(5, 'facility-pune-master', 'sport-cricket', 1800.00, 'per_hour_flat'),
(6, 'facility-pune-master', 'sport-football', 3000.00, 'per_hour_flat'),
(7, 'facility-pune-master', 'sport-swimming', 300.00, 'per_hour_per_person'),
(8, 'facility-jaipur-01', 'sport-badminton', 600.00, 'per_hour_flat');

-- --------------------------------------------------------

--
-- Table structure for table `lfg_requests`
--

CREATE TABLE `lfg_requests` (
  `id` int(11) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `sportId` varchar(255) NOT NULL,
  `facilityId` varchar(255) NOT NULL,
  `facilityName` varchar(255) NOT NULL,
  `notes` text NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `status` enum('open','closed') NOT NULL DEFAULT 'open',
  `interestedUserIds` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `skillLevel` enum('Any','Beginner','Intermediate','Advanced') DEFAULT 'Any',
  `playersNeeded` int(11) DEFAULT NULL,
  `preferredTime` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lfg_requests`
--

INSERT INTO `lfg_requests` (`id`, `userId`, `sportId`, `facilityId`, `facilityName`, `notes`, `createdAt`, `status`, `interestedUserIds`, `skillLevel`, `playersNeeded`, `preferredTime`) VALUES
(1, 'user-diana', 'sport-cricket', 'facility-pune-01', 'Pune Nets Arena', 'Need 4 players for a friendly box cricket match this Saturday evening.', '2024-06-24 12:00:00', 'open', '[\"user-charlie\"]', 'Intermediate', 4, 'Saturday Evening');

-- --------------------------------------------------------

--
-- Table structure for table `membership_plans`
--

CREATE TABLE `membership_plans` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `pricePerMonth` decimal(10,2) NOT NULL,
  `benefits` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `membership_plans`
--

INSERT INTO `membership_plans` (`id`, `name`, `pricePerMonth`, `benefits`) VALUES
(1, 'Basic', 0.00, '[\"Access to book all facilities\",\"Standard pricing\",\"Basic support\"]'),
(2, 'Premium', 999.00, '[\"15% off on all bookings\",\"Free equipment rentals\",\"Priority booking slots\",\"Advanced support\"]'),
(3, 'Pro', 2499.00, '[\"25% off on all bookings\",\"Free equipment rentals\",\"2 free bookings per month\",\"Dedicated support manager\"]');

-- --------------------------------------------------------

--
-- Table structure for table `owner_verification_requests`
--

CREATE TABLE `owner_verification_requests` (
  `id` int(11) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `fullName` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `idNumber` varchar(50) NOT NULL,
  `facilityName` varchar(255) NOT NULL,
  `facilityAddress` text NOT NULL,
  `identityProofPath` varchar(255) NOT NULL,
  `addressProofPath` varchar(255) NOT NULL,
  `ownershipProofPath` varchar(255) NOT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `createdAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pricing_rules`
--

CREATE TABLE `pricing_rules` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `adjustmentType` enum('percentage_increase','percentage_decrease','fixed_increase','fixed_decrease','fixed_price') NOT NULL,
  `value` decimal(10,2) NOT NULL,
  `priority` int(11) DEFAULT NULL,
  `daysOfWeek` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `timeRange` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `dateRange` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `facilityIds` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pricing_rules`
--

INSERT INTO `pricing_rules` (`id`, `name`, `description`, `isActive`, `adjustmentType`, `value`, `priority`, `daysOfWeek`, `timeRange`, `dateRange`, `facilityIds`) VALUES
(1, 'Weekend Evening Surge', '20% price increase for weekend evenings.', 1, 'percentage_increase', 20.00, 10, '[\"Sat\",\"Sun\"]', '{\"start\":\"17:00\",\"end\":\"22:00\"}', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `promotion_rules`
--

CREATE TABLE `promotion_rules` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `discountType` enum('percentage','fixed_amount') NOT NULL,
  `discountValue` decimal(10,2) NOT NULL,
  `startDate` date DEFAULT NULL,
  `endDate` date DEFAULT NULL,
  `usageLimit` int(11) DEFAULT NULL,
  `usageLimitPerUser` int(11) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `promotion_rules`
--

INSERT INTO `promotion_rules` (`id`, `name`, `description`, `code`, `discountType`, `discountValue`, `startDate`, `endDate`, `usageLimit`, `usageLimitPerUser`, `isActive`) VALUES
(1, 'First Booking Discount', '15% off on the first booking for new users.', 'FIRST15', 'percentage', 15.00, NULL, NULL, 1, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `facilityId` varchar(255) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `userName` varchar(255) NOT NULL,
  `userAvatar` varchar(255) DEFAULT NULL,
  `isPublicProfile` tinyint(1) DEFAULT 0,
  `rating` float NOT NULL,
  `comment` text NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `bookingId` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `facilityId`, `userId`, `userName`, `userAvatar`, `isPublicProfile`, `rating`, `comment`, `createdAt`, `bookingId`) VALUES
(1, 'facility-pune-01', 'user-charlie', 'Charlie Davis', 'https://randomuser.me/api/portraits/men/11.jpg', 1, 5, 'Amazing facility! The lighting for night games is top-notch. Well maintained turf. Will definitely book again.', '2024-06-26 10:00:00', '1');

-- --------------------------------------------------------

--
-- Table structure for table `sports`
--

CREATE TABLE `sports` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `iconName` varchar(255) DEFAULT NULL,
  `imageUrl` varchar(255) DEFAULT NULL,
  `imageDataAiHint` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sports`
--

INSERT INTO `sports` (`id`, `name`, `iconName`, `imageUrl`, `imageDataAiHint`) VALUES
('sport-badminton', 'Badminton', 'Feather', 'https://picsum.photos/seed/badminton/400/300', 'badminton court shuttlecock'),
('sport-basketball', 'Basketball', 'Dribbble', 'https://picsum.photos/seed/basketball/400/300', 'basketball court hoop'),
('sport-cricket', 'Cricket', 'Cricket', 'https://picsum.photos/seed/cricket/400/300', 'cricket pitch stumps'),
('sport-football', 'Football', 'Goal', 'https://picsum.photos/seed/football/400/300', 'football stadium grass'),
('sport-swimming', 'Swimming', 'Waves', 'https://picsum.photos/seed/swimming/400/300', 'swimming pool water'),
('sport-squash', 'Squash', 'RectangleHorizontal', 'https://picsum.photos/seed/squash/400/300', 'squash court indoor'),
('sport-tennis', 'Tennis', 'TennisBall', 'https://picsum.photos/seed/tennis/400/300', 'tennis court net');

-- --------------------------------------------------------

--
-- Table structure for table `teams`
--

CREATE TABLE `teams` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `sportId` varchar(255) NOT NULL,
  `captainId` varchar(255) NOT NULL,
  `memberIds` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teams`
--

INSERT INTO `teams` (`id`, `name`, `sportId`, `captainId`, `memberIds`) VALUES
(1, 'Pune Strikers', 'sport-cricket', 'user-charlie', '[\"user-charlie\",\"user-diana\"]');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `profilePictureUrl` varchar(255) DEFAULT NULL,
  `preferredSports` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `favoriteFacilities` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `membershipLevel` enum('Basic','Premium','Pro') DEFAULT 'Basic',
  `loyaltyPoints` int(11) DEFAULT 0,
  `achievements` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `preferredPlayingTimes` varchar(255) DEFAULT NULL,
  `skillLevels` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `role` enum('Admin','FacilityOwner','User') NOT NULL DEFAULT 'User',
  `status` enum('Active','Suspended','PendingApproval') NOT NULL DEFAULT 'Active',
  `joinedAt` datetime NOT NULL,
  `teamIds` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `isProfilePublic` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `profilePictureUrl`, `preferredSports`, `favoriteFacilities`, `membershipLevel`, `loyaltyPoints`, `achievements`, `bio`, `preferredPlayingTimes`, `skillLevels`, `role`, `status`, `joinedAt`, `teamIds`, `isProfilePublic`) VALUES
('user-alice', 'Alice Johnson', 'alice@example.com', 'password123', '9876543210', 'https://randomuser.me/api/portraits/women/1.jpg', NULL, '[\"facility-pune-01\"]', 'Basic', 120, '[{\"id\": \"ach-1\", \"name\": \"First Booking\", \"description\": \"Completed your first booking.\", \"iconName\": \"Gift\", \"unlockedAt\": \"2024-06-20T10:00:00Z\"}]', 'Admin user with full access.', 'Weekends', NULL, 'Admin', 'Active', '2024-01-01 10:00:00', NULL, 1),
('user-bob', 'Bob Williams', 'bob@example.com', 'password123', '9876543211', 'https://randomuser.me/api/portraits/men/2.jpg', NULL, '[]', 'Premium', 500, '[]', 'Proud owner of multiple sports venues.', 'Anytime', NULL, 'FacilityOwner', 'Active', '2024-01-15 11:00:00', NULL, 1),
('user-charlie', 'Charlie Davis', 'charlie@example.com', 'password123', '9876543212', 'https://randomuser.me/api/portraits/men/11.jpg', NULL, '[]', 'Basic', 50, '[{\"id\": \"ach-1\", \"name\": \"First Booking\", \"description\": \"Completed your first booking.\", \"iconName\": \"Gift\", \"unlockedAt\": \"2024-06-20T10:00:00Z\"}]', 'Cricket enthusiast, always ready for a game!', 'Weekend Evenings', '[{\"sportId\": \"sport-cricket\", \"sportName\": \"Cricket\", \"level\": \"Intermediate\"}]', 'User', 'Active', '2024-02-20 12:00:00', NULL, 1),
('user-diana', 'Diana Miller', 'diana@example.com', 'password123', '9876543213', 'https://randomuser.me/api/portraits/women/22.jpg', NULL, '[]', 'Premium', 250, '[]', 'Badminton player, looking for competitive matches.', NULL, '[{\"sportId\": \"sport-badminton\", \"sportName\": \"Badminton\", \"level\": \"Advanced\"}]', 'User', 'Active', '2024-03-10 13:00:00', NULL, 1);


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
  ADD KEY `facilityId` (`facilityId`),
  ADD KEY `sportId` (`sportId`);

--
-- Indexes for table `challenges`
--
ALTER TABLE `challenges`
  ADD PRIMARY KEY (`id`),
  ADD KEY `challengerId` (`challengerId`),
  ADD KEY `opponentId` (`opponentId`),
  ADD KEY `sportId` (`sportId`),
  ADD KEY `facilityId` (`facilityId`);

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
  ADD PRIMARY KEY (`id`),
  ADD KEY `facilityId` (`facilityId`);

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
  ADD PRIMARY KEY (`id`),
  ADD KEY `facilityId` (`facilityId`),
  ADD KEY `sportId` (`sportId`);

--
-- Indexes for table `lfg_requests`
--
ALTER TABLE `lfg_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `sportId` (`sportId`),
  ADD KEY `facilityId` (`facilityId`);

--
-- Indexes for table `membership_plans`
--
ALTER TABLE `membership_plans`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `owner_verification_requests`
--
ALTER TABLE `owner_verification_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

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
  ADD KEY `sportId` (`sportId`),
  ADD KEY `captainId` (`captainId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `challenges`
--
ALTER TABLE `challenges`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `facility_operating_hours`
--
ALTER TABLE `facility_operating_hours`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `facility_sport_prices`
--
ALTER TABLE `facility_sport_prices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `lfg_requests`
--
ALTER TABLE `lfg_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `membership_plans`
--
ALTER TABLE `membership_plans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `owner_verification_requests`
--
ALTER TABLE `owner_verification_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pricing_rules`
--
ALTER TABLE `pricing_rules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `promotion_rules`
--
ALTER TABLE `promotion_rules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `teams`
--
ALTER TABLE `teams`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`facilityId`) REFERENCES `facilities` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `challenges`
--
ALTER TABLE `challenges`
  ADD CONSTRAINT `challenges_ibfk_1` FOREIGN KEY (`challengerId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `challenges_ibfk_2` FOREIGN KEY (`opponentId`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `challenges_ibfk_3` FOREIGN KEY (`facilityId`) REFERENCES `facilities` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`facilityId`) REFERENCES `facilities` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `facilities`
--
ALTER TABLE `facilities`
  ADD CONSTRAINT `facilities_ibfk_1` FOREIGN KEY (`ownerId`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `facility_amenities`
--
ALTER TABLE `facility_amenities`
  ADD CONSTRAINT `facility_amenities_ibfk_1` FOREIGN KEY (`facilityId`) REFERENCES `facilities` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `facility_amenities_ibfk_2` FOREIGN KEY (`amenityId`) REFERENCES `amenities` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `facility_operating_hours`
--
ALTER TABLE `facility_operating_hours`
  ADD CONSTRAINT `facility_operating_hours_ibfk_1` FOREIGN KEY (`facilityId`) REFERENCES `facilities` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `facility_sports`
--
ALTER TABLE `facility_sports`
  ADD CONSTRAINT `facility_sports_ibfk_1` FOREIGN KEY (`facilityId`) REFERENCES `facilities` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `facility_sports_ibfk_2` FOREIGN KEY (`sportId`) REFERENCES `sports` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `facility_sport_prices`
--
ALTER TABLE `facility_sport_prices`
  ADD CONSTRAINT `facility_sport_prices_ibfk_1` FOREIGN KEY (`facilityId`) REFERENCES `facilities` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `facility_sport_prices_ibfk_2` FOREIGN KEY (`sportId`) REFERENCES `sports` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `lfg_requests`
--
ALTER TABLE `lfg_requests`
  ADD CONSTRAINT `lfg_requests_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `lfg_requests_ibfk_2` FOREIGN KEY (`facilityId`) REFERENCES `facilities` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `owner_verification_requests`
--
ALTER TABLE `owner_verification_requests`
  ADD CONSTRAINT `owner_verification_requests_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`facilityId`) REFERENCES `facilities` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `teams`
--
ALTER TABLE `teams`
  ADD CONSTRAINT `teams_ibfk_1` FOREIGN KEY (`sportId`) REFERENCES `sports` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `teams_ibfk_2` FOREIGN KEY (`captainId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

