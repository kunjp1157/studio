-- Drop existing tables with CASCADE to handle dependencies
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS facility_amenities CASCADE;
DROP TABLE IF EXISTS facility_sports CASCADE;
DROP TABLE IF EXISTS facility_sport_prices CASCADE;
DROP TABLE IF EXISTS facility_operating_hours CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS facilities CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS sports CASCADE;
DROP TABLE IF EXISTS amenities CASCADE;

-- Create users table
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    phone VARCHAR(255),
    profile_picture_url VARCHAR(255),
    data_ai_hint VARCHAR(255),
    membership_level VARCHAR(255) DEFAULT 'Basic',
    loyalty_points INTEGER DEFAULT 0,
    role VARCHAR(50) NOT NULL DEFAULT 'User',
    status VARCHAR(50) NOT NULL DEFAULT 'Active',
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_profile_public BOOLEAN DEFAULT true,
    bio TEXT,
    preferred_playing_times VARCHAR(255)
);

-- Create sports table
CREATE TABLE sports (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    icon_name VARCHAR(255),
    image_url VARCHAR(255),
    data_ai_hint VARCHAR(255)
);

-- Create amenities table
CREATE TABLE amenities (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    icon_name VARCHAR(255)
);

-- Create facilities table
CREATE TABLE facilities (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50),
    address VARCHAR(255),
    city VARCHAR(100),
    location VARCHAR(100),
    description TEXT,
    rating NUMERIC(2, 1) DEFAULT 0.0,
    capacity INTEGER,
    is_popular BOOLEAN DEFAULT false,
    is_indoor BOOLEAN DEFAULT false,
    data_ai_hint VARCHAR(255),
    owner_id VARCHAR(255) REFERENCES users(id) ON DELETE SET NULL
);

-- Create facility_sports junction table
CREATE TABLE facility_sports (
    facility_id VARCHAR(255) REFERENCES facilities(id) ON DELETE CASCADE,
    sports_id VARCHAR(255) REFERENCES sports(id) ON DELETE CASCADE,
    PRIMARY KEY (facility_id, sports_id)
);

-- Create facility_amenities junction table
CREATE TABLE facility_amenities (
    facility_id VARCHAR(255) REFERENCES facilities(id) ON DELETE CASCADE,
    amenity_id VARCHAR(255) REFERENCES amenities(id) ON DELETE CASCADE,
    PRIMARY KEY (facility_id, amenity_id)
);

-- Create facility_sport_prices table
CREATE TABLE facility_sport_prices (
    id SERIAL PRIMARY KEY,
    facility_id VARCHAR(255) REFERENCES facilities(id) ON DELETE CASCADE,
    sport_id VARCHAR(255) REFERENCES sports(id) ON DELETE CASCADE,
    price NUMERIC(10, 2) NOT NULL,
    pricing_model VARCHAR(50) NOT NULL DEFAULT 'per_hour_flat',
    UNIQUE (facility_id, sport_id)
);

-- Create facility_operating_hours table
CREATE TABLE facility_operating_hours (
    id SERIAL PRIMARY KEY,
    facility_id VARCHAR(255) REFERENCES facilities(id) ON DELETE CASCADE,
    day VARCHAR(3) NOT NULL,
    open_time TIME,
    close_time TIME
);

-- Create bookings table
CREATE TABLE bookings (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
    facility_id VARCHAR(255) REFERENCES facilities(id) ON DELETE CASCADE,
    facility_name VARCHAR(255),
    data_ai_hint VARCHAR(255),
    sport_id VARCHAR(255),
    sport_name VARCHAR(255),
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_hours INTEGER,
    total_price NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    booked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reviewed BOOLEAN DEFAULT false
);

-- Create reviews table
CREATE TABLE reviews (
    id VARCHAR(255) PRIMARY KEY,
    facility_id VARCHAR(255) REFERENCES facilities(id) ON DELETE CASCADE,
    user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
    user_name VARCHAR(255),
    user_avatar VARCHAR(255),
    is_public_profile BOOLEAN,
    rating INTEGER NOT NULL,
    comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    booking_id VARCHAR(255) REFERENCES bookings(id) ON DELETE SET NULL
);

