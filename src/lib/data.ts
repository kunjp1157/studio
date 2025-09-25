

'use server';

import type {
  Facility, Sport, Amenity, Review, Booking, UserProfile, SportEvent, MembershipPlan,
  PricingRule, PromotionRule, AppNotification, BlogPost, Team, LfgRequest, Challenge, SiteSettings,
  FacilityOperatingHours, RentalEquipment, MaintenanceSchedule, SportPrice, OwnerVerificationRequest
} from './types';
import { query } from './db';
import { unstable_noStore as noStore } from 'next/cache';

// ========== READ ==========

async function enrichFacility(facility: Facility): Promise<void> {
    if (!facility) return;
    noStore();

    const [sportsRes] = await query('SELECT s.* FROM sports s JOIN facility_sports fs ON s.id = fs.sportId WHERE fs.facilityId = ?', [facility.id]);
    const [amenitiesRes] = await query('SELECT a.* FROM amenities a JOIN facility_amenities fa ON a.id = fa.amenityId WHERE fa.facilityId = ?', [facility.id]);
    const [hoursRes] = await query('SELECT day, open, close FROM facility_operating_hours WHERE facilityId = ?', [facility.id]);
    const [pricesRes] = await query('SELECT sportId, price, pricingModel FROM facility_sport_prices WHERE facilityId = ?', [facility.id]);
    const [reviewsRes] = await query('SELECT r.*, u.name as userName, u.profilePictureUrl as userAvatar, u.isProfilePublic FROM reviews r JOIN users u ON r.userId = u.id WHERE r.facilityId = ? ORDER BY r.createdAt DESC', [facility.id]);
    const [equipmentRes] = await query('SELECT re.* FROM rental_equipment re JOIN facility_equipment fe ON re.id = fe.equipmentId WHERE fe.facilityId = ?', [facility.id]);
    
    facility.sports = sportsRes as Sport[];
    facility.amenities = amenitiesRes as Amenity[];
    facility.operatingHours = hoursRes as FacilityOperatingHours[];
    facility.sportPrices = pricesRes as SportPrice[];
    facility.reviews = reviewsRes as Review[];
    facility.availableEquipment = equipmentRes as RentalEquipment[];

    // JSON fields from the facility table itself need parsing
    if (typeof facility.blockedSlots === 'string') {
        facility.blockedSlots = JSON.parse(facility.blockedSlots);
    }
    if (typeof facility.maintenanceSchedules === 'string') {
        facility.maintenanceSchedules = JSON.parse(facility.maintenanceSchedules);
    }
}


// Get all entities
export async function dbGetAllFacilities(): Promise<Facility[]> {
  noStore();
  const [rows] = await query('SELECT * FROM facilities');
  const facilities = rows as Facility[];
  // In a real app, you'd probably want to fetch related entities in a more optimized way
  for (const facility of facilities) {
      await enrichFacility(facility);
  }
  return facilities;
}

export async function dbGetAllUsers(): Promise<UserProfile[]> {
    noStore();
    const [rows] = await query('SELECT * FROM users');
    return rows as UserProfile[];
}

export async function dbGetAllBookings(): Promise<Booking[]> {
    noStore();
    const [rows] = await query('SELECT * FROM bookings');
    return rows as Booking[];
}

export async function getAllSportsAction(): Promise<Sport[]> {
    noStore();
    const [rows] = await query('SELECT * FROM sports');
    return rows as Sport[];
}

export async function getAllAmenitiesAction(): Promise<Amenity[]> {
    noStore();
    const [rows] = await query('SELECT * FROM amenities');
    return rows as Amenity[];
}

export async function getAllEventsAction(): Promise<SportEvent[]> {
    noStore();
    const [rows] = await query('SELECT * FROM events');
    const events = rows as SportEvent[];
    for(const event of events) {
        const [sportRows] = await query('SELECT * FROM sports WHERE id = ?', [event.sportId]);
        event.sport = (sportRows as Sport[])[0];
    }
    return events;
}

export async function getAllMembershipPlansAction(): Promise<MembershipPlan[]> {
    noStore();
    const [rows] = await query('SELECT * FROM membership_plans');
    const plans = rows as MembershipPlan[];
    // The 'benefits' column is stored as a JSON string, so we need to parse it.
    return plans.map(plan => {
        if (typeof (plan as any).benefits === 'string') {
            plan.benefits = JSON.parse((plan as any).benefits);
        }
        return plan;
    });
}

export async function getAllPricingRulesAction(): Promise<PricingRule[]> {
    noStore();
    const [rows] = await query('SELECT * FROM pricing_rules');
    return rows as PricingRule[];
}

export async function getAllPromotionRulesAction(): Promise<PromotionRule[]> {
    noStore();
    const [rows] = await query('SELECT * FROM promotion_rules');
    return rows as PromotionRule[];
}

