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
  `id` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `iconName` VARCHAR(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `amenities`
--

INSERT INTO `amenities` (`id`, `name`, `iconName`) VALUES
('amenity-1', 'Parking', 'ParkingCircle'),
('amenity-2', 'Lockers', 'Lock'),
('amenity-3', 'Showers', 'ShowerHead'),
('amenity-4', 'Wi-Fi', 'Wifi'),
('amenity-5', 'First Aid', 'Feather'),
('amenity-6', 'Refreshments', 'Utensils'),
('amenity-7', 'Equipment Rental', 'PackageSearch'),
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
  `content` TEXT NOT NULL,
  `authorName` VARCHAR(255) NOT NULL,
  `authorAvatarUrl` VARCHAR(255) DEFAULT NULL,
  `publishedAt` DATETIME NOT NULL,
  `tags` JSON DEFAULT NULL,
  `isFeatured` TINYINT(1) DEFAULT 0,
  `dataAiHint` VARCHAR(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `blog_posts`
--

INSERT INTO `blog_posts` (`id`, `slug`, `title`, `excerpt`, `content`, `authorName`, `authorAvatarUrl`, `publishedAt`, `tags`, `isFeatured`, `dataAiHint`) VALUES
('blog-1', 'improve-your-cricket-batting', '5 Drills to Drastically Improve Your Cricket Batting', 'Whether you are a beginner or a seasoned player, these five drills will help you refine your technique, improve your timing, and score more runs.', '<h2>Introduction</h2><p>Cricket is a game of skill, and batting is its most celebrated art. To become a proficient batsman, one needs dedication, practice, and the right drills. Here are five drills that can help you improve your batting skills.</p><h3>1. The Hanging Ball Drill</h3><p>This is a classic drill that helps improve hand-eye coordination and timing. Hang a cricket ball in a sock or a net from a height where it reaches your waist. Practice different shots like the drive, cut, and pull. Focus on hitting the ball in the middle of the bat.</p><h3>2. Shadow Batting</h3><p>Shadow batting is an excellent way to work on your technique without the pressure of a bowler. Stand in front of a mirror and practice your stance, backlift, and follow-through. This helps in building muscle memory and perfecting your form.</p><h3>3. The Wall Rebound Drill</h3><p>Throw a tennis ball against a wall and play a shot as it rebounds. This drill is great for improving reflexes and reaction time, which are crucial for facing fast bowlers.</p><h3>4. Single-Handed Batting</h3><p>Practice batting with only your top hand and then with only your bottom hand. This helps in strengthening your wrists and understanding the role each hand plays in a shot. The top hand is for control, and the bottom hand provides power.</p><h3>5. Net Practice Against Various Bowlers</h3><p>There is no substitute for facing real bowlers. Practice in the nets against different types of bowlers – fast, spin, and medium pace. This will help you adapt to different speeds and styles of bowling.</p><h2>Conclusion</h2><p>Consistency is key. Incorporate these drills into your regular practice sessions, and you will see a significant improvement in your batting. Happy cricketing!</p>', 'Rohan Sharma', 'https://i.pravatar.cc/150?u=rohan', '2024-05-10 10:00:00', '[\"Cricket\", \"Batting\", \"Drills\"]', 1, 'cricket batting practice'),
('blog-2', 'choosing-the-right-running-shoes', 'How to Choose the Right Running Shoes', 'The right pair of running shoes can make a world of difference. Learn about the key factors to consider, from pronation to cushioning, to find the perfect fit for your feet.', '<p>Choosing the right running shoes is a critical step for any runner, whether you are a seasoned marathoner or just starting out. The right shoe can prevent injuries, improve performance, and make your runs more comfortable. Here are some factors to consider:</p><h4>1. Understand Your Foot Type</h4><p>Your foot type primarily determines how you run. You can have a neutral arch, a low arch (flat feet), or a high arch. A simple way to check this is the "wet test": wet your foot, step on a piece of paper, and examine the footprint. A full footprint suggests flat feet, while a very narrow footprint suggests a high arch.</p><h4>2. Know Your Pronation</h4><p>Pronation is the way your foot rolls inward for impact distribution upon landing. Overpronation (foot rolls inward too much) and underpronation (foot doesn''t roll inward enough) can lead to injuries. A specialty running store can analyze your gait to determine your pronation type and recommend shoes accordingly.</p><h4>3. Cushioning Level</h4><p>The amount of cushioning you need depends on your personal preference and the type of running you do. Minimalist shoes have very little cushioning, while maximum-cushion shoes offer a plush ride. Consider the surface you run on – you might want more cushioning for roads and less for trails.</p><h4>4. Heel-to-Toe Drop</h4><p>This is the difference in height between the heel and the forefoot. A higher drop can be beneficial for runners who land on their heels, while a lower drop encourages a midfoot or forefoot strike. The right drop for you depends on your running form.</p><h4>5. Try Before You Buy</h4><p>Always try on shoes before buying them. It''s best to shop for running shoes in the evening when your feet are slightly swollen. Wear the same type of socks you run in and, if possible, go for a short jog in the store.</p>', 'Priya Mehta', 'https://i.pravatar.cc/150?u=priya', '2024-05-15 14:30:00', '[\"Running\", \"Shoes\", \"Fitness\"]', 0, 'running shoes selection'),
('blog-3', 'benefits-of-swimming', 'Dive In: The Surprising Health Benefits of Swimming', 'Swimming is more than just a recreational activity; it''s a full-body workout with numerous health benefits. Discover how swimming can improve your cardiovascular health, build muscle, and reduce stress.', '<p>Swimming is often called the perfect workout. But what makes it so beneficial? Here’s a look at some of the key health benefits of taking a regular dip in the pool.</p><h4>1. Full-Body Workout</h4><p>Swimming engages almost every major muscle group in your body. From your core to your arms and legs, you get a comprehensive workout without putting excessive strain on any single part of your body.</p><h4>2. Low-Impact Exercise</h4><p>The buoyancy of water supports your body, making swimming a low-impact exercise. This makes it an excellent choice for people with arthritis, joint pain, or those recovering from injuries.</p><h4>3. Improves Cardiovascular Health</h4><p>Swimming is a great aerobic exercise that strengthens your heart and improves its ability to pump blood. Regular swimming can help lower blood pressure and improve circulation.</p><h4>4. Builds Endurance and Muscle Strength</h4><p>Water resistance is about 12 times greater than air resistance. Every kick and pull is a resistance exercise, which helps in building muscle strength and endurance.</p><h4>5. Stress Reduction</h4><p>The rhythmic and meditative nature of swimming can be incredibly relaxing. The sound of the water and the focus on your breathing can help you disconnect from daily stressors and improve your mental well-being.</p>', 'Anjali Rao', 'https://i.pravatar.cc/150?u=anjali', '2024-06-01 11:00:00', '[\"Swimming\", \"Health\", \"Fitness\"]', 0, 'swimming pool health');

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
  `durationHours` INT DEFAULT NULL,
  `numberOfGuests` INT DEFAULT NULL,
  `baseFacilityPrice` DECIMAL(10,2) NOT NULL,
  `equipmentRentalCost` DECIMAL(10,2) NOT NULL,
  `appliedPromotion` JSON DEFAULT NULL,
  `totalPrice` DECIMAL(10,2) NOT NULL,
  `status` ENUM('Confirmed','Pending','Cancelled') NOT NULL,
  `bookedAt` DATETIME NOT NULL,
  `reviewed` TINYINT(1) DEFAULT 0,
  `rentedEquipment` JSON DEFAULT NULL,
  `phoneNumber` VARCHAR(20) DEFAULT NULL,
  `pricingModel` VARCHAR(50) DEFAULT 'per_hour_flat'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `userId`, `facilityId`, `facilityName`, `dataAiHint`, `sportId`, `sportName`, `date`, `startTime`, `endTime`, `durationHours`, `numberOfGuests`, `baseFacilityPrice`, `equipmentRentalCost`, `appliedPromotion`, `totalPrice`, `status`, `bookedAt`, `reviewed`, `rentedEquipment`, `phoneNumber`, `pricingModel`) VALUES
('booking-1', 'user-1', 'facility-pune-1', 'Pune Elite Badminton Courts', 'badminton court', 'sport-2', 'Badminton', '2024-07-20', '18:00:00', '19:00:00', 1, NULL, 600.00, 0.00, NULL, 600.00, 'Confirmed', '2024-07-01 11:05:00', 0, NULL, '9876543210', 'per_hour_flat'),
('booking-2', 'user-2', 'facility-mumbai-master', 'Mumbai Sports Metropolis', 'sports complex', 'sport-1', 'Cricket', '2024-07-21', '10:00:00', '12:00:00', 2, NULL, 2400.00, 0.00, NULL, 2400.00, 'Confirmed', '2024-07-02 14:20:00', 0, NULL, '9876543211', 'per_hour_flat'),
('booking-3', 'user-3', 'facility-delhi-3', 'Delhi Football Den', 'football field', 'sport-3', 'Football', '2024-06-15', '19:00:00', '21:00:00', 2, NULL, 1800.00, 0.00, NULL, 1800.00, 'Confirmed', '2024-06-10 09:00:00', 1, NULL, '9876543212', 'per_hour_flat'),
('booking-4', 'user-1', 'facility-bangalore-2', 'The Net Rippers (Bangalore)', 'basketball court', 'sport-4', 'Basketball', '2024-06-25', '17:00:00', '18:00:00', 1, NULL, 750.00, 0.00, NULL, 750.00, 'Cancelled', '2024-06-20 18:30:00', 0, NULL, '9876543210', 'per_hour_flat'),
('booking-5', 'user-4', 'facility-chennai-4', 'Chennai Swim Club', 'swimming pool', 'sport-5', 'Swimming', '2024-07-22', '08:00:00', '09:00:00', 1, 2, 800.00, 0.00, NULL, 800.00, 'Confirmed', '2024-07-05 12:00:00', 0, NULL, '9876543213', 'per_hour_per_person'),
('booking-6', 'user-2', 'facility-kolkata-master', 'Kolkata Sports Complex', 'sports complex', 'sport-3', 'Football', '2024-08-01', '20:00:00', '22:00:00', 2, NULL, 2600.00, 0.00, NULL, 2600.00, 'Confirmed', '2024-07-10 16:45:00', 0, NULL, '9876543211', 'per_hour_flat'),
('booking-7', 'user-5', 'facility-ahmedabad-1', 'Sabarmati Badminton Hall', 'badminton court', 'sport-2', 'Badminton', '2024-07-28', '19:00:00', '20:00:00', 1, NULL, 500.00, 0.00, '{\"code\": \"FIRSTBOOK\", \"discountAmount\": 50, \"description\": \"First Booking Discount\"}', 450.00, 'Confirmed', '2024-07-11 10:20:00', 0, NULL, '9876543214', 'per_hour_flat');

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
  `createdAt` DATETIME NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `challenges`
--

INSERT INTO `challenges` (`id`, `challengerId`, `opponentId`, `sportId`, `facilityId`, `facilityName`, `proposedDate`, `notes`, `status`, `createdAt`) VALUES
('challenge-1', 'user-1', NULL, 'sport-2', 'facility-pune-1', 'Pune Elite Badminton Courts', '2024-08-10 19:00:00', 'Looking for a competitive singles match. Intermediate level preferred.', 'open', '2024-07-11 15:00:00'),
('challenge-2', 'user-3', 'user-2', 'sport-3', 'facility-mumbai-master', 'Mumbai Sports Metropolis', '2024-08-05 18:00:00', '5-a-side football challenge. Got a team? Bring it on!', 'accepted', '2024-07-12 10:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `facilityId` VARCHAR(255) NOT NULL,
  `facilityName` VARCHAR(255) DEFAULT NULL,
  `sportId` VARCHAR(255) NOT NULL,
  `startDate` DATETIME NOT NULL,
  `endDate` DATETIME NOT NULL,
  `description` TEXT NOT NULL,
  `entryFee` DECIMAL(10,2) DEFAULT NULL,
  `maxParticipants` INT DEFAULT NULL,
  `registeredParticipants` INT DEFAULT 0,
  `imageUrl` VARCHAR(255) DEFAULT NULL,
  `imageDataAiHint` VARCHAR(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `name`, `facilityId`, `facilityName`, `sportId`, `startDate`, `endDate`, `description`, `entryFee`, `maxParticipants`, `registeredParticipants`, `imageUrl`, `imageDataAiHint`) VALUES
('event-1', 'Pune Monsoon Badminton Open', 'facility-pune-master', 'Pune Sportsdome', 'sport-2', '2024-08-15 09:00:00', '2024-08-16 18:00:00', 'Join the most exciting badminton tournament of the season. Categories: Men''s Singles, Women''s Singles, and Mixed Doubles. Prizes worth up to 50,000 INR!', 500.00, 64, 12, 'https://picsum.photos/seed/event1/800/400', 'badminton tournament action'),
('event-2', 'Mumbai Midnight Football League', 'facility-mumbai-master', 'Mumbai Sports Metropolis', 'sport-3', '2024-08-01 20:00:00', '2024-08-31 23:00:00', 'Experience the thrill of football under the lights. A month-long 5-a-side league for corporate teams.', 10000.00, 16, 8, 'https://picsum.photos/seed/event2/800/400', 'football league night'),
('event-3', 'Bangalore Tech-Park Tennis Championship', 'facility-bangalore-master', 'Bangalore Racquet Club', 'sport-6', '2024-09-05 10:00:00', '2024-09-08 17:00:00', 'A competitive tennis tournament for employees of tech parks in Bangalore. Show off your skills on the court!', 800.00, 32, 4, 'https://picsum.photos/seed/event3/800/400', 'tennis championship court');

-- --------------------------------------------------------

--
-- Table structure for table `facilities`
--

CREATE TABLE `facilities` (
  `id` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `type` ENUM('Complex','Court','Field','Studio','Pool','Box Cricket') NOT NULL,
  `address` VARCHAR(255) NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `location` VARCHAR(100) NOT NULL,
  `description` TEXT NOT NULL,
  `rating` DECIMAL(3,2) DEFAULT 0.00,
  `capacity` INT DEFAULT NULL,
  `isPopular` TINYINT(1) DEFAULT 0,
  `isIndoor` TINYINT(1) DEFAULT 0,
  `dataAiHint` VARCHAR(255) DEFAULT NULL,
  `ownerId` VARCHAR(255) DEFAULT NULL,
  `blockedSlots` JSON DEFAULT NULL,
  `maintenanceSchedules` JSON DEFAULT NULL,
  `status` ENUM('Active','PendingApproval','Rejected','Inactive') NOT NULL DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `facilities`
--

INSERT INTO `facilities` (`id`, `name`, `type`, `address`, `city`, `location`, `description`, `rating`, `capacity`, `isPopular`, `isIndoor`, `dataAiHint`, `ownerId`, `blockedSlots`, `maintenanceSchedules`, `status`) VALUES
('facility-ahmedabad-1', 'Sabarmati Badminton Hall', 'Court', '101, Riverfront Road, Ashram Road, Ahmedabad', 'Ahmedabad', 'Ashram Road', 'State-of-the-art badminton facility with wooden courts and excellent lighting.', 4.70, 50, 0, 1, 'badminton court indoor', 'user-owner-1', NULL, NULL, 'Active'),
('facility-ahmedabad-2', 'Kankaria Cricket Ground', 'Field', '202, Maninagar, Ahmedabad', 'Ahmedabad', 'Maninagar', 'A well-maintained cricket ground perfect for corporate and local matches.', 4.50, 200, 1, 0, 'cricket field grass', NULL, NULL, NULL, 'Active'),
('facility-ahmedabad-3', 'Adani SG Highway Football', 'Field', '303, SG Highway, Ahmedabad', 'Ahmedabad', 'SG Highway', 'FIFA-standard turf for 7-a-side football matches.', 4.80, 100, 1, 0, 'football turf night', 'user-owner-1', NULL, NULL, 'Active'),
('facility-ahmedabad-4', 'YMCA Swimming Complex', 'Pool', '404, Law Garden, Ahmedabad', 'Ahmedabad', 'Law Garden', 'Olympic size swimming pool with certified trainers and clean facilities.', 4.60, 150, 1, 1, 'swimming pool olympic', NULL, NULL, NULL, 'Active'),
('facility-ahmedabad-5', 'Racket & Roll Tennis', 'Court', '505, Bopal, Ahmedabad', 'Ahmedabad', 'Bopal', 'Clay courts for a classic tennis experience. Open for all age groups.', 4.40, 40, 0, 0, 'tennis court clay', NULL, NULL, NULL, 'Active'),
('facility-ahmedabad-master', 'TransStadia Arena', 'Complex', 'The Arena, Kankaria Lakefront, Gate No. 3, Ahmedabad', 'Ahmedabad', 'Kankaria', 'A multi-purpose sports complex featuring football, basketball, and indoor sports facilities.', 4.90, 5000, 1, 1, 'sports complex modern', 'user-owner-1', '[]', '[]', 'Active'),
('facility-bangalore-1', 'Whitefield Smashers', 'Court', 'Plot 12, ITPL Main Road, Whitefield, Bangalore', 'Bangalore', 'Whitefield', 'Modern badminton courts with non-marking surfaces, perfect for tech park crowd.', 4.80, 50, 1, 1, 'badminton court modern', NULL, NULL, NULL, 'Active'),
('facility-bangalore-2', 'The Net Rippers (Bangalore)', 'Court', '45, 6th Block, Koramangala, Bangalore', 'Bangalore', 'Koramangala', 'Iconic basketball court with a vibrant community. Great for pickup games.', 4.70, 40, 1, 0, 'basketball court outdoor', NULL, NULL, NULL, 'Active'),
('facility-bangalore-3', 'Koramangala Football Arena', 'Field', 'Near Sony World Signal, 80 Ft Road, Koramangala, Bangalore', 'Bangalore', 'Koramangala', 'High-quality turf for 5-a-side and 7-a-side football. Open 24/7.', 4.90, 80, 1, 0, 'football turf night', 'user-owner-1', NULL, NULL, 'Active'),
('facility-bangalore-4', 'Indiranagar Box Cricket', 'Box Cricket', '33, 100 Ft Road, Indiranagar, Bangalore', 'Bangalore', 'Indiranagar', 'Rooftop box cricket setup with automated scoring and great ambiance.', 4.60, 25, 0, 0, 'box cricket rooftop', NULL, NULL, NULL, 'Active'),
('facility-bangalore-5', 'HSR Layout Aquatics', 'Pool', 'Sector 7, HSR Layout, Bangalore', 'Bangalore', 'HSR Layout', 'Well-maintained swimming pool for both recreational and competitive swimmers.', 4.50, 60, 0, 1, 'swimming pool indoor', NULL, NULL, NULL, 'Active'),
('facility-bangalore-master', 'Bangalore Racquet Club', 'Complex', '10, Vittal Mallya Road, Bangalore', 'Bangalore', 'Vittal Mallya Road', 'A premier sports complex offering world-class facilities for tennis, badminton, and squash.', 4.90, 300, 1, 1, 'sports complex luxury', 'user-owner-1', NULL, NULL, 'Active'),
('facility-chandigarh-1', 'Sector 17 Tennis Courts', 'Court', '17B, Sector 17, Chandigarh', 'Chandigarh', 'Sector 17', 'Well-maintained public tennis courts in the heart of the city.', 4.50, 40, 0, 0, 'tennis court public', NULL, NULL, NULL, 'Active'),
('facility-chandigarh-2', 'Lake Sports Club', 'Complex', 'Sukhna Lake, Sector 1, Chandigarh', 'Chandigarh', 'Sukhna Lake', 'Offers facilities for swimming and water sports with a scenic view.', 4.60, 100, 1, 0, 'swimming lake view', NULL, NULL, NULL, 'Active'),
('facility-chandigarh-3', 'Mohali Cricket Academy', 'Field', 'Phase 9, Sector 63, Mohali, Chandigarh', 'Chandigarh', 'Mohali', 'Professional cricket nets and ground for aspiring cricketers.', 4.70, 150, 1, 0, 'cricket nets practice', NULL, NULL, NULL, 'Active'),
('facility-chandigarh-4', 'Panchkula Badminton Arena', 'Court', 'Sector 5, Panchkula, Chandigarh', 'Chandigarh', 'Panchkula', 'Indoor badminton courts with excellent amenities.', 4.40, 60, 0, 1, 'badminton hall indoor', NULL, NULL, NULL, 'Active'),
('facility-chandigarh-5', 'Zirakpur Football Turf', 'Field', 'Ambala-Chandigarh Expy, Zirakpur, Chandigarh', 'Chandigarh', 'Zirakpur', 'Modern football turf suitable for 6-a-side matches, available day and night.', 4.50, 80, 0, 0, 'football turf evening', NULL, NULL, NULL, 'Active'),
('facility-chandigarh-master', 'Chandigarh Sports Complex', 'Complex', 'Sector 42, Chandigarh', 'Chandigarh', 'Sector 42', 'A large government-run complex with facilities for multiple sports including athletics, swimming, and hockey.', 4.80, 1000, 1, 1, 'sports complex government', NULL, NULL, NULL, 'Active'),
('facility-chennai-1', 'Marina Beach Cricket', 'Field', 'Kamaraj Salai, Marina Beach, Chennai', 'Chennai', 'Marina Beach', 'Casual cricket pitches right by the sea. A unique playing experience.', 4.30, 100, 1, 0, 'beach cricket sunset', NULL, NULL, NULL, 'Active'),
('facility-chennai-2', 'Nungambakkam Tennis Club', 'Court', 'Sterling Road, Nungambakkam, Chennai', 'Chennai', 'Nungambakkam', 'One of the oldest and most prestigious tennis clubs in the city.', 4.80, 60, 1, 0, 'tennis club vintage', NULL, NULL, NULL, 'Active'),
('facility-chennai-3', 'Besant Nagar Badminton', 'Court', '4th Main Road, Besant Nagar, Chennai', 'Chennai', 'Besant Nagar', 'Community indoor badminton courts, popular among local residents.', 4.50, 40, 0, 1, 'badminton court community', NULL, NULL, NULL, 'Active'),
('facility-chennai-4', 'Chennai Swim Club', 'Pool', 'Anna Salai, T. Nagar, Chennai', 'Chennai', 'T. Nagar', 'A premium swimming facility with a temperature-controlled pool.', 4.70, 80, 0, 1, 'swimming pool luxury', NULL, NULL, NULL, 'Active'),
('facility-chennai-5', 'OMR Futbol', 'Field', 'Old Mahabalipuram Road, Sholinganallur, Chennai', 'Chennai', 'OMR', 'Futuristic 5-a-side football facility catering to the IT corridor.', 4.60, 70, 1, 0, 'football arena futuristic', NULL, NULL, NULL, 'Active'),
('facility-chennai-master', 'Jawaharlal Nehru Stadium', 'Complex', 'Sydenhams Road, Periyamet, Chennai', 'Chennai', 'Periyamet', 'A massive stadium complex with facilities for football, athletics, and various indoor games.', 4.90, 10000, 1, 1, 'stadium football night', NULL, NULL, NULL, 'Active'),
('facility-delhi-1', 'Siri Fort Sports Complex', 'Complex', 'August Kranti Marg, Siri Fort, New Delhi', 'Delhi', 'Siri Fort', 'A DDA sports complex with a wide range of facilities including tennis, badminton, and swimming.', 4.70, 500, 1, 1, 'sports complex delhi', NULL, NULL, NULL, 'Active'),
('facility-delhi-2', 'Saket Sports Complex', 'Complex', 'Saket, New Delhi', 'Delhi', 'Saket', 'Another popular DDA complex offering courts for various sports and a swimming pool.', 4.60, 400, 0, 1, 'sports complex community', NULL, NULL, NULL, 'Active'),
('facility-delhi-3', 'Delhi Football Den', 'Field', 'Chattarpur, New Delhi', 'Delhi', 'Chattarpur', 'Dedicated football facility with multiple turfs and a great atmosphere.', 4.80, 150, 1, 0, 'football field night', NULL, NULL, NULL, 'Active'),
('facility-delhi-4', 'Hauz Khas Box Cricket', 'Box Cricket', 'Hauz Khas Village, New Delhi', 'Delhi', 'Hauz Khas', 'A vibrant box cricket setup perfect for fun matches with friends.', 4.50, 30, 0, 0, 'box cricket friends', NULL, NULL, NULL, 'Active'),
('facility-delhi-5', 'Dwarka Badminton Arena', 'Court', 'Sector 11, Dwarka, New Delhi', 'Delhi', 'Dwarka', 'Modern badminton facility serving the large residential area of Dwarka.', 4.40, 60, 0, 1, 'badminton arena indoor', NULL, NULL, NULL, 'Active'),
('facility-delhi-master', 'Thyagaraj Sports Complex', 'Complex', 'INA Colony, New Delhi', 'Delhi', 'INA Colony', 'A green, state-of-the-art indoor stadium with facilities for multiple sports.', 4.90, 5000, 1, 1, 'stadium indoor modern', NULL, NULL, NULL, 'Active'),
('facility-hyderabad-1', 'Gachibowli Indoor Stadium', 'Complex', 'Gachibowli, Hyderabad', 'Hyderabad', 'Gachibowli', 'World-class indoor stadium with facilities for badminton, table tennis, and more.', 4.80, 400, 1, 1, 'stadium indoor badminton', NULL, NULL, NULL, 'Active'),
('facility-hyderabad-2', 'LB Stadium', 'Complex', 'Basheer Bagh, Hyderabad', 'Hyderabad', 'Basheer Bagh', 'A historic stadium in the heart of the city, mainly used for cricket and football.', 4.60, 2000, 0, 0, 'stadium cricket historic', NULL, NULL, NULL, 'Active'),
('facility-hyderabad-3', 'Astro Park', 'Field', 'Jubilee Hills, Hyderabad', 'Hyderabad', 'Jubilee Hills', 'Premium football turf popular among the city''s youth and corporate circles.', 4.70, 100, 1, 0, 'football turf astro', NULL, NULL, NULL, 'Active'),
('facility-hyderabad-4', 'Banjara Hills Swim Centre', 'Pool', 'Road No. 1, Banjara Hills, Hyderabad', 'Hyderabad', 'Banjara Hills', 'An exclusive swimming pool with top-notch amenities.', 4.50, 50, 0, 1, 'swimming pool private', NULL, NULL, NULL, 'Active'),
('facility-hyderabad-5', 'Hi-Tec City Box Cricket', 'Box Cricket', 'Madhapur, Hi-Tec City, Hyderabad', 'Hyderabad', 'Hi-Tec City', 'A popular spot for the IT crowd to unwind with a game of box cricket.', 4.60, 30, 0, 0, 'box cricket rooftop night', NULL, NULL, NULL, 'Active'),
('facility-hyderabad-master', 'GMC Balayogi Athletic Stadium', 'Complex', 'Gachibowli, Hyderabad', 'Hyderabad', 'Gachibowli', 'An ultra-modern stadium primarily used for athletics and football.', 4.90, 30000, 1, 0, 'stadium athletics track', NULL, NULL, NULL, 'Active'),
('facility-jaipur-1', 'Sawai Mansingh Stadium', 'Complex', 'Janpath, Lalkothi, Jaipur', 'Jaipur', 'Lalkothi', 'The main cricket stadium of Jaipur, hosting international and IPL matches.', 4.80, 25000, 1, 0, 'cricket stadium ipl', NULL, NULL, NULL, 'Active'),
('facility-jaipur-2', 'Vaishali Nagar Sports Club', 'Complex', 'Queens Road, Vaishali Nagar, Jaipur', 'Jaipur', 'Vaishali Nagar', 'A local club with facilities for tennis, badminton, and swimming.', 4.50, 200, 0, 1, 'sports club local', NULL, NULL, NULL, 'Active'),
('facility-jaipur-3', 'Pink City Football Ground', 'Field', 'Mansarovar, Jaipur', 'Jaipur', 'Mansarovar', 'A dedicated football ground with a lush green pitch.', 4.60, 150, 1, 0, 'football ground green', NULL, NULL, NULL, 'Active'),
('facility-jaipur-4', 'Jagatpura Badminton Hall', 'Court', 'Jagatpura, Jaipur', 'Jaipur', 'Jagatpura', 'Well-equipped indoor badminton courts for players of all levels.', 4.40, 50, 0, 1, 'badminton court players', NULL, NULL, NULL, 'Active'),
('facility-jaipur-5', 'Raja Park Swimming Pool', 'Pool', 'Raja Park, Jaipur', 'Jaipur', 'Raja Park', 'A popular public swimming pool, perfect for beating the heat.', 4.30, 100, 0, 0, 'swimming pool public', NULL, NULL, NULL, 'Active'),
('facility-jaipur-master', 'Vidhyadhar Nagar Stadium', 'Complex', 'Central Spine, Vidhyadhar Nagar, Jaipur', 'Jaipur', 'Vidhyadhar Nagar', 'A large sports complex with a variety of facilities for the public.', 4.70, 2000, 1, 1, 'stadium public complex', NULL, NULL, NULL, 'Active'),
('facility-kolkata-1', 'Eden Gardens', 'Field', 'BBD Bagh, Kolkata', 'Kolkata', 'BBD Bagh', 'One of the most iconic cricket stadiums in the world.', 4.90, 68000, 1, 0, 'cricket stadium iconic', NULL, NULL, NULL, 'Active'),
('facility-kolkata-2', 'Salt Lake Stadium', 'Field', 'Salt Lake City, Kolkata', 'Kolkata', 'Salt Lake', 'A massive football stadium, home to major ISL clubs.', 4.80, 85000, 1, 0, 'football stadium huge', NULL, NULL, NULL, 'Active'),
('facility-kolkata-3', 'Calcutta Cricket & Football Club', 'Complex', 'Gurusaday Dutta Road, Ballygunge, Kolkata', 'Kolkata', 'Ballygunge', 'A historic club with facilities for cricket, football, tennis, and more.', 4.70, 500, 0, 0, 'sports club historic', NULL, NULL, NULL, 'Active'),
('facility-kolkata-4', 'New Town Box Cricket', 'Box Cricket', 'Action Area I, New Town, Kolkata', 'Kolkata', 'New Town', 'A modern box cricket facility in the rapidly developing area of New Town.', 4.60, 30, 0, 0, 'box cricket modern', NULL, NULL, NULL, 'Active'),
('facility-kolkata-5', 'Hedua Swimming Pool', 'Pool', 'Hedua Park, Kolkata', 'Kolkata', 'Hedua', 'A famous public swimming pool located in a historic park.', 4.40, 200, 0, 0, 'swimming pool historic', NULL, NULL, NULL, 'Active'),
('facility-kolkata-master', 'Kolkata Sports Complex', 'Complex', 'Chowbaga Road, Dhapa, Kolkata', 'Kolkata', 'Dhapa', 'A modern, integrated sports complex offering a wide array of facilities for training and recreation.', 4.80, 2000, 1, 1, 'sports complex integrated', 'user-owner-1', NULL, NULL, 'Active'),
('facility-mumbai-1', 'Andheri Sports Complex', 'Complex', 'Veera Desai Road, Andheri West, Mumbai', 'Mumbai', 'Andheri West', 'A well-known sports complex with facilities for various sports including football, swimming, and tennis.', 4.60, 1000, 1, 1, 'sports complex stadium', 'user-owner-1', NULL, NULL, 'Active'),
('facility-mumbai-2', 'Dadar Shivaji Park', 'Field', 'Shivaji Park, Dadar West, Mumbai', 'Mumbai', 'Dadar', 'A historic ground famous for cricket, nurturing many legendary players.', 4.70, 500, 1, 0, 'cricket ground historic', NULL, NULL, NULL, 'Active'),
('facility-mumbai-3', 'Juhu Box Strikers', 'Box Cricket', 'Juhu Tara Road, Juhu, Mumbai', 'Mumbai', 'Juhu', 'A premium box cricket facility popular among celebrities and locals alike.', 4.80, 30, 0, 0, 'box cricket premium', NULL, NULL, NULL, 'Active'),
('facility-mumbai-4', 'Bandra Badminton Courts', 'Court', 'Pali Hill, Bandra West, Mumbai', 'Mumbai', 'Bandra', 'Indoor badminton courts that are a favorite among the Bandra crowd.', 4.50, 40, 0, 1, 'badminton court indoor', NULL, NULL, NULL, 'Active'),
('facility-mumbai-5', 'Goregaon Turf Park', 'Field', 'Off Western Express Highway, Goregaon East, Mumbai', 'Mumbai', 'Goregaon', 'A popular football turf known for its excellent maintenance and accessibility.', 4.70, 120, 1, 0, 'football turf highway', 'user-owner-1', NULL, NULL, 'Active'),
('facility-mumbai-master', 'Mumbai Sports Metropolis', 'Complex', 'BKC, Bandra East, Mumbai', 'Mumbai', 'BKC', 'A state-of-the-art multi-sport facility in the heart of Mumbai''s business district.', 4.90, 2500, 1, 1, 'sports complex futuristic', NULL, NULL, NULL, 'Active'),
('facility-pune-1', 'Pune Elite Badminton Courts', 'Court', '123, FC Road, Pune', 'Pune', 'FC Road', 'Premium badminton courts with wooden flooring and excellent lighting. Perfect for competitive and recreational players.', 4.80, 40, 0, 1, 'badminton court indoor', 'user-owner-1', NULL, NULL, 'Active'),
('facility-pune-2', 'Deccan Gymkhana', 'Complex', 'Prabhat Road, Pune', 'Pune', 'Deccan', 'A prestigious club offering a wide range of sports including tennis, swimming, and cricket.', 4.70, 500, 1, 1, 'sports club prestigious', NULL, NULL, NULL, 'Active'),
('facility-pune-3', 'Kothrud Football Turf', 'Field', 'Paud Road, Kothrud, Pune', 'Pune', 'Kothrud', 'A high-quality artificial turf for 5-a-side and 7-a-side football, open till late.', 4.60, 100, 1, 0, 'football turf night', 'user-owner-1', NULL, NULL, 'Active'),
('facility-pune-4', 'Viman Nagar Hoops', 'Court', 'Near Symbiosis College, Viman Nagar, Pune', 'Pune', 'Viman Nagar', 'A lively outdoor basketball court, popular with college students and young professionals.', 4.50, 30, 0, 0, 'basketball court outdoor', NULL, NULL, NULL, 'Active'),
('facility-pune-5', 'Hinjewadi Box Cricket League', 'Box Cricket', 'Phase 1, Hinjewadi, Pune', 'Pune', 'Hinjewadi', 'A well-lit box cricket facility ideal for corporate matches and weekend fun.', 4.70, 25, 0, 0, 'box cricket corporate', NULL, NULL, NULL, 'Active'),
('facility-pune-master', 'Pune Sportsdome', 'Complex', 'Baner-Balewadi High Street, Pune', 'Pune', 'Balewadi', 'A massive multi-sport complex with international standard facilities for various sports, including athletics, swimming, and indoor games.', 4.90, 20000, 1, 1, 'sports stadium modern', NULL, NULL, NULL, 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `facility_amenities`
--

CREATE TABLE `facility_amenities` (
  `facilityId` VARCHAR(255) NOT NULL,
  `amenityId` VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `facility_amenities`
--

INSERT INTO `facility_amenities` (`facilityId`, `amenityId`) VALUES
('facility-pune-master', 'amenity-1'), ('facility-pune-master', 'amenity-2'), ('facility-pune-master', 'amenity-3'), ('facility-pune-master', 'amenity-4'), ('facility-pune-master', 'amenity-5'), ('facility-pune-master', 'amenity-6'), ('facility-pune-master', 'amenity-7'), ('facility-pune-master', 'amenity-8'),
('facility-mumbai-master', 'amenity-1'), ('facility-mumbai-master', 'amenity-2'), ('facility-mumbai-master', 'amenity-3'), ('facility-mumbai-master', 'amenity-4'), ('facility-mumbai-master', 'amenity-5'), ('facility-mumbai-master', 'amenity-6'), ('facility-mumbai-master', 'amenity-7'), ('facility-mumbai-master', 'amenity-8'),
('facility-pune-1', 'amenity-1'), ('facility-pune-1', 'amenity-2'), ('facility-pune-1', 'amenity-4'),
('facility-pune-3', 'amenity-1'), ('facility-pune-3', 'amenity-6'), ('facility-pune-3', 'amenity-8'),
('facility-bangalore-3', 'amenity-1'), ('facility-bangalore-3', 'amenity-3'), ('facility-bangalore-3', 'amenity-6'), ('facility-bangalore-3', 'amenity-8'),
('facility-ahmedabad-master', 'amenity-1'), ('facility-ahmedabad-master', 'amenity-2'), ('facility-ahmedabad-master', 'amenity-3'), ('facility-ahmedabad-master', 'amenity-4');

-- --------------------------------------------------------

--
-- Table structure for table `facility_operating_hours`
--

CREATE TABLE `facility_operating_hours` (
  `facilityId` VARCHAR(255) NOT NULL,
  `day` ENUM('Mon','Tue','Wed','Thu','Fri','Sat','Sun') NOT NULL,
  `open` TIME NOT NULL,
  `close` TIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `facility_operating_hours`
--

INSERT INTO `facility_operating_hours` (`facilityId`, `day`, `open`, `close`) VALUES
('facility-pune-master', 'Mon', '06:00:00', '23:00:00'), ('facility-pune-master', 'Tue', '06:00:00', '23:00:00'), ('facility-pune-master', 'Wed', '06:00:00', '23:00:00'), ('facility-pune-master', 'Thu', '06:00:00', '23:00:00'), ('facility-pune-master', 'Fri', '06:00:00', '23:59:00'), ('facility-pune-master', 'Sat', '06:00:00', '23:59:00'), ('facility-pune-master', 'Sun', '06:00:00', '23:00:00'),
('facility-mumbai-master', 'Mon', '07:00:00', '22:00:00'), ('facility-mumbai-master', 'Tue', '07:00:00', '22:00:00'), ('facility-mumbai-master', 'Wed', '07:00:00', '22:00:00'), ('facility-mumbai-master', 'Thu', '07:00:00', '22:00:00'), ('facility-mumbai-master', 'Fri', '07:00:00', '23:00:00'), ('facility-mumbai-master', 'Sat', '08:00:00', '23:00:00'), ('facility-mumbai-master', 'Sun', '08:00:00', '22:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `facility_sports`
--

CREATE TABLE `facility_sports` (
  `facilityId` VARCHAR(255) NOT NULL,
  `sportId` VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `facility_sports`
--

INSERT INTO `facility_sports` (`facilityId`, `sportId`) VALUES
('facility-pune-master', 'sport-1'), ('facility-pune-master', 'sport-2'), ('facility-pune-master', 'sport-3'), ('facility-pune-master', 'sport-4'), ('facility-pune-master', 'sport-5'), ('facility-pune-master', 'sport-6'),
('facility-mumbai-master', 'sport-1'), ('facility-mumbai-master', 'sport-2'), ('facility-mumbai-master', 'sport-3'),
('facility-pune-1', 'sport-2'),
('facility-pune-2', 'sport-1'), ('facility-pune-2', 'sport-5'), ('facility-pune-2', 'sport-6'),
('facility-pune-3', 'sport-3'),
('facility-pune-4', 'sport-4'),
('facility-pune-5', 'sport-1'),
('facility-ahmedabad-1', 'sport-2'),
('facility-ahmedabad-2', 'sport-1'),
('facility-ahmedabad-3', 'sport-3'),
('facility-ahmedabad-4', 'sport-5'),
('facility-ahmedabad-5', 'sport-6'),
('facility-ahmedabad-master', 'sport-3'), ('facility-ahmedabad-master', 'sport-4');

-- --------------------------------------------------------

--
-- Table structure for table `facility_sport_prices`
--

CREATE TABLE `facility_sport_prices` (
  `facilityId` VARCHAR(255) NOT NULL,
  `sportId` VARCHAR(255) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `pricingModel` VARCHAR(50) NOT NULL DEFAULT 'per_hour_flat'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `facility_sport_prices`
--

INSERT INTO `facility_sport_prices` (`facilityId`, `sportId`, `price`, `pricingModel`) VALUES
('facility-pune-master', 'sport-1', 1500.00, 'per_hour_flat'), ('facility-pune-master', 'sport-2', 800.00, 'per_hour_flat'), ('facility-pune-master', 'sport-3', 1800.00, 'per_hour_flat'), ('facility-pune-master', 'sport-4', 1000.00, 'per_hour_flat'), ('facility-pune-master', 'sport-5', 500.00, 'per_hour_per_person'), ('facility-pune-master', 'sport-6', 900.00, 'per_hour_flat'),
('facility-pune-1', 'sport-2', 600.00, 'per_hour_flat'),
('facility-pune-3', 'sport-3', 900.00, 'per_hour_flat'),
('facility-mumbai-master', 'sport-1', 2000.00, 'per_hour_flat'), ('facility-mumbai-master', 'sport-3', 2500.00, 'per_hour_flat'),
('facility-ahmedabad-1', 'sport-2', 500.00, 'per_hour_flat'),
('facility-ahmedabad-3', 'sport-3', 1000.00, 'per_hour_flat');

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
  `createdAt` DATETIME NOT NULL DEFAULT current_timestamp(),
  `status` ENUM('open','closed') NOT NULL DEFAULT 'open',
  `interestedUserIds` JSON DEFAULT NULL,
  `skillLevel` ENUM('Any','Beginner','Intermediate','Advanced') DEFAULT 'Any',
  `playersNeeded` INT DEFAULT NULL,
  `preferredTime` VARCHAR(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `lfg_requests`
--

INSERT INTO `lfg_requests` (`id`, `userId`, `sportId`, `facilityId`, `facilityName`, `notes`, `createdAt`, `status`, `interestedUserIds`, `skillLevel`, `playersNeeded`, `preferredTime`) VALUES
('lfg-1', 'user-1', 'sport-3', 'facility-pune-3', 'Kothrud Football Turf', 'Need 2 more players for a 5-a-side friendly match this Saturday evening. Let''s have some fun!', '2024-07-10 18:00:00', 'open', '[\"user-3\"]', 'Intermediate', 2, 'Saturday Evening'),
('lfg-2', 'user-4', 'sport-4', 'facility-bangalore-2', 'The Net Rippers (Bangalore)', 'Looking for people to shoot some hoops. Casual game, all skill levels welcome.', '2024-07-11 11:30:00', 'open', '[]', 'Any', 3, 'Weekdays after 6 PM');

-- --------------------------------------------------------

--
-- Table structure for table `membership_plans`
--

CREATE TABLE `membership_plans` (
  `id` VARCHAR(255) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `pricePerMonth` DECIMAL(10,2) NOT NULL,
  `benefits` JSON NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `membership_plans`
--

INSERT INTO `membership_plans` (`id`, `name`, `pricePerMonth`, `benefits`) VALUES
('plan-1', 'Basic', 0.00, '[\"Access to all facility listings\", \"Standard booking features\"]'),
('plan-2', 'Premium', 499.00, '[\"All Basic benefits\", \"10% discount on all bookings\", \"Early access to event registrations\", \"Priority customer support\"]'),
('plan-3', 'Pro', 999.00, '[\"All Premium benefits\", \"20% discount on all bookings\", \"Free equipment rentals\", \"Access to exclusive Pro-level tournaments\"]');

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
  `isActive` TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pricing_rules`
--

INSERT INTO `pricing_rules` (`id`, `name`, `description`, `facilityIds`, `daysOfWeek`, `timeRange`, `dateRange`, `adjustmentType`, `value`, `priority`, `isActive`) VALUES
('rule-1', 'Weekend Evening Surge', 'Increase price for all facilities on weekend evenings.', NULL, '[\"Sat\", \"Sun\"]', '{\"start\": \"17:00\", \"end\": \"22:00\"}', NULL, 'percentage_increase', 20.00, 10, 1),
('rule-2', 'Weekday Morning Discount', 'Discount for early birds on weekdays.', NULL, '[\"Mon\", \"Tue\", \"Wed\", \"Thu\", \"Fri\"]', '{\"start\": \"08:00\", \"end\": \"11:00\"}', NULL, 'percentage_decrease', 15.00, 10, 1);

-- --------------------------------------------------------

--
-- Table structure for table `promotion_rules`
--

CREATE TABLE `promotion_rules` (
  `id` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `code` VARCHAR(50) DEFAULT NULL,
  `discountType` ENUM('percentage','fixed_amount') NOT NULL,
  `discountValue` DECIMAL(10,2) NOT NULL,
  `startDate` DATE DEFAULT NULL,
  `endDate` DATE DEFAULT NULL,
  `usageLimit` INT DEFAULT NULL,
  `usageLimitPerUser` INT DEFAULT NULL,
  `isActive` TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `promotion_rules`
--

INSERT INTO `promotion_rules` (`id`, `name`, `description`, `code`, `discountType`, `discountValue`, `startDate`, `endDate`, `usageLimit`, `usageLimitPerUser`, `isActive`) VALUES
('promo-1', 'First Booking Discount', 'A 50 INR discount for new users on their first booking.', 'FIRSTBOOK', 'fixed_amount', 50.00, NULL, NULL, NULL, 1, 1),
('promo-2', 'Monsoon Mania', '15% off on all bookings during the monsoon season.', 'MONSOON15', 'percentage', 15.00, '2024-07-01', '2024-08-31', NULL, NULL, 1);

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
  `isPublicProfile` TINYINT(1) DEFAULT 0,
  `rating` INT NOT NULL,
  `comment` TEXT NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT current_timestamp(),
  `bookingId` VARCHAR(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `facilityId`, `userId`, `userName`, `userAvatar`, `isPublicProfile`, `rating`, `comment`, `createdAt`, `bookingId`) VALUES
('review-1', 'facility-pune-3', 'user-3', 'Charlie Brown', 'https://i.pravatar.cc/150?u=charlie', 1, 5, 'Amazing turf quality and the floodlights are top-notch. Had a great time playing here with my friends. Will definitely visit again!', '2024-06-16 10:00:00', 'booking-3');

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sports`
--

INSERT INTO `sports` (`id`, `name`, `iconName`, `imageUrl`, `imageDataAiHint`) VALUES
('sport-1', 'Cricket', 'Dribbble', 'https://picsum.photos/seed/cricket/400/300', 'cricket stadium grass'),
('sport-2', 'Badminton', 'Feather', 'https://picsum.photos/seed/badminton/400/300', 'badminton court shuttlecock'),
('sport-3', 'Football', 'Goal', 'https://picsum.photos/seed/football/400/300', 'football on turf'),
('sport-4', 'Basketball', 'Dribbble', 'https://picsum.photos/seed/basketball/400/300', 'basketball court hoop'),
('sport-5', 'Swimming', 'Wind', 'https://picsum.photos/seed/swimming/400/300', 'swimming pool water'),
('sport-6', 'Tennis', 'Dices', 'https://picsum.photos/seed/tennis/400/300', 'tennis court racket'),
('sport-7', 'Table Tennis', 'Dices', 'https://picsum.photos/seed/tabletennis/400/300', 'table tennis paddle'),
('sport-8', 'Squash', 'Square', 'https://picsum.photos/seed/squash/400/300', 'squash court inside');

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `teams`
--

INSERT INTO `teams` (`id`, `name`, `sportId`, `captainId`, `memberIds`) VALUES
('team-1', 'The Pune Panthers', 'sport-1', 'user-1', '[\"user-1\", \"user-2\"]'),
('team-2', 'Mumbai Mavericks', 'sport-3', 'user-3', '[\"user-3\", \"user-4\"]');

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
  `role` ENUM('Admin','FacilityOwner','User') NOT NULL,
  `status` ENUM('Active','Suspended','PendingApproval') NOT NULL DEFAULT 'Active',
  `joinedAt` DATETIME NOT NULL,
  `teamIds` JSON DEFAULT NULL,
  `isProfilePublic` TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `profilePictureUrl`, `dataAiHint`, `preferredSports`, `favoriteFacilities`, `membershipLevel`, `loyaltyPoints`, `achievements`, `bio`, `preferredPlayingTimes`, `skillLevels`, `role`, `status`, `joinedAt`, `teamIds`, `isProfilePublic`) VALUES
('user-admin', 'Admin Alice', 'admin@sportsarena.com', 'admin123', '9876543210', 'https://i.pravatar.cc/150?u=alice', 'female administrator avatar', NULL, '[]', 'Pro', 1000, NULL, 'Keeping the Arena running smoothly.', '24/7', NULL, 'Admin', 'Active', '2024-01-01 12:00:00', NULL, 1),
('user-owner-1', 'Owner Oscar', 'owner@sportsarena.com', 'owner123', '9876543211', 'https://i.pravatar.cc/150?u=oscar', 'male business owner avatar', NULL, '[]', 'Premium', 500, NULL, 'Proud owner of multiple premium sports facilities.', 'Business Hours', NULL, 'FacilityOwner', 'Active', '2024-02-15 10:00:00', NULL, 1),
('user-1', 'Bob Johnson', 'bob@example.com', 'bob123', '9876543210', 'https://i.pravatar.cc/150?u=bob', 'male user avatar', '[{\"id\": \"sport-1\", \"name\": \"Cricket\"}, {\"id\": \"sport-2\", \"name\": \"Badminton\"}]', '[\"facility-pune-master\", \"facility-mumbai-master\"]', 'Premium', 250, '[{\"id\": \"ach-1\", \"name\": \"First Booking\", \"description\": \"Make your first booking.\", \"iconName\": \"Gift\", \"unlockedAt\": \"2024-07-01T11:05:00Z\"}]', 'Weekend warrior, loves cricket and badminton.', 'Weekends', '[{\"sportId\": \"sport-1\", \"sportName\": \"Cricket\", \"level\": \"Intermediate\"}]', 'User', 'Active', '2024-03-01 09:00:00', '[\"team-1\"]', 1),
('user-2', 'Charlie Brown', 'charlie@example.com', 'charlie123', '9876543212', 'https://i.pravatar.cc/150?u=charlie', 'male user avatar cartoon', '[]', '[]', 'Basic', 120, NULL, 'Football enthusiast and team player.', 'Evenings', '[{\"sportId\": \"sport-3\", \"sportName\": \"Football\", \"level\": \"Advanced\"}]', 'User', 'Active', '2024-04-20 15:30:00', '[\"team-1\"]', 1),
('user-3', 'Diana Prince', 'diana@example.com', 'diana123', '9876543213', 'https://i.pravatar.cc/150?u=diana', 'female user avatar powerful', '[]', '[\"facility-delhi-1\"]', 'Premium', 800, NULL, 'Passionate about tennis and competitive matches.', 'Mornings', '[{\"sportId\": \"sport-6\", \"sportName\": \"Tennis\", \"level\": \"Advanced\"}]', 'User', 'Active', '2024-05-05 11:11:00', '[\"team-2\"]', 1),
('user-4', 'Ethan Hunt', 'ethan@example.com', 'ethan123', '9876543214', 'https://i.pravatar.cc/150?u=ethan', 'male user avatar agent', '[]', '[]', 'Basic', 50, NULL, NULL, NULL, NULL, 'User', 'Suspended', '2024-06-10 20:00:00', '[\"team-2\"]', 1),
('user-5', 'Fiona Glenanne', 'fiona@example.com', 'fiona123', '9876543215', 'https://i.pravatar.cc/150?u=fiona', 'female user avatar tough', '[]', '[]', 'Basic', 75, NULL, 'Just here to swim and relax.', 'Anytime', '[{\"sportId\": \"sport-5\", \"sportName\": \"Swimming\", \"level\": \"Beginner\"}]', 'User', 'Active', '2024-07-01 08:00:00', NULL, 0);

--
-- Indexes for dumped tables
--

ALTER TABLE `amenities`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `blog_posts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `facilityId` (`facilityId`),
  ADD KEY `userId` (`userId`),
  ADD KEY `date` (`date`);

ALTER TABLE `challenges`
  ADD PRIMARY KEY (`id`),
  ADD KEY `challengerId` (`challengerId`),
  ADD KEY `facilityId` (`facilityId`);

ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `facilityId` (`facilityId`),
  ADD KEY `sportId` (`sportId`);

ALTER TABLE `facilities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ownerId` (`ownerId`);

ALTER TABLE `facility_amenities`
  ADD PRIMARY KEY (`facilityId`,`amenityId`),
  ADD KEY `amenityId` (`amenityId`);

ALTER TABLE `facility_operating_hours`
  ADD PRIMARY KEY (`facilityId`,`day`);

ALTER TABLE `facility_sports`
  ADD PRIMARY KEY (`facilityId`,`sportId`),
  ADD KEY `sportId` (`sportId`);

ALTER TABLE `facility_sport_prices`
  ADD PRIMARY KEY (`facilityId`,`sportId`),
  ADD KEY `sportId` (`sportId`);

ALTER TABLE `lfg_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `facilityId` (`facilityId`);

ALTER TABLE `membership_plans`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `pricing_rules`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `promotion_rules`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `facilityId` (`facilityId`),
  ADD KEY `userId` (`userId`);

ALTER TABLE `sports`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `teams`
  ADD PRIMARY KEY (`id`),
  ADD KEY `captainId` (`captainId`);

ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);


ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`facilityId`) REFERENCES `facilities` (`id`) ON DELETE CASCADE;

ALTER TABLE `challenges`
  ADD CONSTRAINT `challenges_ibfk_1` FOREIGN KEY (`challengerId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `challenges_ibfk_2` FOREIGN KEY (`facilityId`) REFERENCES `facilities` (`id`) ON DELETE CASCADE;

ALTER TABLE `events`
  ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`facilityId`) REFERENCES `facilities` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `events_ibfk_2` FOREIGN KEY (`sportId`) REFERENCES `sports` (`id`) ON DELETE CASCADE;

ALTER TABLE `facilities`
  ADD CONSTRAINT `facilities_ibfk_1` FOREIGN KEY (`ownerId`) REFERENCES `users` (`id`) ON DELETE SET NULL;

ALTER TABLE `facility_amenities`
  ADD CONSTRAINT `facility_amenities_ibfk_1` FOREIGN KEY (`facilityId`) REFERENCES `facilities` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `facility_amenities_ibfk_2` FOREIGN KEY (`amenityId`) REFERENCES `amenities` (`id`) ON DELETE CASCADE;

ALTER TABLE `facility_operating_hours`
  ADD CONSTRAINT `facility_operating_hours_ibfk_1` FOREIGN KEY (`facilityId`) REFERENCES `facilities` (`id`) ON DELETE CASCADE;

ALTER TABLE `facility_sports`
  ADD CONSTRAINT `facility_sports_ibfk_1` FOREIGN KEY (`facilityId`) REFERENCES `facilities` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `facility_sports_ibfk_2` FOREIGN KEY (`sportId`) REFERENCES `sports` (`id`) ON DELETE CASCADE;

ALTER TABLE `facility_sport_prices`
  ADD CONSTRAINT `facility_sport_prices_ibfk_1` FOREIGN KEY (`facilityId`) REFERENCES `facilities` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `facility_sport_prices_ibfk_2` FOREIGN KEY (`sportId`) REFERENCES `sports` (`id`) ON DELETE CASCADE;

ALTER TABLE `lfg_requests`
  ADD CONSTRAINT `lfg_requests_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `lfg_requests_ibfk_2` FOREIGN KEY (`facilityId`) REFERENCES `facilities` (`id`) ON DELETE CASCADE;

ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`facilityId`) REFERENCES `facilities` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

ALTER TABLE `teams`
  ADD CONSTRAINT `teams_ibfk_1` FOREIGN KEY (`captainId`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;