-- Insert initial static data

-- Insert amenities
INSERT INTO amenities (id, name, icon_name) VALUES
('amenity-1', 'Parking', 'ParkingCircle'),
('amenity-2', 'WiFi', 'Wifi'),
('amenity-3', 'Showers', 'ShowerHead'),
('amenity-4', 'Lockers', 'Lock'),
('amenity-5', 'Equipment Rental', 'PackageSearch'),
('amenity-6', 'Cafe', 'Utensils'),
('amenity-7', 'Accessible', 'Users');

-- Insert sports
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

-- Insert users first
INSERT INTO users (id, name, email, password, role, status, joined_at, loyalty_points, profile_picture_url, data_ai_hint, is_profile_public, membership_level) VALUES
('user-admin-kunj', 'Kunj Patel', 'kunjp1157@gmail.com', 'Kunj@2810', 'Admin', 'Active', '2023-01-15T10:00:00Z', 1250, 'https://randomuser.me/api/portraits/men/75.jpg', 'man smiling', true, 'Premium'),
('user-owner-dana', 'Dana White', 'dana.white@example.com', 'dana@123', 'FacilityOwner', 'Active', '2023-02-20T11:30:00Z', 450, 'https://randomuser.me/api/portraits/women/68.jpg', 'woman portrait', true, 'Basic'),
('user-regular-charlie', 'Charlie Davis', 'charlie.davis@example.com', 'charlie@123', 'User', 'Active', '2023-03-10T09:00:00Z', 800, 'https://randomuser.me/api/portraits/men/32.jpg', 'man glasses', true, 'Basic'),
('user-new-user', 'Test User', 'user@gmail.com', 'user@123', 'User', 'Active', '2024-01-01T12:00:00Z', 50, 'https://randomuser.me/api/portraits/lego/3.jpg', 'lego avatar', true, 'Basic'),
('user-new-owner', 'Test Owner', 'owner@gmail.com', 'owner@123', 'FacilityOwner', 'Active', '2024-01-01T12:00:00Z', 50, 'https://randomuser.me/api/portraits/lego/4.jpg', 'lego avatar', true, 'Basic');

-- Insert facilities
INSERT INTO facilities (id, name, type, address, city, location, description, rating, is_popular, is_indoor, data_ai_hint, owner_id) VALUES
('facility-1', 'Pune Sports Complex', 'Complex', '123 Stadium Way, Koregaon Park, Pune, 411001', 'Pune', 'Koregaon Park', 'A state-of-the-art multi-sport complex in the heart of the city. Perfect for professional training and casual play alike.', 4.8, true, true, 'soccer stadium', 'user-owner-dana'),
('facility-2', 'Deccan Gymkhana Tennis Club', 'Court', '456 Ace Avenue, Deccan, Pune, 411004', 'Pune', 'Deccan', 'Premier outdoor clay courts with a serene ambiance. Join our community of passionate tennis players.', 4.5, false, false, 'tennis court', null),
('facility-3', 'Kothrud Cricket Ground', 'Field', '789 Boundary Rd, Kothrud, Pune, 411038', 'Pune', 'Kothrud', 'A lush, expansive cricket field perfect for corporate matches and weekend games. Well-maintained pitch.', 4.7, true, false, 'cricket stadium', 'user-owner-dana'),
('facility-4', 'The Aundh Swim & Gym Hub', 'Complex', '101 Fitness Lane, Aundh, Pune, 411007', 'Pune', 'Aundh', 'A complete fitness destination with an olympic-sized swimming pool and a fully-equipped modern gymnasium.', 4.9, true, true, 'swimming pool gym', null),
('facility-11', 'Mumbai Cricket Club', 'Field', '10 Marine Drive, Churchgate, Mumbai, 400020', 'Mumbai', 'Churchgate', 'Iconic cricket ground with breathtaking views of the Arabian Sea. Experience cricket at its finest.', 4.9, true, false, 'mumbai cricket stadium', null);

