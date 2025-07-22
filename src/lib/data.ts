

import type { Facility, Sport, Amenity, UserProfile, UserRole, UserStatus, Booking, ReportData, MembershipPlan, SportEvent, Review, AppNotification, NotificationType, BlogPost, PricingRule, PromotionRule, RentalEquipment, RentedItemInfo, AppliedPromotionInfo, TimeSlot, UserSkill, SkillLevel, BlockedSlot, SiteSettings, Team, WaitlistEntry, LfgRequest, SportPrice, NotificationTemplate, Challenge } from './types';
import { ParkingCircle, Wifi, ShowerHead, Lock, Dumbbell, Zap, Users, Trophy, Award, CalendarDays as LucideCalendarDays, Utensils, Star, LocateFixed, Clock, DollarSign, Goal, Bike, Dices, Swords, Music, Tent, Drama, MapPin, Heart, Dribbble, Activity, Feather, CheckCircle, XCircle, MessageSquareText, Info, Gift, Edit3, PackageSearch, Shirt, Disc, Medal, Gem, Rocket, Gamepad2, MonitorPlay, Target, Drum, Guitar, Brain, Camera, PersonStanding, Building, HandCoins, Palette, Group, BikeIcon, DramaIcon, Film, Gamepad, GuitarIcon, Landmark, Lightbulb, MountainSnow, Pizza, ShoppingBag, VenetianMask, Warehouse, Weight, Wind, WrapText, Speech, HistoryIcon, BarChartIcon, UserCheck, UserX, Building2, BellRing } from 'lucide-react';
import { parseISO, isWithinInterval, isAfter, isBefore, startOfDay, endOfDay, getDay, subDays, getMonth, getYear, format as formatDateFns } from 'date-fns';
import { db } from './db';


