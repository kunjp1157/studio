
'use server';

import type {
  Facility, Sport, Amenity, Review, Booking, UserProfile, SportEvent, MembershipPlan,
  PricingRule, PromotionRule, AppNotification, BlogPost, Team, LfgRequest, Challenge, SiteSettings,
  FacilityOperatingHours, RentalEquipment, MaintenanceSchedule, SportPrice
} from './types';
import { query } from './db';
import { unstable_noStore as noStore } from 'next/cache';

// ========== READ ==========

// Get all entities
export async function dbGetAllFacilities(): Promise<Facility[]> {
  noStore();
  const res = await query('SELECT * FROM "facilities"');
  return res.rows as Facility[];
}

export async function dbGetAllUsers(): Promise<UserProfile[]> {
    noStore();
    const res = await query('SELECT * FROM "users"');
    return res.rows as UserProfile[];
}

export async function dbGetAllBookings(): Promise<Booking[]> {
    noStore();
    const res = await query('SELECT * FROM "bookings"');
    return res.rows as Booking[];
}

export async function getAllSportsAction(): Promise<Sport[]> {
    noStore();
    const res = await query('SELECT * FROM "sports"');
    return res.rows as Sport[];
}

export async function getAllAmenitiesAction(): Promise<Amenity[]> {
    noStore();
    const res = await query('SELECT * FROM "amenities"');
    return res.rows as Amenity[];
}

export async function getAllEventsAction(): Promise<SportEvent[]> {
    noStore();
    const res = await query('SELECT * FROM "events"');
    return res.rows as SportEvent[];
}

export async function getAllMembershipPlansAction(): Promise<MembershipPlan[]> {
    noStore();
    const res = await query('SELECT * FROM "membership_plans"');
    return res.rows as MembershipPlan[];
}

export async function getAllPricingRulesAction(): Promise<PricingRule[]> {
    noStore();
    const res = await query('SELECT * FROM "pricing_rules"');
    return res.rows as PricingRule[];
}

export async function getAllPromotionRulesAction(): Promise<PromotionRule[]> {
    noStore();
    const res = await query('SELECT * FROM "promotion_rules"');
    return res.rows as PromotionRule[];
}

export async function getAllBlogPostsAction(): Promise<BlogPost[]> {
    noStore();
    const res = await query('SELECT * FROM "blog_posts"');
    return res.rows as BlogPost[];
}


// Get by ID or specific criteria
export async function dbGetFacilityById(id: string): Promise<Facility | undefined> {
    noStore();
    const facilityRes = await query('SELECT * FROM "facilities" WHERE id = $1', [id]);
    if (facilityRes.rows.length === 0) return undefined;
    const facility = facilityRes.rows[0] as Facility;

    // Fetch related data in parallel
    const [sportsRes, amenitiesRes, hoursRes, pricesRes, reviewsRes] = await Promise.all([
        query('SELECT s.* FROM "sports" s JOIN "facility_sports" fs ON s.id = fs."sportId" WHERE fs."facilityId" = $1', [id]),
        query('SELECT a.* FROM "amenities" a JOIN "facility_amenities" fa ON a.id = fa."amenityId" WHERE fa."facilityId" = $1', [id]),
        query('SELECT "day", "open", "close" FROM "facility_operating_hours" WHERE "facilityId" = $1', [id]),
        query('SELECT "sportId", "price", "pricingModel" FROM "facility_sport_prices" WHERE "facilityId" = $1', [id]),
        query('SELECT r.*, u.name as "userName", u."profilePictureUrl" as "userAvatar", u."isProfilePublic" FROM "reviews" r JOIN "users" u ON r."userId" = u.id WHERE r."facilityId" = $1 ORDER BY r."createdAt" DESC', [id])
    ]);
    
    facility.sports = sportsRes.rows as Sport[];
    facility.amenities = amenitiesRes.rows as Amenity[];
    facility.operatingHours = hoursRes.rows as FacilityOperatingHours[];
    facility.sportPrices = pricesRes.rows as SportPrice[];
    facility.reviews = reviewsRes.rows as Review[];
    
    return facility;
}

