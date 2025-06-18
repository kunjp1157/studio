import type { Facility, Sport, Amenity, UserProfile, Booking, ReportData, MembershipPlan, SportEvent } from './types';
import { Shirt, ParkingCircle, Wifi, ShowerHead, Lock, Dumbbell, Zap, Users, Trophy, Award, CalendarDays, Utensils, Star, LocateFixed, Clock, DollarSign, Goal, Bike, Dices, Sailboat, Swords, Palette, Music, Tent, Drama, MapPin } from 'lucide-react';

export const mockSports: Sport[] = [
  { id: 'sport-1', name: 'Soccer', icon: Goal },
  { id: 'sport-2', name: 'Basketball', icon: Dices /* Placeholder, Lucide lacks specific icon */ },
  { id: 'sport-3', name: 'Tennis', icon: Dices /* Placeholder */ },
  { id: 'sport-4', name: 'Badminton', icon: Dices /* Placeholder */ },
  { id: 'sport-5', name: 'Swimming', icon: Sailboat /* Placeholder for swimming */ },
  { id: 'sport-6', name: 'Gym Workout', icon: Dumbbell },
  { id: 'sport-7', name: 'Cycling', icon: Bike },
  { id: 'sport-8', name: 'Fencing', icon: Swords },
  { id: 'sport-9', name: 'Yoga', icon: Palette /* Placeholder for Yoga/Artistic activity */},
  { id: 'sport-10', name: 'Dance', icon: Music /* Placeholder for Dance */},
  { id: 'sport-11', name: 'Camping', icon: Tent },
  { id: 'sport-12', name: 'Theatre', icon: Drama },
];

export const mockAmenities: Amenity[] = [
  { id: 'amenity-1', name: 'Parking', icon: ParkingCircle },
  { id: 'amenity-2', name: 'WiFi', icon: Wifi },
  { id: 'amenity-3', name: 'Showers', icon: ShowerHead },
  { id: 'amenity-4', name: 'Lockers', icon: Lock },
  { id: 'amenity-5', name: 'Equipment Rental', icon: Zap },
  { id: 'amenity-6', name: 'Cafe', icon: Utensils },
  { id: 'amenity-7', name: 'Accessible', icon: Users },
];

export const mockFacilities: Facility[] = [
  {
    id: 'facility-1',
    name: 'Grand City Arena',
    type: 'Complex',
    address: '123 Stadium Rd, Metropolis, CA 90210',
    location: 'Metropolis',
    description: 'State-of-the-art multi-sport complex with indoor and outdoor facilities.',
    images: ['https://placehold.co/600x400.png', 'https://placehold.co/600x400.png'],
    sports: [mockSports[0], mockSports[1], mockSports[2]],
    amenities: [mockAmenities[0], mockAmenities[1], mockAmenities[2], mockAmenities[3], mockAmenities[5]],
    operatingHours: [{ day: 'Mon', open: '08:00', close: '22:00' }, { day: 'Tue', open: '08:00', close: '22:00' }, { day: 'Wed', open: '08:00', close: '22:00' }, { day: 'Thu', open: '08:00', close: '22:00' }, { day: 'Fri', open: '08:00', close: '23:00' }, { day: 'Sat', open: '09:00', close: '23:00' }, { day: 'Sun', open: '09:00', close: '20:00' }],
    pricePerHour: 50,
    rating: 4.8,
    isPopular: true,
    dataAiHint: 'sports stadium',
    capacity: 500,
  },
  {
    id: 'facility-2',
    name: 'Riverside Tennis Club',
    type: 'Court',
    address: '45 Green Ave, Metropolis, CA 90211',
    location: 'Metropolis',
    description: 'Premium tennis courts with beautiful riverside views.',
    images: ['https://placehold.co/600x400.png', 'https://placehold.co/600x400.png'],
    sports: [mockSports[2]],
    amenities: [mockAmenities[0], mockAmenities[2], mockAmenities[3]],
    operatingHours: [{ day: 'Mon', open: '07:00', close: '21:00' }, { day: 'Tue', open: '07:00', close: '21:00' }, { day: 'Wed', open: '07:00', close: '21:00' }, { day: 'Thu', open: '07:00', close: '21:00' }, { day: 'Fri', open: '07:00', close: '21:00' }, { day: 'Sat', open: '08:00', close: '18:00' }, { day: 'Sun', open: '08:00', close: '18:00' }],
    pricePerHour: 30,
    rating: 4.5,
    dataAiHint: 'tennis court',
  },
  {
    id: 'facility-3',
    name: 'Community Rec Center',
    type: 'Complex',
    address: '789 Park St, Metropolis, CA 90212',
    location: 'Metropolis',
    description: 'Affordable and friendly community center with various sports options.',
    images: ['https://placehold.co/600x400.png'],
    sports: [mockSports[1], mockSports[3], mockSports[5]],
    amenities: [mockAmenities[0], mockAmenities[1], mockAmenities[4], mockAmenities[6]],
    operatingHours: [{ day: 'Mon', open: '09:00', close: '21:00' }, { day: 'Tue', open: '09:00', close: '21:00' }, { day: 'Wed', open: '09:00', close: '21:00' }, { day: 'Thu', open: '09:00', close: '21:00' }, { day: 'Fri', open: '09:00', close: '20:00' }, { day: 'Sat', open: '10:00', close: '18:00' }, { day: 'Sun', open: '10:00', close: '16:00' }],
    pricePerHour: 20,
    rating: 4.2,
    isPopular: true,
    dataAiHint: 'community center',
  },
  {
    id: 'facility-4',
    name: 'Aqua World',
    type: 'Pool',
    address: '101 Splash Ave, Metropolis, CA 90213',
    location: 'Metropolis',
    description: 'Large Olympic-sized swimming pool with dedicated lanes and recreational areas.',
    images: ['https://placehold.co/600x400.png'],
    sports: [mockSports[4]],
    amenities: [mockAmenities[0], mockAmenities[2], mockAmenities[3]],
    operatingHours: [{ day: 'Mon', open: '06:00', close: '20:00' }, { day: 'Tue', open: '06:00', close: '20:00' }, { day: 'Wed', open: '06:00', close: '20:00' }, { day: 'Thu', open: '06:00', close: '20:00' }, { day: 'Fri', open: '06:00', close: '20:00' }, { day: 'Sat', open: '07:00', close: '19:00' }, { day: 'Sun', open: '07:00', close: '19:00' }],
    pricePerHour: 15,
    rating: 4.6,
    dataAiHint: 'swimming pool',
  },
];

