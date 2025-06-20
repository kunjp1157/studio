
import type { Facility, Sport, Amenity, UserProfile, Booking, ReportData, MembershipPlan, SportEvent, Review, AppNotification, NotificationType, BlogPost, PricingRule, PromotionRule, RentalEquipment, RentedItemInfo, Achievement, FacilityOperatingHours, AppliedPromotionInfo } from './types';
import { ParkingCircle, Wifi, ShowerHead, Lock, Dumbbell, Zap, Users, Trophy, Award, CalendarDays as LucideCalendarDays, Utensils, Star, LocateFixed, Clock, DollarSign, Goal, Bike, Dices, Swords, Music, Tent, Drama, MapPin, Heart, Dribbble, Activity, Feather, CheckCircle, XCircle, MessageSquareText, Info, Gift, Edit3, PackageSearch, Shirt, Disc, Medal, Gem, Rocket, Gamepad2, MonitorPlay, Target, Drum, Guitar, Brain, Camera, PersonStanding, Building, HandCoins, Palette, Group } from 'lucide-react';
import { parseISO, isWithinInterval, isAfter, isBefore, startOfDay, endOfDay } from 'date-fns';


export const mockSports: Sport[] = [
  { id: 'sport-1', name: 'Soccer', icon: Goal, imageUrl: 'https://placehold.co/400x300.png', imageDataAiHint: 'soccer ball' },
  { id: 'sport-2', name: 'Basketball', icon: Dribbble, imageUrl: 'https://placehold.co/400x300.png', imageDataAiHint: 'basketball hoop' },
  { id: 'sport-3', name: 'Tennis', icon: Activity, imageUrl: 'https://placehold.co/400x300.png', imageDataAiHint: 'tennis racket' },
  { id: 'sport-4', name: 'Badminton', icon: Feather, imageUrl: 'https://placehold.co/400x300.png', imageDataAiHint: 'badminton shuttlecock' },
  { id: 'sport-5', name: 'Swimming', icon: PersonStanding, imageUrl: 'https://placehold.co/400x300.png', imageDataAiHint: 'swimming lane' },
  { id: 'sport-7', name: 'Cycling', icon: Bike, imageUrl: 'https://placehold.co/400x300.png', imageDataAiHint: 'cycling road' },
  { id: 'sport-13', name: 'Cricket', icon: Dices, imageUrl: 'https://placehold.co/400x300.png', imageDataAiHint: 'cricket bat ball' },
  { id: 'sport-14', name: 'Pool', icon: Target, imageUrl: 'https://placehold.co/400x300.png', imageDataAiHint: 'billiards table' },
  { id: 'sport-15', name: 'PC Game/PS5', icon: Gamepad2, imageUrl: 'https://placehold.co/400x300.png', imageDataAiHint: 'gaming setup' },
];

export const mockAmenities: Amenity[] = [
  { id: 'amenity-1', name: 'Parking', icon: ParkingCircle },
  { id: 'amenity-2', name: 'WiFi', icon: Wifi },
  { id: 'amenity-3', name: 'Showers', icon: ShowerHead },
  { id: 'amenity-4', name: 'Lockers', icon: Lock },
  { id: 'amenity-5', name: 'Equipment Rental Signage', icon: PackageSearch }, // Changed from Zap as Zap is used for Sports.
  { id: 'amenity-6', name: 'Cafe', icon: Utensils },
  { id: 'amenity-7', name: 'Accessible', icon: Users },
];

export const mockRentalEquipment: RentalEquipment[] = [
  { id: 'equip-1', facilityId: 'facility-1', name: 'Soccer Ball (Size 5)', pricePerItem: 5, priceType: 'per_booking', stock: 20, imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'soccer ball' },
  { id: 'equip-2', facilityId: 'facility-1', name: 'Training Cones (Set of 10)', pricePerItem: 3, priceType: 'per_booking', stock: 15, imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'training cones' },
  { id: 'equip-3', facilityId: 'facility-1', name: 'Basketball', pricePerItem: 5, priceType: 'per_booking', stock: 10, imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'basketball' },
  { id: 'equip-4', facilityId: 'facility-2', name: 'Tennis Racket (Adult)', pricePerItem: 8, priceType: 'per_booking', stock: 10, imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'tennis racket' },
  { id: 'equip-5', facilityId: 'facility-2', name: 'Tennis Balls (Can of 3)', pricePerItem: 4, priceType: 'per_booking', stock: 30, imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'tennis balls' },
  { id: 'equip-6', facilityId: 'facility-3', name: 'Badminton Racket', pricePerItem: 4, priceType: 'per_booking', stock: 12, imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'badminton racket' },
  { id: 'equip-7', facilityId: 'facility-3', name: 'Shuttlecocks (Tube of 6)', pricePerItem: 3, priceType: 'per_booking', stock: 25, imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'shuttlecock tube' },
  { id: 'equip-8', facilityId: 'facility-4', name: 'Swim Goggles', pricePerItem: 3, priceType: 'per_booking', stock: 15, imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'swim goggles' },
  { id: 'equip-9', facilityId: 'facility-4', name: 'Swim Cap', pricePerItem: 2, priceType: 'per_booking', stock: 20, imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'swim cap' },
];

export const calculateAverageRating = (reviews: Review[] | undefined): number => {
  if (!reviews || reviews.length === 0) {
    return 0;
  }
  const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
  return parseFloat((totalRating / reviews.length).toFixed(1));
};

export const getReviewsByFacilityId = (facilityId: string): Review[] => {
  return mockReviews.filter(review => review.facilityId === facilityId);
};

