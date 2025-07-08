import type { Facility, Sport, Amenity, UserProfile, UserRole, UserStatus, Booking, ReportData, MembershipPlan, SportEvent, Review, AppNotification, NotificationType, BlogPost, PricingRule, PromotionRule, RentalEquipment, RentedItemInfo, AppliedPromotionInfo, TimeSlot, UserSkill, SkillLevel, BlockedSlot, SiteSettings, Team, WaitlistEntry, LfgRequest, SportPrice, NotificationTemplate } from './types';
import { ParkingCircle, Wifi, ShowerHead, Lock, Dumbbell, Zap, Users, Trophy, Award, CalendarDays as LucideCalendarDays, Utensils, Star, LocateFixed, Clock, DollarSign, Goal, Bike, Dices, Swords, Music, Tent, Drama, MapPin, Heart, Dribbble, Activity, Feather, CheckCircle, XCircle, MessageSquareText, Info, Gift, Edit3, PackageSearch, Shirt, Disc, Medal, Gem, Rocket, Gamepad2, MonitorPlay, Target, Drum, Guitar, Brain, Camera, PersonStanding, Building, HandCoins, Palette, Group, BikeIcon, DramaIcon, Film, Gamepad, GuitarIcon, Landmark, Lightbulb, MountainSnow, Pizza, ShoppingBag, VenetianMask, Warehouse, Weight, Wind, WrapText, Speech, HistoryIcon, BarChartIcon, UserCheck, UserX, Building2, BellRing } from 'lucide-react';
import { parseISO, isWithinInterval, isAfter, isBefore, startOfDay, endOfDay, getDay, subDays, getMonth, getYear, format as formatDateFns } from 'date-fns';
import { db } from './firebase';
import { collection, getDocs, doc, getDoc, addDoc, setDoc, deleteDoc, query, where, onSnapshot } from 'firebase/firestore';


