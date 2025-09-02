

import type { Facility, Sport, Amenity, UserProfile, UserRole, UserStatus, Booking, ReportData, MembershipPlan, SportEvent, Review, AppNotification, NotificationType, BlogPost, PricingRule, PromotionRule, RentalEquipment, RentedItemInfo, AppliedPromotionInfo, TimeSlot, UserSkill, SkillLevel, BlockedSlot, SiteSettings, Team, WaitlistEntry, LfgRequest, SportPrice, NotificationTemplate, Challenge } from './types';
import { getStaticUsers, getStaticFacilities, getMockSports, mockAmenities, mockStaticMembershipPlans } from './mock-data';
import { parseISO, isWithinInterval, isAfter, isBefore, startOfDay, endOfDay, getDay, subDays, getMonth, getYear, format as formatDateFns } from 'date-fns';
import { query } from './db';

// --- IN-MEMORY MOCK DATABASE ---
let mockUsers: UserProfile[] = getStaticUsers();
let mockBookings: Booking[] = [
  {
    id: 'booking-1',
    userId: 'user-admin-kunj',
    facilityId: 'facility-1',
    facilityName: 'Pune Sports Complex',
    dataAiHint: 'soccer stadium',
    sportId: 'sport-1',
    sportName: 'Soccer',
    date: '2024-08-10',
    startTime: '18:00',
    endTime: '19:00',
    durationHours: 1,
    totalPrice: 2500,
    status: 'Confirmed',
    bookedAt: '2024-07-20T10:00:00Z',
    reviewed: false,
  },
  {
    id: 'booking-2',
    userId: 'user-regular-charlie',
    facilityId: 'facility-2',
    facilityName: 'Deccan Gymkhana Tennis Club',
    dataAiHint: 'tennis court',
    sportId: 'sport-3',
    sportName: 'Tennis',
    date: '2024-08-12',
    startTime: '09:00',
    endTime: '11:00',
    durationHours: 2,
    totalPrice: 3600,
    status: 'Confirmed',
    bookedAt: '2024-07-18T14:30:00Z',
    reviewed: false,
  },
  {
    id: 'booking-3',
    userId: 'user-admin-kunj',
    facilityId: 'facility-4',
    facilityName: 'The Aundh Swim & Gym Hub',
    dataAiHint: 'swimming pool gym',
    sportId: 'sport-5',
    sportName: 'Swimming',
    date: '2024-06-15',
    startTime: '07:00',
    endTime: '08:00',
    durationHours: 1,
    totalPrice: 400,
    status: 'Confirmed',
    bookedAt: '2024-06-10T11:00:00Z',
    reviewed: true,
  },
  {
    id: 'booking-4',
    userId: 'user-regular-charlie',
    facilityId: 'facility-3',
    facilityName: 'Kothrud Cricket Ground',
    dataAiHint: 'cricket stadium',
    sportId: 'sport-13',
    sportName: 'Cricket',
    date: '2024-07-28',
    startTime: '14:00',
    endTime: '17:00',
    durationHours: 3,
    totalPrice: 9000,
    status: 'Cancelled',
    bookedAt: '2024-07-15T16:00:00Z',
    reviewed: false,
  },
];
let mockReviews: Review[] = [];
let mockTeams: Team[] = [];
let mockAppNotifications: AppNotification[] = [];
let mockBlogPosts: BlogPost[] = [
  {
    id: 'blog-1',
    slug: 'benefits-of-sports',
    title: 'Top 5 Health Benefits of Playing Sports Regularly',
    excerpt: 'Discover how incorporating regular sports activities into your routine can drastically improve your physical and mental well-being.',
    content: `
      <p>Engaging in sports is more than just a hobby; it's a powerful tool for enhancing your overall health. Here are five key benefits:</p>
      <ol>
        <li><strong>Improved Cardiovascular Health:</strong> Regular physical activity strengthens your heart, improves blood circulation, and reduces the risk of heart disease.</li>
        <li><strong>Weight Management:</strong> Sports are a fantastic way to burn calories and maintain a healthy weight, which is crucial for preventing a range of health issues.</li>
        <li><strong>Stress Reduction:</strong> Physical exertion is a natural stress-reliever. It releases endorphins, which act as mood elevators and can help combat anxiety and depression.</li>
        <li><strong>Enhanced Social Skills:</strong> Team sports, in particular, foster communication, teamwork, and leadership skills. They provide a great opportunity to connect with like-minded individuals.</li>
        <li><strong>Increased Bone Density:</strong> Weight-bearing activities like running, tennis, and basketball help in building and maintaining strong bones, reducing the risk of osteoporosis later in life.</li>
      </ol>
      <p>Ready to get started? <a href="/facilities">Browse our facilities</a> and book your next game today!</p>
    `,
    authorName: 'Dr. Eva Rostova',
    authorAvatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    publishedAt: '2024-05-15T10:00:00Z',
    tags: ['Health', 'Fitness', 'Wellness'],
    isFeatured: true,
  },
  {
    id: 'blog-2',
    slug: 'choosing-the-right-facility',
    title: 'How to Choose the Perfect Sports Facility for Your Needs',
    excerpt: 'Finding the right place to play can make all the difference. Here are some tips to help you select the best facility for your game.',
    content: `
      <p>Choosing a sports facility involves more than just finding an open slot. Consider these factors to ensure a great experience:</p>
      <ul>
        <li><strong>Location & Accessibility:</strong> Is it easy to get to? Is there adequate parking or public transport access?</li>
        <li><strong>Court/Field Quality:</strong> Check reviews for comments on the maintenance of the playing surface. A well-kept area prevents injuries and improves the game.</li>
        <li><strong>Amenities:</strong> Do you need lockers, showers, or a place to buy refreshments? Use our platform's amenity filters to find facilities that have what you need.</li>
        <li><strong>Cost:</strong> Compare prices, but also consider the value. A slightly more expensive facility might offer better quality and amenities that are worth the price.</li>
        <li><strong>Booking Policy:</strong> Understand the cancellation and refund policies before you book to avoid any surprises.</li>
      </ul>
      <p>Using the advanced search filters on Sports Arena can help you narrow down your options and find the perfect match in minutes!</p>
    `,
    authorName: 'Mark Chen',
    authorAvatarUrl: 'https://randomuser.me/api/portraits/men/35.jpg',
    publishedAt: '2024-05-10T14:30:00Z',
    tags: ['Tips', 'Facilities', 'Booking'],
  },
  {
    id: 'blog-3',
    slug: 'intro-to-box-cricket',
    title: 'Get into the Game: An Introduction to Box Cricket',
    excerpt: 'Heard of Box Cricket but not sure what it is? This fast-paced version of the classic sport is taking the city by storm.',
    content: `
      <p>Box cricket is a high-energy, condensed version of cricket played in a netted enclosure. It's perfect for smaller groups and offers a more intense, action-packed experience.</p>
      <h3>Why Try Box Cricket?</h3>
      <ul>
        <li><strong>Fast-Paced:</strong> With a smaller playing area, every ball is an event. There's no downtime waiting for the ball to be retrieved from the boundary.</li>
        <li><strong>Accessible:</strong> You don't need a full team of 11 players. Games are often played with 6-8 players per side.</li>
        <li><strong>All-Weather Play:</strong> Many of our listed facilities are covered or indoors, meaning you can play rain or shine.</li>
        <li><strong>Great for All Skill Levels:</strong> It's a fun way for beginners to learn the basics and for experienced players to sharpen their reflexes.</li>
      </ul>
      <p>Many of our listed facilities, like The Box Yard, offer excellent box cricket arenas. It's a fantastic way to get a great workout and have fun with friends. Give it a try!</p>
    `,
    authorName: 'Priya Sharma',
    authorAvatarUrl: 'https://randomuser.me/api/portraits/women/33.jpg',
    publishedAt: '2024-05-05T09:00:00Z',
    tags: ['Sports', 'Cricket', 'Local'],
  }
];
let mockEvents: SportEvent[] = [
  {
    id: 'event-1',
    name: 'Monsoon Soccer League',
    facilityId: 'facility-1',
    facilityName: 'Pune Sports Complex',
    sport: getMockSports().find(s => s.id === 'sport-1')!,
    startDate: '2024-08-01T09:00:00Z',
    endDate: '2024-08-31T18:00:00Z',
    description: 'The biggest 5-a-side soccer tournament of the season. Gather your team and compete for the championship title and exciting cash prizes.',
    entryFee: 5000,
    maxParticipants: 32,
    registeredParticipants: 18,
  },
  {
    id: 'event-2',
    name: 'Club Tennis Open',
    facilityId: 'facility-2',
    facilityName: 'Deccan Gymkhana Tennis Club',
    sport: getMockSports().find(s => s.id === 'sport-3')!,
    startDate: '2024-09-05T10:00:00Z',
    endDate: '2024-09-10T17:00:00Z',
    description: 'An open tennis tournament for all skill levels. Singles and doubles categories available. Show off your skills on our premium clay courts.',
    entryFee: 1500,
    maxParticipants: 64,
    registeredParticipants: 45,
  },
  {
    id: 'event-3',
    name: 'Sunrise Yoga Workshop',
    facilityId: 'facility-6',
    facilityName: 'Zenith Yoga & Dance Studio',
    sport: getMockSports().find(s => s.id === 'sport-6')!,
    startDate: '2024-08-10T06:00:00Z',
    endDate: '2024-08-10T08:00:00Z',
    description: 'A rejuvenating two-hour yoga workshop focusing on mindfulness and Vinyasa flow. Start your weekend with peace and energy. All levels welcome.',
    entryFee: 750,
    maxParticipants: 20,
    registeredParticipants: 12,
  },
];
let mockPricingRules: PricingRule[] = [];
let mockPromotionRules: PromotionRule[] = [];
let mockSiteSettings: SiteSettings = { siteName: 'Sports Arena', defaultCurrency: 'INR', timezone: 'Asia/Kolkata', maintenanceMode: false, notificationTemplates: [] };
let mockWaitlist: WaitlistEntry[] = [];
let mockLfgRequests: LfgRequest[] = [];
let mockChallenges: Challenge[] = [];


