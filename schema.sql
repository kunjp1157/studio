-- Drop tables if they exist to start fresh
DROP TABLE IF EXISTS facility_amenities;
DROP TABLE IF EXISTS facility_sports;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS facilities;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS sports;
DROP TABLE IF EXISTS amenities;

-- Users Table
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    joined_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    loyalty_points INTEGER DEFAULT 0,
    profile_picture_url VARCHAR(255),
    data_ai_hint VARCHAR(255),
    is_profile_public BOOLEAN DEFAULT TRUE,
    membership_level VARCHAR(50)
);

-- Sports Table
CREATE TABLE sports (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    icon_name VARCHAR(255),
    image_url VARCHAR(255),
    image_data_ai_hint VARCHAR(255)
);

-- Amenities Table
CREATE TABLE amenities (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    icon_name VARCHAR(255)
);

-- Facilities Table
CREATE TABLE facilities (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    description TEXT,
    images TEXT[],
    operating_hours JSONB,
    sport_prices JSONB,
    rating NUMERIC(2, 1) DEFAULT 0.0,
    capacity INTEGER DEFAULT 0,
    is_popular BOOLEAN DEFAULT FALSE,
    is_indoor BOOLEAN DEFAULT FALSE,
    data_ai_hint VARCHAR(255),
    owner_id VARCHAR(255) REFERENCES users(id) ON DELETE SET NULL,
    blocked_slots JSONB
);

-- Bookings Table
CREATE TABLE bookings (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
    facility_id VARCHAR(255) REFERENCES facilities(id) ON DELETE CASCADE,
    facility_name VARCHAR(255),
    facility_image VARCHAR(255),
    data_ai_hint VARCHAR(255),
    sport_id VARCHAR(255),
    sport_name VARCHAR(255),
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_hours INTEGER,
    number_of_guests INTEGER,
    base_facility_price NUMERIC(10, 2),
    equipment_rental_cost NUMERIC(10, 2),
    applied_promotion JSONB,
    total_price NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    booked_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    reviewed BOOLEAN DEFAULT FALSE,
    rented_equipment JSONB
);

-- Reviews Table
CREATE TABLE reviews (
    id VARCHAR(255) PRIMARY KEY,
    facility_id VARCHAR(255) REFERENCES facilities(id) ON DELETE CASCADE,
    user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
    user_name VARCHAR(255),
    user_avatar VARCHAR(255),
    is_public_profile BOOLEAN,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    booking_id VARCHAR(255)
);

-- Junction table for facilities and sports
CREATE TABLE facility_sports (
    facility_id VARCHAR(255) REFERENCES facilities(id) ON DELETE CASCADE,
    sport_id VARCHAR(255) REFERENCES sports(id) ON DELETE CASCADE,
    PRIMARY KEY (facility_id, sport_id)
);

-- Junction table for facilities and amenities
CREATE TABLE facility_amenities (
    facility_id VARCHAR(255) REFERENCES facilities(id) ON DELETE CASCADE,
    amenity_id VARCHAR(255) REFERENCES amenities(id) ON DELETE CASCADE,
    PRIMARY KEY (facility_id, amenity_id)
);

