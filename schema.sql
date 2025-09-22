
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `amenities`
--

INSERT INTO `amenities` (`id`, `name`, `iconName`) VALUES
('amenity-1', 'Parking', 'ParkingCircle'),
('amenity-2', 'Locker Room', 'Lock'),
('amenity-3', 'Wi-Fi', 'Wifi'),
('amenity-4', 'Showers', 'ShowerHead'),
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
  `tags` text DEFAULT NULL,
  `isFeatured` tinyint(1) DEFAULT 0,
  `dataAiHint` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `blog_posts`
--

INSERT INTO `blog_posts` (`id`, `slug`, `title`, `excerpt`, `content`, `authorName`, `authorAvatarUrl`, `publishedAt`, `tags`, `isFeatured`, `dataAiHint`) VALUES
('blog-1', 'improve-your-cricket-batting', '5 Drills to Drastically Improve Your Cricket Batting', 'Whether you are a beginner or an experienced player, these five drills will help you refine your technique, improve your timing, and score more runs.', '<h2>Master the Basics</h2><p>Start with the basics. The grip, stance, and backlift are the fundamentals of batting. Spend at least 15 minutes each session practicing these in front of a mirror.</p><h2>Shadow Batting</h2><p>Shadow batting is an excellent way to work on your technique without the pressure of a bowler. Focus on your footwork and the full swing of the bat for different types of shots.</p>', 'Rohan Sharma', 'https://randomuser.me/api/portraits/men/32.jpg', '2023-06-10T09:00:00.000Z', '[\"Cricket\", \"Batting\", \"Tips\"]', 1, 'cricket batting practice'),
('blog-2', 'choosing-the-right-football-boots', 'How to Choose the Right Football Boots', 'The right pair of football boots can make a huge difference to your game. This guide will help you understand the different types and what to look for.', '<h2>Understand the Surface</h2><p>The type of ground you play on is the most critical factor. Firm Ground (FG) boots are the most common, but you might need Soft Ground (SG) for muddy pitches or Artificial Grass (AG) boots for turf.</p>', 'Priya Singh', 'https://randomuser.me/api/portraits/women/44.jpg', '2023-07-22T12:00:00.000Z', '[\"Football\", \"Equipment\", \"Guide\"]', 0, 'football boots'),
('blog-3', 'staying-hydrated-during-sports', 'The Importance of Staying Hydrated During Sports', 'Proper hydration is key to peak performance and avoiding injuries. Learn how much water you should be drinking before, during, and after your game.', '<p>Dehydration can lead to fatigue, muscle cramps, and a significant drop in performance. The general rule is to drink 8-10 glasses of water a day, but your needs increase when you are active. Start hydrating the day before your match.</p>', 'Dr. Anjali Mehta', 'https://randomuser.me/api/portraits/women/65.jpg', '2023-08-01T15:00:00.000Z', '[\"Health\", \"Fitness\", \"Hydration\"]', 0, 'athlete drinking water');

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` varchar(255) NOT NULL,
  `userId` varchar(255) DEFAULT NULL,
  `facilityId` varchar(255) NOT NULL,
  `facilityName` varchar(255) NOT NULL,
  `dataAiHint` varchar(255) DEFAULT NULL,
  `sportId` varchar(255) NOT NULL,
  `sportName` varchar(255) NOT NULL,
  `date` varchar(255) NOT NULL,
  `startTime` varchar(255) NOT NULL,
  `endTime` varchar(255) NOT NULL,
  `durationHours` int(11) DEFAULT NULL,
  `numberOfGuests` int(11) DEFAULT NULL,
  `baseFacilityPrice` decimal(10,2) NOT NULL,
  `equipmentRentalCost` decimal(10,2) NOT NULL,
  `appliedPromotion` text DEFAULT NULL,
  `totalPrice` decimal(10,2) NOT NULL,
  `status` enum('Confirmed','Pending','Cancelled') NOT NULL,
  `bookedAt` varchar(255) NOT NULL,
  `reviewed` tinyint(1) NOT NULL DEFAULT 0,
  `rentedEquipment` text DEFAULT NULL,
  `phoneNumber` varchar(255) DEFAULT NULL,
  `pricingModel` varchar(50) DEFAULT 'per_hour_flat'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `userId`, `facilityId`, `facilityName`, `dataAiHint`, `sportId`, `sportName`, `date`, `startTime`, `endTime`, `durationHours`, `numberOfGuests`, `baseFacilityPrice`, `equipmentRentalCost`, `appliedPromotion`, `totalPrice`, `status`, `bookedAt`, `reviewed`, `rentedEquipment`, `phoneNumber`, `pricingModel`) VALUES
('booking-1', 'user-charlie', 'facility-pune-1', 'Deccan Gymkhana Club', 'tennis court', 'sport-2', 'Tennis', '2023-08-15', '18:00', '19:00', 1, NULL, '1000.00', '0.00', NULL, '1000.00', 'Confirmed', '2023-08-01 10:00:00', 1, NULL, '9876543210', 'per_hour_flat'),
('booking-2', 'user-diana', 'facility-mumbai-2', 'Andheri Sports Complex', 'swimming pool', 'sport-3', 'Swimming', '2023-08-20', '09:00', '10:00', 1, NULL, '500.00', '0.00', NULL, '500.00', 'Confirmed', '2023-08-05 11:30:00', 0, NULL, '9876543211', 'per_hour_flat'),
('booking-3', 'user-charlie', 'facility-delhi-1', 'Siri Fort Sports Complex', 'badminton court', 'sport-4', 'Badminton', '2023-07-30', '17:00', '18:00', 1, NULL, '700.00', '0.00', NULL, '700.00', 'Cancelled', '2023-07-25 14:00:00', 0, NULL, '9876543210', 'per_hour_flat');

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
  `status` enum('open','accepted','completed','cancelled') NOT NULL DEFAULT 'open',
  `createdAt` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `challenges`
--

INSERT INTO `challenges` (`id`, `challengerId`, `opponentId`, `sportId`, `facilityId`, `facilityName`, `proposedDate`, `notes`, `status`, `createdAt`) VALUES
('challenge-1', 'user-charlie', NULL, 'sport-2', 'facility-pune-1', 'Deccan Gymkhana Club', '2023-09-01T18:00:00.000Z', 'Looking for a friendly but competitive tennis match. Singles. Let\'s play!', 'open', '2023-08-10T11:00:00.000Z'),
('challenge-2', 'user-diana', 'user-charlie', 'sport-4', 'facility-delhi-1', 'Siri Fort Sports Complex', '2023-09-05T19:00:00.000Z', 'Badminton doubles challenge. I have a partner. Need two opponents.', 'accepted', '2023-08-12T15:00:00.000Z');

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `name`, `facilityId`, `facilityName`, `sportId`, `startDate`, `endDate`, `description`, `entryFee`, `maxParticipants`, `registeredParticipants`, `imageUrl`, `imageDataAiHint`) VALUES
('event-1', 'Pune Monsoon Football League', 'facility-pune-2', 'Hotfut Football', 'sport-5', '2023-09-01T09:00:00.000Z', '2023-09-30T18:00:00.000Z', 'The biggest 5-a-side football tournament in Pune. Gather your team and compete for the championship.', '5000.00', 32, 12, 'https://picsum.photos/seed/event1/800/400', 'football tournament'),
('event-2', 'Corporate Badminton Clash', 'facility-bengaluru-1', 'Prakash Padukone Badminton Academy', 'sport-4', '2023-10-15T10:00:00.000Z', '2023-10-15T17:00:00.00Z', 'A one-day badminton tournament for corporate teams. Categories: Men\'s, Women\'s, and Mixed Doubles.', '2000.00', 50, 5, 'https://picsum.photos/seed/event2/800/400', 'badminton shuttlecock');

-- --------------------------------------------------------

--
-- Table structure for table `facilities`
--

CREATE TABLE `facilities` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` enum('Complex','Court','Field','Studio','Pool','Box Cricket') NOT NULL,
  `address` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `rating` decimal(3,2) NOT NULL DEFAULT 0.00,
  `capacity` int(11) DEFAULT 0,
  `isPopular` tinyint(1) DEFAULT 0,
  `isIndoor` tinyint(1) DEFAULT 0,
  `dataAiHint` varchar(255) DEFAULT NULL,
  `ownerId` varchar(255) DEFAULT NULL,
  `blockedSlots` text DEFAULT NULL,
  `maintenanceSchedules` text DEFAULT NULL,
  `status` enum('Active','PendingApproval','Rejected','Inactive') NOT NULL DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `facilities`
