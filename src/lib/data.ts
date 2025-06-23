
import type { Facility, Sport, Amenity, UserProfile, UserRole, UserStatus, Booking, ReportData, MembershipPlan, SportEvent, Review, AppNotification, NotificationType, BlogPost, PricingRule, PromotionRule, RentalEquipment, RentedItemInfo, AppliedPromotionInfo, TimeSlot, UserSkill, SkillLevel, BlockedSlot, SiteSettings, Team, WaitlistEntry } from './types';
import { ParkingCircle, Wifi, ShowerHead, Lock, Dumbbell, Zap, Users, Trophy, Award, CalendarDays as LucideCalendarDays, Utensils, Star, LocateFixed, Clock, DollarSign, Goal, Bike, Dices, Swords, Music, Tent, Drama, MapPin, Heart, Dribbble, Activity, Feather, CheckCircle, XCircle, MessageSquareText, Info, Gift, Edit3, PackageSearch, Shirt, Disc, Medal, Gem, Rocket, Gamepad2, MonitorPlay, Target, Drum, Guitar, Brain, Camera, PersonStanding, Building, HandCoins, Palette, Group, BikeIcon, DramaIcon, Film, Gamepad, GuitarIcon, Landmark, Lightbulb, MountainSnow, Pizza, ShoppingBag, VenetianMask, Warehouse, Weight, Wind, WrapText, Speech, HistoryIcon, BarChartIcon, UserCheck, UserX, Building2, BellRing } from 'lucide-react';
import { parseISO, isWithinInterval, isAfter, isBefore, startOfDay, endOfDay, getDay, subDays, getMonth, getYear, format as formatDateFns } from 'date-fns';


