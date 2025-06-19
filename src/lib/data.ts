
import type { Facility, Sport, Amenity, UserProfile, Booking, ReportData, MembershipPlan, SportEvent, Review, AppNotification, NotificationType, BlogPost, PricingRule } from './types';
import { ParkingCircle, Wifi, ShowerHead, Lock, Dumbbell, Zap, Users, Trophy, Award, CalendarDays, Utensils, Star, LocateFixed, Clock, DollarSign, Goal, Bike, Dices, Swords, Music, Tent, Drama, MapPin, Heart, Dribbble, Activity, Feather, CheckCircle, XCircle, MessageSquareText, Info, Gift, Edit3 } from 'lucide-react';

export const mockSports: Sport[] = [
  { id: 'sport-1', name: 'Soccer', icon: Goal, imageUrl: 'https://placehold.co/400x300.png', imageDataAiHint: 'soccer ball' },
  { id: 'sport-2', name: 'Basketball', icon: Dribbble, imageUrl: 'https://placehold.co/400x300.png', imageDataAiHint: 'basketball hoop' },
  { id: 'sport-3', name: 'Tennis', icon: Activity, imageUrl: 'https://placehold.co/400x300.png', imageDataAiHint: 'tennis racket' },
  { id: 'sport-4', name: 'Badminton', icon: Activity, imageUrl: 'https://placehold.co/400x300.png', imageDataAiHint: 'badminton shuttlecock' },
  { id: 'sport-5', name: 'Swimming', icon: Activity, imageUrl: 'https://placehold.co/400x300.png', imageDataAiHint: 'swimming lane' },
  { id: 'sport-6', name: 'Gym Workout', icon: Dumbbell, imageUrl: 'https://placehold.co/400x300.png', imageDataAiHint: 'gym weights' },
  { id: 'sport-7', name: 'Cycling', icon: Bike, imageUrl: 'https://placehold.co/400x300.png', imageDataAiHint: 'cycling road' },
  { id: 'sport-8', name: 'Fencing', icon: Swords, imageUrl: 'https://placehold.co/400x300.png', imageDataAiHint: 'fencing mask' },
  { id: 'sport-9', name: 'Yoga', icon: Feather, imageUrl: 'https://placehold.co/400x300.png', imageDataAiHint: 'yoga mat'},
  { id: 'sport-10', name: 'Dance', icon: Music, imageUrl: 'https://placehold.co/400x300.png', imageDataAiHint: 'dance studio'},
  { id: 'sport-11', name: 'Camping', icon: Tent, imageUrl: 'https://placehold.co/400x300.png', imageDataAiHint: 'camping tent' },
  { id: 'sport-12', name: 'Theatre', icon: Drama, imageUrl: 'https://placehold.co/400x300.png', imageDataAiHint: 'theatre stage' },
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
    latitude: 34.0522, 
    longitude: -118.2437,
    description: 'State-of-the-art multi-sport complex with indoor and outdoor facilities.',
    images: ['https://placehold.co/800x450.png?text=Grand+Arena+Main', 'https://placehold.co/400x250.png?text=Arena+View+1', 'https://placehold.co/400x250.png?text=Arena+View+2'],
    sports: [mockSports[0], mockSports[1], mockSports[2]], 
    amenities: [mockAmenities[0], mockAmenities[1], mockAmenities[2], mockAmenities[3], mockAmenities[5]],
    operatingHours: [{ day: 'Mon', open: '08:00', close: '22:00' }, { day: 'Tue', open: '08:00', close: '22:00' }, { day: 'Wed', open: '08:00', close: '22:00' }, { day: 'Thu', open: '08:00', close: '22:00' }, { day: 'Fri', open: '08:00', close: '23:00' }, { day: 'Sat', open: '09:00', close: '23:00' }, { day: 'Sun', open: '09:00', close: '20:00' }],
    pricePerHour: 50,
    pricingRules: [],
    rating: 0, 
    reviews: [], 
    isPopular: true,
    isIndoor: true,
    dataAiHint: 'sports complex stadium',
    capacity: 500,
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
    images: ['https://placehold.co/800x450.png?text=Tennis+Club+Main', 'https://placehold.co/400x250.png?text=Tennis+Court+View'],
    sports: [mockSports[2]], 
    amenities: [mockAmenities[0], mockAmenities[2], mockAmenities[3]],
    operatingHours: [{ day: 'Mon', open: '07:00', close: '21:00' }, { day: 'Tue', open: '07:00', close: '21:00' }, { day: 'Wed', open: '07:00', close: '21:00' }, { day: 'Thu', open: '07:00', close: '21:00' }, { day: 'Fri', open: '07:00', close: '21:00' }, { day: 'Sat', open: '08:00', close: '18:00' }, { day: 'Sun', open: '08:00', close: '18:00' }],
    pricePerHour: 30,
    pricingRules: [],
    rating: 0, 
    reviews: [], 
    isIndoor: false,
    dataAiHint: 'tennis court outdoor',
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
    images: ['https://placehold.co/800x450.png?text=Rec+Center+Main'],
    sports: [mockSports[1], mockSports[3], mockSports[5]], 
    amenities: [mockAmenities[0], mockAmenities[1], mockAmenities[4], mockAmenities[6]],
    operatingHours: [{ day: 'Mon', open: '09:00', close: '21:00' }, { day: 'Tue', open: '09:00', close: '21:00' }, { day: 'Wed', open: '09:00', close: '21:00' }, { day: 'Thu', open: '09:00', close: '21:00' }, { day: 'Fri', open: '09:00', close: '20:00' }, { day: 'Sat', open: '10:00', close: '18:00' }, { day: 'Sun', open: '10:00', close: '16:00' }],
    pricePerHour: 20,
    pricingRules: [],
    rating: 0, 
    reviews: [], 
    isPopular: true,
    isIndoor: true,
    dataAiHint: 'community center indoor',
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
    images: ['https://placehold.co/800x450.png?text=Aqua+World+Pool', 'https://placehold.co/400x250.png?text=Pool+Lane', 'https://placehold.co/400x250.png?text=Pool+Area', 'https://placehold.co/400x250.png?text=Diving+Board'],
    sports: [mockSports[4]], 
    amenities: [mockAmenities[0], mockAmenities[2], mockAmenities[3]],
    operatingHours: [{ day: 'Mon', open: '06:00', close: '20:00' }, { day: 'Tue', open: '06:00', close: '20:00' }, { day: 'Wed', open: '06:00', close: '20:00' }, { day: 'Thu', open: '06:00', close: '20:00' }, { day: 'Fri', open: '06:00', close: '20:00' }, { day: 'Sat', open: '07:00', close: '19:00' }, { day: 'Sun', open: '07:00', close: '19:00' }],
    pricePerHour: 15,
    pricingRules: [],
    rating: 0, 
    reviews: [], 
    isIndoor: true,
    dataAiHint: 'swimming pool olympic',
  },
];

