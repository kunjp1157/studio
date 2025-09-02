-- Drop existing tables in reverse order of dependency to avoid foreign key constraints
DROP TABLE IF EXISTS facility_amenities;
DROP TABLE IF EXISTS facility_sports;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS facilities;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS sports;
DROP TABLE IF EXISTS amenities;

-- Create users table first as other tables depend on it
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    phone VARCHAR(20),
    profile_picture_url TEXT,
    data_ai_hint TEXT,
    membership_level VARCHAR(50) DEFAULT 'Basic',
    loyalty_points INTEGER DEFAULT 0,
    role VARCHAR(50) NOT NULL DEFAULT 'User',
    status VARCHAR(50) NOT NULL DEFAULT 'Active',
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    is_profile_public BOOLEAN DEFAULT true,
    bio TEXT,
    preferred_playing_times VARCHAR(255)
);

-- Create sports table
CREATE TABLE sports (
    id TEXT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon_name VARCHAR(50)
);

-- Create amenities table
CREATE TABLE amenities (
    id TEXT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon_name VARCHAR(50)
);

-- Create facilities table
CREATE TABLE facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    description TEXT,
    rating NUMERIC(2, 1) DEFAULT 0.0,
    capacity INTEGER,
    is_popular BOOLEAN DEFAULT false,
    is_indoor BOOLEAN DEFAULT false,
    data_ai_hint TEXT,
    owner_id TEXT REFERENCES users(id) ON DELETE SET NULL
);

-- Junction table for facilities and sports
CREATE TABLE facility_sports (
    facility_id UUID REFERENCES facilities(id) ON DELETE CASCADE,
    sports_id TEXT REFERENCES sports(id) ON DELETE CASCADE,
    PRIMARY KEY (facility_id, sports_id)
);

-- Junction table for facilities and amenities
CREATE TABLE facility_amenities (
    facility_id UUID REFERENCES facilities(id) ON DELETE CASCADE,
    amenity_id TEXT REFERENCES amenities(id) ON DELETE CASCADE,
    PRIMARY KEY (facility_id, amenity_id)
);

-- Create bookings table
CREATE TABLE bookings (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    facility_id UUID REFERENCES facilities(id) ON DELETE CASCADE,
    facility_name VARCHAR(255),
    data_ai_hint TEXT,
    sport_id TEXT,
    sport_name VARCHAR(100),
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_hours INTEGER,
    total_price NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    booked_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed BOOLEAN DEFAULT false
);

-- Create reviews table
CREATE TABLE reviews (
    id TEXT PRIMARY KEY,
    facility_id UUID REFERENCES facilities(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    user_name VARCHAR(255),
    user_avatar TEXT,
    is_public_profile BOOLEAN,
    rating NUMERIC(2, 1) NOT NULL,
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    booking_id TEXT
);

-- Create facility_sport_prices table
CREATE TABLE facility_sport_prices (
    facility_id UUID REFERENCES facilities(id) ON DELETE CASCADE,
    sport_id TEXT REFERENCES sports(id) ON DELETE CASCADE,
    price NUMERIC(10, 2) NOT NULL,
    pricing_model VARCHAR(50) DEFAULT 'per_hour_flat',
    PRIMARY KEY (facility_id, sport_id)
);

-- Create facility_operating_hours table
CREATE TABLE facility_operating_hours (
    facility_id UUID REFERENCES facilities(id) ON DELETE CASCADE,
    day VARCHAR(3) NOT NULL,
    open_time TIME,
    close_time TIME,
    PRIMARY KEY (facility_id, day)
);


-- Insert initial data
INSERT INTO users (id, name, email, password, role, status) VALUES
('user-admin-kunj', 'Kunj Patel', 'kunjp1157@gmail.com', 'Kunj@2810', 'Admin', 'Active'),
('user-owner-dana', 'Dana White', 'dana.white@example.com', 'dana@123', 'FacilityOwner', 'Active'),
('user-regular-charlie', 'Charlie Davis', 'charlie.davis@example.com', 'charlie@123', 'User', 'Active');


INSERT INTO sports (id, name, icon_name) VALUES
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

INSERT INTO amenities (id, name, icon_name) VALUES
('amenity-1', 'Parking', 'ParkingCircle'),
('amenity-2', 'WiFi', 'Wifi'),
('amenity-3', 'Showers', 'ShowerHead'),
('amenity-4', 'Lockers', 'Lock'),
('amenity-5', 'Equipment Rental', 'PackageSearch'),
('amenity-6', 'Cafe', 'Utensils'),
('amenity-7', 'Accessible', 'Users');

-- Now insert facilities that reference users
INSERT INTO facilities (id, name, type, address, city, location, description, rating, is_popular, is_indoor, data_ai_hint, owner_id) VALUES
('a8b7c6d5-e4f3-a2b1-c0d9-e8f7a6b5c4d3', 'Pune Sports Complex', 'Complex', '123 Stadium Way, Koregaon Park, Pune, 411001', 'Pune', 'Koregaon Park', 'A state-of-the-art multi-sport complex.', 4.8, true, true, 'soccer stadium', 'user-owner-dana'),
('b9c8d7e6-f5a4-b3c2-d1e0-f9a8b7c6d5e4', 'Kothrud Cricket Ground', 'Field', '789 Boundary Rd, Kothrud, Pune, 411038', 'Pune', 'Kothrud', 'A lush cricket field.', 4.7, true, false, 'cricket stadium', 'user-owner-dana');