export const mockUser: UserProfile = {
  id: 'user-123',
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  profilePictureUrl: 'https://placehold.co/100x100.png',
  preferredSports: [mockSports[0], mockSports[2]],
  favoriteFacilities: ['facility-1', 'facility-2'],
  membershipLevel: 'Premium',
};

export const mockBookings: Booking[] = [
  {
    id: 'booking-1',
    userId: 'user-123',
    facilityId: 'facility-1',
    facilityName: 'Grand City Arena',
    facilityImage: 'https://placehold.co/300x200.png',
    date: '2024-07-15',
    startTime: '18:00',
    endTime: '19:00',
    totalPrice: 50,
    status: 'Confirmed',
    bookedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
  },
  {
    id: 'booking-2',
    userId: 'user-123',
    facilityId: 'facility-2',
    facilityName: 'Riverside Tennis Club',
    facilityImage: 'https://placehold.co/300x200.png',
    date: '2024-07-20',
    startTime: '10:00',
    endTime: '12:00',
    totalPrice: 60,
    status: 'Confirmed',
    bookedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: 'booking-3',
    userId: 'user-123',
    facilityId: 'facility-3',
    facilityName: 'Community Rec Center',
    facilityImage: 'https://placehold.co/300x200.png',
    date: '2024-06-25',
    startTime: '14:00',
    endTime: '15:30',
    totalPrice: 30,
    status: 'Confirmed', // Past booking
    bookedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
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

export const mockMembershipPlans: MembershipPlan[] = [
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

export const mockEvents: SportEvent[] = [
  {
    id: 'event-1',
    name: 'Summer Soccer Tournament',
    facilityId: 'facility-1',
    sport: mockSports[0],
    startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // in 30 days
    endDate: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000).toISOString(), // in 32 days
    description: 'Annual summer soccer tournament for all skill levels.',
    maxParticipants: 64,
    registeredParticipants: 25,
  },
  {
    id: 'event-2',
    name: 'Tennis Open Day',
    facilityId: 'facility-2',
    sport: mockSports[2],
    startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // in 14 days
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // in 14 days
    description: 'Come try our tennis courts for free! Coaching available.',
    registeredParticipants: 0,
  },
];

// Helper function to get a facility by ID
export const getFacilityById = (id: string): Facility | undefined => {
  return mockFacilities.find(facility => facility.id === id);
};

// Helper function to get bookings for a user
export const getBookingsByUserId = (userId: string): Booking[] => {
  return mockBookings.filter(booking => booking.userId === userId);
};