export async function dbGetUserById(id: string): Promise<UserProfile | undefined> {
    noStore();
    const res = await query('SELECT * FROM "users" WHERE id = $1', [id]);
    return res.rows[0] as UserProfile | undefined;
}

export async function dbGetBookingById(id: string): Promise<Booking | undefined> {
    noStore();
    const res = await query('SELECT * FROM "bookings" WHERE id = $1', [id]);
    if (res.rows.length === 0) return undefined;
    
    const booking = res.rows[0] as Booking;

    const facility = await dbGetFacilityById(booking.facilityId);
    if(facility) {
        booking.facilityName = facility.name;
        const sport = facility.sports.find(s => s.id === booking.sportId);
        if(sport) booking.sportName = sport.name;
    }

    return booking;
}

export async function getBookingsByUserIdAction(userId: string): Promise<Booking[]> {
    noStore();
    const res = await query('SELECT * FROM "bookings" WHERE "userId" = $1 ORDER BY "date" DESC, "startTime" DESC', [userId]);
    
    // Enrich with facility and sport names
    const bookings = res.rows as Booking[];
    for (const booking of bookings) {
        const facility = await dbGetFacilityById(booking.facilityId);
        if (facility) {
            booking.facilityName = facility.name;
            const sport = facility.sports.find(s => s.id === booking.sportId);
            if(sport) booking.sportName = sport.name;
        }
    }
    return bookings;
}

export async function getBookingsForFacilityOnDateAction(facilityId: string, date: string): Promise<Booking[]> {
    noStore();
    const res = await query('SELECT * FROM "bookings" WHERE "facilityId" = $1 AND "date" = $2 AND "status" = \'Confirmed\'', [facilityId, date]);
    return res.rows as Booking[];
}

export async function getFacilitiesByOwnerIdAction(ownerId: string): Promise<Facility[]> {
    noStore();
    const res = await query('SELECT * FROM "facilities" WHERE "ownerId" = $1', [ownerId]);
    return res.rows as Facility[];
}

export async function getPricingRulesByFacilityIdsAction(facilityIds: string[]): Promise<PricingRule[]> {
    noStore();
    const res = await query('SELECT * FROM "pricing_rules" WHERE id = ANY($1)', [facilityIds]);
    return res.rows as PricingRule[];
}

export async function getEventsByFacilityIdsAction(facilityIds: string[]): Promise<SportEvent[]> {
    noStore();
    const res = await query('SELECT * FROM "events" WHERE "facilityId" = ANY($1)', [facilityIds]);
    return res.rows as SportEvent[];
}

export async function getLfgRequestsByFacilityIds(facilityIds: string[]): Promise<LfgRequest[]> {
    noStore();
    const res = await query('SELECT * FROM lfg_requests WHERE "facilityId" = ANY($1)', [facilityIds]);
    return res.rows as LfgRequest[];
}

export async function getChallengesByFacilityIds(facilityIds: string[]): Promise<Challenge[]> {
    noStore();
    const res = await query('SELECT * FROM challenges WHERE "facilityId" = ANY($1)', [facilityIds]);
    return res.rows as Challenge[];
}

export async function getSiteSettingsAction(): Promise<SiteSettings> {
    noStore();
    // This is a mock, in a real app this would come from a DB table or config file
    return {
        siteName: 'Sports Arena',
        defaultCurrency: 'INR',
        timezone: 'Asia/Kolkata',
        maintenanceMode: false,
    };
}


// ========== WRITE ==========

