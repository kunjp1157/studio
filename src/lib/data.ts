
'use server';

import type {
  Facility, Sport, Amenity, Review, Booking, UserProfile, SportEvent, MembershipPlan,
  PricingRule, PromotionRule, AppNotification, BlogPost, Team, LfgRequest, Challenge, SiteSettings,
  FacilityOperatingHours, RentalEquipment, MaintenanceSchedule, SportPrice, OwnerVerificationRequest, TimeSlot
} from './types';
import { query } from './db';
import { unstable_noStore as noStore } from 'next/cache';
import { calculateDynamicPrice } from './utils';

// Mock settings as we don't have a settings table
let siteSettings: SiteSettings = {
    siteName: 'Sports Arena',
    defaultCurrency: 'INR',
    timezone: 'Asia/Kolkata',
    maintenanceMode: false,
    notificationTemplates: [
        {
          type: 'booking_confirmed',
          label: 'Booking Confirmed',
          description: 'Sent when a user successfully books a slot.',
          emailEnabled: true,
          smsEnabled: true,
          emailSubject: 'Your Booking is Confirmed!',
          emailBody: 'Hi {{userName}}, your booking for {{facilityName}} on {{date}} at {{time}} is confirmed. Booking ID: {{bookingId}}.',
          smsBody: 'Booking Confirmed: {{facilityName}} on {{date}} at {{time}}. ID: {{bookingId}}',
        },
        {
          type: 'booking_cancelled',
          label: 'Booking Cancelled',
          description: 'Sent when a booking is cancelled by a user or admin.',
          emailEnabled: true,
          smsEnabled: false,
          emailSubject: 'Booking Cancellation Notice',
          emailBody: 'Hi {{userName}}, your booking for {{facilityName}} on {{date}} at {{time}} has been cancelled.',
          smsBody: 'Booking Cancelled: {{facilityName}} on {{date}} at {{time}}.',
        },
    ]
};

// ========== READ ==========