export let mockReviews: Review[] = [
  {
    id: 'review-1',
    facilityId: 'facility-1',
    userId: 'user-123',
    userName: 'Alex Johnson',
    userAvatar: 'https://placehold.co/40x40.png',
    rating: 5,
    comment: 'Amazing facility! Clean, well-maintained, and friendly staff. Will definitely book again.',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    bookingId: 'booking-1',
  },
  {
    id: 'review-2',
    facilityId: 'facility-1',
    userId: 'user-456',
    userName: 'Maria Garcia',
    userAvatar: 'https://placehold.co/40x40.png',
    rating: 4,
    comment: 'Great place for soccer. The fields are top-notch. Parking can be a bit tricky during peak hours.',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'review-3',
    facilityId: 'facility-2',
    userId: 'user-789',
    userName: 'David Smith',
    userAvatar: 'https://placehold.co/40x40.png',
    rating: 5,
    comment: 'Loved the tennis courts here. Beautiful view and excellent surface.',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'review-4',
    facilityId: 'facility-3',
    userId: 'user-123',
    userName: 'Alex Johnson',
    userAvatar: 'https://placehold.co/40x40.png',
    rating: 3,
    comment: 'Decent community center. Good value for money, but can get crowded. Equipment is a bit old.',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    bookingId: 'booking-3'
  },
];

export let mockFacilities: Facility[] = [
  {
    id: 'facility-1',
    name: 'Grand City Arena',
    type: 'Complex',
    address: '123 Stadium Rd, Metropolis, CA 90210',
    location: 'Metropolis',
    latitude: 34.0522, 
    longitude: -118.2437,
    description: 'State-of-the-art multi-sport complex with indoor and outdoor facilities.',
    images: ['https://placehold.co/800x450.png', 'https://placehold.co/400x250.png', 'https://placehold.co/400x250.png'],
    sports: [mockSports[0], mockSports[1], mockSports[2]], 
    amenities: [mockAmenities[0], mockAmenities[1], mockAmenities[2], mockAmenities[3], mockAmenities[5]],
    operatingHours: [{ day: 'Mon', open: '08:00', close: '22:00' }, { day: 'Tue', open: '08:00', close: '22:00' }, { day: 'Wed', open: '08:00', close: '22:00' }, { day: 'Thu', open: '08:00', close: '22:00' }, { day: 'Fri', open: '08:00', close: '23:00' }, { day: 'Sat', open: '09:00', close: '23:00' }, { day: 'Sun', open: '09:00', close: '20:00' }],
    pricePerHour: 50,
    pricingRulesApplied: [],
    rating: 0, 
    reviews: [], 
    capacity: 100,
    isPopular: true,
    isIndoor: true,
    dataAiHint: 'sports complex stadium',
    availableEquipment: mockRentalEquipment.filter(eq => ['equip-1', 'equip-2', 'equip-3'].includes(eq.id)),
  },
  {
    id: 'facility-2',
    name: 'Riverside Tennis Club',
    type: 'Court',
    address: '45 Green Ave, Metropolis, CA 90211',
    location: 'Metropolis',
    latitude: 34.0550,
    longitude: -118.2500,
    description: 'Premium tennis courts with beautiful riverside views.',
    images: ['https://placehold.co/800x450.png', 'https://placehold.co/400x250.png'],
    sports: [mockSports[2]], 
    amenities: [mockAmenities[0], mockAmenities[2], mockAmenities[3]],
    operatingHours: [{ day: 'Mon', open: '07:00', close: '21:00' }, { day: 'Tue', open: '07:00', close: '21:00' }, { day: 'Wed', open: '07:00', close: '21:00' }, { day: 'Thu', open: '07:00', close: '21:00' }, { day: 'Fri', open: '07:00', close: '21:00' }, { day: 'Sat', open: '08:00', close: '18:00' }, { day: 'Sun', open: '08:00', close: '18:00' }],
    pricePerHour: 30,
    pricingRulesApplied: [],
    rating: 0, 
    reviews: [], 
    capacity: 4,
    isIndoor: false,
    dataAiHint: 'tennis court outdoor',
    availableEquipment: mockRentalEquipment.filter(eq => ['equip-4', 'equip-5'].includes(eq.id)),
  },
  {
    id: 'facility-3',
    name: 'Community Rec Center',
    type: 'Complex',
    address: '789 Park St, Metropolis, CA 90212',
    location: 'Metropolis',
    latitude: 34.0600,
    longitude: -118.2300,
    description: 'Affordable and friendly community center with various sports options.',
    images: ['https://placehold.co/800x450.png'],
    sports: [mockSports[1], mockSports[3]], 
    amenities: [mockAmenities[0], mockAmenities[1], mockAmenities[6]], // Removed equipment rental signage if no specific equip for now
    operatingHours: [{ day: 'Mon', open: '09:00', close: '21:00' }, { day: 'Tue', open: '09:00', close: '21:00' }, { day: 'Wed', open: '09:00', close: '21:00' }, { day: 'Thu', open: '09:00', close: '21:00' }, { day: 'Fri', open: '09:00', close: '20:00' }, { day: 'Sat', open: '10:00', close: '18:00' }, { day: 'Sun', open: '10:00', close: '16:00' }],
    pricePerHour: 20,
    pricingRulesApplied: [],
    rating: 0, 
    reviews: [], 
    capacity: 50,
    isPopular: true,
    isIndoor: true,
    dataAiHint: 'community center indoor',
    availableEquipment: mockRentalEquipment.filter(eq => ['equip-6', 'equip-7'].includes(eq.id)),
  },
  {
    id: 'facility-4',
    name: 'Aqua World',
    type: 'Pool',
    address: '101 Splash Ave, Metropolis, CA 90213',
    location: 'Metropolis',
    latitude: 34.0400,
    longitude: -118.2600,
    description: 'Large Olympic-sized swimming pool with dedicated lanes and recreational areas.',
    images: ['https://placehold.co/800x450.png', 'https://placehold.co/400x250.png', 'https://placehold.co/400x250.png', 'https://placehold.co/400x250.png'],
    sports: [mockSports[4]], 
    amenities: [mockAmenities[0], mockAmenities[2], mockAmenities[3]],
    operatingHours: [{ day: 'Mon', open: '06:00', close: '20:00' }, { day: 'Tue', open: '06:00', close: '20:00' }, { day: 'Wed', open: '06:00', close: '20:00' }, { day: 'Thu', open: '06:00', close: '20:00' }, { day: 'Fri', open: '06:00', close: '20:00' }, { day: 'Sat', open: '07:00', close: '19:00' }, { day: 'Sun', open: '07:00', close: '19:00' }],
    pricePerHour: 15,
    pricingRulesApplied: [],
    rating: 0, 
    reviews: [], 
    capacity: 200,
    isIndoor: true,
    dataAiHint: 'swimming pool olympic',
    availableEquipment: mockRentalEquipment.filter(eq => ['equip-8', 'equip-9'].includes(eq.id)),
  },
];

