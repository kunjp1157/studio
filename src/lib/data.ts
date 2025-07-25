

import type { Facility, Sport, Amenity, UserProfile, UserRole, UserStatus, Booking, ReportData, MembershipPlan, SportEvent, Review, AppNotification, NotificationType, BlogPost, PricingRule, PromotionRule, RentalEquipment, RentedItemInfo, AppliedPromotionInfo, TimeSlot, UserSkill, SkillLevel, BlockedSlot, SiteSettings, Team, WaitlistEntry, LfgRequest, SportPrice, NotificationTemplate, Challenge } from './types';
import { mockMembershipPlans as mockStaticMembershipPlans } from './mock-data';
import { parseISO, isWithinInterval, isAfter, isBefore, startOfDay, endOfDay, getDay, subDays, getMonth, getYear, format as formatDateFns } from 'date-fns';

// --- IN-MEMORY MOCK DATABASE ---

// NOTE: To avoid circular dependencies and build errors, the static mock data
// used for initializing the in-memory store is defined directly in this file.
const mockSports: Sport[] = [
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

const mockAmenities: Amenity[] = [
  { id: 'amenity-1', name: 'Parking', iconName: 'ParkingCircle' },
  { id: 'amenity-2', name: 'WiFi', iconName: 'Wifi' },
  { id: 'amenity-3', name: 'Showers', iconName: 'ShowerHead' },
  { id: 'amenity-4', name: 'Lockers', iconName: 'Lock' },
  { id: 'amenity-5', name: 'Equipment Rental Signage', iconName: 'PackageSearch' },
  { id: 'amenity-6', name: 'Cafe', iconName: 'Utensils' },
  { id: 'amenity-7', name: 'Accessible', iconName: 'Users' },
];

const staticUsers: UserProfile[] = [
  { 
    id: 'user-admin-kirtan', 
    name: 'Kirtan Shah', 
    email: 'kirtan.shah@example.com', 
    role: 'Admin', 
    status: 'Active',
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
        mockSports.find(s => s.id === 'sport-1')!,
        mockSports.find(s => s.id === 'sport-3')!,
    ],
    teamIds: ['team-1'],
    membershipLevel: 'Premium',
  },
  { 
    id: 'user-owner-dana', 
    name: 'Dana White', 
    email: 'dana.white@example.com', 
    role: 'FacilityOwner', 
    status: 'Active',
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
    role: 'User',
    status: 'Active',
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
        { sportId: 'sport-13', sportName: 'Cricket', level: 'Intermediate' },
    ],
    preferredSports: [
        mockSports.find(s => s.id === 'sport-2')!,
        mockSports.find(s => s.id === 'sport-13')!,
    ],
    teamIds: ['team-1'],
    membershipLevel: 'Basic',
  }
];

const defaultOperatingHours: FacilityOperatingHours[] = [
  { day: 'Mon', open: '08:00', close: '22:00' }, { day: 'Tue', open: '08:00', close: '22:00' },
  { day: 'Wed', open: '08:00', close: '22:00' }, { day: 'Thu', open: '08:00', close: '22:00' },
  { day: 'Fri', open: '08:00', close: '23:00' }, { day: 'Sat', open: '09:00', close: '23:00' },
  { day: 'Sun', open: '09:00', close: '20:00' },
];

