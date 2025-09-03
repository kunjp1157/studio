

import type { Facility, Sport, Amenity, UserProfile, UserRole, UserStatus, Booking, ReportData, MembershipPlan, SportEvent, Review, AppNotification, NotificationType, BlogPost, PricingRule, PromotionRule, RentalEquipment, RentedItemInfo, AppliedPromotionInfo, TimeSlot, UserSkill, SkillLevel, BlockedSlot, SiteSettings, Team, WaitlistEntry, LfgRequest, SportPrice, NotificationTemplate, Challenge } from './types';
import { getStaticUsers, getMockSports, mockAmenities, mockStaticMembershipPlans } from './mock-data';
import { parseISO, isWithinInterval, isAfter, isBefore, startOfDay, endOfDay, getDay, subDays, getMonth, getYear, format as formatDateFns } from 'date-fns';
import { query } from './db';
import { v4 as uuidv4 } from 'uuid';

// --- IN-MEMORY MOCK DATABASE ---
let mockTeams: Team[] = [];
let mockAppNotifications: AppNotification[] = [];
let mockPricingRules: PricingRule[] = [];
let mockPromotionRules: PromotionRule[] = [];
let mockSiteSettings: SiteSettings = { siteName: 'Sports Arena', defaultCurrency: 'INR', timezone: 'Asia/Kolkata', maintenanceMode: false, notificationTemplates: [] };
let mockWaitlist: WaitlistEntry[] = [];
let mockLfgRequests: LfgRequest[] = [];
let mockChallenges: Challenge[] = [];

// --- DATA ACCESS FUNCTIONS ---

const mapDbRowToFacility = (row: any): Omit<Facility, 'sports' | 'amenities' | 'sportPrices' | 'operatingHours' | 'blockedSlots' | 'availableEquipment' | 'reviews' | 'maintenanceSchedules'> => ({
    id: row.id,
    name: row.name,
    type: row.type,
    address: row.address,
    city: row.city,
    location: row.location,
    description: row.description,
    rating: parseFloat(row.rating) || 0,
    capacity: row.capacity,
    isPopular: row.is_popular,
    isIndoor: row.is_indoor,
    dataAiHint: row.data_ai_hint,
    ownerId: row.owner_id,
});

export const getAllFacilities = async (): Promise<Facility[]> => {
    const allSports = await getAllSports();
    const allAmenities = mockAmenities;

    const [
        facilitiesRes,
        facilitySportsRes,
        facilityAmenitiesRes,
        sportPricesRes,
        operatingHoursRes,
        reviewsRes,
    ] = await Promise.all([
        query('SELECT * FROM facilities'),
        query('SELECT facility_id, sports_id FROM facility_sports'),
        query('SELECT facility_id, amenity_id FROM facility_amenities'),
        query('SELECT facility_id, sport_id, price, pricing_model FROM facility_sport_prices'),
        query('SELECT facility_id, day, open, close FROM facility_operating_hours'),
        query('SELECT * FROM reviews'),
    ]);

    const facilitySportsMap = new Map<string, string[]>();
    for (const row of facilitySportsRes.rows) {
        if (!facilitySportsMap.has(row.facility_id)) {
            facilitySportsMap.set(row.facility_id, []);
        }
        facilitySportsMap.get(row.facility_id)!.push(row.sports_id);
    }

    const facilityAmenitiesMap = new Map<string, string[]>();
    for (const row of facilityAmenitiesRes.rows) {
        if (!facilityAmenitiesMap.has(row.facility_id)) {
            facilityAmenitiesMap.set(row.facility_id, []);
        }
        facilityAmenitiesMap.get(row.facility_id)!.push(row.amenity_id);
    }
    
    const sportPricesMap = new Map<string, SportPrice[]>();
    for (const row of sportPricesRes.rows) {
        if (!sportPricesMap.has(row.facility_id)) {
            sportPricesMap.set(row.facility_id, []);
        }
        sportPricesMap.get(row.facility_id)!.push({ sportId: row.sport_id, price: parseFloat(row.price), pricingModel: row.pricing_model });
    }
    
    const operatingHoursMap = new Map<string, FacilityOperatingHours[]>();
    for (const row of operatingHoursRes.rows) {
        if (!operatingHoursMap.has(row.facility_id)) {
            operatingHoursMap.set(row.facility_id, []);
        }
        operatingHoursMap.get(row.facility_id)!.push({ day: row.day, open: row.open, close: row.close });
    }

    const reviewsMap = new Map<string, Review[]>();
    for (const row of reviewsRes.rows) {
        if (!reviewsMap.has(row.facility_id)) {
            reviewsMap.set(row.facility_id, []);
        }
        reviewsMap.get(row.facility_id)!.push({
            id: row.id,
            facilityId: row.facility_id,
            userId: row.user_id,
            userName: row.user_name,
            userAvatar: row.user_avatar,
            isPublicProfile: row.is_public_profile,
            rating: row.rating,
            comment: row.comment,
            createdAt: new Date(row.created_at).toISOString(),
            bookingId: row.booking_id,
        });
    }

    const facilities: Facility[] = facilitiesRes.rows.map(row => {
        const facilityId = row.id;
        const sportIds = facilitySportsMap.get(facilityId) || [];
        const amenityIds = facilityAmenitiesMap.get(facilityId) || [];

        return {
            ...mapDbRowToFacility(row),
            sports: allSports.filter(s => sportIds.includes(s.id)),
            amenities: allAmenities.filter(a => amenityIds.includes(a.id)),
            sportPrices: sportPricesMap.get(facilityId) || [],
            operatingHours: operatingHoursMap.get(facilityId) || [],
            reviews: reviewsMap.get(facilityId) || [],
            blockedSlots: [],
            availableEquipment: [],
            maintenanceSchedules: [],
        };
    });

    return facilities;
};


