
-- Drop tables if they exist to start from a clean slate
DROP TABLE IF EXISTS "facility_amenities";
DROP TABLE IF EXISTS "facility_sports";
DROP TABLE IF EXISTS "reviews";
DROP TABLE IF EXISTS "bookings";
DROP TABLE IF EXISTS "facilities";
DROP TABLE IF EXISTS "users";
DROP TABLE IF EXISTS "sports";
DROP TABLE IF EXISTS "amenities";

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
  "loyaltyPoints" INTEGER DEFAULT 0,
  "bio" TEXT,
  "preferredPlayingTimes" VARCHAR(255),
  "role" VARCHAR(50) NOT NULL,
  "status" VARCHAR(50) NOT NULL,
  "joinedAt" TIMESTAMPTZ DEFAULT NOW(),
  "isProfilePublic" BOOLEAN DEFAULT true
);

-- Create Sports Table
CREATE TABLE "sports" (
  "id" VARCHAR(255) PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "iconName" VARCHAR(255),
  "imageUrl" VARCHAR(255),
  "imageDataAiHint" VARCHAR(255)
);

-- Create Amenities Table
CREATE TABLE "amenities" (
  "id" VARCHAR(255) PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "iconName" VARCHAR(255)
);

-- Create Facilities Table
CREATE TABLE "facilities" (
  "id" VARCHAR(255) PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "type" VARCHAR(100),
  "address" VARCHAR(255),
  "city" VARCHAR(100),
  "location" VARCHAR(100),
  "description" TEXT,
  "rating" REAL DEFAULT 0,
  "capacity" INTEGER,
  "isPopular" BOOLEAN DEFAULT false,
  "isIndoor" BOOLEAN DEFAULT false,
  "dataAiHint" VARCHAR(255),
  "ownerId" VARCHAR(255) REFERENCES "users"("id") ON DELETE SET NULL
);

-- Create Bookings Table
CREATE TABLE "bookings" (
  "id" VARCHAR(255) PRIMARY KEY,
  "userId" VARCHAR(255) REFERENCES "users"("id") ON DELETE CASCADE,
  "facilityId" VARCHAR(255) REFERENCES "facilities"("id") ON DELETE CASCADE,
  "sportId" VARCHAR(255) REFERENCES "sports"("id"),
  "facilityName" VARCHAR(255),
  "sportName" VARCHAR(255),
  "dataAiHint" VARCHAR(255),
  "date" DATE NOT NULL,
  "startTime" TIME NOT NULL,
  "endTime" TIME NOT NULL,
  "durationHours" INTEGER,
  "numberOfGuests" INTEGER,
  "baseFacilityPrice" REAL,
  "equipmentRentalCost" REAL,
  "totalPrice" REAL NOT NULL,
  "status" VARCHAR(50) NOT NULL,
  "bookedAt" TIMESTAMPTZ DEFAULT NOW(),
  "reviewed" BOOLEAN DEFAULT false
);

