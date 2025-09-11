--
-- Database: `sports_arena`
--
DROP DATABASE IF EXISTS `sports_arena`;
CREATE DATABASE `sports_arena`;
USE `sports_arena`;

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
('amenity-1', 'Parking', 'ParkingCircle'),
('amenity-2', 'Locker Room', 'Lock'),
('amenity-3', 'Showers', 'ShowerHead'),
('amenity-4', 'Wi-Fi', 'Wifi'),
('amenity-5', 'First Aid', 'Feather'),
('amenity-6', 'Refreshments', 'Utensils'),
('amenity-7', 'Equipment Rental', 'PackageSearch'),
('amenity-8', 'Floodlights', 'Lightbulb');

-- --------------------------------------------------------

--
-- Table structure for table `blog_posts`
--

CREATE TABLE `blog_posts` (
  `id` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `excerpt` text NOT NULL,
  `content` longtext NOT NULL,
  `authorName` varchar(255) NOT NULL,
  `authorAvatarUrl` varchar(255) DEFAULT NULL,
  `publishedAt` varchar(255) NOT NULL,
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tags`)),
  `isFeatured` tinyint(1) DEFAULT 0,
  `dataAiHint` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blog_posts`
--

INSERT INTO `blog_posts` (`id`, `slug`, `title`, `excerpt`, `content`, `authorName`, `authorAvatarUrl`, `publishedAt`, `tags`, `isFeatured`, `dataAiHint`) VALUES
('blog-1', 'improve-your-cricket-batting', '5 Drills to Drastically Improve Your Cricket Batting', 'Whether you\'re a beginner or a seasoned player, these five drills will help you sharpen your batting skills, improve your timing, and score more runs.', '<h2>Introduction</h2><p>Mastering the art of batting in cricket requires dedication, practice, and the right drills. Here are five essential drills you can incorporate into your practice sessions to see a significant improvement in your game.</p><h3>1. The Hanging Ball Drill</h3><p>This classic drill is perfect for improving hand-eye coordination and timing. Hang a cricket ball from a rope at stump height and practice hitting it with a full swing. Focus on connecting with the middle of the bat every time.</p><h3>2. Shadow Batting</h3><p>Visualize a bowler running in and practice your full range of shots without a ball. This helps in muscle memory and perfecting your form for drives, cuts, and pulls. Do this in front of a mirror to check your technique.</p><h3>3. Net Practice with a Partner</h3><p>There\'s no substitute for facing a real bowler. Practice against different types of bowling—fast, spin, and swing—to improve your adaptability at the crease.</p><h3>4. Target Hitting</h3><p>Place cones or markers in different parts of the field and try to hit the ball in those specific areas. This drill is excellent for improving your placement and finding gaps in the field.</p><h3>5. One-Bounce Catching</h3><p>Improve your reflexes and defensive shots by having a partner throw the ball at you from a short distance. Your goal is to play it back with soft hands so it bounces just once before reaching them.</p><h2>Conclusion</h2><p>Consistency is key. Regularly practicing these drills will not only improve your technical skills but also boost your confidence on the field. Now, grab your bat and get to work!</p>', 'Rohan Sharma', 'https://i.pravatar.cc/150?img=12', '2024-06-15T10:00:00Z', '[\"Cricket\", \"Batting\", \"Drills\", \"Training\"]', 1, 'cricket training'),
('blog-2', 'choosing-the-right-football-boots', 'How to Choose the Right Football Boots for Your Playing Style', 'The right pair of football boots can make a huge difference to your game. Learn what to look for based on your position, playing surface, and personal style.', '<p>From firm ground to artificial turf, and from strikers to defenders, your choice of football boots matters. This guide breaks down the key factors to consider before you make your next purchase, including material, stud pattern, and fit.</p>', 'Priya Singh', 'https://i.pravatar.cc/150?img=5', '2024-06-20T12:00:00Z', '[\"Football\", \"Gear\", \"Boots\", \"Tips\"]', 0, 'football boots');

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` varchar(255) NOT NULL,
  `userId` varchar(255) DEFAULT NULL,
  `facilityId` varchar(255) NOT NULL,
  `facilityName` varchar(255) NOT NULL,
  `sportId` varchar(255) NOT NULL,
  `sportName` varchar(255) NOT NULL,
  `date` varchar(255) NOT NULL,
  `startTime` varchar(255) NOT NULL,
  `endTime` varchar(255) NOT NULL,
  `durationHours` int(11) DEFAULT 1,
  `numberOfGuests` int(11) DEFAULT NULL,
  `baseFacilityPrice` decimal(10,2) NOT NULL,
  `equipmentRentalCost` decimal(10,2) NOT NULL DEFAULT 0.00,
  `appliedPromotion` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`appliedPromotion`)),
  `totalPrice` decimal(10,2) NOT NULL,
  `status` varchar(255) NOT NULL,
  `bookedAt` varchar(255) NOT NULL,
  `reviewed` tinyint(1) NOT NULL,
  `rentedEquipment` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`rentedEquipment`)),
  `phoneNumber` varchar(255) DEFAULT NULL,
  `pricingModel` varchar(255) DEFAULT 'per_hour_flat'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `userId`, `facilityId`, `facilityName`, `sportId`, `sportName`, `date`, `startTime`, `endTime`, `durationHours`, `numberOfGuests`, `baseFacilityPrice`, `equipmentRentalCost`, `appliedPromotion`, `totalPrice`, `status`, `bookedAt`, `reviewed`, `rentedEquipment`, `phoneNumber`, `pricingModel`) VALUES
('booking-1', 'user-charlie', 'facility-pune-1', 'Deccan Gymkhana Club', 'sport-tennis', 'Tennis', '2024-07-25', '18:00', '19:00', 1, NULL, 1200.00, 0.00, NULL, 1200.00, 'Confirmed', '2024-07-20T10:00:00Z', 0, NULL, '9876543210', 'per_hour_flat'),
('booking-2', 'user-dave', 'facility-mumbai-2', 'Andheri Sports Complex', 'sport-football', 'Football', '2024-07-26', '19:00', '20:00', 1, NULL, 3000.00, 0.00, NULL, 3000.00, 'Confirmed', '2024-07-21T11:30:00Z', 0, NULL, '9876543211', 'per_hour_flat');

-- --------------------------------------------------------

--
-- Table structure for table `challenges`
--

CREATE TABLE `challenges` (
  `id` varchar(255) NOT NULL,
  `challengerId` varchar(255) NOT NULL,
  `opponentId` varchar(255) DEFAULT NULL,
  `sportId` varchar(255) NOT NULL,
  `facilityId` varchar(255) NOT NULL,
  `facilityName` varchar(255) NOT NULL,
  `proposedDate` varchar(255) NOT NULL,
  `notes` text NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'open',
  `createdAt` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `challenges`
--

INSERT INTO `challenges` (`id`, `challengerId`, `opponentId`, `sportId`, `facilityId`, `facilityName`, `proposedDate`, `notes`, `status`, `createdAt`) VALUES
('challenge-1', 'user-charlie', NULL, 'sport-tennis', 'facility-pune-1', 'Deccan Gymkhana Club', '2024-08-01T18:00:00Z', 'Looking for a competitive singles match. Winner buys coffee!', 'open', '2024-07-25T14:00:00Z');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `facilityId` varchar(255) NOT NULL,
  `facilityName` varchar(255) DEFAULT NULL,
  `sportId` varchar(255) NOT NULL,
  `startDate` varchar(255) NOT NULL,
  `endDate` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `entryFee` decimal(10,2) DEFAULT 0.00,
  `maxParticipants` int(11) DEFAULT 0,
  `registeredParticipants` int(11) NOT NULL DEFAULT 0,
  `imageUrl` varchar(255) DEFAULT NULL,
  `imageDataAiHint` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `name`, `facilityId`, `facilityName`, `sportId`, `startDate`, `endDate`, `description`, `entryFee`, `maxParticipants`, `registeredParticipants`, `imageUrl`, `imageDataAiHint`) VALUES
('event-1', 'Pune Monsoon Football League', 'facility-pune-master', 'Shree Shiv Chhatrapati Sports Complex', 'sport-football', '2024-08-10T09:00:00Z', '2024-08-11T18:00:00Z', 'Join the most exciting 5-a-side football tournament of the season. Cash prizes and trophies to be won!', 5000.00, 16, 8, 'https://picsum.photos/seed/event1/600/400', 'football tournament');

-- --------------------------------------------------------

--
-- Table structure for table `facilities`
--

CREATE TABLE `facilities` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `address` text NOT NULL,
  `city` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `rating` decimal(3,2) NOT NULL DEFAULT 0.00,
  `capacity` int(11) DEFAULT 0,
  `isPopular` tinyint(1) DEFAULT 0,
  `isIndoor` tinyint(1) DEFAULT 0,
  `dataAiHint` varchar(255) DEFAULT NULL,
  `ownerId` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `facilities`
--

INSERT INTO `facilities` (`id`, `name`, `type`, `address`, `city`, `location`, `description`, `rating`, `capacity`, `isPopular`, `isIndoor`, `dataAiHint`, `ownerId`, `status`) VALUES
-- Pune
('facility-pune-master', 'Shree Shiv Chhatrapati Sports Complex', 'Complex', 'Mahalunge, Balewadi, Pune, Maharashtra 411045', 'Pune', 'Balewadi', 'A world-class multi-sport complex, host to national and international events. Features top-tier facilities for almost every sport.', 4.80, 5000, 1, 1, 'large sports complex', 'user-bob', 'Active'),
('facility-pune-1', 'Deccan Gymkhana Club', 'Court', 'Deccan Gymkhana, Pune, Maharashtra 411004', 'Pune', 'Deccan Gymkhana', 'A prestigious club with well-maintained tennis and badminton courts.', 4.60, 200, 1, 0, 'tennis club', 'user-bob', 'Active'),
('facility-pune-2', 'Hotfut Football', 'Field', 'Koregaon Park, Pune, Maharashtra 411001', 'Pune', 'Koregaon Park', 'State-of-the-art rooftop football turf with excellent lighting.', 4.70, 50, 1, 0, 'rooftop football', NULL, 'Active'),
('facility-pune-3', 'TheBox', 'Box Cricket', 'Kharadi, Pune, Maharashtra 411014', 'Pune', 'Kharadi', 'A dedicated box cricket arena perfect for corporate and friendly matches.', 4.50, 30, 0, 1, 'box cricket', NULL, 'Active'),
('facility-pune-4', 'Woodland Badminton', 'Court', 'Hinjewadi, Pune, Maharashtra 411057', 'Pune', 'Hinjewadi', 'Professional wooden badminton courts for serious players.', 4.40, 40, 0, 1, 'badminton court', NULL, 'Active'),
('facility-pune-5', 'Champion Swimming Pool', 'Pool', 'Aundh, Pune, Maharashtra 411007', 'Pune', 'Aundh', 'A clean, well-maintained swimming pool for recreational and competitive swimming.', 4.30, 60, 0, 0, 'swimming pool', NULL, 'Active'),
-- Mumbai
('facility-mumbai-master', 'Priyadarshini Park and Sports Complex', 'Complex', 'Napean Sea Rd, Malabar Hill, Mumbai, Maharashtra 400006', 'Mumbai', 'Malabar Hill', 'A sprawling complex by the sea, offering a variety of sports facilities including athletics, football, and tennis.', 4.70, 3000, 1, 0, 'seaside sports park', NULL, 'Active'),
('facility-mumbai-1', 'Dadar Club', 'Court', 'Dadar East, Mumbai, Maharashtra 400014', 'Mumbai', 'Dadar', 'Historic club with excellent tennis courts and a swimming pool.', 4.50, 250, 0, 0, 'tennis club courts', NULL, 'Active'),
('facility-mumbai-2', 'Andheri Sports Complex', 'Complex', 'Veera Desai Rd, Andheri West, Mumbai, Maharashtra 400058', 'Mumbai', 'Andheri West', 'A major sports hub in the suburbs, known for its football stadium and indoor facilities.', 4.40, 8000, 1, 1, 'football stadium night', NULL, 'Active'),
('facility-mumbai-3', 'Turf 5', 'Field', 'Juhu, Mumbai, Maharashtra 400049', 'Mumbai', 'Juhu', 'Popular 5-a-side football turf with a great vibe.', 4.60, 40, 1, 0, 'football turf friends', NULL, 'Active'),
('facility-mumbai-4', 'Matunga Gymkhana', 'Court', 'Matunga, Mumbai, Maharashtra 400019', 'Mumbai', 'Matunga', 'Renowned for its top-quality badminton and tennis courts.', 4.50, 150, 0, 1, 'badminton hall', NULL, 'Active'),
('facility-mumbai-5', 'Khar Gymkhana', 'Pool', 'Khar West, Mumbai, Maharashtra 400052', 'Mumbai', 'Khar', 'Features a large, Olympic-size swimming pool and other sports facilities.', 4.60, 300, 0, 0, 'olympic swimming pool', NULL, 'Active'),
-- Delhi
('facility-delhi-master', 'Jawaharlal Nehru Stadium', 'Complex', 'Pragati Vihar, New Delhi, Delhi 110003', 'Delhi', 'Lodhi Road', 'An iconic multi-purpose stadium in the heart of Delhi, primarily used for football and athletics.', 4.50, 60000, 1, 0, 'large stadium athletics', NULL, 'Active'),
('facility-delhi-1', 'Siri Fort Sports Complex', 'Complex', 'August Kranti Marg, New Delhi, Delhi 110049', 'Delhi', 'Siri Fort', 'A DDA sports complex with facilities for tennis, badminton, squash, and more.', 4.40, 1000, 1, 1, 'tennis complex', NULL, 'Active'),
('facility-delhi-2', 'The T-Zone', 'Field', 'Chattarpur, New Delhi, Delhi 110074', 'Delhi', 'Chattarpur', 'High-quality football turfs with a professional setup.', 4.70, 100, 0, 0, 'football field match', NULL, 'Active'),
('facility-delhi-3', 'Play All', 'Box Cricket', 'Rohini, New Delhi, Delhi 110085', 'Delhi', 'Rohini', 'Modern box cricket setup, ideal for evening games with friends.', 4.60, 50, 0, 1, 'night box cricket', NULL, 'Active'),
('facility-delhi-4', 'Flow Sports Life', 'Court', 'Vasant Kunj, New Delhi, Delhi 110070', 'Delhi', 'Vasant Kunj', 'Premium indoor badminton courts with excellent amenities.', 4.80, 60, 1, 1, 'modern badminton court', NULL, 'Active'),
('facility-delhi-5', 'Pacific Sports Complex', 'Pool', 'Greater Kailash, New Delhi, Delhi 110048', 'Delhi', 'Greater Kailash', 'A well-maintained indoor swimming pool, open to members and non-members.', 4.30, 80, 0, 1, 'indoor swimming pool', NULL, 'Active'),
-- Bengaluru
('facility-bengaluru-master', 'Kanteerava Indoor Stadium', 'Complex', 'Kasturba Road, Bengaluru, Karnataka 560001', 'Bengaluru', 'Cubbon Park', 'A massive indoor stadium in the city center, hosting major basketball and badminton events.', 4.60, 4000, 1, 1, 'indoor stadium basketball', NULL, 'Active'),
('facility-bengaluru-1', 'Karnataka State Lawn Tennis Association (KSLTA)', 'Court', 'Cubbon Park, Bengaluru, Karnataka 560001', 'Bengaluru', 'Cubbon Park', 'The premier destination for tennis in Bengaluru, with numerous clay and hard courts.', 4.70, 500, 1, 0, 'tennis court clay', NULL, 'Active'),
('facility-bengaluru-2', 'Tiento', 'Field', 'Sarjapur Road, Bengaluru, Karnataka 560035', 'Bengaluru', 'Sarjapur Road', 'A popular chain of football turfs with a great community and regular tournaments.', 4.50, 100, 1, 0, 'football action', NULL, 'Active'),
('facility-bengaluru-3', 'Play Arena', 'Complex', 'Sarjapur Road, Bengaluru, Karnataka 560035', 'Bengaluru', 'Sarjapur Road', 'A multi-sport destination with box cricket, football, and other activities.', 4.40, 300, 0, 0, 'sports complex various', NULL, 'Active'),
('facility-bengaluru-4', 'Namma Shuttle', 'Court', 'HSR Layout, Bengaluru, Karnataka 560102', 'Bengaluru', 'HSR Layout', 'High-quality badminton courts catering to the tech crowd in HSR.', 4.60, 80, 0, 1, 'badminton players', NULL, 'Active'),
('facility-bengaluru-5', 'Nisha Millets Swimming Academy', 'Pool', 'Koramangala, Bengaluru, Karnataka 560095', 'Bengaluru', 'Koramangala', 'One of the most famous swimming academies in India, with excellent pools.', 4.80, 200, 1, 0, 'professional swimming', NULL, 'Active'),
-- Chennai
('facility-chennai-master', 'Jawaharlal Nehru Stadium, Chennai', 'Complex', 'Sydenhams Road, Periyamet, Chennai, Tamil Nadu 600003', 'Chennai', 'Periyamet', 'A major stadium in Chennai, equipped for football, athletics, and various indoor sports.', 4.40, 40000, 1, 0, 'stadium panorama', NULL, 'Active'),
('facility-chennai-1', 'SDAT Tennis Stadium', 'Court', 'Nungambakkam, Chennai, Tamil Nadu 600034', 'Chennai', 'Nungambakkam', 'Host of the Chennai Open, this facility offers world-class tennis courts.', 4.60, 5000, 1, 0, 'professional tennis court', NULL, 'Active'),
('facility-chennai-2', 'Tiki Taka', 'Field', 'Kilpauk, Chennai, Tamil Nadu 600010', 'Chennai', 'Kilpauk', 'A leading provider of 5-a-side and 7-a-side football turfs in Chennai.', 4.50, 80, 1, 0, 'football game friends', NULL, 'Active'),
('facility-chennai-3', 'Dugout', 'Box Cricket', 'Anna Nagar, Chennai, Tamil Nadu 600040', 'Chennai', 'Anna Nagar', 'Well-lit box cricket facility perfect for late-night matches.', 4.40, 40, 0, 1, 'box cricket night', NULL, 'Active'),
('facility-chennai-4', 'Smash Sportz', 'Court', 'OMR, Chennai, Tamil Nadu 600119', 'Chennai', 'OMR', 'Modern badminton academy with synthetic courts and professional coaching.', 4.70, 70, 0, 1, 'badminton action', NULL, 'Active'),
('facility-chennai-5', 'Anna Swimming Pool', 'Pool', 'Marina Beach Road, Chennai, Tamil Nadu 600005', 'Chennai', 'Marina Beach', 'An iconic public swimming pool located right next to Marina Beach.', 4.20, 200, 0, 0, 'beachside swimming pool', NULL, 'Active'),
-- Kolkata
('facility-kolkata-master', 'Salt Lake Stadium (Vivekananda Yuba Bharati Krirangan)', 'Complex', 'JB Block, Sector III, Bidhannagar, Kolkata, West Bengal 700098', 'Kolkata', 'Salt Lake', 'One of the largest stadiums in the world, the heart of Indian football.', 4.60, 85000, 1, 0, 'huge football stadium', NULL, 'Active'),
('facility-kolkata-1', 'The Bengal Tennis Association Complex', 'Court', 'Salt Lake, Kolkata, West Bengal 700098', 'Kolkata', 'Salt Lake', 'Premier tennis facility in Kolkata with numerous courts and coaching programs.', 4.50, 400, 0, 0, 'tennis match action', NULL, 'Active'),
('facility-kolkata-2', 'NKDA Football Stadium', 'Field', 'New Town, Kolkata, West Bengal 700156', 'Kolkata', 'New Town', 'A modern football ground with artificial turf, popular among local leagues.', 4.40, 500, 1, 0, 'football field day', NULL, 'Active'),
('facility-kolkata-3', 'Sportiz', 'Box Cricket', 'New Town, Kolkata, West Bengal 700156', 'Kolkata', 'New Town', 'Rooftop box cricket arena with a great view of the city.', 4.60, 50, 0, 1, 'rooftop cricket city', NULL, 'Active'),
('facility-kolkata-4', 'P. V. Badminton Academy', 'Court', 'Ballygunge, Kolkata, West Bengal 700019', 'Kolkata', 'Ballygunge', 'Indoor badminton courts with professional-grade flooring and lighting.', 4.70, 60, 0, 1, 'badminton players training', NULL, 'Active'),
('facility-kolkata-5', 'College Square Swimming Pool', 'Pool', 'College Street, Kolkata, West Bengal 700073', 'Kolkata', 'College Street', 'A historic and centrally located swimming club in Kolkata.', 4.30, 150, 0, 0, 'historic swimming pool', NULL, 'Active'),
-- Hyderabad
('facility-hyderabad-master', 'G. M. C. Balayogi Athletic Stadium', 'Complex', 'Gachibowli, Hyderabad, Telangana 500032', 'Hyderabad', 'Gachibowli', 'A modern multi-purpose stadium, primarily used for football, located in the IT hub.', 4.50, 30000, 1, 0, 'modern athletics stadium', NULL, 'Active'),
('facility-hyderabad-1', 'Lal Bahadur Shastri Stadium', 'Complex', 'Fateh Maidan, Hyderabad, Telangana 500001', 'Hyderabad', 'Basheerbagh', 'A historic ground in the city, famous for hosting international cricket matches.', 4.40, 25000, 0, 0, 'cricket stadium india', NULL, 'Active'),
('facility-hyderabad-2', 'Hotfut', 'Field', 'Gachibowli, Hyderabad, Telangana 500032', 'Hyderabad', 'Gachibowli', 'Popular football facility with multiple turfs for 5-a-side games.', 4.60, 100, 1, 0, 'friends playing football', NULL, 'Active'),
('facility-hyderabad-3', 'Go All-Out', 'Box Cricket', 'Jubilee Hills, Hyderabad, Telangana 500033', 'Hyderabad', 'Jubilee Hills', 'A premium box cricket facility in a prime location.', 4.70, 40, 0, 1, 'box cricket game', NULL, 'Active'),
('facility-hyderabad-4', 'Pullela Gopichand Badminton Academy', 'Court', 'Gachibowli, Hyderabad, Telangana 500032', 'Hyderabad', 'Gachibowli', 'A world-renowned badminton academy that has produced numerous champions.', 4.90, 200, 1, 1, 'professional badminton academy', NULL, 'Active'),
('facility-hyderabad-5', 'GHMC Swimming Pool', 'Pool', 'Secunderabad, Hyderabad, Telangana 500003', 'Hyderabad', 'Secunderabad', 'A well-maintained and accessible public swimming pool.', 4.30, 100, 0, 1, 'public swimming pool', NULL, 'Active');

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
('facility-pune-master', 'amenity-1'), ('facility-pune-master', 'amenity-2'), ('facility-pune-master', 'amenity-3'), ('facility-pune-master', 'amenity-4'), ('facility-pune-master', 'amenity-5'), ('facility-pune-master', 'amenity-6'), ('facility-pune-master', 'amenity-7'), ('facility-pune-master', 'amenity-8'),
('facility-pune-1', 'amenity-1'), ('facility-pune-1', 'amenity-2'), ('facility-pune-1', 'amenity-6'),
('facility-pune-2', 'amenity-1'), ('facility-pune-2', 'amenity-6'), ('facility-pune-2', 'amenity-8'),
('facility-mumbai-master', 'amenity-1'), ('facility-mumbai-master', 'amenity-2'), ('facility-mumbai-master', 'amenity-3'), ('facility-mumbai-master', 'amenity-5'), ('facility-mumbai-master', 'amenity-6'), ('facility-mumbai-master', 'amenity-8'),
('facility-bengaluru-4', 'amenity-1'), ('facility-bengaluru-4', 'amenity-2'), ('facility-bengaluru-4', 'amenity-3'), ('facility-bengaluru-4', 'amenity-4'), ('facility-bengaluru-4', 'amenity-8');


-- --------------------------------------------------------

--
-- Table structure for table `facility_operating_hours`
--

CREATE TABLE `facility_operating_hours` (
  `facilityId` varchar(255) NOT NULL,
  `day` varchar(3) NOT NULL,
  `open` varchar(5) NOT NULL,
  `close` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `facility_operating_hours`
--
INSERT INTO `facility_operating_hours` (`facilityId`, `day`, `open`, `close`) VALUES
('facility-pune-master', 'Mon', '06:00', '22:00'), ('facility-pune-master', 'Tue', '06:00', '22:00'), ('facility-pune-master', 'Wed', '06:00', '22:00'), ('facility-pune-master', 'Thu', '06:00', '22:00'), ('facility-pune-master', 'Fri', '06:00', '22:00'), ('facility-pune-master', 'Sat', '06:00', '23:00'), ('facility-pune-master', 'Sun', '06:00', '23:00'),
('facility-pune-1', 'Mon', '07:00', '21:00'), ('facility-pune-1', 'Tue', '07:00', '21:00'), ('facility-pune-1', 'Wed', '07:00', '21:00'), ('facility-pune-1', 'Thu', '07:00', '21:00'), ('facility-pune-1', 'Fri', '07:00', '21:00'), ('facility-pune-1', 'Sat', '07:00', '20:00'), ('facility-pune-1', 'Sun', '07:00', '20:00'),
('facility-pune-2', 'Mon', '16:00', '23:00'), ('facility-pune-2', 'Tue', '16:00', '23:00'), ('facility-pune-2', 'Wed', '16:00', '23:00'), ('facility-pune-2', 'Thu', '16:00', '23:00'), ('facility-pune-2', 'Fri', '16:00', '00:00'), ('facility-pune-2', 'Sat', '10:00', '00:00'), ('facility-pune-2', 'Sun', '10:00', '23:00'),
('facility-mumbai-master', 'Mon', '06:00', '21:00'), ('facility-mumbai-master', 'Tue', '06:00', '21:00'), ('facility-mumbai-master', 'Wed', '06:00', '21:00'), ('facility-mumbai-master', 'Thu', '06:00', '21:00'), ('facility-mumbai-master', 'Fri', '06:00', '21:00'), ('facility-mumbai-master', 'Sat', '06:00', '21:00'), ('facility-mumbai-master', 'Sun', '06:00', '21:00'),
('facility-bengaluru-4', 'Mon', '05:00', '23:00'), ('facility-bengaluru-4', 'Tue', '05:00', '23:00'), ('facility-bengaluru-4', 'Wed', '05:00', '23:00'), ('facility-bengaluru-4', 'Thu', '05:00', '23:00'), ('facility-bengaluru-4', 'Fri', '05:00', '23:00'), ('facility-bengaluru-4', 'Sat', '05:00', '23:00'), ('facility-bengaluru-4', 'Sun', '05:00', '23:00');


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
('facility-pune-master', 'sport-cricket'), ('facility-pune-master', 'sport-football'), ('facility-pune-master', 'sport-tennis'), ('facility-pune-master', 'sport-badminton'), ('facility-pune-master', 'sport-swimming'), ('facility-pune-master', 'sport-basketball'),
('facility-pune-1', 'sport-tennis'), ('facility-pune-1', 'sport-badminton'),
('facility-pune-2', 'sport-football'),
('facility-pune-3', 'sport-cricket'),
('facility-pune-4', 'sport-badminton'),
('facility-pune-5', 'sport-swimming'),
('facility-mumbai-master', 'sport-football'), ('facility-mumbai-master', 'sport-tennis'), ('facility-mumbai-master', 'sport-basketball'),
('facility-bengaluru-4', 'sport-badminton');

-- --------------------------------------------------------

--
-- Table structure for table `facility_sport_prices`
--

CREATE TABLE `facility_sport_prices` (
  `facilityId` varchar(255) NOT NULL,
  `sportId` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `pricingModel` varchar(255) NOT NULL DEFAULT 'per_hour_flat'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `facility_sport_prices`
--

INSERT INTO `facility_sport_prices` (`facilityId`, `sportId`, `price`, `pricingModel`) VALUES
('facility-pune-master', 'sport-cricket', 2500.00, 'per_hour_flat'),
('facility-pune-master', 'sport-football', 3500.00, 'per_hour_flat'),
('facility-pune-master', 'sport-tennis', 1500.00, 'per_hour_flat'),
('facility-pune-1', 'sport-tennis', 1200.00, 'per_hour_flat'),
('facility-pune-2', 'sport-football', 2800.00, 'per_hour_flat'),
('facility-bengaluru-4', 'sport-badminton', 800.00, 'per_hour_per_person');

-- --------------------------------------------------------

--
-- Table structure for table `lfg_requests`
--

CREATE TABLE `lfg_requests` (
  `id` varchar(255) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `sportId` varchar(255) NOT NULL,
  `facilityId` varchar(255) NOT NULL,
  `facilityName` varchar(255) NOT NULL,
  `notes` text NOT NULL,
  `createdAt` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'open',
  `interestedUserIds` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`interestedUserIds`)),
  `skillLevel` varchar(255) DEFAULT 'Any',
  `playersNeeded` int(11) DEFAULT NULL,
  `preferredTime` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lfg_requests`
--

INSERT INTO `lfg_requests` (`id`, `userId`, `sportId`, `facilityId`, `facilityName`, `notes`, `createdAt`, `status`, `interestedUserIds`, `skillLevel`, `playersNeeded`, `preferredTime`) VALUES
('lfg-1', 'user-dave', 'sport-football', 'facility-mumbai-3', 'Turf 5', 'Looking for 3 more players for a friendly 5-a-side game this Friday evening.', '2024-07-24T18:00:00Z', 'open', '[]', 'Intermediate', 3, 'Friday Evening');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` varchar(255) NOT NULL,
  `facilityId` varchar(255) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `userName` varchar(255) NOT NULL,
  `userAvatar` varchar(255) DEFAULT NULL,
  `isPublicProfile` tinyint(1) DEFAULT 0,
  `rating` int(11) NOT NULL,
  `comment` text NOT NULL,
  `createdAt` varchar(255) NOT NULL,
  `bookingId` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `facilityId`, `userId`, `userName`, `userAvatar`, `isPublicProfile`, `rating`, `comment`, `createdAt`, `bookingId`) VALUES
('review-1', 'facility-pune-master', 'user-charlie', 'Charlie Brown', 'https://i.pravatar.cc/150?img=3', 1, 5, 'Amazing facility! The football pitch was in pristine condition. Loved the experience.', '2024-06-10T14:00:00Z', NULL),
('review-2', 'facility-pune-master', 'user-dave', 'Dave Davis', 'https://i.pravatar.cc/150?img=4', 1, 4, 'Great complex, but a bit crowded on weekends. The amenities are top-notch though.', '2024-06-12T16:30:00Z', NULL);

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
('sport-badminton', 'Badminton', 'Dribbble', 'https://picsum.photos/seed/badminton/400/300', 'badminton racket shuttlecock'),
('sport-basketball', 'Basketball', 'Dribbble', 'https://picsum.photos/seed/basketball/400/300', 'basketball hoop'),
('sport-cricket', 'Cricket', 'Goal', 'https://picsum.photos/seed/cricket/400/300', 'cricket bat ball'),
('sport-football', 'Football', 'Dribbble', 'https://picsum.photos/seed/football/400/300', 'football soccer ball'),
('sport-swimming', 'Swimming', 'Wind', 'https://picsum.photos/seed/swimming/400/300', 'swimming pool water'),
('sport-tennis', 'Tennis', 'Dribbble', 'https://picsum.photos/seed/tennis/400/300', 'tennis racket court');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `profilePictureUrl` varchar(255) DEFAULT NULL,
  `dataAiHint` varchar(255) DEFAULT NULL,
  `favoriteFacilities` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`favoriteFacilities`)),
  `membershipLevel` varchar(255) DEFAULT 'Basic',
  `loyaltyPoints` int(11) DEFAULT 0,
  `achievements` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`achievements`)),
  `bio` text DEFAULT NULL,
  `preferredPlayingTimes` varchar(255) DEFAULT NULL,
  `skillLevels` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`skillLevels`)),
  `role` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `joinedAt` varchar(255) NOT NULL,
  `teamIds` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`teamIds`)),
  `isProfilePublic` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `profilePictureUrl`, `dataAiHint`, `favoriteFacilities`, `membershipLevel`, `loyaltyPoints`, `achievements`, `bio`, `preferredPlayingTimes`, `skillLevels`, `role`, `status`, `joinedAt`, `teamIds`, `isProfilePublic`) VALUES
('user-alice', 'Alice Johnson', 'admin@example.com', 'adminpass', '1234567890', 'https://i.pravatar.cc/150?img=1', 'female smiling', '[]', 'Pro', 5000, '[{\"id\":\"ach-1\",\"name\":\"First Booking\",\"description\":\"Make your first successful booking.\",\"iconName\":\"Medal\",\"unlockedAt\":\"2024-05-21T10:00:00Z\"}]', 'Site administrator and sports enthusiast.', 'Anytime', '[{\"sportId\":\"sport-tennis\",\"sportName\":\"Tennis\",\"level\":\"Advanced\"}]', 'Admin', 'Active', '2024-01-15T09:00:00Z', NULL, 1),
('user-bob', 'Bob Williams', 'owner@example.com', 'ownerpass', '0987654321', 'https://i.pravatar.cc/150?img=2', 'male professional', '[\"facility-pune-master\"]', 'Premium', 1500, '[]', 'Proud owner of multiple sports facilities.', 'Weekdays', '[]', 'FacilityOwner', 'Active', '2024-02-20T11:00:00Z', NULL, 1),
('user-charlie', 'Charlie Brown', 'user@example.com', 'userpass', '9876543210', 'https://i.pravatar.cc/150?img=3', 'happy person', '[]', 'Basic', 250, '[]', 'Love playing tennis on weekends.', 'Weekends', '[{\"sportId\":\"sport-tennis\",\"sportName\":\"Tennis\",\"level\":\"Intermediate\"}]', 'User', 'Active', '2024-03-10T14:30:00Z', NULL, 1),
('user-dave', 'Dave Davis', 'dave@example.com', 'davepass', '9876543211', 'https://i.pravatar.cc/150?img=4', 'male playing sports', '[]', 'Premium', 1200, '[]', 'Football is life. Looking for competitive games.', 'Evenings', '[{\"sportId\":\"sport-football\",\"sportName\":\"Football\",\"level\":\"Advanced\"}]', 'User', 'Active', '2024-04-05T18:00:00Z', NULL, 1);

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
  ADD KEY `facilityId` (`facilityId`);

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
-
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
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

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
  ADD CONSTRAINT `challenges_ibfk_1` FOREIGN KEY (`challengerId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

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
  ADD CONSTRAINT `lfg_requests_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`facilityId`) REFERENCES `facilities` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;
