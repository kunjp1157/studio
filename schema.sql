
-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    phone VARCHAR(255),
    profile_picture_url VARCHAR(255),
    data_ai_hint VARCHAR(255),
    membership_level VARCHAR(50) DEFAULT 'Basic',
    loyalty_points INT DEFAULT 0,
    bio TEXT,
    preferred_playing_times VARCHAR(255),
    role VARCHAR(50) NOT NULL DEFAULT 'User',
    status VARCHAR(50) NOT NULL DEFAULT 'Active',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_profile_public BOOLEAN DEFAULT TRUE
);

-- Sports Table
CREATE TABLE IF NOT EXISTS sports (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    icon_name VARCHAR(255),
    image_url VARCHAR(255),
    image_data_ai_hint VARCHAR(255)
);

-- Amenities Table
CREATE TABLE IF NOT EXISTS amenities (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    icon_name VARCHAR(255)
);

-- Facilities Table
CREATE TABLE IF NOT EXISTS facilities (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    description TEXT,
    rating DECIMAL(2, 1) DEFAULT 0.0,
    capacity INT,
    is_popular BOOLEAN DEFAULT FALSE,
    is_indoor BOOLEAN DEFAULT FALSE,
    data_ai_hint VARCHAR(255),
    owner_id VARCHAR(255),
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255),
    facility_id VARCHAR(255) NOT NULL,
    sport_id VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_hours INT,
    number_of_guests INT,
    base_facility_price DECIMAL(10, 2) NOT NULL,
    equipment_rental_cost DECIMAL(10, 2) DEFAULT 0.0,
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    booked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed BOOLEAN DEFAULT FALSE,
    phone_number VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (facility_id) REFERENCES facilities(id) ON DELETE CASCADE,
    FOREIGN KEY (sport_id) REFERENCES sports(id) ON DELETE CASCADE
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    facility_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    booking_id VARCHAR(255),
    rating INT NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (facility_id) REFERENCES facilities(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    link VARCHAR(255),
    icon_name VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Teams Table
CREATE TABLE IF NOT EXISTS teams (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sport_id VARCHAR(255) NOT NULL,
    captain_id VARCHAR(255) NOT NULL,
    FOREIGN KEY (sport_id) REFERENCES sports(id),
    FOREIGN KEY (captain_id) REFERENCES users(id)
);

-- Team Members Junction Table
CREATE TABLE IF NOT EXISTS team_members (
    team_id VARCHAR(255),
    user_id VARCHAR(255),
    PRIMARY KEY (team_id, user_id),
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Facility Sports Junction Table
CREATE TABLE IF NOT EXISTS facility_sports (
    facility_id VARCHAR(255),
    sport_id VARCHAR(255),
    PRIMARY KEY (facility_id, sport_id),
    FOREIGN KEY (facility_id) REFERENCES facilities(id) ON DELETE CASCADE,
    FOREIGN KEY (sport_id) REFERENCES sports(id) ON DELETE CASCADE
);

-- Sport Prices Table
CREATE TABLE IF NOT EXISTS sport_prices (
    facility_id VARCHAR(255),
    sport_id VARCHAR(255),
    price DECIMAL(10, 2) NOT NULL,
    pricing_model VARCHAR(50) NOT NULL DEFAULT 'per_hour_flat',
    PRIMARY KEY (facility_id, sport_id),
    FOREIGN KEY (facility_id) REFERENCES facilities(id) ON DELETE CASCADE,
    FOREIGN KEY (sport_id) REFERENCES sports(id) ON DELETE CASCADE
);

-- Facility Amenities Junction Table
CREATE TABLE IF NOT EXISTS facility_amenities (
    facility_id VARCHAR(255),
    amenity_id VARCHAR(255),
    PRIMARY KEY (facility_id, amenity_id),
    FOREIGN KEY (facility_id) REFERENCES facilities(id) ON DELETE CASCADE,
    FOREIGN KEY (amenity_id) REFERENCES amenities(id) ON DELETE CASCADE
);

-- Operating Hours Table
CREATE TABLE IF NOT EXISTS operating_hours (
    facility_id VARCHAR(255),
    day_of_week ENUM('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'),
    open_time TIME,
    close_time TIME,
    PRIMARY KEY (facility_id, day_of_week),
    FOREIGN KEY (facility_id) REFERENCES facilities(id) ON DELETE CASCADE
);

-- Blocked Slots Table
CREATE TABLE IF NOT EXISTS blocked_slots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    facility_id VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    reason VARCHAR(255),
    FOREIGN KEY (facility_id) REFERENCES facilities(id) ON DELETE CASCADE
);

-- Favorite Facilities Junction Table
CREATE TABLE IF NOT EXISTS favorite_facilities (
    user_id VARCHAR(255),
    facility_id VARCHAR(255),
    PRIMARY KEY (user_id, facility_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (facility_id) REFERENCES facilities(id) ON DELETE CASCADE
);

-- User Skills Table
CREATE TABLE IF NOT EXISTS user_skills (
    user_id VARCHAR(255),
    sport_id VARCHAR(255),
    level ENUM('Beginner', 'Intermediate', 'Advanced'),
    PRIMARY KEY (user_id, sport_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (sport_id) REFERENCES sports(id) ON DELETE CASCADE
);

-- Achievements Table
CREATE TABLE IF NOT EXISTS achievements (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon_name VARCHAR(255)
);

-- User Achievements Junction Table
CREATE TABLE IF NOT EXISTS user_achievements (
    user_id VARCHAR(255),
    achievement_id VARCHAR(255),
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, achievement_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE
);
