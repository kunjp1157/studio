
import type { Facility, Sport, Amenity, UserProfile, UserRole, UserStatus, Booking, ReportData, MembershipPlan, SportEvent, Review, AppNotification, NotificationType, BlogPost, PricingRule, PromotionRule, RentalEquipment, RentedItemInfo, AppliedPromotionInfo, TimeSlot, UserSkill, SkillLevel, BlockedSlot, SiteSettings, Team, WaitlistEntry, LfgRequest, SportPrice, NotificationTemplate, Challenge, MaintenanceSchedule } from './types';
import { query } from './db';
import { v4 as uuidv4 } from 'uuid';

// =================================================================
// USER FUNCTIONS
// =================================================================

export async function dbGetAllUsers(): Promise<UserProfile[]> {
  const [rows] = await query('SELECT * FROM users');
  return (rows as any[]).map(row => ({...row, favoriteFacilities: JSON.parse(row.favoriteFacilities || '[]'), preferredSports: JSON.parse(row.preferredSports || '[]'), skillLevels: JSON.parse(row.skillLevels || '[]'), achievements: JSON.parse(row.achievements || '[]')  }));
}

export async function dbGetUserById(id: string): Promise<UserProfile | undefined> {
  const [rows] = await query('SELECT * FROM users WHERE id = ?', [id]);
  if ((rows as any[]).length === 0) return undefined;
  const row = (rows as any)[0];
  return {...row, favoriteFacilities: JSON.parse(row.favoriteFacilities || '[]'), preferredSports: JSON.parse(row.preferredSports || '[]'), skillLevels: JSON.parse(row.skillLevels || '[]'), achievements: JSON.parse(row.achievements || '[]')  };
}

export async function dbAddUser(userData: { name: string; email: string, password?: string }): Promise<UserProfile> {
  const existingUser = (await query('SELECT id FROM users WHERE email = ?', [userData.email]))[0] as any[];
  if (existingUser.length > 0) {
      throw new Error('A user with this email already exists.');
  }

  const newUser: UserProfile = {
      id: `user-${uuidv4()}`,
      name: userData.name,
      email: userData.email,
      password: userData.password, // Should be hashed in a real app
      role: 'User',
      status: 'Active',
      joinedAt: new Date().toISOString(),
      isProfilePublic: true,
      loyaltyPoints: 0,
      membershipLevel: 'Basic',
      favoriteFacilities: [],
      preferredSports: [],
      skillLevels: [],
      achievements: []
  };

  await query('INSERT INTO users SET ?', { ...newUser, password: newUser.password || null, favoriteFacilities: '[]', preferredSports: '[]', skillLevels: '[]', achievements: '[]' });
  return newUser;
}

