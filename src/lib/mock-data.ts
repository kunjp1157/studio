

import type { Sport, Amenity, MembershipPlan, Facility, UserProfile, UserRole, UserStatus, FacilityOperatingHours, PricingModel, RentalEquipment } from './types';

// This file contains static mock data that is safe to be imported into client components.
// It has no server-side dependencies like the 'pg' database driver.

export const getMockSports = (): Sport[] => [
  { id: 'sport-1', name: 'Soccer', iconName: 'Goal', imageUrl: '/sports/soccer.jpg', imageDataAiHint: 'soccer field' },
  { id: 'sport-2', name: 'Basketball', iconName: 'Dribbble', imageUrl: '/sports/basketball.jpg', imageDataAiHint: 'basketball court' },
  { id: 'sport-3', name: 'Tennis', iconName: 'Drama', imageUrl: '/sports/tennis.jpg', imageDataAiHint: 'tennis court' },
  { id: 'sport-4', name: 'Badminton', iconName: 'Feather', imageUrl: '/sports/badminton.jpg', imageDataAiHint: 'badminton court' },
  { id: 'sport-5', name: 'Swimming', iconName: 'Bike', imageUrl: '/sports/swimming.jpg', imageDataAiHint: 'swimming pool' },
  { id: 'sport-6', name: 'Cricket', iconName: 'Cricket', imageUrl: '/sports/cricket.jpg', imageDataAiHint: 'cricket pitch' },
  { id: 'sport-7', name: 'Gym', iconName: 'Dumbbell', imageUrl: '/sports/gym.jpg', imageDataAiHint: 'modern gym' },
  { id: 'sport-8', name: 'Yoga', iconName: 'PersonStanding', imageUrl: '/sports/yoga.jpg', imageDataAiHint: 'yoga studio' },
];

export const getStaticSports = (): Sport[] => getMockSports();

export const mockAmenities: Amenity[] = [
  { id: 'amenity-1', name: 'Parking', iconName: 'ParkingCircle' },
  { id: 'amenity-2', name: 'WiFi', iconName: 'Wifi' },
  { id: 'amenity-3', name: 'Showers', iconName: 'ShowerHead' },
  { id: 'amenity-4', name: 'Lockers', iconName: 'Lock' },
  { id: 'amenity-5', name: 'Equipment Rental', iconName: 'PackageSearch' },
  { id: 'amenity-6', name: 'Cafe', iconName: 'Utensils' },
  { id: 'amenity-7', name: 'Accessible', iconName: 'Users' },
];

export const getStaticAmenities = (): Amenity[] => mockAmenities;

export const getStaticUsers = (): UserProfile[] => [
    { id: 'user-1', name: 'Aditya Sharma', email: 'kunjp1157@gmail.com', password: 'Kunj@2810', role: 'Admin', status: 'Active', joinedAt: new Date().toISOString(), isProfilePublic: true, loyaltyPoints: 1250, membershipLevel: 'Pro', favoriteFacilities: ['facility-1'] },
    { id: 'user-2', name: 'Priya Patel', email: 'priya.patel@example.com', password: 'password123', role: 'FacilityOwner', status: 'Active', joinedAt: new Date().toISOString(), isProfilePublic: true, loyaltyPoints: 800, membershipLevel: 'Premium', favoriteFacilities: ['facility-2'] },
    { id: 'user-3', name: 'Charlie Davis', email: 'charlie.davis@example.com', password: 'password123', role: 'User', status: 'Active', joinedAt: new Date().toISOString(), isProfilePublic: true, loyaltyPoints: 450, membershipLevel: 'Basic', favoriteFacilities: ['facility-1', 'facility-3'] },
    { id: 'user-4', name: 'Rohan Mehta', email: 'rohan.mehta@example.com', password: 'password123', role: 'User', status: 'Suspended', joinedAt: new Date().toISOString(), isProfilePublic: false, loyaltyPoints: 150 },
];