export const getAllUsers = async (): Promise<UserProfile[]> => {
    const { rows } = await query('SELECT * FROM users');
    return rows.map(row => ({
        id: row.id,
        name: row.name,
        email: row.email,
        password: row.password,
        phone: row.phone,
        profilePictureUrl: row.profile_picture_url,
        dataAiHint: row.data_ai_hint,
        membershipLevel: row.membership_level,
        loyaltyPoints: row.loyalty_points,
        role: row.role,
        status: row.status,
        joinedAt: row.joined_at ? new Date(row.joined_at).toISOString() : new Date().toISOString(),
        isProfilePublic: row.is_profile_public,
        achievements: [],
        skillLevels: [],
        preferredSports: [],
        favoriteFacilities: [],
        teamIds: [],
        bio: row.bio,
        preferredPlayingTimes: row.preferred_playing_times,
    }));
};

export const getUserById = async (userId: string): Promise<UserProfile | undefined> => {
    if (!userId) return undefined;
    const { rows } = await query('SELECT * FROM users WHERE id = $1', [userId]);
    if (rows.length === 0) return undefined;
    const row = rows[0];
    return {
        id: row.id,
        name: row.name,
        email: row.email,
        password: row.password,
        phone: row.phone,
        profilePictureUrl: row.profile_picture_url,
        dataAiHint: row.data_ai_hint,
        membershipLevel: row.membership_level,
        loyaltyPoints: row.loyalty_points,
        role: row.role,
        status: row.status,
        joinedAt: row.joined_at ? new Date(row.joined_at).toISOString() : new Date().toISOString(),
        isProfilePublic: row.is_profile_public,
        achievements: [],
        skillLevels: [],
        preferredSports: [],
        favoriteFacilities: [],
        teamIds: [],
        bio: row.bio,
        preferredPlayingTimes: row.preferred_playing_times,
    };
};

export const getFacilityById = async (id: string): Promise<Facility | undefined> => {
    const facilityRes = await query('SELECT * FROM facilities WHERE id = $1', [id]);
    if (facilityRes.rows.length === 0) {
        return undefined;
    }
    const facilityRow = facilityRes.rows[0];

    const sportsPromise = query(`
        SELECT s.* FROM sports s
        JOIN facility_sports fs ON s.id = fs.sports_id
        WHERE fs.facility_id = $1
    `, [id]);

    const amenitiesPromise = query(`
        SELECT a.* FROM amenities a
        JOIN facility_amenities fa ON a.id = fa.amenity_id
        WHERE fa.facility_id = $1
    `, [id]);

    const sportPricesPromise = query('SELECT sport_id, price, pricing_model FROM facility_sport_prices WHERE facility_id = $1', [id]);
    const operatingHoursPromise = query('SELECT day, open, close FROM facility_operating_hours WHERE facility_id = $1', [id]);
    const reviewsPromise = query('SELECT * FROM reviews WHERE facility_id = $1', [id]);
    
    const [sportsRes, amenitiesRes, sportPricesRes, operatingHoursRes, reviewsRes] = await Promise.all([
        sportsPromise, amenitiesPromise, sportPricesPromise, operatingHoursPromise, reviewsPromise
    ]);

    return {
        ...mapDbRowToFacility(facilityRow),
        sports: sportsRes.rows.map(s => ({ ...s, iconName: s.icon_name })),
        amenities: mockAmenities.filter(amenity => amenitiesRes.rows.some(a => a.id === amenity.id)),
        sportPrices: sportPricesRes.rows.map(p => ({ sportId: p.sport_id, price: parseFloat(p.price), pricingModel: p.pricing_model })),
        operatingHours: operatingHoursRes.rows.map(h => ({ day: h.day, open: h.open, close: h.close })),
        reviews: reviewsRes.rows.map(r => ({ ...r, id: r.id, facilityId: r.facility_id, userId: r.user_id, userName: r.user_name, userAvatar: r.user_avatar, isPublicProfile: r.is_public_profile, rating: r.rating, comment: r.comment, createdAt: new Date(r.created_at).toISOString(), bookingId: r.booking_id })),
        blockedSlots: [],
        availableEquipment: [],
        maintenanceSchedules: [],
    };
};