const staticFacilities: Facility[] = [
  {
    id: 'facility-1',
    name: 'Grand City Arena',
    type: 'Complex',
    address: '123 Stadium Way, Metropolis, ST 12345',
    city: 'Metropolis',
    location: 'Downtown',
    description: 'A state-of-the-art multi-sport complex in the heart of the city. Perfect for professional training and casual play alike.',
    images: [
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55',
      'https://images.unsplash.com/photo-1627225793943-3442571a325a',
      'https://images.unsplash.com/photo-1543351368-361947a7d3cf'
    ],
    sports: [mockSports.find(s => s.id === 'sport-1')!, mockSports.find(s => s.id === 'sport-2')!],
    sportPrices: [
        { sportId: 'sport-1', pricePerHour: 2500 },
        { sportId: 'sport-2', pricePerHour: 2200 },
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
    name: 'Metropolis Tennis Club',
    type: 'Court',
    address: '456 Ace Avenue, Metropolis, ST 12345',
    city: 'Metropolis',
    location: 'Uptown',
    description: 'Premier outdoor clay courts with a serene ambiance. Join our community of passionate tennis players.',
    images: [
      'https://images.unsplash.com/photo-1554062614-6da4fa674b73',
      'https://images.unsplash.com/photo-1596704179737-93b9576332a6'
    ],
    sports: [mockSports.find(s => s.id === 'sport-3')!],
    sportPrices: [ { sportId: 'sport-3', pricePerHour: 1800 } ],
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
    name: 'Riverside Cricket Ground',
    type: 'Field',
    address: '789 Boundary Rd, Metropolis, ST 12345',
    city: 'Metropolis',
    location: 'Riverside',
    description: 'A lush, expansive cricket field perfect for corporate matches and weekend games. Well-maintained pitch.',
    images: [
      'https://images.unsplash.com/photo-1593341646782-e0b495cffc25'
    ],
    sports: [mockSports.find(s => s.id === 'sport-13')!],
    sportPrices: [ { sportId: 'sport-13', pricePerHour: 3000 } ],
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
    name: 'The Swim & Gym Hub',
    type: 'Complex',
    address: '101 Fitness Lane, Metropolis, ST 12345',
    city: 'Metropolis',
    location: 'Suburbia',
    description: 'A complete fitness destination with an olympic-sized swimming pool and a fully-equipped modern gymnasium.',
    images: [
      'https://images.unsplash.com/photo-1551604313-26835b334a81',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48'
    ],
    sports: [mockSports.find(s => s.id === 'sport-5')!, mockSports.find(s => s.id === 'sport-16')!],
    sportPrices: [
        { sportId: 'sport-5', pricePerHour: 800 },
        { sportId: 'sport-16', pricePerHour: 500 },
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
    address: '246 Shuttlecock Street, Metropolis, ST 12345',
    city: 'Metropolis',
    location: 'Eastside',
    description: 'Indoor badminton arena with professional-grade courts and excellent lighting.',
    images: ['https://images.unsplash.com/photo-1620241422329-195c6450a803'],
    sports: [mockSports.find(s => s.id === 'sport-4')!],
    sportPrices: [{ sportId: 'sport-4', pricePerHour: 1200 }],
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
    address: '77 Harmony Plaza, Metropolis, ST 12345',
    city: 'Metropolis',
    location: 'Arts District',
    description: 'A tranquil space for yoga, meditation, and various dance forms. Embrace your inner peace and rhythm.',
    images: ['https://images.unsplash.com/photo-1599447462464-a393d5a18b87'],
    sports: [mockSports.find(s => s.id === 'sport-6')!, mockSports.find(s => s.id === 'sport-8')!],
    sportPrices: [{ sportId: 'sport-6', pricePerHour: 900 }, { sportId: 'sport-8', pricePerHour: 1100 }],
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
    address: '88 Industrial Way, Metropolis, ST 12345',
    city: 'Metropolis',
    location: 'Industrial Park',
    description: 'Fast-paced box cricket and futsal action. Perfect for a quick, high-energy game with friends.',
    images: ['https://images.unsplash.com/photo-1618293153926-6556b6c31d58'],
    sports: [mockSports.find(s => s.id === 'sport-13')!, mockSports.find(s => s.id === 'sport-1')!],
    sportPrices: [{ sportId: 'sport-13', pricePerHour: 2000 }, { sportId: 'sport-1', pricePerHour: 1800 }],
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
    address: '1 Tech Tower, Metropolis, ST 12345',
    city: 'Metropolis',
    location: 'Tech Hub',
    description: 'High-end PC and console gaming lounge with the latest titles and fastest internet. Fuel your competitive spirit.',
    images: ['https://images.unsplash.com/photo-1550745165-9bc0b252726a'],
    sports: [mockSports.find(s => s.id === 'sport-15')!],
    sportPrices: [{ sportId: 'sport-15', pricePerHour: 400 }],
    amenities: [mockAmenities.find(a => a.id === 'amenity-2')!, mockAmenities.find(a => a.id === 'amenity-6')!],
    operatingHours: defaultOperatingHours,
    rating: 4.8,
    isPopular: true,
    isIndoor: true,
    dataAiHint: 'gaming lounge',
  }
];


let mockFacilities: Facility[] = [...staticFacilities];
let mockUsers: UserProfile[] = [...staticUsers];
let mockBookings: Booking[] = [];
let mockReviews: Review[] = [];
let mockTeams: Team[] = [];
let mockAppNotifications: AppNotification[] = [];
let mockBlogPosts: BlogPost[] = [];
let mockEvents: SportEvent[] = [];
let mockPricingRules: PricingRule[] = [];
let mockPromotionRules: PromotionRule[] = [];
let mockSiteSettings: SiteSettings = { siteName: 'Sports Arena', defaultCurrency: 'INR', timezone: 'Asia/Kolkata', maintenanceMode: false, notificationTemplates: [] };
let mockWaitlist: WaitlistEntry[] = [];
let mockLfgRequests: LfgRequest[] = [];
let mockChallenges: Challenge[] = [];


// This is the static default user.
export let mockUser: UserProfile = staticUsers.find(u => u.role === 'Admin')!;

// This function allows other components (like the UserSwitcher) to change the active user.
export const setActiveMockUser = (role: 'admin' | 'owner' | 'user') => {
  const newUser = staticUsers.find(u => u.role.toLowerCase() === role);
  if (newUser) {
    mockUser = newUser;
  }
};


// --- DATA ACCESS FUNCTIONS (MOCK IMPLEMENTATION) ---

// NO-OP since we are not using database listeners anymore
export function listenToCollection<T>(
  collectionName: string,
  callback: (data: T[]) => void,
  onError: (error: Error) => void
) {
  return () => {};
}

// Polling for user bookings to simulate real-time updates
export function listenToUserBookings(
    userId: string, 
    callback: (bookings: Booking[]) => void, 
    onError: (error: Error) => void
): () => void {
    let isCancelled = false;

    const fetchAndPoll = async () => {
        if (isCancelled) return;
        try {
            const bookings = await getBookingsByUserId(userId);
            if (!isCancelled) {
                callback(bookings);
            }
        } catch (err) {
            if (!isCancelled) {
                onError(err as Error);
            }
        } finally {
            if (!isCancelled) {
                setTimeout(fetchAndPoll, 5000); // Poll every 5 seconds
            }
        }
    };

    fetchAndPoll(); // Initial fetch

    return () => {
        isCancelled = true;
    };
}


export const getAllFacilities = async (): Promise<Facility[]> => {
    return Promise.resolve(mockFacilities);
};

export const getAllUsers = async (): Promise<UserProfile[]> => {
    return Promise.resolve(mockUsers);
};

export const getUserById = (userId: string): UserProfile | undefined => {
    if (!userId) return undefined;
    return mockUsers.find(user => user.id === userId);
};


export const getFacilityById = async (id: string): Promise<Facility | undefined> => {
    return Promise.resolve(mockFacilities.find(f => f.id === id));
};

export const getFacilitiesByIds = async (ids: string[]): Promise<Facility[]> => {
    if (!ids || ids.length === 0) return Promise.resolve([]);
    const facilities = mockFacilities.filter(f => ids.includes(f.id));
    return Promise.resolve(facilities);
};

export const addFacility = async (facilityData: Omit<Facility, 'id'>): Promise<Facility> => {
    const newFacility: Facility = {
        ...facilityData,
        id: `facility-${Date.now()}-${Math.random()}`
    };
    mockFacilities.push(newFacility);
    return Promise.resolve(newFacility);
};

export const updateFacility = async (facilityData: Facility): Promise<Facility> => {
    const index = mockFacilities.findIndex(f => f.id === facilityData.id);
    if (index !== -1) {
        mockFacilities[index] = facilityData;
        return Promise.resolve(mockFacilities[index]);
    }
    throw new Error("Facility not found for update");
};

export const deleteFacility = async (facilityId: string): Promise<void> => {
    mockFacilities = mockFacilities.filter(f => f.id !== facilityId);
    return Promise.resolve();
};

export const getBookingById = async (id: string): Promise<Booking | undefined> => {
    return Promise.resolve(mockBookings.find(b => b.id === id));
};

export const addBooking = async (bookingData: Omit<Booking, 'id' | 'bookedAt'>): Promise<Booking> => {
    const newBooking: Booking = {
        ...bookingData,
        id: `booking-${Date.now()}`,
        bookedAt: new Date().toISOString()
    };
    mockBookings.push(newBooking);
    return Promise.resolve(newBooking);
};

export const updateBooking = async (bookingId: string, updates: Partial<Booking>): Promise<Booking | undefined> => {
    const bookingIndex = mockBookings.findIndex(b => b.id === bookingId);
    if (bookingIndex > -1) {
        mockBookings[bookingIndex] = { ...mockBookings[bookingIndex], ...updates };
        return Promise.resolve(mockBookings[bookingIndex]);
    }
    return Promise.resolve(undefined);
};

export const updateUser = (userId: string, updates: Partial<UserProfile>): UserProfile | undefined => {
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
        mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };
        
        // Also update the active user if it's the one being changed
        if (mockUser.id === userId) {
            mockUser = mockUsers[userIndex];
        }
        return mockUsers[userIndex];
    }
    return undefined;
};


