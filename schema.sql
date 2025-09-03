
-- Drop tables if they exist to start fresh
DROP TABLE IF EXISTS facility_sport_prices CASCADE;
DROP TABLE IF EXISTS facility_operating_hours CASCADE;
DROP TABLE IF EXISTS facility_amenities CASCADE;
DROP TABLE IF EXISTS facility_sports CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS sports CASCADE;
DROP TABLE IF EXISTS amenities CASCADE;
DROP TABLE IF EXISTS facilities CASCADE;
DROP TABLE IF EXISTS users CASCADE;


-- Create users table
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    phone VARCHAR(50),
    profile_picture_url TEXT,
    data_ai_hint VARCHAR(255),
    membership_level VARCHAR(50) DEFAULT 'Basic',
    loyalty_points INTEGER DEFAULT 0,
    role VARCHAR(50) NOT NULL DEFAULT 'User',
    status VARCHAR(50) NOT NULL DEFAULT 'Active',
    joined_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    is_profile_public BOOLEAN DEFAULT true,
    bio TEXT,
    preferred_playing_times VARCHAR(255)
);

-- Create facilities table
CREATE TABLE facilities (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    description TEXT,
    rating NUMERIC(2, 1) DEFAULT 0.0,
    capacity INTEGER,
    is_popular BOOLEAN DEFAULT false,
    is_indoor BOOLEAN DEFAULT false,
    data_ai_hint VARCHAR(255),
    owner_id VARCHAR(255) REFERENCES users(id) ON DELETE SET NULL
);


-- Create sports table
CREATE TABLE sports (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    icon_name VARCHAR(100),
    image_url TEXT,
    image_data_ai_hint VARCHAR(255)
);

-- Create amenities table
CREATE TABLE amenities (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    icon_name VARCHAR(100)
);


-- Junction table for facilities and sports
CREATE TABLE facility_sports (
    facility_id VARCHAR(255) REFERENCES facilities(id) ON DELETE CASCADE,
    sports_id VARCHAR(255) REFERENCES sports(id) ON DELETE CASCADE,
    PRIMARY KEY (facility_id, sports_id)
);

-- Junction table for facilities and amenities
CREATE TABLE facility_amenities (
    facility_id VARCHAR(255) REFERENCES facilities(id) ON DELETE CASCADE,
    amenity_id VARCHAR(255) REFERENCES amenities(id) ON DELETE CASCADE,
    PRIMARY KEY (facility_id, amenity_id)
);

-- Table for facility operating hours
CREATE TABLE facility_operating_hours (
    id SERIAL PRIMARY KEY,
    facility_id VARCHAR(255) REFERENCES facilities(id) ON DELETE CASCADE NOT NULL,
    day VARCHAR(3) NOT NULL,
    open_time TIME NOT NULL,
    close_time TIME NOT NULL,
    UNIQUE (facility_id, day)
);

-- Table for sport-specific pricing at facilities
CREATE TABLE facility_sport_prices (
    id SERIAL PRIMARY KEY,
    facility_id VARCHAR(255) REFERENCES facilities(id) ON DELETE CASCADE NOT NULL,
    sport_id VARCHAR(255) REFERENCES sports(id) ON DELETE CASCADE NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    pricing_model VARCHAR(50) NOT NULL, -- 'per_hour_flat' or 'per_hour_per_person'
    UNIQUE (facility_id, sport_id)
);


