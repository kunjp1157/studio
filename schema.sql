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
('amenity-2', 'Wi-Fi', 'Wifi'),
('amenity-3', 'Showers', 'ShowerHead'),
('amenity-4', 'Lockers', 'Lock'),
('amenity-5', 'First Aid', 'FirstAidKit'),
('amenity-6', 'Refreshments', 'Utensils'),
('amenity-7', 'Changing Rooms', 'Users'),
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
  `publishedAt` datetime NOT NULL,
  `tags` text DEFAULT NULL,
  `isFeatured` tinyint(1) DEFAULT 0,
  `dataAiHint` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `blog_posts`
--

INSERT INTO `blog_posts` (`id`, `slug`, `title`, `excerpt`, `content`, `authorName`, `authorAvatarUrl`, `publishedAt`, `tags`, `isFeatured`, `dataAiHint`) VALUES
('blog-1', 'improve-your-cricket-batting', '5 Drills to Drastically Improve Your Cricket Batting', 'Take your cricket game to the next level with these five essential batting drills. Perfect for beginners and seasoned players alike, these exercises focus on improving your stance, swing, and timing.', '<p>Improving your cricket batting is a journey of continuous practice and refinement. Here are five drills that can help you become a more formidable batsman:</p><h4>1. The Hanging Ball Drill</h4><p>This classic drill is perfect for grooving your technique. Hang a ball from a string at a comfortable height and practice your shots—cover drives, straight drives, and defensive strokes. Focus on footwork, head position, and meeting the ball with the full face of the bat. Spend at least 20 minutes on this drill in each practice session.</p><h4>2. Shadow Batting</h4><p>Shadow batting is an excellent way to build muscle memory without the pressure of hitting a ball. Practice your full range of shots in front of a mirror. Pay close attention to your form, balance, and follow-through. This helps in correcting technical flaws that might go unnoticed during a game.</p><h4>3. Net Practice with a Partner</h4><p>There is no substitute for facing a real bowler. Regular net sessions are crucial. Ask your partner to mix up their deliveries—fast, slow, short, and full. This helps in improving your reaction time and shot selection under pressure.</p><h4>4. Target Hitting</h4><p>Set up cones or markers in different areas of the field and try to hit the ball towards them. This drill is fantastic for improving your placement and control. It teaches you to find gaps in the field and manipulate the strike, which is a key skill in limited-overs cricket.</p><h4>5. One-Bounce and Hit</h4><p>Have a partner throw the ball so it bounces once before it reaches you. Your goal is to hit it on the half-volley. This drill sharpens your reflexes, improves your hand-eye coordination, and forces you to get your front foot towards the pitch of the ball.</p><p>Consistency is key. Incorporate these drills into your regular training, and you will see a significant improvement in your batting prowess. Happy practicing!</p>', 'Rohan Sharma', 'https://i.pravatar.cc/150?u=rohan', '2024-05-10 10:00:00', '[\"Cricket\", \"Training\", \"Batting\"]', 1, 'cricket batting practice'),
('blog-2', 'choosing-the-right-running-shoes', 'How to Choose the Right Running Shoes', 'The perfect pair of running shoes can make all the difference. Learn about pronation, shoe types, and how to find the best fit for your feet to prevent injuries and enhance performance.', '<p>Content for choosing running shoes...</p>', 'Priya Mehta', 'https://i.pravatar.cc/150?u=priya', '2024-05-15 11:30:00', '[\"Running\", \"Health\", \"Gear\"]', 0, 'running shoes');

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
  `appliedPromotion` text DEFAULT NULL,
  `totalPrice` decimal(10,2) NOT NULL,
  `status` enum('Confirmed','Pending','Cancelled') NOT NULL,
  `bookedAt` datetime NOT NULL,
  `reviewed` tinyint(1) DEFAULT 0,
  `rentedEquipment` text DEFAULT NULL,
  `phoneNumber` varchar(20) DEFAULT NULL,
  `pricingModel` varchar(50) DEFAULT 'per_hour_flat',
  `dataAiHint` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `userId`, `facilityId`, `facilityName`, `sportId`, `sportName`, `date`, `startTime`, `endTime`, `durationHours`, `numberOfGuests`, `baseFacilityPrice`, `equipmentRentalCost`, `appliedPromotion`, `totalPrice`, `status`, `bookedAt`, `reviewed`, `rentedEquipment`, `phoneNumber`, `pricingModel`, `dataAiHint`) VALUES
(1, 'user-2', 'fac-pune-1', 'Deccan Gymkhana Club', 'sport-2', 'Tennis', '2024-06-15', '17:00:00', '18:00:00', 1, NULL, 1200.00, 0.00, NULL, 1200.00, 'Confirmed', '2024-06-10 14:30:00', 0, NULL, '+919876543211', 'per_hour_flat', 'tennis court booking'),
(2, 'user-3', 'fac-mumbai-2', 'Andheri Sports Complex', 'sport-1', 'Cricket', '2024-06-18', '19:00:00', '21:00:00', 2, NULL, 3000.00, 0.00, NULL, 6000.00, 'Confirmed', '2024-06-11 11:00:00', 0, NULL, '+919876543212', 'per_hour_flat', 'cricket nets night');

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `challenges`
--