// Calculate initial ratings
mockFacilities.forEach(facility => {
  const facilityReviews = getReviewsByFacilityId(facility.id); 
  facility.reviews = facilityReviews;
  facility.rating = calculateAverageRating(facilityReviews); 
});


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
    date: '2024-07-20', 
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
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Upcoming booking
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
    sport: mockSports[0], 
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
    sport: mockSports[2], 
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
    sport: mockSports[1], 
    startDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), 
    endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), 
    description: 'The exciting conclusion to our community basketball league. Witness the crowning of the champions!',
    maxParticipants: 200, 
    registeredParticipants: 112,
    imageUrl: 'https://placehold.co/600x300.png?text=Basketball+Finals',
    imageDataAiHint: "basketball game intensity"
  },
];


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
    };
  }
  return undefined;
};

export const getBookingsByUserId = (userId: string): Booking[] => {
  return mockBookings.filter(booking => booking.userId === userId);
};

export const getSportById = (id: string): Sport | undefined => {
  return mockSports.find(sport => sport.id === id);
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
    icon: CalendarDays,
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
    case 'reminder': icon = CalendarDays; break;
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
    imageUrl: 'https://placehold.co/800x400.png?text=Badminton+Courts',
    imageAlt: 'A badminton court with a net and shuttlecock',
    authorName: 'Jane Doe, Sports Enthusiast',
    authorAvatarUrl: 'https://placehold.co/50x50.png?text=JD',
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
    imageUrl: 'https://placehold.co/800x400.png?text=Soccer+Cleats',
    imageAlt: 'A pair of soccer cleats on a grass field',
    authorName: 'Mike Lee, Soccer Coach',
    authorAvatarUrl: 'https://placehold.co/50x50.png?text=ML',
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
    imageUrl: 'https://placehold.co/800x400.png?text=Swimming+Pool',
    imageAlt: 'A person swimming in a clear blue pool',
    authorName: 'Dr. Aqua Fina',
    authorAvatarUrl: 'https://placehold.co/50x50.png?text=AF',
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