// Calculate initial ratings
mockFacilities.forEach(facility => {
  const facilityReviews = getReviewsByFacilityId(facility.id); 
  facility.reviews = facilityReviews;
  facility.rating = calculateAverageRating(facilityReviews); 
});

export const mockAchievements: Achievement[] = [
  { id: 'ach-1', name: 'First Booking', description: 'Congratulations on making your first booking!', icon: Medal, unlockedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'ach-2', name: 'Review Pro', description: 'You shared your thoughts on 2 facilities!', icon: Star, unlockedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'ach-3', name: 'Weekend Warrior', description: 'Booked 3 times on a weekend.', icon: Trophy },
  { id: 'ach-4', name: 'Top Fan', description: 'Visited your favorite facility 5 times.', icon: Heart },
  { id: 'ach-5', name: 'Explorer', description: 'Booked 3 different types of sports.', icon: Rocket },
];

export const mockUser: UserProfile = {
  id: 'user-123',
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  profilePictureUrl: 'https://placehold.co/100x100.png',
  dataAiHint: "user avatar",
  preferredSports: [mockSports[0], mockSports[2]],
  favoriteFacilities: ['facility-1', 'facility-2'],
  membershipLevel: 'Premium',
  loyaltyPoints: 1250,
  achievements: [
    mockAchievements[0], // First Booking
    mockAchievements[1], // Review Pro
  ],
};

export let mockBookings: Booking[] = [
  {
    id: 'booking-1',
    userId: 'user-123',
    facilityId: 'facility-1',
    facilityName: 'Grand City Arena',
    facilityImage: 'https://placehold.co/300x200.png',
    dataAiHint: "arena floodlights",
    date: '2024-07-15', 
    startTime: '18:00',
    endTime: '19:00',
    durationHours: 1,
    numberOfGuests: 10,
    baseFacilityPrice: 50,
    equipmentRentalCost: 10, // e.g. 2 soccer balls
    totalPrice: 60, 
    status: 'Confirmed',
    bookedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), 
    reviewed: true,
    rentedEquipment: [
        { equipmentId: 'equip-1', name: 'Soccer Ball (Size 5)', quantity: 2, priceAtBooking: 5, priceTypeAtBooking: 'per_booking', totalCost: 10 },
    ]
  },
  {
    id: 'booking-2',
    userId: 'user-123',
    facilityId: 'facility-2',
    facilityName: 'Riverside Tennis Club',
    facilityImage: 'https://placehold.co/300x200.png',
    dataAiHint: "tennis court sunset",
    date: '2024-07-20', 
    startTime: '10:00',
    endTime: '12:00',
    durationHours: 2,
    numberOfGuests: 2,
    baseFacilityPrice: 60, // 30/hr * 2 hours
    equipmentRentalCost: 0,
    totalPrice: 60, 
    status: 'Confirmed',
    bookedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), 
    reviewed: false,
  },
  {
    id: 'booking-3',
    userId: 'user-123',
    facilityId: 'facility-3',
    facilityName: 'Community Rec Center',
    facilityImage: 'https://placehold.co/300x200.png',
    dataAiHint: "indoor basketball",
    date: '2024-06-25', 
    startTime: '14:00',
    endTime: '15:30',
    durationHours: 1.5,
    numberOfGuests: 5,
    baseFacilityPrice: 30, // 20/hr * 1.5 hours
    equipmentRentalCost: 0,
    totalPrice: 30, 
    status: 'Confirmed', 
    bookedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    reviewed: true,
  },
  {
    id: 'booking-4',
    userId: 'user-123',
    facilityId: 'facility-1',
    facilityName: 'Grand City Arena',
    facilityImage: 'https://placehold.co/300x200.png',
    dataAiHint: "soccer field night",
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Upcoming booking
    startTime: '20:00',
    endTime: '21:00',
    durationHours: 1,
    numberOfGuests: 22, 
    baseFacilityPrice: 50,
    equipmentRentalCost: 0,
    totalPrice: 50, 
    status: 'Confirmed',
    bookedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), 
    reviewed: false,
  },
  {
    id: 'booking-5',
    userId: 'user-456', 
    facilityId: 'facility-3',
    facilityName: 'Community Rec Center',
    facilityImage: 'https://placehold.co/300x200.png',
    dataAiHint: "basketball court aerial",
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
    startTime: '17:00',
    endTime: '18:00',
    durationHours: 1,
    numberOfGuests: 1,
    baseFacilityPrice: 20,
    totalPrice: 20,
    status: 'Confirmed',
    bookedAt: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000).toISOString(),
    reviewed: false,
  },
  {
    id: 'booking-6',
    userId: 'user-789', 
    facilityId: 'facility-4',
    facilityName: 'Aqua World',
    facilityImage: 'https://placehold.co/300x200.png',
    dataAiHint: "swimming pool indoor",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
    startTime: '09:00',
    endTime: '10:00',
    durationHours: 1,
    numberOfGuests: 1,
    baseFacilityPrice: 15,
    totalPrice: 15,
    status: 'Cancelled', 
    bookedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    reviewed: false,
  },
  {
    id: 'booking-7',
    userId: 'user-123',
    facilityId: 'facility-4',
    facilityName: 'Aqua World',
    facilityImage: 'https://placehold.co/300x200.png',
    dataAiHint: "pool diving board",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
    startTime: '15:00',
    endTime: '16:00',
    durationHours: 1,
    numberOfGuests: 3,
    baseFacilityPrice: 15,
    equipmentRentalCost: 6, 
    totalPrice: 21,
    status: 'Pending', 
    bookedAt: new Date(Date.now() - 0.1 * 24 * 60 * 60 * 1000).toISOString(),
    reviewed: false,
    rentedEquipment: [
        { equipmentId: 'equip-9', name: 'Swim Cap', quantity: 3, priceAtBooking: 2, priceTypeAtBooking: 'per_booking', totalCost: 6 },
    ]
  },
];