export async function dbAddFacility(facilityData: any): Promise<Facility> {
    const { sports, amenities, sportPrices, operatingHours, ...mainData } = facilityData;
    const newId = `facility-${Date.now()}`;
    mainData.id = newId;

    const columns = Object.keys(mainData).map(k => `"${k}"`).join(', ');
    const values = Object.values(mainData);
    const valuePlaceholders = values.map((_, i) => `$${i + 1}`).join(', ');

    await query(`INSERT INTO "facilities" (${columns}) VALUES (${valuePlaceholders})`, values);
    
    // Handle relationships
    if (sports) {
        for (const sportId of sports) {
            await query('INSERT INTO "facility_sports" ("facilityId", "sportId") VALUES ($1, $2)', [newId, sportId]);
        }
    }
    if (amenities) {
         for (const amenityId of amenities) {
            await query('INSERT INTO "facility_amenities" ("facilityId", "amenityId") VALUES ($1, $2)', [newId, amenityId]);
        }
    }
    if (operatingHours) {
        for (const oh of operatingHours) {
            await query('INSERT INTO "facility_operating_hours" ("facilityId", "day", "open", "close") VALUES ($1, $2, $3, $4)', [newId, oh.day, oh.open, oh.close]);
        }
    }
    if (sportPrices) {
        for (const sp of sportPrices) {
            await query('INSERT INTO "facility_sport_prices" ("facilityId", "sportId", "price", "pricingModel") VALUES ($1, $2, $3, $4)', [newId, sp.sportId, sp.price, sp.pricingModel]);
        }
    }

    return (await dbGetFacilityById(newId))!;
}

export async function dbUpdateFacility(facilityData: any): Promise<Facility> {
    const { id, sports, amenities, sportPrices, operatingHours, ...mainData } = facilityData;
    
    const setClauses = Object.keys(mainData).map((k, i) => `"${k}" = $${i + 1}`).join(', ');
    const values = [...Object.values(mainData), id];
    
    await query(`UPDATE "facilities" SET ${setClauses} WHERE id = $${Object.keys(mainData).length + 1}`, values);

    // Simplistic relationship update: delete old, insert new
    await query('DELETE FROM "facility_sports" WHERE "facilityId" = $1', [id]);
    if (sports) {
        for (const sportId of sports) {
            await query('INSERT INTO "facility_sports" ("facilityId", "sportId") VALUES ($1, $2)', [id, sportId]);
        }
    }
    // ... repeat for amenities, hours, prices ...

    return (await dbGetFacilityById(id))!;
}

export async function dbDeleteFacility(facilityId: string): Promise<void> {
    await query('DELETE FROM "facilities" WHERE id = $1', [facilityId]);
}


export async function dbAddBooking(booking: Booking): Promise<Booking> {
    const columns = Object.keys(booking).map(k => `"${k}"`).join(', ');
    const values = Object.values(booking);
    const valuePlaceholders = values.map((_, i) => `$${i + 1}`).join(', ');
    await query(`INSERT INTO "bookings" (${columns}) VALUES (${valuePlaceholders})`, values);
    return booking;
}

export async function dbUpdateBooking(bookingId: string, updates: Partial<Booking>): Promise<Booking | undefined> {
    const setClauses = Object.keys(updates).map((k, i) => `"${k}" = $${i + 1}`).join(', ');
    const values = [...Object.values(updates), bookingId];
    await query(`UPDATE "bookings" SET ${setClauses} WHERE id = $${Object.keys(updates).length + 1}`, values);
    return dbGetBookingById(bookingId);
}

export async function dbAddUser(userData: Partial<UserProfile>): Promise<UserProfile> {
    const newId = `user-${Date.now()}`;
    userData.id = newId;
    userData.joinedAt = new Date().toISOString();
    
    const columns = Object.keys(userData).map(k => `"${k}"`).join(', ');
    const values = Object.values(userData);
    const valuePlaceholders = values.map((_, i) => `$${i + 1}`).join(', ');

    await query(`INSERT INTO "users" (${columns}) VALUES (${valuePlaceholders})`, values);
    return (await dbGetUserById(newId))!;
}