export const getBookingsForFacilityOnDate = async (facilityId: string, date: string): Promise<Booking[]> => {
    const bookings = mockBookings.filter(b => b.facilityId === facilityId && b.date === date && (b.status === 'Confirmed' || b.status === 'Pending'));
    return Promise.resolve(bookings);
};

export const getBookingsByUserId = async (userId: string): Promise<Booking[]> => {
    const bookings = mockBookings.filter(b => b.userId === userId);
    return Promise.resolve(bookings);
};

// --- STATIC/MOCK GETTERS ---
export const getSportById = (id: string): Sport | undefined => mockSports.find(s => s.id === id);
export const getSiteSettings = (): SiteSettings => mockSiteSettings;

export const getFacilitiesByOwnerId = async (ownerId: string): Promise<Facility[]> => {
    const facilities = mockFacilities.filter(f => f.ownerId === ownerId);
    return Promise.resolve(facilities);
};

export const calculateAverageRating = (reviews: Review[] | undefined): number => {
  if (!reviews || reviews.length === 0) {
    return 0;
  }
  const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
  return parseFloat((totalRating / reviews.length).toFixed(1));
};

export const getReviewsByFacilityId = (facilityId: string): Review[] => mockReviews.filter(review => review.facilityId === facilityId);
export const getTeamById = (teamId: string): Team | undefined => mockTeams.find(team => team.id === teamId);
export const getTeamsByUserId = (userId: string): Team[] => mockTeams.filter(team => team.memberIds.includes(userId));
export const getNotificationsForUser = (userId: string): AppNotification[] => mockAppNotifications.filter(n => n.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
export const getAllBlogPosts = (): BlogPost[] => mockBlogPosts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
export const getBlogPostBySlug = (slug: string): BlogPost | undefined => mockBlogPosts.find(post => post.slug === slug);
export const getAllEvents = async (): Promise<SportEvent[]> => Promise.resolve(mockEvents);
export const getEventById = async (id: string): Promise<SportEvent | undefined> => Promise.resolve(mockEvents.find(e => e.id === id));
export const getAllPricingRules = (): PricingRule[] => [...mockPricingRules];
export const getPricingRuleById = (id: string): PricingRule | undefined => mockPricingRules.find(rule => rule.id === rule.id);
export const getAllPromotionRules = (): PromotionRule[] => [...mockPromotionRules].sort((a, b) => a.name.localeCompare(b.name));
export const getPromotionRuleById = (id: string): PromotionRule | undefined => mockPromotionRules.find(r => r.id === r.id);
export const isUserOnWaitlist = (userId: string, facilityId: string, date: string, startTime: string): boolean => {
    if(!mockUser) return false;
    return mockWaitlist.some(entry => entry.userId === userId && entry.facilityId === facilityId && entry.date === date && entry.startTime === startTime);
}
export const getOpenLfgRequests = (): LfgRequest[] => mockLfgRequests.filter(req => req.status === 'open').sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
export const getAllBookings = async (): Promise<Booking[]> => Promise.resolve(mockBookings);

export const addNotification = (userId: string, notificationData: Omit<AppNotification, 'id' | 'userId' | 'createdAt' | 'isRead'>): AppNotification => {
  let iconName = 'Info';
  switch (notificationData.type) { case 'booking_confirmed': iconName = 'CheckCircle'; break; case 'booking_cancelled': iconName = 'XCircle'; break; case 'review_submitted': iconName = 'MessageSquareText'; break; case 'reminder': iconName = 'CalendarDays'; break; case 'promotion': iconName = 'Gift'; break; case 'waitlist_opening': iconName = 'BellRing'; break; case 'user_status_changed': iconName = 'Edit3'; break; case 'matchmaking_interest': iconName = 'Swords'; break; }
  const newNotification: AppNotification = { ...notificationData, id: `notif-${Date.now()}`, userId, createdAt: new Date().toISOString(), isRead: false, iconName: notificationData.iconName || iconName, };
  mockAppNotifications.unshift(newNotification);
  return newNotification;
};

export const updateSiteSettings = (updates: Partial<SiteSettings>): SiteSettings => {
    mockSiteSettings = { ...mockSiteSettings, ...updates };
    return mockSiteSettings;
};
export const createTeam = (teamData: { name: string; sportId: string; captainId: string }): Team => {
  const sport = getSportById(teamData.sportId);
  if (!sport) throw new Error('Sport not found');
  const newTeam: Team = { id: `team-${Date.now()}`, name: teamData.name, sport, captainId: teamData.captainId, memberIds: [teamData.captainId] };
  mockTeams.push(newTeam);
  updateUser(teamData.captainId, { teamIds: [...(mockUser.teamIds || []), newTeam.id] });
  return newTeam;
};
export const leaveTeam = (teamId: string, userId: string): boolean => {
  const teamIndex = mockTeams.findIndex(t => t.id === teamId);
  if (teamIndex === -1) throw new Error("Team not found.");
  const team = mockTeams[teamIndex];
  if (!team.memberIds.includes(userId)) throw new Error("User is not a member of this team.");
  if (team.captainId === userId && team.memberIds.length > 1) {
    throw new Error("Captain cannot leave a team with other members. Please transfer captaincy first.");
  }
  
  if (team.captainId === userId && team.memberIds.length === 1) {
      mockTeams.splice(teamIndex, 1);
  } else {
      team.memberIds = team.memberIds.filter(id => id !== userId);
  }
  
  updateUser(userId, { teamIds: mockUser.teamIds?.filter(id => id !== teamId) });
  return true;
};

export const removeUserFromTeam = (teamId: string, memberIdToRemove: string, captainId: string): void => {
    const team = mockTeams.find(t => t.id === teamId);
    if (!team) throw new Error("Team not found.");
    if (team.captainId !== captainId) throw new Error("Only the team captain can remove members.");
    if (memberIdToRemove === captainId) throw new Error("Captain cannot remove themselves.");
    
    team.memberIds = team.memberIds.filter(id => id !== memberIdToRemove);
    const userToRemove = getUserById(memberIdToRemove);
    if (userToRemove) {
      updateUser(memberIdToRemove, { teamIds: userToRemove.teamIds?.filter(id => id !== teamId) });
    }
};

export const transferCaptaincy = (teamId: string, newCaptainId: string, oldCaptainId: string): void => {
    const team = mockTeams.find(t => t.id === teamId);
    if (!team) throw new Error("Team not found.");
    if (team.captainId !== oldCaptainId) throw new Error("Only the current captain can transfer captaincy.");
    if (!team.memberIds.includes(newCaptainId)) throw new Error("The new captain must be a member of the team.");
    
    team.captainId = newCaptainId;
};

export const deleteTeam = (teamId: string, captainId: string): void => {
    const teamIndex = mockTeams.findIndex(t => t.id === teamId);
    if (teamIndex === -1) throw new Error("Team not found.");
    const team = mockTeams[teamIndex];
    if (team.captainId !== captainId) throw new Error("Only the team captain can disband the team.");
    
    team.memberIds.forEach(memberId => {
        const user = getUserById(memberId);
        if (user) {
          updateUser(memberId, { teamIds: user.teamIds?.filter(id => id !== teamId) });
        }
    });

    mockTeams.splice(teamIndex, 1);
};


export const markNotificationAsRead = (userId: string, notificationId: string): void => { const notification = mockAppNotifications.find(n => n.id === notificationId && n.userId === userId); if (notification) notification.isRead = true; };
export const markAllNotificationsAsRead = (userId: string): void => { mockAppNotifications.forEach(n => { if (n.userId === userId) n.isRead = true; }); };
export const calculateDynamicPrice = ( basePricePerHour: number, selectedDate: Date, selectedSlot: TimeSlot, durationHours: number ): { finalPrice: number; appliedRuleName?: string, appliedRuleDetails?: PricingRule } => ({ finalPrice: basePricePerHour * durationHours });
export const addReview = async (reviewData: Omit<Review, 'id' | 'createdAt' | 'userName' | 'userAvatar'>): Promise<Review> => {
  const currentUser = getUserById(reviewData.userId);
  const newReview: Review = { ...reviewData, id: `review-${Date.now()}`, userName: currentUser?.name || 'Anonymous User', userAvatar: currentUser?.profilePictureUrl, isPublicProfile: currentUser?.isProfilePublic || false, createdAt: new Date().toISOString() };
  mockReviews.push(newReview);
  
  const facility = await getFacilityById(reviewData.facilityId);
  if (facility) {
    const reviews = [...(facility.reviews || []), newReview];
    const newRating = calculateAverageRating(reviews);
    await updateFacility({ ...facility, reviews, rating: newRating });
  }

  return newReview;
};

export const createLfgRequest = (requestData: Omit<LfgRequest, 'id' | 'createdAt' | 'status' | 'interestedUserIds'>): LfgRequest[] => {
    const newRequest: LfgRequest = { ...requestData, id: `lfg-${Date.now()}`, createdAt: new Date().toISOString(), status: 'open', interestedUserIds: [] };
    mockLfgRequests.unshift(newRequest);
    return getOpenLfgRequests();
};

export const expressInterestInLfg = (lfgId: string, userId: string): LfgRequest[] => {
    const request = mockLfgRequests.find(r => r.id === lfgId);
    if (request && !request.interestedUserIds.includes(userId) && request.userId !== userId) {
        request.interestedUserIds.push(userId);
    }
    return getOpenLfgRequests();
};

export const getOpenChallenges = (): Challenge[] => {
    return mockChallenges.filter(c => c.status === 'open').sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const createChallenge = (data: { challengerId: string; sportId: string; proposedDate: string; notes: string }): Challenge[] => {
    const challenger = getUserById(data.challengerId);
    const sport = getSportById(data.sportId);

    if (!challenger || !sport) {
        throw new Error("Invalid challenger or sport ID");
    }

    const newChallenge: Challenge = {
        id: `challenge-${Date.now()}`,
        challengerId: data.challengerId,
        challenger,
        sport,
        proposedDate: new Date(data.proposedDate).toISOString(),
        notes: data.notes,
        status: 'open',
        createdAt: new Date().toISOString(),
    };
    mockChallenges.unshift(newChallenge);
    return getOpenChallenges();
};

export const acceptChallenge = (challengeId: string, opponentId: string): Challenge[] => {
    const challenge = mockChallenges.find(c => c.id === challengeId);
    const opponent = getUserById(opponentId);

    if (challenge && opponent && challenge.status === 'open' && challenge.challengerId !== opponentId) {
        challenge.status = 'accepted';
        challenge.opponentId = opponentId;
        challenge.opponent = opponent;
        
        addNotification(challenge.challengerId, {
            type: 'general',
            title: 'Challenge Accepted!',
            message: `${opponent.name} has accepted your ${challenge.sport.name} challenge.`,
            link: '/challenges',
            iconName: 'Swords'
        });
    } else {
        throw new Error("Failed to accept challenge. It might already be taken or you cannot accept your own challenge.");
    }
    return getOpenChallenges();
};


export const addMembershipPlan = (plan: Omit<MembershipPlan, 'id'>): void => {
    console.log("Adding mock membership plan. This is not persisted.", plan);
};
export const updateMembershipPlan = (plan: MembershipPlan): void => {
    console.log("Updating mock membership plan. This is not persisted.", plan);
};
export const deleteMembershipPlan = (id: string): void => {
    console.log("Deleting mock membership plan. This is not persisted.", id);
};
export const addEvent = async (event: Omit<SportEvent, 'id' | 'sport' | 'registeredParticipants'> & { sportId: string }): Promise<void> => { 
    const sport = getSportById(event.sportId); 
    const facility = await getFacilityById(event.facilityId);
    if(sport && facility) {
        const newEvent: SportEvent = { 
            ...event, 
            id: `evt-${Date.now()}`, 
            sport, 
            registeredParticipants: 0, 
            facilityName: facility.name 
        };
        mockEvents.push(newEvent);
    } else {
        console.error("Could not create event: Sport or Facility not found.");
    }
};
export const updateEvent = async (eventData: Omit<SportEvent, 'sport'> & { sportId: string }): Promise<void> => {
    const index = mockEvents.findIndex(e => e.id === eventData.id);
    if (index !== -1) {
        const sport = getSportById(eventData.sportId);
        if (!sport) {
            console.error(`Could not update event: Sport with id ${eventData.sportId} not found.`);
            return;
        }
        mockEvents[index] = { ...mockEvents[index], ...eventData, sport: sport };
    }
};
export const deleteEvent = (id: string): void => { mockEvents = mockEvents.filter(e => e.id !== id); };
export const registerForEvent = (eventId: string): boolean => { const event = mockEvents.find(e => e.id === eventId); if (event && (!event.maxParticipants || event.registeredParticipants < event.maxParticipants)) { event.registeredParticipants++; return true; } return false; };
export const addPricingRule = (rule: Omit<PricingRule, 'id'>): void => { mockPricingRules.push({ ...rule, id: `pr-${Date.now()}` }); };
export const updatePricingRule = (rule: PricingRule): void => { const index = mockPricingRules.findIndex(r => r.id === rule.id); if (index !== -1) mockPricingRules[index] = rule; };
export const deletePricingRule = (id: string): void => { mockPricingRules = mockPricingRules.filter(r => r.id !== id); };
export const addPromotionRule = (rule: Omit<PromotionRule, 'id'>): void => { mockPromotionRules.push({ ...rule, id: `promo-${Date.now()}` }); };
export const updatePromotionRule = (rule: PromotionRule): void => { const index = mockPromotionRules.findIndex(r => r.id === rule.id); if (index !== -1) mockPromotionRules[index] = rule; };
export const getPromotionRuleByCode = async (code: string): Promise<PromotionRule | undefined> => Promise.resolve(mockPromotionRules.find(p => p.code?.toUpperCase() === code.toUpperCase() && p.isActive));
export const addToWaitlist = async (userId: string, facilityId: string, date: string, startTime: string): Promise<void> => { const entry: WaitlistEntry = { id: `wait-${Date.now()}`, userId, facilityId, date, startTime, createdAt: new Date().toISOString() }; mockWaitlist.push(entry); };
export async function listenToOwnerBookings(ownerId: string, callback: (bookings: Booking[]) => void, onError: (error: Error) => void): Promise<() => void> {
    const facilities = await getFacilitiesByOwnerId(ownerId);
    const facilityIds = facilities.map(f => f.id);

    if (facilityIds.length === 0) {
        callback([]);
        return () => {};
    }
    const ownerBookings = mockBookings.filter(b => facilityIds.includes(b.facilityId));
    callback(ownerBookings);

    return () => {};
}
export const blockTimeSlot = async (facilityId: string, ownerId: string, newBlock: BlockedSlot): Promise<boolean> => {
   const facility = mockFacilities.find(f => f.id === facilityId && f.ownerId === ownerId);
   if (facility) {
       if (!facility.blockedSlots) {
           facility.blockedSlots = [];
       }
       facility.blockedSlots.push(newBlock);
       return true;
   }
   return false;
};

export const unblockTimeSlot = async (facilityId: string, ownerId: string, date: string, startTime: string): Promise<boolean> => {
    const facility = mockFacilities.find(f => f.id === facilityId && f.ownerId === ownerId);
    if (facility && facility.blockedSlots) {
        const initialLength = facility.blockedSlots.length;
        facility.blockedSlots = facility.blockedSlots.filter(s => !(s.date === date && s.startTime === startTime));
        return facility.blockedSlots.length < initialLength;
    }
    return false;
};

export const getMembershipPlanById = async (id: string): Promise<MembershipPlan | undefined> => {
    return Promise.resolve(mockStaticMembershipPlans.find(p => p.id === id));
};

export const getAllMembershipPlans = async (): Promise<MembershipPlan[]> => {
    return Promise.resolve(mockStaticMembershipPlans);
}

export const listenToAllEvents = (
  callback: (events: SportEvent[]) => void,
  onError: (error: Error) => void
): (() => void) => {
    const interval = setInterval(() => {
        try {
            callback(mockEvents);
        } catch(e) {
            onError(e as Error);
        }
    }, 5000); // Poll every 5 seconds
    
    // initial call
    callback(mockEvents);

    return () => clearInterval(interval);
};


export const listenToAllMembershipPlans = (
  callback: (plans: MembershipPlan[]) => void,
  onError: (error: Error) => void
): (() => void) => {
    const interval = setInterval(() => {
        try {
            callback(mockStaticMembershipPlans);
        } catch(e) {
            onError(e as Error);
        }
    }, 5000); // Poll every 5 seconds
    
    // initial call
    callback(mockStaticMembershipPlans);

    return () => clearInterval(interval);
};

export const listenToAllPricingRules = (
  callback: (rules: PricingRule[]) => void,
  onError: (error: Error) => void
): (() => void) => {
    const interval = setInterval(() => {
        try {
            callback(mockPricingRules);
        } catch(e) {
            onError(e as Error);
        }
    }, 5000); // Poll every 5 seconds
    
    // initial call
    callback(mockPricingRules);

    return () => clearInterval(interval);
};

export const deletePromotionRule = (id: string): void => {
    mockPromotionRules = mockPromotionRules.filter(p => p.id !== id);
}


export const listenToAllPromotionRules = (
  callback: (rules: PromotionRule[]) => void,
  onError: (error: Error) => void
): (() => void) => {
    const interval = setInterval(() => {
        try {
            callback(mockPromotionRules);
        } catch(e) {
            onError(e as Error);
        }
    }, 5000); // Poll every 5 seconds
    
    // initial call
    callback(mockPromotionRules);

    return () => clearInterval(interval);
};

    

    