export const mockReportData: ReportData = {
  totalBookings: 1250,
  totalRevenue: 45800,
  facilityUsage: [
    { facilityName: 'Grand City Arena', bookings: 450 },
    { facilityName: 'Riverside Tennis Club', bookings: 300 },
    { facilityName: 'Community Rec Center', bookings: 500 },
  ],
  peakHours: [
    { hour: '18:00', bookings: 200 },
    { hour: '19:00', bookings: 180 },
    { hour: '17:00', bookings: 150 },
  ],
};

export let mockMembershipPlans: MembershipPlan[] = [
  {
    id: 'mem-1',
    name: 'Basic',
    pricePerMonth: 10,
    benefits: ['Access to all facilities', 'Book up to 3 days in advance', 'Online booking'],
  },
  {
    id: 'mem-2',
    name: 'Premium',
    pricePerMonth: 25,
    benefits: ['All Basic benefits', 'Book up to 7 days in advance', '10% discount on bookings', 'Guest passes (2/month)'],
  },
  {
    id: 'mem-3',
    name: 'Pro',
    pricePerMonth: 50,
    benefits: ['All Premium benefits', 'Book up to 14 days in advance', '20% discount on bookings', 'Free equipment rental', 'Priority support'],
  },
];

export let mockEvents: SportEvent[] = [
  {
    id: 'event-1',
    name: 'Summer Soccer Tournament',
    facilityId: 'facility-1',
    sport: mockSports[0], 
    startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), 
    endDate: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000).toISOString(), 
    description: 'Annual summer soccer tournament for all skill levels. Join us for a competitive and fun weekend! This event features multiple matches, food trucks, and activities for spectators. Great prizes for winning teams.',
    entryFee: 20,
    maxParticipants: 64,
    registeredParticipants: 25,
    imageUrl: 'https://placehold.co/600x300.png',
    imageDataAiHint: "soccer tournament action"
  },
  {
    id: 'event-2',
    name: 'Tennis Open Day & Clinic',
    facilityId: 'facility-2',
    sport: mockSports[2], 
    startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), 
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), 
    description: 'Come try our tennis courts for free! Coaching available for beginners. Fun for the whole family, with mini-games and refreshments.',
    entryFee: 0,
    maxParticipants: 100, // Max participants for open day
    registeredParticipants: 0, // Open registration, no hard cap for open day
    imageUrl: 'https://placehold.co/600x300.png',
    imageDataAiHint: "tennis players friendly"
  },
  {
    id: 'event-3',
    name: 'Community Basketball League Finals',
    facilityId: 'facility-3',
    sport: mockSports[1], 
    startDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), 
    endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), 
    description: 'The exciting conclusion to our community basketball league. Witness the crowning of the champions! Spectators welcome, entry is free.',
    entryFee: 5,
    maxParticipants: 200, // Spectator capacity
    registeredParticipants: 112, // Could represent team registrations or expected attendance
    imageUrl: 'https://placehold.co/600x300.png',
    imageDataAiHint: "basketball game intensity"
  },
   {
    id: 'event-4',
    name: 'Badminton Bonanza Weekend',
    facilityId: 'facility-3', // Can be hosted at community center too
    sport: mockSports[3], // Badminton
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), 
    endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(), 
    description: 'A full weekend of badminton fun! Singles and doubles tournaments for various age groups. All levels welcome. Coaching sessions available.',
    entryFee: 15,
    maxParticipants: 48,
    registeredParticipants: 15,
    imageUrl: 'https://placehold.co/600x300.png',
    imageDataAiHint: "badminton players action"
  },
];