export const getStaticFacilities = (): Facility[] => {
    const sports = getStaticSports();
    const amenities = getStaticAmenities();
    return [
    {
      id: 'facility-1', name: 'Grand Sports Arena', type: 'Complex',
      address: '123, Vittal Mallya Rd, Bengaluru, 560001', city: 'Bengaluru', location: 'Ashok Nagar',
      description: 'A premium multi-sport complex in the heart of Bengaluru, offering world-class facilities for soccer, basketball, and tennis.',
      sports: [sports[0], sports[1], sports[2]],
      sportPrices: [{ sportId: 'sport-1', price: 1500, pricingModel: 'per_hour_flat' }, { sportId: 'sport-2', price: 1200, pricingModel: 'per_hour_flat' }, { sportId: 'sport-3', price: 800, pricingModel: 'per_hour_flat' }],
      amenities: [amenities[0], amenities[1], amenities[2], amenities[3], amenities[4], amenities[5]],
      operatingHours: [ { day: 'Mon', open: '06:00', close: '22:00' }, { day: 'Tue', open: '06:00', close: '22:00' }, { day: 'Wed', open: '06:00', close: '22:00' }, { day: 'Thu', open: '06:00', close: '22:00' }, { day: 'Fri', open: '06:00', close: '23:00' }, { day: 'Sat', open: '07:00', close: '23:00' }, { day: 'Sun', open: '07:00', close: '21:00' }, ],
      rating: 4.8,
      reviews: [{ id: 'review-1', facilityId: 'facility-1', userId: 'user-2', userName: 'Priya Patel', rating: 5, comment: "Amazing facilities, very well maintained. The lighting for night games is top-notch!", createdAt: new Date().toISOString(), isPublicProfile: true }],
      capacity: 200, isPopular: true, isIndoor: false,
      dataAiHint: 'sports complex soccer',
      ownerId: 'user-2',
      availableEquipment: [{ id: 'equip-1', name: 'Soccer Ball', pricePerItem: 50, priceType: 'per_booking', stock: 20, sportIds: ['sport-1'] }]
    },
    {
      id: 'facility-2', name: 'The Racquet Club', type: 'Court',
      address: '45, Juhu Tara Rd, Juhu, Mumbai, 400049', city: 'Mumbai', location: 'Juhu',
      description: 'Exclusive club for racquet sports enthusiasts, featuring professional-grade tennis and badminton courts.',
      sports: [sports[2], sports[3]],
      sportPrices: [{ sportId: 'sport-3', price: 1000, pricingModel: 'per_hour_flat' }, { sportId: 'sport-4', price: 700, pricingModel: 'per_hour_flat' }],
      amenities: [amenities[0], amenities[2], amenities[3], amenities[4]],
      operatingHours: [ { day: 'Mon', open: '07:00', close: '21:00' }, { day: 'Tue', open: '07:00', close: '21:00' }, { day: 'Wed', open: '07:00', close: '21:00' }, { day: 'Thu', open: '07:00', close: '21:00' }, { day: 'Fri', open: '07:00', close: '22:00' }, { day: 'Sat', open: '08:00', close: '22:00' }, { day: 'Sun', open: '08:00', close: '20:00' }, ],
      rating: 4.6,
      reviews: [{ id: 'review-2', facilityId: 'facility-2', userId: 'user-3', userName: 'Charlie Davis', rating: 4, comment: "Great courts, but booking can be a bit difficult on weekends.", createdAt: new Date().toISOString(), isPublicProfile: true }],
      capacity: 50, isPopular: true, isIndoor: true,
      dataAiHint: 'tennis club badminton',
      ownerId: 'user-2',
      availableEquipment: [{ id: 'equip-2', name: 'Tennis Racquet', pricePerItem: 150, priceType: 'per_hour', stock: 10, sportIds: ['sport-3'] }]
    },
    {
      id: 'facility-3', name: 'Olympus Swim & Gym', type: 'Complex',
      address: '789, Anna Salai, T. Nagar, Chennai, 600017', city: 'Chennai', location: 'T. Nagar',
      description: 'State-of-the-art fitness center with a modern gym and a half-olympic size swimming pool.',
      sports: [sports[4], sports[6]],
      sportPrices: [{ sportId: 'sport-4', price: 400, pricingModel: 'per_hour_per_person' }, { sportId: 'sport-6', price: 600, pricingModel: 'per_hour_flat' }],
      amenities: [amenities[0], amenities[1], amenities[2], amenities[3], amenities[6]],
      operatingHours: [ { day: 'Mon', open: '05:00', close: '23:00' }, { day: 'Tue', open: '05:00', close: '23:00' }, { day: 'Wed', open: '05:00', close: '23:00' }, { day: 'Thu', open: '05:00', close: '23:00' }, { day: 'Fri', open: '05:00', close: '23:00' }, { day: 'Sat', open: '06:00', close: '22:00' }, { day: 'Sun', open: '06:00', close: '20:00' }, ],
      rating: 4.9,
      reviews: [{ id: 'review-3', facilityId: 'facility-3', userId: 'user-1', userName: 'Aditya Sharma', rating: 5, comment: "The pool is extremely clean and the gym has all the latest equipment. Best in the city!", createdAt: new Date().toISOString(), isPublicProfile: true }],
      capacity: 100, isPopular: true, isIndoor: true,
      dataAiHint: 'swimming pool gym',
      availableEquipment: [],
      ownerId: 'user-2'
    },
    {
        id: 'facility-4',
        name: 'Pink City Sports Club',
        type: 'Complex',
        address: '56, Tonk Rd, Lalkothi, Jaipur, 302015',
        city: 'Jaipur',
        location: 'Lalkothi',
        description: 'A vibrant sports club in Jaipur offering a variety of facilities including cricket nets and yoga studios.',
        sports: [sports[5], sports[7]],
        sportPrices: [
            { sportId: 'sport-6', price: 1200, pricingModel: 'per_hour_flat' },
            { sportId: 'sport-8', price: 300, pricingModel: 'per_hour_per_person' },
        ],
        amenities: [amenities[0], amenities[1], amenities[3]],
        operatingHours: [ { day: 'Mon', open: '06:00', close: '21:00' }, { day: 'Tue', open: '06:00', close: '21:00' }, { day: 'Wed', open: '06:00', close: '21:00' }, { day: 'Thu', open: '06:00', close: '21:00' }, { day: 'Fri', open: '06:00', close: '21:00' }, { day: 'Sat', open: '07:00', close: '19:00' }, { day: 'Sun', open: '07:00', close: '19:00' }, ],
        rating: 4.5,
        reviews: [],
        capacity: 75,
        isPopular: false,
        isIndoor: false,
        dataAiHint: 'cricket yoga jaipur',
        availableEquipment: [],
        ownerId: 'user-2'
    },
    {
        id: 'facility-5',
        name: 'Sukhna Lake Sports Complex',
        type: 'Field',
        address: 'Sector 1, Chandigarh, 160001',
        city: 'Chandigarh',
        location: 'Sector 1',
        description: 'Open-air sports complex near Sukhna Lake, perfect for soccer and other field sports.',
        sports: [sports[0]],
        sportPrices: [
            { sportId: 'sport-1', price: 1000, pricingModel: 'per_hour_flat' },
        ],
        amenities: [amenities[0]],
        operatingHours: [ { day: 'Mon', open: '06:00', close: '19:00' }, { day: 'Tue', open: '06:00', close: '19:00' }, { day: 'Wed', open: '06:00', close: '19:00' }, { day: 'Thu', open: '06:00', close: '19:00' }, { day: 'Fri', open: '06:00', close: '19:00' }, { day: 'Sat', open: '06:00', close: '20:00' }, { day: 'Sun', open: '06:00', close: '20:00' }, ],
        rating: 4.3,
        reviews: [],
        capacity: 150,
        isPopular: true,
        isIndoor: false,
        dataAiHint: 'soccer field chandigarh',
        availableEquipment: [],
        ownerId: 'user-2'
    },
  ];
};
