

import type { Sport, Amenity, MembershipPlan, Facility, UserProfile, UserRole, UserStatus, FacilityOperatingHours, PricingModel } from './types';

// This file contains static mock data that is safe to be imported into client components.
// It has no server-side dependencies like the 'pg' database driver.

const sportsData: Sport[] = [
  { id: 'sport-1', name: 'Soccer', iconName: 'Goal', imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55', imageDataAiHint: 'soccer stadium' },
  { id: 'sport-2', name: 'Basketball', iconName: 'Dribbble', imageUrl: 'https://images.unsplash.com/photo-1519861531473-9200262188bf', imageDataAiHint: 'basketball court' },
  { id: 'sport-3', name: 'Tennis', iconName: 'Activity', imageUrl: 'https://images.unsplash.com/photo-1554062614-6da4fa674b73', imageDataAiHint: 'tennis court' },
  { id: 'sport-4', name: 'Badminton', iconName: 'Feather', imageUrl: 'https://images.unsplash.com/photo-1521587514789-53b8a3b09228', imageDataAiHint: 'badminton shuttlecock' },
  { id: 'sport-5', name: 'Swimming', iconName: 'PersonStanding', imageUrl: 'https://images.unsplash.com/photo-1551604313-26835b334a81', imageDataAiHint: 'swimming pool' },
  { id: 'sport-6', name: 'Yoga', iconName: 'Brain', imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b', imageDataAiHint: 'yoga class' },
  { id: 'sport-7', name: 'Cycling', iconName: 'Bike', imageUrl: 'https://images.unsplash.com/photo-1471506480216-e5719f9794d0', imageDataAiHint: 'cycling velodrome' },
  { id: 'sport-8', name: 'Dance', iconName: 'Music', imageUrl: 'https://images.unsplash.com/photo-1511719111394-550342a5b23d', imageDataAiHint: 'dance studio' },
  { id: 'sport-9', name: 'Camping', iconName: 'Tent', imageUrl: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d', imageDataAiHint: 'camping tent' },
  { id: 'sport-10', name: 'Theatre', iconName: 'Drama', imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91e38a493', imageDataAiHint: 'theatre stage' },
  { id: 'sport-13', name: 'Cricket', iconName: 'Dices', imageUrl: 'https://images.unsplash.com/photo-1593341646782-e0b495cffc25', imageDataAiHint: 'cricket stadium' },
  { id: 'sport-14', name: 'Pool', iconName: 'Target', imageUrl: 'https://images.unsplash.com/photo-1601758124235-7c98c199e4df', imageDataAiHint: 'billiards table' },
  { id: 'sport-15', name: 'PC Game/PS5', iconName: 'Gamepad2', imageUrl: 'https://images.unsplash.com/photo-1580327344181-c1163234e5a0', imageDataAiHint: 'gaming setup' },
  { id: 'sport-16', name: 'Gym', iconName: 'Dumbbell', imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48', imageDataAiHint: 'modern gym' },
];

export const mockSports: Sport[] = sportsData;

export function getMockSports(): Sport[] {
    return sportsData;
};


export const mockAmenities: Amenity[] = [
  { id: 'amenity-1', name: 'Parking', iconName: 'ParkingCircle' },
  { id: 'amenity-2', name: 'WiFi', iconName: 'Wifi' },
  { id: 'amenity-3', name: 'Showers', iconName: 'ShowerHead' },
  { id: 'amenity-4', name: 'Lockers', iconName: 'Lock' },
  { id: 'amenity-5', name: 'Equipment Rental Signage', iconName: 'PackageSearch' },
  { id: 'amenity-6', name: 'Cafe', iconName: 'Utensils' },
  { id: 'amenity-7', name: 'Accessible', iconName: 'Users' },
];


export const mockStaticMembershipPlans: MembershipPlan[] = [
  { id: 'mem_basic_1', name: 'Basic', pricePerMonth: 0, benefits: ['Access to all facilities', 'Standard booking rates', 'Community access'] },
  { id: 'mem_premium_2', name: 'Premium', pricePerMonth: 999, benefits: ['10% off all bookings', 'Priority booking slots', 'Free equipment rental (2 items/month)', 'Access to exclusive events'] },
  { id: 'mem_pro_3', name: 'Pro', pricePerMonth: 2499, benefits: ['25% off all bookings', 'Unlimited priority booking', 'Unlimited free equipment rental', 'Free entry to all events', 'Personalized coaching tips (AI-powered)'] },
];

export function getStaticUsers(): UserProfile[] {
    return [
      { 
        id: 'user-admin-kirtan', 
        name: 'Kirtan Shah', 
        email: 'kirtan.shah@example.com', 
        role: 'Admin' as UserRole, 
        status: 'Active' as UserStatus,
        joinedAt: '2023-01-15T10:00:00Z', 
        loyaltyPoints: 1250, 
        profilePictureUrl: 'https://randomuser.me/api/portraits/men/75.jpg', 
        dataAiHint: 'man smiling',
        isProfilePublic: true,
        achievements: [
            { id: 'achieve-1', name: 'First Booking', description: 'Made your first booking.', unlockedAt: '2023-01-20T10:00:00Z', iconName: 'Medal' },
            { id: 'achieve-2', name: 'Social Sharer', description: 'Shared an event on social media.', unlockedAt: '2023-02-10T10:00:00Z', iconName: 'Gift' },
            { id: 'achieve-3', name: 'Weekend Warrior', description: 'Booked on a Saturday and Sunday in the same week.', unlockedAt: '2023-03-05T10:00:00Z', iconName: 'Swords' },
            { id: 'achieve-4', name: 'Reviewer', description: 'Wrote your first review.', unlockedAt: '2023-03-15T10:00:00Z', iconName: 'MessageSquareText' },
        ],
        skillLevels: [
            { sportId: 'sport-1', sportName: 'Soccer', level: 'Intermediate' },
            { sportId: 'sport-3', sportName: 'Tennis', level: 'Beginner' },
        ],
        preferredSports: [
            getMockSports().find(s => s.id === 'sport-1')!,
            getMockSports().find(s => s.id === 'sport-3')!,
        ],
        teamIds: ['team-1'],
        membershipLevel: 'Premium',
      },
      { 
        id: 'user-owner-dana', 
        name: 'Dana White', 
        email: 'dana.white@example.com', 
        role: 'FacilityOwner' as UserRole, 
        status: 'Active' as UserStatus,
        joinedAt: '2023-02-20T11:30:00Z', 
        loyaltyPoints: 450, 
        profilePictureUrl: 'https://randomuser.me/api/portraits/women/68.jpg', 
        dataAiHint: 'woman portrait',
        isProfilePublic: true,
        achievements: [],
        skillLevels: [],
        teamIds: [],
        membershipLevel: 'Basic',
      },
      {
        id: 'user-regular-charlie',
        name: 'Charlie Davis',
        email: 'charlie.davis@example.com',
        role: 'User' as UserRole,
        status: 'Active' as UserStatus,
        joinedAt: '2023-03-10T09:00:00Z',
        loyaltyPoints: 800,
        profilePictureUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
        dataAiHint: 'man glasses',
        isProfilePublic: true,
         achievements: [
            { id: 'achieve-1', name: 'First Booking', description: 'Made your first booking.', unlockedAt: '2023-03-12T10:00:00Z', iconName: 'Medal' },
        ],
        skillLevels: [
            { sportId: 'sport-2', sportName: 'Basketball', level: 'Advanced' },
            { sportId: 'sport-13', name: 'Cricket', level: 'Intermediate' },
        ],
        preferredSports: [
            getMockSports().find(s => s.id === 'sport-2')!,
            getMockSports().find(s => s.id === 'sport-13')!,
        ],
        teamIds: ['team-1'],
        membershipLevel: 'Basic',
      }
    ];
}

const defaultOperatingHours: FacilityOperatingHours[] = [
  { day: 'Mon', open: '08:00', close: '22:00' }, { day: 'Tue', open: '08:00', close: '22:00' },
  { day: 'Wed', open: '08:00', close: '22:00' }, { day: 'Thu', open: '08:00', close: '22:00' },
  { day: 'Fri', open: '08:00', close: '23:00' }, { day: 'Sat', open: '09:00', close: '23:00' },
  { day: 'Sun', open: '09:00', close: '20:00' },
];

export function getStaticFacilities(): Facility[] {
    const allSports = getMockSports();
    return [
      {
        id: 'facility-1',
        name: 'Pune Sports Complex',
        type: 'Complex',
        address: '123 Stadium Way, Koregaon Park, Pune, 411001',
        city: 'Pune',
        location: 'Koregaon Park',
        description: 'A state-of-the-art multi-sport complex in the heart of the city. Perfect for professional training and casual play alike.',
        images: [
          'https://images.unsplash.com/photo-1579952363873-27f3bade9f55',
          'https://images.unsplash.com/photo-1627225793943-3442571a325a',
          'https://images.unsplash.com/photo-1543351368-361947a7d3cf'
        ],
        sports: [allSports.find(s => s.id === 'sport-1')!, allSports.find(s => s.id === 'sport-2')!],
        sportPrices: [
            { sportId: 'sport-1', price: 2500, pricingModel: 'per_hour_flat' },
            { sportId: 'sport-2', price: 2200, pricingModel: 'per_hour_flat' },
        ],
        amenities: [
          mockAmenities.find(a => a.id === 'amenity-1')!,
          mockAmenities.find(a => a.id === 'amenity-2')!,
          mockAmenities.find(a => a.id === 'amenity-3')!,
          mockAmenities.find(a => a.id === 'amenity-4')!,
          mockAmenities.find(a => a.id === 'amenity-6')!,
        ],
        operatingHours: defaultOperatingHours,
        rating: 4.8,
        isPopular: true,
        isIndoor: true,
        dataAiHint: 'soccer stadium',
        ownerId: 'user-owner-dana'
      },
      {
        id: 'facility-2',
        name: 'Deccan Gymkhana Tennis Club',
        type: 'Court',
        address: '456 Ace Avenue, Deccan, Pune, 411004',
        city: 'Pune',
        location: 'Deccan',
        description: 'Premier outdoor clay courts with a serene ambiance. Join our community of passionate tennis players.',
        images: [
          'https://images.unsplash.com/photo-1554062614-6da4fa674b73',
          'https://images.unsplash.com/photo-1596704179737-93b9576332a6'
        ],
        sports: [allSports.find(s => s.id === 'sport-3')!],
        sportPrices: [ { sportId: 'sport-3', price: 1800, pricingModel: 'per_hour_flat' } ],
        amenities: [
          mockAmenities.find(a => a.id === 'amenity-1')!,
          mockAmenities.find(a => a.id === 'amenity-3')!,
          mockAmenities.find(a => a.id === 'amenity-4')!,
        ],
        operatingHours: defaultOperatingHours,
        rating: 4.5,
        isPopular: false,
        isIndoor: false,
        dataAiHint: 'tennis court',
      },
      {
        id: 'facility-3',
        name: 'Kothrud Cricket Ground',
        type: 'Field',
        address: '789 Boundary Rd, Kothrud, Pune, 411038',
        city: 'Pune',
        location: 'Kothrud',
        description: 'A lush, expansive cricket field perfect for corporate matches and weekend games. Well-maintained pitch.',
        images: [
          'https://images.unsplash.com/photo-1593341646782-e0b495cffc25'
        ],
        sports: [allSports.find(s => s.id === 'sport-13')!],
        sportPrices: [ { sportId: 'sport-13', price: 3000, pricingModel: 'per_hour_flat' } ],
        amenities: [
          mockAmenities.find(a => a.id === 'amenity-1')!,
          mockAmenities.find(a => a.id === 'amenity-6')!,
        ],
        operatingHours: defaultOperatingHours,
        rating: 4.7,
        isPopular: true,
        isIndoor: false,
        dataAiHint: 'cricket stadium',
        ownerId: 'user-owner-dana'
      },
      {
        id: 'facility-4',
        name: 'The Aundh Swim & Gym Hub',
        type: 'Complex',
        address: '101 Fitness Lane, Aundh, Pune, 411007',
        city: 'Pune',
        location: 'Aundh',
        description: 'A complete fitness destination with an olympic-sized swimming pool and a fully-equipped modern gymnasium.',
        images: [
          'https://images.unsplash.com/photo-1551604313-26835b334a81',
          'https://images.unsplash.com/photo-1534438327276-14e5300c3a48'
        ],
        sports: [allSports.find(s => s.id === 'sport-5')!, allSports.find(s => s.id === 'sport-16')!],
        sportPrices: [
            { sportId: 'sport-5', price: 400, pricingModel: 'per_hour_per_person' },
            { sportId: 'sport-16', price: 500, pricingModel: 'per_hour_per_person' },
        ],
        amenities: [
          mockAmenities.find(a => a.id === 'amenity-1')!,
          mockAmenities.find(a => a.id === 'amenity-2')!,
          mockAmenities.find(a => a.id === 'amenity-3')!,
          mockAmenities.find(a => a.id === 'amenity-4')!,
          mockAmenities.find(a => a.id === 'amenity-6')!,
        ],
        operatingHours: defaultOperatingHours,
        rating: 4.9,
        isPopular: true,
        isIndoor: true,
        dataAiHint: 'swimming pool gym',
      },
      {
        id: 'facility-5',
        name: 'Shuttle Up Badminton Arena',
        type: 'Court',
        address: '246 Shuttlecock Street, Baner, Pune, 411045',
        city: 'Pune',
        location: 'Baner',
        description: 'Indoor badminton arena with professional-grade courts and excellent lighting.',
        images: ['https://images.unsplash.com/photo-1620241422329-195c6450a803'],
        sports: [allSports.find(s => s.id === 'sport-4')!],
        sportPrices: [{ sportId: 'sport-4', price: 1200, pricingModel: 'per_hour_flat' }],
        amenities: [mockAmenities.find(a => a.id === 'amenity-1')!, mockAmenities.find(a => a.id === 'amenity-3')!],
        operatingHours: defaultOperatingHours,
        rating: 4.6,
        isPopular: false,
        isIndoor: true,
        dataAiHint: 'badminton court',
      },
      {
        id: 'facility-6',
        name: 'Zenith Yoga & Dance Studio',
        type: 'Studio',
        address: '77 Harmony Plaza, Viman Nagar, Pune, 411014',
        city: 'Pune',
        location: 'Viman Nagar',
        description: 'A tranquil space for yoga, meditation, and various dance forms. Embrace your inner peace and rhythm.',
        images: ['https://images.unsplash.com/photo-1599447462464-a393d5a87b87'],
        sports: [allSports.find(s => s.id === 'sport-6')!, allSports.find(s => s.id === 'sport-8')!],
        sportPrices: [{ sportId: 'sport-6', price: 900, pricingModel: 'per_hour_per_person' }, { sportId: 'sport-8', price: 1100, pricingModel: 'per_hour_flat' }],
        amenities: [mockAmenities.find(a => a.id === 'amenity-4')!, mockAmenities.find(a => a.id === 'amenity-3')!, mockAmenities.find(a => a.id === 'amenity-2')!],
        operatingHours: defaultOperatingHours,
        rating: 4.9,
        isPopular: true,
        isIndoor: true,
        dataAiHint: 'yoga studio',
      },
      {
        id: 'facility-7',
        name: 'The Box Yard',
        type: 'Box Cricket',
        address: '88 Industrial Way, Hinjawadi, Pune, 411057',
        city: 'Pune',
        location: 'Hinjawadi',
        description: 'Fast-paced box cricket and futsal action. Perfect for a quick, high-energy game with friends.',
        images: ['https://images.unsplash.com/photo-1618293153926-6556b6c31d58'],
        sports: [allSports.find(s => s.id === 'sport-13')!, allSports.find(s => s.id === 'sport-1')!],
        sportPrices: [{ sportId: 'sport-13', price: 2000, pricingModel: 'per_hour_flat' }, { sportId: 'sport-1', price: 1800, pricingModel: 'per_hour_flat' }],
        amenities: [mockAmenities.find(a => a.id === 'amenity-1')!, mockAmenities.find(a => a.id === 'amenity-5')!],
        operatingHours: defaultOperatingHours,
        rating: 4.4,
        isPopular: true,
        isIndoor: false,
        dataAiHint: 'box cricket',
      },
      {
        id: 'facility-8',
        name: 'Nexus Gaming Lounge',
        type: 'Studio',
        address: '1 Tech Tower, Hinjawadi, Pune, 411057',
        city: 'Pune',
        location: 'Hinjawadi',
        description: 'High-end PC and console gaming lounge with the latest titles and fastest internet. Fuel your competitive spirit.',
        images: ['https://images.unsplash.com/photo-1550745165-9bc0b252726a'],
        sports: [allSports.find(s => s.id === 'sport-15')!],
        sportPrices: [{ sportId: 'sport-15', price: 400, pricingModel: 'per_hour_per_person' }],
        amenities: [mockAmenities.find(a => a.id === 'amenity-2')!, mockAmenities.find(a => a.id === 'amenity-6')!],
        operatingHours: defaultOperatingHours,
        rating: 4.8,
        isPopular: true,
        isIndoor: true,
        dataAiHint: 'gaming lounge',
      },
      {
        id: 'facility-9',
        name: 'Community Sports Hub',
        type: 'Complex',
        address: '55 Community Circle, Kothrud, Pune, 411038',
        city: 'Pune',
        location: 'Kothrud',
        description: 'A versatile community center offering a variety of sports for all ages, including cycling, pool, and more.',
        images: ['https://images.unsplash.com/photo-1517649763962-0c623066013b'],
        sports: [allSports.find(s => s.id === 'sport-7')!, allSports.find(s => s.id === 'sport-14')!, allSports.find(s => s.id === 'sport-10')!],
        sportPrices: [
            { sportId: 'sport-7', price: 500, pricingModel: 'per_hour_per_person' },
            { sportId: 'sport-14', price: 600, pricingModel: 'per_hour_flat' },
            { sportId: 'sport-10', price: 400, pricingModel: 'per_hour_flat' },
        ],
        amenities: [mockAmenities.find(a => a.id === 'amenity-1')!, mockAmenities.find(a => a.id === 'amenity-7')!],
        operatingHours: defaultOperatingHours,
        rating: 4.2,
        isPopular: false,
        isIndoor: false,
        dataAiHint: 'community center',
      },
      {
        id: 'facility-10',
        name: 'Pune Super Master Arena',
        type: 'Complex',
        address: '1 Master Sports Rd, Central Pune, Pune, 411001',
        city: 'Pune',
        location: 'Central Pune',
        description: 'The ultimate destination for every sport imaginable. Our super master arena offers world-class facilities for a wide range of activities, ensuring an unparalleled experience for all athletes.',
        images: [
            'https://placehold.co/800x450.png',
            'https://placehold.co/800x450.png'
        ],
        sports: allSports,
        sportPrices: allSports.map(sport => ({ sportId: sport.id, price: 1500, pricingModel: 'per_hour_flat' })),
        amenities: mockAmenities,
        operatingHours: defaultOperatingHours,
        rating: 5.0,
        isPopular: true,
        isIndoor: true,
        dataAiHint: 'sports complex stadium',
        ownerId: 'user-owner-dana'
      }
    ];
}