export let mockPricingRules: PricingRule[] = [
    {
        id: 'price-rule-1',
        name: 'Weekend Evening Surge',
        description: 'Higher prices for popular weekend evening slots.',
        daysOfWeek: ['Sat', 'Sun'],
        timeRange: { start: '18:00', end: '22:00' },
        adjustmentType: 'percentage_increase',
        value: 20, // 20% increase
        priority: 10,
        isActive: true,
    },
    {
        id: 'price-rule-2',
        name: 'Weekday Morning Discount',
        description: 'Discount for less busy weekday morning hours.',
        daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        timeRange: { start: '08:00', end: '12:00' },
        adjustmentType: 'percentage_decrease',
        value: 15, // 15% decrease
        priority: 10,
        isActive: true,
    },
    {
        id: 'price-rule-3',
        name: 'Holiday Special Pricing',
        dateRange: { start: '2024-12-20', end: '2024-12-26' },
        adjustmentType: 'fixed_price',
        value: 75, // Fixed price of $75 during this period
        priority: 5, // Higher priority
        isActive: true,
    }
];

export let mockPromotionRules: PromotionRule[] = [
    {
        id: 'promo-1',
        name: 'Summer Kickoff Discount',
        description: 'Get 15% off any booking in June.',
        code: 'SUMMER15',
        discountType: 'percentage',
        discountValue: 15,
        startDate: '2024-06-01',
        endDate: '2024-06-30',
        usageLimit: 1000,
        usageLimitPerUser: 1,
        isActive: true,
    },
    {
        id: 'promo-2',
        name: 'New User Welcome',
        description: '$10 off your first booking.',
        code: 'WELCOME10',
        discountType: 'fixed_amount',
        discountValue: 10,
        usageLimitPerUser: 1,
        isActive: true,
    },
    {
        id: 'promo-3',
        name: 'Weekend Warrior Special',
        description: '20% off weekend bookings (Sat/Sun). No code needed.',
        discountType: 'percentage',
        discountValue: 20,
        isActive: true,
        // This would ideally be linked to daysOfWeek in a real system, but for mock data, it's descriptive.
    }
];


export const getAllEvents = (): SportEvent[] => {
  return [...mockEvents].sort((a,b) => parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime());
}

export const getEventById = (id: string): SportEvent | undefined => {
  const event = mockEvents.find(event => event.id === id);
  if (event) {
    const sport = getSportById(event.sport.id); // Ensure full sport object if only ID was stored
    return sport ? { ...event, sport } : { ...event }; // Return event, with full sport object if found
  }
  return undefined;
};

export const addEvent = (eventData: Omit<SportEvent, 'id' | 'sport' | 'registeredParticipants'> & { sportId: string }): SportEvent => {
  const sport = getSportById(eventData.sportId);
  if (!sport) throw new Error("Invalid sport ID provided for event.");
  
  const newEvent: SportEvent = {
    ...eventData,
    id: `event-${Date.now()}`,
    sport: sport, // Store the full sport object
    registeredParticipants: 0, // Initialize
  };
  mockEvents.push(newEvent);
  return newEvent;
};

export const updateEvent = (updatedEventData: Omit<SportEvent, 'sport'> & { sportId: string }): SportEvent | undefined => {
  const sport = getSportById(updatedEventData.sportId);
  if (!sport) throw new Error("Invalid sport ID provided for event update.");

  const eventIndex = mockEvents.findIndex(e => e.id === updatedEventData.id);
  if (eventIndex === -1) return undefined;

  const updatedEventWithFullSport: SportEvent = {
    ...updatedEventData,
    sport: sport,
  };

  mockEvents[eventIndex] = updatedEventWithFullSport;
  return mockEvents[eventIndex];
};

export const deleteEvent = (eventId: string): boolean => {
  const initialLength = mockEvents.length;
  mockEvents = mockEvents.filter(e => e.id !== eventId);
  return mockEvents.length < initialLength;
};

export const registerForEvent = (eventId: string): boolean => {
  const eventIndex = mockEvents.findIndex(e => e.id === eventId);
  if (eventIndex === -1) return false;

  if (mockEvents[eventIndex].maxParticipants && mockEvents[eventIndex].registeredParticipants >= mockEvents[eventIndex].maxParticipants!) {
    return false; // Event is full
  }
  
  mockEvents[eventIndex].registeredParticipants += 1;
  return true;
};


export const addReview = (reviewData: Omit<Review, 'id' | 'createdAt' | 'userName' | 'userAvatar'>): Review => {
  const newReview: Review = {
    ...reviewData,
    id: `review-${mockReviews.length + 1}`,
    userName: mockUser.name, 
    userAvatar: mockUser.profilePictureUrl,
    createdAt: new Date().toISOString(),
  };
  mockReviews.push(newReview);
  
  const facilityIndex = mockFacilities.findIndex(f => f.id === reviewData.facilityId);
  if (facilityIndex !== -1) {
    const facilityReviews = getReviewsByFacilityId(reviewData.facilityId);
    mockFacilities[facilityIndex].reviews = facilityReviews;
    mockFacilities[facilityIndex].rating = calculateAverageRating(facilityReviews);
  }
  
  const bookingIndex = mockBookings.findIndex(b => b.id === reviewData.bookingId);
  if (bookingIndex !== -1) {
    mockBookings[bookingIndex].reviewed = true;
  }
  
  return newReview;
};

export const getFacilityById = (id: string): Facility | undefined => {
  const facility = mockFacilities.find(f => f.id === id);
  if (facility) {
    const reviews = getReviewsByFacilityId(id);
    return {
      ...facility,
      reviews: reviews,
      rating: calculateAverageRating(reviews),
      sports: facility.sports.map(s => getSportById(s.id) || s), // Ensure full sport objects
      amenities: facility.amenities.map(a => getAmenityById(a.id) || a), // Ensure full amenity objects
    };
  }
  return undefined;
};