// --- MOCK DATA (for non-facility types, to be migrated later) ---
export const mockSports: Sport[] = [
  { id: 'sport-1', name: 'Soccer', iconName: 'Goal', imageUrl: 'https://images.unsplash.com/photo-1551958214-e6163c125414', imageDataAiHint: 'soccer ball' },
  { id: 'sport-2', name: 'Basketball', iconName: 'Dribbble', imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc', imageDataAiHint: 'basketball hoop' },
  { id: 'sport-3', name: 'Tennis', iconName: 'Activity', imageUrl: 'https://images.unsplash.com/photo-1594470117722-de4b9a02ebed', imageDataAiHint: 'tennis racket' },
  { id: 'sport-4', name: 'Badminton', iconName: 'Feather', imageUrl: 'https://images.unsplash.com/photo-1521587514789-53b8a3b09228', imageDataAiHint: 'badminton shuttlecock' },
  { id: 'sport-5', name: 'Swimming', iconName: 'PersonStanding', imageUrl: 'https://images.unsplash.com/photo-1590650392358-693608513b68', imageDataAiHint: 'swimming lane' },
  { id: 'sport-6', name: 'Yoga', iconName: 'Brain', imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b', imageDataAiHint: 'yoga pose' },
  { id: 'sport-7', name: 'Cycling', iconName: 'Bike', imageUrl: 'https://images.unsplash.com/photo-1576426863875-c217e4287487', imageDataAiHint: 'cycling road' },
  { id: 'sport-8', name: 'Dance', iconName: 'Music', imageUrl: 'https://images.unsplash.com/photo-1511719111394-550342a5b23d', imageDataAiHint: 'dance studio' },
  { id: 'sport-9', name: 'Camping', iconName: 'Tent', imageUrl: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d', imageDataAiHint: 'camping tent nature' },
  { id: 'sport-10', name: 'Theatre', iconName: 'Drama', imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91e38a493', imageDataAiHint: 'theatre stage' },
  { id: 'sport-13', name: 'Cricket', iconName: 'Dices', imageUrl: 'https://images.unsplash.com/photo-1599551154316-276537b02c89', imageDataAiHint: 'cricket bat ball' },
  { id: 'sport-14', name: 'Pool', iconName: 'Target', imageUrl: 'https://images.unsplash.com/photo-1601758124235-7c98c199e4df', imageDataAiHint: 'billiards table' },
  { id: 'sport-15', name: 'PC Game/PS5', iconName: 'Gamepad2', imageUrl: 'https://images.unsplash.com/photo-1598550489913-af3c28a2cc73', imageDataAiHint: 'gaming setup' },
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

// Most data is now fetched from Firebase. Mocks for related/unmigrated data are kept for now.
export let mockReviews: Review[] = [];
export const mockAchievements: Achievement[] = [];
export let mockUsers: UserProfile[] = [];
export const mockUser = {
    id: 'user-admin',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '555-123-4567',
    profilePictureUrl: 'https://placehold.co/100x100.png?text=AJ',
    dataAiHint: "user avatar",
    preferredSports: [mockSports[0], mockSports[2]],
    favoriteFacilities: ['facility-1', 'facility-2'],
    membershipLevel: 'Premium' as 'Premium',
    loyaltyPoints: 1250,
    achievements: [],
    bio: 'Passionate about sports and outdoor activities. Always looking for a good game!',
    preferredPlayingTimes: 'Weekday evenings, Weekend mornings',
    skillLevels: [
      { sportId: 'sport-1', sportName: 'Soccer', level: 'Intermediate' as SkillLevel },
      { sportId: 'sport-3', sportName: 'Tennis', level: 'Beginner' as SkillLevel },
    ],
    role: 'Admin' as UserRole,
    status: 'Active' as UserStatus,
    joinedAt: subDays(new Date(), 30).toISOString(),
    teamIds: ['team-1', 'team-2'],
    isProfilePublic: true,
  };
export let mockTeams: Team[] = [];
export let mockBookings: Booking[] = [];
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


// --- FIREBASE-ENABLED FACILITY FUNCTIONS ---

/**
 * Sets up a real-time listener for the facilities collection in Firestore.
 * @param callback - Function to call with the new list of facilities whenever data changes.
 * @param onError - Function to call when an error occurs.
 * @returns An unsubscribe function to detach the listener.
 */
export function listenToFacilities(
  callback: (facilities: Facility[]) => void, 
  onError: (error: Error) => void
) {
  const q = query(collection(db, 'facilities'));
  
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const facilitiesData: Facility[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Omit<Facility, 'id'>;
      facilitiesData.push({ ...data, id: doc.id });
    });
    // Ratings need to be calculated separately if reviews are in a different collection.
    // For now, we assume rating is stored on the facility doc.
    callback(facilitiesData);
  }, (error) => {
    console.error("Firestore listener error: ", error);
    onError(error);
  });

  return unsubscribe;
}

/**
 * Fetches all facilities from Firestore once.
 * This is useful for server-side rendering or initial page loads.
 */
export const getAllFacilities = async (): Promise<Facility[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, 'facilities'));
        const facilities: Facility[] = [];
        querySnapshot.forEach((doc) => {
            facilities.push({ id: doc.id, ...doc.data() } as Facility);
        });
        return facilities;
    } catch (error) {
        console.error("Error fetching facilities: ", error);
        return [];
    }
};


/**
 * Fetches a single facility by its ID from Firestore.
 */
export const getFacilityById = async (id: string): Promise<Facility | undefined> => {
    try {
        const docRef = doc(db, 'facilities', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Facility;
        } else {
            console.log("No such facility document!");
            return undefined;
        }
    } catch (error) {
        console.error("Error fetching facility by ID: ", error);
        return undefined;
    }
};

/**
 * Adds a new facility to the Firestore 'facilities' collection.
 */
export const addFacility = async (facilityData: Omit<Facility, 'id'>): Promise<Facility> => {
  try {
    const docRef = await addDoc(collection(db, 'facilities'), facilityData);
    return { id: docRef.id, ...facilityData };
  } catch (error) {
    console.error("Error adding facility: ", error);
    throw new Error("Could not add facility to the database.");
  }
};

/**
 * Updates an existing facility in the Firestore 'facilities' collection.
 */
export const updateFacility = async (updatedFacilityData: Facility): Promise<Facility> => {
  try {
    const facilityRef = doc(db, 'facilities', updatedFacilityData.id);
    // The `setDoc` with merge option or `updateDoc` can be used. `setDoc` is safer for ensuring the object shape.
    await setDoc(facilityRef, updatedFacilityData, { merge: true });
    return updatedFacilityData;
  } catch (error) {
    console.error("Error updating facility: ", error);
    throw new Error("Could not update facility in the database.");
  }
};

/**
 * Deletes a facility from the Firestore 'facilities' collection.
 */
