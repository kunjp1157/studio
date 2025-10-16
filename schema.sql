-- Main Entities
CREATE TABLE sports (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    iconName VARCHAR(255),
    imageUrl VARCHAR(255),
    imageDataAiHint VARCHAR(255)
);

CREATE TABLE amenities (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    iconName VARCHAR(255)
);

CREATE TABLE facilities (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    description TEXT,
    isIndoor BOOLEAN DEFAULT FALSE,
    isPopular BOOLEAN DEFAULT FALSE,
    capacity INT,
    rating DECIMAL(3, 2) DEFAULT 0.00,
    ownerId VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Active', -- Active, PendingApproval, Rejected, Inactive
    imageUrl TEXT,
    dataAiHint VARCHAR(255)
);

-- User-related Tables
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    profilePictureUrl TEXT,
    dataAiHint VARCHAR(255),
    role ENUM('Admin', 'FacilityOwner', 'User') NOT NULL DEFAULT 'User',
    status ENUM('Active', 'Suspended', 'PendingApproval') NOT NULL DEFAULT 'Active',
    membershipLevel ENUM('Basic', 'Premium', 'Pro') DEFAULT 'Basic',
    loyaltyPoints INT DEFAULT 0,
    bio TEXT,
    preferredPlayingTimes VARCHAR(255),
    skillLevels JSON,
    achievements JSON,
    favoriteFacilities JSON,
    preferredSports JSON,
    teamIds JSON,
    isProfilePublic BOOLEAN DEFAULT FALSE,
    joinedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE owner_verification_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId VARCHAR(255) NOT NULL,
    fullName VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    idNumber VARCHAR(50) NOT NULL,
    facilityName VARCHAR(255) NOT NULL,
    facilityAddress TEXT NOT NULL,
    identityProofPath VARCHAR(255) NOT NULL,
    addressProofPath VARCHAR(255) NOT NULL,
    ownershipProofPath VARCHAR(255) NOT NULL,
    status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE teams (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sportId VARCHAR(255) NOT NULL,
    captainId VARCHAR(255) NOT NULL,
    memberIds JSON,
    FOREIGN KEY (sportId) REFERENCES sports(id),
    FOREIGN KEY (captainId) REFERENCES users(id)
);

-- Junction Tables (Many-to-Many Relationships)
CREATE TABLE facility_sports (
    facilityId VARCHAR(255) NOT NULL,
    sportId VARCHAR(255) NOT NULL,
    PRIMARY KEY (facilityId, sportId),
    FOREIGN KEY (facilityId) REFERENCES facilities(id) ON DELETE CASCADE,
    FOREIGN KEY (sportId) REFERENCES sports(id) ON DELETE CASCADE
);

CREATE TABLE facility_amenities (
    facilityId VARCHAR(255) NOT NULL,
    amenityId VARCHAR(255) NOT NULL,
    PRIMARY KEY (facilityId, amenityId),
    FOREIGN KEY (facilityId) REFERENCES facilities(id) ON DELETE CASCADE,
    FOREIGN KEY (amenityId) REFERENCES amenities(id) ON DELETE CASCADE
);

-- Detailed Information Tables
CREATE TABLE facility_operating_hours (
    id INT AUTO_INCREMENT PRIMARY KEY,
    facilityId VARCHAR(255) NOT NULL,
    day ENUM('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun') NOT NULL,
    open TIME NOT NULL,
    close TIME NOT NULL,
    FOREIGN KEY (facilityId) REFERENCES facilities(id) ON DELETE CASCADE,
    UNIQUE KEY (facilityId, day)
);

CREATE TABLE facility_sport_prices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    facilityId VARCHAR(255) NOT NULL,
    sportId VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    pricingModel ENUM('per_hour_flat', 'per_hour_per_person') DEFAULT 'per_hour_flat',
    FOREIGN KEY (facilityId) REFERENCES facilities(id) ON DELETE CASCADE,
    FOREIGN KEY (sportId) REFERENCES sports(id) ON DELETE CASCADE,
    UNIQUE KEY (facilityId, sportId)
);

-- Core Functionality Tables
CREATE TABLE bookings (
    id VARCHAR(255) PRIMARY KEY,
    userId VARCHAR(255),
    facilityId VARCHAR(255) NOT NULL,
    sportId VARCHAR(255) NOT NULL,
    facilityName VARCHAR(255),
    sportName VARCHAR(255),
    date DATE NOT NULL,
    startTime TIME NOT NULL,
    endTime TIME NOT NULL,
    durationHours INT,
    numberOfGuests INT,
    baseFacilityPrice DECIMAL(10, 2) NOT NULL,
    equipmentRentalCost DECIMAL(10, 2) NOT NULL,
    totalPrice DECIMAL(10, 2) NOT NULL,
    status ENUM('Confirmed', 'Pending', 'Cancelled') NOT NULL,
    bookedAt DATETIME NOT NULL,
    reviewed BOOLEAN DEFAULT FALSE,
    rentedEquipment JSON,
    appliedPromotion JSON,
    phoneNumber VARCHAR(20),
    dataAiHint VARCHAR(255),
    pricingModel VARCHAR(50),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (facilityId) REFERENCES facilities(id) ON DELETE CASCADE,
    FOREIGN KEY (sportId) REFERENCES sports(id) ON DELETE CASCADE
);

CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    facilityId VARCHAR(255) NOT NULL,
    userId VARCHAR(255) NOT NULL,
    bookingId VARCHAR(255),
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    userName VARCHAR(255),
    userAvatar VARCHAR(255),
    isPublicProfile BOOLEAN,
    FOREIGN KEY (facilityId) REFERENCES facilities(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (bookingId) REFERENCES bookings(id) ON DELETE SET NULL
);

CREATE TABLE events (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    facilityId VARCHAR(255) NOT NULL,
    facilityName VARCHAR(255),
    sportId VARCHAR(255) NOT NULL,
    startDate DATETIME NOT NULL,
    endDate DATETIME NOT NULL,
    description TEXT,
    entryFee DECIMAL(10, 2) DEFAULT 0,
    maxParticipants INT DEFAULT 0,
    registeredParticipants INT DEFAULT 0,
    imageUrl VARCHAR(255),
    imageDataAiHint VARCHAR(255),
    FOREIGN KEY (facilityId) REFERENCES facilities(id) ON DELETE CASCADE,
    FOREIGN KEY (sportId) REFERENCES sports(id) ON DELETE CASCADE
);

-- Advanced Feature Tables
CREATE TABLE membership_plans (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    pricePerMonth DECIMAL(10, 2) NOT NULL,
    benefits JSON
);

CREATE TABLE pricing_rules (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    facilityIds JSON,
    daysOfWeek JSON,
    timeRange JSON,
    dateRange JSON,
    adjustmentType VARCHAR(50) NOT NULL,
    value DECIMAL(10, 2) NOT NULL,
    priority INT DEFAULT 100,
    isActive BOOLEAN DEFAULT TRUE
);

CREATE TABLE promotion_rules (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    code VARCHAR(255) UNIQUE,
    discountType VARCHAR(50) NOT NULL,
    discountValue DECIMAL(10, 2) NOT NULL,
    startDate DATE,
    endDate DATE,
    usageLimit INT,
    usageLimitPerUser INT,
    isActive BOOLEAN DEFAULT TRUE
);

CREATE TABLE rental_equipment (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    pricePerItem DECIMAL(10, 2) NOT NULL,
    priceType ENUM('per_booking', 'per_hour') NOT NULL,
    stock INT NOT NULL,
    sportIds JSON
);

CREATE TABLE facility_equipment (
    facilityId VARCHAR(255) NOT NULL,
    equipmentId VARCHAR(255) NOT NULL,
    PRIMARY KEY (facilityId, equipmentId),
    FOREIGN KEY (facilityId) REFERENCES facilities(id) ON DELETE CASCADE,
    FOREIGN KEY (equipmentId) REFERENCES rental_equipment(id) ON DELETE CASCADE
);

CREATE TABLE blog_posts (
    id VARCHAR(255) PRIMARY KEY,
    slug VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT,
    content LONGTEXT,
    authorName VARCHAR(255),
    authorAvatarUrl VARCHAR(255),
    publishedAt DATETIME NOT NULL,
    tags JSON,
    isFeatured BOOLEAN DEFAULT FALSE,
    dataAiHint VARCHAR(255)
);

CREATE TABLE lfg_requests (
    id VARCHAR(255) PRIMARY KEY,
    userId VARCHAR(255) NOT NULL,
    sportId VARCHAR(255) NOT NULL,
    facilityId VARCHAR(255) NOT NULL,
    facilityName VARCHAR(255),
    notes TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('open', 'closed') DEFAULT 'open',
    interestedUserIds JSON,
    skillLevel VARCHAR(50),
    playersNeeded INT,
    preferredTime VARCHAR(100),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (sportId) REFERENCES sports(id) ON DELETE CASCADE,
    FOREIGN KEY (facilityId) REFERENCES facilities(id) ON DELETE CASCADE
);

CREATE TABLE challenges (
    id VARCHAR(255) PRIMARY KEY,
    challengerId VARCHAR(255) NOT NULL,
    opponentId VARCHAR(255),
    sportId VARCHAR(255) NOT NULL,
    facilityId VARCHAR(255) NOT NULL,
    facilityName VARCHAR(255),
    proposedDate DATETIME NOT NULL,
    notes TEXT,
    status ENUM('open', 'accepted', 'completed', 'cancelled') DEFAULT 'open',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (challengerId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (opponentId) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (sportId) REFERENCES sports(id) ON DELETE CASCADE,
    FOREIGN KEY (facilityId) REFERENCES facilities(id) ON DELETE CASCADE
);