export async function getAllBlogPostsAction(): Promise<BlogPost[]> {
    noStore();
    const [rows] = await query('SELECT * FROM blog_posts');
    return rows as BlogPost[];
}

// Get by ID or specific criteria
export async function dbGetFacilityById(id: string): Promise<Facility | undefined> {
    noStore();
    const [facilityRows] = await query('SELECT * FROM facilities WHERE id = ?', [id]);
    if ((facilityRows as any[]).length === 0) return undefined;
    const facility = (facilityRows as Facility[])[0];
    await enrichFacility(facility);
    return facility;
}

export async function dbGetUserById(id: string): Promise<UserProfile | undefined> {
    noStore();
    const [rows] = await query('SELECT * FROM users WHERE id = ?', [id]);
    const user = (rows as UserProfile[])[0];
    if (user && typeof user.favoriteFacilities === 'string') {
        user.favoriteFacilities = JSON.parse(user.favoriteFacilities);
    }
    if (user && typeof user.achievements === 'string') {
        user.achievements = JSON.parse(user.achievements);
    }
    if (user && typeof user.skillLevels === 'string') {
        user.skillLevels = JSON.parse(user.skillLevels);
    }
    return user;
}

export async function dbGetBookingById(id: string): Promise<Booking | undefined> {
    noStore();
    const [rows] = await query('SELECT * FROM bookings WHERE id = ?', [id]);
    if ((rows as any[]).length === 0) return undefined;
    
    const booking = (rows as Booking[])[0];

    const facility = await dbGetFacilityById(booking.facilityId);
    if(facility) {
        booking.facilityName = facility.name;
        const sport = facility.sports.find(s => s.id === booking.sportId);
        if(sport) booking.sportName = sport.name;
    }

    return booking;
}

export async function dbGetBookingsByUserId(userId: string): Promise<Booking[]> {
    noStore();
    const [rows] = await query('SELECT * FROM bookings WHERE userId = ? ORDER BY date DESC, startTime DESC', [userId]);
    
    const bookings = rows as Booking[];
    for (const booking of bookings) {
        // This could be optimized by fetching all needed facilities/sports at once
        const facility = await dbGetFacilityById(booking.facilityId);
        if (facility) {
            booking.facilityName = facility.name;
            const sport = facility.sports.find(s => s.id === booking.sportId);
            if(sport) booking.sportName = sport.name;
        }
    }
    return bookings;
}

export async function dbGetBookingsForFacilityOnDate(facilityId: string, date: string): Promise<Booking[]> {
    noStore();
    const [rows] = await query('SELECT * FROM bookings WHERE facilityId = ? AND date = ? AND status = ?', [facilityId, date, 'Confirmed']);
    return rows as Booking[];
}

export async function dbGetFacilitiesByOwnerId(ownerId: string): Promise<Facility[]> {
    noStore();
    const [rows] = await query('SELECT * FROM facilities WHERE ownerId = ?', [ownerId]);
    const facilities = rows as Facility[];
    for (const facility of facilities) {
        await enrichFacility(facility);
    }
    return facilities;
}

export async function getPricingRulesByFacilityIdsAction(facilityIds: string[]): Promise<PricingRule[]> {
    if (facilityIds.length === 0) return [];
    noStore();
    const placeholders = facilityIds.map(() => '?').join(',');
    const [rows] = await query(`SELECT * FROM pricing_rules WHERE facilityIds IS NULL OR JSON_CONTAINS(facilityIds, '["${facilityIds.join('","')}"]')`, []);
    return rows as PricingRule[];
}

export async function dbGetEventsByFacilityIds(facilityIds: string[]): Promise<SportEvent[]> {
    if (facilityIds.length === 0) return [];
    noStore();
    const placeholders = facilityIds.map(() => '?').join(',');
    const [rows] = await query(`SELECT * FROM events WHERE facilityId IN (${placeholders})`, facilityIds);
    const events = rows as SportEvent[];
    for (const event of events) {
        const [sportRows] = await query('SELECT * FROM sports WHERE id = ?', [event.sportId]);
        event.sport = (sportRows as Sport[])[0];
    }
    return events;
}

export async function getLfgRequestsByFacilityIds(facilityIds: string[]): Promise<LfgRequest[]> {
    if (facilityIds.length === 0) return [];
    noStore();
    const placeholders = facilityIds.map(() => '?').join(',');
    const [rows] = await query(`SELECT * FROM lfg_requests WHERE facilityId IN (${placeholders})`, facilityIds);
    return rows as LfgRequest[];
}