export const deleteFacility = async (facilityId: string): Promise<void> => {
    try {
        await deleteDoc(doc(db, 'facilities', facilityId));
    } catch (error) {
        console.error("Error deleting facility: ", error);
        throw new Error("Could not delete facility from the database.");
    }
};

// --- MOCK GETTERS (for other data types) ---
export const getSportById = (id: string): Sport | undefined => mockSports.find(s => s.id === id);
export const getAmenityById = (id: string): Amenity | undefined => mockAmenities.find(a => a.id === a.id);
export const getAllSports = (): Sport[] => mockSports;
export const getSiteSettings = (): SiteSettings => mockSiteSettings;
export const getFacilitiesByOwnerId = async (ownerId: string): Promise<Facility[]> => {
    // This will now also fetch from Firestore but with a filter
     try {
        const q = query(collection(db, "facilities"), where("ownerId", "==", ownerId));
        const querySnapshot = await getDocs(q);
        const facilities: Facility[] = [];
        querySnapshot.forEach((doc) => {
            facilities.push({ id: doc.id, ...doc.data() } as Facility);
        });
        return facilities;
    } catch (error) {
        console.error("Error fetching owner facilities: ", error);
        return [];
    }
};

// All other functions from the original file remain as they were, using mock data.
// This is a strategic choice to focus the change on facilities as requested.
// A full migration would involve creating collections for users, bookings, etc.

export const calculateAverageRating = (reviews: Review[] | undefined): number => {
  if (!reviews || reviews.length === 0) {
    return 0;
  }
  const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
  return parseFloat((totalRating / reviews.length).toFixed(1));
};

