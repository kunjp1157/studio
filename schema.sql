
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255),
    phone VARCHAR(20),
    profilePictureUrl VARCHAR(255),
    dataAiHint VARCHAR(255),
    preferredSports JSON,
    favoriteFacilities JSON,
    membershipLevel VARCHAR(50) DEFAULT 'Basic',
    loyaltyPoints INT DEFAULT 0,
    achievements JSON,
    bio TEXT,
    preferredPlayingTimes VARCHAR(255),
    skillLevels JSON,
    role ENUM('Admin', 'FacilityOwner', 'User') NOT NULL,
    status ENUM('Active', 'Suspended', 'PendingApproval') NOT NULL,
    joinedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    teamIds JSON,
    isProfilePublic BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS sports (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    iconName VARCHAR(255),
    imageUrl VARCHAR(255),
    imageDataAiHint VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS amenities (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    iconName VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS facilities (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type ENUM('Complex', 'Court', 'Field', 'Studio', 'Pool', 'Box Cricket') NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    rating DECIMAL(3, 2) DEFAULT 0.00,
    capacity INT,
    isPopular BOOLEAN DEFAULT false,
    isIndoor BOOLEAN DEFAULT false,
    dataAiHint VARCHAR(255),
    ownerId VARCHAR(255),
    FOREIGN KEY (ownerId) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS facility_sports (
    facilityId VARCHAR(255),
    sportId VARCHAR(255),
    PRIMARY KEY (facilityId, sportId),
    FOREIGN KEY (facilityId) REFERENCES facilities(id) ON DELETE CASCADE,
    FOREIGN KEY (sportId) REFERENCES sports(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS facility_amenities (
    facilityId VARCHAR(255),
    amenityId VARCHAR(255),
    PRIMARY KEY (facilityId, amenityId),
    FOREIGN KEY (facilityId) REFERENCES facilities(id) ON DELETE CASCADE,
    FOREIGN KEY (amenityId) REFERENCES amenities(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sport_prices (
    facilityId VARCHAR(255),
    sportId VARCHAR(255),
    price DECIMAL(10, 2) NOT NULL,
    pricingModel ENUM('per_hour_flat', 'per_hour_per_person') NOT NULL,
    PRIMARY KEY (facilityId, sportId),
    FOREIGN KEY (facilityId) REFERENCES facilities(id) ON DELETE CASCADE,
    FOREIGN KEY (sportId) REFERENCES sports(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS operating_hours (
    facilityId VARCHAR(255),
    day ENUM('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun') NOT NULL,
    open TIME NOT NULL,
    close TIME NOT NULL,
    PRIMARY KEY (facilityId, day),
    FOREIGN KEY (facilityId) REFERENCES facilities(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS rental_equipment (
    id VARCHAR(255) PRIMARY KEY,
    facilityId VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    pricePerItem DECIMAL(10, 2) NOT NULL,
    priceType ENUM('per_booking', 'per_hour') NOT NULL,
    stock INT NOT NULL,
    sportIds JSON,
    FOREIGN KEY (facilityId) REFERENCES facilities(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS bookings (
    id VARCHAR(255) PRIMARY KEY,
    userId VARCHAR(255),
    facilityId VARCHAR(255),
    facilityName VARCHAR(255),
    dataAiHint VARCHAR(255),
    sportId VARCHAR(255),
    sportName VARCHAR(255),
    date DATE NOT NULL,
    startTime TIME NOT NULL,
    endTime TIME NOT NULL,
    durationHours INT,
    numberOfGuests INT,
    baseFacilityPrice DECIMAL(10, 2),
    equipmentRentalCost DECIMAL(10, 2),
    totalPrice DECIMAL(10, 2) NOT NULL,
    status ENUM('Confirmed', 'Pending', 'Cancelled') NOT NULL,
    bookedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed BOOLEAN DEFAULT false,
    appliedPromotion JSON,
    rentedEquipment JSON,
    phoneNumber VARCHAR(20),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (facilityId) REFERENCES facilities(id) ON DELETE CASCADE,
    FOREIGN KEY (sportId) REFERENCES sports(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reviews (
    id VARCHAR(255) PRIMARY KEY,
    facilityId VARCHAR(255),
    userId VARCHAR(255),
    userName VARCHAR(255),
    userAvatar VARCHAR(255),
    isPublicProfile BOOLEAN,
    rating INT NOT NULL,
    comment TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    bookingId VARCHAR(255),
    FOREIGN KEY (facilityId) REFERENCES facilities(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (bookingId) REFERENCES bookings(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS blocked_slots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    facilityId VARCHAR(255),
    date DATE NOT NULL,
    startTime TIME NOT NULL,
    endTime TIME NOT NULL,
    reason TEXT,
    FOREIGN KEY (facilityId) REFERENCES facilities(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS maintenance_schedules (
    id VARCHAR(255) PRIMARY KEY,
    facilityId VARCHAR(255),
    taskName VARCHAR(255) NOT NULL,
    recurrenceInDays INT NOT NULL,
    lastPerformedDate DATE NOT NULL,
    FOREIGN KEY (facilityId) REFERENCES facilities(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS teams (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sportId VARCHAR(255),
    captainId VARCHAR(255),
    memberIds JSON,
    FOREIGN KEY (sportId) REFERENCES sports(id) ON DELETE SET NULL,
    FOREIGN KEY (captainId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS challenges (
    id VARCHAR(255) PRIMARY KEY,
    challengerId VARCHAR(255),
    opponentId VARCHAR(255),
    sportId VARCHAR(255),
    facilityId VARCHAR(255),
    facilityName VARCHAR(255),
    proposedDate DATETIME NOT NULL,
    notes TEXT,
    status ENUM('open', 'accepted', 'completed', 'cancelled') NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (challengerId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (opponentId) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (sportId) REFERENCES sports(id) ON DELETE CASCADE,
    FOREIGN KEY (facilityId) REFERENCES facilities(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS lfg_requests (
    id VARCHAR(255) PRIMARY KEY,
    userId VARCHAR(255),
    sportId VARCHAR(255),
    facilityId VARCHAR(255),
    facilityName VARCHAR(255),
    notes TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('open', 'closed') NOT NULL,
    interestedUserIds JSON,
    skillLevel ENUM('Any', 'Beginner', 'Intermediate', 'Advanced'),
    playersNeeded INT,
    preferredTime VARCHAR(255),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (sportId) REFERENCES sports(id) ON DELETE CASCADE,
    FOREIGN KEY (facilityId) REFERENCES facilities(id) ON DELETE CASCADE
);

-- Seed initial amenities
INSERT IGNORE INTO amenities (id, name, iconName) VALUES
('amenity-1', 'Parking', 'ParkingCircle'),
('amenity-2', 'Locker Room', 'Lock'),
('amenity-3', 'Showers', 'ShowerHead'),
('amenity-4', 'Wi-Fi', 'Wifi'),
('amenity-5', 'Equipment Rental', 'Dumbbell'),
('amenity-6', 'Cafe', 'Utensils'),
('amenity-7', 'First Aid', 'Feather'),
('amenity-8', 'Spectator Area', 'Users');