// This variable is now mainly for client-side state management, initialized by components.
export let mockUser: UserProfile | undefined = undefined;

// This function allows other components (like the UserSwitcher) to change the active user.
export const setActiveMockUser = (role: 'admin' | 'owner' | 'user') => {
  const newUser = mockUsers.find(u => u.role.toLowerCase() === role);
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
    const allSports = getMockSports();
    const allAmenities = mockAmenities;

    // Fetch all data in parallel
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
        query('SELECT facility_id, day, open_time, close_time FROM facility_operating_hours'),
        query('SELECT * FROM reviews'),
    ]);

    // Create maps for efficient lookups
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
        operatingHoursMap.get(row.facility_id)!.push({ day: row.day, open: row.open_time, close: row.close_time });
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

    // Assemble the final facility objects
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
        joinedAt: new Date(row.joined_at).toISOString(),
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

export const getUserById = (userId: string): UserProfile | undefined => {
    if (!userId) return undefined;
    return mockUsers.find(user => user.id === userId);
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
    const operatingHoursPromise = query('SELECT day, open_time, close_time FROM facility_operating_hours WHERE facility_id = $1', [id]);
    const reviewsPromise = query('SELECT * FROM reviews WHERE facility_id = $1', [id]);
    
    const [sportsRes, amenitiesRes, sportPricesRes, operatingHoursRes, reviewsRes] = await Promise.all([
        sportsPromise, amenitiesPromise, sportPricesPromise, operatingHoursPromise, reviewsPromise
    ]);

    return {
        ...mapDbRowToFacility(facilityRow),
        sports: sportsRes.rows.map(s => ({ ...s, iconName: s.icon_name })),
        amenities: amenitiesRes.rows.map(a => ({ ...a, iconName: a.icon_name })),
        sportPrices: sportPricesRes.rows.map(p => ({ sportId: p.sport_id, price: parseFloat(p.price), pricingModel: p.pricing_model })),
        operatingHours: operatingHoursRes.rows.map(h => ({ day: h.day, open: h.open_time, close: h.close_time })),
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

    // Concurrently handle relations
    await Promise.all([
        // Sports
        ...sports.map(sport => query('INSERT INTO facility_sports (facility_id, sports_id) VALUES ($1, $2)', [newFacilityId, sport.id])),
        // Amenities
        ...amenities.map(amenity => query('INSERT INTO facility_amenities (facility_id, amenity_id) VALUES ($1, $2)', [newFacilityId, amenity.id])),
        // Prices
        ...sportPrices.map(sp => query('INSERT INTO facility_sport_prices (facility_id, sport_id, price, pricing_model) VALUES ($1, $2, $3, $4)', [newFacilityId, sp.sportId, sp.price, sp.pricingModel])),
        // Hours
        ...operatingHours.map(oh => query('INSERT INTO facility_operating_hours (facility_id, day, open_time, close_time) VALUES ($1, $2, $3, $4)', [newFacilityId, oh.day, oh.open, oh.close])),
    ]);

    return (await getFacilityById(newFacilityId))!;
};

export const updateFacility = async (facilityData: Facility): Promise<Facility> => {
    const { id, name, type, address, city, location, description, isPopular, isIndoor, ownerId, sports, amenities, sportPrices, operatingHours } = facilityData;
    
    await query(
        `UPDATE facilities SET name = $1, type = $2, address = $3, city = $4, location = $5, description = $6, is_popular = $7, is_indoor = $8, owner_id = $9
         WHERE id = $10`,
        [name, type, address, city, location, description, isPopular, isIndoor, ownerId, id]
    );
    
    // Clear and re-insert relational data
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
        ...operatingHours.map(oh => query('INSERT INTO facility_operating_hours (facility_id, day, open_time, close_time) VALUES ($1, $2, $3, $4)', [id, oh.day, oh.open, oh.close])),
    ]);

    return (await getFacilityById(id))!;
};

