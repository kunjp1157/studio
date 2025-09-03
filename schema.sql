-- Enable the pgcrypto extension for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    phone VARCHAR(50),
    profile_picture_url VARCHAR(255),
    data_ai_hint VARCHAR(255),
    membership_level VARCHAR(50) DEFAULT 'Basic',
    loyalty_points INTEGER DEFAULT 0,
    role VARCHAR(50) NOT NULL CHECK (role IN ('Admin', 'FacilityOwner', 'User')),
    status VARCHAR(50) NOT NULL CHECK (status IN ('Active', 'Suspended', 'PendingApproval')),
    joined_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    is_profile_public BOOLEAN DEFAULT true,
    bio TEXT,
    preferred_playing_times VARCHAR(255)
);

-- Sports Table
CREATE TABLE sports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    icon_name VARCHAR(255),
    image_url VARCHAR(255),
    image_data_ai_hint VARCHAR(255)
);

-- Amenities Table
CREATE TABLE amenities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    icon_name VARCHAR(255)
);

-- Facilities Table
CREATE TABLE facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    description TEXT,
    rating NUMERIC(3, 1) DEFAULT 0.0,
    capacity INTEGER,
    is_popular BOOLEAN DEFAULT false,
    is_indoor BOOLEAN DEFAULT false,
    data_ai_hint VARCHAR(255),
    owner_id UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Junction table for facilities and sports
CREATE TABLE facility_sports (
    facility_id UUID REFERENCES facilities(id) ON DELETE CASCADE,
    sports_id UUID REFERENCES sports(id) ON DELETE CASCADE,
    PRIMARY KEY (facility_id, sports_id)
);

-- Junction table for facilities and amenities
CREATE TABLE facility_amenities (
    facility_id UUID REFERENCES facilities(id) ON DELETE CASCADE,
    amenity_id UUID REFERENCES amenities(id) ON DELETE CASCADE,
    PRIMARY KEY (facility_id, amenity_id)
);

-- Table for sport-specific pricing at facilities
CREATE TABLE facility_sport_prices (
    facility_id UUID REFERENCES facilities(id) ON DELETE CASCADE,
    sport_id UUID REFERENCES sports(id) ON DELETE CASCADE,
    price NUMERIC(10, 2) NOT NULL,
    pricing_model VARCHAR(50) NOT NULL DEFAULT 'per_hour_flat',
    PRIMARY KEY (facility_id, sport_id)
);

-- Table for facility operating hours
CREATE TABLE facility_operating_hours (
    facility_id UUID REFERENCES facilities(id) ON DELETE CASCADE,
    day VARCHAR(3) NOT NULL CHECK (day IN ('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun')),
    open_time TIME NOT NULL,
    close_time TIME NOT NULL,
    PRIMARY KEY (facility_id, day)
);

-- Bookings Table
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    facility_id UUID REFERENCES facilities(id) ON DELETE CASCADE,
    sport_id UUID REFERENCES sports(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_hours INTEGER,
    total_price NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('Confirmed', 'Pending', 'Cancelled')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    reviewed BOOLEAN DEFAULT false,
    base_facility_price NUMERIC(10, 2) DEFAULT 0.00,
    equipment_rental_cost NUMERIC(10, 2) DEFAULT 0.00,
    applied_promotion_code VARCHAR(255),
    applied_promotion_discount NUMERIC(10, 2),
    number_of_guests INTEGER
);

-- Reviews Table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facility_id UUID REFERENCES facilities(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    user_name VARCHAR(255) NOT NULL,
    user_avatar VARCHAR(255),
    is_public_profile BOOLEAN DEFAULT true,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Events Table
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    facility_id UUID REFERENCES facilities(id) ON DELETE CASCADE,
    facility_name VARCHAR(255),
    sport_id UUID REFERENCES sports(id) ON DELETE CASCADE,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    description TEXT,
    entry_fee NUMERIC(10, 2) DEFAULT 0,
    max_participants INTEGER,
    registered_participants INTEGER DEFAULT 0
);

-- Notifications Table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    link VARCHAR(255),
    icon_name VARCHAR(100),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- You can add more tables for teams, matchmaking, etc. as needed.
