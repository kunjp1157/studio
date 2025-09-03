

import type { Facility, Sport, Amenity, UserProfile, UserRole, UserStatus, Booking, ReportData, MembershipPlan, SportEvent, Review, AppNotification, NotificationType, BlogPost, PricingRule, PromotionRule, RentalEquipment, RentedItemInfo, AppliedPromotionInfo, TimeSlot, UserSkill, SkillLevel, BlockedSlot, SiteSettings, Team, WaitlistEntry, LfgRequest, SportPrice, NotificationTemplate, Challenge, MaintenanceSchedule } from './types';
import { parseISO, isWithinInterval, isAfter, isBefore, startOfDay, endOfDay, getDay, subDays, getMonth, getYear, format as formatDateFns } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { getMockSports as getMockSportsStatic, getStaticAmenities, getStaticUsers, getStaticFacilities as getMockFacilities } from './mock-data';
import twilio from 'twilio';

// --- IN-MEMORY MOCK DATABASE (to be phased out) ---
let mockTeams: Team[] = [];
let mockPricingRules: PricingRule[] = [];
let mockPromotionRules: PromotionRule[] = [];
let mockSiteSettings: SiteSettings = { siteName: 'Sports Arena', defaultCurrency: 'INR', timezone: 'Asia/Kolkata', maintenanceMode: false, notificationTemplates: [] };
let mockWaitlist: WaitlistEntry[] = [];
let mockLfgRequests: LfgRequest[] = [];
let mockChallenges: Challenge[] = [];
let mockBookings: Booking[] = [];

// --- DATA ACCESS FUNCTIONS (MOCK IMPLEMENTATION) ---

// These functions simulate fetching data. They are safe to use on the client.
export const getStaticFacilities = (): Facility[] => getMockFacilities();
export const getStaticSports = (): Sport[] => getMockSportsStatic();
export const getSiteSettings = (): SiteSettings => mockSiteSettings;

export const getAllUsers = (): UserProfile[] => {
    return getStaticUsers();
};

export const getUserById = (userId: string): UserProfile | undefined => {
    if (!userId) return undefined;
    const users = getStaticUsers();
    return users.find(u => u.id === userId);
};

export const getFacilityById = (id: string): Facility | undefined => {
    const facilities = getStaticFacilities();
    return facilities.find(f => f.id === id);
};

export const getFacilitiesByIds = (ids: string[]): Facility[] => {
    if (!ids || ids.length === 0) return [];
    const facilities = getStaticFacilities();
    return facilities.filter(f => ids.includes(f.id));
};

export const addFacility = (facilityData: Omit<Facility, 'id'>): Facility => {
    console.log("Mock adding facility", facilityData);
    const newFacility: Facility = { ...facilityData, id: `facility-${Date.now()}` };
    return newFacility;
};

export const updateFacility = (facilityData: Facility): Facility => {
    console.log("Mock updating facility", facilityData);
    return facilityData;
};


export const deleteFacility = (facilityId: string): void => {
    console.log("Mock deleting facility", facilityId);
};

export const getBookingById = (id: string): Booking | undefined => {
    return mockBookings.find(b => b.id === id);
};

export const addBooking = (bookingData: Omit<Booking, 'bookedAt' | 'id'>): Booking => {
    const newBooking: Booking = {
        ...bookingData,
        id: uuidv4(),
        bookedAt: new Date().toISOString(),
    };
    mockBookings.push(newBooking);
    return newBooking;
};

export const updateBooking = (bookingId: string, updates: Partial<Booking>): Booking | undefined => {
    const index = mockBookings.findIndex(b => b.id === bookingId);
    if (index !== -1) {
        mockBookings[index] = { ...mockBookings[index], ...updates };
        return mockBookings[index];
    }
    return undefined; // Needs DB
};

export const updateUser = (userId: string, updates: Partial<UserProfile>): UserProfile | undefined => {
    console.log("Mock updating user", userId, updates);
    return getStaticUsers().find(u => u.id === userId);
};

export function addUser(userData: { name: string; email: string, password?: string }): UserProfile {
  const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: 'User',
      status: 'Active',
      joinedAt: new Date().toISOString(),
      isProfilePublic: true,
      loyaltyPoints: 0,
      membershipLevel: 'Basic',
  }
  return newUser;
}

export const getBookingsForFacilityOnDate = (facilityId: string, date: string): Booking[] => {
    return mockBookings.filter(b => b.facilityId === facilityId && b.date === date);
};