async function enrichFacility(facility: Facility): Promise<void> {
    if (!facility) return;
    noStore();

    const [sportsRes] = await query('SELECT s.* FROM sports s JOIN facility_sports fs ON s.id = fs.sportId WHERE fs.facilityId = ?', [facility.id]);
    const [amenitiesRes] = await query('SELECT a.* FROM amenities a JOIN facility_amenities fa ON a.id = fa.amenityId WHERE fa.facilityId = ?', [facility.id]);
    const [hoursRes] = await query('SELECT day, open, close FROM facility_operating_hours WHERE facilityId = ?', [facility.id]);
    const [pricesRes] = await query('SELECT sportId, price, pricingModel FROM facility_sport_prices WHERE facilityId = ?', [facility.id]);
    const [reviewsRes] = await query('SELECT r.*, u.name as userName, u.profilePictureUrl as userAvatar, u.isProfilePublic FROM reviews r JOIN users u ON r.userId = u.id WHERE r.facilityId = ? ORDER BY r.createdAt DESC', [facility.id]);
    
    const sports = sportsRes as Sport[];
    facility.sports = sports;
    facility.amenities = amenitiesRes as Amenity[];
    facility.operatingHours = hoursRes as FacilityOperatingHours[];
    facility.sportPrices = pricesRes as SportPrice[];
    facility.reviews = reviewsRes as Review[];
    
    // Assign dataAiHint from the first sport if not present
    if (!facility.dataAiHint && sports.length > 0 && sports[0].imageDataAiHint) {
        facility.dataAiHint = sports[0].imageDataAiHint;
    }


    // JSON fields from the facility table itself need parsing
    if (typeof facility.blockedSlots === 'string') {
        try { facility.blockedSlots = JSON.parse(facility.blockedSlots); } catch { facility.blockedSlots = []; }
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
    return (rows as UserProfile[]).map(user => {
        if (user && typeof user.favoriteFacilities === 'string') {
            try { user.favoriteFacilities = JSON.parse(user.favoriteFacilities); } catch (e) { user.favoriteFacilities = []; }
        }
        if (user && typeof user.achievements === 'string') {
            try { user.achievements = JSON.parse(user.achievements); } catch (e) { user.achievements = []; }
        }
        if (user && typeof user.skillLevels === 'string') {
            try { user.skillLevels = JSON.parse(user.skillLevels); } catch (e) { user.skillLevels = []; }
        }
        if (user && typeof user.preferredSports === 'string') {
            try { user.preferredSports = JSON.parse(user.preferredSports); } catch (e) { user.preferredSports = []; }
        }
        return user;
    });
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
    return plans.map(plan => {
        if (plan && typeof (plan as any).benefits === 'string') {
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
    if ((rows as any[]).length === 0) return undefined;
    
    const user = (rows as UserProfile[])[0];

    if (user && typeof user.favoriteFacilities === 'string') {
        try { user.favoriteFacilities = JSON.parse(user.favoriteFacilities); } catch (e) { console.error("Failed to parse favoriteFacilities", e); user.favoriteFacilities = []; }
    }
    if (user && typeof user.achievements === 'string') {
        try { user.achievements = JSON.parse(user.achievements); } catch (e) { console.error("Failed to parse achievements", e); user.achievements = []; }
    }
     if (user && typeof user.skillLevels === 'string') {
        try { user.skillLevels = JSON.parse(user.skillLevels); } catch (e) { console.error("Failed to parse skillLevels", e); user.skillLevels = []; }
    }
    if (user && typeof user.preferredSports === 'string') {
        try { user.preferredSports = JSON.parse(user.preferredSports); } catch (e) { console.error("Failed to parse preferredSports", e); user.preferredSports = []; }
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
    const [rows] = await query('SELECT * FROM bookings WHERE facilityId = ? AND date = ? AND status IN (?, ?)', [facilityId, date, 'Confirmed', 'Pending']);
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

export async function getSiteSettingsAction(): Promise<SiteSettings> {
    noStore();
    return siteSettings;
}

// ========== WRITE ==========
export async function updateSiteSettings(newSettings: SiteSettings) {
    noStore();
    siteSettings = newSettings;
}


export async function dbAddFacility(facilityData: any): Promise<Facility> {
    noStore();
    const { sports, amenities, sportPrices, operatingHours, ...mainData } = facilityData;

    // Prepare main facility data
    const facilityToInsert = {
        id: `facility-${mainData.city.toLowerCase().replace(' ', '-')}-${Date.now()}`,
        name: mainData.name,
        type: mainData.type,
        address: mainData.address,
        city: mainData.city,
        location: mainData.location,
        description: mainData.description,
        isIndoor: mainData.isIndoor || false,
        isPopular: mainData.isPopular || false,
        capacity: mainData.capacity || null,
        imageUrl: mainData.imageUrl,
        dataAiHint: mainData.imageDataAiHint,
        ownerId: mainData.ownerId,
        status: mainData.status || 'Active',
        rating: 4.5, // Default rating
        blockedSlots: JSON.stringify(mainData.blockedSlots || []),
    };

    const columns = Object.keys(facilityToInsert).map(k => `\`${k}\``).join(', ');
    const values = Object.values(facilityToInsert);
    const valuePlaceholders = values.map(() => '?').join(', ');
    
    await query(`INSERT INTO facilities (${columns}) VALUES (${valuePlaceholders})`, values);
    const newId = facilityToInsert.id;

    // Handle relationships
    if (sports && sports.length > 0) {
        const sportValues = sports.map((sportId: string) => [newId, sportId]);
        await query('INSERT INTO facility_sports (facilityId, sportId) VALUES ?', [sportValues]);
    }
    if (amenities && amenities.length > 0) {
        const amenityValues = amenities.map((amenityId: string) => [newId, amenityId]);
        await query('INSERT INTO facility_amenities (facilityId, amenityId) VALUES ?', [amenityValues]);
    }
    if (operatingHours && operatingHours.length > 0) {
        const hourValues = operatingHours.map((oh: any) => [newId, oh.day, oh.open, oh.close]);
        await query('INSERT INTO facility_operating_hours (facilityId, day, open, close) VALUES ?', [hourValues]);
    }
    if (sportPrices && sportPrices.length > 0) {
        const priceValues = sportPrices.map((sp: any) => [newId, sp.sportId, sp.price, sp.pricingModel]);
        await query('INSERT INTO facility_sport_prices (facilityId, sportId, price, pricingModel) VALUES ?', [priceValues]);
    }

    return (await dbGetFacilityById(newId.toString()))!;
}

export async function dbUpdateFacility(facilityData: any): Promise<Facility> {
    noStore();
    const { id, sports, amenities, sportPrices, operatingHours, ...mainData } = facilityData;

    const facilityToUpdate: Record<string, any> = {};
    if (mainData.name) facilityToUpdate.name = mainData.name;
    if (mainData.type) facilityToUpdate.type = mainData.type;
    if (mainData.address) facilityToUpdate.address = mainData.address;
    if (mainData.city) facilityToUpdate.city = mainData.city;
    if (mainData.location) facilityToUpdate.location = mainData.location;
    if (mainData.description) facilityToUpdate.description = mainData.description;
    if (mainData.hasOwnProperty('isIndoor')) facilityToUpdate.isIndoor = mainData.isIndoor;
    if (mainData.hasOwnProperty('isPopular')) facilityToUpdate.isPopular = mainData.isPopular;
    if (mainData.hasOwnProperty('capacity')) {
        facilityToUpdate.capacity = isNaN(mainData.capacity) || mainData.capacity === '' ? null : mainData.capacity;
    }
    if (mainData.imageUrl) facilityToUpdate.imageUrl = mainData.imageUrl;
    if (mainData.imageDataAiHint) facilityToUpdate.dataAiHint = mainData.imageDataAiHint;
    if (mainData.ownerId) facilityToUpdate.ownerId = mainData.ownerId;
    if (mainData.status) facilityToUpdate.status = mainData.status;
    if (mainData.blockedSlots) facilityToUpdate.blockedSlots = JSON.stringify(mainData.blockedSlots);

    if(Object.keys(facilityToUpdate).length > 0) {
        const setClauses = Object.keys(facilityToUpdate).map((k) => `\`${k}\` = ?`).join(', ');
        const values = [...Object.values(facilityToUpdate), id];
        await query(`UPDATE facilities SET ${setClauses} WHERE id = ?`, values);
    }

    // Update relationships by deleting old and inserting new
    await query('DELETE FROM facility_sports WHERE facilityId = ?', [id]);
    if (sports && sports.length > 0) {
        const sportValues = sports.map((sportId: string) => [id, sportId]);
        await query('INSERT INTO facility_sports (facilityId, sportId) VALUES ?', [sportValues]);
    }

    await query('DELETE FROM facility_amenities WHERE facilityId = ?', [id]);
    if (amenities && amenities.length > 0) {
        const amenityValues = amenities.map((amenityId: string) => [id, amenityId]);
        await query('INSERT INTO facility_amenities (facilityId, amenityId) VALUES ?', [amenityValues]);
    }

    await query('DELETE FROM facility_operating_hours WHERE facilityId = ?', [id]);
    if (operatingHours && operatingHours.length > 0) {
        const hourValues = operatingHours.map((oh: any) => [id, oh.day, oh.open, oh.close]);
        await query('INSERT INTO facility_operating_hours (facilityId, day, open, close) VALUES ?', [hourValues]);
    }

    await query('DELETE FROM facility_sport_prices WHERE facilityId = ?', [id]);
    if (sportPrices && sportPrices.length > 0) {
        const priceValues = sportPrices.map((sp: any) => [id, sp.sportId, sp.price, sp.pricingModel]);
        await query('INSERT INTO facility_sport_prices (facilityId, sportId, price, pricingModel) VALUES ?', [priceValues]);
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
        id: `user-${userData.name?.toLowerCase()}-${Date.now()}`,
        joinedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
        favoriteFacilities: JSON.stringify(userData.favoriteFacilities || []),
        achievements: JSON.stringify(userData.achievements || []),
        skillLevels: JSON.stringify(userData.skillLevels || [])
    };
    
    const columns = Object.keys(dataToInsert).map(k => `\`${k}\``).join(', ');
    const values = Object.values(dataToInsert);
    const valuePlaceholders = values.map(() => '?').join(', ');

    await query(`INSERT INTO users (${columns}) VALUES (${valuePlaceholders})`, values);
    const newId = dataToInsert.id;
    return (await dbGetUserById(newId.toString()))!;
}

export async function dbUpdateUser(userId: string, updates: Partial<UserProfile> & { currentPassword?: string }): Promise<UserProfile | undefined> {
    noStore();
    const { currentPassword, ...dbUpdates } = updates;

    // Password validation logic
    if (dbUpdates.password && dbUpdates.password.length > 0) {
        if (!currentPassword) {
            throw new Error("Current password is required to set a new password.");
        }
        const currentUser = await dbGetUserById(userId);
        if (!currentUser || currentUser.password !== currentPassword) {
            throw new Error("Current password does not match.");
        }
    } else {
        // If new password is not provided or is empty, remove it from updates to avoid overwriting with empty value
        delete dbUpdates.password;
    }
    
    // Prepare fields for SQL query
    const fieldsToUpdate: Record<string, any> = {};
    for (const key in dbUpdates) {
        if (Object.prototype.hasOwnProperty.call(dbUpdates, key)) {
            const value = (dbUpdates as any)[key];
            // Stringify JSON fields before sending to DB
            if (['favoriteFacilities', 'achievements', 'skillLevels', 'preferredSports'].includes(key)) {
                fieldsToUpdate[key] = JSON.stringify(value || []);
            } else {
                fieldsToUpdate[key] = value;
            }
        }
    }
    
    if (Object.keys(fieldsToUpdate).length === 0) {
        return dbGetUserById(userId); // No changes to apply
    }

    const setClauses = Object.keys(fieldsToUpdate).map((k) => `\`${k}\` = ?`).join(', ');
    const values = [...Object.values(fieldsToUpdate), userId];
    
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
    await dbUpdateFacility({ id: facility.id, blockedSlots: newBlockedSlots });
    return true;
}

export async function unblockTimeSlot(facilityId: string, ownerId: string, date: string, startTime: string): Promise<boolean> {
    noStore();
    const facility = await dbGetFacilityById(facilityId);
    if (!facility || !facility.blockedSlots || facility.ownerId !== ownerId) return false;

    const newBlockedSlots = facility.blockedSlots.filter(
        slot => !(slot.date === date && slot.startTime === startTime)
    );
    await dbUpdateFacility({ id: facility.id, blockedSlots: newBlockedSlots });
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
    const id = `sport-${sportData.name.toLowerCase().replace(' ', '-')}`;
    await query('INSERT INTO sports (id, name, iconName, imageUrl, imageDataAiHint) VALUES (?, ?, ?, ?, ?)', [id, sportData.name, sportData.iconName, sportData.imageUrl, sportData.imageDataAiHint]);
    const [rows] = await query('SELECT * FROM sports WHERE id = ?', [id]);
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
    const facility = await dbGetFacilityById(data.facilityId);
    await query('INSERT INTO events (name, facilityId, facilityName, sportId, startDate, endDate, description, entryFee, maxParticipants) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [data.name, data.facilityId, facility?.name, data.sportId, data.startDate, data.endDate, data.description, data.entryFee, data.maxParticipants]);
}
export async function dbUpdateEvent(data: SportEvent): Promise<void> {
    noStore();
    const facility = await dbGetFacilityById(data.facilityId);
    await query('UPDATE events SET name = ?, facilityId = ?, facilityName=?, sportId = ?, startDate = ?, endDate = ?, description = ?, entryFee = ?, maxParticipants = ? WHERE id = ?', [data.name, data.facilityId, facility?.name, data.sport.id, data.startDate, data.endDate, data.description, data.entryFee, data.maxParticipants, data.id]);
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
        [userId, facilityId, rating, comment, bookingId, user?.name, user?.profilePictureUrl, user?.isProfilePublic]
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
export async function getPendingOwnerRequestsAction(): Promise<OwnerVerificationRequest[]> {
  noStore();
  const [rows] = await query('SELECT * FROM owner_verification_requests WHERE status = \'pending\'');
  return rows as OwnerVerificationRequest[];
}

export async function approveOwnerRequestAction(requestId: number, userId: string): Promise<void> {
  noStore();
  await query('UPDATE users SET role = \'FacilityOwner\', status = \'Active\' WHERE id = ?', [userId]);
  await query('UPDATE owner_verification_requests SET status = \'approved\' WHERE id = ?', [requestId]);
}

export async function rejectOwnerRequestAction(requestId: number, userId: string): Promise<void> {
  noStore();
  await query('UPDATE users SET status = \'Active\' WHERE id = ?', [userId]);
  await query('UPDATE owner_verification_requests SET status = \'rejected\' WHERE id = ?', [requestId]);
}



// These are needed for other actions that depend on them
export async function getEventById(id: string): Promise<SportEvent | undefined> { 
    noStore();
    const [rows] = await query('SELECT * FROM events WHERE id = ?', [id]);
    const event = (rows as SportEvent[])[0];
    if (event) {
        const [sportRows] = await query('SELECT * FROM sports WHERE id = ?', [event.sportId]);
        event.sport = (sportRows as Sport[])[0];
    }
    return event;
}
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> { 
    noStore();
    const [rows] = await query('SELECT * FROM blog_posts WHERE slug = ?', [slug]);
    return (rows as BlogPost[])[0];
}
export async function dbGetMembershipPlanById(id: string): Promise<MembershipPlan | undefined> { 
    noStore();
    const [rows] = await query('SELECT * FROM membership_plans WHERE id = ?', [id]);
    if ((rows as any[]).length === 0) return undefined;

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

export async function getPromotionRuleByCode(code: string): Promise<PromotionRule | undefined> {
    noStore();
    const [rows] = await query('SELECT * FROM promotion_rules WHERE code = ? AND isActive = true', [code]);
    return (rows as PromotionRule[])[0];
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

export async function updateEventAction(data: SportEvent): Promise<void> {
    noStore();
    return dbUpdateEvent(data);
}

export async function getPricingRuleById(id: string): Promise<PricingRule | undefined> {
    noStore();
    // This is a mock implementation. In a real app, you'd query the DB.
    // The data is fetched in the page component instead.
    return Promise.resolve(undefined);
}

export async function getPromotionRuleById(id: string): Promise<PromotionRule | undefined> {
    noStore();
    // This is a mock implementation. 
    return Promise.resolve(undefined);
}

export async function getSportById(id: string): Promise<Sport | undefined> {
    noStore();
    // This is a mock implementation.
    return Promise.resolve(undefined);
}
    