-- Insert facility sports relationships
INSERT INTO facility_sports (facility_id, sports_id) VALUES
('facility-1', 'sport-1'), ('facility-1', 'sport-2'),
('facility-2', 'sport-3'),
('facility-3', 'sport-13'),
('facility-4', 'sport-5'), ('facility-4', 'sport-16'),
('facility-11', 'sport-13');

-- Insert facility sport prices
INSERT INTO facility_sport_prices (facility_id, sport_id, price, pricing_model) VALUES
('facility-1', 'sport-1', 2500, 'per_hour_flat'), ('facility-1', 'sport-2', 2200, 'per_hour_flat'),
('facility-2', 'sport-3', 1800, 'per_hour_flat'),
('facility-3', 'sport-13', 3000, 'per_hour_flat'),
('facility-4', 'sport-5', 400, 'per_hour_per_person'), ('facility-4', 'sport-16', 500, 'per_hour_per_person'),
('facility-11', 'sport-13', 4000, 'per_hour_flat');

-- Insert facility amenities
INSERT INTO facility_amenities (facility_id, amenity_id) VALUES
('facility-1', 'amenity-1'), ('facility-1', 'amenity-2'), ('facility-1', 'amenity-3'), ('facility-1', 'amenity-4'), ('facility-1', 'amenity-6'),
('facility-2', 'amenity-1'), ('facility-2', 'amenity-3'), ('facility-2', 'amenity-4'),
('facility-3', 'amenity-1'), ('facility-3', 'amenity-6'),
('facility-4', 'amenity-1'), ('facility-4', 'amenity-2'), ('facility-4', 'amenity-3'), ('facility-4', 'amenity-4'), ('facility-4', 'amenity-6'),
('facility-11', 'amenity-1'), ('facility-11', 'amenity-3'), ('facility-11', 'amenity-4');

-- Insert operating hours
INSERT INTO facility_operating_hours (facility_id, day, open_time, close_time) VALUES
('facility-1', 'Mon', '08:00', '22:00'), ('facility-1', 'Tue', '08:00', '22:00'), ('facility-1', 'Wed', '08:00', '22:00'), ('facility-1', 'Thu', '08:00', '22:00'), ('facility-1', 'Fri', '08:00', '23:00'), ('facility-1', 'Sat', '09:00', '23:00'), ('facility-1', 'Sun', '09:00', '20:00'),
('facility-2', 'Mon', '08:00', '22:00'), ('facility-2', 'Tue', '08:00', '22:00'), ('facility-2', 'Wed', '08:00', '22:00'), ('facility-2', 'Thu', '08:00', '22:00'), ('facility-2', 'Fri', '08:00', '23:00'), ('facility-2', 'Sat', '09:00', '23:00'), ('facility-2', 'Sun', '09:00', '20:00'),
('facility-3', 'Mon', '08:00', '22:00'), ('facility-3', 'Tue', '08:00', '22:00'), ('facility-3', 'Wed', '08:00', '22:00'), ('facility-3', 'Thu', '08:00', '22:00'), ('facility-3', 'Fri', '08:00', '23:00'), ('facility-3', 'Sat', '09:00', '23:00'), ('facility-3', 'Sun', '09:00', '20:00'),
('facility-4', 'Mon', '08:00', '22:00'), ('facility-4', 'Tue', '08:00', '22:00'), ('facility-4', 'Wed', '08:00', '22:00'), ('facility-4', 'Thu', '08:00', '22:00'), ('facility-4', 'Fri', '08:00', '23:00'), ('facility-4', 'Sat', '09:00', '23:00'), ('facility-4', 'Sun', '09:00', '20:00'),
('facility-11', 'Mon', '08:00', '22:00'), ('facility-11', 'Tue', '08:00', '22:00'), ('facility-11', 'Wed', '08:00', '22:00'), ('facility-11', 'Thu', '08:00', '22:00'), ('facility-11', 'Fri', '08:00', '23:00'), ('facility-11', 'Sat', '09:00', '23:00'), ('facility-11', 'Sun', '09:00', '20:00');