export const mockSports: Sport[] = [
  { id: 'sport-1', name: 'Soccer', icon: Goal, imageUrl: 'https://images.unsplash.com/photo-1551958214-e6163c125414', imageDataAiHint: 'soccer ball' },
  { id: 'sport-2', name: 'Basketball', icon: Dribbble, imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc', imageDataAiHint: 'basketball hoop' },
  { id: 'sport-3', name: 'Tennis', icon: Activity, imageUrl: 'https://images.unsplash.com/photo-1594470117722-de4b9a02ebed', imageDataAiHint: 'tennis racket' },
  { id: 'sport-4', name: 'Badminton', icon: Feather, imageUrl: 'https://images.unsplash.com/photo-1521587514789-53b8a3b09228', imageDataAiHint: 'badminton shuttlecock' },
  { id: 'sport-5', name: 'Swimming', icon: PersonStanding, imageUrl: 'https://images.unsplash.com/photo-1590650392358-693608513b68', imageDataAiHint: 'swimming lane' },
  { id: 'sport-6', name: 'Yoga', icon: Brain, imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b', imageDataAiHint: 'yoga pose' },
  { id: 'sport-7', name: 'Cycling', icon: Bike, imageUrl: 'https://images.unsplash.com/photo-1576426863875-c217e4287487', imageDataAiHint: 'cycling road' },
  { id: 'sport-8', name: 'Dance', icon: Music, imageUrl: 'https://images.unsplash.com/photo-1511719111394-550342a5b23d', imageDataAiHint: 'dance studio' },
  { id: 'sport-9', name: 'Camping', icon: Tent, imageUrl: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d', imageDataAiHint: 'camping tent nature' },
  { id: 'sport-10', name: 'Theatre', icon: Drama, imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91e38a493', imageDataAiHint: 'theatre stage' },
  { id: 'sport-13', name: 'Cricket', icon: Dices, imageUrl: 'https://images.unsplash.com/photo-1599551154316-276537b02c89', imageDataAiHint: 'cricket bat ball' },
  { id: 'sport-14', name: 'Pool', icon: Target, imageUrl: 'https://images.unsplash.com/photo-1601758124235-7c98c199e4df', imageDataAiHint: 'billiards table' },
  { id: 'sport-15', name: 'PC Game/PS5', icon: Gamepad2, imageUrl: 'https://images.unsplash.com/photo-1598550489913-af3c28a2cc73', imageDataAiHint: 'gaming setup' },
];

export const mockAmenities: Amenity[] = [
  { id: 'amenity-1', name: 'Parking', icon: ParkingCircle },
  { id: 'amenity-2', name: 'WiFi', icon: Wifi },
  { id: 'amenity-3', name: 'Showers', icon: ShowerHead },
  { id: 'amenity-4', name: 'Lockers', icon: Lock },
  { id: 'amenity-5', name: 'Equipment Rental Signage', icon: PackageSearch },
  { id: 'amenity-6', name: 'Cafe', icon: Utensils },
  { id: 'amenity-7', name: 'Accessible', icon: Users },
];

export let mockRentalEquipment: RentalEquipment[] = [
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

export let mockReviews: Review[] = [
  {
    id: 'review-1',
    facilityId: 'facility-1',
    userId: 'user-admin',
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
    userId: 'user-regular',
    userName: 'Maria Garcia',
    userAvatar: 'https://placehold.co/40x40.png',
    rating: 4,
    comment: 'Great place for soccer. The fields are top-notch. Parking can be a bit tricky during peak hours.',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'review-3',
    facilityId: 'facility-2',
    userId: 'user-owner',
    userName: 'David Smith',
    userAvatar: 'https://placehold.co/40x40.png',
    rating: 5,
    comment: 'Loved the tennis courts here. Beautiful view and excellent surface.',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'review-4',
    facilityId: 'facility-3',
    userId: 'user-admin',
    userName: 'Alex Johnson',
    userAvatar: 'https://placehold.co/40x40.png',
    rating: 3,
    comment: 'Decent community center. Good value for money, but can get crowded. Equipment is a bit old.',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    bookingId: 'booking-3'
  },
];

export const defaultOperatingHours: FacilityOperatingHours[] = [
  { day: 'Mon', open: '08:00', close: '22:00' }, { day: 'Tue', open: '08:00', close: '22:00' },
  { day: 'Wed', open: '08:00', close: '22:00' }, { day: 'Thu', open: '08:00', close: '22:00' },
  { day: 'Fri', open: '08:00', close: '23:00' }, { day: 'Sat', open: '09:00', close: '23:00' },
  { day: 'Sun', open: '09:00', close: '20:00' },
];

export const getReviewsByFacilityId = (facilityId: string): Review[] => {
  return mockReviews.filter(review => review.facilityId === facilityId);
};

export const calculateAverageRating = (reviews: Review[] | undefined): number => {
  if (!reviews || reviews.length === 0) {
    return 0;
  }
  const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
  return parseFloat((totalRating / reviews.length).toFixed(1));
};

export const getSportById = (id: string): Sport | undefined => {
  return mockSports.find(sport => sport.id === id);
};

export const getAmenityById = (id: string): Amenity | undefined => {
  return mockAmenities.find(amenity => amenity.id === id);
};

export const getFacilityById = (id: string): Facility | undefined => {
  const facility = mockFacilities.find(f => f.id === id);
  if (facility) {
    const reviews = getReviewsByFacilityId(id);
    return {
      ...facility,
      reviews: reviews,
      rating: calculateAverageRating(reviews), 
      sports: facility.sports.map(s => getSportById(s.id) || s),
      amenities: facility.amenities.map(a => getAmenityById(a.id) || a),
      blockedSlots: facility.blockedSlots || [],
    };
  }
  return undefined;
};

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
    images: ['https://images.unsplash.com/photo-1540747913346-19e32dc3e97e', 'https://images.unsplash.com/photo-1515523110800-9415d13b84a8', 'https://images.unsplash.com/photo-1579952516518-6c21a43665ac'],
    sports: [mockSports[0], mockSports[1], mockSports[2]],
    amenities: [mockAmenities[0], mockAmenities[1], mockAmenities[2], mockAmenities[3], mockAmenities[5]],
    operatingHours: [...defaultOperatingHours],
    pricePerHour: 50,
    pricingRulesApplied: [],
    rating: 0, 
    reviews: [], 
    capacity: 100,
    isPopular: true,
    isIndoor: true,
    dataAiHint: 'sports stadium floodlights',
    availableEquipment: mockRentalEquipment.filter(eq => ['equip-1', 'equip-2', 'equip-3'].includes(eq.id)),
    ownerId: 'user-admin',
    blockedSlots: [],
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
    images: ['https://images.unsplash.com/photo-1559586829-37a509936a77', 'https://images.unsplash.com/photo-1622201862963-1d214a1a3641'],
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
    ownerId: 'user-owner',
    blockedSlots: [],
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
    images: ['https://images.unsplash.com/photo-1577412643533-544a048d94a2'],
    sports: [mockSports[1], mockSports[3]],
    amenities: [mockAmenities[0], mockAmenities[1], mockAmenities[6]],
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
    ownerId: 'user-admin',
    blockedSlots: [],
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
    images: ['https://images.unsplash.com/photo-1557951224-69b3294a4a51', 'https://images.unsplash.com/photo-1580252194946-8e5436a53696'],
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
    ownerId: 'user-owner',
    blockedSlots: [],
  },
  {
    id: 'facility-5',
    name: 'Metropolis Box Cricket Zone',
    type: 'Box Cricket',
    address: '555 Rooftop Way, Metropolis, CA 90215',
    location: 'Metropolis',
    latitude: 34.0700,
    longitude: -118.2800,
    description: 'State-of-the-art box cricket arena with professional turf and lighting. Perfect for intense 6v6 matches day or night.',
    images: ['https://5.imimg.com/data5/SELLER/Default/2024/9/451738361/LQ/PQ/EC/15707674/box-cricket-setup-500x500.png'],
    sports: [mockSports.find(s => s.name === 'Cricket')!],
    amenities: [mockAmenities[0], mockAmenities[3], mockAmenities[5]],
    operatingHours: [...defaultOperatingHours],
    pricePerHour: 45,
    pricingRulesApplied: [],
    rating: 4.8,
    reviews: [],
    capacity: 12,
    isPopular: true,
    isIndoor: true,
    dataAiHint: 'box cricket night',
    availableEquipment: [],
    ownerId: 'user-admin',
    blockedSlots: [],
  },
];

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

export let mockUsers: UserProfile[] = [
  {
    id: 'user-admin',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '555-123-4567',
    profilePictureUrl: 'https://placehold.co/100x100.png?text=AJ',
    dataAiHint: "user avatar",
    preferredSports: [mockSports[0], mockSports[2]],
    favoriteFacilities: ['facility-1', 'facility-2'],
    membershipLevel: 'Premium',
    loyaltyPoints: 1250,
    achievements: [mockAchievements[0], mockAchievements[1]],
    bio: 'Passionate about sports and outdoor activities. Always looking for a good game!',
    preferredPlayingTimes: 'Weekday evenings, Weekend mornings',
    skillLevels: [
      { sportId: 'sport-1', sportName: 'Soccer', level: 'Intermediate' },
      { sportId: 'sport-3', sportName: 'Tennis', level: 'Beginner' },
    ],
    role: 'Admin',
    status: 'Active',
    joinedAt: subDays(new Date(), 30).toISOString(),
    teamIds: ['team-1', 'team-2'],
  },
  {
    id: 'user-regular',
    name: 'Maria Garcia',
    email: 'maria.garcia@example.com',
    phone: '555-987-6543',
    profilePictureUrl: 'https://placehold.co/100x100.png?text=MG',
    role: 'User',
    status: 'Active',
    membershipLevel: 'Basic',
    joinedAt: subDays(new Date(), 90).toISOString(),
    favoriteFacilities: ['facility-1'],
    loyaltyPoints: 200,
    teamIds: ['team-1'],
  },
  {
    id: 'user-owner',
    name: 'David Smith',
    email: 'david.smith@facilityowner.com',
    phone: '555-555-5555',
    profilePictureUrl: 'https://placehold.co/100x100.png?text=DS',
    role: 'FacilityOwner',
    status: 'Active',
    membershipLevel: 'Pro',
    bio: 'Owner of Riverside Tennis Club. Dedicated to providing the best tennis experience.',
    joinedAt: subDays(new Date(), 150).toISOString(),
    loyaltyPoints: 500,
    teamIds: ['team-1', 'team-2'],
  },
  {
    id: 'user-suspended',
    name: 'Ken Adams',
    email: 'ken.adams@example.com',
    phone: '555-222-3333',
    profilePictureUrl: 'https://placehold.co/100x100.png?text=KA',
    role: 'User',
    status: 'Suspended',
    joinedAt: subDays(new Date(), 60).toISOString(),
    loyaltyPoints: 50,
    teamIds: [],
  }
];

export const mockUser = mockUsers[0]; 

export let mockTeams: Team[] = [
  {
    id: 'team-1',
    name: 'Metropolis Mavericks',
    sport: mockSports[0], // Soccer
    captainId: 'user-admin',
    memberIds: ['user-admin', 'user-regular', 'user-owner'],
  },
  {
    id: 'team-2',
    name: 'Riverside Racqueteers',
    sport: mockSports[2], // Tennis
    captainId: 'user-owner',
    memberIds: ['user-owner', 'user-admin'],
  },
];

export const getTeamById = (teamId: string): Team | undefined => {
  return mockTeams.find(team => team.id === teamId);
}

export const getTeamsByUserId = (userId: string): Team[] => {
  return mockTeams.filter(team => team.memberIds.includes(userId));
}

export const createTeam = (teamData: { name: string; sportId: string; captainId: string }): Team => {
  const sport = getSportById(teamData.sportId);
  if (!sport) {
    throw new Error('Sport not found');
  }
  const newTeam: Team = {
    id: `team-${Date.now()}`,
    name: teamData.name,
    sport,
    captainId: teamData.captainId,
    memberIds: [teamData.captainId],
  };
  mockTeams.push(newTeam);
  
  const user = getUserById(teamData.captainId);
  if (user) {
    if (!user.teamIds) {
      user.teamIds = [];
    }
    user.teamIds.push(newTeam.id);
  }
  
  return newTeam;
}

export const leaveTeam = (teamId: string, userId: string): boolean => {
  const teamIndex = mockTeams.findIndex(t => t.id === teamId);
  if (teamIndex === -1) return false;

  const team = mockTeams[teamIndex];
  if (!team.memberIds.includes(userId)) return false; // Not a member

  if (team.captainId === userId && team.memberIds.length > 1) {
    // Cannot leave if captain and there are other members. Must transfer captaincy first (future feature).
    return false; 
  }

  // If captain and last member, delete team
  if (team.captainId === userId && team.memberIds.length === 1) {
    mockTeams.splice(teamIndex, 1);
  } else {
    // Just a member leaving
    team.memberIds = team.memberIds.filter(id => id !== userId);
  }

  // Remove from user's team list
  const user = getUserById(userId);
  if (user && user.teamIds) {
    user.teamIds = user.teamIds.filter(id => id !== teamId);
  }
  
  return true;
}

export const addUserToTeam = (teamId: string, userId: string): boolean => {
  const team = mockTeams.find(t => t.id === teamId);
  if (!team) return false;

  const user = getUserById(userId);
  if (!user) return false;

  if (team.memberIds.includes(userId)) return true; // Already a member

  team.memberIds.push(userId);
  if (!user.teamIds) user.teamIds = [];
  user.teamIds.push(teamId);

  return true;
};

export let mockBookings: Booking[] = [
  {
    id: 'booking-1',
    userId: 'user-admin',
    facilityId: 'facility-1',
    facilityName: 'Grand City Arena',
    facilityImage: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e',
    dataAiHint: "arena floodlights",
    date: '2024-07-15',
    startTime: '18:00',
    endTime: '19:00',
    durationHours: 1,
    numberOfGuests: 10,
    baseFacilityPrice: 50,
    equipmentRentalCost: 10,
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
    userId: 'user-admin',
    facilityId: 'facility-2',
    facilityName: 'Riverside Tennis Club',
    facilityImage: 'https://images.unsplash.com/photo-1559586829-37a509936a77',
    dataAiHint: "tennis court sunset",
    date: '2024-07-20',
    startTime: '10:00',
    endTime: '12:00',
    durationHours: 2,
    numberOfGuests: 2,
    baseFacilityPrice: 60,
    equipmentRentalCost: 0,
    totalPrice: 60,
    status: 'Confirmed',
    bookedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    reviewed: false,
  },
  {
    id: 'booking-3',
    userId: 'user-admin',
    facilityId: 'facility-3',
    facilityName: 'Community Rec Center',
    facilityImage: 'https://images.unsplash.com/photo-1577412643533-544a048d94a2',
    dataAiHint: "indoor basketball",
    date: '2024-06-25',
    startTime: '14:00',
    endTime: '15:30',
    durationHours: 1.5,
    numberOfGuests: 5,
    baseFacilityPrice: 30,
    equipmentRentalCost: 0,
    totalPrice: 30,
    status: 'Confirmed',
    bookedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    reviewed: true,
  },
  {
    id: 'booking-4',
    userId: 'user-admin',
    facilityId: 'facility-1',
    facilityName: 'Grand City Arena',
    facilityImage: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e',
    dataAiHint: "soccer field night",
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
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
    userId: 'user-regular',
    facilityId: 'facility-3',
    facilityName: 'Community Rec Center',
    facilityImage: 'https://images.unsplash.com/photo-1577412643533-544a048d94a2',
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
    userId: 'user-owner',
    facilityId: 'facility-4',
    facilityName: 'Aqua World',
    facilityImage: 'https://images.unsplash.com/photo-1557951224-69b3294a4a51',
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
    userId: 'user-admin',
    facilityId: 'facility-4',
    facilityName: 'Aqua World',
    facilityImage: 'https://images.unsplash.com/photo-1557951224-69b3294a4a51',
    dataAiHint: "pool diving board",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: '15:00',
    endTime: '16:00',
    durationHours: 1,
    numberOfGuests: 3,
    baseFacilityPrice: 15,
    equipmentRentalCost: 6,
    appliedPromotion: { code: 'WELCOME10', discountAmount: 10, description: 'New User Welcome' },
    totalPrice: 11,
    status: 'Pending',
    bookedAt: new Date(Date.now() - 0.1 * 24 * 60 * 60 * 1000).toISOString(),
    reviewed: false,
    rentedEquipment: [
        { equipmentId: 'equip-9', name: 'Swim Cap', quantity: 3, priceAtBooking: 2, priceTypeAtBooking: 'per_booking', totalCost: 6 },
    ]
  },
];

let mockWaitlist: WaitlistEntry[] = [];

const processWaitlistNotifications = (facilityId: string, date: string, startTime: string) => {
    const facility = getFacilityById(facilityId);
    if (!facility) return;

    const waitlistedUsers = mockWaitlist.filter(entry =>
        entry.facilityId === facilityId &&
        entry.date === date &&
        entry.startTime === startTime
    );

    if (waitlistedUsers.length > 0) {
        console.log(`Notifying ${waitlistedUsers.length} users for slot ${facility.name} at ${date} ${startTime}`);
        for (const entry of waitlistedUsers) {
            addNotification(entry.userId, {
                type: 'waitlist_opening',
                title: 'Slot Available!',
                message: `A slot at ${facility.name} for ${date} at ${startTime} is now open! Book now before it's gone.`,
                link: `/facilities/${facilityId}/book`,
            });
        }
        // Clear the waitlist for this slot after notifying
        mockWaitlist = mockWaitlist.filter(entry =>
            !(entry.facilityId === facilityId && entry.date === date && entry.startTime === startTime)
        );
    }
};

export const updateBooking = (bookingId: string, updates: Partial<Booking>): Booking | undefined => {
    const bookingIndex = mockBookings.findIndex(b => b.id === bookingId);
    if (bookingIndex === -1) return undefined;
    
    const originalBooking = { ...mockBookings[bookingIndex] };
    const wasConfirmed = originalBooking.status === 'Confirmed';
    
    mockBookings[bookingIndex] = { ...mockBookings[bookingIndex], ...updates };
    
    const isNowCancelled = updates.status === 'Cancelled';

    if (wasConfirmed && isNowCancelled) {
        processWaitlistNotifications(originalBooking.facilityId, originalBooking.date, originalBooking.startTime);
    }

    return mockBookings[bookingIndex];
};

export const getBookingsByUserId = (userId: string): Booking[] => {
  return mockBookings.filter(booking => booking.userId === userId);
};

export const getAllBookings = (): Booking[] => {
  return [...mockBookings].sort((a,b) => new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime());
};

export const getAllUsers = (): UserProfile[] => {
    return [...mockUsers];
};

export const getUserById = (userId: string): UserProfile | undefined => {
  return mockUsers.find(user => user.id === userId);
};

export const updateUser = (userId: string, updates: Partial<UserProfile>): UserProfile | undefined => {
    const userIndex = mockUsers.findIndex(user => user.id === userId);
    if (userIndex === -1) {
        return undefined;
    }
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };
    return mockUsers[userIndex];
};

export const getAllSports = (): Sport[] => {
    return mockSports;
};

export const getAllFacilities = (): Facility[] => {
    return mockFacilities.map(f => ({
      ...f,
      rating: calculateAverageRating(getReviewsByFacilityId(f.id)), 
      reviews: getReviewsByFacilityId(f.id),
      blockedSlots: f.blockedSlots || [],
    }));
};

export const getFacilitiesByOwnerId = (ownerId: string): Facility[] => {
  return mockFacilities
    .filter(f => f.ownerId === ownerId)
    .map(f => ({ 
      ...f,
      rating: calculateAverageRating(getReviewsByFacilityId(f.id)),
      reviews: getReviewsByFacilityId(f.id),
      blockedSlots: f.blockedSlots || [],
    }));
};


export const addFacility = (facilityData: Omit<Facility, 'id' | 'sports' | 'amenities' | 'reviews' | 'rating' | 'operatingHours' | 'blockedSlots'> & { sports: string[], amenities?: string[], operatingHours?: FacilityOperatingHours[], ownerId?: string, blockedSlots?: BlockedSlot[], availableEquipment?: Partial<RentalEquipment>[] }): Facility => {
  const facilityId = facilityData.id || `facility-${Date.now()}`;
  const processedEquipment = (facilityData.availableEquipment || []).map(eq => ({
    id: eq.id || `equip-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    facilityId: facilityId,
    name: eq.name!,
    pricePerItem: eq.pricePerItem!,
    priceType: eq.priceType!,
    stock: eq.stock!,
    imageUrl: eq.imageUrl,
    dataAiHint: eq.dataAiHint,
  }));
  
  const newFacility: Facility = {
    ...facilityData,
    id: facilityId,
    sports: facilityData.sports.map(sportId => getSportById(sportId)).filter(Boolean) as Sport[],
    amenities: (facilityData.amenities || []).map(amenityId => getAmenityById(amenityId)).filter(Boolean) as Amenity[],
    reviews: [],
    rating: facilityData.rating ?? 0,
    operatingHours: facilityData.operatingHours || defaultOperatingHours,
    availableEquipment: processedEquipment,
    pricingRulesApplied: [],
    ownerId: facilityData.ownerId || 'user-admin', 
    blockedSlots: facilityData.blockedSlots || [],
  };
  mockFacilities.push(newFacility);
  mockRentalEquipment.push(...processedEquipment);
  return newFacility;
};

export const updateFacility = (updatedFacilityData: Omit<Facility, 'sports' | 'amenities' | 'reviews' | 'rating' | 'operatingHours'> & { sports: string[], amenities?: string[], operatingHours?: FacilityOperatingHours[], availableEquipment?: Partial<RentalEquipment>[] }): Facility | undefined => {
  const facilityIndex = mockFacilities.findIndex(f => f.id === updatedFacilityData.id);
  if (facilityIndex === -1) return undefined;

  const processedEquipment = (updatedFacilityData.availableEquipment || []).map(eq => ({
    id: eq.id || `equip-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    facilityId: updatedFacilityData.id,
    name: eq.name!,
    pricePerItem: eq.pricePerItem!,
    priceType: eq.priceType!,
    stock: eq.stock!,
    imageUrl: eq.imageUrl,
    dataAiHint: eq.dataAiHint,
  }));

  const updatedFacility: Facility = {
    ...mockFacilities[facilityIndex],
    ...updatedFacilityData,
    sports: updatedFacilityData.sports.map(sportId => getSportById(sportId)).filter(Boolean) as Sport[],
    amenities: (updatedFacilityData.amenities || []).map(amenityId => getAmenityById(amenityId)).filter(Boolean) as Amenity[],
    rating: updatedFacilityData.rating ?? mockFacilities[facilityIndex].rating,
    operatingHours: updatedFacilityData.operatingHours || mockFacilities[facilityIndex].operatingHours,
    blockedSlots: updatedFacilityData.blockedSlots || mockFacilities[facilityIndex].blockedSlots || [],
    availableEquipment: processedEquipment,
  };

  mockFacilities[facilityIndex] = updatedFacility;
  
  mockRentalEquipment = mockRentalEquipment.filter(eq => eq.facilityId !== updatedFacility.id);
  mockRentalEquipment.push(...processedEquipment);
  
  return updatedFacility;
};

export const deleteFacility = (facilityId: string): boolean => {
  const initialLength = mockFacilities.length;
  mockFacilities = mockFacilities.filter(f => f.id !== facilityId);
  mockReviews = mockReviews.filter(r => r.facilityId !== facilityId);
  return mockFacilities.length < initialLength;
};

export const blockTimeSlot = (facilityId: string, ownerId: string, slot: BlockedSlot): boolean => {
  const facilityIndex = mockFacilities.findIndex(f => f.id === facilityId && f.ownerId === ownerId);
  if (facilityIndex === -1) return false;

  if (!mockFacilities[facilityIndex].blockedSlots) {
    mockFacilities[facilityIndex].blockedSlots = [];
  }
  const existingBlock = mockFacilities[facilityIndex].blockedSlots!.find(
    bs => bs.date === slot.date && bs.startTime === slot.startTime
  );
  if (existingBlock) return false; 

  mockFacilities[facilityIndex].blockedSlots!.push(slot);
  mockFacilities[facilityIndex].blockedSlots!.sort((a,b) => {
    const dateComparison = a.date.localeCompare(b.date);
    if (dateComparison !== 0) return dateComparison;
    return a.startTime.localeCompare(b.startTime);
  });
  return true;
};

export const unblockTimeSlot = (facilityId: string, ownerId: string, date: string, startTime: string): boolean => {
  const facilityIndex = mockFacilities.findIndex(f => f.id === facilityId && f.ownerId === ownerId);
  if (facilityIndex === -1 || !mockFacilities[facilityIndex].blockedSlots) return false;

  const initialLength = mockFacilities[facilityIndex].blockedSlots!.length;
  mockFacilities[facilityIndex].blockedSlots = mockFacilities[facilityIndex].blockedSlots!.filter(
    bs => !(bs.date === date && bs.startTime === startTime)
  );
  return mockFacilities[facilityIndex].blockedSlots!.length < initialLength;
};


export const getRentalEquipmentById = (id: string): RentalEquipment | undefined => {
  return mockRentalEquipment.find(eq => eq.id === id);
};

let mockAppNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    userId: 'user-admin',
    type: 'booking_confirmed',
    title: 'Booking Confirmed!',
    message: 'Your booking for Grand City Arena on July 15th is confirmed.',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    link: '/account/bookings',
    icon: CheckCircle,
  },
  {
    id: 'notif-2',
    userId: 'user-admin',
    type: 'reminder',
    title: 'Upcoming Booking Reminder',
    message: 'Your tennis session at Riverside Tennis Club is tomorrow at 10:00 AM.',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    link: '/account/bookings',
    icon: LucideCalendarDays,
  },
  {
    id: 'notif-3',
    userId: 'user-admin',
    type: 'promotion',
    title: 'Special Offer Just For You!',
    message: 'Get 20% off your next booking with code SUMMER20.',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
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
    case 'waitlist_opening': icon = BellRing; break;
    case 'user_status_changed': icon = Edit3; break;
  }

  const newNotification: AppNotification = {
    ...notificationData,
    id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    userId,
    createdAt: new Date().toISOString(),
    isRead: false,
    icon: notificationData.icon || icon,
  };
  mockAppNotifications.unshift(newNotification);
  return newNotification;
};


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
    { ...mockUser, id: 'admin-001', name: 'Admin User', email: 'admin@sportsarena.com', role: 'Admin', status: 'Active', joinedAt: new Date().toISOString() },
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
    maxParticipants: 100,
    registeredParticipants: 0,
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
    maxParticipants: 200,
    registeredParticipants: 112,
    imageUrl: 'https://placehold.co/600x300.png',
    imageDataAiHint: "basketball game intensity"
  },
   {
    id: 'event-4',
    name: 'Badminton Bonanza Weekend',
    facilityId: 'facility-3',
    sport: mockSports[3],
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

export const getAllEvents = (): SportEvent[] => {
  return [...mockEvents].sort((a,b) => parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime());
};

export const getEventById = (id: string): SportEvent | undefined => {
  const event = mockEvents.find(event => event.id === id);
  if (event) {
    const sport = getSportById(event.sport.id);
    return sport ? { ...event, sport } : { ...event };
  }
  return undefined;
};

export const addEvent = (eventData: Omit<SportEvent, 'id' | 'sport' | 'registeredParticipants'> & { sportId: string }): SportEvent => {
  const sport = getSportById(eventData.sportId);
  if (!sport) throw new Error("Invalid sport ID provided for event.");

  const newEvent: SportEvent = {
    ...eventData,
    id: `event-${Date.now()}`,
    sport: sport,
    registeredParticipants: 0,
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
    return false;
  }

  mockEvents[eventIndex].registeredParticipants += 1;
  return true;
};

export const addReview = (reviewData: Omit<Review, 'id' | 'createdAt' | 'userName' | 'userAvatar'>): Review => {
  const currentUser = getUserById(reviewData.userId);
  const newReview: Review = {
    ...reviewData,
    id: `review-${mockReviews.length + 1}`,
    userName: currentUser?.name || 'Anonymous User',
    userAvatar: currentUser?.profilePictureUrl,
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

export let mockPricingRules: PricingRule[] = [
    {
        id: 'price-rule-1',
        name: 'Weekend Evening Surge',
        description: 'Higher prices for popular weekend evening slots.',
        daysOfWeek: ['Sat', 'Sun'],
        timeRange: { start: '18:00', end: '22:00' },
        adjustmentType: 'percentage_increase',
        value: 20,
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
        value: 15,
        priority: 10,
        isActive: true,
    },
    {
        id: 'price-rule-3',
        name: 'Holiday Special Pricing',
        dateRange: { start: '2024-12-20', end: '2024-12-26' },
        adjustmentType: 'fixed_price',
        value: 75,
        priority: 5,
        isActive: true,
    }
];

function checkRuleApplicability(rule: PricingRule, date: Date, slot: TimeSlot): boolean {
  if (!rule.isActive) return false;

  if (rule.daysOfWeek && rule.daysOfWeek.length > 0) {
    const dayNames: ('Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat')[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentDayName = dayNames[getDay(date)];
    if (!rule.daysOfWeek.includes(currentDayName)) {
      return false;
    }
  }

  if (rule.timeRange && rule.timeRange.start && rule.timeRange.end) {
    if (slot.startTime < rule.timeRange.start || slot.startTime >= rule.timeRange.end) {
      return false;
    }
  }

  if (rule.dateRange && rule.dateRange.start && rule.dateRange.end) {
    const ruleStartDate = startOfDay(parseISO(rule.dateRange.start));
    const ruleEndDate = endOfDay(parseISO(rule.dateRange.end));
    if (!isWithinInterval(date, { start: ruleStartDate, end: ruleEndDate })) {
      return false;
    }
  }
  return true;
}

export function calculateDynamicPrice(
  basePricePerHour: number,
  selectedDate: Date,
  selectedSlot: TimeSlot,
  durationHours: number
): { finalPrice: number; appliedRuleName?: string, appliedRuleDetails?: PricingRule } {
  let currentPricePerHour = basePricePerHour;
  let appliedRule: PricingRule | undefined = undefined;

  const activeRules = mockPricingRules
    .filter(rule => rule.isActive)
    .sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999));

  for (const rule of activeRules) {
    if (checkRuleApplicability(rule, selectedDate, selectedSlot)) {
      appliedRule = rule;
      let adjustedHourlyRate = basePricePerHour; 
      switch (rule.adjustmentType) {
        case 'percentage_increase':
          adjustedHourlyRate = basePricePerHour * (1 + rule.value / 100);
          break;
        case 'percentage_decrease':
          adjustedHourlyRate = basePricePerHour * (1 - rule.value / 100);
          break;
        case 'fixed_increase':
          adjustedHourlyRate = basePricePerHour + rule.value;
          break;
        case 'fixed_decrease':
          adjustedHourlyRate = basePricePerHour - rule.value;
          break;
        case 'fixed_price':
          adjustedHourlyRate = rule.value; 
          break;
      }
      currentPricePerHour = Math.max(0, adjustedHourlyRate);
      break; 
    }
  }
  return {
    finalPrice: parseFloat((currentPricePerHour * durationHours).toFixed(2)),
    appliedRuleName: appliedRule?.name,
    appliedRuleDetails: appliedRule
  };
}


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
    }
];