export const getBookingsByUserId = (userId: string): Booking[] => {
    return mockBookings.filter(b => b.userId === userId);
};

export const getSportById = (id: string): Sport | undefined => {
    return getStaticSports().find(s => s.id === id);
}

export const getFacilitiesByOwnerId = (ownerId: string): Facility[] => {
    const facilities = getStaticFacilities();
    return facilities.filter(f => f.ownerId === ownerId);
};

export const addReview = (reviewData: Omit<Review, 'id' | 'createdAt' | 'userName' | 'userAvatar' | 'isPublicProfile'>): Review => {
    const currentUser = getUserById(reviewData.userId);
    if (!currentUser) throw new Error("User not found to post review.");

    const newReview: Review = {
        ...reviewData,
        id: `review-${Date.now()}`,
        createdAt: new Date().toISOString(),
        userName: currentUser.name,
        userAvatar: currentUser.profilePictureUrl,
        isPublicProfile: currentUser.isProfilePublic,
    }
    return newReview;
};

export const getAllEvents = (): SportEvent[] => {
    return []; // Mocked
};
export const getEventById = (id: string): SportEvent | undefined => {
    return undefined; // Mocked
};

export const getAllBookings = (): Booking[] => {
    return mockBookings;
};

export const getEventsByFacilityIds = (facilityIds: string[]): SportEvent[] => {
    return []; // Mocked
};

export const addNotification = (userId: string, notificationData: Omit<AppNotification, 'id' | 'userId' | 'createdAt' | 'isRead'>): AppNotification => {
    console.log("Mock add notification", userId, notificationData);
    // This is a mock implementation
    const newNotification: AppNotification = {
      id: `notif-${Date.now()}`,
      userId,
      ...notificationData,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    return newNotification;
};

export const sendBookingConfirmationSms = async (booking: Booking): Promise<void> => {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env;
  
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    console.warn("[SMS] Twilio credentials are not set in .env. Skipping SMS.");
    return;
  }
  
  const phone = booking.phoneNumber;
  if (!phone) {
    console.log(`[SMS] Could not send SMS for booking ${booking.id}: No phone number provided.`);
    return;
  }

  const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  const user = booking.userId ? await getUserById(booking.userId) : null;
  const userName = user ? user.name : 'Guest';
  const message = `Hi ${userName}, your booking for ${booking.sportName} at ${booking.facilityName} on ${formatDateFns(parseISO(booking.date), 'MMM d')} at ${booking.startTime} is confirmed. Booking ID: ${booking.id.substring(0,8)}.`;

  try {
    const response = await client.messages.create({
      body: message,
      from: TWILIO_PHONE_NUMBER,
      to: phone, // Make sure the phone number includes the country code, e.g., +91...
    });
    console.log(`[SMS] Message sent to ${phone}. SID: ${response.sid}`);
  } catch (error) {
    console.error("[SMS] Failed to send message:", error);
  }
}

export const markNotificationAsRead = (userId: string, notificationId: string): void => { 
    console.log("Mock marking notification as read", userId, notificationId);
};

export const markAllNotificationsAsRead = (userId: string): void => { 
    console.log("Mock marking all notifications as read", userId);
};

export const getAllSports = (): Sport[] => {
    return getStaticSports();
};

export const addSport = (sportData: Omit<Sport, 'id'>): Sport => {
    const newSport: Sport = { ...sportData, id: `sport-${Date.now()}` };
    return newSport;
};

export const updateSport = (sportId: string, sportData: Partial<Sport>): Sport => {
    const sport = getStaticSports().find(s => s.id === sportId)!;
    return { ...sport, ...sportData };
};

export const deleteSport = (sportId: string): void => {
    console.log("Mock deleting sport", sportId);
};

export const toggleFavoriteFacility = (userId: string, facilityId: string): UserProfile | undefined => {
    console.log("Mock toggling favorite", userId, facilityId);
    return getStaticUsers().find(u => u.id === userId);
};

export const blockTimeSlot = (facilityId: string, ownerId: string, newBlock: BlockedSlot): boolean => {
    console.log("Mock blocking time slot", facilityId, ownerId, newBlock);
    return true;
};

export const unblockTimeSlot = (facilityId: string, ownerId: string, date: string, startTime: string): boolean => {
    console.log("Mock unblocking time slot", facilityId, ownerId, date, startTime);
    return true;
};