INSERT INTO `challenges` (`id`, `challengerId`, `opponentId`, `sportId`, `facilityId`, `facilityName`, `proposedDate`, `notes`, `status`, `createdAt`) VALUES
(1, 'user-2', NULL, 'sport-2', 'fac-pune-1', 'Deccan Gymkhana Club', '2024-07-01 18:00:00', 'Looking for a competitive singles tennis match. Intermediate to Advanced level please.', 'open', '2024-06-15 10:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `facilityId` varchar(255) NOT NULL,
  `facilityName` varchar(255) DEFAULT NULL,
  `sportId` varchar(255) NOT NULL,
  `startDate` datetime NOT NULL,
  `endDate` datetime NOT NULL,
  `description` text NOT NULL,
  `entryFee` decimal(10,2) DEFAULT 0.00,
  `maxParticipants` int(11) DEFAULT 0,
  `registeredParticipants` int(11) DEFAULT 0,
  `imageUrl` varchar(255) DEFAULT NULL,
  `imageDataAiHint` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `name`, `facilityId`, `facilityName`, `sportId`, `startDate`, `endDate`, `description`, `entryFee`, `maxParticipants`, `registeredParticipants`, `imageUrl`, `imageDataAiHint`) VALUES
(1, 'Pune Monsoon Football League', 'fac-pune-master', 'Shree Shiv Chhatrapati Sports Complex', 'sport-3', '2024-07-15 09:00:00', '2024-07-29 18:00:00', 'The biggest 5-a-side football tournament of the season is back! Gather your team and compete for the ultimate glory and cash prizes.', 5000.00, 32, 8, 'https://picsum.photos/seed/event1/800/400', 'football tournament');

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
  `rating` decimal(3,2) DEFAULT 0.00,
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
('fac-bengaluru-1', 'Karnataka State Lawn Tennis Association', 'Court', 'Cubbon Park, Bengaluru, Karnataka 560001', 'Bengaluru', 'Cubbon Park', 'Premier tennis facility with well-maintained clay and hard courts.', 4.70, 100, 1, 0, 'tennis courts', NULL, '[]', '[]', 'Active'),
('fac-bengaluru-2', 'Play Arena', 'Complex', 'Sarjapur Main Rd, Kasavanahalli, Bengaluru, Karnataka 560035', 'Bengaluru', 'Sarjapur Road', 'A massive sports complex offering football, cricket, go-karting, and more.', 4.40, 500, 1, 0, 'sports complex', NULL, '[]', '[]', 'Active'),
('fac-bengaluru-3', 'The Bull Ring', 'Field', '120, Central Jail Road, Electronic City, Bengaluru, Karnataka 560100', 'Bengaluru', 'Electronic City', 'Dedicated football turf with excellent lighting for night games.', 4.50, 50, 0, 0, 'football turf', NULL, '[]', '[]', 'Active'),
('fac-bengaluru-4', 'Nisha Millet Swimming Academy', 'Pool', 'Xavier Layout, South End Circle, Bengaluru, Karnataka 560004', 'Bengaluru', 'Jayanagar', 'Top-tier swimming academy with a temperature-controlled pool.', 4.80, 40, 1, 1, 'swimming pool', NULL, '[]', '[]', 'Active'),
('fac-bengaluru-5', 'Prakash Padukone Badminton Academy', 'Court', '4th Main, 17th Cross, Malleshwaram, Bengaluru, Karnataka 560055', 'Bengaluru', 'Malleswaram', 'Legendary badminton academy with world-class wooden courts.', 4.90, 80, 1, 1, 'badminton court', NULL, '[]', '[]', 'Active'),
('fac-bengaluru-master', 'Kanteerava Indoor Stadium', 'Complex', 'Kasturba Road, Sampangi Rama Nagara, Bengaluru, Karnataka 560001', 'Bengaluru', 'City Center', 'A multi-purpose indoor stadium hosting major national level sporting events.', 4.60, 4000, 1, 1, 'indoor stadium', NULL, '[]', '[]', 'Active'),
('fac-chennai-1', 'Marina Arena', 'Field', 'Victoria Hostel Road, Chepauk, Chennai, Tamil Nadu 600005', 'Chennai', 'Chepauk', 'Home of Chennaiyin FC, a state-of-the-art football stadium.', 4.60, 40000, 1, 0, 'football stadium', NULL, '[]', '[]', 'Active'),
('fac-chennai-2', 'SDAT Tennis Stadium', 'Court', 'Lake Area, Nungambakkam, Chennai, Tamil Nadu 600034', 'Chennai', 'Nungambakkam', 'Hosts the ATP Chennai Open, featuring excellent hard courts.', 4.50, 5800, 1, 0, 'tennis stadium', NULL, '[]', '[]', 'Active'),
('fac-chennai-3', 'Velachery Aquatic Complex', 'Pool', 'Velachery Main Road, Velachery, Chennai, Tamil Nadu 600042', 'Chennai', 'Velachery', 'An Olympic-standard swimming pool complex.', 4.40, 200, 0, 0, 'aquatic complex', NULL, '[]', '[]', 'Active'),
('fac-chennai-4', 'Madras Cricket Club', 'Complex', '1, Bells Road, Chepauk, Chennai, Tamil Nadu 600005', 'Chennai', 'Chepauk', 'One of the oldest and most prestigious cricket clubs in India.', 4.70, 3000, 1, 0, 'cricket club', NULL, '[]', '[]', 'Active'),
('fac-chennai-5', 'Dugout-Besant Nagar', 'Box Cricket', '4th Main Road, Besant Nagar, Chennai, Tamil Nadu 600090', 'Chennai', 'Besant Nagar', 'Popular rooftop box cricket arena for fast-paced games.', 4.30, 20, 0, 0, 'rooftop cricket', NULL, '[]', '[]', 'Active'),
('fac-chennai-master', 'Jawaharlal Nehru Stadium, Chennai', 'Complex', 'Sydenhams Road, Periyamet, Chennai, Tamil Nadu 600003', 'Chennai', 'Periyamet', 'A major multi-purpose stadium used for athletics and football.', 4.50, 40000, 1, 0, 'multi-purpose stadium', NULL, '[]', '[]', 'Active'),
(`rental_equipment`) VALUES
('eq-1', 'Cricket Bat', 'Kashmir Willow, suitable for leather ball', 200.00, 'per_hour', 10),
('eq-2', 'Leather Ball', 'SG Test, 4-piece leather ball', 150.00, 'per_booking', 20),
('eq-3', 'Tennis Racquet', 'Standard adult size, strung', 250.00, 'per_hour', 15),
('eq-4', 'Tennis Balls', 'Can of 3 balls', 100.00, 'per_booking', 50),
('eq-5', 'Football', 'Standard size 5 football', 100.00, 'per_hour', 10),
('eq-6', 'Badminton Racquet', 'Graphite body, lightweight', 150.00, 'per_hour', 20),
('eq-7', 'Shuttlecock', 'Feather shuttle, tube of 6', 200.00, 'per_booking', 40),
('eq-8', 'Swimming Goggles', 'Anti-fog, UV protection', 50.00, 'per_booking', 30),
('eq-9', 'Swimming Cap', 'Silicone swimming cap', 50.00, 'per_booking', 30);
('fac-delhi-1', 'Thyagaraj Sports Complex', 'Complex', 'Thyagaraj Marg, INA Colony, New Delhi, Delhi 110023', 'Delhi', 'INA Colony', 'A green and modern sports complex with facilities for various indoor sports.', 4.50, 5000, 1, 1, 'indoor sports complex', NULL, '[]', '[]', 'Active'),
('fac-delhi-2', 'Siri Fort Sports Complex', 'Complex', 'August Kranti Marg, Khel Gaon, New Delhi, Delhi 110049', 'Delhi', 'Siri Fort', 'One of the most popular DDA sports complexes with a wide range of facilities.', 4.40, 2000, 1, 1, 'dda sports complex', NULL, '[]', '[]', 'Active'),
('fac-delhi-3', 'R.K. Khanna Tennis Complex', 'Court', '1, August Kranti Marg, Safdarjung Enclave, New Delhi, Delhi 110029', 'Delhi', 'Safdarjung', 'The national tennis centre of India with multiple floodlit hard courts.', 4.60, 5000, 1, 0, 'tennis complex', NULL, '[]', '[]', 'Active'),
('fac-delhi-4', 'Dr. Syama Prasad Mookerjee Swimming Pool Complex', 'Pool', 'Central Ridge Forest Area, Talkatora Garden, New Delhi, Delhi 110001', 'Delhi', 'Talkatora', 'An Olympic-sized swimming pool that has hosted Commonwealth Games events.', 4.30, 2500, 0, 1, 'olympic swimming pool', NULL, '[]', '[]', 'Active'),
('fac-delhi-5', 'Tricky Taka', 'Field', '25, C-Block, Kirti Nagar, New Delhi, Delhi 110015', 'Delhi', 'Kirti Nagar', 'Rooftop 5-a-side football turf with a great view.', 4.70, 20, 0, 0, 'rooftop football', NULL, '[]', '[]', 'Active'),
('fac-delhi-master', 'Jawaharlal Nehru Stadium, Delhi', 'Complex', 'Pragati Vihar, New Delhi, Delhi 110003', 'Delhi', 'Pragati Vihar', 'A massive multi-purpose stadium, the 4th largest in India.', 4.50, 60254, 1, 0, 'large stadium delhi', NULL, '[]', '[]', 'Active'),
('fac-hyderabad-1', 'Gachibowli Indoor Stadium', 'Complex', 'Miyapur Rd, Gachibowli, Hyderabad, Telangana 500032', 'Hyderabad', 'Gachibowli', 'A world-class indoor stadium with facilities for badminton, basketball, and more.', 4.50, 5000, 1, 1, 'indoor stadium hyderabad', NULL, '[]', '[]', 'Active'),
('fac-hyderabad-2', 'Lal Bahadur Shastri Stadium', 'Field', 'Fateh Maidan, Basheer Bagh, Hyderabad, Telangana 500001', 'Hyderabad', 'Basheer Bagh', 'A historic cricket ground that has hosted numerous international matches.', 4.40, 25000, 1, 0, 'cricket stadium', NULL, '[]', '[]', 'Active'),
('fac-hyderabad-3', 'Pullela Gopichand Badminton Academy', 'Court', 'ISB Rd, Gachibowli, Hyderabad, Telangana 500032', 'Hyderabad', 'Gachibowli', 'The premier badminton training facility in India, home to many champions.', 4.80, 100, 1, 1, 'badminton academy', NULL, '[]', '[]', 'Active'),
('fac-hyderabad-4', 'Hotfut', 'Field', 'Whitefields, HITEC City, Hyderabad, Telangana 500081', 'Hyderabad', 'HITEC City', 'Popular chain of football turfs, perfect for 5v5 or 7v7 games.', 4.30, 40, 0, 0, 'football turf hitec city', NULL, '[]', '[]', 'Active'),
('fac-hyderabad-5', 'GHMC Swimming Pool', 'Pool', 'Vinayaka Nagar, Kukatpally, Hyderabad, Telangana 500072', 'Hyderabad', 'Kukatpally', 'A well-maintained public swimming pool.', 4.10, 100, 0, 0, 'public swimming pool', NULL, '[]', '[]', 'Active'),
('fac-hyderabad-master', 'G. M. C. Balayogi Athletic Stadium', 'Complex', 'Miyapur Rd, Gachibowli, Hyderabad, Telangana 500032', 'Hyderabad', 'Gachibowli', 'Also known as Gachibowli Athletic Stadium, a modern multi-purpose venue.', 4.60, 30000, 1, 0, 'athletics stadium', NULL, '[]', '[]', 'Active'),
('fac-kolkata-1', 'Eden Gardens', 'Field', 'Maidan, B.B.D. Bagh, Kolkata, West Bengal 700021', 'Kolkata', 'Maidan', 'The most iconic cricket stadium in India, a pilgrimage for cricket fans.', 4.80, 68000, 1, 0, 'cricket stadium kolkata', NULL, '[]', '[]', 'Active'),
('fac-kolkata-2', 'Netaji Indoor Stadium', 'Complex', 'Eden Gardens, B.B.D. Bagh, Kolkata, West Bengal 700021', 'Kolkata', 'Maidan', 'An indoor sporting arena that hosts a variety of events.', 4.50, 12000, 1, 1, 'indoor arena', NULL, '[]', '[]', 'Active'),
('fac-kolkata-3', 'Rabindra Sarobar Stadium', 'Field', 'Southern Avenue, Rabindra Sarobar, Kolkata, West Bengal 700029', 'Kolkata', 'Rabindra Sarobar', 'A multi-use stadium primarily used for football matches.', 4.30, 22000, 0, 0, 'football stadium south kolkata', NULL, '[]', '[]', 'Active'),
('fac-kolkata-4', 'The Calcutta Racket Club', 'Court', '4, Sudder Street, New Market Area, Kolkata, West Bengal 700016', 'Kolkata', 'New Market', 'A historic club with excellent squash and tennis facilities.', 4.60, 100, 0, 1, 'squash court', NULL, '[]', '[]', 'Active'),
('fac-kolkata-5', 'New Town Business Club', 'Pool', 'Street Number 21, Action Area 1D, New Town, Kolkata, West Bengal 700156', 'Kolkata', 'New Town', 'Features a rooftop swimming pool with stunning views of the city.', 4.40, 50, 1, 0, 'rooftop swimming pool', NULL, '[]', '[]', 'Active'),
('fac-kolkata-master', 'Vivekananda Yuba Bharati Krirangan', 'Complex', 'JB Block, Sector III, Bidhannagar, Kolkata, West Bengal 700098', 'Kolkata', 'Salt Lake', 'Also known as Salt Lake Stadium, it is the largest stadium in India by seating capacity.', 4.70, 85000, 1, 0, 'salt lake stadium', NULL, '[]', '[]', 'Active'),
('fac-mumbai-1', 'Wankhede Stadium', 'Field', 'Vinoo Mankad Rd, Churchgate, Mumbai, Maharashtra 400020', 'Mumbai', 'Churchgate', 'An international cricket stadium, home to the Mumbai Indians.', 4.70, 33108, 1, 0, 'cricket stadium mumbai', NULL, '[]', '[]', 'Active'),
('fac-mumbai-2', 'Andheri Sports Complex', 'Complex', 'Veera Desai Rd, Azad Nagar, Andheri (W), Mumbai, Maharashtra 400053', 'Mumbai', 'Andheri West', 'A multi-purpose facility with a football stadium and indoor courts.', 4.30, 18000, 1, 0, 'sports complex andheri', NULL, '[]', '[]', 'Active'),
('fac-mumbai-3', 'National Sports Club of India', 'Complex', 'Lala Lajpatrai Marg, Worli, Mumbai, Maharashtra 400018', 'Mumbai', 'Worli', 'A prestigious club with indoor and outdoor facilities, including a stadium.', 4.50, 5000, 1, 1, 'sports club worli', NULL, '[]', '[]', 'Active'),
('fac-mumbai-4', 'Dadar Club', 'Court', 'Lane No.3, Dadar (E), Mumbai, Maharashtra 400014', 'Mumbai', 'Dadar', 'A well-known club with excellent badminton and tennis courts.', 4.40, 200, 0, 1, 'badminton court dadar', NULL, '[]', '[]', 'Active'),
('fac-mumbai-5', 'Turf 5', 'Field', 'St. Joseph\'s School, Orlem, Malad West, Mumbai, Maharashtra 400064', 'Mumbai', 'Malad West', 'A popular football turf for local leagues and practice sessions.', 4.20, 30, 0, 0, 'football turf malad', NULL, '[]', '[]', 'Active'),
('fac-mumbai-master', 'D.Y. Patil Sports Stadium', 'Complex', 'Sector 7, Nerul, Navi Mumbai, Maharashtra 400706', 'Mumbai', 'Navi Mumbai', 'A modern cricket and football stadium that has hosted IPL finals and international concerts.', 4.60, 55000, 1, 0, 'dy patil stadium', NULL, '[]', '[]', 'Active'),
('fac-pune-1', 'Deccan Gymkhana Club', 'Complex', 'CS No. 759, 760, Talim Pavilion, Deccan Gymkhana, Pune, Maharashtra 411004', 'Pune', 'Deccan', 'One of the oldest and most renowned clubs in Pune, offering a multitude of sports.', 4.50, 1000, 1, 0, 'heritage sports club', NULL, '[]', '[]', 'Active'),
('fac-pune-2', 'Hotfut', 'Field', 'Mundhwa - Kharadi Rd, near Zensar, EON Free Zone, Kharadi, Pune, Maharashtra 411014', 'Pune', 'Kharadi', 'Popular football turf with multiple pitches for 5-a-side and 7-a-side games.', 4.30, 50, 0, 0, 'football turf kharadi', NULL, '[]', '[]', 'Active'),
('fac-pune-3', 'NMSA, Balewadi', 'Pool', 'Inside Shree Shiv Chhatrapati Sports Complex, Balewadi, Pune, Maharashtra 411045', 'Pune', 'Balewadi', 'An Olympic-size swimming pool with excellent coaching facilities.', 4.60, 100, 0, 1, 'swimming pool balewadi', NULL, '[]', '[]', 'Active'),
('fac-pune-4', 'Pawar Public School, Hadapsar', 'Court', 'Amanora Park Town, Hadapsar, Pune, Maharashtra 411028', 'Pune', 'Hadapsar', 'Offers well-maintained basketball and tennis courts for public booking.', 4.20, 60, 0, 0, 'basketball court hadapsar', NULL, '[]', '[]', 'Active'),
('fac-pune-5', 'Action Arena', 'Box Cricket', 'Sr. No. 129/2, behind Hotel Green Park, Baner, Pune, Maharashtra 411045', 'Pune', 'Baner', 'A dedicated box cricket arena, perfect for fast-paced corporate and friendly matches.', 4.40, 20, 0, 0, 'box cricket baner', NULL, '[]', '[]', 'Active'),
('fac-pune-master', 'Shree Shiv Chhatrapati Sports Complex', 'Complex', 'National Games Park, Mahalunge, Balewadi, Pune, Maharashtra 411045', 'Pune', 'Balewadi', 'A massive, international-standard complex that has hosted the Commonwealth Youth Games.', 4.60, 11000, 1, 1, 'sports complex balewadi', 'owner-1', '[]', '[]', 'Active');

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
('fac-pune-master', 'amenity-1'),
('fac-pune-master', 'amenity-2'),
('fac-pune-master', 'amenity-3'),
('fac-pune-master', 'amenity-4'),
('fac-pune-master', 'amenity-5'),
('fac-pune-master', 'amenity-6'),
('fac-pune-master', 'amenity-7'),
('fac-pune-master', 'amenity-8');