export async function getChallengesByFacilityIds(facilityIds: string[]): Promise<Challenge[]> {
    if (facilityIds.length === 0) return [];
    noStore();
    const placeholders = facilityIds.map(() => '?').join(',');
    const [rows] = await query(`SELECT * FROM challenges WHERE facilityId IN (${placeholders})`, facilityIds);
    return rows as Challenge[];
}

export async function getSiteSettings(): Promise<SiteSettings> {
    noStore();
    // In a real app, this would come from a database table.
    return {
        siteName: 'Sports Arena',
        defaultCurrency: 'INR',
        timezone: 'Asia/Kolkata',
        maintenanceMode: false,
    };
}

export async function dbAddFacility(facilityData: any): Promise<Facility> {
    noStore();
    const { sports, amenities, sportPrices, operatingHours, availableEquipment, blockedSlots, ...mainData } = facilityData;
    
    // Convert arrays to JSON strings for storage
    mainData.blockedSlots = JSON.stringify(blockedSlots || []);

    const columns = Object.keys(mainData).map(k => `\`${k}\``).join(', ');
    const values = Object.values(mainData);
    const valuePlaceholders = values.map(() => '?').join(', ');

    const [result] = await query(`INSERT INTO facilities (${columns}) VALUES (${valuePlaceholders})`, values);
    const newId = (result as any).insertId;
    mainData.id = newId;
    
    // Handle relationships
    if (sports) {
        for (const sportId of sports) {
            await query('INSERT INTO facility_sports (facilityId, sportId) VALUES (?, ?)', [newId, sportId]);
        }
    }
    if (amenities) {
         for (const amenityId of amenities) {
            await query('INSERT INTO facility_amenities (facilityId, amenityId) VALUES (?, ?)', [newId, amenityId]);
        }
    }
    if (operatingHours) {
        for (const oh of operatingHours) {
            await query('INSERT INTO facility_operating_hours (facilityId, day, open, close) VALUES (?, ?, ?, ?)', [newId, oh.day, oh.open, oh.close]);
        }
    }
    if (sportPrices) {
        for (const sp of sportPrices) {
            await query('INSERT INTO facility_sport_prices (facilityId, sportId, price, pricingModel) VALUES (?, ?, ?, ?)', [newId, sp.sportId, sp.price, sp.pricingModel]);
        }
    }
     if (availableEquipment) {
        for (const eq of availableEquipment) {
             const [eqResult] = await query('INSERT INTO rental_equipment (name, description, pricePerItem, priceType, stock) VALUES (?, ?, ?, ?, ?)', [eq.name, eq.description, eq.pricePerItem, eq.priceType, eq.stock]);
             const eqId = (eqResult as any).insertId;
             await query('INSERT INTO facility_equipment (facilityId, equipmentId) VALUES (?, ?)', [newId, eqId]);
        }
    }

    return (await dbGetFacilityById(newId))!;
}

export async function dbUpdateFacility(facilityData: any): Promise<Facility> {
    noStore();
    const { id, sports, amenities, sportPrices, operatingHours, availableEquipment, blockedSlots, ...mainData } = facilityData;
    
    // Convert arrays to JSON strings for storage
    mainData.blockedSlots = JSON.stringify(blockedSlots || []);
    
    const setClauses = Object.keys(mainData).map((k) => `\`${k}\` = ?`).join(', ');
    const values = [...Object.values(mainData), id];
    
    await query(`UPDATE facilities SET ${setClauses} WHERE id = ?`, values);

    // Simplistic relationship update: delete old, insert new
    await query('DELETE FROM facility_sports WHERE facilityId = ?', [id]);
    if (sports) {
        for (const sportId of sports) {
            await query('INSERT INTO facility_sports (facilityId, sportId) VALUES (?, ?)', [id, sportId]);
        }
    }
    await query('DELETE FROM facility_amenities WHERE facilityId = ?', [id]);
    if (amenities) {
        for (const amenityId of amenities) {
            await query('INSERT INTO facility_amenities (facilityId, amenityId) VALUES (?, ?)', [id, amenityId]);
        }
    }
    await query('DELETE FROM facility_operating_hours WHERE facilityId = ?', [id]);
    if (operatingHours) {
        for (const oh of operatingHours) {
            await query('INSERT INTO facility_operating_hours (facilityId, day, open, close) VALUES (?, ?, ?, ?)', [id, oh.day, oh.open, oh.close]);
        }
    }
    await query('DELETE FROM facility_sport_prices WHERE facilityId = ?', [id]);
    if (sportPrices) {
        for (const sp of sportPrices) {
            await query('INSERT INTO facility_sport_prices (facilityId, sportId, price, pricingModel) VALUES (?, ?, ?, ?)', [id, sp.sportId, sp.price, sp.pricingModel]);
        }
    }
    
    // For equipment, a more complex logic is needed: update existing, delete removed, add new
    const [existingEqIdsRes] = await query('SELECT equipmentId FROM facility_equipment WHERE facilityId = ?', [id]);
    const existingEqIds = (existingEqIdsRes as any[]).map(r => r.equipmentId);
    
    const incomingEqIds = (availableEquipment || []).map((eq: any) => eq.id).filter(Boolean);

    // Delete equipment no longer associated
    const toDelete = existingEqIds.filter(eid => !incomingEqIds.includes(eid));
    if(toDelete.length > 0) {
        await query('DELETE FROM facility_equipment WHERE facilityId = ? AND equipmentId IN (?)', [id, toDelete]);
        await query('DELETE FROM rental_equipment WHERE id IN (?)', [toDelete]);
    }

    // Update or Insert equipment
    if (availableEquipment) {
        for (const eq of availableEquipment) {
            if (eq.id && existingEqIds.includes(eq.id)) { // Update
                await query('UPDATE rental_equipment SET name=?, description=?, pricePerItem=?, priceType=?, stock=? WHERE id=?', [eq.name, eq.description, eq.pricePerItem, eq.priceType, eq.stock, eq.id]);
            } else { // Insert
                const [eqResult] = await query('INSERT INTO rental_equipment (name, description, pricePerItem, priceType, stock) VALUES (?, ?, ?, ?, ?)', [eq.name, eq.description, eq.pricePerItem, eq.priceType, eq.stock]);
                const eqId = (eqResult as any).insertId;
                await query('INSERT INTO facility_equipment (facilityId, equipmentId) VALUES (?, ?)', [id, eqId]);
            }
        }
    }

    return (await dbGetFacilityById(id))!;
}