--

INSERT INTO `facilities` (`id`, `name`, `type`, `address`, `city`, `location`, `description`, `rating`, `capacity`, `isPopular`, `isIndoor`, `dataAiHint`, `ownerId`, `blockedSlots`, `maintenanceSchedules`, `status`) VALUES
('facility-ahmedabad-1', 'Sanskarinagar Sports Complex', 'Complex', 'Near Shreyas Crossing, Ambawadi', 'Ahmedabad', 'Ambawadi', 'A large complex offering a variety of sports facilities including a swimming pool and tennis courts.', '4.60', 500, 1, 0, 'sports complex', 'user-bob', NULL, NULL, 'Active'),
('facility-ahmedabad-2', 'Gujarat University Ground', 'Field', 'Navrangpura, Ahmedabad', 'Ahmedabad', 'Navrangpura', 'A massive open field, ideal for cricket, football, and athletic events. Well-maintained pitch.', '4.30', 1000, 0, 0, 'cricket field', NULL, NULL, NULL, 'Active'),
('facility-ahmedabad-3', 'Rising Star Badminton Academy', 'Court', 'Bopal, Ahmedabad', 'Ahmedabad', 'Bopal', 'State-of-the-art indoor badminton courts with wooden flooring and excellent lighting.', '4.80', 50, 1, 1, 'badminton court', NULL, NULL, NULL, 'Active'),
('facility-ahmedabad-4', 'The Grid Box Cricket', 'Box Cricket', 'SG Highway, Thaltej', 'Ahmedabad', 'Thaltej', 'A premium box cricket facility with high-quality turf and a fast-paced gaming experience.', '4.50', 20, 1, 1, 'box cricket', NULL, NULL, NULL, 'Active'),
('facility-ahmedabad-5', 'Eklavya Sports Academy', 'Complex', 'Thaltej, Ahmedabad', 'Ahmedabad', 'Thaltej', 'Professional training academy with facilities for multiple sports, focusing on youth development.', '4.70', 200, 0, 1, 'sports academy', NULL, NULL, NULL, 'Active'),
('facility-ahmedabad-6', 'Rajpath Club', 'Complex', 'S G Highway, Bodakdev', 'Ahmedabad', 'Bodakdev', 'An exclusive club with top-tier facilities for tennis, swimming, and gym activities.', '4.90', 300, 1, 1, 'luxury club', 'user-bob', NULL, NULL, 'Active'),
('facility-bengaluru-1', 'Prakash Padukone Badminton Academy', 'Complex', 'Koramangala, Bengaluru', 'Bengaluru', 'Koramangala', 'World-class badminton training facility founded by the legend himself. Multiple courts available.', '4.90', 100, 1, 1, 'badminton academy', NULL, NULL, NULL, 'Active'),
('facility-bengaluru-2', 'Kanteerava Indoor Stadium', 'Complex', 'Sampangi Rama Nagara, Bengaluru', 'Bengaluru', 'City Center', 'A large indoor stadium hosting various sports events, known for basketball and volleyball.', '4.40', 2000, 1, 1, 'indoor stadium', NULL, NULL, NULL, 'Active'),
('facility-bengaluru-3', 'Tiento Sports', 'Field', 'Bellandur, Bengaluru', 'Bengaluru', 'Bellandur', 'Modern 5-a-side and 7-a-side football turfs with excellent amenities and evening slots.', '4.70', 100, 1, 0, 'football turf', NULL, NULL, NULL, 'Active'),
('facility-bengaluru-4', 'Karnataka State Lawn Tennis Association', 'Court', 'Cubbon Park, Bengaluru', 'Bengaluru', 'Cubbon Park', 'Premier tennis destination with clay and hard courts, hosting national tournaments.', '4.60', 150, 0, 0, 'tennis courts', NULL, NULL, NULL, 'Active'),
('facility-bengaluru-5', 'Play Arena', 'Complex', 'Sarjapur Road, Bengaluru', 'Bengaluru', 'Sarjapur', 'A one-stop destination for adventure and sports, including football, paintball, and go-karting.', '4.50', 300, 1, 0, 'sports park', NULL, NULL, NULL, 'Active'),
('facility-bengaluru-6', 'The Bohemian House', 'Studio', 'Indiranagar, Bengaluru', 'Bengaluru', 'Indiranagar', 'A chic studio space perfect for yoga, dance, and fitness workshops.', '4.80', 30, 0, 1, 'yoga studio', NULL, NULL, NULL, 'Active'),
('facility-chandigarh-1', 'Chandigarh Lake Sports Complex', 'Complex', 'Sukhna Lake, Sector 1', 'Chandigarh', 'Sukhna Lake', 'Offers water sports like rowing and kayaking, with beautiful views of the lake.', '4.70', 100, 1, 0, 'rowing lake', 'user-bob', NULL, NULL, 'Active'),
('facility-chandigarh-2', 'Chandigarh Golf Club', 'Field', 'Sector 6, Chandigarh', 'Chandigarh', 'Sector 6', 'A lush green, 18-hole golf course known for its challenging layout and pristine condition.', '4.80', 200, 1, 0, 'golf course', NULL, NULL, NULL, 'Active'),
('facility-chandigarh-3', 'Sector 42 Sports Complex', 'Complex', 'Sector 42, Chandigarh', 'Chandigarh', 'Sector 42', 'A large government-run complex with facilities for hockey, athletics, and football.', '4.20', 500, 0, 0, 'hockey field', NULL, NULL, NULL, 'Active'),
('facility-chandigarh-4', 'Smashers Badminton Arena', 'Court', 'Zirakpur, Chandigarh', 'Chandigarh', 'Zirakpur', 'Indoor badminton facility with synthetic courts and professional coaching available.', '4.50', 40, 0, 1, 'badminton hall', NULL, NULL, NULL, 'Active'),
('facility-chandigarh-5', 'The Dugout Box Cricket', 'Box Cricket', 'Industrial Area Phase 1', 'Chandigarh', 'Industrial Area', 'Modern box cricket arena perfect for corporate matches and friendly games.', '4.40', 25, 1, 1, 'indoor cricket', NULL, NULL, NULL, 'Active'),
('facility-chandigarh-6', 'Fit\'s Studio', 'Studio', 'Sector 8, Chandigarh', 'Chandigarh', 'Sector 8', 'A trendy fitness studio offering Zumba, Aerobics, and personal training sessions.', '4.60', 30, 0, 1, 'fitness studio', NULL, NULL, NULL, 'Active'),
('facility-chennai-1', 'Jawaharlal Nehru Stadium', 'Complex', 'Periyamet, Chennai', 'Chennai', 'Periyamet', 'A major multi-purpose stadium, primarily used for football and athletic events. Features a running track.', '4.50', 4000, 1, 0, 'athletics stadium', NULL, NULL, NULL, 'Active'),
('facility-chennai-2', 'Marina Beach', 'Field', 'Marina Beach, Chennai', 'Chennai', 'Marina', 'The famous Marina beach offers ample space for beach volleyball and cricket.', '4.30', 1000, 1, 0, 'beach volleyball', NULL, NULL, NULL, 'Active'),
('facility-chennai-3', 'SDAT Tennis Stadium', 'Court', 'Nungambakkam, Chennai', 'Chennai', 'Nungambakkam', 'Host of the Chennai Open, this facility has world-class hard courts for tennis enthusiasts.', '4.70', 200, 1, 0, 'tennis stadium', NULL, NULL, NULL, 'Active'),
('facility-chennai-4', 'Turf 137', 'Field', 'OMR, Chennai', 'Chennai', 'OMR', 'A popular rooftop football turf offering a unique playing experience with city views.', '4.60', 50, 1, 0, 'rooftop football', NULL, NULL, NULL, 'Active'),
('facility-chennai-5', 'YMCA College of Physical Education', 'Complex', 'Nandanam, Chennai', 'Chennai', 'Nandanam', 'A prestigious institution with extensive grounds for various sports, including hockey and basketball.', '4.40', 300, 0, 0, 'college sports ground', NULL, NULL, NULL, 'Active'),
('facility-chennai-6', 'Velachery Aquatic Complex', 'Pool', 'Velachery, Chennai', 'Chennai', 'Velachery', 'An Olympic-standard swimming facility with multiple pools for competitive and recreational swimming.', '4.80', 250, 1, 1, 'olympic swimming pool', 'user-bob', NULL, NULL, 'Active'),
('facility-delhi-1', 'Siri Fort Sports Complex', 'Complex', 'Siri Fort, New Delhi', 'Delhi', 'South Delhi', 'One of DDA\'s premier complexes, offering facilities for tennis, badminton, swimming, and more.', '4.50', 500, 1, 1, 'sports complex', NULL, NULL, NULL, 'Active'),
('facility-delhi-2', 'Thyagaraj Sports Complex', 'Complex', 'INA Colony, New Delhi', 'Delhi', 'South Delhi', 'A green and eco-friendly indoor stadium, famous for its wooden basketball court and athletics track.', '4.60', 1500, 1, 1, 'indoor stadium green', NULL, NULL, NULL, 'Active'),
('facility-delhi-3', 'Jawaharlal Nehru Stadium', 'Complex', 'Pragati Vihar, New Delhi', 'Delhi', 'Central Delhi', 'The main stadium for the 2010 Commonwealth Games, now open for public use for athletics and football.', '4.40', 5000, 1, 0, 'large stadium athletics', NULL, NULL, NULL, 'Active'),
('facility-delhi-4', 'Tricky Taka', 'Field', 'Vasant Kunj, New Delhi', 'Delhi', 'Vasant Kunj', 'A popular 5-a-side football facility with high-quality artificial turf.', '4.70', 60, 1, 0, 'football five-a-side', NULL, NULL, NULL, 'Active'),
('facility-delhi-5', 'R.K. Khanna Tennis Complex', 'Court', 'Africa Avenue, New Delhi', 'Delhi', 'South Delhi', 'The national tennis center of India, with numerous hard and clay courts.', '4.50', 300, 0, 0, 'tennis courts complex', NULL, NULL, NULL, 'Active'),
('facility-delhi-6', 'DDA Squash & Badminton Stadium', 'Court', 'Siri Fort, New Delhi', 'Delhi', 'South Delhi', 'Dedicated facility for squash and badminton with multiple courts and coaching.', '4.80', 100, 0, 1, 'squash court', 'user-bob', NULL, NULL, 'Active'),
('facility-hyderabad-1', 'Gachibowli Indoor Stadium', 'Complex', 'Gachibowli, Hyderabad', 'Hyderabad', 'Gachibowli', 'A world-class indoor stadium with facilities for badminton, table tennis, and gymnastics.', '4.70', 1800, 1, 1, 'modern indoor stadium', NULL, NULL, NULL, 'Active'),
('facility-hyderabad-2', 'L.B. Stadium', 'Complex', 'Basheerbagh, Hyderabad', 'Hyderabad', 'Basheerbagh', 'A historic stadium in the heart of the city, mainly used for cricket and football matches.', '4.20', 2500, 0, 0, 'old cricket stadium', NULL, NULL, NULL, 'Active'),
('facility-hyderabad-3', 'Hot-Shotz Box Cricket', 'Box Cricket', 'Madhapur, Hyderabad', 'Hyderabad', 'Madhapur', 'Rooftop box cricket arena with a great atmosphere, perfect for evening games.', '4.60', 20, 1, 1, 'rooftop cricket', NULL, NULL, NULL, 'Active'),
('facility-hyderabad-4', 'SAAP Tennis Complex', 'Court', 'LB Stadium, Hyderabad', 'Hyderabad', 'Basheerbagh', 'A well-maintained tennis complex with several hard courts available for public booking.', '4.40', 80, 0, 0, 'public tennis courts', NULL, NULL, NULL, 'Active'),
('facility-hyderabad-5', 'Pullela Gopichand Badminton Academy', 'Complex', 'Gachibowli, Hyderabad', 'Hyderabad', 'Gachibowli', 'Premier badminton academy in India, home to numerous national champions. Courts are available for booking.', '4.90', 150, 1, 1, 'professional badminton hall', NULL, NULL, NULL, 'Active'),
('facility-hyderabad-6', 'Astro Park', 'Field', 'Jubilee Hills, Hyderabad', 'Hyderabad', 'Jubilee Hills', 'High-quality football turf with multiple pitch sizes available for 5v5, 6v6 and 7v7 games.', '4.50', 80, 1, 0, 'football astro turf', 'user-bob', NULL, NULL, 'Active'),
('facility-jaipur-1', 'Sawai Mansingh Stadium', 'Complex', 'Rambagh, Jaipur', 'Jaipur', 'Rambagh', 'An international cricket stadium, which also houses facilities for tennis and other sports.', '4.60', 3000, 1, 0, 'cricket stadium', NULL, NULL, NULL, 'Active'),
('facility-jaipur-2', 'Chitrakoot Stadium', 'Complex', 'Chitrakoot, Vaishali Nagar', 'Jaipur', 'Vaishali Nagar', 'A multi-purpose sports facility with grounds for cricket, football and courts for basketball.', '4.10', 400, 0, 0, 'community sports ground', NULL, NULL, NULL, 'Active'),
('facility-jaipur-3', 'PlaySpace', 'Field', 'Mansarovar, Jaipur', 'Jaipur', 'Mansarovar', 'A modern sports arena with turfs for football and box cricket.', '4.50', 50, 1, 0, 'sports turf area', NULL, NULL, NULL, 'Active'),
('facility-jaipur-4', 'Rajasthan Badminton Association Hall', 'Court', 'SMS Investment Ground, Jaipur', 'Jaipur', 'Rambagh', 'Dedicated indoor hall for badminton with multiple synthetic courts.', '4.40', 60, 0, 1, 'badminton hall lights', NULL, NULL, NULL, 'Active'),
('facility-jaipur-5', 'Jaipur Club', 'Complex', 'Jacob Road, Civil Lines', 'Jaipur', 'Civil Lines', 'A historic club with excellent facilities for swimming, tennis, and billiards.', '4.70', 200, 1, 1, 'vintage sports club', NULL, NULL, NULL, 'Active'),
('facility-jaipur-6', 'Funkick', 'Box Cricket', 'Sirsi Road, Jaipur', 'Jaipur', 'Sirsi Road', 'An exciting venue for box cricket and football with a lively atmosphere.', '4.30', 30, 1, 1, 'box cricket night', 'user-bob', NULL, NULL, 'Active'),
('facility-kolkata-1', 'Eden Gardens', 'Field', 'B. B. D. Bagh, Kolkata', 'Kolkata', 'BBD Bagh', 'One of the most iconic cricket stadiums in the world. A must-visit for any cricket fan.', '4.80', 6800, 1, 0, 'iconic cricket stadium', NULL, NULL, NULL, 'Active'),
('facility-kolkata-2', 'Salt Lake Stadium (Vivekananda Yuba Bharati Krirangan)', 'Complex', 'Salt Lake, Kolkata', 'Kolkata', 'Salt Lake', 'The second largest stadium in India, primarily used for football matches. Features an athletics track.', '4.60', 8500, 1, 0, 'massive football stadium', NULL, NULL, NULL, 'Active'),
('facility-kolkata-3', 'Calcutta Cricket & Football Club (CC&FC)', 'Complex', 'Ballygunge, Kolkata', 'Kolkata', 'Ballygunge', 'One of the oldest sports clubs in the world, with a rich history and excellent grounds for cricket and rugby.', '4.70', 500, 1, 0, 'old sports club', NULL, NULL, NULL, 'Active'),
('facility-kolkata-4', 'New Town Business Club', 'Pool', 'New Town, Kolkata', 'Kolkata', 'New Town', 'Features a modern, clean swimming pool with dedicated lanes for lap swimming.', '4.50', 100, 0, 0, 'modern swimming pool', NULL, NULL, NULL, 'Active'),
('facility-kolkata-5', 'Sports Square', 'Field', 'New Town, Kolkata', 'Kolkata', 'New Town', 'A popular multi-sport turf for 5-a-side football and box cricket.', '4.40', 60, 1, 0, 'football turf night', NULL, NULL, NULL, 'Active'),
('facility-kolkata-6', 'Bengal Tennis Association Complex', 'Court', 'Salt Lake, Kolkata', 'Kolkata', 'Salt Lake', 'The premier tennis facility in West Bengal with numerous hard courts and coaching facilities.', '4.60', 150, 0, 0, 'tennis complex day', 'user-bob', NULL, NULL, 'Active'),
('facility-mumbai-1', 'Wankhede Stadium', 'Field', 'Churchgate, Mumbai', 'Mumbai', 'Churchgate', 'An iconic international cricket stadium, home to many historic matches.', '4.80', 3300, 1, 0, 'cricket stadium crowd', NULL, NULL, NULL, 'Active'),
('facility-mumbai-2', 'Andheri Sports Complex', 'Complex', 'Andheri West, Mumbai', 'Mumbai', 'Andheri', 'A multi-purpose facility with a football stadium, swimming pool, and indoor courts.', '4.40', 1000, 1, 1, 'sports complex aerial', 'user-bob', NULL, NULL, 'Active'),
('facility-mumbai-3', 'Dadar Club', 'Pool', 'Dadar, Mumbai', 'Mumbai', 'Dadar', 'A well-maintained swimming pool in the heart of the city, perfect for a refreshing swim.', '4.60', 100, 0, 0, 'swimming pool lanes', NULL, NULL, NULL, 'Active'),
('facility-mumbai-4', 'Juhu Turf', 'Field', 'Juhu, Mumbai', 'Mumbai', 'Juhu', 'A popular 5-a-side football turf located near the beach, great for evening games.', '4.50', 50, 1, 0, 'football turf sunset', NULL, NULL, NULL, 'Active'),
('facility-mumbai-5', 'Matunga Gymkhana', 'Court', 'Matunga, Mumbai', 'Mumbai', 'Matunga', 'A classic gymkhana with excellent tennis and badminton courts.', '4.70', 200, 0, 0, 'tennis court classic', NULL, NULL, NULL, 'Active'),
('facility-mumbai-6', 'Urban Sports', 'Box Cricket', 'Goregaon, Mumbai', 'Mumbai', 'Goregaon', 'A top-notch box cricket facility with great lighting and equipment.', '4.60', 25, 1, 1, 'box cricket action', NULL, NULL, NULL, 'Active'),
('facility-pune-1', 'Deccan Gymkhana Club', 'Complex', 'Deccan Gymkhana, Pune', 'Pune', 'Deccan', 'A premier club in Pune with top-notch facilities for Tennis, Swimming, and Basketball.', '4.70', 300, 1, 0, 'clubhouse exterior', NULL, '[]', NULL, 'Active'),
('facility-pune-2', 'Hotfut Football', 'Field', 'Koregaon Park, Pune', 'Pune', 'Koregaon Park', 'State-of-the-art 5-a-side football turf with excellent floodlights for night games.', '4.80', 50, 1, 0, 'football turf night', NULL, '[]', NULL, 'Active'),
('facility-pune-3', 'PYC Hindu Gymkhana', 'Court', 'Deccan Gymkhana, Pune', 'Pune', 'Deccan', 'Known for its well-maintained badminton and tennis courts. A hub for racquet sports.', '4.60', 150, 0, 1, 'badminton court action', NULL, '[]', NULL, 'Active'),
('facility-pune-4', 'Shree Shiv Chhatrapati Sports Complex', 'Complex', 'Balewadi, Pune', 'Pune', 'Balewadi', 'An international standard sports complex that has hosted numerous national and international events.', '4.50', 5000, 1, 1, 'large sports stadium', 'user-bob', '[]', NULL, 'Active'),
('facility-pune-5', 'Legends United', 'Box Cricket', 'Kharadi, Pune', 'Pune', 'Kharadi', 'A popular spot for box cricket enthusiasts with a lively atmosphere and competitive games.', '4.40', 30, 1, 1, 'box cricket game', NULL, '[]', NULL, 'Active'),
('facility-pune-6', 'Champions Sport Club', 'Pool', 'Magarpatta, Pune', 'Pune', 'Magarpatta', 'A modern swimming pool with clean water and dedicated lanes for all levels of swimmers.', '4.60', 80, 0, 0, 'swimming pool clear', NULL, '[]', NULL, 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `facility_amenities`
--

CREATE TABLE `facility_amenities` (
  `facilityId` varchar(255) NOT NULL,
  `amenityId` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `facility_amenities`
--

INSERT INTO `facility_amenities` (`facilityId`, `amenityId`) VALUES
('facility-pune-1', 'amenity-1'),
('facility-pune-1', 'amenity-2'),
('facility-pune-1', 'amenity-4'),
('facility-pune-2', 'amenity-1'),
('facility-pune-2', 'amenity-6'),
('facility-pune-2', 'amenity-8'),
('facility-pune-3', 'amenity-2'),
('facility-pune-3', 'amenity-3'),
('facility-pune-4', 'amenity-1'),
('facility-pune-4', 'amenity-2'),
('facility-pune-4', 'amenity-5'),
('facility-pune-4', 'amenity-6'),
('facility-pune-5', 'amenity-1'),
('facility-pune-5', 'amenity-7'),
('facility-pune-6', 'amenity-1'),
('facility-pune-6', 'amenity-2'),
('facility-pune-6', 'amenity-4'),
('facility-mumbai-1', 'amenity-1'),
('facility-mumbai-1', 'amenity-2'),
('facility-mumbai-2', 'amenity-1'),
('facility-mumbai-2', 'amenity-4'),
('facility-mumbai-2', 'amenity-5'),
('facility-delhi-1', 'amenity-1'),
('facility-delhi-1', 'amenity-2'),
('facility-delhi-1', 'amenity-3'),
('facility-delhi-1', 'amenity-4'),
('facility-bengaluru-1', 'amenity-2'),
('facility-bengaluru-1', 'amenity-4'),
('facility-bengaluru-1', 'amenity-8');

-- --------------------------------------------------------

--
-- Table structure for table `facility_equipment`
--

CREATE TABLE `facility_equipment` (
  `facilityId` varchar(255) NOT NULL,
  `equipmentId` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `facility_operating_hours`
--

CREATE TABLE `facility_operating_hours` (
  `facilityId` varchar(255) NOT NULL,
  `day` enum('Mon','Tue','Wed','Thu','Fri','Sat','Sun') NOT NULL,
  `open` varchar(255) NOT NULL,
  `close` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `facility_operating_hours`
--

INSERT INTO `facility_operating_hours` (`facilityId`, `day`, `open`, `close`) VALUES
('facility-ahmedabad-1', 'Mon', '08:00', '22:00'),
('facility-ahmedabad-1', 'Tue', '08:00', '22:00'),
('facility-ahmedabad-1', 'Wed', '08:00', '22:00'),
('facility-ahmedabad-1', 'Thu', '08:00', '22:00'),
('facility-ahmedabad-1', 'Fri', '08:00', '23:00'),
('facility-ahmedabad-1', 'Sat', '09:00', '23:00'),
('facility-ahmedabad-1', 'Sun', '09:00', '20:00'),
('facility-pune-1', 'Mon', '07:00', '21:00'),
('facility-pune-1', 'Tue', '07:00', '21:00'),
('facility-pune-1', 'Wed', '07:00', '21:00'),
('facility-pune-1', 'Thu', '07:00', '21:00'),
('facility-pune-1', 'Fri', '07:00', '22:00'),
('facility-pune-1', 'Sat', '08:00', '22:00'),
('facility-pune-1', 'Sun', '08:00', '20:00'),
('facility-pune-2', 'Mon', '06:00', '23:00'),
('facility-pune-2', 'Tue', '06:00', '23:00'),
('facility-pune-2', 'Wed', '06:00', '23:00'),
('facility-pune-2', 'Thu', '06:00', '23:00'),
('facility-pune-2', 'Fri', '06:00', '23:59'),
('facility-pune-2', 'Sat', '06:00', '23:59'),
('facility-pune-2', 'Sun', '06:00', '23:00'),
('facility-pune-3', 'Mon', '08:00', '22:00'),
('facility-pune-3', 'Tue', '08:00', '22:00'),
('facility-pune-3', 'Wed', '08:00', '22:00'),
('facility-pune-3', 'Thu', '08:00', '22:00'),
('facility-pune-3', 'Fri', '08:00', '22:00'),
('facility-pune-3', 'Sat', '08:00', '22:00'),
('facility-pune-3', 'Sun', '08:00', '18:00');

-- --------------------------------------------------------

--
-- Table structure for table `facility_sports`
--

CREATE TABLE `facility_sports` (
  `facilityId` varchar(255) NOT NULL,
  `sportId` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `facility_sports`
--

INSERT INTO `facility_sports` (`facilityId`, `sportId`) VALUES
('facility-ahmedabad-1', 'sport-2'),
('facility-ahmedabad-1', 'sport-3'),
('facility-ahmedabad-2', 'sport-1'),
('facility-ahmedabad-2', 'sport-5'),
('facility-ahmedabad-3', 'sport-4'),
('facility-ahmedabad-4', 'sport-1'),
('facility-ahmedabad-5', 'sport-1'),
('facility-ahmedabad-5', 'sport-4'),
('facility-ahmedabad-6', 'sport-2'),
('facility-ahmedabad-6', 'sport-3'),
('facility-bengaluru-1', 'sport-4'),
('facility-bengaluru-2', 'sport-6'),
('facility-bengaluru-2', 'sport-7'),
('facility-bengaluru-3', 'sport-5'),
('facility-bengaluru-4', 'sport-2'),
('facility-bengaluru-5', 'sport-5'),
('facility-bengaluru-6', 'sport-8'),
('facility-chandigarh-1', 'sport-3'),
('facility-chandigarh-2', 'sport-1'),
('facility-chandigarh-3', 'sport-5'),
('facility-chandigarh-4', 'sport-4'),
('facility-chandigarh-5', 'sport-1'),
('facility-chandigarh-6', 'sport-8'),
('facility-chennai-1', 'sport-5'),
('facility-chennai-2', 'sport-1'),
('facility-chennai-3', 'sport-2'),
('facility-chennai-4', 'sport-5'),
('facility-chennai-5', 'sport-6'),
('facility-chennai-6', 'sport-3'),
('facility-delhi-1', 'sport-2'),
('facility-delhi-1', 'sport-3'),
('facility-delhi-1', 'sport-4'),
('facility-delhi-2', 'sport-6'),
('facility-delhi-3', 'sport-5'),
('facility-delhi-4', 'sport-5'),
('facility-delhi-5', 'sport-2'),
('facility-delhi-6', 'sport-4'),
('facility-hyderabad-1', 'sport-4'),
('facility-hyderabad-1', 'sport-7'),
('facility-hyderabad-2', 'sport-1'),
('facility-hyderabad-2', 'sport-5'),
('facility-hyderabad-3', 'sport-1'),
('facility-hyderabad-4', 'sport-2'),
('facility-hyderabad-5', 'sport-4'),
('facility-hyderabad-6', 'sport-5'),
('facility-jaipur-1', 'sport-1'),
('facility-jaipur-2', 'sport-1'),
('facility-jaipur-2', 'sport-5'),
('facility-jaipur-2', 'sport-6'),
('facility-jaipur-3', 'sport-5'),
('facility-jaipur-4', 'sport-4'),
('facility-jaipur-5', 'sport-2'),
('facility-jaipur-5', 'sport-3'),
('facility-jaipur-6', 'sport-1'),
('facility-kolkata-1', 'sport-1'),
('facility-kolkata-2', 'sport-5'),
('facility-kolkata-3', 'sport-1'),
('facility-kolkata-4', 'sport-3'),
('facility-kolkata-5', 'sport-1'),
('facility-kolkata-5', 'sport-5'),
('facility-kolkata-6', 'sport-2'),
('facility-mumbai-1', 'sport-1'),
('facility-mumbai-2', 'sport-3'),
('facility-mumbai-2', 'sport-5'),
('facility-mumbai-3', 'sport-3'),
('facility-mumbai-4', 'sport-5'),
('facility-mumbai-5', 'sport-2'),
('facility-mumbai-5', 'sport-4'),
('facility-mumbai-6', 'sport-1'),
('facility-pune-1', 'sport-2'),
('facility-pune-1', 'sport-3'),
('facility-pune-1', 'sport-6'),
('facility-pune-2', 'sport-5'),
('facility-pune-3', 'sport-2'),
('facility-pune-3', 'sport-4'),
('facility-pune-4', 'sport-2'),
('facility-pune-4', 'sport-3'),
('facility-pune-4', 'sport-4'),
('facility-pune-4', 'sport-5'),
('facility-pune-4', 'sport-6'),
('facility-pune-5', 'sport-1'),
('facility-pune-6', 'sport-3');

-- --------------------------------------------------------

--
-- Table structure for table `facility_sport_prices`
--

CREATE TABLE `facility_sport_prices` (
  `facilityId` varchar(255) NOT NULL,
  `sportId` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `pricingModel` enum('per_hour_flat','per_hour_per_person') NOT NULL DEFAULT 'per_hour_flat'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `facility_sport_prices`
--

INSERT INTO `facility_sport_prices` (`facilityId`, `sportId`, `price`, `pricingModel`) VALUES
('facility-ahmedabad-1', 'sport-2', '900.00', 'per_hour_flat'),
('facility-ahmedabad-1', 'sport-3', '400.00', 'per_hour_per_person'),
('facility-pune-1', 'sport-2', '1000.00', 'per_hour_flat'),
('facility-pune-1', 'sport-3', '300.00', 'per_hour_per_person'),
('facility-pune-1', 'sport-6', '1200.00', 'per_hour_flat'),
('facility-pune-2', 'sport-5', '2000.00', 'per_hour_flat'),
('facility-pune-3', 'sport-2', '900.00', 'per_hour_flat'),
('facility-pune-3', 'sport-4', '800.00', 'per_hour_flat'),
('facility-pune-4', 'sport-3', '400.00', 'per_hour_per_person'),
('facility-pune-5', 'sport-1', '1500.00', 'per_hour_flat'),
('facility-pune-6', 'sport-3', '350.00', 'per_hour_per_person'),
('facility-mumbai-2', 'sport-3', '500.00', 'per_hour_per_person'),
('facility-delhi-1', 'sport-4', '700.00', 'per_hour_flat');

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
  `status` enum('open','closed') NOT NULL DEFAULT 'open',
  `interestedUserIds` text DEFAULT NULL,
  `skillLevel` enum('Any','Beginner','Intermediate','Advanced') DEFAULT 'Any',
  `playersNeeded` int(11) DEFAULT NULL,
  `preferredTime` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `lfg_requests`
--

INSERT INTO `lfg_requests` (`id`, `userId`, `sportId`, `facilityId`, `facilityName`, `notes`, `createdAt`, `status`, `interestedUserIds`, `skillLevel`, `playersNeeded`, `preferredTime`) VALUES
('lfg-1', 'user-charlie', 'sport-1', 'facility-pune-5', 'Legends United', 'Need 5 players for a box cricket match this Saturday evening. Let\'s have a fun game!', '2023-08-11T18:00:00.000Z', 'open', '[\"user-diana\"]', 'Intermediate', 5, 'Saturday Evening'),
('lfg-2', 'user-diana', 'sport-5', 'facility-pune-2', 'Hotfut Football', 'Looking for a goalkeeper for our 5-a-side team. We play every Friday night.', '2023-08-10T14:00:00.000Z', 'open', '[]', 'Advanced', 1, 'Friday Nights');

-- --------------------------------------------------------

--
-- Table structure for table `membership_plans`
--

CREATE TABLE `membership_plans` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `pricePerMonth` decimal(10,2) NOT NULL,
  `benefits` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `membership_plans`
--

INSERT INTO `membership_plans` (`id`, `name`, `pricePerMonth`, `benefits`) VALUES
('plan-1', 'Basic', '0.00', '[\"Access to all facility listings\",\"Standard booking rates\",\"Basic community access\"]'),
('plan-2', 'Premium', '999.00', '[\"5% discount on all bookings\",\"Priority booking for new slots\",\"Access to member-only events\",\"Advanced profile customization\"]'),
('plan-3', 'Pro', '2499.00', '[\"15% discount on all bookings\",\"Free equipment rentals\",\"Pro badge on your profile\",\"Priority customer support\"]');

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
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `pricing_rules`
--

CREATE TABLE `pricing_rules` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `facilityIds` text DEFAULT NULL,
  `daysOfWeek` text DEFAULT NULL,
  `timeRange` text DEFAULT NULL,
  `dateRange` text DEFAULT NULL,
  `adjustmentType` enum('percentage_increase','percentage_decrease','fixed_increase','fixed_decrease','fixed_price') NOT NULL,
  `value` decimal(10,2) NOT NULL,
  `priority` int(11) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `pricing_rules`
--

INSERT INTO `pricing_rules` (`id`, `name`, `description`, `facilityIds`, `daysOfWeek`, `timeRange`, `dateRange`, `adjustmentType`, `value`, `priority`, `isActive`) VALUES
('rule-1', 'Weekend Evening Surge', 'Increase price for popular weekend evening slots.', '[]', '[\"Fri\",\"Sat\"]', '{\"start\":\"18:00\",\"end\":\"22:00\"}', NULL, 'percentage_increase', '20.00', 10, 1),
('rule-2', 'Weekday Morning Discount', 'Discount for off-peak morning hours on weekdays.', '[]', '[\"Mon\",\"Tue\",\"Wed\",\"Thu\",\"Fri\"]', '{\"start\":\"08:00\",\"end\":\"11:00\"}', NULL, 'percentage_decrease', '15.00', 10, 1);

-- --------------------------------------------------------

--
-- Table structure for table `promotion_rules`
--

CREATE TABLE `promotion_rules` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `discountType` enum('percentage','fixed_amount') NOT NULL,
  `discountValue` decimal(10,2) NOT NULL,
  `startDate` varchar(255) DEFAULT NULL,
  `endDate` varchar(255) DEFAULT NULL,
  `usageLimit` int(11) DEFAULT NULL,
  `usageLimitPerUser` int(11) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `promotion_rules`
--

INSERT INTO `promotion_rules` (`id`, `name`, `description`, `code`, `discountType`, `discountValue`, `startDate`, `endDate`, `usageLimit`, `usageLimitPerUser`, `isActive`) VALUES
('promo-1', 'First Booking Discount', 'A special 20% discount for all new users on their first booking.', 'FIRST20', 'percentage', '20.00', NULL, NULL, NULL, 1, 1),
('promo-2', 'Monsoon Mania', 'A fixed 200 INR off on all bookings made during the monsoon season.', 'MONSOON200', 'fixed_amount', '200.00', '2023-07-01', '2023-09-30', NULL, NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `rental_equipment`
--

CREATE TABLE `rental_equipment` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `pricePerItem` decimal(10,2) NOT NULL,
  `priceType` enum('per_booking','per_hour') NOT NULL,
  `stock` int(11) NOT NULL,
  `sportIds` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `facilityId`, `userId`, `userName`, `userAvatar`, `isPublicProfile`, `rating`, `comment`, `createdAt`, `bookingId`) VALUES
('review-1', 'facility-pune-1', 'user-charlie', 'Charlie Davis', 'https://randomuser.me/api/portraits/men/11.jpg', 1, 5, 'Excellent tennis courts, well-maintained and the lighting is perfect for evening games. Staff is very helpful too!', '2023-08-16T12:00:00.000Z', 'booking-1');

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `sports`
--

INSERT INTO `sports` (`id`, `name`, `iconName`, `imageUrl`, `imageDataAiHint`) VALUES
('sport-1', 'Cricket', 'Dribbble', 'https://picsum.photos/seed/cricket/400/300', 'cricket sport'),
('sport-2', 'Tennis', 'Activity', 'https://picsum.photos/seed/tennis/400/300', 'tennis sport'),
('sport-3', 'Swimming', 'Wind', 'https://picsum.photos/seed/swimming/400/300', 'swimming sport'),
('sport-4', 'Badminton', 'Feather', 'https://picsum.photos/seed/badminton/400/300', 'badminton sport'),
('sport-5', 'Football', 'Goal', 'https://picsum.photos/seed/football/400/300', 'football sport'),
('sport-6', 'Basketball', 'Dribbble', 'https://picsum.photos/seed/basketball/400/300', 'basketball sport'),
('sport-7', 'Table Tennis', 'Disc', 'https://picsum.photos/seed/tabletennis/400/300', 'table tennis'),
('sport-8', 'Yoga', 'PersonStanding', 'https://picsum.photos/seed/yoga/400/300', 'yoga fitness');

-- --------------------------------------------------------

--
-- Table structure for table `teams`
--

CREATE TABLE `teams` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `sportId` varchar(255) NOT NULL,
  `captainId` varchar(255) NOT NULL,
  `memberIds` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `teams`
--

INSERT INTO `teams` (`id`, `name`, `sportId`, `captainId`, `memberIds`) VALUES
('team-1', 'Pune Smashers', 'sport-4', 'user-charlie', '[\"user-charlie\", \"user-diana\"]');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `profilePictureUrl` varchar(255) DEFAULT NULL,
  `dataAiHint` varchar(255) DEFAULT NULL,
  `preferredSports` text DEFAULT NULL,
  `favoriteFacilities` text DEFAULT NULL,
  `membershipLevel` enum('Basic','Premium','Pro') DEFAULT 'Basic',
  `loyaltyPoints` int(11) DEFAULT 0,
  `achievements` text DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `preferredPlayingTimes` varchar(255) DEFAULT NULL,
  `skillLevels` text DEFAULT NULL,
  `role` enum('Admin','FacilityOwner','User') NOT NULL DEFAULT 'User',
  `status` enum('Active','Suspended','PendingApproval') NOT NULL DEFAULT 'Active',
  `joinedAt` varchar(255) NOT NULL,
  `teamIds` text DEFAULT NULL,
  `isProfilePublic` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `profilePictureUrl`, `dataAiHint`, `preferredSports`, `favoriteFacilities`, `membershipLevel`, `loyaltyPoints`, `achievements`, `bio`, `preferredPlayingTimes`, `skillLevels`, `role`, `status`, `joinedAt`, `teamIds`, `isProfilePublic`) VALUES
('user-alice', 'Alice Johnson', 'alice@example.com', 'password123', '9876543210', 'https://randomuser.me/api/portraits/women/1.jpg', 'woman smiling', '[]', '[]', 'Basic', 150, '[]', 'Just here to play and have fun!', 'Weekends', '[]', 'Admin', 'Active', '2023-01-15T10:00:00.000Z', '[]', 1),
('user-bob', 'Bob Williams', 'bob@example.com', 'password123', '9876543211', 'https://randomuser.me/api/portraits/men/2.jpg', 'man with glasses', '[]', '[\"facility-pune-1\",\"facility-mumbai-2\"]', 'Premium', 1250, '[]', 'Managing top-tier sports facilities across the country.', 'Anytime', '[]', 'FacilityOwner', 'Active', '2023-02-20T11:00:00.000Z', '[]', 1),
('user-charlie', 'Charlie Davis', 'charlie@example.com', 'password123', '9876543212', 'https://randomuser.me/api/portraits/men/11.jpg', 'man outside', '[{\"id\":\"sport-2\",\"name\":\"Tennis\"},{\"id\":\"sport-4\",\"name\":\"Badminton\"}]', '[\"facility-pune-1\",\"facility-pune-3\"]', 'Premium', 850, '[{\"id\":\"ach-1\",\"name\":\"First Booking\",\"description\":\"Made your first booking on the platform\",\"iconName\":\"Gift\",\"unlockedAt\":\"2023-08-01T10:00:00.000Z\"}]', 'Competitive player, always up for a challenge.', 'Weekends', '[{\"sportId\":\"sport-2\",\"sportName\":\"Tennis\",\"level\":\"Advanced\"}]', 'User', 'Active', '2023-03-10T14:30:00.000Z', '[\"team-1\"]', 1),
('user-diana', 'Diana Miller', 'diana@example.com', 'password123', '9876543213', 'https://randomuser.me/api/portraits/women/22.jpg', 'woman with hat', '[]', '[]', 'Basic', 200, '[]', NULL, NULL, '[]', 'User', 'Active', '2023-04-05T18:00:00.000Z', '[\"team-1\"]', 0);


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
-- Indexes for table `facility_equipment`
--
ALTER TABLE `facility_equipment`
  ADD PRIMARY KEY (`facilityId`,`equipmentId`),
  ADD KEY `equipmentId` (`equipmentId`);

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
  ADD PRIMARY KEY (`facilityId`,`sportId`);

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
-- Indexes for table `rental_equipment`
--
ALTER TABLE `rental_equipment`
  ADD PRIMARY KEY (`id`);

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

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `owner_verification_requests`
--
ALTER TABLE `owner_verification_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