-- --------------------------------------------------------

--
-- Table structure for table `facility_equipment`
--

CREATE TABLE `facility_equipment` (
  `facilityId` varchar(255) NOT NULL,
  `equipmentId` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `facility_equipment`
--

INSERT INTO `facility_equipment` (`facilityId`, `equipmentId`) VALUES
('fac-pune-master', 'eq-1'),
('fac-pune-master', 'eq-2'),
('fac-pune-master', 'eq-3'),
('fac-pune-master', 'eq-4'),
('fac-pune-master', 'eq-5'),
('fac-pune-master', 'eq-6'),
('fac-pune-master', 'eq-7'),
('fac-pune-master', 'eq-8'),
('fac-pune-master', 'eq-9'),
('fac-pune-1', 'eq-3'),
('fac-pune-1', 'eq-4'),
('fac-pune-2', 'eq-5');

-- --------------------------------------------------------

--
-- Table structure for table `facility_operating_hours`
--

CREATE TABLE `facility_operating_hours` (
  `facilityId` varchar(255) NOT NULL,
  `day` enum('Mon','Tue','Wed','Thu','Fri','Sat','Sun') NOT NULL,
  `open` time NOT NULL,
  `close` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `facility_operating_hours`
--

INSERT INTO `facility_operating_hours` (`facilityId`, `day`, `open`, `close`) VALUES
('fac-pune-master', 'Mon', '06:00:00', '22:00:00'),
('fac-pune-master', 'Tue', '06:00:00', '22:00:00'),
('fac-pune-master', 'Wed', '06:00:00', '22:00:00'),
('fac-pune-master', 'Thu', '06:00:00', '22:00:00'),
('fac-pune-master', 'Fri', '06:00:00', '23:00:00'),
('fac-pune-master', 'Sat', '07:00:00', '23:00:00'),
('fac-pune-master', 'Sun', '07:00:00', '21:00:00');

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
('fac-pune-master', 'sport-1'),
('fac-pune-master', 'sport-2'),
('fac-pune-master', 'sport-3'),
('fac-pune-master', 'sport-4'),
('fac-pune-master', 'sport-5'),
('fac-pune-1', 'sport-2'),
('fac-pune-1', 'sport-5'),
('fac-pune-2', 'sport-3'),
('fac-pune-3', 'sport-4'),
('fac-pune-4', 'sport-5'),
('fac-pune-4', 'sport-6'),
('fac-pune-5', 'sport-1');

-- --------------------------------------------------------

--
-- Table structure for table `facility_sport_prices`
--

CREATE TABLE `facility_sport_prices` (
  `facilityId` varchar(255) NOT NULL,
  `sportId` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `pricingModel` enum('per_hour_flat','per_hour_per_person') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `facility_sport_prices`
--

INSERT INTO `facility_sport_prices` (`facilityId`, `sportId`, `price`, `pricingModel`) VALUES
('fac-pune-master', 'sport-1', 4000.00, 'per_hour_flat'),
('fac-pune-master', 'sport-2', 1500.00, 'per_hour_flat'),
('fac-pune-master', 'sport-3', 3500.00, 'per_hour_flat'),
('fac-pune-master', 'sport-4', 500.00, 'per_hour_per_person'),
('fac-pune-master', 'sport-5', 1000.00, 'per_hour_flat'),
('fac-pune-1', 'sport-2', 1200.00, 'per_hour_flat'),
('fac-pune-1', 'sport-5', 800.00, 'per_hour_flat'),
('fac-pune-2', 'sport-3', 2500.00, 'per_hour_flat'),
('fac-pune-3', 'sport-4', 400.00, 'per_hour_per_person'),
('fac-pune-4', 'sport-5', 700.00, 'per_hour_flat'),
('fac-pune-4', 'sport-6', 750.00, 'per_hour_flat'),
('fac-pune-5', 'sport-1', 2000.00, 'per_hour_flat');

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
  `interestedUserIds` text DEFAULT NULL,
  `skillLevel` enum('Any','Beginner','Intermediate','Advanced') DEFAULT 'Any',
  `playersNeeded` int(11) DEFAULT NULL,
  `preferredTime` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `lfg_requests`
--

INSERT INTO `lfg_requests` (`id`, `userId`, `sportId`, `facilityId`, `facilityName`, `notes`, `createdAt`, `status`, `interestedUserIds`, `skillLevel`, `playersNeeded`, `preferredTime`) VALUES
(1, 'user-3', 'sport-3', 'fac-pune-2', 'Hotfut', 'Need 5 more players for a friendly 7-a-side match this Saturday evening.', '2024-06-14 18:00:00', 'open', '[\"user-4\"]', 'Intermediate', 5, 'Saturday Evening');

-- --------------------------------------------------------

--
-- Table structure for table `membership_plans`
--

CREATE TABLE `membership_plans` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `pricePerMonth` decimal(10,2) NOT NULL,
  `benefits` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `membership_plans`
--

INSERT INTO `membership_plans` (`id`, `name`, `pricePerMonth`, `benefits`) VALUES
(1, 'Basic', 0.00, '[\"Access to all facilities\",\"Standard booking rates\",\"Email notifications\"]'),
(2, 'Premium', 999.00, '[\"5% discount on all bookings\",\"Priority booking slots\",\"Advanced analytics\",\"Cancel bookings up to 12 hours before\"]'),
(3, 'Pro', 2499.00, '[\"15% discount on all bookings\",\"Free cancellation anytime\",\"Exclusive access to Pro-level events\",\"Dedicated support line\"]');

-- --------------------------------------------------------

--
-- Table structure for table `pricing_rules`
--

CREATE TABLE `pricing_rules` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `facilityIds` text DEFAULT NULL,
  `daysOfWeek` text DEFAULT NULL,
  `timeRange` text DEFAULT NULL,
  `dateRange` text DEFAULT NULL,
  `adjustmentType` enum('percentage_increase','percentage_decrease','fixed_increase','fixed_decrease','fixed_price') NOT NULL,
  `value` decimal(10,2) NOT NULL,
  `priority` int(11) DEFAULT 100,
  `isActive` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `pricing_rules`
--

INSERT INTO `pricing_rules` (`id`, `name`, `description`, `facilityIds`, `daysOfWeek`, `timeRange`, `dateRange`, `adjustmentType`, `value`, `priority`, `isActive`) VALUES
(1, 'Weekend Evening Surge', 'Increase price for popular weekend evening slots', NULL, '[\"Fri\",\"Sat\"]', '{\"start\":\"18:00\",\"end\":\"22:00\"}', NULL, 'percentage_increase', 20.00, 10, 1),
(2, 'Weekday Morning Discount', 'Discount for off-peak morning hours on weekdays', NULL, '[\"Mon\",\"Tue\",\"Wed\",\"Thu\",\"Fri\"]', '{\"start\":\"08:00\",\"end\":\"11:00\"}', NULL, 'percentage_decrease', 15.00, 10, 1);

-- --------------------------------------------------------

--
-- Table structure for table `promotion_rules`
--

CREATE TABLE `promotion_rules` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `code` varchar(50) DEFAULT NULL,
  `discountType` enum('percentage','fixed_amount') NOT NULL,
  `discountValue` decimal(10,2) NOT NULL,
  `startDate` date DEFAULT NULL,
  `endDate` date DEFAULT NULL,
  `usageLimit` int(11) DEFAULT NULL,
  `usageLimitPerUser` int(11) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `promotion_rules`
--

INSERT INTO `promotion_rules` (`id`, `name`, `description`, `code`, `discountType`, `discountValue`, `startDate`, `endDate`, `usageLimit`, `usageLimitPerUser`, `isActive`) VALUES
(1, 'First Booking Discount', '10% off for all new users on their first booking.', 'FIRST10', 'percentage', 10.00, NULL, NULL, NULL, 1, 1),
(2, 'Monsoon Mania', 'Flat 200 INR off on all bookings during July.', 'MONSOON200', 'fixed_amount', 200.00, '2024-07-01', '2024-07-31', NULL, NULL, 1);

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
  `stock` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `rental_equipment`
--

INSERT INTO `rental_equipment` (`id`, `name`, `description`, `pricePerItem`, `priceType`, `stock`) VALUES
('eq-1', 'Cricket Bat', 'Kashmir Willow, suitable for leather ball', 200.00, 'per_hour', 10),
('eq-2', 'Leather Ball', 'SG Test, 4-piece leather ball', 150.00, 'per_booking', 20),
('eq-3', 'Tennis Racquet', 'Standard adult size, strung', 250.00, 'per_hour', 15),
('eq-4', 'Tennis Balls', 'Can of 3 balls', 100.00, 'per_booking', 50),
('eq-5', 'Football', 'Standard size 5 football', 100.00, 'per_hour', 10),
('eq-6', 'Badminton Racquet', 'Graphite body, lightweight', 150.00, 'per_hour', 20),
('eq-7', 'Shuttlecock', 'Feather shuttle, tube of 6', 200.00, 'per_booking', 40),
('eq-8', 'Swimming Goggles', 'Anti-fog, UV protection', 50.00, 'per_booking', 30),
('eq-9', 'Swimming Cap', 'Silicone swimming cap', 50.00, 'per_booking', 30);


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
  `rating` int(11) NOT NULL,
  `comment` text NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `bookingId` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `facilityId`, `userId`, `userName`, `userAvatar`, `isPublicProfile`, `rating`, `comment`, `createdAt`, `bookingId`) VALUES
(1, 'fac-pune-master', 'user-2', 'Bob Johnson', 'https://i.pravatar.cc/150?u=bob', 1, 5, 'Absolutely fantastic complex. The football turf is world-class and the floodlights are brilliant. Worth every penny.', '2024-06-12 20:00:00', 'booking-1');

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
('sport-1', 'Cricket', 'Dribbble', 'https://picsum.photos/seed/cricket/400/300', 'cricket match'),
('sport-2', 'Tennis', 'Feather', 'https://picsum.photos/seed/tennis/400/300', 'tennis court'),
('sport-3', 'Football', 'Goal', 'https://picsum.photos/seed/football/400/300', 'football game'),
('sport-4', 'Swimming', 'Bike', 'https://picsum.photos/seed/swimming/400/300', 'swimming pool'),
('sport-5', 'Badminton', 'Dices', 'https://picsum.photos/seed/badminton/400/300', 'badminton racket'),
('sport-6', 'Basketball', 'Dribbble', 'https://picsum.photos/seed/basketball/400/300', 'basketball hoop');

-- --------------------------------------------------------

--
-- Table structure for table `teams`
--

CREATE TABLE `teams` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `sportId` varchar(255) NOT NULL,
  `captainId` varchar(255) NOT NULL,
  `memberIds` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `teams`
--

INSERT INTO `teams` (`id`, `name`, `sportId`, `captainId`, `memberIds`) VALUES
(1, 'Pune Strikers', 'sport-1', 'user-2', '[\"user-2\", \"user-3\", \"user-4\"]');

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
  `joinedAt` datetime NOT NULL,
  `teamIds` text DEFAULT NULL,
  `isProfilePublic` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `profilePictureUrl`, `dataAiHint`, `preferredSports`, `favoriteFacilities`, `membershipLevel`, `loyaltyPoints`, `achievements`, `bio`, `preferredPlayingTimes`, `skillLevels`, `role`, `status`, `joinedAt`, `teamIds`, `isProfilePublic`) VALUES
('admin-1', 'Admin User', 'admin@sportsarena.com', 'admin123', '+919876543210', 'https://i.pravatar.cc/150?u=admin', 'admin user', '[]', '[]', 'Pro', 1000, '[]', 'The primary administrator for the Sports Arena platform.', 'Weekdays', '[]', 'Admin', 'Active', '2024-01-01 09:00:00', NULL, 1),
('owner-1', 'Owner User', 'owner@sportsarena.com', 'owner123', '+919876543219', 'https://i.pravatar.cc/150?u=owner', 'facility owner', '[]', '[]', 'Premium', 500, '[]', 'Owner of the Shree Shiv Chhatrapati Sports Complex.', 'All Day', '[]', 'FacilityOwner', 'Active', '2024-01-15 10:00:00', NULL, 1),
('user-2', 'Bob Johnson', 'bob@example.com', 'password123', '+919876543211', 'https://i.pravatar.cc/150?u=bob', 'male user profile', '[]', '[]', 'Premium', 250, '[]', 'Cricket enthusiast and weekend warrior.', 'Weekends', '[{\"sportId\": \"sport-1\", \"sportName\": \"Cricket\", \"level\": \"Intermediate\"}]', 'User', 'Active', '2024-03-01 11:00:00', NULL, 1),
('user-3', 'Charlie Brown', 'charlie@example.com', 'password123', '+919876543212', 'https://i.pravatar.cc/150?u=charlie', 'male user avatar', '[]', '[]', 'Basic', 100, '[]', 'Loves a good game of football.', 'Evenings', '[{\"sportId\": \"sport-3\", \"sportName\": \"Football\", \"level\": \"Beginner\"}]', 'User', 'Active', '2024-04-20 15:00:00', NULL, 1),
('user-4', 'Diana Prince', 'diana@example.com', 'password123', '+919876543213', 'https://i.pravatar.cc/150?u=diana', 'female user profile', '[]', '[]', 'Basic', 50, '[]', 'Just getting into sports, looking for partners to play with.', 'Anytime', '[]', 'User', 'Active', '2024-05-25 18:00:00', NULL, 0);

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
  ADD KEY `facilityId` (`facilityId`),
  ADD KEY `userId` (`userId`);

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
    ADD PRIMARY KEY (`facilityId`, `equipmentId`),
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
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `challenges`
--
ALTER TABLE `challenges`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

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
-- AUTO_INCREMENT for table `pricing_rules`
--
ALTER TABLE `pricing_rules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `promotion_rules`
--
ALTER TABLE `promotion_rules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`facilityId`) REFERENCES `facilities` (`id`) ON DELETE CASCADE;

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
-- Constraints for table `facility_amenities`
--
ALTER TABLE `facility_amenities`
  ADD CONSTRAINT `facility_amenities_ibfk_1` FOREIGN KEY (`facilityId`) REFERENCES `facilities` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `facility_amenities_ibfk_2` FOREIGN KEY (`amenityId`) REFERENCES `amenities` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `facility_equipment`
--
ALTER TABLE `facility_equipment`
  ADD CONSTRAINT `facility_equipment_ibfk_1` FOREIGN KEY (`facilityId`) REFERENCES `facilities` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `facility_equipment_ibfk_2` FOREIGN KEY (`equipmentId`) REFERENCES `rental_equipment` (`id`) ON DELETE CASCADE;


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
  ADD CONSTRAINT `facility_sport_prices_ibfk_1` FOREIGN KEY (`facilityId`) REFERENCES `facilities` (`id`) ON DELETE CASCADE;

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

--
-- Constraints for table `teams`
--
ALTER TABLE `teams`
  ADD CONSTRAINT `teams_ibfk_1` FOREIGN KEY (`captainId`) REFERENCES `users` (`id`) ON DELETE CASCADE;
