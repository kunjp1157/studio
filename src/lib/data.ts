

import type { Facility, Sport, Amenity, UserProfile, UserRole, UserStatus, Booking, ReportData, MembershipPlan, SportEvent, Review, AppNotification, NotificationType, BlogPost, PricingRule, PromotionRule, RentalEquipment, RentedItemInfo, AppliedPromotionInfo, TimeSlot, UserSkill, SkillLevel, BlockedSlot, SiteSettings, Team, WaitlistEntry, LfgRequest, SportPrice, NotificationTemplate, Challenge } from './types';
import { getStaticUsers, getStaticFacilities, getMockSports, mockAmenities, mockStaticMembershipPlans } from './mock-data';
import { parseISO, isWithinInterval, isAfter, isBefore, startOfDay, endOfDay, getDay, subDays, getMonth, getYear, format as formatDateFns } from 'date-fns';
import { query } from './db';

// --- IN-MEMORY MOCK DATABASE ---
let mockUsers: UserProfile[] = getStaticUsers();
let mockFacilities: Facility[] = getStaticFacilities();
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


export const getAllFacilities = async (): Promise<Facility[]> => {
    return Promise.resolve(mockFacilities);
};

export const getAllUsers = async (): Promise<UserProfile[]> => {
    const { rows } = await query('SELECT * FROM users');
    // A simple conversion from snake_case (in DB) to camelCase (in JS/TS)
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
        // The following properties are not yet in the DB schema, so we provide defaults
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
    return Promise.resolve(mockFacilities.find(f => f.id === id));
};

export const getFacilitiesByIds = async (ids: string[]): Promise<Facility[]> => {
    if (!ids || ids.length === 0) return Promise.resolve([]);
    const facilities = mockFacilities.filter(f => ids.includes(f.id));
    return Promise.resolve(facilities);
};

export const addFacility = async (facilityData: Omit<Facility, 'id'>): Promise<Facility> => {
    const newFacility: Facility = {
        ...facilityData,
        id: `facility-${Date.now()}-${Math.random()}`
    };
    mockFacilities.push(newFacility);
    return Promise.resolve(newFacility);
};

export const updateFacility = async (facilityData: Facility): Promise<Facility> => {
    const index = mockFacilities.findIndex(f => f.id === facilityData.id);
    if (index !== -1) {
        mockFacilities[index] = facilityData;
        return Promise.resolve(mockFacilities[index]);
    }
    throw new Error("Facility not found for update");
};

export const deleteFacility = async (facilityId: string): Promise<void> => {
    const index = mockFacilities.findIndex(f => f.id === facilityId);
    if (index > -1) {
        mockFacilities.splice(index, 1);
    }
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

export const updateUser = (userId: string, updates: Partial<UserProfile>): UserProfile | undefined => {
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
        mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };
        
        // Also update the active user if it's the one being changed
        if (mockUser?.id === userId) {
            mockUser = mockUsers[userIndex];
        }
        return mockUsers[userIndex];
    }
    return undefined;
};

export const addUser = async (userData: { name: string, email: string }): Promise<UserProfile> => {
  return new Promise((resolve, reject) => {
    if (mockUsers.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
      reject(new Error("A user with this email already exists."));
      return;
    }

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: 'User',
      status: 'Active',
      joinedAt: new Date().toISOString(),
      membershipLevel: 'Basic',
      isProfilePublic: true,
      loyaltyPoints: 0,
      achievements: [],
      skillLevels: [],
      preferredSports: [],
      favoriteFacilities: [],
      teamIds: [],
    };

    mockUsers.push(newUser);
    resolve(newUser);
  });
};


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
    const facilities = mockFacilities.filter(f => f.ownerId === ownerId);
    return Promise.resolve(facilities);
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
    const facility = mockFacilities.find(f => f.id === requestData.facilityId);
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
    const facility = mockFacilities.find(f => f.id === data.facilityId);

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
   const facility = mockFacilities.find(f => f.id === facilityId && f.ownerId === ownerId);
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
    const facility = mockFacilities.find(f => f.id === facilityId && f.ownerId === ownerId);
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
    
    return updateUser(userId, { favoriteFacilities: newFavorites });
};

export const getEquipmentForFacility = (facilityId: string): RentalEquipment[] => {
    const facility = mockFacilities.find(f => f.id === facilityId);
    return facility?.availableEquipment || [];
};

