
import type { Facility, Sport, Amenity, UserProfile, UserRole, UserStatus, Booking, ReportData, MembershipPlan, SportEvent, Review, AppNotification, NotificationType, BlogPost, PricingRule, PromotionRule, RentalEquipment, RentedItemInfo, AppliedPromotionInfo, TimeSlot, UserSkill, SkillLevel, BlockedSlot, SiteSettings, Team, WaitlistEntry, LfgRequest, SportPrice, NotificationTemplate, Challenge, MaintenanceSchedule } from './types';
import { query } from './db';
import { v4 as uuidv4 } from 'uuid';

// =================================================================
// USER FUNCTIONS
// =================================================================

export async function dbGetAllUsers(): Promise<UserProfile[]> {
  const [rows] = await query('SELECT * FROM users');
  return (rows as any[]).map(row => ({...row, favoriteFacilities: JSON.parse(row.favoriteFacilities || '[]'), preferredSports: JSON.parse(row.preferredSports || '[]'), skillLevels: JSON.parse(row.skillLevels || '[]'), achievements: JSON.parse(row.achievements || '[]'), teamIds: JSON.parse(row.teamIds || '[]')  }));
}

export async function dbGetUserById(id: string): Promise<UserProfile | undefined> {
  const [rows] = await query('SELECT * FROM users WHERE id = ?', [id]);
  if ((rows as any[]).length === 0) return undefined;
  const row = (rows as any)[0];
  return {...row, favoriteFacilities: JSON.parse(row.favoriteFacilities || '[]'), preferredSports: JSON.parse(row.preferredSports || '[]'), skillLevels: JSON.parse(row.skillLevels || '[]'), achievements: JSON.parse(row.achievements || '[]'), teamIds: JSON.parse(row.teamIds || '[]')  };
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
      achievements: [],
      teamIds: [],
  };

  await query('INSERT INTO users SET ?', { ...newUser, password: newUser.password || null, favoriteFacilities: '[]', preferredSports: '[]', skillLevels: '[]', achievements: '[]', teamIds: '[]' });
  return newUser;
}

