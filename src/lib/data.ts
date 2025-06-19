
import type { Facility, Sport, Amenity, UserProfile, Booking, ReportData, MembershipPlan, SportEvent, Review } from './types';
import { Shirt, ParkingCircle, Wifi, ShowerHead, Lock, Dumbbell, Zap, Users, Trophy, Award, CalendarDays, Utensils, Star, LocateFixed, Clock, DollarSign, Goal, Bike, Dices, Swords, Music, Tent, Drama, MapPin, Heart, Dribbble, Waves, Activity, Feather } from 'lucide-react';

export const mockSports: Sport[] = [
  { id: 'sport-1', name: 'Soccer', icon: Goal, imageUrl: 'https://placehold.co/100x100.png?text=Soccer', imageDataAiHint: 'soccer ball' },
  { id: 'sport-2', name: 'Basketball', icon: Dribbble, imageUrl: 'https://placehold.co/100x100.png?text=Basketball', imageDataAiHint: 'basketball hoop' },
  { id: 'sport-3', name: 'Tennis', icon: Activity, imageUrl: 'https://placehold.co/100x100.png?text=Tennis', imageDataAiHint: 'tennis racket' },
  { id: 'sport-4', name: 'Badminton', icon: Activity, imageUrl: 'https://placehold.co/100x100.png?text=Badminton', imageDataAiHint: 'badminton shuttlecock' },
  { id: 'sport-5', name: 'Swimming', icon: Waves, imageUrl: 'https://placehold.co/100x100.png?text=Swimming', imageDataAiHint: 'swimming lane' },
  { id: 'sport-6', name: 'Gym Workout', icon: Dumbbell, imageUrl: 'https://placehold.co/100x100.png?text=Gym', imageDataAiHint: 'gym weights' },
  { id: 'sport-7', name: 'Cycling', icon: Bike, imageUrl: 'https://placehold.co/100x100.png?text=Cycling', imageDataAiHint: 'cycling road' },
  { id: 'sport-8', name: 'Fencing', icon: Swords, imageUrl: 'https://placehold.co/100x100.png?text=Fencing', imageDataAiHint: 'fencing mask' },
  { id: 'sport-9', name: 'Yoga', icon: Feather, imageUrl: 'https://placehold.co/100x100.png?text=Yoga', imageDataAiHint: 'yoga mat'},
  { id: 'sport-10', name: 'Dance', icon: Music, imageUrl: 'https://placehold.co/100x100.png?text=Dance', imageDataAiHint: 'dance studio'},
  { id: 'sport-11', name: 'Camping', icon: Tent, imageUrl: 'https://placehold.co/100x100.png?text=Camping', imageDataAiHint: 'camping tent' },
  { id: 'sport-12', name: 'Theatre', icon: Drama, imageUrl: 'https://placehold.co/100x100.png?text=Theatre', imageDataAiHint: 'theatre stage' },
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

export let mockReviews: Review[] = [
  {
    id: 'review-1',
    facilityId: 'facility-1',
    userId: 'user-123',
    userName: 'Alex Johnson',
    userAvatar: 'https://placehold.co/40x40.png?text=AJ',
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
    userAvatar: 'https://placehold.co/40x40.png?text=MG',
    rating: 4,
    comment: 'Great place for soccer. The fields are top-notch. Parking can be a bit tricky during peak hours.',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'review-3',
    facilityId: 'facility-2',
    userId: 'user-789',
    userName: 'David Smith',
    userAvatar: 'https://placehold.co/40x40.png?text=DS',
    rating: 5,
    comment: 'Loved the tennis courts here. Beautiful view and excellent surface.',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'review-4',
    facilityId: 'facility-3',
    userId: 'user-123',
    userName: 'Alex Johnson',
    userAvatar: 'https://placehold.co/40x40.png?text=AJ',
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
    description: 'State-of-the-art multi-sport complex with indoor and outdoor facilities.',
    images: ['https://placehold.co/800x450.png', 'https://placehold.co/400x250.png', 'https://placehold.co/400x250.png'],
    sports: [mockSports[0], mockSports[1], mockSports[2]], // Soccer, Basketball, Tennis
    amenities: [mockAmenities[0], mockAmenities[1], mockAmenities[2], mockAmenities[3], mockAmenities[5]],
    operatingHours: [{ day: 'Mon', open: '08:00', close: '22:00' }, { day: 'Tue', open: '08:00', close: '22:00' }, { day: 'Wed', open: '08:00', close: '22:00' }, { day: 'Thu', open: '08:00', close: '22:00' }, { day: 'Fri', open: '08:00', close: '23:00' }, { day: 'Sat', open: '09:00', close: '23:00' }, { day: 'Sun', open: '09:00', close: '20:00' }],
    pricePerHour: 50,
    rating: 0, // Will be calculated
    reviews: [], // Will be populated by getFacilityById
    isPopular: true,
    dataAiHint: 'sports complex stadium',
    capacity: 500,
  },
  {
    id: 'facility-2',
    name: 'Riverside Tennis Club',
    type: 'Court',
    address: '45 Green Ave, Metropolis, CA 90211',
    location: 'Metropolis',
    description: 'Premium tennis courts with beautiful riverside views.',
    images: ['https://placehold.co/800x450.png', 'https://placehold.co/400x250.png'],
    sports: [mockSports[2]], // Tennis
    amenities: [mockAmenities[0], mockAmenities[2], mockAmenities[3]],
    operatingHours: [{ day: 'Mon', open: '07:00', close: '21:00' }, { day: 'Tue', open: '07:00', close: '21:00' }, { day: 'Wed', open: '07:00', close: '21:00' }, { day: 'Thu', open: '07:00', close: '21:00' }, { day: 'Fri', open: '07:00', close: '21:00' }, { day: 'Sat', open: '08:00', close: '18:00' }, { day: 'Sun', open: '08:00', close: '18:00' }],
    pricePerHour: 30,
    rating: 0, // Will be calculated
    reviews: [], // Will be populated by getFacilityById
    dataAiHint: 'tennis court outdoor',
  },
  {
    id: 'facility-3',
    name: 'Community Rec Center',
    type: 'Complex',
    address: '789 Park St, Metropolis, CA 90212',
    location: 'Metropolis',
    description: 'Affordable and friendly community center with various sports options.',
    images: ['https://placehold.co/800x450.png'],
    sports: [mockSports[1], mockSports[3], mockSports[5]], // Basketball, Badminton, Gym
    amenities: [mockAmenities[0], mockAmenities[1], mockAmenities[4], mockAmenities[6]],
    operatingHours: [{ day: 'Mon', open: '09:00', close: '21:00' }, { day: 'Tue', open: '09:00', close: '21:00' }, { day: 'Wed', open: '09:00', close: '21:00' }, { day: 'Thu', open: '09:00', close: '21:00' }, { day: 'Fri', open: '09:00', close: '20:00' }, { day: 'Sat', open: '10:00', close: '18:00' }, { day: 'Sun', open: '10:00', close: '16:00' }],
    pricePerHour: 20,
    rating: 0, // Will be calculated
    reviews: [], // Will be populated by getFacilityById
    isPopular: true,
    dataAiHint: 'community center indoor',
  },
  {
    id: 'facility-4',
    name: 'Aqua World',
    type: 'Pool',
    address: '101 Splash Ave, Metropolis, CA 90213',
    location: 'Metropolis',
    description: 'Large Olympic-sized swimming pool with dedicated lanes and recreational areas.',
    images: ['https://placehold.co/800x450.png', 'https://placehold.co/400x250.png', 'https://placehold.co/400x250.png', 'https://placehold.co/400x250.png'],
    sports: [mockSports[4]], // Swimming
    amenities: [mockAmenities[0], mockAmenities[2], mockAmenities[3]],
    operatingHours: [{ day: 'Mon', open: '06:00', close: '20:00' }, { day: 'Tue', open: '06:00', close: '20:00' }, { day: 'Wed', open: '06:00', close: '20:00' }, { day: 'Thu', open: '06:00', close: '20:00' }, { day: 'Fri', open: '06:00', close: '20:00' }, { day: 'Sat', open: '07:00', close: '19:00' }, { day: 'Sun', open: '07:00', close: '19:00' }],
    pricePerHour: 15,
    rating: 0, // Will be calculated
    reviews: [], // Will be populated by getFacilityById
    dataAiHint: 'swimming pool olympic',
  },
];

export const mockUser: UserProfile = {
  id: 'user-123',
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  profilePictureUrl: 'https://placehold.co/100x100.png?text=AJ',
  dataAiHint: "user avatar",
  preferredSports: [mockSports[0], mockSports[2]],
  favoriteFacilities: ['facility-1', 'facility-2'],
  membershipLevel: 'Premium',
};

export let mockBookings: Booking[] = [
  {
    id: 'booking-1',
    userId: 'user-123',
    facilityId: 'facility-1',
    facilityName: 'Grand City Arena',
    facilityImage: 'https://placehold.co/300x200.png?text=Grand+Arena',
    dataAiHint: "arena floodlights",
    date: '2024-07-15', 
    startTime: '18:00',
    endTime: '19:00',
    totalPrice: 50,
    status: 'Confirmed',
    bookedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), 
    reviewed: true,
  },
  {
    id: 'booking-2',
    userId: 'user-123',
    facilityId: 'facility-2',
    facilityName: 'Riverside Tennis Club',
    facilityImage: 'https://placehold.co/300x200.png?text=Tennis+Club',
    dataAiHint: "tennis court sunset",
    date: '2024-07-20', // Past date
    startTime: '10:00',
    endTime: '12:00',
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
    facilityImage: 'https://placehold.co/300x200.png?text=Rec+Center',
    dataAiHint: "indoor basketball",
    date: '2024-06-25', 
    startTime: '14:00',
    endTime: '15:30',
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
    facilityImage: 'https://placehold.co/300x200.png?text=Grand+Arena+Soccer',
    dataAiHint: "soccer field night",
    date: '2024-08-25', // Future date
    startTime: '20:00',
    endTime: '21:00',
    totalPrice: 50,
    status: 'Confirmed',
    bookedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), 
    reviewed: false,
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
    sport: mockSports[0], // Soccer
    startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), 
    endDate: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000).toISOString(), 
    description: 'Annual summer soccer tournament for all skill levels. Join us for a competitive and fun weekend!',
    maxParticipants: 64,
    registeredParticipants: 25,
    imageUrl: 'https://placehold.co/600x300.png?text=Soccer+Tournament',
    imageDataAiHint: "soccer tournament action"
  },
  {
    id: 'event-2',
    name: 'Tennis Open Day',
    facilityId: 'facility-2',
    sport: mockSports[2], // Tennis
    startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), 
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), 
    description: 'Come try our tennis courts for free! Coaching available for beginners. Fun for the whole family.',
    registeredParticipants: 0,
    imageUrl: 'https://placehold.co/600x300.png?text=Tennis+Open+Day',
    imageDataAiHint: "tennis players friendly"
  },
  {
    id: 'event-3',
    name: 'Community Basketball League Finals',
    facilityId: 'facility-3',
    sport: mockSports[1], // Basketball
    startDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), 
    endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), 
    description: 'The exciting conclusion to our community basketball league. Witness the crowning of the champions!',
    maxParticipants: 200, // Spectators
    registeredParticipants: 112,
    imageUrl: 'https://placehold.co/600x300.png?text=Basketball+Finals',
    imageDataAiHint: "basketball game intensity"
  },
];