-- Create Reviews Table
CREATE TABLE "reviews" (
  "id" VARCHAR(255) PRIMARY KEY,
  "facilityId" VARCHAR(255) REFERENCES "facilities"("id") ON DELETE CASCADE,
  "userId" VARCHAR(255) REFERENCES "users"("id") ON DELETE CASCADE,
  "bookingId" VARCHAR(255) REFERENCES "bookings"("id") ON DELETE SET NULL,
  "rating" INTEGER NOT NULL,
  "comment" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Junction table for a many-to-many relationship between facilities and sports
CREATE TABLE "facility_sports" (
  "facilityId" VARCHAR(255) REFERENCES "facilities"("id") ON DELETE CASCADE,
  "sportId" VARCHAR(255) REFERENCES "sports"("id") ON DELETE CASCADE,
  PRIMARY KEY ("facilityId", "sportId")
);

-- Junction table for a many-to-many relationship between facilities and amenities
CREATE TABLE "facility_amenities" (
  "facilityId" VARCHAR(255) REFERENCES "facilities"("id") ON DELETE CASCADE,
  "amenityId" VARCHAR(255) REFERENCES "amenities"("id") ON DELETE CASCADE,
  PRIMARY KEY ("facilityId", "amenityId")
);

-- Seed initial data

-- Seed Users (MUST be done before facilities that reference them)
INSERT INTO "users" ("id", "name", "email", "password", "role", "status", "joinedAt", "membershipLevel", "isProfilePublic") VALUES
('user-admin-kunj', 'Kunj Patel', 'kunjp1157@gmail.com', 'Kunj@2810', 'Admin', 'Active', '2023-01-15T10:00:00Z', 'Premium', true),
('user-owner-dana', 'Dana White', 'dana.white@example.com', 'dana@123', 'FacilityOwner', 'Active', '2023-02-20T11:30:00Z', 'Basic', true),
('user-regular-charlie', 'Charlie Davis', 'charlie.davis@example.com', 'charlie@123', 'User', 'Active', '2023-03-10T09:00:00Z', 'Basic', true),
('user-new-user', 'Test User', 'user@gmail.com', 'user@123', 'User', 'Active', '2024-01-01T12:00:00Z', 'Basic', true),
('user-new-owner', 'Test Owner', 'owner@gmail.com', 'owner@123', 'FacilityOwner', 'Active', '2024-01-01T12:00:00Z', 'Basic', true);

-- Seed Sports
INSERT INTO "sports" ("id", "name", "iconName") VALUES
('sport-1', 'Soccer', 'Goal'),
('sport-2', 'Basketball', 'Dribbble'),
('sport-3', 'Tennis', 'Activity'),
('sport-4', 'Badminton', 'Feather'),
('sport-5', 'Swimming', 'PersonStanding'),
('sport-6', 'Yoga', 'Brain'),
('sport-7', 'Cycling', 'Bike'),
('sport-8', 'Dance', 'Music'),
('sport-9', 'Camping', 'Tent'),
('sport-10', 'Theatre', 'Drama'),
('sport-13', 'Cricket', 'Dices'),
('sport-14', 'Pool', 'Target'),
('sport-15', 'PC Game/PS5', 'Gamepad2'),
('sport-16', 'Gym', 'Dumbbell');

-- Seed Amenities
INSERT INTO "amenities" ("id", "name", "iconName") VALUES
('amenity-1', 'Parking', 'ParkingCircle'),
('amenity-2', 'WiFi', 'Wifi'),
('amenity-3', 'Showers', 'ShowerHead'),
('amenity-4', 'Lockers', 'Lock'),
('amenity-5', 'Equipment Rental', 'PackageSearch'),
('amenity-6', 'Cafe', 'Utensils'),
('amenity-7', 'Accessible', 'Users');

-- Seed Facilities
INSERT INTO "facilities" ("id", "name", "type", "address", "city", "location", "description", "rating", "isPopular", "isIndoor", "dataAiHint", "ownerId") VALUES
('facility-1', 'Pune Sports Complex', 'Complex', '123 Stadium Way, Koregaon Park, Pune, 411001', 'Pune', 'Koregaon Park', 'A state-of-the-art multi-sport complex.', 4.8, true, true, 'soccer stadium', 'user-owner-dana'),
('facility-2', 'Deccan Gymkhana Tennis Club', 'Court', '456 Ace Avenue, Deccan, Pune, 411004', 'Pune', 'Deccan', 'Premier outdoor clay courts.', 4.5, false, false, 'tennis court', NULL),
('facility-3', 'Kothrud Cricket Ground', 'Field', '789 Boundary Rd, Kothrud, Pune, 411038', 'Pune', 'Kothrud', 'A lush, expansive cricket field.', 4.7, true, false, 'cricket stadium', 'user-owner-dana');

-- Seed Facility Sports Junction Table
INSERT INTO "facility_sports" ("facilityId", "sportId") VALUES
('facility-1', 'sport-1'),
('facility-1', 'sport-2'),
('facility-2', 'sport-3'),
('facility-3', 'sport-13');

-- Seed Facility Amenities Junction Table
INSERT INTO "facility_amenities" ("facilityId", "amenityId") VALUES
('facility-1', 'amenity-1'),
('facility-1', 'amenity-2'),
('facility-1', 'amenity-3'),
('facility-1', 'amenity-4'),
('facility-2', 'amenity-1'),
('facility-2', 'amenity-3'),
('facility-3', 'amenity-1'),
('facility-3', 'amenity-6');

-- Seed Bookings
INSERT INTO "bookings" ("id", "userId", "facilityId", "sportId", "facilityName", "sportName", "date", "startTime", "endTime", "totalPrice", "status", "bookedAt") VALUES
('booking-1', 'user-admin-kunj', 'facility-1', 'sport-1', 'Pune Sports Complex', 'Soccer', '2024-08-10', '18:00', '19:00', 2500, 'Confirmed', '2024-07-20T10:00:00Z'),
('booking-2', 'user-regular-charlie', 'facility-2', 'sport-3', 'Deccan Gymkhana Tennis Club', 'Tennis', '2024-08-12', '09:00', '11:00', 3600, 'Confirmed', '2024-07-18T14:30:00Z'),
('booking-3', 'user-admin-kunj', 'facility-3', 'sport-13', 'Kothrud Cricket Ground', 'Cricket', '2024-07-28', '14:00', '17:00', 9000, 'Cancelled', '2024-07-15T16:00:00Z');

-- Seed Reviews
INSERT INTO "reviews" ("id", "facilityId", "userId", "bookingId", "rating", "comment", "createdAt") VALUES
('review-1', 'facility-1', 'user-regular-charlie', 'booking-1', 5, 'Amazing facility! The turf was in perfect condition and the floodlights were excellent. Will definitely book again.', '2024-07-21T11:00:00Z'),
('review-2', 'facility-2', 'user-admin-kunj', 'booking-2', 4, 'Great clay courts, very well-maintained. The clubhouse is a bit dated but the playing experience is top-notch.', '2024-07-19T10:00:00Z');