-- Create bookings table
CREATE TABLE bookings (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    facility_id VARCHAR(255) REFERENCES facilities(id) ON DELETE CASCADE NOT NULL,
    sport_id VARCHAR(255) REFERENCES sports(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_hours INTEGER,
    total_price NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL, -- 'Confirmed', 'Pending', 'Cancelled'
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    reviewed BOOLEAN DEFAULT false,
    base_facility_price NUMERIC(10, 2),
    equipment_rental_cost NUMERIC(10, 2),
    applied_promotion_code VARCHAR(100),
    applied_promotion_discount NUMERIC(10, 2),
    number_of_guests INTEGER
);

-- Create reviews table
CREATE TABLE reviews (
    id VARCHAR(255) PRIMARY KEY,
    facility_id VARCHAR(255) REFERENCES facilities(id) ON DELETE CASCADE NOT NULL,
    user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    user_avatar TEXT,
    is_public_profile BOOLEAN DEFAULT true,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    booking_id VARCHAR(255) REFERENCES bookings(id) ON DELETE SET NULL
);


-- Create events table
CREATE TABLE events (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    facility_id VARCHAR(255) REFERENCES facilities(id) ON DELETE CASCADE NOT NULL,
    facility_name VARCHAR(255),
    sport_id VARCHAR(255) REFERENCES sports(id) ON DELETE CASCADE NOT NULL,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    description TEXT,
    entry_fee NUMERIC(10, 2) DEFAULT 0.00,
    max_participants INTEGER,
    registered_participants INTEGER DEFAULT 0
);

-- Create notifications table
CREATE TABLE notifications (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    icon_name VARCHAR(100),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);


-- SEED DATA --

-- Seed Sports
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

-- Seed Amenities
INSERT INTO amenities (id, name, icon_name) VALUES
('amenity-1', 'Parking', 'ParkingCircle'),
('amenity-2', 'WiFi', 'Wifi'),
('amenity-3', 'Showers', 'ShowerHead'),
('amenity-4', 'Lockers', 'Lock'),
('amenity-5', 'Equipment Rental', 'PackageSearch'),
('amenity-6', 'Cafe', 'Utensils'),
('amenity-7', 'Accessible', 'Users');


-- Seed Users
INSERT INTO users (id, name, email, password, role, status, profile_picture_url, loyalty_points, membership_level) VALUES
('user-admin-kunj', 'Kunj Patel', 'kunjp1157@gmail.com', 'Kunj@2810', 'Admin', 'Active', 'https://randomuser.me/api/portraits/men/75.jpg', 1250, 'Premium'),
('user-owner-dana', 'Dana White', 'dana.white@example.com', 'owner@123', 'FacilityOwner', 'Active', 'https://randomuser.me/api/portraits/women/68.jpg', 450, 'Basic'),
('user-regular-charlie', 'Charlie Davis', 'charlie.davis@example.com', 'user@123', 'User', 'Active', 'https://randomuser.me/api/portraits/men/32.jpg', 800, 'Basic'),
('user-new-user', 'Test User', 'user@gmail.com', 'user@123', 'User', 'Active', 'https://randomuser.me/api/portraits/lego/3.jpg', 50, 'Basic'),
('user-new-owner', 'Test Owner', 'owner@gmail.com', 'owner@123', 'FacilityOwner', 'Active', 'https://randomuser.me/api/portraits/lego/4.jpg', 50, 'Basic');

-- Seed Facilities
INSERT INTO facilities (id, name, type, address, city, location, description, rating, is_popular, is_indoor, owner_id) VALUES
('facility-1', 'Pune Sports Complex', 'Complex', '123 Stadium Way, Koregaon Park, Pune, 411001', 'Pune', 'Koregaon Park', 'A state-of-the-art multi-sport complex in the heart of the city.', 4.8, true, true, 'user-owner-dana'),
('facility-2', 'Deccan Gymkhana Tennis Club', 'Court', '456 Ace Avenue, Deccan, Pune, 411004', 'Pune', 'Deccan', 'Premier outdoor clay courts with a serene ambiance.', 4.5, false, false, null),
('facility-3', 'Kothrud Cricket Ground', 'Field', '789 Boundary Rd, Kothrud, Pune, 411038', 'Pune', 'Kothrud', 'A lush, expansive cricket field perfect for corporate matches and weekend games.', 4.7, true, false, 'user-owner-dana'),
('facility-4', 'Mumbai Cricket Club', 'Field', '10 Marine Drive, Churchgate, Mumbai, 400020', 'Mumbai', 'Churchgate', 'Iconic cricket ground with breathtaking views of the Arabian Sea.', 4.9, true, false, null),
('facility-5', 'Bandra Soccer Arena', 'Field', '22 Carter Road, Bandra West, Mumbai, 400050', 'Mumbai', 'Bandra', 'A 5-a-side rooftop soccer turf offering a unique playing experience.', 4.7, true, false, null),
('facility-6', 'Delhi Capital Courts', 'Complex', '5 Connaught Place, New Delhi, 110001', 'Delhi', 'Connaught Place', 'A modern indoor complex featuring professional basketball and badminton courts.', 4.6, true, true, null);


-- Link Sports to Facilities
INSERT INTO facility_sports (facility_id, sports_id) VALUES
('facility-1', 'sport-1'), ('facility-1', 'sport-2'),
('facility-2', 'sport-3'),
('facility-3', 'sport-13'),
('facility-4', 'sport-13'),
('facility-5', 'sport-1'),
('facility-6', 'sport-2'), ('facility-6', 'sport-4');

-- Link Amenities to Facilities
INSERT INTO facility_amenities (facility_id, amenity_id) VALUES
('facility-1', 'amenity-1'), ('facility-1', 'amenity-2'), ('facility-1', 'amenity-3'),
('facility-2', 'amenity-1'), ('facility-2', 'amenity-3'),
('facility-3', 'amenity-1'), ('facility-3', 'amenity-6'),
('facility-4', 'amenity-1'), ('facility-4', 'amenity-3'),
('facility-5', 'amenity-5'), ('facility-5', 'amenity-6'),
('facility-6', 'amenity-1'), ('facility-6', 'amenity-2'), ('facility-6', 'amenity-4');


-- Add Sport Prices
INSERT INTO facility_sport_prices (facility_id, sport_id, price, pricing_model) VALUES
('facility-1', 'sport-1', 2500, 'per_hour_flat'), ('facility-1', 'sport-2', 2200, 'per_hour_flat'),
('facility-2', 'sport-3', 1800, 'per_hour_flat'),
('facility-3', 'sport-13', 3000, 'per_hour_flat'),
('facility-4', 'sport-13', 4000, 'per_hour_flat'),
('facility-5', 'sport-1', 3500, 'per_hour_flat'),
('facility-6', 'sport-2', 2800, 'per_hour_per_person'), ('facility-6', 'sport-4', 1500, 'per_hour_per_person');

-- Add Operating Hours for all facilities
DO $$
DECLARE
    f_id VARCHAR;
BEGIN
    FOR f_id IN SELECT id FROM facilities
    LOOP
        INSERT INTO facility_operating_hours (facility_id, day, open_time, close_time) VALUES
        (f_id, 'Mon', '08:00', '22:00'),
        (f_id, 'Tue', '08:00', '22:00'),
        (f_id, 'Wed', '08:00', '22:00'),
        (f_id, 'Thu', '08:00', '22:00'),
        (f_id, 'Fri', '08:00', '23:00'),
        (f_id, 'Sat', '09:00', '23:00'),
        (f_id, 'Sun', '09:00', '20:00');
    END LOOP;
END;
$$;