// Helper function to get reviews for a facility
export const getReviewsByFacilityId = (facilityId: string): Review[] => {
  return mockReviews.filter(review => review.facilityId === facilityId);
};

// Helper function to calculate average rating
export const calculateAverageRating = (reviews: Review[] | undefined): number => {
  if (!reviews || reviews.length === 0) {
    return 0;
  }
  const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
  return parseFloat((totalRating / reviews.length).toFixed(1));
};

// Helper function to add a review (mock)
export const addReview = (reviewData: Omit<Review, 'id' | 'createdAt' | 'userName' | 'userAvatar'>): Review => {
  const newReview: Review = {
    ...reviewData,
    id: `review-${mockReviews.length + 1}`,
    userName: mockUser.name, // Assuming the current mockUser is adding the review
    userAvatar: mockUser.profilePictureUrl,
    createdAt: new Date().toISOString(),
  };
  mockReviews.push(newReview);
  
  // Update the facility's reviews array and rating
  const facilityIndex = mockFacilities.findIndex(f => f.id === reviewData.facilityId);
  if (facilityIndex !== -1) {
    const facilityReviews = getReviewsByFacilityId(reviewData.facilityId);
    mockFacilities[facilityIndex].reviews = facilityReviews;
    mockFacilities[facilityIndex].rating = calculateAverageRating(facilityReviews);
  }
  
  // Mark booking as reviewed
  const bookingIndex = mockBookings.findIndex(b => b.id === reviewData.bookingId);
  if (bookingIndex !== -1) {
    mockBookings[bookingIndex].reviewed = true;
  }
  
  return newReview;
};

// Helper function to get a facility by ID, now populating reviews and calculating rating
export const getFacilityById = (id: string): Facility | undefined => {
  const facility = mockFacilities.find(f => f.id === id);
  if (facility) {
    const reviews = getReviewsByFacilityId(id);
    return {
      ...facility,
      reviews: reviews,
      rating: calculateAverageRating(reviews),
    };
  }
  return undefined;
};


// Helper function to get bookings for a user
export const getBookingsByUserId = (userId: string): Booking[] => {
  return mockBookings.filter(booking => booking.userId === userId);
};

// Helper function to get a sport by ID
export const getSportById = (id: string): Sport | undefined => {
  return mockSports.find(sport => sport.id === id);
}
