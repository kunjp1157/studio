-- PostgreSQL schema for the Sports Arena application
-- This schema defines the structure, tables, and relationships for the app's data.

-- Custom ENUM types to enforce specific values for certain columns.
CREATE TYPE user_role AS ENUM ('Admin', 'FacilityOwner', 'User');
CREATE TYPE user_status AS ENUM ('Active', 'Suspended', 'PendingApproval');
CREATE TYPE facility_type AS ENUM ('Complex', 'Court', 'Field', 'Studio', 'Pool', 'Box Cricket');
CREATE TYPE booking_status AS ENUM ('Confirmed', 'Pending', 'Cancelled');
CREATE TYPE equipment_price_type AS ENUM ('per_booking', 'per_hour');
CREATE TYPE discount_type AS ENUM ('percentage', 'fixed_amount');
CREATE TYPE price_adjustment_type AS ENUM ('percentage_increase', 'percentage_decrease', 'fixed_increase', 'fixed_decrease', 'fixed_price');

-- Users table to store user profile information.
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    profile_picture_url TEXT,
    data_ai_hint VARCHAR(255),
    membership_level VARCHAR(50) DEFAULT 'Basic',
    loyalty_points INTEGER DEFAULT 0,
    bio TEXT,
    preferred_playing_times VARCHAR(255),
    role user_role NOT NULL DEFAULT 'User',
    status user_status NOT NULL DEFAULT 'Active',
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_profile_public BOOLEAN DEFAULT true
);

-- Sports table to store different types of sports.
CREATE TABLE sports (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon_name VARCHAR(100),
    image_url TEXT,
    image_data_ai_hint VARCHAR(255)
);

-- Amenities table for facilities.
CREATE TABLE amenities (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon_name VARCHAR(100)
);

-- Facilities table for all sports venues.
CREATE TABLE facilities (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type facility_type NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    description TEXT,
    images TEXT[],
    rating NUMERIC(2, 1) DEFAULT 0.0,
    capacity INTEGER,
    is_popular BOOLEAN DEFAULT false,
    is_indoor BOOLEAN DEFAULT false,
    data_ai_hint VARCHAR(255),
    owner_id VARCHAR(255) REFERENCES users(id)
);

-- Junction table for many-to-many relationship between facilities and sports.
CREATE TABLE facility_sports (
    facility_id VARCHAR(255) REFERENCES facilities(id) ON DELETE CASCADE,
    sport_id VARCHAR(255) REFERENCES sports(id) ON DELETE CASCADE,
    price_per_hour NUMERIC(10, 2) NOT NULL,
    PRIMARY KEY (facility_id, sport_id)
);

-- Junction table for many-to-many relationship between facilities and amenities.
CREATE TABLE facility_amenities (
    facility_id VARCHAR(255) REFERENCES facilities(id) ON DELETE CASCADE,
    amenity_id VARCHAR(255) REFERENCES amenities(id) ON DELETE CASCADE,
    PRIMARY KEY (facility_id, amenity_id)
);

-- Operating hours for facilities.
CREATE TABLE operating_hours (
    id SERIAL PRIMARY KEY,
    facility_id VARCHAR(255) REFERENCES facilities(id) ON DELETE CASCADE,
    day VARCHAR(3) NOT NULL,
    open_time TIME NOT NULL,
    close_time TIME NOT NULL
);

-- Bookings table to store all reservations.
CREATE TABLE bookings (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES users(id) ON DELETE SET NULL,
    facility_id VARCHAR(255) REFERENCES facilities(id) ON DELETE CASCADE,
    sport_id VARCHAR(255) REFERENCES sports(id),
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    status booking_status NOT NULL,
    booked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reviewed BOOLEAN DEFAULT false
);

-- Reviews for facilities.
CREATE TABLE reviews (
    id VARCHAR(255) PRIMARY KEY,
    facility_id VARCHAR(255) REFERENCES facilities(id) ON DELETE CASCADE,
    user_id VARCHAR(255) REFERENCES users(id) ON DELETE SET NULL,
    booking_id VARCHAR(255) REFERENCES bookings(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Membership plans available.
CREATE TABLE membership_plans (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    price_per_month NUMERIC(10, 2) NOT NULL,
    benefits TEXT[]
);

-- Sports events.
CREATE TABLE events (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    facility_id VARCHAR(255) REFERENCES facilities(id) ON DELETE CASCADE,
    sport_id VARCHAR(255) REFERENCES sports(id),
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    description TEXT,
    entry_fee NUMERIC(10, 2) DEFAULT 0,
    max_participants INTEGER,
    registered_participants INTEGER DEFAULT 0,
    image_url TEXT,
    image_data_ai_hint VARCHAR(255)
);

-- Pricing rules for dynamic adjustments.
CREATE TABLE pricing_rules (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    adjustment_type price_adjustment_type NOT NULL,
    value NUMERIC(10, 2) NOT NULL,
    priority INTEGER,
    days_of_week VARCHAR(3)[],
    time_range_start TIME,
    time_range_end TIME,
    date_range_start DATE,
    date_range_end DATE
);

-- Promotion rules and coupons.
CREATE TABLE promotion_rules (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    code VARCHAR(50) UNIQUE,
    discount_type discount_type NOT NULL,
    discount_value NUMERIC(10, 2) NOT NULL,
    start_date DATE,
    end_date DATE,
    usage_limit INTEGER,
    usage_limit_per_user INTEGER,
    is_active BOOLEAN DEFAULT true
);

-- Indexes for frequently queried columns to improve performance.
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_facility_id ON bookings(facility_id);
CREATE INDEX idx_reviews_facility_id ON reviews(facility_id);
CREATE INDEX idx_facilities_city ON facilities(city);
CREATE INDEX idx_facilities_location ON facilities(location);
