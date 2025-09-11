-- Drop existing tables in reverse order of creation to avoid foreign key conflicts
DROP TABLE IF EXISTS "user_favorites";
DROP TABLE IF EXISTS "user_achievements";
DROP TABLE IF EXISTS "user_skills";
DROP TABLE IF EXISTS "reviews";
DROP TABLE IF EXISTS "notifications";
DROP TABLE IF EXISTS "team_members";
DROP TABLE IF EXISTS "teams";
DROP TABLE IF EXISTS "challenges";
DROP TABLE IF EXISTS "lfg_requests";
DROP TABLE IF EXISTS "event_registrations";
DROP TABLE IF EXISTS "events";
DROP TABLE IF EXISTS "bookings";
DROP TABLE IF EXISTS "facility_sport_prices";
DROP TABLE IF EXISTS "facility_sports";
DROP TABLE IF EXISTS "facility_amenities";
DROP TABLE IF EXISTS "rental_equipment";
DROP TABLE IF EXISTS "blocked_slots";
DROP TABLE IF EXISTS "maintenance_schedules";
DROP TABLE IF EXISTS "facility_operating_hours";
DROP TABLE IF EXISTS "facilities";
DROP TABLE IF EXISTS "amenities";
DROP TABLE IF EXISTS "sports";
DROP TABLE IF EXISTS "users";
DROP TABLE IF EXISTS "achievements";
DROP TABLE IF EXISTS "promotion_rules";
DROP TABLE IF EXISTS "pricing_rules";
DROP TABLE IF EXISTS "membership_plans";
DROP TABLE IF EXISTS "blog_posts";
DROP TABLE IF EXISTS "site_settings";

-- Create Users Table
CREATE TABLE "users" (
  "id" VARCHAR(255) PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) UNIQUE NOT NULL,
  "password" VARCHAR(255),
  "phone" VARCHAR(20),
  "profilePictureUrl" VARCHAR(255),
  "dataAiHint" VARCHAR(255),
  "membershipLevel" VARCHAR(50) DEFAULT 'Basic',
  "loyaltyPoints" INT DEFAULT 0,
  "bio" TEXT,
  "preferredPlayingTimes" VARCHAR(255),
  "role" VARCHAR(50) NOT NULL DEFAULT 'User',
  "status" VARCHAR(50) NOT NULL DEFAULT 'Active',
  "joinedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "isProfilePublic" BOOLEAN DEFAULT TRUE
);

-- Create Sports Table
CREATE TABLE "sports" (
  "id" VARCHAR(255) PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "iconName" VARCHAR(100),
  "imageUrl" VARCHAR(255),
  "imageDataAiHint" VARCHAR(255)
);

-- Create Amenities Table
CREATE TABLE "amenities" (
  "id" VARCHAR(255) PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "iconName" VARCHAR(100)
);

-- Create Facilities Table
CREATE TABLE "facilities" (
  "id" VARCHAR(255) PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "type" VARCHAR(100) NOT NULL,
  "address" VARCHAR(255) NOT NULL,
  "city" VARCHAR(100) NOT NULL,
  "location" VARCHAR(100) NOT NULL,
  "description" TEXT,
  "rating" REAL DEFAULT 0,
  "capacity" INT,
  "isPopular" BOOLEAN DEFAULT FALSE,
  "isIndoor" BOOLEAN DEFAULT FALSE,
  "dataAiHint" VARCHAR(255),
  "ownerId" VARCHAR(255) REFERENCES "users"("id") ON DELETE SET NULL,
  "status" VARCHAR(50) DEFAULT 'Active'
);

-- Join Table: Facility Sports
CREATE TABLE "facility_sports" (
  "facilityId" VARCHAR(255) REFERENCES "facilities"("id") ON DELETE CASCADE,
  "sportId" VARCHAR(255) REFERENCES "sports"("id") ON DELETE CASCADE,
  PRIMARY KEY ("facilityId", "sportId")
);