export const getFacilitiesByIds = async (ids: string[]): Promise<Facility[]> => {
    if (!ids || ids.length === 0) return [];
    const facilities = await getAllFacilities();
    return facilities.filter(f => ids.includes(f.id));
};

export const addFacility = async (facilityData: Omit<Facility, 'id'>): Promise<Facility> => {
     const { name, type, address, city, location, description, isPopular, isIndoor, ownerId, sports, amenities, sportPrices, operatingHours } = facilityData;
     
     const res = await query(
        `INSERT INTO facilities (name, type, address, city, location, description, is_popular, is_indoor, owner_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [name, type, address, city, location, description, isPopular, isIndoor, ownerId]
    );
    const newFacilityRow = res.rows[0];
    const newFacilityId = newFacilityRow.id;

    await Promise.all([
        ...sports.map(sport => query('INSERT INTO facility_sports (facility_id, sports_id) VALUES ($1, $2)', [newFacilityId, sport.id])),
        ...amenities.map(amenity => query('INSERT INTO facility_amenities (facility_id, amenity_id) VALUES ($1, $2)', [newFacilityId, amenity.id])),
        ...sportPrices.map(sp => query('INSERT INTO facility_sport_prices (facility_id, sport_id, price, pricing_model) VALUES ($1, $2, $3, $4)', [newFacilityId, sp.sportId, sp.price, sp.pricingModel])),
        ...operatingHours.map(oh => query('INSERT INTO facility_operating_hours (facility_id, day, open, close) VALUES ($1, $2, $3, $4)', [newFacilityId, oh.day, oh.open, oh.close])),
    ]);

    const newFacility = await getFacilityById(newFacilityId);
    if (!newFacility) throw new Error("Failed to retrieve newly created facility");
    return newFacility;
};

export const updateFacility = async (facilityData: Facility): Promise<Facility> => {
    const { id, name, type, address, city, location, description, isPopular, isIndoor, ownerId, sports, amenities, sportPrices, operatingHours } = facilityData;
    
    await query(
        `UPDATE facilities SET name = $1, type = $2, address = $3, city = $4, location = $5, description = $6, is_popular = $7, is_indoor = $8, owner_id = $9
         WHERE id = $10`,
        [name, type, address, city, location, description, isPopular, isIndoor, ownerId, id]
    );
    
    await Promise.all([
        query('DELETE FROM facility_sports WHERE facility_id = $1', [id]),
        query('DELETE FROM facility_amenities WHERE facility_id = $1', [id]),
        query('DELETE FROM facility_sport_prices WHERE facility_id = $1', [id]),
        query('DELETE FROM facility_operating_hours WHERE facility_id = $1', [id]),
    ]);

    await Promise.all([
        ...sports.map(sport => query('INSERT INTO facility_sports (facility_id, sports_id) VALUES ($1, $2)', [id, sport.id])),
        ...amenities.map(amenity => query('INSERT INTO facility_amenities (facility_id, amenity_id) VALUES ($1, $2)', [id, amenity.id])),
        ...sportPrices.map(sp => query('INSERT INTO facility_sport_prices (facility_id, sport_id, price, pricing_model) VALUES ($1, $2, $3, $4)', [id, sp.sportId, sp.price, sp.pricingModel])),
        ...operatingHours.map(oh => query('INSERT INTO facility_operating_hours (facility_id, day, open, close) VALUES ($1, $2, $3, $4)', [id, oh.day, oh.open, oh.close])),
    ]);

    const updatedFacility = await getFacilityById(id);
    if (!updatedFacility) throw new Error("Failed to retrieve updated facility");
    return updatedFacility;
};

export const deleteFacility = async (facilityId: string): Promise<void> => {
    await query('DELETE FROM facilities WHERE id = $1', [facilityId]);
    return Promise.resolve();
};

export const getBookingById = async (id: string): Promise<Booking | undefined> => {
    const { rows } = await query('SELECT *, created_at AS "bookedAt" FROM bookings WHERE id = $1', [id]);
    if (rows.length === 0) return undefined;
    const row = rows[0];
    const facility = await getFacilityById(row.facility_id);
    const sport = await getSportById(row.sport_id);

    if (!facility || !sport) return undefined;

    return {
        id: row.id,
        userId: row.user_id,
        facilityId: row.facility_id,
        facilityName: facility.name,
        sportId: row.sport_id,
        sportName: sport.name,
        date: formatDateFns(new Date(row.date), 'yyyy-MM-dd'),
        startTime: row.start_time,
        endTime: row.end_time,
        durationHours: row.duration_hours,
        totalPrice: parseFloat(row.total_price),
        status: row.status,
        bookedAt: new Date(row.bookedAt).toISOString(),
        reviewed: row.reviewed,
        baseFacilityPrice: parseFloat(row.base_facility_price),
        equipmentRentalCost: parseFloat(row.equipment_rental_cost),
    };
};

export const addBooking = async (bookingData: Omit<Booking, 'id' | 'bookedAt'>): Promise<Booking> => {
    const {
        userId,
        facilityId,
        sportId,
        date,
        startTime,
        endTime,
        durationHours,
        totalPrice,
        status,
        baseFacilityPrice,
        equipmentRentalCost,
        appliedPromotion,
        numberOfGuests,
    } = bookingData;

    try {
        const res = await query(
            `INSERT INTO bookings (user_id, facility_id, sport_id, date, start_time, end_time, duration_hours, total_price, status, reviewed, base_facility_price, equipment_rental_cost, applied_promotion_code, applied_promotion_discount, number_of_guests)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, false, $10, $11, $12, $13, $14)
             RETURNING id`,
            [
                userId,
                facilityId,
                sportId,
                date,
                startTime,
                endTime,
                durationHours,
                totalPrice,
                status,
                baseFacilityPrice,
                equipmentRentalCost,
                appliedPromotion?.code,
                appliedPromotion?.discountAmount,
                numberOfGuests
            ]
        );
        const newBookingId = res.rows[0].id;
        const newBooking = await getBookingById(newBookingId);
        if (!newBooking) {
            throw new Error("Could not retrieve newly created booking.");
        }
        return newBooking;
    } catch (error) {
        console.error('Error adding booking to database:', error);
        throw new Error('Failed to create booking.');
    }
};

export const updateBooking = async (bookingId: string, updates: Partial<Booking>): Promise<Booking | undefined> => {
    const booking = await getBookingById(bookingId);
    if (!booking) {
        return undefined;
    }
    const updatedBooking = { ...booking, ...updates };
    const { date, startTime, endTime, totalPrice, status } = updatedBooking;

    const res = await query(
        `UPDATE bookings SET date = $1, start_time = $2, end_time = $3, total_price = $4, status = $5
         WHERE id = $6 RETURNING *`,
        [date, startTime, endTime, totalPrice, status, bookingId]
    );
    return getBookingById(res.rows[0].id);
};

export const updateUser = async (userId: string, updates: Partial<UserProfile>): Promise<UserProfile | undefined> => {
    const { name, email, role, status, membershipLevel, favoriteFacilities } = updates;

    // This is a simplified update. A real app would handle each field separately.
    // For now, we'll focus on a few key updatable fields.
    const res = await query(
        `UPDATE users 
         SET name = COALESCE($1, name), 
             email = COALESCE($2, email), 
             role = COALESCE($3, role), 
             status = COALESCE($4, status), 
             membership_level = COALESCE($5, membership_level)
         WHERE id = $6 RETURNING *`,
        [name, email, role, status, membershipLevel, userId]
    );

    if (res.rows.length === 0) return undefined;
    
    // Note: favoriteFacilities would need a separate table in a real relational DB.
    // We are skipping its update here as it's not in the schema.
    
    return getUserById(res.rows[0].id);
};


export async function addUser(userData: { name: string; email: string, password?: string }): Promise<UserProfile> {
  const { name, email, password } = userData;

  const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
  if (existingUser.rows.length > 0) {
    throw new Error('A user with this email already exists.');
  }
  
  const defaultProfilePic = `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(name)}`;

  const res = await query(
    `INSERT INTO users (name, email, password, role, status, is_profile_public, profile_picture_url, membership_level, loyalty_points)
     VALUES ($1, $2, $3, 'User', 'Active', true, $4, 'Basic', 0) RETURNING *`,
    [name, email, password, defaultProfilePic]
  );
  
  const newUserRow = res.rows[0];
  const newUser = await getUserById(newUserRow.id);
  if (!newUser) throw new Error("Failed to retrieve newly created user");
  return newUser;
}


export const getBookingsForFacilityOnDate = async (facilityId: string, date: string): Promise<Booking[]> => {
    const { rows } = await query(
        `SELECT * FROM bookings WHERE facility_id = $1 AND date = $2 AND status IN ('Confirmed', 'Pending')`,
        [facilityId, date]
    );

    const bookings: Booking[] = [];
    for (const row of rows) {
        const facility = await getFacilityById(row.facility_id);
        const sport = await getSportById(row.sport_id);

        if (facility && sport) {
            bookings.push({
                id: row.id,
                userId: row.user_id,
                facilityId: row.facility_id,
                facilityName: facility.name,
                sportId: row.sport_id,
                sportName: sport.name,
                date: formatDateFns(new Date(row.date), 'yyyy-MM-dd'),
                startTime: row.start_time,
                endTime: row.end_time,
                durationHours: row.duration_hours,
                totalPrice: parseFloat(row.total_price),
                status: row.status,
                bookedAt: new Date(row.created_at).toISOString(),
                reviewed: row.reviewed,
            });
        }
    }
    return bookings;
};

export const getBookingsByUserId = async (userId: string): Promise<Booking[]> => {
    const { rows } = await query('SELECT * FROM bookings WHERE user_id = $1 ORDER BY date DESC, start_time DESC', [userId]);
    
    const bookings: Booking[] = [];
    for (const row of rows) {
        const facility = await getFacilityById(row.facility_id);
        const sport = await getSportById(row.sport_id);

        if (facility && sport) {
            bookings.push({
                id: row.id,
                userId: row.user_id,
                facilityId: row.facility_id,
                facilityName: facility.name,
                sportId: row.sport_id,
                sportName: sport.name,
                date: formatDateFns(new Date(row.date), 'yyyy-MM-dd'),
                startTime: row.start_time,
                endTime: row.end_time,
                durationHours: row.duration_hours,
                totalPrice: parseFloat(row.total_price),
                status: row.status,
                bookedAt: new Date(row.created_at).toISOString(),
                reviewed: row.reviewed,
            });
        }
    }
    return bookings;
};

export const getSportById = async (id: string): Promise<Sport | undefined> => {
    const { rows } = await query('SELECT * FROM sports WHERE id = $1', [id]);
    if (rows.length === 0) return undefined;
    const sport = rows[0];
    return { ...sport, iconName: sport.icon_name };
}
export const getSiteSettings = (): SiteSettings => mockSiteSettings;

export const getFacilitiesByOwnerId = async (ownerId: string): Promise<Facility[]> => {
    const facilities = await getAllFacilities();
    return facilities.filter(f => f.ownerId === ownerId);
};

export const calculateAverageRating = (reviews: Review[] | undefined): number => {
  if (!reviews || reviews.length === 0) {
    return 0;
  }
  const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
  return parseFloat((totalRating / reviews.length).toFixed(1));
};

export const getReviewsByFacilityId = (facilityId: string): Review[] => {
    // This should ideally be a DB query
    return [];
}
export const getTeamById = (teamId: string): Team | undefined => mockTeams.find(team => team.id === team.id);
export const getTeamsByUserId = (userId: string): Team[] => mockTeams.filter(team => team.memberIds.includes(userId));
export const getNotificationsForUser = async (userId: string): Promise<AppNotification[]> => Promise.resolve(mockAppNotifications.filter(n => n.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));

export const getAllBlogPosts = async (): Promise<BlogPost[]> => {
    const { rows } = await query('SELECT * FROM blog_posts ORDER BY published_at DESC');
    return rows.map(row => ({
        id: row.id,
        slug: row.slug,
        title: row.title,
        excerpt: row.excerpt,
        content: row.content,
        authorName: row.author_name,
        authorAvatarUrl: row.author_avatar_url,
        publishedAt: new Date(row.published_at).toISOString(),
        tags: row.tags,
        isFeatured: row.is_featured,
        dataAiHint: row.data_ai_hint,
    }));
};

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | undefined> => {
    const { rows } = await query('SELECT * FROM blog_posts WHERE slug = $1', [slug]);
    if (rows.length === 0) return undefined;
    const row = rows[0];
    return {
        id: row.id,
        slug: row.slug,
        title: row.title,
        excerpt: row.excerpt,
        content: row.content,
        authorName: row.author_name,
        authorAvatarUrl: row.author_avatar_url,
        publishedAt: new Date(row.published_at).toISOString(),
        tags: row.tags,
        isFeatured: row.is_featured,
        dataAiHint: row.data_ai_hint,
    };
};

export const getAllEvents = async (): Promise<SportEvent[]> => {
    const { rows } = await query('SELECT * FROM events');
    const allSports = await getAllSports();
    return rows.map(row => ({
        ...row,
        startDate: new Date(row.start_date).toISOString(),
        endDate: new Date(row.end_date).toISOString(),
        sport: allSports.find(s => s.id === row.sport_id)!,
        facilityName: row.facility_name,
        entryFee: parseFloat(row.entry_fee),
        maxParticipants: row.max_participants,
        registeredParticipants: row.registered_participants
    }));
};
export const getEventById = async (id: string): Promise<SportEvent | undefined> => {
    const { rows } = await query('SELECT * FROM events WHERE id = $1', [id]);
    if (rows.length === 0) return undefined;
    const row = rows[0];
    const allSports = await getAllSports();
    return {
        ...row,
        startDate: new Date(row.start_date).toISOString(),
        endDate: new Date(row.end_date).toISOString(),
        sport: allSports.find(s => s.id === row.sport_id)!,
        facilityName: row.facility_name,
        entryFee: parseFloat(row.entry_fee),
        maxParticipants: row.max_participants,
        registeredParticipants: row.registered_participants
    };
};
export const getAllPricingRules = (): PricingRule[] => [...mockPricingRules];
export const getPricingRuleById = (id: string): PricingRule | undefined => mockPricingRules.find(rule => rule.id === rule.id);
export const getAllPromotionRules = (): PromotionRule[] => [...mockPromotionRules].sort((a, b) => a.name.localeCompare(b.name));
export const getPromotionRuleById = (id: string): PromotionRule | undefined => mockPromotionRules.find(r => r.id === r.id);
export const isUserOnWaitlist = (userId: string, facilityId: string, date: string, startTime: string): boolean => {
    return mockWaitlist.some(entry => entry.userId === userId && entry.facilityId === facilityId && entry.date === date && entry.startTime === startTime);
}
export const getOpenLfgRequests = (): LfgRequest[] => mockLfgRequests.filter(req => req.status === 'open').sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

export const getAllBookings = async (): Promise<Booking[]> => {
    const { rows } = await query('SELECT *, created_at AS "bookedAt" FROM bookings');
    const bookings: Booking[] = [];
    for (const row of rows) {
        const facility = await getFacilityById(row.facility_id);
        const sport = await getSportById(row.sport_id);

        if (facility && sport) {
            bookings.push({
                id: row.id,
                userId: row.user_id,
                facilityId: row.facility_id,
                facilityName: facility.name,
                sportId: row.sport_id,
                sportName: sport.name,
                date: formatDateFns(new Date(row.date), 'yyyy-MM-dd'),
                startTime: row.start_time,
                endTime: row.end_time,
                durationHours: row.duration_hours,
                totalPrice: parseFloat(row.total_price),
                status: row.status,
                bookedAt: new Date(row.bookedAt).toISOString(),
                reviewed: row.reviewed,
            });
        }
    }
    return bookings;
};
export const getEventsByFacilityIds = async (facilityIds: string[]): Promise<SportEvent[]> => {
    if (facilityIds.length === 0) return [];
    const events = await getAllEvents();
    return events.filter(e => facilityIds.includes(e.facilityId));
};
export const getLfgRequestsByFacilityIds = async (facilityIds: string[]): Promise<LfgRequest[]> => Promise.resolve(mockLfgRequests.filter(lfg => facilityIds.includes(lfg.facilityId)));
export const getChallengesByFacilityIds = async (facilityIds: string[]): Promise<Challenge[]> => Promise.resolve(mockChallenges.filter(c => facilityIds.includes(c.facilityId)));


export const addNotification = async (userId: string, notificationData: Omit<AppNotification, 'id' | 'userId' | 'createdAt' | 'isRead'>): Promise<AppNotification> => {
    let iconName = 'Info';
    switch (notificationData.type) { case 'booking_confirmed': iconName = 'CheckCircle'; break; case 'booking_cancelled': iconName = 'XCircle'; break; case 'review_submitted': iconName = 'MessageSquareText'; break; case 'reminder': iconName = 'CalendarDays'; break; case 'promotion': iconName = 'Gift'; break; case 'waitlist_opening': iconName = 'BellRing'; break; case 'user_status_changed': iconName = 'Edit3'; break; case 'matchmaking_interest': iconName = 'Swords'; break; }
    
    const { type, title, message, link } = notificationData;
    const finalIconName = notificationData.iconName || iconName;

    const res = await query(
        `INSERT INTO notifications (user_id, type, title, message, link, icon_name)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [userId, type, title, message, link, finalIconName]
    );

    const newNotification = res.rows[0];

    return {
        id: newNotification.id,
        userId: newNotification.user_id,
        type: newNotification.type,
        title: newNotification.title,
        message: newNotification.message,
        createdAt: new Date(newNotification.created_at).toISOString(),
        isRead: newNotification.is_read,
        link: newNotification.link,
        iconName: newNotification.icon_name
    };
};