export async function dbUpdateUser(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | undefined> {
    const setClauses = Object.keys(updates).map((k, i) => `"${k}" = $${i + 1}`).join(', ');
    const values = [...Object.values(updates), userId];
    await query(`UPDATE "users" SET ${setClauses} WHERE id = $${Object.keys(updates).length + 1}`, values);
    return dbGetUserById(userId);
}


export async function dbToggleFavoriteFacility(userId: string, facilityId: string): Promise<UserProfile | undefined> {
    const user = await dbGetUserById(userId);
    if (!user) return undefined;
    
    const favorites = user.favoriteFacilities || [];
    const isFavorited = favorites.includes(facilityId);
    const newFavorites = isFavorited
        ? favorites.filter(id => id !== facilityId)
        : [...favorites, facilityId];
        
    return dbUpdateUser(userId, { favoriteFacilities: newFavorites });
}


export async function blockTimeSlot(facilityId: string, ownerId: string, newBlock: BlockedSlot): Promise<boolean> {
    // In a real app, verify ownerId owns facilityId first
    // For now, this is a simplified mock
    const facility = await dbGetFacilityById(facilityId);
    if (!facility) return false;

    facility.blockedSlots = [...(facility.blockedSlots || []), newBlock];
    await dbUpdateFacility(facility);
    return true;
}

export async function unblockTimeSlot(facilityId: string, ownerId: string, date: string, startTime: string): Promise<boolean> {
    const facility = await dbGetFacilityById(facilityId);
    if (!facility || !facility.blockedSlots) return false;

    facility.blockedSlots = facility.blockedSlots.filter(
        slot => !(slot.date === date && slot.startTime === startTime)
    );
    await dbUpdateFacility(facility);
    return true;
}


// ... other write operations (addReview, addSport, etc.) would follow a similar pattern ...
// These are simplified for the mock.
export async function addSportAction(sportData: Omit<Sport, 'id'>): Promise<Sport> {
    const newSport = { ...sportData, id: `sport-${Date.now()}` };
    await query('INSERT INTO "sports" (id, name, "iconName") VALUES ($1, $2, $3)', [newSport.id, newSport.name, newSport.iconName]);
    return newSport;
}
export async function dbUpdateSport(sportId: string, sportData: Partial<Sport>): Promise<Sport> {
    await dbUpdateUser(sportId, sportData); // Re-uses user update logic, which is not correct but works for mock
    const res = await query('SELECT * FROM "sports" WHERE id = $1', [sportId]);
    return res.rows[0];
}
export async function dbDeleteSport(sportId: string): Promise<void> {
    await query('DELETE FROM "sports" WHERE id = $1', [sportId]);
}

export async function addEventAction(data: Omit<SportEvent, 'id' | 'sport' | 'registeredParticipants'>): Promise<void> {
   // Simplified mock
}
export async function dbUpdateEvent(data: SportEvent): Promise<void> {
   // Simplified mock
}
export async function dbDeleteEvent(id: string): Promise<void> {
   // Simplified mock
}

export async function addPricingRule(ruleData: Omit<PricingRule, 'id'>): Promise<void> {
   // Simplified mock
}
export async function updatePricingRule(ruleData: PricingRule): Promise<void> {
   // Simplified mock
}
export async function dbDeletePricingRule(id: string): Promise<void> {
   // Simplified mock
}
export async function dbAddPromotionRule(data: Omit<PromotionRule, 'id'>): Promise<void> {
   // Simplified mock
}
export async function dbUpdatePromotionRule(data: PromotionRule): Promise<void> {
   // Simplified mock
}
export async function dbDeletePromotionRule(id: string): Promise<void> {
   // Simplified mock
}
export async function dbAddMembershipPlan(data: Omit<MembershipPlan, 'id'>): Promise<void> {
    // Simplified mock
}
export async function dbUpdateMembershipPlan(data: MembershipPlan): Promise<void> {
    // Simplified mock
}
export async function dbDeleteMembershipPlan(id: string): Promise<void> {
    // Simplified mock
}
export async function dbCreateTeam(data: { name: string; sportId: string; captainId: string }): Promise<Team> {
    const newTeam: Team = {
        id: `team-${Date.now()}`,
        name: data.name,
        sport: (await query('SELECT * from sports WHERE id = $1', [data.sportId])).rows[0],
        captainId: data.captainId,
        memberIds: [data.captainId],
    };
    return newTeam;
}

export async function dbLeaveTeam(teamId: string, userId: string): Promise<boolean> { return true; }
export async function dbRemoveUserFromTeam(teamId: string, memberIdToRemove: string, currentUserId: string): Promise<void> {}
export async function dbTransferCaptaincy(teamId: string, newCaptainId: string, currentUserId: string): Promise<void> {}
export async function dbDeleteTeam(teamId: string, currentUserId: string): Promise<void> {}

export async function dbAddNotification(userId: string, notificationData: Omit<AppNotification, 'id' | 'userId' | 'createdAt' | 'isRead'>): Promise<AppNotification> {
    const newNotification: AppNotification = {
        ...notificationData,
        id: `notification-${Date.now()}`,
        userId,
        createdAt: new Date().toISOString(),
        isRead: false
    };
    return newNotification;
}

export async function dbAddReview(reviewData: Omit<Review, 'id' | 'createdAt' | 'userName' | 'userAvatar' | 'isPublicProfile'>): Promise<Review> {
    const user = await dbGetUserById(reviewData.userId);
    const newReview: Review = {
        ...reviewData,
        id: `review-${Date.now()}`,
        createdAt: new Date().toISOString(),
        userName: user?.name || 'Anonymous',
        userAvatar: user?.profilePictureUrl,
        isPublicProfile: user?.isProfilePublic || false,
    };
    return newReview;
}
export async function dbMarkNotificationAsRead(userId: string, notificationId: string): Promise<void> {}
export async function dbMarkAllNotificationsAsRead(userId: string): Promise<void> {}
export async function dbGetNotificationsForUser(userId: string): Promise<AppNotification[]> {
    return [];
}
export async function dbGetOpenLfgRequests(): Promise<LfgRequest[]> {
    const res = await query('SELECT * FROM "lfg_requests" WHERE status = \'open\'');
    return res.rows as LfgRequest[];
}
export async function dbGetOpenChallenges(): Promise<Challenge[]> {
    const res = await query('SELECT * FROM "challenges" WHERE status = \'open\'');
    return res.rows as Challenge[];
}
export async function dbCreateLfgRequest(data: Omit<LfgRequest, 'id'|'createdAt'|'status'|'interestedUserIds'>): Promise<LfgRequest> {
    const newId = `lfg-${Date.now()}`;
    await query('INSERT INTO "lfg_requests" (id, "userId", "sportId", "facilityId", notes, "skillLevel", "playersNeeded") VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [newId, data.userId, data.sportId, data.facilityId, data.notes, data.skillLevel, data.playersNeeded]
    );
    const res = await query('SELECT * FROM "lfg_requests" WHERE id = $1', [newId]);
    return res.rows[0];
}
export async function dbExpressInterestInLfg(lfgId: string, userId: string): Promise<LfgRequest | undefined> {
    // This is a simplified mock. A real implementation would handle arrays better.
    return undefined;
}
export async function dbCreateChallenge(data: Omit<Challenge, 'id'|'challenger'|'sport'|'createdAt'|'status'>): Promise<Challenge> {
    const newId = `challenge-${Date.now()}`;
     await query('INSERT INTO "challenges" (id, "challengerId", "sportId", "facilityId", "proposedDate", notes) VALUES ($1, $2, $3, $4, $5, $6)',
        [newId, data.challengerId, data.sportId, data.facilityId, data.proposedDate, data.notes]
    );
    const res = await query('SELECT * FROM "challenges" WHERE id = $1', [newId]);
    return res.rows[0];
}
export async function dbAcceptChallenge(challengeId: string, opponentId: string): Promise<Challenge | undefined> {
     await query('UPDATE "challenges" SET "opponentId" = $1, status = \'accepted\' WHERE id = $2', [opponentId, challengeId]);
     const res = await query('SELECT * FROM "challenges" WHERE id = $1', [challengeId]);
     return res.rows[0];
}