-- Join Table: Facility Amenities
CREATE TABLE "facility_amenities" (
  "facilityId" VARCHAR(255) REFERENCES "facilities"("id") ON DELETE CASCADE,
  "amenityId" VARCHAR(255) REFERENCES "amenities"("id") ON DELETE CASCADE,
  PRIMARY KEY ("facilityId", "amenityId")
);

-- Facility Operating Hours Table
CREATE TABLE "facility_operating_hours" (
  "facilityId" VARCHAR(255) REFERENCES "facilities"("id") ON DELETE CASCADE,
  "day" VARCHAR(3) NOT NULL,
  "open" TIME,
  "close" TIME,
  PRIMARY KEY ("facilityId", "day")
);

-- Facility Sport Prices Table
CREATE TABLE "facility_sport_prices" (
  "facilityId" VARCHAR(255) REFERENCES "facilities"("id") ON DELETE CASCADE,
  "sportId" VARCHAR(255) REFERENCES "sports"("id") ON DELETE CASCADE,
  "price" REAL NOT NULL,
  "pricingModel" VARCHAR(50) DEFAULT 'per_hour_flat',
  PRIMARY KEY ("facilityId", "sportId")
);

-- Bookings Table
CREATE TABLE "bookings" (
  "id" VARCHAR(255) PRIMARY KEY,
  "userId" VARCHAR(255) REFERENCES "users"("id") ON DELETE CASCADE,
  "facilityId" VARCHAR(255) REFERENCES "facilities"("id") ON DELETE CASCADE,
  "sportId" VARCHAR(255) REFERENCES "sports"("id"),
  "date" DATE NOT NULL,
  "startTime" TIME NOT NULL,
  "endTime" TIME NOT NULL,
  "totalPrice" REAL NOT NULL,
  "status" VARCHAR(50) NOT NULL,
  "bookedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "reviewed" BOOLEAN DEFAULT FALSE
);

-- Reviews Table
CREATE TABLE "reviews" (
  "id" VARCHAR(255) PRIMARY KEY,
  "facilityId" VARCHAR(255) REFERENCES "facilities"("id") ON DELETE CASCADE,
  "userId" VARCHAR(255) REFERENCES "users"("id") ON DELETE CASCADE,
  "rating" REAL NOT NULL,
  "comment" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "bookingId" VARCHAR(255) REFERENCES "bookings"("id") ON DELETE SET NULL
);

-- Events Table
CREATE TABLE "events" (
  "id" VARCHAR(255) PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "facilityId" VARCHAR(255) REFERENCES "facilities"("id") ON DELETE CASCADE,
  "sportId" VARCHAR(255) REFERENCES "sports"("id"),
  "startDate" TIMESTAMP WITH TIME ZONE NOT NULL,
  "endDate" TIMESTAMP WITH TIME ZONE NOT NULL,
  "description" TEXT,
  "entryFee" REAL DEFAULT 0,
  "maxParticipants" INT,
  "registeredParticipants" INT DEFAULT 0,
  "imageUrl" VARCHAR(255)
);

-- LFG Requests (Matchmaking) Table
CREATE TABLE "lfg_requests" (
  "id" VARCHAR(255) PRIMARY KEY,
  "userId" VARCHAR(255) REFERENCES "users"("id") ON DELETE CASCADE,
  "sportId" VARCHAR(255) REFERENCES "sports"("id"),
  "facilityId" VARCHAR(255) REFERENCES "facilities"("id") ON DELETE CASCADE,
  "notes" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "status" VARCHAR(50) DEFAULT 'open',
  "skillLevel" VARCHAR(50),
  "playersNeeded" INT
);