export const deleteFacility = async (facilityId: string): Promise<void> => {
    // The CASCADE option in the schema will handle deleting related entries in junction tables
    await query('DELETE FROM facilities WHERE id = $1', [facilityId]);
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

export const updateUser = async (userId: string, updates: Partial<UserProfile>): Promise<UserProfile | undefined> => {
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
        mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };
        
        if (mockUser?.id === userId) {
            mockUser = mockUsers[userIndex];
        }
        return mockUsers[userIndex];
    }
    return undefined;
};

export async function addUser(userData: { name: string; email: string, password?: string }): Promise<UserProfile> {
  const { name, email, password } = userData;

  const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
  if (existingUser.rows.length > 0) {
    throw new Error('A user with this email already exists.');
  }

  // In a real app, you would hash the password here before storing.
  // For this project, we'll store it as is (which is NOT secure for production).
  const res = await query(
    `INSERT INTO users (name, email, password, role, status, is_profile_public)
     VALUES ($1, $2, $3, 'User', 'Active', true) RETURNING *`,
    [name, email, password]
  );
  
  const newUserRow = res.rows[0];
  
  const newUser: UserProfile = {
    id: newUserRow.id,
    name: newUserRow.name,
    email: newUserRow.email,
    role: newUserRow.role,
    status: newUserRow.status,
    joinedAt: new Date(newUserRow.joined_at).toISOString(),
    isProfilePublic: newUserRow.is_profile_public,
  };
  return newUser;
}