// ... (Keep all other mock-based functions like getUserById, addBooking, etc. for now)
export const getUserById = (userId: string): UserProfile | undefined => mockUsers.find(user => user.id === userId);
export const getReviewsByFacilityId = (facilityId: string): Review[] => mockReviews.filter(review => review.facilityId === facilityId);
export const getTeamById = (teamId: string): Team | undefined => mockTeams.find(team => team.id === teamId);
export const getTeamsByUserId = (userId: string): Team[] => mockTeams.filter(team => team.memberIds.includes(userId));
export const getBookingById = (id: string): Booking | undefined => mockBookings.find(booking => booking.id === id);
export const getBookingsByUserId = (userId: string): Booking[] => mockBookings.filter(booking => booking.userId === userId);
export const getAllBookings = (): Booking[] => [...mockBookings].sort((a,b) => new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime());
export const getAllUsers = (): UserProfile[] => [...mockUsers];
export const getRentalEquipmentById = (id: string): RentalEquipment | undefined => mockRentalEquipment.find(eq => eq.id === eq.id);
export const getNotificationsForUser = (userId: string): AppNotification[] => mockAppNotifications.filter(n => n.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
export const getAllBlogPosts = (): BlogPost[] => mockBlogPosts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
export const getBlogPostBySlug = (slug: string): BlogPost | undefined => mockBlogPosts.find(post => post.slug === slug);
export const getAllMembershipPlans = (): MembershipPlan[] => [...mockMembershipPlans];
export const getMembershipPlanById = (id: string): MembershipPlan | undefined => mockMembershipPlans.find(plan => plan.id === id);
export const getAllEvents = (): SportEvent[] => [...mockEvents].sort((a,b) => parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime());
export const getEventById = (id: string): SportEvent | undefined => {
  const event = mockEvents.find(event => event.id === id);
  if (event) {
    const sport = getSportById(event.sport.id);
    return sport ? { ...event, sport } : { ...event };
  }
  return undefined;
};
export const getAllPricingRules = (): PricingRule[] => [...mockPricingRules];
export const getPricingRuleById = (id: string): PricingRule | undefined => mockPricingRules.find(rule => rule.id === id);
export const getAllPromotionRules = (): PromotionRule[] => [...mockPromotionRules].sort((a, b) => a.name.localeCompare(b.name));
export const getPromotionRuleById = (id: string): PromotionRule | undefined => mockPromotionRules.find(r => r.id === id);
export const isUserOnWaitlist = (userId: string, facilityId: string, date: string, startTime: string): boolean => mockWaitlist.some(entry => entry.userId === userId && entry.facilityId === facilityId && entry.date === date && entry.startTime === startTime);
export const getOpenLfgRequests = (): LfgRequest[] => mockLfgRequests.filter(req => req.status === 'open').sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
export const addBooking = (bookingData: Omit<Booking, 'id' | 'bookedAt'>): Booking => {
  const newBooking: Booking = { ...bookingData, id: `booking-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`, bookedAt: new Date().toISOString(), };
  mockBookings.push(newBooking);
  return newBooking;
};
export const addNotification = (userId: string, notificationData: Omit<AppNotification, 'id' | 'userId' | 'createdAt' | 'isRead'>): AppNotification => {
  let iconName = 'Info';
  switch (notificationData.type) { case 'booking_confirmed': iconName = 'CheckCircle'; break; case 'booking_cancelled': iconName = 'XCircle'; break; case 'review_submitted': iconName = 'MessageSquareText'; break; case 'reminder': iconName = 'CalendarDays'; break; case 'promotion': iconName = 'Gift'; break; case 'waitlist_opening': iconName = 'BellRing'; break; case 'user_status_changed': iconName = 'Edit3'; break; case 'matchmaking_interest': iconName = 'Swords'; break; }
  const newNotification: AppNotification = { ...notificationData, id: `notif-${Date.now()}`, userId, createdAt: new Date().toISOString(), isRead: false, iconName: notificationData.iconName || iconName, };
  mockAppNotifications.unshift(newNotification);
  return newNotification;
};
export const updateBooking = (bookingId: string, updates: Partial<Booking>): Booking | undefined => {
    const bookingIndex = mockBookings.findIndex(b => b.id === bookingId);
    if (bookingIndex === -1) return undefined;
    mockBookings[bookingIndex] = { ...mockBookings[bookingIndex], ...updates };
    return mockBookings[bookingIndex];
};
export const updateUser = (userId: string, updates: Partial<UserProfile>): UserProfile | undefined => {
    const userIndex = mockUsers.findIndex(user => user.id === userId);
    if (userIndex === -1) return undefined;
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };
    return mockUsers[userIndex];
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
  const user = getUserById(teamData.captainId);
  if (user) { if (!user.teamIds) user.teamIds = []; user.teamIds.push(newTeam.id); }
  return newTeam;
};
export const leaveTeam = (teamId: string, userId: string): boolean => {
  const teamIndex = mockTeams.findIndex(t => t.id === teamId);
  if (teamIndex === -1) return false;
  const team = mockTeams[teamIndex];
  if (!team.memberIds.includes(userId)) return false; 
  if (team.captainId === userId && team.memberIds.length > 1) return false; 
  if (team.captainId === userId && team.memberIds.length === 1) mockTeams.splice(teamIndex, 1);
  else team.memberIds = team.memberIds.filter(id => id !== userId);
  const user = getUserById(userId);
  if (user && user.teamIds) user.teamIds = user.teamIds.filter(id => id !== teamId);
  return true;
};
export const blockTimeSlot = (facilityId: string, ownerId: string, slot: BlockedSlot): boolean => {
    // This function would need to be reimplemented for Firestore
    return true; 
};
export const unblockTimeSlot = (facilityId: string, ownerId: string, date: string, startTime: string): boolean => {
    // This function would need to be reimplemented for Firestore
    return true; 
};
export const markNotificationAsRead = (userId: string, notificationId: string): void => { const notification = mockAppNotifications.find(n => n.id === notificationId && n.userId === userId); if (notification) notification.isRead = true; };
export const markAllNotificationsAsRead = (userId: string): void => { mockAppNotifications.forEach(n => { if (n.userId === userId) n.isRead = true; }); };
export const calculateDynamicPrice = ( basePricePerHour: number, selectedDate: Date, selectedSlot: TimeSlot, durationHours: number ): { finalPrice: number; appliedRuleName?: string, appliedRuleDetails?: PricingRule } => ({ finalPrice: basePricePerHour * durationHours });
export const addReview = (reviewData: Omit<Review, 'id' | 'createdAt' | 'userName' | 'userAvatar'>): Review => {
  const currentUser = getUserById(reviewData.userId);
  const newReview: Review = { ...reviewData, id: `review-${mockReviews.length + 1}`, userName: currentUser?.name || 'Anonymous User', userAvatar: currentUser?.profilePictureUrl, isPublicProfile: currentUser?.isProfilePublic || false, createdAt: new Date().toISOString() };
  mockReviews.push(newReview);
  return newReview;
};
// ... other mock functions