-- Challenges Table
CREATE TABLE "challenges" (
  "id" VARCHAR(255) PRIMARY KEY,
  "challengerId" VARCHAR(255) REFERENCES "users"("id") ON DELETE CASCADE,
  "opponentId" VARCHAR(255) REFERENCES "users"("id") ON DELETE SET NULL,
  "sportId" VARCHAR(255) REFERENCES "sports"("id"),
  "facilityId" VARCHAR(255) REFERENCES "facilities"("id") ON DELETE CASCADE,
  "proposedDate" TIMESTAMP WITH TIME ZONE NOT NULL,
  "notes" TEXT,
  "status" VARCHAR(50) DEFAULT 'open',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Blog Posts Table
CREATE TABLE "blog_posts" (
  "id" VARCHAR(255) PRIMARY KEY,
  "slug" VARCHAR(255) UNIQUE NOT NULL,
  "title" VARCHAR(255) NOT NULL,
  "excerpt" TEXT,
  "content" TEXT,
  "authorName" VARCHAR(255),
  "authorAvatarUrl" VARCHAR(255),
  "publishedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "tags" TEXT[],
  "isFeatured" BOOLEAN DEFAULT FALSE,
  "dataAiHint" VARCHAR(255)
);

-- =============================================
-- SEED DATA
-- =============================================

-- Seed Users
INSERT INTO "users" ("id", "name", "email", "password", "role", "status", "loyaltyPoints", "bio") VALUES
('user-admin-01', 'Aditya Sharma', 'admin@sportsarena.com', 'adminpass', 'Admin', 'Active', 1000, 'Chief Administrator of Sports Arena.'),
('user-owner-01', 'Priya Patel', 'owner@sportsarena.com', 'ownerpass', 'FacilityOwner', 'Active', 500, 'Proud owner of multiple sports facilities.'),
('user-001', 'Rohan Verma', 'rohan.verma@example.com', 'password123', 'User', 'Active', 250, 'Cricket enthusiast and weekend warrior.'),
('user-002', 'Sneha Reddy', 'sneha.reddy@example.com', 'password123', 'User', 'Active', 450, 'Love playing badminton and tennis.'),
('user-003', 'Vikram Singh', 'vikram.singh@example.com', 'password123', 'User', 'Active', 150, 'Football is life.'),
('user-004', 'Anjali Rao', 'anjali.rao@example.com', 'password123', 'User', 'Active', 300, 'Morning swims are my favorite.');

-- Seed Sports
INSERT INTO "sports" ("id", "name", "iconName", "imageDataAiHint") VALUES
('sport-cricket', 'Cricket', 'Dribbble', 'cricket stadium india'),
('sport-football', 'Football', 'Goal', 'football field night'),
('sport-tennis', 'Tennis', 'Dribbble', 'tennis court clay'),
('sport-badminton', 'Badminton', 'Feather', 'indoor badminton court'),
('sport-basketball', 'Basketball', 'Dribbble', 'indoor basketball court'),
('sport-swimming', 'Swimming', 'Wind', 'olympic swimming pool');

-- Seed Amenities
INSERT INTO "amenities" ("id", "name", "iconName") VALUES
('amenity-parking', 'Parking', 'ParkingCircle'),
('amenity-lockers', 'Lockers', 'Lock'),
('amenity-wifi', 'WiFi', 'Wifi'),
('amenity-cafe', 'Cafe', 'Utensils'),
('amenity-showers', 'Showers', 'ShowerHead'),
('amenity-floodlights', 'Floodlights', 'Lightbulb');

-- Seed Facilities
-- Mega Cities: Mumbai, Delhi, Bengaluru, Chennai, Kolkata, Hyderabad, Pune
DO $$
DECLARE
    cities TEXT[] := ARRAY['Mumbai', 'Delhi', 'Bengaluru', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune'];
    city TEXT;
    locations_map JSONB := '{
        "Mumbai": ["Andheri", "Bandra", "Dadar", "Juhu", "Powai"],
        "Delhi": ["Connaught Place", "Hauz Khas", "Saket", "Dwarka", "Rohini"],
        "Bengaluru": ["Koramangala", "Indiranagar", "HSR Layout", "Whitefield", "Marathahalli"],
        "Chennai": ["Adyar", "T. Nagar", "Anna Nagar", "Velachery", "Nungambakkam"],
        "Kolkata": ["Salt Lake", "Park Street", "Ballygunge", "New Town", "Howrah"],
        "Hyderabad": ["Banjara Hills", "Jubilee Hills", "Gachibowli", "Hitech City", "Secunderabad"],
        "Pune": ["Koregaon Park", "Viman Nagar", "Hinjewadi", "Kothrud", "Aundh"]
    }';
    locations TEXT[];
    loc TEXT;
    i INT;
BEGIN
    FOREACH city IN ARRAY cities
    LOOP
        -- Master Venue (Complex)
        INSERT INTO "facilities" ("id", "name", "type", "address", "city", "location", "description", "rating", "isPopular", "ownerId", "status", "dataAiHint")
        VALUES
        (LOWER(CONCAT('facility-', city, '-master')), CONCAT(city, ' Sports Complex'), 'Complex', CONCAT('1, Main Sports Road, ', city), city, (locations_map->>city)::jsonb->>0, CONCAT('The premier sports complex in ', city, ' offering a wide range of world-class facilities for all sports lovers.'), 4.8, TRUE, 'user-owner-01', 'Active', 'large sports complex aerial');

        locations := ARRAY(SELECT jsonb_array_elements_text((locations_map->>city)::jsonb));
        FOR i IN 1..5
        LOOP
            loc := locations[i];
            INSERT INTO "facilities" ("id", "name", "type", "address", "city", "location", "description", "rating", "isPopular", "status", "dataAiHint")
            VALUES
            (LOWER(CONCAT('facility-', city, '-', i)), CONCAT(loc, ' Sports Arena'), 'Court', CONCAT(i, ' Sports Lane, ', loc), city, loc, CONCAT('A popular local venue in ', loc, ' for your favorite sports.'), 4.2 + (random() * 0.5), (random() > 0.7), 'Active', 'local sports court evening');
        END LOOP;
    END LOOP;
END $$;

-- Seed Facility-Sports, Amenities, Prices, and Hours for all facilities
DO $$
DECLARE
    f RECORD;
    s RECORD;
    a RECORD;
    all_sports TEXT[] := ARRAY['sport-cricket', 'sport-football', 'sport-tennis', 'sport-badminton', 'sport-basketball', 'sport-swimming'];
    all_amenities TEXT[] := ARRAY['amenity-parking', 'amenity-lockers', 'amenity-wifi', 'amenity-cafe', 'amenity-showers', 'amenity-floodlights'];
    days TEXT[] := ARRAY['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    day TEXT;
BEGIN
    FOR f IN SELECT "id", "type" FROM "facilities"
    LOOP
        -- Add Sports to Facility
        IF f.type = 'Complex' THEN
            -- Add all sports to complexes
            FOREACH s IN ARRAY all_sports
            LOOP
                INSERT INTO "facility_sports" ("facilityId", "sportId") VALUES (f.id, s);
                INSERT INTO "facility_sport_prices" ("facilityId", "sportId", "price") VALUES (f.id, s, 1000 + (random() * 1000));
            END LOOP;
        ELSE
            -- Add 2-3 random sports to other venues
            FOR i IN 1..2 + floor(random() * 2)
            LOOP
                s := all_sports[1 + floor(random() * 6)];
                INSERT INTO "facility_sports" ("facilityId", "sportId") VALUES (f.id, s) ON CONFLICT DO NOTHING;
            END LOOP;
            -- Add prices for the added sports
            FOR s IN SELECT "sportId" FROM "facility_sports" WHERE "facilityId" = f.id
            LOOP
                 INSERT INTO "facility_sport_prices" ("facilityId", "sportId", "price") VALUES (f.id, s."sportId", 500 + (random() * 500));
            END LOOP;
        END IF;

        -- Add Amenities to Facility
        FOREACH a IN ARRAY all_amenities
        LOOP
            IF random() > 0.3 THEN
                INSERT INTO "facility_amenities" ("facilityId", "amenityId") VALUES (f.id, a);
            END IF;
        END LOOP;
        
        -- Add Operating Hours
        FOREACH day IN ARRAY days
        LOOP
            INSERT INTO "facility_operating_hours" ("facilityId", "day", "open", "close")
            VALUES (f.id, day, '08:00', '22:00');
        END LOOP;
        
    END LOOP;
END $$;


-- Seed Bookings
INSERT INTO "bookings" ("id", "userId", "facilityId", "sportId", "date", "startTime", "endTime", "totalPrice", "status") VALUES
('booking-001', 'user-001', 'facility-pune-1', 'sport-cricket', CURRENT_DATE - 7, '18:00', '20:00', 1500, 'Confirmed'),
('booking-002', 'user-002', 'facility-mumbai-master', 'sport-badminton', CURRENT_DATE - 5, '19:00', '20:00', 1200, 'Confirmed'),
('booking-003', 'user-003', 'facility-delhi-3', 'sport-football', CURRENT_DATE - 2, '20:00', '22:00', 2000, 'Confirmed'),
('booking-004', 'user-004', 'facility-bengaluru-master', 'sport-swimming', CURRENT_DATE + 1, '08:00', '09:00', 800, 'Confirmed'),
('booking-005', 'user-001', 'facility-pune-master', 'sport-tennis', CURRENT_DATE + 3, '17:00', '18:00', 1800, 'Confirmed');

-- Seed Reviews (based on past bookings)
INSERT INTO "reviews" ("id", "facilityId", "userId", "rating", "comment", "bookingId") VALUES
('review-001', 'facility-pune-1', 'user-001', 4.5, 'Great cricket nets! The lighting was excellent for evening play. A bit pricey but worth it.', 'booking-001'),
('review-002', 'facility-mumbai-master', 'user-002', 5, 'Absolutely fantastic badminton courts. The complex is well-maintained and has all the amenities.', 'booking-002'),
('review-003', 'facility-delhi-3', 'user-003', 4, 'The football turf is good, but can get a bit crowded. Lockers were a plus.', 'booking-003');
UPDATE "bookings" SET "reviewed" = TRUE WHERE "id" IN ('booking-001', 'booking-002', 'booking-003');

-- Seed Events
INSERT INTO "events" ("id", "name", "facilityId", "sportId", "startDate", "endDate", "description", "entryFee", "maxParticipants") VALUES
('event-001', 'Pune Premier League Cricket', 'facility-pune-master', 'sport-cricket', CURRENT_DATE + 10, CURRENT_DATE + 12, 'The biggest corporate cricket tournament in Pune is back!', 5000, 16),
('event-002', 'Delhi 5-a-Side Football Fest', 'facility-delhi-master', 'sport-football', CURRENT_DATE + 20, CURRENT_DATE + 21, 'An action-packed 5-a-side football festival. All are welcome!', 2500, 32);

-- Seed LFG Requests
INSERT INTO "lfg_requests" ("id", "userId", "sportId", "facilityId", "notes", "skillLevel", "playersNeeded") VALUES
('lfg-001', 'user-001', 'sport-cricket', 'facility-pune-2', 'Need a bowler for net practice tomorrow evening.', 'Intermediate', 1),
('lfg-002', 'user-002', 'sport-tennis', 'facility-mumbai-1', 'Looking for a friendly singles match this weekend.', 'Beginner', 1);

-- Seed Challenges
INSERT INTO "challenges" ("id", "challengerId", "sportId", "facilityId", "proposedDate", "notes") VALUES
('challenge-001', 'user-003', 'sport-football', 'facility-delhi-master', CURRENT_DATE + 8, 'My team is ready. Is there any other team that can beat us? Open challenge!');

-- Seed Blog Posts
INSERT INTO "blog_posts" ("id", "slug", "title", "excerpt", "content", "authorName", "isFeatured", "tags") VALUES
('blog-001', 'improve-your-cricket-batting', '5 Tips to Drastically Improve Your Cricket Batting', 'From grip to stance, these five simple tips will help you score more runs.', '<h2>Tip 1: The Grip</h2><p>Your grip is the foundation of every shot...</p>', 'Aditya Sharma', TRUE, '{"Cricket", "Tips"}'),
('blog-002', 'choosing-the-right-football-boots', 'How to Choose the Right Football Boots', 'Cleats, studs, turf shoes... it can be confusing. Here''s a simple guide to choosing the best boots for your game.', '<h2>Understanding the Surface</h2><p>The first step is to know where you''ll be playing most often...</p>', 'Priya Patel', FALSE, '{"Football", "Gear"}');