export const getBookingsForFacilityOnDate = async (facilityId: string, date: string): Promise<Booking[]> => {
    const bookings = mockBookings.filter(b => b.facilityId === facilityId && b.date === date && (b.status === 'Confirmed' || b.status === 'Pending'));
    return Promise.resolve(bookings);
};

export const getBookingsByUserId = async (userId: string): Promise<Booking[]> => {
    const bookings = mockBookings.filter(b => b.userId === userId);
    return Promise.resolve(bookings);
};

// --- STATIC/MOCK GETTERS ---
export const getSportById = (id: string): Sport | undefined => getMockSports().find(s => s.id === id);
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

export const getReviewsByFacilityId = (facilityId: string): Review[] => mockReviews.filter(review => review.facilityId === facilityId);
export const getTeamById = (teamId: string): Team | undefined => mockTeams.find(team => team.id === team.id);
export const getTeamsByUserId = (userId: string): Team[] => mockTeams.filter(team => team.memberIds.includes(userId));
export const getNotificationsForUser = async (userId: string): Promise<AppNotification[]> => Promise.resolve(mockAppNotifications.filter(n => n.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
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
export const getEventsByFacilityIds = async (facilityIds: string[]): Promise<SportEvent[]> => Promise.resolve(mockEvents.filter(e => facilityIds.includes(e.facilityId)));
export const getLfgRequestsByFacilityIds = async (facilityIds: string[]): Promise<LfgRequest[]> => Promise.resolve(mockLfgRequests.filter(lfg => facilityIds.includes(lfg.facilityId)));
export const getChallengesByFacilityIds = async (facilityIds: string[]): Promise<Challenge[]> => Promise.resolve(mockChallenges.filter(c => facilityIds.includes(c.facilityId)));


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
  if (mockUser) {
    updateUser(teamData.captainId, { teamIds: [...(mockUser.teamIds || []), newTeam.id] });
  }
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
  
  if (mockUser) {
    updateUser(userId, { teamIds: mockUser.teamIds?.filter(id => id !== teamId) });
  }
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


export const markNotificationAsRead = async (userId: string, notificationId: string): Promise<void> => { const notification = mockAppNotifications.find(n => n.id === notificationId && n.userId === userId); if (notification) notification.isRead = true; };
export const markAllNotificationsAsRead = async (userId: string): Promise<void> => { mockAppNotifications.forEach(n => { if (n.userId === userId) n.isRead = true; }); };
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

export const createLfgRequest = (requestData: Omit<LfgRequest, 'id' | 'createdAt' | 'status' | 'interestedUserIds' | 'facilityName'>): LfgRequest[] => {
    const facility = getStaticFacilities().find(f => f.id === requestData.facilityId);
    if (!facility) {
        throw new Error("Facility not found");
    }

    const newRequest: LfgRequest = {
        ...requestData,
        id: `lfg-${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: 'open',
        interestedUserIds: [],
        facilityName: facility.name
    };
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

export const createChallenge = (data: { challengerId: string; sportId: string; facilityId: string; proposedDate: string; notes: string }): Challenge[] => {
    const challenger = getUserById(data.challengerId);
    const sport = getSportById(data.sportId);
    const facility = getStaticFacilities().find(f => f.id === data.facilityId);

    if (!challenger || !sport || !facility) {
        throw new Error("Invalid challenger, sport, or facility ID");
    }

    const newChallenge: Challenge = {
        id: `challenge-${Date.now()}`,
        challengerId: data.challengerId,
        challenger,
        sport,
        facilityId: data.facilityId,
        facilityName: facility.name,
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
   const facility = getStaticFacilities().find(f => f.id === facilityId && f.ownerId === ownerId);
   if (facility) {
       if (!facility.blockedSlots) {
           facility.blockedSlots = [];
       }
       // Ensure no duplicates
       const alreadyExists = facility.blockedSlots.some(s => s.date === newBlock.date && s.startTime === newBlock.startTime);
       if(alreadyExists) return false;
       
       facility.blockedSlots.push(newBlock);
       return true;
   }
   return false;
};

export const unblockTimeSlot = async (facilityId: string, ownerId: string, date: string, startTime: string): Promise<boolean> => {
    const facility = getStaticFacilities().find(f => f.id === facilityId && f.ownerId === ownerId);
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

export const getAllSports = async (): Promise<Sport[]> => {
    return Promise.resolve(getMockSports());
};

export const addSport = async (sportData: Omit<Sport, 'id'>): Promise<Sport> => {
    const newSport: Sport = {
        ...sportData,
        id: `sport-${Date.now()}`
    };
    getMockSports().push(newSport);
    return Promise.resolve(newSport);
};

export const updateSport = async (sportId: string, sportData: Partial<Sport>): Promise<Sport> => {
    const sports = getMockSports();
    const index = sports.findIndex(s => s.id === sportId);
    if (index !== -1) {
        sports[index] = { ...sports[index], ...sportData };
        return Promise.resolve(sports[index]);
    }
    throw new Error("Sport not found for update.");
};

export const deleteSport = async (sportId: string): Promise<void> => {
    const sports = getMockSports();
    const index = sports.findIndex(s => s.id === sportId);
    if (index > -1) {
        sports.splice(index, 1);
    }
    return Promise.resolve();
};

export const toggleFavoriteFacility = async (userId: string, facilityId: string): Promise<UserProfile | undefined> => {
    const user = getUserById(userId);
    if (!user) {
        throw new Error("User not found.");
    }
    const currentFavorites = user.favoriteFacilities || [];
    const isFavorited = currentFavorites.includes(facilityId);

    const newFavorites = isFavorited
        ? currentFavorites.filter(id => id !== facilityId)
        : [...currentFavorites, facilityId];
    
    return updateUser(userId, { favoriteFavorites: newFavorites });
};

export const getEquipmentForFacility = (facilityId: string): RentalEquipment[] => {
    const facility = getStaticFacilities().find(f => f.id === facilityId);
    return facility?.availableEquipment || [];
};