export const updateSiteSettings = (updates: Partial<SiteSettings>): SiteSettings => {
    mockSiteSettings = { ...mockSiteSettings, ...updates };
    return mockSiteSettings;
};
export const createTeam = (teamData: { name: string; sportId: string; captainId: string }): Team => {
    // This function needs to be converted to async and use DB
    const sport = getMockSports().find(s => s.id === teamData.sportId);
    if (!sport) throw new Error('Sport not found');
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


export const markNotificationAsRead = async (userId: string, notificationId: string): Promise<void> => { 
    await query('UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2', [notificationId, userId]);
};
export const markAllNotificationsAsRead = async (userId: string): Promise<void> => { 
    await query('UPDATE notifications SET is_read = true WHERE user_id = $1', [userId]);
};

export const addReview = async (reviewData: Omit<Review, 'id' | 'createdAt' | 'userName' | 'userAvatar' | 'isPublicProfile'>): Promise<Review> => {
    const currentUser = await getUserById(reviewData.userId);
    if (!currentUser) throw new Error("User not found to post review.");

    const { facilityId, userId, rating, comment, bookingId } = reviewData;
    const res = await query(
        `INSERT INTO reviews (facility_id, user_id, user_name, user_avatar, is_public_profile, rating, comment, booking_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [facilityId, userId, currentUser.name, currentUser.profilePictureUrl, currentUser.isProfilePublic, rating, comment, bookingId]
    );
    await query('UPDATE bookings SET reviewed = true WHERE id = $1', [bookingId]);

    // Recalculate and update facility's average rating
    const ratingRes = await query('SELECT AVG(rating) as avg_rating FROM reviews WHERE facility_id = $1', [facilityId]);
    const newAvgRating = parseFloat(ratingRes.rows[0].avg_rating).toFixed(1);
    await query('UPDATE facilities SET rating = $1 WHERE id = $2', [newAvgRating, facilityId]);

    const newReview = res.rows[0];
    return {
        id: newReview.id,
        facilityId: newReview.facility_id,
        userId: newReview.user_id,
        userName: newReview.user_name,
        userAvatar: newReview.user_avatar,
        isPublicProfile: newReview.is_public_profile,
        rating: newReview.rating,
        comment: newReview.comment,
        createdAt: new Date(newReview.created_at).toISOString(),
        bookingId: newReview.booking_id,
    };
};

export const createLfgRequest = (requestData: Omit<LfgRequest, 'id' | 'createdAt' | 'status' | 'interestedUserIds' | 'facilityName'>): LfgRequest[] => {
    // Needs DB implementation
    return [];
};

export const expressInterestInLfg = (lfgId: string, userId: string): LfgRequest[] => {
    // Needs DB implementation
    return [];
};

export const getOpenChallenges = (): Challenge[] => {
    // Needs DB implementation
    return [];
};

export const createChallenge = (data: { challengerId: string; sportId: string; facilityId: string; proposedDate: string; notes: string }): Challenge[] => {
   // Needs DB implementation
    return [];
};

export const acceptChallenge = (challengeId: string, opponentId: string): Challenge[] => {
    // Needs DB implementation
    return [];
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
    const sport = await getSportById(event.sportId); 
    const facility = await getFacilityById(event.facilityId);
    if(sport && facility) {
        await query(
            `INSERT INTO events (name, facility_id, facility_name, sport_id, start_date, end_date, description, entry_fee, max_participants, registered_participants)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 0)`,
            [event.name, event.facilityId, facility.name, sport.id, event.startDate, event.endDate, event.description, event.entryFee, event.maxParticipants]
        );
    } else {
        console.error("Could not create event: Sport or Facility not found.");
    }
};
export const updateEvent = async (eventData: Omit<SportEvent, 'sport'> & { sportId: string }): Promise<void> => {
    await query(
        `UPDATE events SET name = $1, facility_id = $2, sport_id = $3, start_date = $4, end_date = $5, description = $6, entry_fee = $7, max_participants = $8 WHERE id = $9`,
        [eventData.name, eventData.facilityId, eventData.sportId, eventData.startDate, eventData.endDate, eventData.description, eventData.entryFee, eventData.maxParticipants, eventData.id]
    );
};
export const deleteEvent = async (id: string): Promise<void> => { await query('DELETE FROM events WHERE id = $1', [id]); };
export const registerForEvent = (eventId: string): boolean => { 
    // Needs DB implementation
    return false; 
};
export const addPricingRule = (rule: Omit<PricingRule, 'id'>): void => { mockPricingRules.push({ ...rule, id: `pr-${Date.now()}` }); };
export const updatePricingRule = (rule: PricingRule): void => { const index = mockPricingRules.findIndex(r => r.id === rule.id); if (index !== -1) mockPricingRules[index] = rule; };
export const deletePricingRule = (id: string): void => { mockPricingRules = mockPricingRules.filter(r => r.id !== id); };
export const addPromotionRule = (rule: Omit<PromotionRule, 'id'>): void => { mockPromotionRules.push({ ...rule, id: `promo-${Date.now()}` }); };
export const updatePromotionRule = (rule: PromotionRule): void => { const index = mockPromotionRules.findIndex(r => r.id === rule.id); if (index !== -1) mockPromotionRules[index] = rule; };
export const dbGetPromotionRuleByCode = async (code: string): Promise<PromotionRule | undefined> => Promise.resolve(mockPromotionRules.find(p => p.code?.toUpperCase() === code.toUpperCase() && p.isActive));
export const addToWaitlist = async (userId: string, facilityId: string, date: string, startTime: string): Promise<void> => { const entry: WaitlistEntry = { id: `wait-${Date.now()}`, userId, facilityId, date, startTime, createdAt: new Date().toISOString() }; mockWaitlist.push(entry); };
export async function listenToOwnerBookings(ownerId: string, callback: (bookings: Booking[]) => void, onError: (error: Error) => void): Promise<() => void> {
    // Needs DB implementation
    return () => {};
}
export const blockTimeSlot = async (facilityId: string, ownerId: string, newBlock: BlockedSlot): Promise<boolean> => {
    // Needs DB implementation
   return false;
};

export const unblockTimeSlot = async (facilityId: string, ownerId: string, date: string, startTime: string): Promise<boolean> => {
    // Needs DB implementation
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
    const interval = setInterval(async () => {
        try {
            const events = await getAllEvents();
            callback(events);
        } catch(e) {
            onError(e as Error);
        }
    }, 5000); // Poll every 5 seconds
    
    // initial call
    getAllEvents().then(callback).catch(onError);

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

export const getAllSports = async (): Promise<Sport[]> => {
    const { rows } = await query('SELECT * from sports');
    return rows.map(r => ({...r, iconName: r.icon_name}));
};

export const addSport = async (sportData: Omit<Sport, 'id'>): Promise<Sport> => {
    const { rows } = await query('INSERT INTO sports (name, icon_name, image_url, image_data_ai_hint) VALUES ($1, $2, $3, $4) RETURNING *', [sportData.name, sportData.iconName, sportData.imageUrl, sportData.imageDataAiHint]);
    const newSport = rows[0];
    return { ...newSport, iconName: newSport.icon_name };
};

export const updateSport = async (sportId: string, sportData: Partial<Sport>): Promise<Sport> => {
    const { rows } = await query('UPDATE sports SET name = $1, icon_name = $2, image_url = $3, image_data_ai_hint = $4 WHERE id = $5 RETURNING *', [sportData.name, sportData.iconName, sportData.imageUrl, sportData.imageDataAiHint, sportId]);
    const updatedSport = rows[0];
    return { ...updatedSport, iconName: updatedSport.icon_name };
};

export const deleteSport = async (sportId: string): Promise<void> => {
    await query('DELETE FROM sports WHERE id = $1', [sportId]);
    return Promise.resolve();
};

export const toggleFavoriteFacility = async (userId: string, facilityId: string): Promise<UserProfile | undefined> => {
    // This is a complex operation in SQL. For now, we keep it as a mock.
    const user = await getUserById(userId);
    if (!user) {
        throw new Error("User not found.");
    }
    const currentFavorites = user.favoriteFacilities || [];
    const isFavorited = currentFavorites.includes(facilityId);

    const newFavorites = isFavorited
        ? currentFavorites.filter(id => id !== facilityId)
        : [...currentFavorites, facilityId];
    
    // This would need a proper SQL update to a user_favorites junction table.
    // The mock updateUser will simulate this for now.
    return mockUpdateUser(userId, { favoriteFacilities: newFavorites });
};

// This is a mock implementation for client-side updates while DB is not fully relational for this.
export const mockUpdateUser = (userId: string, updates: Partial<UserProfile>): UserProfile | undefined => {
    // This function should be removed once the favorites are moved to a proper DB table.
    // For now, it doesn't interact with the DB and is not used by the main data flow.
    return undefined;
}


export const getEquipmentForFacility = (facilityId: string): RentalEquipment[] => {
    // Needs DB implementation
    return [];
};

export const getPromotionRuleByCode = async (code: string): Promise<PromotionRule | undefined> => {
    return dbGetPromotionRuleByCode(code);
}