export const getBookingsByUserId = (userId: string): Booking[] => {
  return mockBookings.filter(booking => booking.userId === userId);
};

export const getAllBookings = (): Booking[] => {
  // In a real app, this would fetch from a database.
  // We sort them by bookedAt date, newest first.
  return [...mockBookings].sort((a,b) => new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime());
}

export const getUserById = (userId: string): UserProfile | { id: string, name: string, email: string } | undefined => {
  if (userId === mockUser.id) {
    return mockUser;
  }
  // In a real app, you would fetch other users from your database.
  // For this mock, return a placeholder or undefined for other IDs.
  const otherUserBooking = mockBookings.find(b => b.userId === userId);
  if (otherUserBooking) {
    // Create a very basic mock user profile if we find a booking by them
    return { id: userId, name: `User ${userId.substring(0,6)}`, email: `${userId.substring(0,6)}@example.com` };
  }
  return undefined;
}


export const getSportById = (id: string): Sport | undefined => {
  return mockSports.find(sport => sport.id === id);
}

export const getAmenityById = (id: string): Amenity | undefined => {
  return mockAmenities.find(amenity => amenity.id === id);
}


export const getAllSports = (): Sport[] => {
    return mockSports;
}

export const getAllFacilities = (): Facility[] => {
    return mockFacilities.map(f => ({
      ...f,
      rating: calculateAverageRating(getReviewsByFacilityId(f.id)),
      reviews: getReviewsByFacilityId(f.id)
    }));
}

export const addFacility = (facilityData: Omit<Facility, 'id' | 'sports' | 'amenities' | 'reviews' | 'rating' | 'operatingHours'> & { sports: string[], amenities?: string[], operatingHours?: FacilityOperatingHours[] }): Facility => {
  const newFacility: Facility = {
    ...facilityData,
    id: `facility-${Date.now()}`,
    sports: facilityData.sports.map(sportId => getSportById(sportId)).filter(Boolean) as Sport[],
    amenities: (facilityData.amenities || []).map(amenityId => getAmenityById(amenityId)).filter(Boolean) as Amenity[],
    reviews: [],
    rating: facilityData.rating ?? 0,
    operatingHours: facilityData.operatingHours || defaultOperatingHours,
    availableEquipment: facilityData.availableEquipment || [],
    pricingRulesApplied: facilityData.pricingRulesApplied || [],
  };
  mockFacilities.push(newFacility);
  return newFacility;
};

export const updateFacility = (updatedFacilityData: Omit<Facility, 'sports' | 'amenities' | 'reviews' | 'rating' | 'operatingHours'> & { sports: string[], amenities?: string[], operatingHours?: FacilityOperatingHours[] }): Facility | undefined => {
  const facilityIndex = mockFacilities.findIndex(f => f.id === updatedFacilityData.id);
  if (facilityIndex === -1) return undefined;

  const updatedFacility: Facility = {
    ...mockFacilities[facilityIndex], 
    ...updatedFacilityData,
    sports: updatedFacilityData.sports.map(sportId => getSportById(sportId)).filter(Boolean) as Sport[],
    amenities: (updatedFacilityData.amenities || []).map(amenityId => getAmenityById(amenityId)).filter(Boolean) as Amenity[],
    rating: updatedFacilityData.rating ?? mockFacilities[facilityIndex].rating,
    operatingHours: updatedFacilityData.operatingHours || mockFacilities[facilityIndex].operatingHours,
  };
  
  mockFacilities[facilityIndex] = updatedFacility;
  return updatedFacility;
};

export const deleteFacility = (facilityId: string): boolean => {
  const initialLength = mockFacilities.length;
  mockFacilities = mockFacilities.filter(f => f.id !== facilityId);
  mockReviews = mockReviews.filter(r => r.facilityId !== facilityId);
  return mockFacilities.length < initialLength;
};

const defaultOperatingHours: FacilityOperatingHours[] = [
  { day: 'Mon', open: '08:00', close: '22:00' }, { day: 'Tue', open: '08:00', close: '22:00' },
  { day: 'Wed', open: '08:00', close: '22:00' }, { day: 'Thu', open: '08:00', close: '22:00' },
  { day: 'Fri', open: '08:00', close: '23:00' }, { day: 'Sat', open: '09:00', close: '23:00' },
  { day: 'Sun', open: '09:00', close: '20:00' },
];


export const getRentalEquipmentById = (id: string): RentalEquipment | undefined => {
  return mockRentalEquipment.find(eq => eq.id === id);
}


// Notifications Data
let mockAppNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    userId: 'user-123',
    type: 'booking_confirmed',
    title: 'Booking Confirmed!',
    message: 'Your booking for Grand City Arena on July 15th is confirmed.',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    isRead: false,
    link: '/account/bookings',
    icon: CheckCircle,
  },
  {
    id: 'notif-2',
    userId: 'user-123',
    type: 'reminder',
    title: 'Upcoming Booking Reminder',
    message: 'Your tennis session at Riverside Tennis Club is tomorrow at 10:00 AM.',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    isRead: true,
    link: '/account/bookings',
    icon: LucideCalendarDays,
  },
  {
    id: 'notif-3',
    userId: 'user-123',
    type: 'promotion',
    title: 'Special Offer Just For You!',
    message: 'Get 20% off your next booking with code SUMMER20.',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    isRead: false,
    link: '/facilities',
    icon: Gift,
  },
];

