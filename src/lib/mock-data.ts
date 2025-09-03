

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
  { id: 'sport-9', name: 'Volleyball', iconName: 'Activity', imageUrl: '/sports/volleyball.jpg', imageDataAiHint: 'volleyball court beach' },
  { id: 'sport-10', name: 'Table Tennis', iconName: 'Dices', imageUrl: '/sports/table-tennis.jpg', imageDataAiHint: 'table tennis' },
  { id: 'sport-11', name: 'Squash', iconName: 'Drama', imageUrl: '/sports/squash.jpg', imageDataAiHint: 'squash court' },
  { id: 'sport-12', name: 'Boxing', iconName: 'Dumbbell', imageUrl: '/sports/boxing.jpg', imageDataAiHint: 'boxing ring' },
  { id: 'sport-13', name: 'Handball', iconName: 'Hand', imageUrl: '/sports/handball.jpg', imageDataAiHint: 'handball court' },
  { id: 'sport-14', name: 'Archery', iconName: 'Target', imageUrl: '/sports/archery.jpg', imageDataAiHint: 'archery range' },
  { id: 'sport-15', name: 'Fencing', iconName: 'Swords', imageUrl: '/sports/fencing.jpg', imageDataAiHint: 'fencing duel' },
  { id: 'sport-16', name: 'Martial Arts', iconName: 'PersonStanding', imageUrl: '/sports/martial-arts.jpg', imageDataAiHint: 'martial arts dojo' },
  { id: 'sport-17', name: 'Golf', iconName: 'Target', imageUrl: '/sports/golf.jpg', imageDataAiHint: 'golf course' },
  { id: 'sport-18', name: 'Hockey', iconName: 'Goal', imageUrl: '/sports/hockey.jpg', imageDataAiHint: 'hockey field' },
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
  // Master Venues
  {
    id: 'master-pune', name: 'Balewadi Stadium Complex', type: 'Complex', city: 'Pune', location: 'Balewadi',
    address: 'National Games Park, Mahalunge, Balewadi, Pune, 411045',
    description: 'The definitive sports complex in Pune, hosting national events and offering a vast array of facilities for almost every sport imaginable.',
    sports: sports.slice(0, 16),
    sportPrices: [
      { sportId: 'sport-1', price: 2000, pricingModel: 'per_hour_flat' },
      { sportId: 'sport-2', price: 1800, pricingModel: 'per_hour_flat' },
      { sportId: 'sport-3', price: 1200, pricingModel: 'per_hour_flat' },
      { sportId: 'sport-4', price: 900, pricingModel: 'per_hour_flat' },
      { sportId: 'sport-5', price: 500, pricingModel: 'per_hour_per_person' },
      { sportId: 'sport-6', price: 2500, pricingModel: 'per_hour_flat' },
      { sportId: 'sport-7', price: 1000, pricingModel: 'per_hour_per_person' },
      { sportId: 'sport-8', price: 600, pricingModel: 'per_hour_per_person' },
      { sportId: 'sport-9', price: 1000, pricingModel: 'per_hour_flat' },
      { sportId: 'sport-10', price: 400, pricingModel: 'per_hour_flat' },
      { sportId: 'sport-11', price: 700, pricingModel: 'per_hour_flat' },
      { sportId: 'sport-12', price: 800, pricingModel: 'per_hour_per_person' },
      { sportId: 'sport-13', price: 900, pricingModel: 'per_hour_flat' },
      { sportId: 'sport-14', price: 1000, pricingModel: 'per_hour_per_person' },
      { sportId: 'sport-15', price: 1100, pricingModel: 'per_hour_per_person' },
      { sportId: 'sport-16', price: 900, pricingModel: 'per_hour_per_person' },
    ],
    amenities: amenities,
    operatingHours: [ { day: 'Mon', open: '06:00', close: '22:00' }, { day: 'Tue', open: '06:00', close: '22:00' }, { day: 'Wed', open: '06:00', close: '22:00' }, { day: 'Thu', open: '06:00', close: '22:00' }, { day: 'Fri', open: '06:00', close: '23:00' }, { day: 'Sat', open: '06:00', close: '23:00' }, { day: 'Sun', open: '06:00', close: '22:00' }, ],
    rating: 4.9, reviews: [], capacity: 5000, isPopular: true, isIndoor: true, dataAiHint: 'stadium complex', ownerId: 'user-2'
  },
  {
    id: 'master-mumbai', name: 'Andheri Sports Complex', type: 'Complex', city: 'Mumbai', location: 'Andheri West',
    address: 'Veera Desai Road, Andheri West, Mumbai, 400053',
    description: 'A major multi-purpose sports facility in Mumbai, known for its large football stadium and versatile indoor arenas.',
    sports: sports.slice(0,18),
    sportPrices: sports.map(s => ({ sportId: s.id, price: 1500 + Math.random() * 1000, pricingModel: 'per_hour_flat' })),
    amenities: amenities,
    operatingHours: [ { day: 'Mon', open: '06:00', close: '22:00' }, { day: 'Tue', open: '06:00', close: '22:00' }, { day: 'Wed', open: '06:00', close: '22:00' }, { day: 'Thu', open: '06:00', close: '22:00' }, { day: 'Fri', open: '06:00', close: '23:00' }, { day: 'Sat', open: '06:00', close: '23:00' }, { day: 'Sun', open: '06:00', close: '22:00' }, ],
    rating: 4.7, reviews: [], capacity: 18000, isPopular: true, isIndoor: true, dataAiHint: 'large stadium Mumbai', ownerId: 'user-2'
  },
   {
    id: 'master-delhi', name: 'Jawaharlal Nehru Stadium', type: 'Complex', city: 'Delhi', location: 'Pragati Vihar',
    address: 'Pragati Vihar, New Delhi, Delhi 110003',
    description: 'Iconic stadium of Delhi, host to numerous international athletic events. Offers a wide array of training and playing facilities.',
    sports: sports.slice(0,18),
    sportPrices: sports.map(s => ({ sportId: s.id, price: 1400 + Math.random() * 1200, pricingModel: 'per_hour_flat' })),
    amenities: amenities,
    operatingHours: [ { day: 'Mon', open: '06:00', close: '22:00' }, { day: 'Tue', open: '06:00', close: '22:00' }, { day: 'Wed', open: '06:00', close: '22:00' }, { day: 'Thu', open: '06:00', close: '22:00' }, { day: 'Fri', open: '06:00', close: '23:00' }, { day: 'Sat', open: '06:00', close: '23:00' }, { day: 'Sun', open: '06:00', close: '22:00' }, ],
    rating: 4.8, reviews: [], capacity: 60000, isPopular: true, isIndoor: true, dataAiHint: 'delhi stadium complex', ownerId: 'user-2'
  },
  {
    id: 'master-bengaluru', name: 'Kanteerava Indoor Stadium', type: 'Complex', city: 'Bengaluru', location: 'Sampangi Rama Nagara',
    address: 'Kasturba Road, Sampangi Rama Nagara, Bengaluru, 560001',
    description: 'An indoor sporting arena located in the heart of Bengaluru, primarily used for basketball and volleyball.',
    sports: sports.slice(0,18),
    sportPrices: sports.map(s => ({ sportId: s.id, price: 1600 + Math.random() * 900, pricingModel: 'per_hour_flat' })),
    amenities: amenities,
    operatingHours: [ { day: 'Mon', open: '06:00', close: '22:00' }, { day: 'Tue', open: '06:00', close: '22:00' }, { day: 'Wed', open: '06:00', close: '22:00' }, { day: 'Thu', open: '06:00', close: '22:00' }, { day: 'Fri', open: '06:00', close: '23:00' }, { day: 'Sat', open: '06:00', close: '23:00' }, { day: 'Sun', open: '06:00', close: '22:00' }, ],
    rating: 4.6, reviews: [], capacity: 4000, isPopular: true, isIndoor: true, dataAiHint: 'bengaluru indoor stadium', ownerId: 'user-2'
  },

  // Pune Venues
  { id: 'facility-pune-1', name: 'Deccan Gymkhana', type: 'Court', city: 'Pune', location: 'Deccan Gymkhana', address: 'Deccan Gymkhana, Pune', description: 'Historic club with premium tennis courts.', sports: [sports[2]], sportPrices: [{ sportId: 'sport-3', price: 900, pricingModel: 'per_hour_flat' }], amenities: [amenities[0], amenities[2]], rating: 4.7, isIndoor: false, dataAiHint: 'tennis courts pune' },
  { id: 'facility-pune-2', name: 'HotFut Turf', type: 'Field', city: 'Pune', location: 'Koregaon Park', address: 'Koregaon Park, Pune', description: 'Rooftop soccer turf with a great view.', sports: [sports[0]], sportPrices: [{ sportId: 'sport-1', price: 1800, pricingModel: 'per_hour_flat' }], amenities: [amenities[4]], rating: 4.6, isIndoor: false, dataAiHint: 'rooftop soccer' },
  { id: 'facility-pune-3', name: 'Just Cricket Academy', type: 'Field', city: 'Pune', location: 'Hinjewadi', address: 'Hinjewadi, Pune', description: 'Professional cricket nets.', sports: [sports[5]], sportPrices: [{ sportId: 'sport-6', price: 1200, pricingModel: 'per_hour_flat' }], amenities: [amenities[0], amenities[4]], rating: 4.8, isIndoor: false, dataAiHint: 'cricket nets pune' },

  // Mumbai Venues
  { id: 'facility-mumbai-1', name: 'Dadar Club', type: 'Complex', city: 'Mumbai', location: 'Dadar', address: 'Dadar, Mumbai', description: 'Multi-sport club in central Mumbai.', sports: [sports[2], sports[3], sports[9]], sportPrices: [{ sportId: 'sport-3', price: 1100, pricingModel: 'per_hour_flat' },{ sportId: 'sport-4', price: 800, pricingModel: 'per_hour_flat' },{ sportId: 'sport-10', price: 500, pricingModel: 'per_hour_flat' }], amenities: [amenities[0], amenities[5]], rating: 4.5, isIndoor: true, dataAiHint: 'sports club mumbai' },
  { id: 'facility-mumbai-2', name: 'Juhu Soccer Stars', type: 'Field', city: 'Mumbai', location: 'Juhu', address: 'Juhu, Mumbai', description: 'Beachside soccer facility.', sports: [sports[0]], sportPrices: [{ sportId: 'sport-1', price: 2200, pricingModel: 'per_hour_flat' }], amenities: [amenities[2]], rating: 4.4, isIndoor: false, dataAiHint: 'beach soccer' },
  { id: 'facility-mumbai-3', name: 'Goregaon Sports Club', type: 'Complex', city: 'Mumbai', location: 'Goregaon', address: 'Goregaon, Mumbai', description: 'Family friendly sports club.', sports: [sports[4], sports[6]], sportPrices: [{ sportId: 'sport-5', price: 600, pricingModel: 'per_hour_per_person' },{ sportId: 'sport-7', price: 1000, pricingModel: 'per_hour_flat' }], amenities: [amenities[0], amenities[1], amenities[5]], rating: 4.6, isIndoor: true, dataAiHint: 'swimming pool gym' },
  
  // Delhi Venues
  { id: 'facility-delhi-1', name: 'Siri Fort Sports Complex', type: 'Complex', city: 'Delhi', location: 'Siri Fort', address: 'Siri Fort, Delhi', description: 'Government run massive sports complex.', sports: [sports[2], sports[4], sports[10]], sportPrices: [{ sportId: 'sport-3', price: 700, pricingModel: 'per_hour_flat' },{ sportId: 'sport-5', price: 400, pricingModel: 'per_hour_per_person' },{ sportId: 'sport-11', price: 600, pricingModel: 'per_hour_flat' }], amenities: [amenities[0], amenities[2]], rating: 4.7, isIndoor: true, dataAiHint: 'delhi sports complex' },
  { id: 'facility-delhi-2', name: 'Saket Sports Complex', type: 'Field', city: 'Delhi', location: 'Saket', address: 'Saket, Delhi', description: 'Popular for cricket and soccer.', sports: [sports[0], sports[5]], sportPrices: [{ sportId: 'sport-1', price: 1600, pricingModel: 'per_hour_flat' },{ sportId: 'sport-6', price: 1400, pricingModel: 'per_hour_flat' }], amenities: [amenities[0]], rating: 4.5, isIndoor: false, dataAiHint: 'cricket ground delhi' },
  { id: 'facility-delhi-3', name: 'Yamuna Sports Complex', type: 'Complex', city: 'Delhi', location: 'Surajmal Vihar', address: 'Surajmal Vihar, Delhi', description: 'Offers a wide range of indoor and outdoor sports.', sports: [sports[1], sports[8], sports[9]], sportPrices: [{ sportId: 'sport-2', price: 1200, pricingModel: 'per_hour_flat' },{ sportId: 'sport-9', price: 900, pricingModel: 'per_hour_per_person' },{ sportId: 'sport-10', price: 400, pricingModel: 'per_hour_flat' }], amenities: [amenities[0], amenities[2], amenities[3]], rating: 4.6, isIndoor: true, dataAiHint: 'delhi indoor sports' },
  
  // Bengaluru Venues
  { id: 'facility-bengaluru-1', name: 'Koramangala Club', type: 'Complex', city: 'Bengaluru', location: 'Koramangala', address: 'Koramangala, Bengaluru', description: 'A premium club with excellent facilities.', sports: [sports[2], sports[3], sports[4], sports[10]], sportPrices: [{ sportId: 'sport-3', price: 1300, pricingModel: 'per_hour_flat' }, { sportId: 'sport-4', price: 800, pricingModel: 'per_hour_flat' },{ sportId: 'sport-5', price: 600, pricingModel: 'per_hour_per_person' },{ sportId: 'sport-11', price: 800, pricingModel: 'per_hour_flat' }], amenities: [amenities[0], amenities[1], amenities[5]], rating: 4.8, isIndoor: true, dataAiHint: 'bengaluru sports club' },
  { id: 'facility-bengaluru-2', name: 'Tiento Sports', type: 'Field', city: 'Bengaluru', location: 'Bellandur', address: 'Bellandur, Bengaluru', description: 'Top-quality 5-a-side and 7-a-side soccer turfs.', sports: [sports[0]], sportPrices: [{ sportId: 'sport-1', price: 2000, pricingModel: 'per_hour_flat' }], amenities: [amenities[0], amenities[4]], rating: 4.7, isIndoor: false, dataAiHint: 'soccer turf bengaluru' },
  { id: 'facility-bengaluru-3', name: 'PLaY Arena', type: 'Complex', city: 'Bengaluru', location: 'Sarjapur', address: 'Sarjapur, Bengaluru', description: 'A massive adventure and sports park.', sports: [sports[0], sports[1], sports[8], sports[13]], sportPrices: [{ sportId: 'sport-1', price: 1800, pricingModel: 'per_hour_flat' }, { sportId: 'sport-2', price: 1500, pricingModel: 'per_hour_flat' }, { sportId: 'sport-9', price: 1200, pricingModel: 'per_hour_flat' }, { sportId: 'sport-14', price: 1000, pricingModel: 'per_hour_per_person' }], amenities: [amenities[0], amenities[4], amenities[5]], rating: 4.6, isIndoor: false, dataAiHint: 'adventure park bengaluru' },
  
  // Chennai Venues
  { id: 'facility-chennai-1', name: 'Marina Arena', type: 'Field', city: 'Chennai', location: 'Marina Beach', address: 'Marina Beach, Chennai', description: 'Beachside sports arena for soccer and volleyball.', sports: [sports[0], sports[8]], sportPrices: [{ sportId: 'sport-1', price: 1500, pricingModel: 'per_hour_flat' }, { sportId: 'sport-9', price: 1000, pricingModel: 'per_hour_flat' }], amenities: [amenities[2]], rating: 4.3, isIndoor: false, dataAiHint: 'beach soccer chennai' },
  { id: 'facility-chennai-2', name: 'Madras Cricket Club', type: 'Field', city: 'Chennai', location: 'Chepauk', address: 'Chepauk, Chennai', description: 'One of the oldest and most prestigious cricket grounds.', sports: [sports[5]], sportPrices: [{ sportId: 'sport-6', price: 3000, pricingModel: 'per_hour_flat' }], amenities: [amenities[0], amenities[2], amenities[5]], rating: 4.9, isIndoor: false, dataAiHint: 'cricket ground chennai' },
  { id: 'facility-chennai-3', name: 'Velachery Aquatic Complex', type: 'Pool', city: 'Chennai', location: 'Velachery', address: 'Velachery, Chennai', description: 'International standard swimming complex.', sports: [sports[4]], sportPrices: [{ sportId: 'sport-5', price: 300, pricingModel: 'per_hour_per_person' }], amenities: [amenities[2], amenities[3]], rating: 4.7, isIndoor: true, dataAiHint: 'swimming pool chennai' },
  
  // Hyderabad Venues
  { id: 'facility-hyd-1', name: 'Gachibowli Indoor Stadium', type: 'Complex', city: 'Hyderabad', location: 'Gachibowli', address: 'Gachibowli, Hyderabad', description: 'World-class indoor stadium for multiple sports.', sports: [sports[1], sports[3], sports[9], sports[10]], sportPrices: [{ sportId: 'sport-2', price: 1600, pricingModel: 'per_hour_flat' }, { sportId: 'sport-4', price: 1000, pricingModel: 'per_hour_flat' }, { sportId: 'sport-10', price: 500, pricingModel: 'per_hour_flat' }, { sportId: 'sport-11', price: 700, pricingModel: 'per_hour_flat' }], amenities: [amenities[0], amenities[1], amenities[2], amenities[3]], rating: 4.8, isIndoor: true, dataAiHint: 'indoor stadium hyderabad' },
  { id: 'facility-hyd-2', name: 'Astro Park', type: 'Field', city: 'Hyderabad', location: 'Jubilee Hills', address: 'Jubilee Hills, Hyderabad', description: 'High-quality artificial turf for soccer.', sports: [sports[0]], sportPrices: [{ sportId: 'sport-1', price: 2500, pricingModel: 'per_hour_flat' }], amenities: [amenities[0], amenities[4]], rating: 4.7, isIndoor: false, dataAiHint: 'soccer turf hyderabad' },
  { id: 'facility-hyd-3', name: 'L.B. Stadium', type: 'Complex', city: 'Hyderabad', location: 'Basheerbagh', address: 'Basheerbagh, Hyderabad', description: 'Historic stadium, primarily for cricket.', sports: [sports[5], sports[17]], sportPrices: [{ sportId: 'sport-6', price: 2200, pricingModel: 'per_hour_flat' }, { sportId: 'sport-18', price: 1200, pricingModel: 'per_hour_flat' }], amenities: [amenities[0]], rating: 4.5, isIndoor: false, dataAiHint: 'cricket stadium hyderabad' },
  
  // Kolkata Venues
  { id: 'facility-kol-1', name: 'Eden Gardens', type: 'Field', city: 'Kolkata', location: 'B. B. D. Bagh', address: 'B. B. D. Bagh, Kolkata', description: 'The most iconic cricket stadium in India.', sports: [sports[5]], sportPrices: [{ sportId: 'sport-6', price: 5000, pricingModel: 'per_hour_flat' }], amenities: [amenities[0], amenities[2], amenities[5]], rating: 5.0, isIndoor: false, dataAiHint: 'eden gardens cricket' },
  { id: 'facility-kol-2', name: 'Salt Lake Stadium', type: 'Field', city: 'Kolkata', location: 'Salt Lake', address: 'Salt Lake, Kolkata', description: 'A massive stadium, the heart of Indian football.', sports: [sports[0]], sportPrices: [{ sportId: 'sport-1', price: 3000, pricingModel: 'per_hour_flat' }], amenities: [amenities[0], amenities[2], amenities[3]], rating: 4.8, isIndoor: false, dataAiHint: 'salt lake stadium' },
  { id: 'facility-kol-3', name: 'Netaji Indoor Stadium', type: 'Court', city: 'Kolkata', location: 'Esplanade', address: 'Esplanade, Kolkata', description: 'Premier indoor venue for basketball and table tennis.', sports: [sports[1], sports[9]], sportPrices: [{ sportId: 'sport-2', price: 1500, pricingModel: 'per_hour_flat' }, { sportId: 'sport-10', price: 600, pricingModel: 'per_hour_flat' }], amenities: [amenities[0], amenities[1], amenities[2]], rating: 4.6, isIndoor: true, dataAiHint: 'indoor stadium kolkata' },
  
  // Ahmedabad Venues
  { id: 'facility-amd-1', name: 'Narendra Modi Stadium', type: 'Field', city: 'Ahmedabad', location: 'Motera', address: 'Motera, Ahmedabad', description: 'The largest cricket stadium in the world.', sports: [sports[5]], sportPrices: [{ sportId: 'sport-6', price: 6000, pricingModel: 'per_hour_flat' }], amenities: [amenities[0], amenities[1], amenities[2], amenities[3], amenities[5]], rating: 5.0, isIndoor: false, dataAiHint: 'narendra modi stadium' },
  { id: 'facility-amd-2', name: 'EKA Arena', type: 'Complex', city: 'Ahmedabad', location: 'Kankaria', address: 'Kankaria, Ahmedabad', description: 'Modern multi-sport complex.', sports: [sports[0], sports[1], sports[2], sports[3]], sportPrices: [{ sportId: 'sport-1', price: 1800, pricingModel: 'per_hour_flat' }, { sportId: 'sport-2', price: 1600, pricingModel: 'per_hour_flat' }, { sportId: 'sport-3', price: 1000, pricingModel: 'per_hour_flat' }, { sportId: 'sport-4', price: 700, pricingModel: 'per_hour_flat' }], amenities: [amenities[0], amenities[2], amenities[4]], rating: 4.7, isIndoor: true, dataAiHint: 'sports complex ahmedabad' },
  { id: 'facility-amd-3', name: 'Adani Shantigram', type: 'Field', city: 'Ahmedabad', location: 'S. G. Highway', address: 'S. G. Highway, Ahmedabad', description: 'Lush green golf course.', sports: [sports[16]], sportPrices: [{ sportId: 'sport-17', price: 2500, pricingModel: 'per_hour_flat' }], amenities: [amenities[0], amenities[5]], rating: 4.8, isIndoor: false, dataAiHint: 'golf course ahmedabad' },
  
  // Jaipur Venues
  { id: 'facility-jai-1', name: 'Sawai Mansingh Stadium', type: 'Field', city: 'Jaipur', location: 'Rambagh', address: 'Rambagh, Jaipur', description: 'Home of the Rajasthan Royals.', sports: [sports[5]], sportPrices: [{ sportId: 'sport-6', price: 2800, pricingModel: 'per_hour_flat' }], amenities: [amenities[0], amenities[2]], rating: 4.6, isIndoor: false, dataAiHint: 'cricket stadium jaipur' },
  { id: 'facility-jai-2', name: 'Jaipur Club', type: 'Complex', city: 'Jaipur', location: 'Civil Lines', address: 'Civil Lines, Jaipur', description: 'Prestigious club with tennis and squash courts.', sports: [sports[2], sports[10]], sportPrices: [{ sportId: 'sport-3', price: 900, pricingModel: 'per_hour_flat' }, { sportId: 'sport-11', price: 600, pricingModel: 'per_hour_flat' }], amenities: [amenities[0], amenities[5]], rating: 4.5, isIndoor: true, dataAiHint: 'tennis club jaipur' },
  { id: 'facility-jai-3', name: 'PlaySpace', type: 'Field', city: 'Jaipur', location: 'Vaishali Nagar', address: 'Vaishali Nagar, Jaipur', description: 'Modern turf for 5-a-side soccer.', sports: [sports[0]], sportPrices: [{ sportId: 'sport-1', price: 1500, pricingModel: 'per_hour_flat' }], amenities: [amenities[4]], rating: 4.4, isIndoor: false, dataAiHint: 'soccer turf jaipur' },
  
  // Chandigarh Venues
  { id: 'facility-chd-1', name: 'Chandigarh Club', type: 'Complex', city: 'Chandigarh', location: 'Sector 1', address: 'Sector 1, Chandigarh', description: 'Elite club with swimming and tennis facilities.', sports: [sports[2], sports[4]], sportPrices: [{ sportId: 'sport-3', price: 1100, pricingModel: 'per_hour_flat' }, { sportId: 'sport-5', price: 500, pricingModel: 'per_hour_per_person' }], amenities: [amenities[0], amenities[5]], rating: 4.7, isIndoor: true, dataAiHint: 'sports club chandigarh' },
  { id: 'facility-chd-2', name: 'Tau Devi Lal Stadium', type: 'Field', city: 'Chandigarh', location: 'Panchkula', address: 'Panchkula, Chandigarh', description: 'Multi-purpose stadium, great for athletics and soccer.', sports: [sports[0]], sportPrices: [{ sportId: 'sport-1', price: 1200, pricingModel: 'per_hour_flat' }], amenities: [amenities[0]], rating: 4.4, isIndoor: false, dataAiHint: 'stadium soccer chandigarh' },
  { id: 'facility-chd-3', name: 'Lake Sports Complex', type: 'Complex', city: 'Chandigarh', location: 'Sector 1', address: 'Sector 1, Chandigarh', description: 'Water sports and various other activities.', sports: [sports[7], sports[10]], sportPrices: [{ sportId: 'sport-8', price: 400, pricingModel: 'per_hour_per_person' }, { sportId: 'sport-11', price: 500, pricingModel: 'per_hour_flat' }], amenities: [amenities[0], amenities[2]], rating: 4.5, isIndoor: true, dataAiHint: 'lake sports complex' },
];
};