export async function dbDeleteFacility(facilityId: string): Promise<void> {
    noStore();
    await query('DELETE FROM facilities WHERE id = ?', [facilityId]);
    // Note: ON DELETE CASCADE in schema will handle related table cleanup.
}


export async function dbAddBooking(booking: Omit<Booking, 'id'>): Promise<Booking> {
    noStore();
    const columns = Object.keys(booking).map(k => `\`${k}\``).join(', ');
    const values = Object.values(booking).map(v => typeof v === 'object' ? JSON.stringify(v) : v);
    const valuePlaceholders = values.map(() => '?').join(', ');
    const [result] = await query(`INSERT INTO bookings (${columns}) VALUES (${valuePlaceholders})`, values);
    const newId = (result as any).insertId;
    return (await dbGetBookingById(newId.toString()))!;
}

export async function dbUpdateBooking(bookingId: string, updates: Partial<Booking>): Promise<Booking | undefined> {
    noStore();
    const setClauses = Object.keys(updates).map((k) => `\`${k}\` = ?`).join(', ');
    const values = [...Object.values(updates).map(v => typeof v === 'object' ? JSON.stringify(v) : v), bookingId];
    await query(`UPDATE bookings SET ${setClauses} WHERE id = ?`, values);
    return dbGetBookingById(bookingId);
}

export async function dbAddUser(userData: Partial<Omit<UserProfile, 'id'>>): Promise<UserProfile> {
    noStore();
    const dataToInsert = {
        ...userData,
        joinedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
        favoriteFacilities: JSON.stringify(userData.favoriteFacilities || []),
        achievements: JSON.stringify(userData.achievements || []),
        skillLevels: JSON.stringify(userData.skillLevels || [])
    };
    
    const columns = Object.keys(dataToInsert).map(k => `\`${k}\``).join(', ');
    const values = Object.values(dataToInsert);
    const valuePlaceholders = values.map(() => '?').join(', ');

    const [result] = await query(`INSERT INTO users (${columns}) VALUES (${valuePlaceholders})`, values);
    const newId = (result as any).insertId;
    return (await dbGetUserById(newId.toString()))!;
}