export const getAllPromotionRules = (): PromotionRule[] => {
    return [...mockPromotionRules].sort((a, b) => a.name.localeCompare(b.name));
};

export const getPromotionRuleByCode = (code: string): PromotionRule | undefined => {
    const rule = mockPromotionRules.find(r => r.code?.toLowerCase() === code.toLowerCase() && r.isActive);
    if (rule) {
        const now = new Date();
        const startDateValid = !rule.startDate || isAfter(now, startOfDay(parseISO(rule.startDate))) || isWithinInterval(now, {start: startOfDay(parseISO(rule.startDate)), end: endOfDay(parseISO(rule.startDate))});
        const endDateValid = !rule.endDate || isBefore(now, endOfDay(parseISO(rule.endDate))) || isWithinInterval(now, {start: startOfDay(parseISO(rule.endDate)), end: endOfDay(parseISO(rule.endDate))});

        if (startDateValid && endDateValid) {
            return rule;
        }
    }
    return undefined;
};

export const getPromotionRuleById = (id: string): PromotionRule | undefined => {
    return mockPromotionRules.find(r => r.id === id);
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

export const mockReportData: ReportData = {
  totalBookings: mockBookings.length,
  totalRevenue: mockBookings.reduce((sum, booking) => sum + (booking.status === 'Confirmed' ? booking.totalPrice : 0), 0),
  facilityUsage: (() => {
    const usageMap = new Map<string, number>();
    mockBookings.forEach(booking => {
      usageMap.set(booking.facilityId, (usageMap.get(booking.facilityId) || 0) + 1);
    });
    return Array.from(usageMap.entries()).map(([facilityId, count]) => ({
      facilityName: getFacilityById(facilityId)?.name || 'Unknown Facility', 
      bookings: count,
    }));
  })(),
  peakHours: [
    { hour: '18:00', bookings: mockBookings.filter(b => b.startTime.startsWith('18:')).length || 200 },
    { hour: '19:00', bookings: mockBookings.filter(b => b.startTime.startsWith('19:')).length || 180 },
    { hour: '17:00', bookings: mockBookings.filter(b => b.startTime.startsWith('17:')).length || 150 },
  ],
};

let mockSiteSettings: SiteSettings = {
  siteName: 'Sports Arena',
  defaultCurrency: 'INR',
  timezone: 'America/Los_Angeles',
  maintenanceMode: false,
};

export const getSiteSettings = (): SiteSettings => {
  return mockSiteSettings;
};

export const updateSiteSettings = (newSettings: Partial<SiteSettings>): SiteSettings => {
  mockSiteSettings = { ...mockSiteSettings, ...newSettings };
  return mockSiteSettings;
};

export const isUserOnWaitlist = (userId: string, facilityId: string, date: string, startTime: string): boolean => {
    return mockWaitlist.some(entry =>
        entry.userId === userId &&
        entry.facilityId === facilityId &&
        entry.date === date &&
        entry.startTime === startTime
    );
};

export const addToWaitlist = (userId: string, facilityId: string, date: string, startTime: string): WaitlistEntry | null => {
    if (isUserOnWaitlist(userId, facilityId, date, startTime)) {
        return null;
    }
    const newEntry: WaitlistEntry = {
        id: `wait-${Date.now()}`,
        userId,
        facilityId,
        date,
        startTime,
        createdAt: new Date().toISOString(),
    };
    mockWaitlist.push(newEntry);
    return newEntry;
};
    