// --- MOCK DATA (for non-facility types, to be migrated later) ---
export const mockSports: Sport[] = [
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

export const mockAmenities: Amenity[] = [
  { id: 'amenity-1', name: 'Parking', iconName: 'ParkingCircle' },
  { id: 'amenity-2', name: 'WiFi', iconName: 'Wifi' },
  { id: 'amenity-3', name: 'Showers', iconName: 'ShowerHead' },
  { id: 'amenity-4', name: 'Lockers', iconName: 'Lock' },
  { id: 'amenity-5', name: 'Equipment Rental Signage', iconName: 'PackageSearch' },
  { id: 'amenity-6', name: 'Cafe', iconName: 'Utensils' },
  { id: 'amenity-7', name: 'Accessible', iconName: 'Users' },
];

// Define a set of mock users with different roles
const allMockUsers = {
  admin: { 
    id: 'user-admin-kirtan', 
    name: 'Kirtan Shah', 
    email: 'kirtan.shah@example.com', 
    role: 'Admin' as UserRole, 
    status: 'Active' as UserStatus,
    joinedAt: new Date().toISOString(), 
    loyaltyPoints: 1250, 
    profilePictureUrl: 'https://randomuser.me/api/portraits/men/75.jpg', 
    dataAiHint: 'man smiling' 
  },
  owner: { 
    id: 'user-owner-dana', 
    name: 'Dana White', 
    email: 'dana.white@example.com', 
    role: 'FacilityOwner' as UserRole, 
    status: 'Active' as UserStatus,
    joinedAt: new Date().toISOString(), 
    loyaltyPoints: 450, 
    profilePictureUrl: 'https://randomuser.me/api/portraits/women/68.jpg', 
    dataAiHint: 'woman portrait'
  },
  user: {
    id: 'user-regular-charlie',
    name: 'Charlie Davis',
    email: 'charlie.davis@example.com',
    role: 'User' as UserRole,
    status: 'Active' as UserStatus,
    joinedAt: new Date().toISOString(),
    loyaltyPoints: 800,
    profilePictureUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    dataAiHint: 'man glasses'
  }
};


// This is the static default user. It's guaranteed to be available on app load.
export let mockUser: UserProfile = allMockUsers.admin;

// This function allows other components (like the UserSwitcher) to change the active user.
export const setActiveMockUser = (role: 'admin' | 'owner' | 'user') => {
  mockUser = allMockUsers[role];
  // In a real app with state management, you'd dispatch an action here
  // to notify the whole app of the user change. For now, a page refresh
  // might be needed for all components to pick up the new user.
};


// These arrays are for non-Firestore managed data or for temporary client-side operations.
// They no longer hold primary data for users, bookings, etc.
export let mockReviews: Review[] = [];
export const mockAchievements: Achievement[] = [];
export let mockTeams: Team[] = [];
let mockAppNotifications: AppNotification[] = [];
export const mockBlogPosts: BlogPost[] = [];
export let mockMembershipPlans: MembershipPlan[] = [];
export let mockEvents: SportEvent[] = [];
export let mockPricingRules: PricingRule[] = [];
export let mockPromotionRules: PromotionRule[] = [];
let defaultNotificationTemplates: NotificationTemplate[] = [
    { type: 'booking_confirmed', label: 'Booking Confirmed', description: 'Sent to user on successful booking.', emailEnabled: true, smsEnabled: false, emailSubject: 'Booking Confirmed: {{facilityName}}', emailBody: 'Hi {{userName}},\n\nYour booking for {{facilityName}} on {{date}} at {{time}} is confirmed.\n\nThank you!', smsBody: 'Booking confirmed for {{facilityName}} on {{date}}. Ref: {{bookingId}}' },
    { type: 'booking_cancelled', label: 'Booking Cancelled', description: 'Sent when a user or admin cancels a booking.', emailEnabled: true, smsEnabled: false, emailSubject: 'Booking Cancelled: {{facilityName}}', emailBody: 'Hi {{userName}},\n\nYour booking for {{facilityName}} on {{date}} at {{time}} has been cancelled.\n\nThank you!', smsBody: 'Booking for {{facilityName}} on {{date}} was cancelled.' },
    { type: 'reminder', label: 'Booking Reminder', description: 'Sent to user 24 hours before a booking.', emailEnabled: true, smsEnabled: true, emailSubject: 'Reminder: Your booking at {{facilityName}} is tomorrow', emailBody: 'Hi {{userName}},\n\nThis is a reminder for your booking at {{facilityName}} tomorrow, {{date}} at {{time}}.', smsBody: 'Reminder: Booking at {{facilityName}} tomorrow, {{date}} at {{time}}.' },
    { type: 'waitlist_opening', label: 'Waitlist Opening', description: 'Sent to waitlisted users when a slot opens up.', emailEnabled: true, smsEnabled: true, emailSubject: 'A slot has opened up at {{facilityName}}!', emailBody: 'Good news, {{userName}}! The slot you wanted at {{facilityName}} for {{date}} at {{time}} is now available. Book now before it\'s gone!', smsBody: 'Slot open at {{facilityName}} for {{date}} at {{time}}. Book now!' },
    { type: 'matchmaking_interest', label: 'Matchmaking Interest', description: 'Sent to a post creator when someone is interested.', emailEnabled: true, smsEnabled: false, emailSubject: 'Someone is interested in your game!', emailBody: 'Hi {{userName}},\n\nSomeone has expressed interest in your post about finding a game. Log in to connect with them!', smsBody: 'Someone is interested in your game post on Sports Arena!' },
    { type: 'user_status_changed', label: 'User Status Changed', description: 'Sent to a user when an admin changes their account status.', emailEnabled: true, smsEnabled: false, emailSubject: 'Your account status has been updated', emailBody: 'Hi {{userName}},\n\nAn administrator has updated your account status. Please log in to see the details.', smsBody: 'Your Sports Arena account status has been updated by an admin.' },
];
let mockSiteSettings: SiteSettings = { siteName: 'Sports Arena', defaultCurrency: 'INR', timezone: 'Asia/Kolkata', maintenanceMode: false, notificationTemplates: defaultNotificationTemplates };
let mockWaitlist: WaitlistEntry[] = [];
let mockLfgRequests: LfgRequest[] = [];
let mockRentalEquipment: RentalEquipment[] = [];
export let mockChallenges: Challenge[] = [];
export let mockBookings: Booking[] = []; // This will be populated by Firestore listeners

// --- REAL-TIME LISTENERS (Primary way to get data) ---

// NO-OP since we are not using Firestore listeners anymore
export function listenToCollection<T>(
  collectionName: string,
  callback: (data: T[]) => void,
  onError: (error: Error) => void
) {
  // This function is now a no-op but kept for compatibility.
  return () => {};
}

export function listenToFacilities(callback: (facilities: Facility[]) => void, onError: (error: Error) => void) {
  // This function is now a no-op but kept for compatibility.
  return () => {};
}

export function listenToUserBookings(userId: string, callback: (bookings: Booking[]) => void, onError: (error: Error) => void) {
  // This function is now a no-op but kept for compatibility.
  return () => {};
}

export function listenToAllBookings(callback: (bookings: Booking[]) => void, onError: (error: Error) => void) {
  // This function is now a no-op but kept for compatibility.
  return () => {};
}

export function listenToAllUsers(callback: (users: UserProfile[]) => void, onError: (error: Error) => void) {
    // This function is now a no-op but kept for compatibility.
    return () => {};
}

// --- Direct Fetch Functions (for specific, non-listening needs) ---
export const getAllFacilities = async (): Promise<Facility[]> => {
    try {
        const res = await db.query('SELECT * FROM facilities');
        return res.rows;
    } catch (error) {
        console.error("Error fetching facilities: ", error);
        return [];
    }
};

export const getAllUsers = async (): Promise<UserProfile[]> => {
    try {
        const res = await db.query('SELECT * FROM users');
        return res.rows;
    } catch (error) {
        console.error("Error fetching users: ", error);
        return [];
    }
};

export const getUserById = async (userId: string): Promise<UserProfile | undefined> => {
    if (!userId) return undefined;
    try {
        const res = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
        return res.rows[0];
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        return undefined;
    }
};

export const getFacilityById = async (id: string): Promise<Facility | undefined> => {
     try {
        const facilityRes = await db.query('SELECT * FROM facilities WHERE id = $1', [id]);
        if (facilityRes.rows.length === 0) return undefined;

        const facility = facilityRes.rows[0];

        // Enrich sports and amenities
        const sportsRes = await db.query('SELECT s.* FROM sports s JOIN facility_sports fs ON s.id = fs.sport_id WHERE fs.facility_id = $1', [id]);
        facility.sports = sportsRes.rows;

        const amenitiesRes = await db.query('SELECT a.* FROM amenities a JOIN facility_amenities fa ON a.id = fa.amenity_id WHERE fa.facility_id = $1', [id]);
        facility.amenities = amenitiesRes.rows;
        
        // Assume sport_prices, operating_hours, etc are stored as JSONB in the facilities table for simplicity in this migration
        // In a fully relational model, these would be separate tables to join.

        return facility;
    } catch (error) {
        console.error("Error fetching facility by ID: ", error);
        return undefined;
    }
};

export const getFacilitiesByIds = async (ids: string[]): Promise<Facility[]> => {
    if (!ids || ids.length === 0) return [];
    try {
        const res = await db.query('SELECT * FROM facilities WHERE id = ANY($1::text[])', [ids]);
        return res.rows;
    } catch (error) {
        console.error("Error fetching facilities by IDs: ", error);
        return [];
    }
};

export const addFacility = async (facilityData: Omit<Facility, 'id'>): Promise<Facility> => {
    // This is a complex transaction in SQL and is simplified here.
    // In a real app, you would use a transaction to insert into facilities, facility_sports, and facility_amenities.
    console.warn("addFacility is simplified and does not handle sport/amenity relations.");
    const { name, type, address, city, location, description, images, sportPrices, rating, capacity, isPopular, isIndoor, dataAiHint, ownerId } = facilityData;
    const res = await db.query(
        'INSERT INTO facilities (name, type, address, city, location, description, images, sport_prices, rating, capacity, is_popular, is_indoor, data_ai_hint, owner_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *',
        [name, type, address, city, location, description, images, JSON.stringify(sportPrices), rating, capacity, isPopular, isIndoor, dataAiHint, ownerId]
    );
    return res.rows[0];
};

export const updateFacility = async (updatedFacilityData: Facility): Promise<Facility> => {
    console.warn("updateFacility is simplified and does not handle sport/amenity relations.");
    const { id, name, type, address, city, location, description, images, sportPrices, rating, capacity, isPopular, isIndoor, dataAiHint } = updatedFacilityData;
    const res = await db.query(
        'UPDATE facilities SET name = $1, type = $2, address = $3, city = $4, location = $5, description = $6, images = $7, sport_prices = $8, rating = $9, capacity = $10, is_popular = $11, is_indoor = $12, data_ai_hint = $13 WHERE id = $14 RETURNING *',
        [name, type, address, city, location, description, images, JSON.stringify(sportPrices), rating, capacity, isPopular, isIndoor, dataAiHint, id]
    );
    return res.rows[0];
};

export const deleteFacility = async (facilityId: string): Promise<void> => {
    await db.query('DELETE FROM facilities WHERE id = $1', [facilityId]);
};

export const getBookingById = async (id: string): Promise<Booking | undefined> => {
    try {
        const res = await db.query('SELECT * FROM bookings WHERE id = $1', [id]);
        return res.rows[0];
    } catch (error) {
        console.error("Error fetching booking by ID:", error);
        return undefined;
    }
};

export const addBooking = async (bookingData: Omit<Booking, 'id' | 'bookedAt'>): Promise<Booking> => {
    const { userId, facilityId, facilityName, facilityImage, dataAiHint, sportId, sportName, date, startTime, endTime, durationHours, numberOfGuests, baseFacilityPrice, equipmentRentalCost, appliedPromotion, totalPrice, status, reviewed, rentedEquipment } = bookingData;
    const res = await db.query(
        'INSERT INTO bookings (user_id, facility_id, facility_name, facility_image, data_ai_hint, sport_id, sport_name, date, start_time, end_time, duration_hours, number_of_guests, base_facility_price, equipment_rental_cost, applied_promotion, total_price, status, reviewed, rented_equipment) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19) RETURNING *',
        [userId, facilityId, facilityName, facilityImage, dataAiHint, sportId, sportName, date, startTime, endTime, durationHours, numberOfGuests, baseFacilityPrice, equipmentRentalCost, JSON.stringify(appliedPromotion), totalPrice, status, reviewed, JSON.stringify(rentedEquipment)]
    );
    return res.rows[0];
};

export const updateBooking = async (bookingId: string, updates: Partial<Booking>): Promise<Booking | undefined> => {
    // This is a simplified update. A real implementation would handle dynamic keys.
    const { date, startTime, endTime, totalPrice, status } = updates;
    const res = await db.query(
        'UPDATE bookings SET date = COALESCE($1, date), start_time = COALESCE($2, start_time), end_time = COALESCE($3, end_time), total_price = COALESCE($4, total_price), status = COALESCE($5, status) WHERE id = $6 RETURNING *',
        [date, startTime, endTime, totalPrice, status, bookingId]
    );
    return res.rows[0];
};

export const updateUser = async (userId: string, updates: Partial<UserProfile>): Promise<UserProfile | undefined> => {
    const { name, email, role, status, membershipLevel } = updates;
    const res = await db.query(
        'UPDATE users SET name = COALESCE($1, name), email = COALESCE($2, email), role = COALESCE($3, role), status = COALESCE($4, status), membership_level = COALESCE($5, membership_level) WHERE id = $6 RETURNING *',
        [name, email, role, status, membershipLevel, userId]
    );
    return res.rows[0];
};

export const getBookingsForFacilityOnDate = async (facilityId: string, date: string): Promise<Booking[]> => {
    const res = await db.query(
        `SELECT * FROM bookings WHERE facility_id = $1 AND date = $2 AND status IN ('Confirmed', 'Pending')`,
        [facilityId, date]
    );
    return res.rows;
};

// ... other functions ...

// --- STATIC/MOCK GETTERS (for data not in DB for this migration) ---
export const getSportById = (id: string): Sport | undefined => mockSports.find(s => s.id === id);
export const getAmenityById = (id: string): Amenity | undefined => mockAmenities.find(a => a.id === id);
export const getAllSports = (): Sport[] => mockSports;
export const getSiteSettings = (): SiteSettings => mockSiteSettings;
// ... all other mock-based functions

export const getFacilitiesByOwnerId = async (ownerId: string): Promise<Facility[]> => {
    const res = await db.query('SELECT * FROM facilities WHERE owner_id = $1', [ownerId]);
    return res.rows;
};

export const calculateAverageRating = (reviews: Review[] | undefined): number => {
  if (!reviews || reviews.length === 0) {
    return 0;
  }
  const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
  return parseFloat((totalRating / reviews.length).toFixed(1));
};

export const getReviewsByFacilityId = (facilityId: string): Review[] => mockReviews.filter(review => review.facilityId === facilityId);
export const getTeamById = (teamId: string): Team | undefined => mockTeams.find(team => team.id === team.id);
export const getTeamsByUserId = (userId: string): Team[] => mockTeams.filter(team => team.memberIds.includes(userId));
export const getRentalEquipmentById = (id: string): RentalEquipment | undefined => mockRentalEquipment.find(eq => eq.id === eq.id);
export const getNotificationsForUser = (userId: string): AppNotification[] => mockAppNotifications.filter(n => n.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
export const getAllBlogPosts = (): BlogPost[] => mockBlogPosts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
export const getBlogPostBySlug = (slug: string): BlogPost | undefined => mockBlogPosts.find(post => post.slug === slug);
export const getAllMembershipPlans = (): MembershipPlan[] => [...mockMembershipPlans];
export const getMembershipPlanById = (id: string): MembershipPlan | undefined => mockMembershipPlans.find(plan => plan.id === plan.id);
export const getAllEvents = (): SportEvent[] => [...mockEvents].sort((a,b) => parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime());
export const getEventById = async (id: string): Promise<SportEvent | undefined> => {
  const event = mockEvents.find(event => event.id === id);
  if (event) {
    const sport = getSportById(event.sport.id);
    const facility = await getFacilityById(event.facilityId);
    return sport && facility ? { ...event, sport, facilityName: facility.name } : { ...event };
  }
  return undefined;
};
export const getAllPricingRules = (): PricingRule[] => [...mockPricingRules];
export const getPricingRuleById = (id: string): PricingRule | undefined => mockPricingRules.find(rule => rule.id === id);
export const getAllPromotionRules = (): PromotionRule[] => [...mockPromotionRules].sort((a, b) => a.name.localeCompare(b.name));
export const getPromotionRuleById = (id: string): PromotionRule | undefined => mockPromotionRules.find(r => r.id === r.id);
export const isUserOnWaitlist = (userId: string, facilityId: string, date: string, startTime: string): boolean => {
    if(!mockUser) return false;
    return mockWaitlist.some(entry => entry.userId === userId && entry.facilityId === facilityId && entry.date === date && entry.startTime === startTime);
}
export const getOpenLfgRequests = (): LfgRequest[] => mockLfgRequests.filter(req => req.status === 'open').sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
export const getAllBookings = async (): Promise<Booking[]> => {
    const res = await db.query('SELECT * FROM bookings ORDER BY booked_at DESC');
    return res.rows;
};

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
    updateUser(memberIdToRemove, { teamIds: mockUser.teamIds?.filter(id => id !== teamId) });
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
    
    // Remove team from all members' profiles
    team.memberIds.forEach(memberId => {
        updateUser(memberId, { teamIds: mockUser.teamIds?.filter(id => id !== teamId) });
    });

    // Remove the team itself
    mockTeams.splice(teamIndex, 1);
};


export const markNotificationAsRead = (userId: string, notificationId: string): void => { const notification = mockAppNotifications.find(n => n.id === notificationId && n.userId === userId); if (notification) notification.isRead = true; };
export const markAllNotificationsAsRead = (userId: string): void => { mockAppNotifications.forEach(n => { if (n.userId === userId) n.isRead = true; }); };
export const calculateDynamicPrice = ( basePricePerHour: number, selectedDate: Date, selectedSlot: TimeSlot, durationHours: number ): { finalPrice: number; appliedRuleName?: string, appliedRuleDetails?: PricingRule } => ({ finalPrice: basePricePerHour * durationHours });
export const addReview = async (reviewData: Omit<Review, 'id' | 'createdAt' | 'userName' | 'userAvatar'>): Promise<Review> => {
  const currentUser = await getUserById(reviewData.userId);
  const newReview: Review = { ...reviewData, id: `review-${Date.now()}`, userName: currentUser?.name || 'Anonymous User', userAvatar: currentUser?.profilePictureUrl, isPublicProfile: currentUser?.isProfilePublic || false, createdAt: new Date().toISOString() };
  mockReviews.push(newReview);
  return newReview;
};

export const createLfgRequest = (requestData: Omit<LfgRequest, 'id' | 'createdAt' | 'status' | 'interestedUserIds'>): LfgRequest[] => {
    const newRequest: LfgRequest = { ...requestData, id: `lfg-${Date.now()}`, createdAt: new Date().toISOString(), status: 'open', interestedUserIds: [] };
    mockLfgRequests.unshift(newRequest);
    return getOpenLfgRequests();
};

export const expressInterestInLfg = (lfgId: string, userId: string): LfgRequest[] => {
    const request = mockLfgRequests.find(r => r.id === lfgId);
    if (request && !request.interestedUserIds.includes(userId)) {
        request.interestedUserIds.push(userId);
    }
    return getOpenLfgRequests();
};

export const getOpenChallenges = (): Challenge[] => {
    return mockChallenges.filter(c => c.status === 'open').sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const createChallenge = (data: { challengerId: string; sportId: string; proposedDate: string; notes: string }): Challenge[] => {
    const challenger = mockUser; // Simplified, assuming mockUser is challenger
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
    const opponent = mockUser; // Simplified

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


// Functions below are still using mock data and would need to be migrated
// --- MOCK DATA POPULATION (Example data) ---
export const addMembershipPlan = (plan: Omit<MembershipPlan, 'id'>): MembershipPlan => { const newPlan = { ...plan, id: `mem-${Date.now()}`}; mockMembershipPlans.push(newPlan); return newPlan; };
export const updateMembershipPlan = (plan: MembershipPlan): void => { const index = mockMembershipPlans.findIndex(p => p.id === plan.id); if (index !== -1) mockMembershipPlans[index] = plan; };
export const deleteMembershipPlan = (id: string): void => { mockMembershipPlans = mockMembershipPlans.filter(p => p.id !== id); };
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
export const updateEvent = (event: SportEvent): void => { const index = mockEvents.findIndex(e => e.id === event.id); if (index !== -1) mockEvents[index] = event; };
export const deleteEvent = (id: string): void => { mockEvents = mockEvents.filter(e => e.id !== id); };
export const registerForEvent = (eventId: string): boolean => { const event = mockEvents.find(e => e.id === eventId); if (event && (!event.maxParticipants || event.registeredParticipants < event.maxParticipants)) { event.registeredParticipants++; return true; } return false; };
export const addPricingRule = (rule: Omit<PricingRule, 'id'>): void => { mockPricingRules.push({ ...rule, id: `pr-${Date.now()}` }); };
export const updatePricingRule = (rule: PricingRule): void => { const index = mockPricingRules.findIndex(r => r.id === rule.id); if (index !== -1) mockPricingRules[index] = rule; };
export const deletePricingRule = (id: string): void => { mockPricingRules = mockPricingRules.filter(r => r.id !== id); };
export const addPromotionRule = (rule: Omit<PromotionRule, 'id'>): void => { mockPromotionRules.push({ ...rule, id: `promo-${Date.now()}` }); };
export const updatePromotionRule = (rule: PromotionRule): void => { const index = mockPromotionRules.findIndex(r => r.id === rule.id); if (index !== -1) mockPromotionRules[index] = rule; };
export const getPromotionRuleByCode = async (code: string): Promise<PromotionRule | undefined> => mockPromotionRules.find(p => p.code?.toUpperCase() === code.toUpperCase() && p.isActive);
export const addToWaitlist = async (userId: string, facilityId: string, date: string, startTime: string): Promise<void> => { const entry: WaitlistEntry = { id: `wait-${Date.now()}`, userId, facilityId, date, startTime, createdAt: new Date().toISOString() }; mockWaitlist.push(entry); };
export async function listenToOwnerBookings(ownerId: string, callback: (bookings: Booking[]) => void, onError: (error: Error) => void): Promise<() => void> {
    const facilities = await getFacilitiesByOwnerId(ownerId);
    const facilityIds = facilities.map(f => f.id);

    if (facilityIds.length === 0) {
        callback([]);
        return () => {}; // No facilities, no need to listen
    }

    // This is now a one-time fetch, not a listener.
    const res = await db.query('SELECT * FROM bookings WHERE facility_id = ANY($1::text[])', [facilityIds]);
    callback(res.rows);

    return () => {}; // Return a no-op unsubscribe function
}
export const blockTimeSlot = async (facilityId: string, ownerId: string, newBlock: BlockedSlot): Promise<boolean> => {
   // This would require adding a record to a `blocked_slots` table or updating a JSONB column.
   // Simplified for this migration.
   console.log("Blocking slot for", facilityId, newBlock);
   return true;
};

export const unblockTimeSlot = async (facilityId: string, ownerId: string, date: string, startTime: string): Promise<boolean> => {
    // This would require removing a record from a `blocked_slots` table or updating a JSONB column.
    // Simplified for this migration.
    console.log("Unblocking slot for", facilityId, date, startTime);
    return true;
};