export async function dbUpdateUser(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | undefined> {
    noStore();
    const updateData: any = {...updates};
    // Stringify JSON fields if they are present in the update
    if (updates.favoriteFacilities) updateData.favoriteFacilities = JSON.stringify(updates.favoriteFacilities);
    if (updates.achievements) updateData.achievements = JSON.stringify(updates.achievements);
    if (updates.skillLevels) updateData.skillLevels = JSON.stringify(updates.skillLevels);

    const setClauses = Object.keys(updateData).map((k) => `\`${k}\` = ?`).join(', ');
    const values = [...Object.values(updateData), userId];
    await query(`UPDATE users SET ${setClauses} WHERE id = ?`, values);
    return dbGetUserById(userId);
}


export async function dbToggleFavoriteFacility(userId: string, facilityId: string): Promise<UserProfile | undefined> {
    noStore();
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
    noStore();
    const facility = await dbGetFacilityById(facilityId);
    if (!facility || facility.ownerId !== ownerId) return false;

    const newBlockedSlots = [...(facility.blockedSlots || []), newBlock];
    await dbUpdateFacility({ ...facility, blockedSlots: newBlockedSlots });
    return true;
}

export async function unblockTimeSlot(facilityId: string, ownerId: string, date: string, startTime: string): Promise<boolean> {
    noStore();
    const facility = await dbGetFacilityById(facilityId);
    if (!facility || !facility.blockedSlots || facility.ownerId !== ownerId) return false;

    const newBlockedSlots = facility.blockedSlots.filter(
        slot => !(slot.date === date && slot.startTime === startTime)
    );
    await dbUpdateFacility({ ...facility, blockedSlots: newBlockedSlots });
    return true;
}

export async function dbRequestOwnerRole(userId: string, requestData: Omit<OwnerVerificationRequest, 'id' | 'userId' | 'status' | 'createdAt'>): Promise<void> {
    noStore();
    const { fullName, phone, idNumber, facilityName, facilityAddress, identityProofPath, addressProofPath, ownershipProofPath } = requestData;
    await query(
        'INSERT INTO owner_verification_requests (userId, fullName, phone, idNumber, facilityName, facilityAddress, identityProofPath, addressProofPath, ownershipProofPath) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [userId, fullName, phone, idNumber, facilityName, facilityAddress, identityProofPath, addressProofPath, ownershipProofPath]
    );
}

export async function addSportAction(sportData: Omit<Sport, 'id'>): Promise<Sport> {
    noStore();
    const [result] = await query('INSERT INTO sports (name, iconName, imageUrl, imageDataAiHint) VALUES (?, ?, ?, ?)', [sportData.name, sportData.iconName, sportData.imageUrl, sportData.imageDataAiHint]);
    const newId = (result as any).insertId;
    const [rows] = await query('SELECT * FROM sports WHERE id = ?', [newId]);
    return (rows as Sport[])[0];
}
export async function dbUpdateSport(sportId: string, sportData: Partial<Sport>): Promise<Sport> {
    noStore();
    const setClauses = Object.keys(sportData).map((k) => `\`${k}\` = ?`).join(', ');
    const values = [...Object.values(sportData), sportId];
    await query(`UPDATE sports SET ${setClauses} WHERE id = ?`, values);
    const [rows] = await query('SELECT * FROM sports WHERE id = ?', [sportId]);
    return (rows as Sport[])[0];
}
export async function dbDeleteSport(sportId: string): Promise<void> {
    noStore();
    await query('DELETE FROM sports WHERE id = ?', [sportId]);
}

export async function addEventAction(data: Omit<SportEvent, 'id' | 'sport' | 'registeredParticipants'>): Promise<void> {
    noStore();
    await query('INSERT INTO events (name, facilityId, sportId, startDate, endDate, description, entryFee, maxParticipants) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [data.name, data.facilityId, data.sportId, data.startDate, data.endDate, data.description, data.entryFee, data.maxParticipants]);
}
export async function dbUpdateEvent(data: SportEvent): Promise<void> {
    noStore();
    await query('UPDATE events SET name = ?, facilityId = ?, sportId = ?, startDate = ?, endDate = ?, description = ?, entryFee = ?, maxParticipants = ? WHERE id = ?', [data.name, data.facilityId, data.sport.id, data.startDate, data.endDate, data.description, data.entryFee, data.maxParticipants, data.id]);
}
export async function dbDeleteEvent(id: string): Promise<void> {
    noStore();
    await query('DELETE FROM events WHERE id = ?', [id]);
}

export async function addPricingRule(ruleData: Omit<PricingRule, 'id'>): Promise<void> {
    noStore();
    const { name, description, isActive, adjustmentType, value, priority, daysOfWeek, timeRange, dateRange, facilityIds } = ruleData;
    await query('INSERT INTO pricing_rules (name, description, isActive, adjustmentType, value, priority, daysOfWeek, timeRange, dateRange, facilityIds) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
        [name, description, isActive, adjustmentType, value, priority, JSON.stringify(daysOfWeek), JSON.stringify(timeRange), JSON.stringify(dateRange), JSON.stringify(facilityIds)]
    );
}
export async function updatePricingRule(ruleData: PricingRule): Promise<void> {
    noStore();
     const { name, description, isActive, adjustmentType, value, priority, daysOfWeek, timeRange, dateRange, facilityIds, id } = ruleData;
    await query('UPDATE pricing_rules SET name=?, description=?, isActive=?, adjustmentType=?, value=?, priority=?, daysOfWeek=?, timeRange=?, dateRange=?, facilityIds=? WHERE id=?', 
        [name, description, isActive, adjustmentType, value, priority, JSON.stringify(daysOfWeek), JSON.stringify(timeRange), JSON.stringify(dateRange), JSON.stringify(facilityIds), id]
    );
}
export async function dbDeletePricingRule(id: string): Promise<void> {
    noStore();
    await query('DELETE FROM pricing_rules WHERE id = ?', [id]);
}
export async function dbAddPromotionRule(data: Omit<PromotionRule, 'id'>): Promise<void> {
    noStore();
    await query('INSERT INTO promotion_rules (name, description, code, discountType, discountValue, startDate, endDate, usageLimit, usageLimitPerUser, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
    [data.name, data.description, data.code, data.discountType, data.discountValue, data.startDate, data.endDate, data.usageLimit, data.usageLimitPerUser, data.isActive]);
}
export async function dbUpdatePromotionRule(data: PromotionRule): Promise<void> {
    noStore();
    await query('UPDATE promotion_rules SET name=?, description=?, code=?, discountType=?, discountValue=?, startDate=?, endDate=?, usageLimit=?, usageLimitPerUser=?, isActive=? WHERE id = ?', 
    [data.name, data.description, data.code, data.discountType, data.discountValue, data.startDate, data.endDate, data.usageLimit, data.usageLimitPerUser, data.isActive, data.id]);
}
export async function dbDeletePromotionRule(id: string): Promise<void> {
    noStore();
    await query('DELETE FROM promotion_rules WHERE id = ?', [id]);
}
export async function dbAddMembershipPlan(data: Omit<MembershipPlan, 'id'>): Promise<void> {
    noStore();
    await query('INSERT INTO membership_plans (name, pricePerMonth, benefits) VALUES (?, ?, ?)', [data.name, data.pricePerMonth, JSON.stringify(data.benefits)]);
}
export async function dbUpdateMembershipPlan(data: MembershipPlan): Promise<void> {
    noStore();
    await query('UPDATE membership_plans SET name=?, pricePerMonth=?, benefits=? WHERE id = ?', [data.name, data.pricePerMonth, JSON.stringify(data.benefits), data.id]);
}
export async function deleteMembershipPlan(id: string): Promise<void> {
    noStore();
    await query('DELETE FROM membership_plans WHERE id = ?', [id]);
}
export async function dbCreateTeam(data: { name: string; sportId: string; captainId: string }): Promise<Team> {
    noStore();
    const [result] = await query('INSERT INTO teams (name, sportId, captainId, memberIds) VALUES (?, ?, ?, ?)', [data.name, data.sportId, data.captainId, JSON.stringify([data.captainId])]);
    const newId = (result as any).insertId;
    return (await dbGetTeamById(newId.toString()))!;
}

export async function dbLeaveTeam(teamId: string, userId: string): Promise<boolean> { 
    noStore();
    const team = await dbGetTeamById(teamId);
    if (!team) return false;
    if (team.captainId === userId && team.memberIds.length > 1) {
        throw new Error("Captain cannot leave a team with other members. Please transfer captaincy first.");
    }
    const newMemberIds = team.memberIds.filter(id => id !== userId);
    if (newMemberIds.length === 0) {
        await dbDeleteTeam(teamId, userId);
    } else {
        await query('UPDATE teams SET memberIds = ? WHERE id = ?', [JSON.stringify(newMemberIds), teamId]);
    }
    return true; 
}
export async function dbRemoveUserFromTeam(teamId: string, memberIdToRemove: string, currentUserId: string): Promise<void> {
    noStore();
    const team = await dbGetTeamById(teamId);
    if (!team || team.captainId !== currentUserId) throw new Error("Only the team captain can remove members.");
    const newMemberIds = team.memberIds.filter(id => id !== memberIdToRemove);
    await query('UPDATE teams SET memberIds = ? WHERE id = ?', [JSON.stringify(newMemberIds), teamId]);
}
export async function dbTransferCaptaincy(teamId: string, newCaptainId: string, currentUserId: string): Promise<void> {
    noStore();
    const team = await dbGetTeamById(teamId);
    if (!team || team.captainId !== currentUserId) throw new Error("Only the team captain can transfer captaincy.");
    if (!team.memberIds.includes(newCaptainId)) throw new Error("New captain must be a member of the team.");
    await query('UPDATE teams SET captainId = ? WHERE id = ?', [newCaptainId, teamId]);
}
export async function dbDeleteTeam(teamId: string, currentUserId: string): Promise<void> {
    noStore();
    const team = await dbGetTeamById(teamId);
    if (!team || team.captainId !== currentUserId) throw new Error("Only the team captain can delete the team.");
    await query('DELETE FROM teams WHERE id = ?', [teamId]);
}

export async function dbAddNotification(userId: string, notificationData: Omit<AppNotification, 'id' | 'userId' | 'createdAt' | 'isRead'>): Promise<AppNotification> {
    noStore();
    // This is a mock function as we don't have a notifications table.
    console.log(`Notification for ${userId}: ${notificationData.title}`);
    return {
        ...notificationData,
        id: `notification-${Date.now()}`,
        userId,
        createdAt: new Date().toISOString(),
        isRead: false
    };
}

export async function dbAddReview(reviewData: Omit<Review, 'id' | 'createdAt' | 'userName' | 'userAvatar' | 'isPublicProfile'>): Promise<Review> {
    noStore();
    const { userId, facilityId, rating, comment, bookingId } = reviewData;
    const user = await dbGetUserById(userId);
    const [result] = await query('INSERT INTO reviews (userId, facilityId, rating, comment, bookingId, userName, userAvatar, isPublicProfile) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [userId, facilityId, rating, comment, bookingId, user?.name, user?.profilePictureUrl, user?.isPublicProfile]
    );
    await query('UPDATE bookings SET reviewed = true WHERE id = ?', [bookingId]);
    const newId = (result as any).insertId;
    const [rows] = await query('SELECT * FROM reviews WHERE id = ?', [newId]);
    return (rows as Review[])[0];
}
export async function dbMarkNotificationAsRead(userId: string, notificationId: string): Promise<void> {
    noStore();
    // Mock
}
export async function dbMarkAllNotificationsAsRead(userId: string): Promise<void> {
    noStore();
    // Mock
}
export async function dbGetNotificationsForUser(userId: string): Promise<AppNotification[]> {
    noStore();
    // Mock
    return [];
}
export async function dbGetOpenLfgRequests(): Promise<LfgRequest[]> {
    noStore();
    const [rows] = await query('SELECT * FROM lfg_requests WHERE status = \'open\'');
    return rows as LfgRequest[];
}
export async function dbGetOpenChallenges(): Promise<Challenge[]> {
    noStore();
    const [rows] = await query('SELECT * FROM challenges WHERE status = \'open\'');
    for (const challenge of rows as Challenge[]) {
        const [userRows] = await query('SELECT * FROM users WHERE id = ?', [challenge.challengerId]);
        challenge.challenger = (userRows as UserProfile[])[0];
        const [sportRows] = await query('SELECT * FROM sports WHERE id = ?', [challenge.sportId]);
        challenge.sport = (sportRows as Sport[])[0];
    }
    return rows as Challenge[];
}
export async function dbCreateLfgRequest(data: Omit<LfgRequest, 'id'|'createdAt'|'status'|'interestedUserIds'>): Promise<LfgRequest> {
    noStore();
    const [result] = await query('INSERT INTO lfg_requests (userId, sportId, facilityId, facilityName, notes, skillLevel, playersNeeded, preferredTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [data.userId, data.sportId, data.facilityId, data.facilityName, data.notes, data.skillLevel, data.playersNeeded, data.preferredTime]
    );
    const newId = (result as any).insertId;
    const [rows] = await query('SELECT * FROM lfg_requests WHERE id = ?', [newId]);
    return (rows as LfgRequest[])[0];
}
export async function dbExpressInterestInLfg(lfgId: string, userId: string): Promise<LfgRequest | undefined> {
    noStore();
    const [lfgRows] = await query('SELECT * FROM lfg_requests WHERE id = ?', [lfgId]);
    const lfg = (lfgRows as LfgRequest[])[0];
    if (!lfg) return undefined;
    const interestedIds = lfg.interestedUserIds ? JSON.parse(lfg.interestedUserIds as any) : [];
    if (!interestedIds.includes(userId)) {
        interestedIds.push(userId);
        await query('UPDATE lfg_requests SET interestedUserIds = ? WHERE id = ?', [JSON.stringify(interestedIds), lfgId]);
    }
    return dbGetLfgRequestById(lfgId);
}
export async function dbCreateChallenge(data: Omit<Challenge, 'id'|'challenger'|'sport'|'createdAt'|'status'| 'challengerId' | 'sportId' > & { challengerId: string, sportId: string}): Promise<Challenge> {
    noStore();
    const [result] = await query('INSERT INTO challenges (challengerId, sportId, facilityId, facilityName, proposedDate, notes) VALUES (?, ?, ?, ?, ?, ?)',
        [data.challengerId, data.sportId, data.facilityId, data.facilityName, data.proposedDate, data.notes]
    );
    const newId = (result as any).insertId;
    return (await dbGetChallengeById(newId.toString()))!;
}
export async function dbAcceptChallenge(challengeId: string, opponentId: string): Promise<Challenge | undefined> {
    noStore();
     await query('UPDATE challenges SET opponentId = ?, status = \'accepted\' WHERE id = ?', [opponentId, challengeId]);
     return dbGetChallengeById(challengeId);
}


// These are needed for other actions that depend on them
export async function getEventById(id: string): Promise<SportEvent | undefined> { 
    noStore();
    const [rows] = await query('SELECT * FROM events WHERE id = ?', [id]);
    return (rows as SportEvent[])[0];
}
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> { 
    noStore();
    const [rows] = await query('SELECT * FROM blog_posts WHERE slug = ?', [slug]);
    return (rows as BlogPost[])[0];
}
export async function dbGetMembershipPlanById(id: string): Promise<MembershipPlan | undefined> { 
    noStore();
    const [rows] = await query('SELECT * FROM membership_plans WHERE id = ?', [id]);
    const plan = (rows as MembershipPlan[])[0];
    if (plan && typeof (plan as any).benefits === 'string') {
        plan.benefits = JSON.parse((plan as any).benefits);
    }
    return plan;
}
export async function dbGetTeamById(id: string): Promise<Team | undefined> { 
    noStore();
    const [rows] = await query('SELECT * FROM teams WHERE id = ?', [id]);
    const team = (rows as Team[])[0];
    if (team) {
        if(typeof team.memberIds === 'string') team.memberIds = JSON.parse(team.memberIds);
        const [sportRows] = await query('SELECT * FROM sports WHERE id = ?', [(team as any).sportId]);
        team.sport = (sportRows as Sport[])[0];
    }
    return team;
}
export async function getPricingRuleById(id: string): Promise<PricingRule | undefined> { 
    noStore();
    const [rows] = await query('SELECT * FROM pricing_rules WHERE id = ?', [id]);
    return (rows as PricingRule[])[0];
}
export async function getPromotionRuleByCode(code: string): Promise<PromotionRule | undefined> {
    noStore();
    const [rows] = await query('SELECT * FROM promotion_rules WHERE code = ? AND isActive = true', [code]);
    return (rows as PromotionRule[])[0];
}

export async function getPromotionRuleById(id: string): Promise<PromotionRule | undefined> {
    noStore();
    const [rows] = await query('SELECT * FROM promotion_rules WHERE id = ?', [id]);
    return (rows as PromotionRule[])[0];
}

export async function dbGetSportById(id: string): Promise<Sport | undefined> { 
    noStore();
    const [rows] = await query('SELECT * FROM sports WHERE id = ?', [id]);
    return (rows as Sport[])[0];
}

export async function dbGetLfgRequestById(id: string): Promise<LfgRequest | undefined> { 
    noStore();
    const [rows] = await query('SELECT * FROM lfg_requests WHERE id = ?', [id]);
    return (rows as LfgRequest[])[0];
}
export async function dbGetChallengeById(id: string): Promise<Challenge | undefined> { 
    noStore();
    const [rows] = await query('SELECT * FROM challenges WHERE id = ?', [id]);
    return (rows as Challenge[])[0];
}
export async function dbGetTeamsByUserId(userId: string): Promise<Team[]> {
    noStore();
    const [rows] = await query('SELECT * FROM teams WHERE JSON_CONTAINS(memberIds, ?)', [`"${userId}"`]);
    for(const team of rows as Team[]) {
        if(typeof team.memberIds === 'string') team.memberIds = JSON.parse(team.memberIds);
        const [sportRows] = await query('SELECT * FROM sports WHERE id = ?', [(team as any).sportId]);
        team.sport = (sportRows as Sport[])[0];
    }
    return rows as Team[];
}

export async function registerForEvent(eventId: string): Promise<boolean> {
    noStore();
    const event = await getEventById(eventId);
    if (event && (!event.maxParticipants || event.registeredParticipants < event.maxParticipants)) {
        await query('UPDATE events SET registeredParticipants = registeredParticipants + 1 WHERE id = ?', [eventId]);
        return true;
    }
    return false;
}

export async function getFacilitiesAction(): Promise<Facility[]> {
  noStore();
  return await dbGetAllFacilities();
}
export async function getUsersAction(): Promise<UserProfile[]> {
  noStore();
  return await dbGetAllUsers();
}
export async function getBookingsByUserIdAction(): Promise<Booking[]> {
  noStore();
  // This needs a user ID. In a real app, you'd get this from the session.
  // For now, let's assume a mock user ID or fetch for all users if needed for some views.
  return []; 
}
export async function getFacilitiesByIds(ids: string[]): Promise<Facility[]> {
    noStore();
    if (ids.length === 0) return [];
    const placeholders = ids.map(() => '?').join(',');
    const [rows] = await query(`SELECT * FROM facilities WHERE id IN (${placeholders})`, ids);
    const facilities = rows as Facility[];
    for (const facility of facilities) {
        await enrichFacility(facility);
    }
    return facilities;
}
export async function getSportById(id: string): Promise<Sport | undefined> {
    noStore();
    return dbGetSportById(id);
}
export async function updateEventAction(data: SportEvent): Promise<void> {
    noStore();
    return dbUpdateEvent(data);
}