// --- MOCK FUNCTIONS to be replaced or that handle non-DB logic ---
export const getPromotionRuleByCode = (code: string): PromotionRule | undefined => {
    // In a real app, this would query the DB
    return mockPromotionRules.find(p => p.code?.toUpperCase() === code.toUpperCase() && p.isActive);
}
export const getNotificationsForUser = (userId: string): AppNotification[] => {
    return []; // Mocked
};
export const getTeamById = (teamId: string): Team | undefined => mockTeams.find(team => team.id === teamId);
export const getTeamsByUserId = (userId: string): Team[] => mockTeams.filter(team => team.memberIds.includes(userId));
export const createTeam = (teamData: { name: string; sportId: string; captainId: string }): Team => {
    const sport = {id: 'sport-1', name: 'Soccer', iconName: 'Goal'}; // This needs real data
    const newTeam: Team = { id: `team-${Date.now()}`, name: teamData.name, sport, captainId: teamData.captainId, memberIds: [teamData.captainId] };
    mockTeams.push(newTeam);
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
  return true;
};
export const removeUserFromTeam = (teamId: string, memberIdToRemove: string, captainId: string): void => {
    const team = mockTeams.find(t => t.id === teamId);
    if (!team) throw new Error("Team not found.");
    if (team.captainId !== captainId) throw new Error("Only the team captain can remove members.");
    if (memberIdToRemove === captainId) throw new Error("Captain cannot remove themselves.");
    team.memberIds = team.memberIds.filter(id => id !== memberIdToRemove);
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
    if (mockTeams[teamIndex].captainId !== captainId) throw new Error("Only the team captain can disband the team.");
    mockTeams.splice(teamIndex, 1);
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
export const addEvent = (event: Omit<SportEvent, 'id' | 'sport' | 'registeredParticipants'> & { sportId: string }): void => { 
    console.log("Mock adding event", event);
};
export const updateEvent = (eventData: Omit<SportEvent, 'sport'> & { sportId: string }): void => {
    console.log("Mock updating event", eventData);
};
export const deleteEvent = (id: string): void => { console.log("Mock deleting event", id); };

export const addPricingRule = (rule: Omit<PricingRule, 'id'>): void => { mockPricingRules.push({ ...rule, id: `pr-${Date.now()}` }); };
export const updatePricingRule = (rule: PricingRule): void => { const index = mockPricingRules.findIndex(r => r.id === rule.id); if (index !== -1) mockPricingRules[index] = rule; };
export const deletePricingRule = (id: string): void => { mockPricingRules = mockPricingRules.filter(r => r.id !== id); };
export const addPromotionRule = (rule: Omit<PromotionRule, 'id'>): void => { mockPromotionRules.push({ ...rule, id: `promo-${Date.now()}` }); };
export const updatePromotionRule = (rule: PromotionRule): void => { const index = mockPromotionRules.findIndex(r => r.id === rule.id); if (index !== -1) mockPromotionRules[index] = rule; };
export const deletePromotionRule = (id: string): void => { mockPromotionRules = mockPromotionRules.filter(p => p.id !== id); };
export const getMembershipPlanById = (id: string): MembershipPlan | undefined => {
    return {id: '1', name: 'Premium', pricePerMonth: 500, benefits: ['Discounted bookings', 'Priority access']};
};
export const getAllMembershipPlans = (): MembershipPlan[] => {
    return [
        {id: '1', name: 'Premium', pricePerMonth: 500, benefits: ['Discounted bookings', 'Priority access']},
        {id: '2', name: 'Basic', pricePerMonth: 0, benefits: ['Standard access']}
    ];
};
export const getAllPricingRules = (): PricingRule[] => {
    return mockPricingRules;
}
export const getAllPromotionRules = (): PromotionRule[] => {
    return mockPromotionRules;
}
export const listenToAllEvents = (callback: (events: SportEvent[]) => void, onError: (error: Error) => void): (() => void) => {
    console.log("Mock listening to events");
    callback([]);
    return () => {};
};
export const listenToAllMembershipPlans = (callback: (plans: MembershipPlan[]) => void, onError: (error: Error) => void): (() => void) => {
    console.log("Mock listening to plans");
    callback(getAllMembershipPlans());
    return () => {};
};
export const listenToAllPricingRules = (callback: (rules: PricingRule[]) => void, onError: (error: Error) => void): (() => void) => {
    console.log("Mock listening to pricing rules");
    callback(mockPricingRules);
    return () => {};
};
export const listenToAllPromotionRules = (callback: (rules: PromotionRule[]) => void, onError: (error: Error) => void): (() => void) => {
    console.log("Mock listening to promotion rules");
    callback(mockPromotionRules);
    return () => {};
};
// -- Mock functions for features without DB tables yet --
export const getLfgRequestsByFacilityIds = (facilityIds: string[]): LfgRequest[] => { return []; };
export const getChallengesByFacilityIds = (facilityIds: string[]): Challenge[] => { return []; };
export const getOpenLfgRequests = (): LfgRequest[] => mockLfgRequests.filter(req => req.status === 'open').sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
export const createLfgRequest = (requestData: Omit<LfgRequest, 'id' | 'createdAt' | 'status' | 'interestedUserIds' | 'facilityName'>): LfgRequest[] => {
    const facility = getFacilityById(requestData.facilityId);
    if (!facility) return mockLfgRequests;

    const newRequest: LfgRequest = {
        id: `lfg-${Date.now()}`,
        ...requestData,
        facilityName: facility.name,
        createdAt: new Date().toISOString(),
        status: 'open',
        interestedUserIds: [],
    };
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
    const openChallenges = mockChallenges.filter(c => c.status === 'open');
    return openChallenges.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};
export const createChallenge = (data: { challengerId: string; sportId: string; facilityId: string; proposedDate: string; notes: string }): Challenge[] => {
    const challenger = getUserById(data.challengerId);
    const sport = getSportById(data.sportId);
    const facility = getFacilityById(data.facilityId);

    if (!challenger || !sport || !facility) return mockChallenges;
    
    const newChallenge: Challenge = {
        id: `challenge-${Date.now()}`,
        challengerId: data.challengerId,
        challenger,
        sport,
        facilityId: data.facilityId,
        facilityName: facility.name,
        proposedDate: data.proposedDate,
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
    if (challenge && opponent && challenge.status === 'open') {
        challenge.status = 'accepted';
        challenge.opponentId = opponentId;
        challenge.opponent = opponent;
    }
    return getOpenChallenges();
};

export const getPricingRuleById = (id: string): PricingRule | undefined => { return mockPricingRules.find(p => p.id === id); };

export const getPromotionRuleById = (id: string): PromotionRule | undefined => { return mockPromotionRules.find(p => p.id === id);};

export const getBlogPostBySlug = (slug: string): BlogPost | undefined => { 
    return undefined;
 };
export const getAllBlogPosts = (): BlogPost[] => { 
    return [];
};
export const dbGetFacilityById = (id: string): Promise<Facility | undefined> => {
    return Promise.resolve(getFacilityById(id));
};
export const dbGetAllUsers = (): Promise<UserProfile[]> => {
    return Promise.resolve(getStaticUsers());
};
export const dbAddUser = (userData: { name: string; email: string, password?: string }): Promise<UserProfile> => {
    return Promise.resolve(addUser(userData));
}
export const dbGetBookingsByUserId = (userId: string): Promise<Booking[]> => {
    return Promise.resolve(getBookingsByUserId(userId));
};
export const dbUpdateBooking = (bookingId: string, updates: Partial<Booking>): Promise<Booking | undefined> => {
    return Promise.resolve(updateBooking(bookingId, updates));
}
export const dbAddBooking = (bookingData: Booking): Promise<Booking> => {
    mockBookings.push(bookingData);
    return Promise.resolve(bookingData);
}
export const dbAddReview = (reviewData: Omit<Review, 'id' | 'createdAt' | 'userName' | 'userAvatar' | 'isPublicProfile'>): Promise<Review> => {
    return Promise.resolve(addReview(reviewData));
}
export const dbGetBookingById = (id: string): Promise<Booking | undefined> => {
    return Promise.resolve(getBookingById(id));
}
export const dbGetBookingsForFacilityOnDate = (facilityId: string, date: string): Promise<Booking[]> => {
    return Promise.resolve(getBookingsForFacilityOnDate(facilityId, date));
}
export const dbAddFacility = (facilityData: Omit<Facility, 'id'>): Promise<Facility> => {
    return Promise.resolve(addFacility(facilityData));
};
export const dbUpdateFacility = (facilityData: Facility): Promise<Facility> => {
    return Promise.resolve(updateFacility(facilityData));
};
export const dbDeleteFacility = (facilityId: string): Promise<void> => {
    return Promise.resolve(deleteFacility(facilityId));
};
export const dbGetAllBookings = (): Promise<Booking[]> => {
    return Promise.resolve(getAllBookings());
};
export const dbGetSiteSettings = (): Promise<SiteSettings> => {
    return Promise.resolve(getSiteSettings());
};
export const dbGetFacilitiesByOwnerId = (ownerId: string): Promise<Facility[]> => {
    return Promise.resolve(getFacilitiesByOwnerId(ownerId));
};
export const dbGetEventById = (id: string): Promise<SportEvent | undefined> => {
    return Promise.resolve(getEventById(id));
};
export const dbGetAllEvents = (): Promise<SportEvent[]> => {
    return Promise.resolve(getAllEvents());
};
export const dbGetAllMembershipPlans = (): Promise<MembershipPlan[]> => {
    return Promise.resolve(getAllMembershipPlans());
};
export const dbGetAllPricingRules = (): Promise<PricingRule[]> => {
    return Promise.resolve(getAllPricingRules());
};
export const dbGetAllPromotionRules = (): Promise<PromotionRule[]> => {
    return Promise.resolve(getAllPromotionRules());
};
export const dbGetNotificationsForUser = (userId: string): Promise<AppNotification[]> => {
    return Promise.resolve(getNotificationsForUser(userId));
};
export const dbMarkNotificationAsRead = (userId: string, notificationId: string): Promise<void> => {
    return Promise.resolve(markNotificationAsRead(userId, notificationId));
};
export const dbMarkAllNotificationsAsRead = (userId: string): Promise<void> => {
    return Promise.resolve(markAllNotificationsAsRead(userId));
};
export const dbBlockTimeSlot = (facilityId: string, ownerId: string, newBlock: BlockedSlot): Promise<boolean> => {
    return Promise.resolve(blockTimeSlot(facilityId, ownerId, newBlock));
};
export const dbUnblockTimeSlot = (facilityId: string, ownerId: string, date: string, startTime: string): Promise<boolean> => {
    return Promise.resolve(unblockTimeSlot(facilityId, ownerId, date, startTime));
};
export const dbUpdateUser = (userId: string, updates: Partial<UserProfile>): Promise<UserProfile | undefined> => {
    return Promise.resolve(updateUser(userId, updates));
};
export const dbGetSportById = (id: string): Promise<Sport | undefined> => {
    return Promise.resolve(getSportById(id));
};
export const dbAddNotification = (userId: string, notificationData: Omit<AppNotification, 'id' | 'userId' | 'createdAt' | 'isRead'>): Promise<AppNotification> => {
    return Promise.resolve(addNotification(userId, notificationData));
};
export const dbGetAllSports = (): Promise<Sport[]> => {
    return Promise.resolve(getAllSports());
};
export const dbAddSport = (sportData: Omit<Sport, 'id'>): Promise<Sport> => {
    return Promise.resolve(addSport(sportData));
};
export const dbUpdateSport = (sportId: string, sportData: Partial<Sport>): Promise<Sport> => {
    return Promise.resolve(updateSport(sportId, sportData));
};
export const dbDeleteSport = (sportId: string): Promise<void> => {
    return Promise.resolve(deleteSport(sportId));
};
export const dbToggleFavoriteFacility = (userId: string, facilityId: string): Promise<UserProfile | undefined> => {
    return Promise.resolve(toggleFavoriteFacility(userId, facilityId));
};
export const dbGetPromotionRuleByCode = (code: string): Promise<PromotionRule | undefined> => {
    return Promise.resolve(getPromotionRuleByCode(code));
};
export const dbGetAllBlogPosts = (): Promise<BlogPost[]> => {
    return Promise.resolve(getAllBlogPosts());
};
export const dbGetBlogPostBySlug = (slug: string): Promise<BlogPost | undefined> => {
    return Promise.resolve(getBlogPostBySlug(slug));
};
export const dbRegisterForEvent = (eventId: string): Promise<boolean> => {
    return Promise.resolve(registerForEvent(eventId));
};

export const registerForEvent = (eventId: string): boolean => {
    return false; // Mocked
};

export const calculateDynamicPrice = ( basePricePerHour: number, selectedDate: Date, selectedSlot: TimeSlot, durationHours: number ): { finalPrice: number; appliedRuleName?: string, appliedRuleDetails?: PricingRule } => ({ finalPrice: basePricePerHour * durationHours });

export function updateSiteSettings(settings: SiteSettings): SiteSettings {
  mockSiteSettings = { ...mockSiteSettings, ...settings };
  return mockSiteSettings;
}