-- Seed Sports Data
INSERT INTO sports (id, name, icon_name, image_url, image_data_ai_hint) VALUES
('sport-1', 'Soccer', 'Goal', 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55', 'soccer stadium'),
('sport-2', 'Basketball', 'Dribbble', 'https://images.unsplash.com/photo-1519861531473-9200262188bf', 'basketball court'),
('sport-3', 'Tennis', 'Activity', 'https://images.unsplash.com/photo-1554062614-6da4fa674b73', 'tennis court'),
('sport-4', 'Badminton', 'Feather', 'https://images.unsplash.com/photo-1521587514789-53b8a3b09228', 'badminton shuttlecock'),
('sport-5', 'Swimming', 'PersonStanding', 'https://images.unsplash.com/photo-1551604313-26835b334a81', 'swimming pool'),
('sport-6', 'Yoga', 'Brain', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b', 'yoga class'),
('sport-7', 'Cycling', 'Bike', 'https://images.unsplash.com/photo-1471506480216-e5719f9794d0', 'cycling velodrome'),
('sport-8', 'Dance', 'Music', 'https://images.unsplash.com/photo-1511719111394-550342a5b23d', 'dance studio'),
('sport-9', 'Camping', 'Tent', 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d', 'camping tent'),
('sport-10', 'Theatre', 'Drama', 'https://images.unsplash.com/photo-1489599849927-2ee91e38a493', 'theatre stage'),
('sport-13', 'Cricket', 'Dices', 'https://images.unsplash.com/photo-1593341646782-e0b495cffc25', 'cricket stadium'),
('sport-14', 'Pool', 'Target', 'https://images.unsplash.com/photo-1601758124235-7c98c199e4df', 'billiards table'),
('sport-15', 'PC Game/PS5', 'Gamepad2', 'https://images.unsplash.com/photo-1580327344181-c1163234e5a0', 'gaming setup'),
('sport-16', 'Gym', 'Dumbbell', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48', 'modern gym');

-- Seed Amenities Data
INSERT INTO amenities (id, name, icon_name) VALUES
('amenity-1', 'Parking', 'ParkingCircle'),
('amenity-2', 'WiFi', 'Wifi'),
('amenity-3', 'Showers', 'ShowerHead'),
('amenity-4', 'Lockers', 'Lock'),
('amenity-5', 'Equipment Rental Signage', 'PackageSearch'),
('amenity-6', 'Cafe', 'Utensils'),
('amenity-7', 'Accessible', 'Users');

-- Seed Facilities Data
INSERT INTO facilities (id, name, type, address, city, location, description, images, operating_hours, sport_prices, rating, capacity, is_popular, is_indoor, data_ai_hint, owner_id) VALUES
('fac-1', 'Grand Arena', 'Complex', '123 Stadium Rd, Metropolis', 'Metropolis', 'Downtown', 'A state-of-the-art sports complex with multiple courts and fields for various sports.', 
'{"https://images.unsplash.com/photo-1579952363873-27f3bade9f55", "https://images.unsplash.com/photo-1519861531473-9200262188bf"}',
'[{"day": "Mon", "open": "08:00", "close": "22:00"}, {"day": "Tue", "open": "08:00", "close": "22:00"}, {"day": "Wed", "open": "08:00", "close": "22:00"}, {"day": "Thu", "open": "08:00", "close": "22:00"}, {"day": "Fri", "open": "08:00", "close": "23:00"}, {"day": "Sat", "open": "09:00", "close": "23:00"}, {"day": "Sun", "open": "09:00", "close": "20:00"}]',
'[{"sportId": "sport-1", "pricePerHour": 2500}, {"sportId": "sport-2", "pricePerHour": 2000}]',
4.7, 100, true, true, 'sports arena', 'user-owner-dana'),

('fac-2', 'City Tennis Club', 'Court', '456 Net Ave, Metropolis', 'Metropolis', 'Uptown', 'Premium clay and hard courts with excellent lighting for night play.',
'{"https://images.unsplash.com/photo-1554062614-6da4fa674b73"}',
'[{"day": "Mon", "open": "07:00", "close": "21:00"}, {"day": "Tue", "open": "07:00", "close": "21:00"}, {"day": "Wed", "open": "07:00", "close": "21:00"}, {"day": "Thu", "open": "07:00", "close": "21:00"}, {"day": "Fri", "open": "07:00", "close": "21:00"}, {"day": "Sat", "open": "08:00", "close": "19:00"}, {"day": "Sun", "open": "08:00", "close": "19:00"}]',
'[{"sportId": "sport-3", "pricePerHour": 1500}]',
4.5, 20, true, false, 'tennis court', 'user-owner-dana'),

('fac-3', 'Aqua Zone', 'Pool', '789 Water Ln, Metropolis', 'Metropolis', 'Suburbia', 'An Olympic-sized swimming pool with dedicated lanes for training and leisure.',
'{"https://images.unsplash.com/photo-1551604313-26835b334a81"}',
'[{"day": "Mon", "open": "06:00", "close": "20:00"}, {"day": "Tue", "open": "06:00", "close": "20:00"}, {"day": "Wed", "open": "06:00", "close": "20:00"}, {"day": "Thu", "open": "06:00", "close": "20:00"}, {"day": "Fri", "open": "06:00", "close": "20:00"}, {"day": "Sat", "open": "07:00", "close": "18:00"}, {"day": "Sun", "open": "07:00", "close": "18:00"}]',
'[{"sportId": "sport-5", "pricePerHour": 800}]',
4.8, 50, true, true, 'swimming pool', 'user-owner-dana'),

('fac-4', 'Racquet Retreat', 'Court', '101 Shuttlecock Blvd, Metropolis', 'Metropolis', 'Eastside', 'Indoor badminton courts with professional-grade mats and high ceilings.',
'{"https://images.unsplash.com/photo-1521587514789-53b8a3b09228"}',
'[{"day": "Mon", "open": "09:00", "close": "23:00"}, {"day": "Tue", "open": "09:00", "close": "23:00"}, {"day": "Wed", "open": "09:00", "close": "23:00"}, {"day": "Thu", "open": "09:00", "close": "23:00"}, {"day": "Fri", "open": "09:00", "close": "23:00"}, {"day": "Sat", "open": "10:00", "close": "22:00"}, {"day": "Sun", "open": "10:00", "close": "22:00"}]',
'[{"sportId": "sport-4", "pricePerHour": 1200}]',
4.6, 30, false, true, 'badminton court', 'user-owner-dana'),

('fac-5', 'Metro Box Cricket', 'Box Cricket', '22 Industrial Area, Metropolis', 'Metropolis', 'Industrial Area', 'A rooftop box cricket setup perfect for fast-paced 6-a-side games.',
'{"https://images.unsplash.com/photo-1593341646782-e0b495cffc25"}',
'[{"day": "Mon", "open": "10:00", "close": "01:00"}, {"day": "Tue", "open": "10:00", "close": "01:00"}, {"day": "Wed", "open": "10:00", "close": "01:00"}, {"day": "Thu", "open": "10:00", "close": "01:00"}, {"day": "Fri", "open": "10:00", "close": "02:00"}, {"day": "Sat", "open": "10:00", "close": "02:00"}, {"day": "Sun", "open": "10:00", "close": "01:00"}]',
'[{"sportId": "sport-13", "pricePerHour": 2200}]',
4.4, 12, true, false, 'box cricket', 'user-owner-dana'),

('fac-6', 'Zenith Yoga Studio', 'Studio', '33 Serenity St, Metropolis', 'Metropolis', 'Greenwich', 'A peaceful and spacious studio for yoga and meditation practices.',
'{"https://images.unsplash.com/photo-1544367567-0f2fcb009e0b"}',
'[{"day": "Mon", "open": "06:00", "close": "21:00"}, {"day": "Tue", "open": "06:00", "close": "21:00"}, {"day": "Wed", "open": "06:00", "close": "21:00"}, {"day": "Thu", "open": "06:00", "close": "21:00"}, {"day": "Fri", "open": "06:00", "close": "21:00"}, {"day": "Sat", "open": "08:00", "close": "14:00"}, {"day": "Sun", "open": "08:00", "close": "14:00"}]',
'[{"sportId": "sport-6", "pricePerHour": 1000}]',
4.9, 25, true, true, 'yoga studio', 'user-owner-dana'),

('fac-7', 'The Iron Temple', 'Gym', '55 Power Plaza, Metropolis', 'Metropolis', 'Downtown', 'A hardcore gym with a wide range of free weights and modern machinery.',
'{"https://images.unsplash.com/photo-1534438327276-14e5300c3a48"}',
'[{"day": "Mon", "open": "05:00", "close": "23:00"}, {"day": "Tue", "open": "05:00", "close": "23:00"}, {"day": "Wed", "open": "05:00", "close": "23:00"}, {"day": "Thu", "open": "05:00", "close": "23:00"}, {"day": "Fri", "open": "05:00", "close": "23:00"}, {"day": "Sat", "open": "07:00", "close": "21:00"}, {"day": "Sun", "open": "07:00", "close": "21:00"}]',
'[{"sportId": "sport-16", "pricePerHour": 500}]',
4.5, 150, false, true, 'modern gym', 'user-owner-dana'),

('fac-8', 'Cue & Cushion', 'Complex', '77 Break St, Metropolis', 'Metropolis', 'West End', 'A classic pool and billiards hall with well-maintained tables.',
'{"https://images.unsplash.com/photo-1601758124235-7c98c199e4df"}',
'[{"day": "Mon", "open": "12:00", "close": "00:00"}, {"day": "Tue", "open": "12:00", "close": "00:00"}, {"day": "Wed", "open": "12:00", "close": "00:00"}, {"day": "Thu", "open": "12:00", "close": "00:00"}, {"day": "Fri", "open": "12:00", "close": "02:00"}, {"day": "Sat", "open": "12:00", "close": "02:00"}, {"day": "Sun", "open": "12:00", "close": "00:00"}]',
'[{"sportId": "sport-14", "pricePerHour": 600}]',
4.3, 40, false, true, 'billiards hall', 'user-owner-dana');

-- Link Facilities to Sports
INSERT INTO facility_sports (facility_id, sport_id) VALUES
('fac-1', 'sport-1'), ('fac-1', 'sport-2'),
('fac-2', 'sport-3'),
('fac-3', 'sport-5'),
('fac-4', 'sport-4'),
('fac-5', 'sport-13'),
('fac-6', 'sport-6'),
('fac-7', 'sport-16'),
('fac-8', 'sport-14');

-- Link Facilities to Amenities
INSERT INTO facility_amenities (facility_id, amenity_id) VALUES
('fac-1', 'amenity-1'), ('fac-1', 'amenity-2'), ('fac-1', 'amenity-3'), ('fac-1', 'amenity-4'), ('fac-1', 'amenity-6'),
('fac-2', 'amenity-1'), ('fac-2', 'amenity-3'), ('fac-2', 'amenity-4'),
('fac-3', 'amenity-3'), ('fac-3', 'amenity-4'),
('fac-4', 'amenity-1'), ('fac-4', 'amenity-2'), ('fac-4', 'amenity-3'),
('fac-5', 'amenity-1'),
('fac-6', 'amenity-2'), ('fac-6', 'amenity-3'), ('fac-6', 'amenity-4'),
('fac-7', 'amenity-1'), ('fac-7', 'amenity-3'), ('fac-7', 'amenity-4'),
('fac-8', 'amenity-1'), ('fac-8', 'amenity-2'), ('fac-8', 'amenity-6');