export async function dbUpdateUser(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | undefined> {
    const user = await dbGetUserById(userId);
    if (!user) return undefined;
    
    const updateData = { ...updates };
    
    // Stringify JSON fields before updating
    if (updateData.favoriteFacilities) updateData.favoriteFacilities = JSON.stringify(updateData.favoriteFacilities) as any;
    if (updateData.preferredSports) updateData.preferredSports = JSON.stringify(updateData.preferredSports) as any;
    if (updateData.skillLevels) updateData.skillLevels = JSON.stringify(updateData.skillLevels) as any;
    if (updateData.achievements) updateData.achievements = JSON.stringify(updateData.achievements) as any;

    await query('UPDATE users SET ? WHERE id = ?', [updateData, userId]);
    return await dbGetUserById(userId);
}

export async function dbToggleFavoriteFacility(userId: string, facilityId: string): Promise<UserProfile | undefined> {
    const user = await dbGetUserById(userId);
    if (!user) return undefined;

    const favorites = user.favoriteFacilities || [];
    const isFavorited = favorites.includes(facilityId);
    const newFavorites = isFavorited
        ? favorites.filter(id => id !== facilityId)
        : [...favorites, facilityId];
    
    await dbUpdateUser(userId, { favoriteFacilities: newFavorites });
    return await dbGetUserById(userId);
}


// =================================================================
// FACILITY FUNCTIONS
// =================================================================

async function getFacilityRelations(facility: any): Promise<Facility> {
    const [sports] = await query('SELECT s.* FROM sports s JOIN facility_sports fs ON s.id = fs.sportId WHERE fs.facilityId = ?', [facility.id]);
    const [amenities] = await query('SELECT a.* FROM amenities a JOIN facility_amenities fa ON a.id = fa.amenityId WHERE fa.facilityId = ?', [facility.id]);
    const [sportPrices] = await query('SELECT * FROM sport_prices WHERE facilityId = ?', [facility.id]);
    const [operatingHours] = await query('SELECT * FROM operating_hours WHERE facilityId = ?', [facility.id]);
    const [equipment] = await query('SELECT * FROM rental_equipment WHERE facilityId = ?', [facility.id]);
    const [reviews] = await query('SELECT * FROM reviews WHERE facilityId = ?', [facility.id]);
    const [blockedSlots] = await query('SELECT * FROM blocked_slots WHERE facilityId = ?', [facility.id]);
    const [maintenanceSchedules] = await query('SELECT * FROM maintenance_schedules WHERE facilityId = ?', [facility.id]);

    return {
        ...facility,
        sports: sports as Sport[],
        amenities: amenities as Amenity[],
        sportPrices: (sportPrices as any[]).map(p => ({...p, price: parseFloat(p.price)})) as SportPrice[],
        operatingHours: operatingHours as FacilityOperatingHours[],
        availableEquipment: (equipment as any[]).map(e => ({...e, pricePerItem: parseFloat(e.pricePerItem)})) as RentalEquipment[],
        reviews: reviews as Review[],
        blockedSlots: blockedSlots as BlockedSlot[],
        maintenanceSchedules: (maintenanceSchedules as any[]).map(m => ({...m, lastPerformedDate: new Date(m.lastPerformedDate).toISOString()})) as MaintenanceSchedule[],
    };
}


export async function dbGetAllFacilities(): Promise<Facility[]> {
    const [rows] = await query('SELECT * FROM facilities');
    const facilities = await Promise.all((rows as any[]).map(row => getFacilityRelations(row)));
    return facilities;
}

export async function dbGetFacilityById(id: string): Promise<Facility | undefined> {
    const [rows] = await query('SELECT * FROM facilities WHERE id = ?', [id]);
    if ((rows as any[]).length === 0) return undefined;
    return await getFacilityRelations((rows as any)[0]);
}

export async function dbGetFacilitiesByIds(ids: string[]): Promise<Facility[]> {
    if (ids.length === 0) return [];
    const [rows] = await query('SELECT * FROM facilities WHERE id IN (?)', [ids]);
    const facilities = await Promise.all((rows as any[]).map(row => getFacilityRelations(row)));
    return facilities;
}

export async function dbGetFacilitiesByOwnerId(ownerId: string): Promise<Facility[]> {
    const [rows] = await query('SELECT * FROM facilities WHERE ownerId = ?', [ownerId]);
    const facilities = await Promise.all((rows as any[]).map(row => getFacilityRelations(row)));
    return facilities;
}


// =================================================================
// BOOKING FUNCTIONS
// =================================================================

export async function dbGetAllBookings(): Promise<Booking[]> {
    const [rows] = await query('SELECT * FROM bookings');
    return (rows as any[]).map(row => ({...row, baseFacilityPrice: parseFloat(row.baseFacilityPrice), equipmentRentalCost: parseFloat(row.equipmentRentalCost), totalPrice: parseFloat(row.totalPrice), appliedPromotion: JSON.parse(row.appliedPromotion || 'null'), rentedEquipment: JSON.parse(row.rentedEquipment || '[]') }));
}

export async function dbGetBookingById(id: string): Promise<Booking | undefined> {
    const [rows] = await query('SELECT * FROM bookings WHERE id = ?', [id]);
    if ((rows as any[]).length === 0) return undefined;
    const row = (rows as any)[0];
    return {...row, baseFacilityPrice: parseFloat(row.baseFacilityPrice), equipmentRentalCost: parseFloat(row.equipmentRentalCost), totalPrice: parseFloat(row.totalPrice), appliedPromotion: JSON.parse(row.appliedPromotion || 'null'), rentedEquipment: JSON.parse(row.rentedEquipment || '[]') };
}

export async function dbGetBookingsByUserId(userId: string): Promise<Booking[]> {
    const [rows] = await query('SELECT * FROM bookings WHERE userId = ?', [userId]);
    return (rows as any[]).map(row => ({...row, baseFacilityPrice: parseFloat(row.baseFacilityPrice), equipmentRentalCost: parseFloat(row.equipmentRentalCost), totalPrice: parseFloat(row.totalPrice), appliedPromotion: JSON.parse(row.appliedPromotion || 'null'), rentedEquipment: JSON.parse(row.rentedEquipment || '[]') }));
}

export async function dbGetBookingsForFacilityOnDate(facilityId: string, date: string): Promise<Booking[]> {
    const [rows] = await query('SELECT * FROM bookings WHERE facilityId = ? AND date = ? AND status = "Confirmed"', [facilityId, date]);
    return (rows as any[]).map(row => ({...row, baseFacilityPrice: parseFloat(row.baseFacilityPrice), equipmentRentalCost: parseFloat(row.equipmentRentalCost), totalPrice: parseFloat(row.totalPrice), appliedPromotion: JSON.parse(row.appliedPromotion || 'null'), rentedEquipment: JSON.parse(row.rentedEquipment || '[]') }));
}

export async function dbAddBooking(bookingData: Booking): Promise<Booking> {
    const payload = {
        ...bookingData,
        appliedPromotion: JSON.stringify(bookingData.appliedPromotion || null),
        rentedEquipment: JSON.stringify(bookingData.rentedEquipment || []),
    };
    await query('INSERT INTO bookings SET ?', [payload]);
    return bookingData;
}

export async function dbUpdateBooking(bookingId: string, updates: Partial<Booking>): Promise<Booking | undefined> {
    await query('UPDATE bookings SET ? WHERE id = ?', [updates, bookingId]);
    return dbGetBookingById(bookingId);
}


// =================================================================
// SPORT & AMENITY FUNCTIONS
// =================================================================

export async function dbGetAllSports(): Promise<Sport[]> {
    const [rows] = await query('SELECT * FROM sports');
    return rows as Sport[];
}

export async function dbGetSportById(id: string): Promise<Sport | undefined> {
    const [rows] = await query('SELECT * FROM sports WHERE id = ?', [id]);
    return (rows as any)[0];
}

export async function dbAddSport(sportData: Omit<Sport, 'id'>): Promise<Sport> {
    const newSport: Sport = { ...sportData, id: `sport-${uuidv4()}`};
    await query('INSERT INTO sports SET ?', [newSport]);
    return newSport;
}

export async function dbUpdateSport(sportId: string, sportData: Partial<Sport>): Promise<Sport> {
    await query('UPDATE sports SET ? WHERE id = ?', [sportData, sportId]);
    return (await dbGetSportById(sportId))!;
}

export async function dbDeleteSport(sportId: string): Promise<void> {
    await query('DELETE FROM sports WHERE id = ?', [sportId]);
}

export async function dbGetAllAmenities(): Promise<Amenity[]> {
    const [rows] = await query('SELECT * FROM amenities');
    return rows as Amenity[];
}

// =================================================================
// OTHER FUNCTIONS (to be implemented with DB)
// =================================================================
export async function dbAddNotification(userId: string, notificationData: Omit<AppNotification, 'id' | 'userId' | 'createdAt' | 'isRead'>): Promise<AppNotification> {
    const newNotification: AppNotification = {
      id: `notif-${uuidv4()}`,
      userId,
      ...notificationData,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    // In a real app, this would insert into a notifications table
    console.log("DATABASE: Adding notification", newNotification);
    return newNotification;
}
export async function dbAddReview(reviewData: Omit<Review, 'id' | 'createdAt' | 'userName' | 'userAvatar' | 'isPublicProfile'>): Promise<Review> {
    const user = await dbGetUserById(reviewData.userId);
    if (!user) throw new Error("User not found");

    const newReview: Review = {
        ...reviewData,
        id: `review-${uuidv4()}`,
        createdAt: new Date().toISOString(),
        userName: user.name,
        userAvatar: user.profilePictureUrl,
        isPublicProfile: user.isProfilePublic,
    };
    
    await query('INSERT INTO reviews SET ?', [newReview]);
    
    // Update facility rating
    const [stats] = await query('SELECT AVG(rating) as avgRating FROM reviews WHERE facilityId = ?', [reviewData.facilityId]);
    const newRating = (stats as any)[0].avgRating || 0;
    await query('UPDATE facilities SET rating = ? WHERE id = ?', [newRating, reviewData.facilityId]);

    // Mark booking as reviewed
    if (reviewData.bookingId) {
        await dbUpdateBooking(reviewData.bookingId, { reviewed: true });
    }
    
    return newReview;
}
export const dbBlockTimeSlot = async (facilityId: string, ownerId: string, newBlock: BlockedSlot): Promise<boolean> => {
    const facility = await dbGetFacilityById(facilityId);
    if (!facility || facility.ownerId !== ownerId) {
        return false;
    }
    await query('INSERT INTO blocked_slots SET facilityId = ?, ?', [facilityId, newBlock]);
    return true;
};

export const dbUnblockTimeSlot = async (facilityId: string, ownerId: string, date: string, startTime: string): Promise<boolean> => {
    const facility = await dbGetFacilityById(facilityId);
    if (!facility || facility.ownerId !== ownerId) {
        return false;
    }
    await query('DELETE FROM blocked_slots WHERE facilityId = ? AND date = ? AND startTime = ?', [facilityId, date, startTime]);
    return true;
};

// =================================================================
// MOCK FUNCTIONS (TO BE REMOVED/REPLACED)
// =================================================================
// Note: Some functions below are left as mock as they represent complex features
// not yet fully implemented in the database schema.

export const calculateDynamicPrice = ( basePricePerHour: number, selectedDate: Date, selectedSlot: TimeSlot, durationHours: number ): { finalPrice: number; appliedRuleName?: string, appliedRuleDetails?: PricingRule } => ({ finalPrice: basePricePerHour * durationHours });
export const getSiteSettings = (): SiteSettings => ({ siteName: 'Sports Arena', defaultCurrency: 'INR', timezone: 'Asia/Kolkata', maintenanceMode: false, notificationTemplates: [] });
export const getAllEvents = (): SportEvent[] => [];
export const getEventById = (id: string): SportEvent | undefined => undefined;
export const getAllMembershipPlans = (): MembershipPlan[] => [];
export const getAllPricingRules = (): PricingRule[] => [];
export const getAllPromotionRules = (): PromotionRule[] => [];
export const getPromotionRuleByCode = (code: string): PromotionRule | undefined => undefined;
export const getNotificationsForUser = (userId: string): AppNotification[] => [];
export const markNotificationAsRead = (userId: string, notificationId: string): void => {};
export const markAllNotificationsAsRead = (userId: string): void => {};
export const registerForEvent = (eventId: string): boolean => false;
export const getLfgRequestsByFacilityIds = (facilityIds: string[]): LfgRequest[] => [];
export const getChallengesByFacilityIds = (facilityIds: string[]): Challenge[] => [];
export const getOpenLfgRequests = (): LfgRequest[] => [];
export const createLfgRequest = (requestData: any): LfgRequest[] => [];
export const expressInterestInLfg = (lfgId: string, userId: string): LfgRequest[] => [];
export const getOpenChallenges = (): Challenge[] => [];
export const createChallenge = (data: any): Challenge[] => [];
export const acceptChallenge = (challengeId: string, opponentId: string): Challenge[] => [];
export const getTeamById = (teamId: string): Team | undefined => undefined;
export const getTeamsByUserId = (userId: string): Team[] => [];
export const createTeam = (teamData: any): Team => ({} as Team);
export const leaveTeam = (teamId: string, userId: string): boolean => false;
export const removeUserFromTeam = (teamId: string, memberIdToRemove: string, captainId: string): void => {};
export const transferCaptaincy = (teamId: string, newCaptainId: string, oldCaptainId: string): void => {};
export const deleteTeam = (teamId: string, captainId: string): void => {};
export const getAllBlogPosts = (): BlogPost[] => [];
export const getBlogPostBySlug = (slug: string): BlogPost | undefined => undefined;

// DEPRECATED FUNCTIONS
export const getStaticFacilities = (): Facility[] => [];
export const getStaticSports = (): Sport[] => [];
export const getStaticUsers = (): UserProfile[] => [];
export const getStaticAmenities = (): Amenity[] => [];

// Functions to be fully implemented with DB
export const dbAddFacility = async (facilityData: any): Promise<Facility> => {
    // This is a complex transaction in a real app
    console.log("Mock dbAddFacility", facilityData);
    const newFacility = { ...facilityData, id: `facility-${uuidv4()}`};
    return newFacility as Facility;
}
export const dbUpdateFacility = async (facilityData: any): Promise<Facility> => {
    console.log("Mock dbUpdateFacility", facilityData);
    return facilityData as Facility;
}
export const dbDeleteFacility = async (facilityId: string): Promise<void> => {
    console.log("Mock dbDeleteFacility", facilityId);
}