export async function dbUpdateUser(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | undefined> {
    const user = await dbGetUserById(userId);
    if (!user) return undefined;
    
    const updateData: Record<string, any> = { ...updates };
    
    // Serialize array/object fields to JSON strings
    ['favoriteFacilities', 'preferredSports', 'skillLevels', 'achievements', 'teamIds'].forEach(key => {
        if (updateData[key] && Array.isArray(updateData[key])) {
            updateData[key] = JSON.stringify(updateData[key]);
        }
    });

    // Remove id from update payload
    delete updateData.id;

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
    
    return await dbUpdateUser(userId, { favoriteFacilities: newFavorites });
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
    const [reviews] = await query('SELECT * FROM reviews WHERE facilityId = ? ORDER BY createdAt DESC', [facility.id]);
    const [blockedSlots] = await query('SELECT * FROM blocked_slots WHERE facilityId = ?', [facility.id]);
    const [maintenanceSchedules] = await query('SELECT * FROM maintenance_schedules WHERE facilityId = ?', [facility.id]);

    return {
        ...facility,
        sports: sports as Sport[],
        amenities: amenities as Amenity[],
        sportPrices: (sportPrices as any[]).map(p => ({...p, price: parseFloat(p.price)})) as SportPrice[],
        operatingHours: operatingHours as FacilityOperatingHours[],
        availableEquipment: (equipment as any[]).map(e => ({...e, pricePerItem: parseFloat(e.pricePerItem), sportIds: JSON.parse(e.sportIds || '[]')})) as RentalEquipment[],
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
// SPORT, AMENITY, and Other static-like data
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
// OTHER DYNAMIC FUNCTIONS
// =================================================================
export async function dbAddNotification(userId: string, notificationData: Omit<AppNotification, 'id' | 'userId' | 'createdAt' | 'isRead'>): Promise<AppNotification> {
    const newNotification: AppNotification = {
      id: `notif-${uuidv4()}`,
      userId,
      ...notificationData,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    await query('INSERT INTO notifications SET ?', newNotification);
    return newNotification;
}

export async function dbGetNotificationsForUser(userId: string): Promise<AppNotification[]> {
    const [rows] = await query('SELECT * FROM notifications WHERE userId = ? ORDER BY createdAt DESC', [userId]);
    return rows as AppNotification[];
}

export async function dbMarkNotificationAsRead(userId: string, notificationId: string): Promise<void> {
    await query('UPDATE notifications SET isRead = 1 WHERE id = ? AND userId = ?', [notificationId, userId]);
}

export async function dbMarkAllNotificationsAsRead(userId: string): Promise<void> {
    await query('UPDATE notifications SET isRead = 1 WHERE userId = ?', [userId]);
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
export async function dbBlockTimeSlot(facilityId: string, ownerId: string, newBlock: Omit<BlockedSlot, 'id'>): Promise<boolean> {
    const facility = await dbGetFacilityById(facilityId);
    if (!facility || facility.ownerId !== ownerId) {
        return false;
    }
    await query('INSERT INTO blocked_slots (facilityId, date, startTime, endTime, reason) VALUES (?, ?, ?, ?, ?)', [facilityId, newBlock.date, newBlock.startTime, newBlock.endTime, newBlock.reason]);
    return true;
};

export async function dbUnblockTimeSlot(facilityId: string, ownerId: string, date: string, startTime: string): Promise<boolean> {
    const facility = await dbGetFacilityById(facilityId);
    if (!facility || facility.ownerId !== ownerId) {
        return false;
    }
    await query('DELETE FROM blocked_slots WHERE facilityId = ? AND date = ? AND startTime = ?', [facilityId, date, startTime]);
    return true;
};

// =================================================================
// TEAM, CHALLENGE, LFG FUNCTIONS
// =================================================================

export async function dbGetTeamById(teamId: string): Promise<Team | undefined> {
    const [rows] = await query('SELECT * FROM teams WHERE id = ?', [teamId]);
    if ((rows as any[]).length === 0) return undefined;
    const row = (rows as any)[0];
    const sport = await dbGetSportById(row.sportId);
    if (!sport) throw new Error("Sport for team not found");
    return {...row, memberIds: JSON.parse(row.memberIds || '[]'), sport };
}

export async function dbGetTeamsByUserId(userId: string): Promise<Team[]> {
    const [rows] = await query('SELECT * FROM teams WHERE JSON_CONTAINS(memberIds, ?)', [`"${userId}"`]);
    const teams = await Promise.all((rows as any[]).map(async row => {
        const sport = await dbGetSportById(row.sportId);
        return {...row, memberIds: JSON.parse(row.memberIds || '[]'), sport: sport! };
    }));
    return teams.filter(team => team.sport);
}

export async function dbCreateTeam(teamData: { name: string, sportId: string, captainId: string }): Promise<Team> {
    const sport = await dbGetSportById(teamData.sportId);
    if (!sport) throw new Error("Sport not found");

    const newTeam: Omit<Team, 'sport'> = {
        id: `team-${uuidv4()}`,
        name: teamData.name,
        sportId: sport.id,
        captainId: teamData.captainId,
        memberIds: [teamData.captainId],
    };

    await query('INSERT INTO teams SET ?', { ...newTeam, memberIds: JSON.stringify(newTeam.memberIds) });
    const user = await dbGetUserById(teamData.captainId);
    if(user && user.teamIds) {
        const teamIds = [...user.teamIds, newTeam.id];
        await dbUpdateUser(user.id, {teamIds});
    }

    return {...newTeam, sport};
}

export async function dbLeaveTeam(teamId: string, userId: string): Promise<boolean> {
    const team = await dbGetTeamById(teamId);
    if (!team) throw new Error("Team not found");
    if (team.captainId === userId && team.memberIds.length > 1) {
        throw new Error("Captain cannot leave a team with other members. Please transfer captaincy first.");
    }
    if (team.memberIds.length === 1 && team.captainId === userId) {
        await query('DELETE FROM teams WHERE id = ?', [teamId]);
    } else {
        const newMemberIds = team.memberIds.filter(id => id !== userId);
        await query('UPDATE teams SET memberIds = ? WHERE id = ?', [JSON.stringify(newMemberIds), teamId]);
    }

    const user = await dbGetUserById(userId);
    if(user && user.teamIds) {
        const teamIds = user.teamIds.filter(id => id !== teamId);
        await dbUpdateUser(user.id, {teamIds});
    }

    return true;
}

export async function dbRemoveUserFromTeam(teamId: string, memberIdToRemove: string, currentUserId: string): Promise<void> {
    const team = await dbGetTeamById(teamId);
    if (!team || team.captainId !== currentUserId) {
        throw new Error("Only the team captain can remove members.");
    }
    const newMemberIds = team.memberIds.filter(id => id !== memberIdToRemove);
    await query('UPDATE teams SET memberIds = ? WHERE id = ?', [JSON.stringify(newMemberIds), teamId]);

    const user = await dbGetUserById(memberIdToRemove);
    if(user && user.teamIds) {
        const teamIds = user.teamIds.filter(id => id !== teamId);
        await dbUpdateUser(user.id, {teamIds});
    }
}

export async function dbTransferCaptaincy(teamId: string, newCaptainId: string, currentUserId: string): Promise<void> {
    const team = await dbGetTeamById(teamId);
    if (!team || team.captainId !== currentUserId) {
        throw new Error("Only the team captain can transfer captaincy.");
    }
    await query('UPDATE teams SET captainId = ? WHERE id = ?', [newCaptainId, teamId]);
}

export async function dbDeleteTeam(teamId: string, currentUserId: string): Promise<void> {
    const team = await dbGetTeamById(teamId);
    if (!team || team.captainId !== currentUserId) {
        throw new Error("Only the team captain can disband the team.");
    }
    // Remove team from all members' profiles
    for (const memberId of team.memberIds) {
        const user = await dbGetUserById(memberId);
        if(user && user.teamIds) {
            const teamIds = user.teamIds.filter(id => id !== teamId);
            await dbUpdateUser(user.id, {teamIds});
        }
    }
    await query('DELETE FROM teams WHERE id = ?', [teamId]);
}

export async function dbGetOpenLfgRequests(): Promise<LfgRequest[]> {
    const [rows] = await query("SELECT * FROM lfg_requests WHERE status = 'open' ORDER BY createdAt DESC");
    return (rows as any[]).map(row => ({...row, interestedUserIds: JSON.parse(row.interestedUserIds || '[]')}));
}

export async function dbGetLfgRequestsByFacilityIds(facilityIds: string[]): Promise<LfgRequest[]> {
    if (facilityIds.length === 0) return [];
    const [rows] = await query("SELECT * FROM lfg_requests WHERE facilityId IN (?) ORDER BY createdAt DESC", [facilityIds]);
    return (rows as any[]).map(row => ({...row, interestedUserIds: JSON.parse(row.interestedUserIds || '[]')}));
}

export async function dbCreateLfgRequest(requestData: Omit<LfgRequest, 'id' | 'createdAt' | 'status' | 'interestedUserIds'>): Promise<LfgRequest> {
    const newRequest: LfgRequest = {
        ...requestData,
        id: `lfg-${uuidv4()}`,
        createdAt: new Date().toISOString(),
        status: 'open',
        interestedUserIds: [],
    };
    await query('INSERT INTO lfg_requests SET ?', { ...newRequest, interestedUserIds: '[]' });
    return newRequest;
}

export async function dbExpressInterestInLfg(lfgId: string, userId: string): Promise<LfgRequest | undefined> {
    const [rows] = await query('SELECT * FROM lfg_requests WHERE id = ?', [lfgId]);
    if ((rows as any[]).length === 0) throw new Error("Request not found");
    const req = (rows as any)[0];
    const interestedUserIds = JSON.parse(req.interestedUserIds || '[]');
    if (!interestedUserIds.includes(userId)) {
        interestedUserIds.push(userId);
        await query('UPDATE lfg_requests SET interestedUserIds = ? WHERE id = ?', [JSON.stringify(interestedUserIds), lfgId]);
        req.interestedUserIds = interestedUserIds;
    }
    return req;
}

export async function dbGetOpenChallenges(): Promise<Challenge[]> {
    const [rows] = await query("SELECT * FROM challenges WHERE status = 'open' ORDER BY createdAt DESC");
    const challenges = await Promise.all((rows as any[]).map(async row => {
        const [challenger, sport] = await Promise.all([
            dbGetUserById(row.challengerId),
            dbGetSportById(row.sportId)
        ]);
        return {...row, challenger, sport };
    }));
    return challenges as Challenge[];
}

export async function dbGetChallengesByFacilityIds(facilityIds: string[]): Promise<Challenge[]> {
    if (facilityIds.length === 0) return [];
    const [rows] = await query("SELECT * FROM challenges WHERE facilityId IN (?) ORDER BY createdAt DESC", [facilityIds]);
    const challenges = await Promise.all((rows as any[]).map(async row => {
        const [challenger, sport] = await Promise.all([
            dbGetUserById(row.challengerId),
            dbGetSportById(row.sportId)
        ]);
        return {...row, challenger, sport };
    }));
    return challenges as Challenge[];
}

export async function dbCreateChallenge(challengeData: Omit<Challenge, 'id' | 'challenger' | 'sport' | 'createdAt' | 'status'>): Promise<Challenge> {
    const [challenger, sport] = await Promise.all([dbGetUserById(challengeData.challengerId), dbGetSportById(challengeData.sportId)]);
    if (!challenger || !sport) throw new Error("Invalid user or sport");

    const newChallenge = {
        ...challengeData,
        id: `chl-${uuidv4()}`,
        createdAt: new Date().toISOString(),
        status: 'open' as const,
    };
    await query('INSERT INTO challenges (id, challengerId, sportId, facilityId, facilityName, proposedDate, notes, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', 
        [newChallenge.id, newChallenge.challengerId, newChallenge.sportId, newChallenge.facilityId, newChallenge.facilityName, newChallenge.proposedDate, newChallenge.notes, newChallenge.status, newChallenge.createdAt]);
    
    return { ...newChallenge, challenger, sport };
}

export async function dbAcceptChallenge(challengeId: string, opponentId: string): Promise<Challenge | undefined> {
    await query("UPDATE challenges SET status = 'accepted', opponentId = ? WHERE id = ?", [opponentId, challengeId]);
    const [rows] = await query("SELECT * FROM challenges WHERE id = ?", [challengeId]);
    if ((rows as any[]).length === 0) return undefined;
    const row = (rows as any)[0];
    const [challenger, opponent, sport] = await Promise.all([dbGetUserById(row.challengerId), dbGetUserById(row.opponentId), dbGetSportById(row.sportId)]);
    return {...row, challenger, opponent, sport};
}


// =================================================================
// MOCK FUNCTIONS (TO BE REMOVED/REPLACED) -> REAL IMPLEMENTATIONS
// =================================================================
export const getSiteSettings = (): SiteSettings => ({ siteName: 'Sports Arena', defaultCurrency: 'INR', timezone: 'Asia/Kolkata', maintenanceMode: false, notificationTemplates: [] });
export const updateSiteSettings = (settings: SiteSettings) => {};

// Events
export async function getAllEvents(): Promise<SportEvent[]> {
    const [rows] = await query('SELECT * FROM events ORDER BY startDate DESC');
    const events = await Promise.all((rows as any[]).map(async (row) => {
        const sport = await dbGetSportById(row.sportId);
        return { ...row, sport: sport! };
    }));
    return events;
}

export async function getEventsByFacilityIds(facilityIds: string[]): Promise<SportEvent[]> {
    if (facilityIds.length === 0) return [];
    const [rows] = await query("SELECT * FROM events WHERE facilityId IN (?) ORDER BY startDate DESC", [facilityIds]);
    const events = await Promise.all((rows as any[]).map(async (row) => {
        const sport = await dbGetSportById(row.sportId);
        return { ...row, sport: sport! };
    }));
    return events;
}

export async function getEventById(id: string): Promise<SportEvent | undefined> {
    const [rows] = await query('SELECT * FROM events WHERE id = ?', [id]);
    if ((rows as any[]).length === 0) return undefined;
    const row = (rows as any)[0];
    const sport = await dbGetSportById(row.sportId);
    return { ...row, sport: sport! };
}

export async function addEvent(eventData: any): Promise<void> {
    const newEvent = { ...eventData, id: `event-${uuidv4()}` };
    await query('INSERT INTO events SET ?', newEvent);
}

export async function updateEvent(eventData: any): Promise<void> {
    await query('UPDATE events SET ? WHERE id = ?', [eventData, eventData.id]);
}

export async function deleteEvent(id: string): Promise<void> {
    await query('DELETE FROM events WHERE id = ?', [id]);
}

export async function registerForEvent(eventId: string): Promise<boolean> {
    const [event] = (await query('SELECT registeredParticipants, maxParticipants FROM events WHERE id = ?', [eventId])) as any[];
    if (!event || (event[0].maxParticipants !== 0 && event[0].registeredParticipants >= event[0].maxParticipants)) {
        return false;
    }
    await query('UPDATE events SET registeredParticipants = registeredParticipants + 1 WHERE id = ?', [eventId]);
    return true;
}


// Membership Plans
export async function getAllMembershipPlans(): Promise<MembershipPlan[]> {
    const [rows] = await query('SELECT * FROM membership_plans');
    return (rows as any[]).map(row => ({...row, benefits: JSON.parse(row.benefits || '[]')}));
}
export async function getMembershipPlanById(id: string): Promise<MembershipPlan | undefined> {
    const [rows] = await query('SELECT * FROM membership_plans WHERE id = ?', [id]);
    if ((rows as any[]).length === 0) return undefined;
    const row = (rows as any)[0];
    return { ...row, benefits: JSON.parse(row.benefits || '[]') };
}
export async function addMembershipPlan(data: Omit<MembershipPlan, 'id'>): Promise<void> {
    const newPlan = { id: `plan-${uuidv4()}`, ...data, benefits: JSON.stringify(data.benefits) };
    await query('INSERT INTO membership_plans SET ?', newPlan);
}
export async function updateMembershipPlan(data: MembershipPlan): Promise<void> {
    const payload = { ...data, benefits: JSON.stringify(data.benefits) };
    await query('UPDATE membership_plans SET ? WHERE id = ?', [payload, data.id]);
}
export async function deleteMembershipPlan(id: string): Promise<void> {
    await query('DELETE FROM membership_plans WHERE id = ?', [id]);
}

// Pricing Rules
export async function getAllPricingRules(): Promise<PricingRule[]> {
    const [rows] = await query('SELECT * FROM pricing_rules');
    return (rows as any[]).map(row => ({...row, daysOfWeek: JSON.parse(row.daysOfWeek || 'null'), timeRange: JSON.parse(row.timeRange || 'null'), dateRange: JSON.parse(row.dateRange || 'null') }));
}
export async function getPricingRuleById(id: string): Promise<PricingRule | undefined> {
    const [rows] = await query('SELECT * FROM pricing_rules WHERE id = ?', [id]);
    if ((rows as any[]).length === 0) return undefined;
    const row = (rows as any)[0];
    return { ...row, daysOfWeek: JSON.parse(row.daysOfWeek || 'null'), timeRange: JSON.parse(row.timeRange || 'null'), dateRange: JSON.parse(row.dateRange || 'null') };
}
export async function addPricingRule(data: Omit<PricingRule, 'id'>): Promise<void> {
    const newRule = { id: `pr-${uuidv4()}`, ...data, daysOfWeek: JSON.stringify(data.daysOfWeek || null), timeRange: JSON.stringify(data.timeRange || null), dateRange: JSON.stringify(data.dateRange || null) };
    await query('INSERT INTO pricing_rules SET ?', newRule);
}
export async function updatePricingRule(data: PricingRule): Promise<void> {
    const payload = { ...data, daysOfWeek: JSON.stringify(data.daysOfWeek || null), timeRange: JSON.stringify(data.timeRange || null), dateRange: JSON.stringify(data.dateRange || null) };
    await query('UPDATE pricing_rules SET ? WHERE id = ?', [payload, data.id]);
}
export async function deletePricingRule(id: string): Promise<void> {
    await query('DELETE FROM pricing_rules WHERE id = ?', [id]);
}

// Promotion Rules
export async function getAllPromotionRules(): Promise<PromotionRule[]> {
    const [rows] = await query('SELECT * FROM promotion_rules');
    return rows as PromotionRule[];
}
export async function getPromotionRuleById(id: string): Promise<PromotionRule | undefined> {
    const [rows] = await query('SELECT * FROM promotion_rules WHERE id = ?', [id]);
    return (rows as any)[0];
}
export async function getPromotionRuleByCode(code: string): Promise<PromotionRule | undefined> {
    const [rows] = await query('SELECT * FROM promotion_rules WHERE code = ? AND isActive = 1', [code]);
    // Add logic here to check for validity (date range, usage limits)
    return (rows as any)[0];
}
export async function addPromotionRule(data: Omit<PromotionRule, 'id'>): Promise<void> {
    const newRule = { id: `promo-${uuidv4()}`, ...data };
    await query('INSERT INTO promotion_rules SET ?', newRule);
}
export async function updatePromotionRule(data: PromotionRule): Promise<void> {
    await query('UPDATE promotion_rules SET ? WHERE id = ?', [data, data.id]);
}
export async function deletePromotionRule(id: string): Promise<void> {
    await query('DELETE FROM promotion_rules WHERE id = ?', [id]);
}

// Blog Posts (kept as simple mocks for now as it's not a core DB feature)
export const getAllBlogPosts = async (): Promise<BlogPost[]> => [];
export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | undefined> => undefined;

export const dbAddFacility = async (facilityData: any): Promise<Facility> => { console.log("Mock dbAddFacility", facilityData); const newFacility = { ...facilityData, id: `facility-${uuidv4()}`}; return newFacility as Facility; }
export const dbUpdateFacility = async (facilityData: any): Promise<Facility> => { console.log("Mock dbUpdateFacility", facilityData); return facilityData as Facility; }
export const dbDeleteFacility = async (facilityId: string): Promise<void> => { console.log("Mock dbDeleteFacility", facilityId); }
    