export const getNotificationsForUser = (userId: string): AppNotification[] => {
  return mockAppNotifications
    .filter(n => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const markNotificationAsRead = (userId: string, notificationId: string): void => {
  const notification = mockAppNotifications.find(n => n.id === notificationId && n.userId === userId);
  if (notification) {
    notification.isRead = true;
  }
};

export const markAllNotificationsAsRead = (userId: string): void => {
  mockAppNotifications.forEach(n => {
    if (n.userId === userId) {
      n.isRead = true;
    }
  });
};

export const addNotification = (userId: string, notificationData: Omit<AppNotification, 'id' | 'userId' | 'createdAt' | 'isRead'>): AppNotification => {
  let icon = Info;
  switch (notificationData.type) {
    case 'booking_confirmed': icon = CheckCircle; break;
    case 'booking_cancelled': icon = XCircle; break;
    case 'review_submitted': icon = MessageSquareText; break;
    case 'reminder': icon = LucideCalendarDays; break;
    case 'promotion': icon = Gift; break;
  }

  const newNotification: AppNotification = {
    ...notificationData,
    id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    userId,
    createdAt: new Date().toISOString(),
    isRead: false,
    icon: notificationData.icon || icon,
  };
  mockAppNotifications.unshift(newNotification); // Add to the beginning to show newest first
  return newNotification;
};

// Blog Data
export const mockBlogPosts: BlogPost[] = [
  {
    id: 'blog-1',
    slug: 'top-5-badminton-courts-metropolis',
    title: 'Top 5 Badminton Courts in Metropolis You Need to Try',
    excerpt: 'Discover the best places to play badminton in Metropolis, from professional-grade courts to hidden gems perfect for a casual game.',
    content: '<p>Finding the perfect badminton court can elevate your game. Metropolis boasts a variety of options, but here are our top 5 picks:</p><ol><li><strong>Eagle Badminton Center:</strong> Known for its excellent lighting and well-maintained courts. A favorite among competitive players.</li><li><strong>Community Rec Center (Badminton Hall):</strong> Great value and very accessible. Offers multiple courts and is perfect for all skill levels.</li><li><strong>SkyHigh Sports Complex:</strong> Features dedicated badminton courts with good amenities, including equipment rental.</li><li><strong>Westside Badminton Club:</strong> A members-only club but offers guest passes. Known for its strong community and coaching programs.</li><li><strong>Metro Park Outdoor Courts:</strong> For those who enjoy playing outdoors, Metro Park offers several free-to-use courts, though availability can be a challenge.</li></ol><p>Remember to check booking availability and pricing before you go. Happy smashing!</p>',
    imageUrl: 'https://placehold.co/800x400.png',
    imageAlt: 'A badminton court with a net and shuttlecock',
    authorName: 'Jane Doe, Sports Enthusiast',
    authorAvatarUrl: 'https://placehold.co/50x50.png',
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['Badminton', 'Metropolis', 'Sports Venues'],
    isFeatured: true,
    dataAiHint: 'badminton court'
  },
  {
    id: 'blog-2',
    slug: 'choosing-right-soccer-cleats',
    title: 'Choosing the Right Soccer Cleats: A Beginner\'s Guide',
    excerpt: 'Your soccer cleats can make a huge difference in your performance and safety. Learn what to look for when buying your next pair.',
    content: '<p>Selecting the right soccer cleats is crucial for any player, regardless of skill level. Here are key factors to consider:</p><ul><li><strong>Playing Surface:</strong> Firm Ground (FG), Soft Ground (SG), Artificial Grass (AG), Turf (TF), and Indoor (IC) cleats are designed for specific surfaces. Using the wrong type can lead to injury or poor performance.</li><li><strong>Material:</strong> Leather (kangaroo, calfskin) offers a soft touch and molds to your foot, while synthetic materials are often lighter, more durable, and water-resistant.</li><li><strong>Fit:</strong> Cleats should fit snugly without being too tight. There should be minimal space between your toes and the end of the shoe.</li><li><strong>Stud Pattern:</strong> Different stud configurations offer varying levels of traction and stability. Conical studs are good for rotation, while bladed studs offer aggressive traction.</li><li><strong>Your Position:</strong> While not a strict rule, some cleats are marketed towards specific positions (e.g., lighter cleats for wingers, more protective for defenders).</li></ul><p>Try on several pairs and consider your playing style and budget. Investing in good cleats is investing in your game!</p>',
    imageUrl: 'https://placehold.co/800x400.png',
    imageAlt: 'A pair of soccer cleats on a grass field',
    authorName: 'Mike Lee, Soccer Coach',
    authorAvatarUrl: 'https://placehold.co/50x50.png',
    publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['Soccer', 'Equipment', 'Tips'],
    dataAiHint: 'soccer cleats'
  },
  {
    id: 'blog-3',
    slug: 'benefits-of-swimming',
    title: 'Dive In: The Amazing Health Benefits of Regular Swimming',
    excerpt: 'Swimming is more than just a recreational activity; it\'s a full-body workout with numerous health benefits for all ages.',
    content: '<p>Looking for a low-impact exercise that delivers high results? Swimming might be your answer. Here’s why:</p><ul><li><strong>Full-Body Workout:</strong> Swimming engages almost all major muscle groups, from your arms and shoulders to your core and legs.</li><li><strong>Low Impact:</strong> The buoyancy of water supports your body, making swimming gentle on your joints. This is great for people with arthritis or injuries.</li><li><strong>Cardiovascular Health:</strong> It’s an excellent aerobic exercise that strengthens your heart and improves lung capacity.</li><li><strong>Weight Management:</strong> Swimming burns a significant amount of calories, aiding in weight loss or maintenance.</li><li><strong>Stress Reduction:</strong> The rhythmic nature of swimming and the sensation of water can be very calming and meditative.</li><li><strong>Improved Flexibility & Balance:</strong> The range of motion involved in different strokes helps improve flexibility.</li></ul><p>Whether you prefer laps in a pool or open water swimming, incorporating it into your routine can lead to significant health improvements.</p>',
    imageUrl: 'https://placehold.co/800x400.png',
    imageAlt: 'A person swimming in a clear blue pool',
    authorName: 'Dr. Aqua Fina',
    authorAvatarUrl: 'https://placehold.co/50x50.png',
    publishedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['Swimming', 'Health', 'Fitness', 'Wellness'],
    dataAiHint: 'swimming pool'
  },
];

export const getAllBlogPosts = (): BlogPost[] => {
  return mockBlogPosts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
};

export const getBlogPostBySlug = (slug: string): BlogPost | undefined => {
  return mockBlogPosts.find(post => post.slug === slug);
};

// Membership Plan Data Management
export const getAllMembershipPlans = (): MembershipPlan[] => {
  return [...mockMembershipPlans];
};

export const getMembershipPlanById = (id: string): MembershipPlan | undefined => {
  return mockMembershipPlans.find(plan => plan.id === id);
};

export const addMembershipPlan = (planData: Omit<MembershipPlan, 'id'>): MembershipPlan => {
  const newPlan: MembershipPlan = {
    ...planData,
    id: `mem-${Date.now()}`,
  };
  mockMembershipPlans.push(newPlan);
  return newPlan;
};

export const updateMembershipPlan = (updatedPlanData: MembershipPlan): MembershipPlan | undefined => {
  const planIndex = mockMembershipPlans.findIndex(p => p.id === updatedPlanData.id);
  if (planIndex === -1) return undefined;
  mockMembershipPlans[planIndex] = updatedPlanData;
  return mockMembershipPlans[planIndex];
};

export const deleteMembershipPlan = (planId: string): boolean => {
  const initialLength = mockMembershipPlans.length;
  mockMembershipPlans = mockMembershipPlans.filter(p => p.id !== planId);
  return mockMembershipPlans.length < initialLength;
};


export const mockAdminUsers: UserProfile[] = [
    { ...mockUser, id: 'admin-001', name: 'Admin User', email: 'admin@citysportshub.com'},
];

// Pricing Rule Data Management
export const getAllPricingRules = (): PricingRule[] => {
    return [...mockPricingRules];
};

export const getPricingRuleById = (id: string): PricingRule | undefined => {
    return mockPricingRules.find(rule => rule.id === id);
};

export const addPricingRule = (ruleData: Omit<PricingRule, 'id'>): PricingRule => {
    const newRule: PricingRule = {
        ...ruleData,
        id: `pr-${Date.now()}-${Math.random().toString(36).substring(2,7)}`,
    };
    mockPricingRules.push(newRule);
    return newRule;
};

export const updatePricingRule = (updatedRuleData: PricingRule): PricingRule | undefined => {
    const ruleIndex = mockPricingRules.findIndex(r => r.id === updatedRuleData.id);
    if (ruleIndex === -1) return undefined;
    mockPricingRules[ruleIndex] = updatedRuleData;
    return mockPricingRules[ruleIndex];
};

export const deletePricingRule = (ruleId: string): boolean => {
    const initialLength = mockPricingRules.length;
    mockPricingRules = mockPricingRules.filter(r => r.id !== ruleId);
    return mockPricingRules.length < initialLength;
};

// Promotion Rule Data Management
export const getAllPromotionRules = (): PromotionRule[] => {
    return [...mockPromotionRules].sort((a, b) => a.name.localeCompare(b.name));
};

export const getPromotionRuleById = (id: string): PromotionRule | undefined => {
    const rule = mockPromotionRules.find(r => r.code?.toLowerCase() === id.toLowerCase() || r.id === id);
    if (rule && rule.isActive) {
        const now = new Date();
        const startDateValid = rule.startDate ? isAfter(now, startOfDay(parseISO(rule.startDate))) || isWithinInterval(now, {start: startOfDay(parseISO(rule.startDate)), end: endOfDay(parseISO(rule.startDate))}) : true;
        const endDateValid = rule.endDate ? isBefore(now, endOfDay(parseISO(rule.endDate))) || isWithinInterval(now, {start: startOfDay(parseISO(rule.endDate)), end: endOfDay(parseISO(rule.endDate))}) : true;
        if (startDateValid && endDateValid) {
            return rule;
        }
    }
    return undefined;
};

export const addPromotionRule = (ruleData: Omit<PromotionRule, 'id'>): PromotionRule => {
    const newRule: PromotionRule = {
        ...ruleData,
        id: `promo-${Date.now()}-${Math.random().toString(36).substring(2,7)}`,
    };
    mockPromotionRules.push(newRule);
    return newRule;
};

export const updatePromotionRule = (updatedRuleData: PromotionRule): PromotionRule | undefined => {
    const ruleIndex = mockPromotionRules.findIndex(r => r.id === updatedRuleData.id);
    if (ruleIndex === -1) return undefined;
    mockPromotionRules[ruleIndex] = updatedRuleData;
    return mockPromotionRules[ruleIndex];
};

export const deletePromotionRule = (ruleId: string): boolean => {
    const initialLength = mockPromotionRules.length;
    mockPromotionRules = mockPromotionRules.filter(r => r.id !== ruleId);
    return mockPromotionRules.length < initialLength;
};


