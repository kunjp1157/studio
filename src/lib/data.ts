

'use server';

import { unstable_noStore as noStore } from 'next/cache';
import { query } from './db';
import type { Facility, Sport, Review, Amenity, UserProfile, Booking, SiteSettings, SportEvent, MembershipPlan, PricingRule, PromotionRule, AppNotification, BlockedSlot, BlogPost, Team, LfgRequest, Challenge, MaintenanceSchedule, FacilityOperatingHours, SportPrice, PricingModel, FacilityStatus } from './types';
import { v4 as uuidv4 } from 'uuid';
import { format, parseISO, isWithinIntervals } from 'date-fns';

let siteSettings: SiteSettings = {
  siteName: 'Sports Arena',
  defaultCurrency: 'INR',
  timezone: 'Asia/Kolkata',
  maintenanceMode: false,
  notificationTemplates: [
    { type: 'booking_confirmed', label: "Booking Confirmed", description: "Sent when a booking is successfully paid and confirmed.", emailEnabled: true, smsEnabled: true, emailSubject: "Your Booking is Confirmed!", emailBody: "Hi {{userName}}, your booking for {{facilityName}} on {{date}} at {{time}} is confirmed. Booking ID: {{bookingId}}.", smsBody: "Booking Confirmed: {{facilityName}} on {{date}} at {{time}}. ID: {{bookingId}}." },
    { type: 'reminder', label: "Booking Reminder", description: "Sent 24 hours before a scheduled booking.", emailEnabled: true, smsEnabled: false, emailSubject: "Reminder: You have a booking tomorrow!", emailBody: "Hi {{userName}}, this is a reminder for your booking at {{facilityName}} tomorrow, {{date}} at {{time}}.", smsBody: "" },
    { type: 'booking_cancelled', label: "Booking Cancelled", description: "Sent when a user or admin cancels a booking.", emailEnabled: true, smsEnabled: false, emailSubject: "Your Booking has been Cancelled", emailBody: "Hi {{userName}}, your booking for {{facilityName}} on {{date}} has been cancelled. If you have any questions, please contact support.", smsBody: "" },
    { type: 'general', label: "General Notification", description: "For general announcements or updates.", emailEnabled: true, smsEnabled: false, emailSubject: "A new update from Sports Arena", emailBody: "Hi {{userName}}, \n\nWe have a new update for you. Please log in to your account to see more details.", smsBody: "" },
    { type: 'user_status_changed', label: 'User Status Changed', description: 'When an admin changes a user status (e.g., suspend).', emailEnabled: true, smsEnabled: false, emailSubject: 'Your Account Status has been Updated', emailBody: 'Hi {{userName}},\n\nAn administrator has updated your account status. Please log in to view the changes or contact support if you have questions.', smsBody: '' },
    { type: 'facility_approved', label: 'Facility Approved/Rejected', description: 'When an admin approves or rejects a facility.', emailEnabled: true, smsEnabled: false, emailSubject: 'Your Facility Submission has been Reviewed', emailBody: 'Hi {{userName}},\n\nYour facility "{{facilityName}}" has been reviewed by our team. Please log in to your owner portal to see the latest status.', smsBody: '' },
  ],
};


// In-memory data stores
let facilities: Facility[] = [];
let sports: Sport[] = [];
let amenities: Amenity[] = [];
let users: UserProfile[] = [];
let bookings: Booking[] = [];
let events: SportEvent[] = [];
let membershipPlans: MembershipPlan[] = [];
let pricingRules: PricingRule[] = [];
let promotionRules: PromotionRule[] = [];
let notifications: AppNotification[] = [];
let blogPosts: BlogPost[] = [];
let teams: Team[] = [];
let lfgRequests: LfgRequest[] = [];
let challenges: Challenge[] = [];


// --- Seeding initial data ---
async function seedData() {
    noStore(); // Prevents this function from being cached
    
    // Check if data is already seeded
    if (sports.length > 0 && amenities.length > 0) return;

    sports = [
        { id: 'sport-1', name: 'Cricket', iconName: 'Dribbble', imageUrl: 'https://images.unsplash.com/photo-1595152772109-a7f20542384a?q=80&w=2071&auto=format&fit=crop', imageDataAiHint: 'cricket stadium' },
        { id: 'sport-2', name: 'Football', iconName: 'Goal', imageUrl: 'https://images.unsplash.com/photo-1551958214-2d5e23efa6e2?q=80&w=2070&auto=format&fit=crop', imageDataAiHint: 'football stadium' },
        { id: 'sport-3', name: 'Badminton', iconName: 'Feather', imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2070&auto=format&fit=crop', imageDataAiHint: 'badminton court' },
        { id: 'sport-4', name: 'Tennis', iconName: 'Dribbble', imageUrl: 'https://images.unsplash.com/photo-1554062614-6da4fa67725a?q=80&w=2070&auto=format&fit=crop', imageDataAiHint: 'tennis court' },
        { id: 'sport-5', name: 'Basketball', iconName: 'Dribbble', imageUrl: 'https://images.unsplash.com/photo-1519861531473-920026218875?q=80&w=2070&auto=format&fit=crop', imageDataAiHint: 'basketball court' },
        { id: 'sport-6', name: 'Swimming', iconName: 'Bike', imageUrl: 'https://images.unsplash.com/photo-1580252178272-b5239a4946c1?q=80&w=1969&auto=format&fit=crop', imageDataAiHint: 'swimming pool' },
        { id: 'sport-7', name: 'Table Tennis', iconName: 'Dribbble', imageUrl: 'https://images.unsplash.com/photo-1534158914592-062992fbe900?q=80&w=2070&auto=format&fit=crop', imageDataAiHint: 'table tennis' },
        { id: 'sport-8', name: 'Box Cricket', iconName: 'Dribbble', imageUrl: 'https://plus.unsplash.com/premium_photo-1661963897341-c69c65544b6c?q=80&w=2062&auto=format&fit=crop', imageDataAiHint: 'indoor cricket' },
        { id: 'sport-9', name: 'Squash', iconName: 'Dribbble', imageUrl: 'https://images.unsplash.com/photo-1599481238640-4c1278592a9a?q=80&w=1964&auto=format&fit=crop', imageDataAiHint: 'squash court' }
    ];

    amenities = [
        { id: 'amenity-1', name: 'Parking', iconName: 'ParkingCircle' },
        { id: 'amenity-2', name: 'Washroom', iconName: 'ShowerHead' },
        { id: 'amenity-3', name: 'Locker Room', iconName: 'Lock' },
        { id: 'amenity-4', name: 'Wi-Fi', iconName: 'Wifi' },
        { id: 'amenity-5', name: 'First Aid', iconName: 'Medal' },
        { id: 'amenity-6', name: 'Cafe', iconName: 'Utensils' },
    ];
    
    const ownerId = "user-2";

    const defaultOperatingHours: FacilityOperatingHours[] = [
        { day: 'Mon', open: '08:00', close: '22:00' }, { day: 'Tue', open: '08:00', close: '22:00' },
        { day: 'Wed', open: '08:00', close: '22:00' }, { day: 'Thu', open: '08:00', close: '22:00' },
        { day: 'Fri', open: '08:00', close: '23:00' }, { day: 'Sat', open: '09:00', close: '23:00' },
        { day: 'Sun', open: '09:00', close: '20:00' },
    ];
    
    const sportPrices: SportPrice[] = [
        { sportId: 'sport-1', price: 1500, pricingModel: 'per_hour_flat' },
        { sportId: 'sport-2', price: 1800, pricingModel: 'per_hour_flat' },
        { sportId: 'sport-3', price: 500, pricingModel: 'per_hour_flat' },
        { sportId: 'sport-4', price: 800, pricingModel: 'per_hour_flat' },
        { sportId: 'sport-5', price: 1000, pricingModel: 'per_hour_flat' },
        { sportId: 'sport-6', price: 300, pricingModel: 'per_hour_per_person' },
        { sportId: 'sport-7', price: 400, pricingModel: 'per_hour_flat' },
        { sportId: 'sport-8', price: 2000, pricingModel: 'per_hour_flat' },
        { sportId: 'sport-9', price: 700, pricingModel: 'per_hour_flat' }
    ];

    facilities = [
        { id: 'facility-1', name: 'Grand Arena', type: 'Complex', address: '123, Viman Nagar, Pune, Maharashtra 411014', city: 'Pune', location: 'Viman Nagar', description: 'A state-of-the-art sports complex with multiple courts and fields.', sports: [sports[0], sports[1], sports[3]], sportPrices: [sportPrices[0], sportPrices[1], sportPrices[3]], amenities: [amenities[0], amenities[1], amenities[2], amenities[5]], operatingHours: defaultOperatingHours, rating: 4.8, isPopular: true, isIndoor: false, dataAiHint: 'sports complex stadium', ownerId, status: 'Active' },
        { id: 'facility-2', name: 'Smash It Badminton', type: 'Court', address: '45, Koregaon Park, Pune, Maharashtra 411001', city: 'Pune', location: 'Koregaon Park', description: 'Indoor badminton courts with excellent lighting.', sports: [sports[2]], sportPrices: [sportPrices[2]], amenities: [amenities[0], amenities[1]], operatingHours: defaultOperatingHours, rating: 4.5, isIndoor: true, dataAiHint: 'badminton court shuttlecock', ownerId, status: 'Active' },
        { id: 'facility-3', name: 'Swim Bliss', type: 'Pool', address: '789, Hinjewadi, Pune, Maharashtra 411057', city: 'Pune', location: 'Hinjewadi', description: 'Olympic size swimming pool with clean water and good facilities.', sports: [sports[5]], sportPrices: [sportPrices[5]], amenities: [amenities[1], amenities[2]], operatingHours: defaultOperatingHours, rating: 4.2, dataAiHint: 'swimming pool water', ownerId, status: 'Active' },
        { id: 'facility-4', name: 'Kothrud Box Cricket', type: 'Box Cricket', address: 'Plot 5, Kothrud, Pune, Maharashtra 411038', city: 'Pune', location: 'Kothrud', description: 'A perfect place for a quick game of box cricket with friends.', sports: [sports[7]], sportPrices: [sportPrices[7]], amenities: [amenities[0]], operatingHours: defaultOperatingHours, rating: 4.6, isPopular: true, isIndoor: true, dataAiHint: 'indoor cricket action', ownerId, status: 'PendingApproval' },
    ];
    
    const achievements: Achievement[] = [
      { id: 'ach-1', name: 'First Booking', description: 'Make your first booking', iconName: 'Medal' },
      { id: 'ach-2', name: 'Weekend Warrior', description: 'Play on both Saturday & Sunday', iconName: 'Swords' },
      { id: 'ach-3', name: 'Social Sharer', description: 'Share your booking on social media', iconName: 'Share2' },
      { id: 'ach-4', name: 'Reviewer', description: 'Write your first review', iconName: 'MessageSquare' }
    ];

    users = [
        { id: 'user-1', name: 'Admin User', email: 'admin@sportsarena.com', password: 'password', role: 'Admin', status: 'Active', joinedAt: '2023-01-15T10:00:00Z', isProfilePublic: true, loyaltyPoints: 1500, achievements: achievements.map(a => ({...a, unlockedAt: '2023-05-10T10:00:00Z'})) },
        { id: 'user-2', name: 'Bob Johnson (Owner)', email: 'owner@sportsarena.com', password: 'password', role: 'FacilityOwner', status: 'Active', joinedAt: '2023-02-20T11:30:00Z', isProfilePublic: true, loyaltyPoints: 800, achievements: [achievements[0]] },
        { id: 'user-3', name: 'Charlie Davis', email: 'charlie@example.com', password: 'password', role: 'User', status: 'Active', joinedAt: '2023-03-10T09:00:00Z', isProfilePublic: true, loyaltyPoints: 250, achievements: [achievements[0]] },
        { id: 'user-4', name: 'Diana Prince', email: 'diana@example.com', password: 'password', role: 'User', status: 'Suspended', joinedAt: '2023-04-05T18:00:00Z', isProfilePublic: false, loyaltyPoints: 50 },
    ];
    
    bookings = [
        { id: 'booking-1', userId: 'user-3', facilityId: 'facility-1', facilityName: 'Grand Arena', sportId: 'sport-1', sportName: 'Cricket', date: '2024-06-20', startTime: '18:00', endTime: '20:00', baseFacilityPrice: 3000, equipmentRentalCost: 0, totalPrice: 3000, status: 'Confirmed', bookedAt: '2024-06-15T10:00:00Z', reviewed: true },
        { id: 'booking-2', userId: 'user-3', facilityId: 'facility-2', facilityName: 'Smash It Badminton', sportId: 'sport-3', sportName: 'Badminton', date: '2024-06-22', startTime: '10:00', endTime: '11:00', baseFacilityPrice: 500, equipmentRentalCost: 100, totalPrice: 600, status: 'Confirmed', bookedAt: '2024-06-18T14:00:00Z', reviewed: false, rentedEquipment: [{ equipmentId: 'eq-1', name: 'Racket', quantity: 2, priceAtBooking: 50, priceTypeAtBooking: 'per_booking', totalCost: 100 }] },
        { id: 'booking-3', userId: 'user-4', facilityId: 'facility-3', facilityName: 'Swim Bliss', sportId: 'sport-6', sportName: 'Swimming', date: '2024-05-10', startTime: '08:00', endTime: '09:00', baseFacilityPrice: 300, equipmentRentalCost: 0, totalPrice: 300, status: 'Cancelled', bookedAt: '2024-05-01T12:00:00Z', reviewed: false },
    ];
    
    facilities[0].reviews = [
        { id: 'review-1', facilityId: 'facility-1', userId: 'user-3', userName: 'Charlie Davis', rating: 5, comment: 'Amazing ground, well maintained. Had a great time!', createdAt: '2024-06-20T21:00:00Z', isPublicProfile: true, bookingId: 'booking-1' },
    ];

    membershipPlans = [
        { id: 'plan-1', name: 'Basic', pricePerMonth: 0, benefits: ['Access to all facilities', 'Standard booking slots', 'Community access'] },
        { id: 'plan-2', name: 'Premium', pricePerMonth: 999, benefits: ['5% discount on all bookings', 'Priority booking slots', 'Access to exclusive events', 'No cancellation fees'] },
        { id: 'plan-3', name: 'Pro', pricePerMonth: 2499, benefits: ['15% discount on all bookings', 'Access to all premium features', 'Free equipment rental', 'Personalized coaching tips (AI)'] },
    ];
    
    events = [
        { id: 'event-1', name: 'Summer Football Frenzy', facilityId: 'facility-1', facilityName: 'Grand Arena', sport: sports[1], startDate: '2024-07-15T09:00:00Z', endDate: '2024-07-16T18:00:00Z', description: 'An exciting 5-a-side football tournament with cash prizes.', entryFee: 5000, maxParticipants: 32, registeredParticipants: 12, imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=2070&auto=format&fit=crop', imageDataAiHint: 'football on grass' },
        { id: 'event-2', name: 'Monsoon Badminton League', facilityId: 'facility-2', facilityName: 'Smash It Badminton', sport: sports[2], startDate: '2024-08-01T10:00:00Z', endDate: '2024-08-30T20:00:00Z', description: 'A month-long badminton league for all skill levels.', entryFee: 1000, maxParticipants: 64, registeredParticipants: 45, imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2070&auto=format&fit=crop', imageDataAiHint: 'badminton player action' },
    ];

    notifications = [
      { id: 'notif-1', userId: 'user-3', type: 'booking_confirmed', title: 'Booking Confirmed', message: 'Your booking for Grand Arena is confirmed.', createdAt: '2024-06-15T10:00:00Z', isRead: true, link: '/account/bookings' },
      { id: 'notif-2', userId: 'user-3', type: 'reminder', title: 'Upcoming Booking', message: 'You have a booking at Smash It Badminton tomorrow.', createdAt: '2024-06-21T10:00:00Z', isRead: false, link: '/account/bookings' },
    ];

    blogPosts = [
        { id: 'post-1', slug: 'top-5-cricket-grounds-in-pune', title: 'Top 5 Cricket Grounds in Pune You Must Play At', excerpt: 'Discover the best cricket grounds Pune has to offer, from lush green outfields to professional-grade pitches that will make you feel like a star.', content: '<p>Pune, a city with a rich cricketing culture, offers a plethora of options for enthusiasts. Whether you\'re a professional looking for a practice pitch or a group of friends wanting a weekend match, there\'s a ground for everyone. Here are our top 5 picks:</p><ul><li><strong>PYC Hindu Gymkhana:</strong> Known for its pristine pitch and historic pavilion.</li><li><strong>Nehru Stadium:</strong> A classic venue that has hosted international matches.</li><li><strong>Deccan Gymkhana:</strong> Offers excellent facilities and a vibrant atmosphere.</li><li><strong>Poona Club:</strong> A premium choice with beautifully manicured grounds.</li><li><strong>Grand Arena:</strong> Our very own state-of-the-art complex with floodlit grounds for night matches.</li></ul><p>Each of these venues provides a unique experience. We recommend trying them all to find your perfect cricketing home!</p>', authorName: 'Admin User', publishedAt: '2024-05-20T12:00:00Z', tags: ['Cricket', 'Pune', 'Sports'], isFeatured: true },
        { id: 'post-2', slug: 'how-to-improve-your-badminton-smash', title: 'How to Improve Your Badminton Smash in 5 Easy Steps', excerpt: 'Unleash your inner champion with our expert guide to perfecting your badminton smash. Follow these simple steps to add power and precision to your game.', content: '<p>The smash is the most powerful shot in badminton, but it requires technique and timing. Here\'s how to improve it:</p><ol><li><strong>Perfect Your Grip:</strong> Hold the racket like you\'re shaking hands with it, ensuring a firm but relaxed grip.</li><li><strong>Master Your Footwork:</strong> Position yourself behind the shuttlecock to generate maximum power.</li><li><strong>Focus on Rotation:</strong> Your body rotation, from your hips to your shoulders, is key to a powerful shot.</li><li><strong>Snap Your Wrist:</strong> The final flick of the wrist at the point of impact provides the explosive power.</li><li><strong>Follow Through:</strong> A smooth follow-through ensures accuracy and prevents injury.</li></ol><p>Practice these steps consistently, and you\'ll see a dramatic improvement in your game. Good luck!</p>', authorName: 'Bob Johnson (Owner)', publishedAt: '2024-06-02T15:00:00Z', tags: ['Badminton', 'Tips', 'Training'] },
    ];
    
    pricingRules = [
        { id: 'rule-1', name: 'Weekend Evening Surge', description: '15% price increase for all bookings on weekend evenings.', isActive: true, adjustmentType: 'percentage_increase', value: 15, daysOfWeek: ['Sat', 'Sun'], timeRange: { start: '17:00', end: '22:00' }, priority: 10, facilityIds: ['facility-1', 'facility-2'] },
        { id: 'rule-2', name: 'Weekday Morning Discount', description: '20% off for bookings on weekday mornings.', isActive: true, adjustmentType: 'percentage_decrease', value: 20, daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], timeRange: { start: '08:00', end: '11:00' }, priority: 10, facilityIds: ['facility-1', 'facility-2', 'facility-3'] },
    ];
    
    promotionRules = [
        { id: 'promo-1', name: 'New User Offer', description: '10% off first booking', code: 'NEWBIE10', discountType: 'percentage', discountValue: 10, usageLimitPerUser: 1, isActive: true },
        { id: 'promo-2', name: 'Summer Sale', description: 'Flat 200 off on bookings above 1000', code: 'SUMMER200', discountType: 'fixed_amount', discountValue: 200, startDate: '2024-06-01', endDate: '2024-08-31', isActive: true },
    ];

    teams = [
      { id: 'team-1', name: 'Pune Strikers', sport: sports[0], captainId: 'user-3', memberIds: ['user-3', 'user-4'] },
    ];
}

// --- Data Access Functions ---
// Ensure data is seeded before any access
seedData();

// GET all
export async function dbGetAllSports(): Promise<Sport[]> { return sports; }
export async function dbGetAllAmenities(): Promise<Amenity[]> { return amenities; }
export async function dbGetAllFacilities(): Promise<Facility[]> { return facilities; }
export async function dbGetAllUsers(): Promise<UserProfile[]> { return users; }
export async function dbGetAllBookings(): Promise<Booking[]> { return bookings; }
export async function getAllEvents(): Promise<SportEvent[]> { return events; }
export async function getAllMembershipPlans(): Promise<MembershipPlan[]> { return membershipPlans; }
export async function getAllPricingRules(): Promise<PricingRule[]> { return pricingRules; }
export async function getAllPromotionRules(): Promise<PromotionRule[]> { return promotionRules; }
export async function getAllBlogPosts(): Promise<BlogPost[]> { return blogPosts; }
export async function getSiteSettings(): Promise<SiteSettings> { return siteSettings; }
export async function dbGetTeamsByUserId(userId: string): Promise<Team[]> {
    return teams.filter(team => team.memberIds.includes(userId));
}

// GET by ID
export async function getSportById(id: string): Promise<Sport | undefined> { return sports.find(s => s.id === id); }
export async function getAmenityById(id: string): Promise<Amenity | undefined> { return amenities.find(a => a.id === id); }
export async function dbGetFacilityById(id: string): Promise<Facility | undefined> { return facilities.find(f => f.id === id); }
export async function dbGetUserById(id: string): Promise<UserProfile | undefined> { return users.find(u => u.id === id); }
export async function dbGetBookingById(id: string): Promise<Booking | undefined> { return bookings.find(b => b.id === id); }
export async function getEventById(id: string): Promise<SportEvent | undefined> { return events.find(e => e.id === id); }
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> { return blogPosts.find(p => p.slug === slug); }
export async function dbGetMembershipPlanById(id: string): Promise<MembershipPlan | undefined> { return membershipPlans.find(p => p.id === id); }
export async function dbGetTeamById(id: string): Promise<Team | undefined> { return teams.find(t => t.id === id); }
export async function getPricingRuleById(id: string): Promise<PricingRule | undefined> { return pricingRules.find(r => r.id === id); }
export async function getPromotionRuleByCode(code: string): Promise<PromotionRule | undefined> {
  return promotionRules.find(p => p.code?.toLowerCase() === code.toLowerCase() && p.isActive);
}
export async function dbGetSportById(id: string): Promise<Sport | undefined> { return sports.find(s => s.id === id); }


// GET by criteria
export async function dbGetFacilitiesByOwnerId(ownerId: string): Promise<Facility[]> {
  return facilities.filter(f => f.ownerId === ownerId);
}
export async function getPricingRulesByFacilityIds(facilityIds: string[]): Promise<PricingRule[]> {
    return pricingRules.filter(rule => 
        !rule.facilityIds || rule.facilityIds.length === 0 || rule.facilityIds.some(id => facilityIds.includes(id))
    );
}

export async function dbGetEventsByFacilityIds(facilityIds: string[]): Promise<SportEvent[]> {
    return events.filter(event => facilityIds.includes(event.facilityId));
}

export async function getLfgRequestsByFacilityIds(facilityIds: string[]): Promise<LfgRequest[]> {
    return lfgRequests.filter(req => facilityIds.includes(req.facilityId));
}

export async function getChallengesByFacilityIds(facilityIds: string[]): Promise<Challenge[]> {
    return challenges.filter(c => facilityIds.includes(c.facilityId));
}

export async function dbGetFacilitiesByIds(ids: string[]): Promise<Facility[]> {
  return facilities.filter(f => ids.includes(f.id));
}
export async function dbGetBookingsByUserId(userId: string): Promise<Booking[]> {
  return bookings.filter(b => b.userId === userId);
}
export async function dbGetBookingsForFacilityOnDate(facilityId: string, date: string): Promise<Booking[]> {
  return bookings.filter(b => b.facilityId === facilityId && b.date === date && b.status === 'Confirmed');
}

// Notifications
export async function dbGetNotificationsForUser(userId: string): Promise<AppNotification[]> {
  return notifications
    .filter(n => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// ADD
export async function dbAddFacility(facilityData: any): Promise<Facility> {
    const newFacility: Facility = { ...facilityData, id: `facility-${uuidv4()}` };
    facilities.push(newFacility);
    return newFacility;
}

export async function dbAddUser(userData: { name: string; email: string; password?: string }): Promise<UserProfile> {
    if (users.find(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
        throw new Error('A user with this email already exists.');
    }
    const newUser: UserProfile = {
        ...userData,
        id: `user-${uuidv4()}`,
        role: 'User',
        status: 'Active',
        joinedAt: new Date().toISOString(),
        isProfilePublic: true,
        favoriteFacilities: [],
        loyaltyPoints: 0,
        achievements: [],
        membershipLevel: 'Basic',
    };
    users.push(newUser);
    return newUser;
}

export async function dbAddBooking(bookingData: Booking): Promise<Booking> {
    bookings.push(bookingData);
    return bookingData;
}

export async function dbAddNotification(userId: string, data: Omit<AppNotification, 'id' | 'userId' | 'createdAt' | 'isRead'>): Promise<AppNotification> {
    const newNotification: AppNotification = {
      ...data,
      id: `notif-${uuidv4()}`,
      userId,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    notifications.unshift(newNotification); // Add to the beginning of the list
    return newNotification;
}

export async function dbAddReview(data: Omit<Review, 'id' | 'createdAt' | 'userName' | 'userAvatar' | 'isPublicProfile'>): Promise<Review> {
    const user = await dbGetUserById(data.userId);
    if (!user) throw new Error("User not found for review");
    
    const newReview: Review = {
        ...data,
        id: `review-${uuidv4()}`,
        createdAt: new Date().toISOString(),
        userName: user.name,
        userAvatar: user.profilePictureUrl,
        isPublicProfile: user.isProfilePublic
    };

    const facility = facilities.find(f => f.id === data.facilityId);
    if (facility) {
        if (!facility.reviews) facility.reviews = [];
        facility.reviews.push(newReview);
        // Recalculate average rating
        const totalRating = facility.reviews.reduce((sum, r) => sum + r.rating, 0);
        facility.rating = totalRating / facility.reviews.length;
    }
    
    const booking = bookings.find(b => b.id === data.bookingId);
    if (booking) {
        booking.reviewed = true;
    }

    return newReview;
}

export async function dbAddSport(sportData: Omit<Sport, 'id'>): Promise<Sport> {
    const newSport: Sport = { ...sportData, id: `sport-${uuidv4()}` };
    sports.push(newSport);
    return newSport;
}
export async function dbAddMembershipPlan(data: Omit<MembershipPlan, 'id'>): Promise<MembershipPlan> {
    const newPlan: MembershipPlan = { ...data, id: `plan-${uuidv4()}` };
    membershipPlans.push(newPlan);
    return newPlan;
}
export async function addPricingRule(data: Omit<PricingRule, 'id'>): Promise<PricingRule> {
    const newRule: PricingRule = { ...data, id: `pr-${uuidv4()}` };
    pricingRules.push(newRule);
    return newRule;
}
export async function addPromotionRule(data: Omit<PromotionRule, 'id'>): Promise<PromotionRule> {
    const newRule: PromotionRule = { ...data, id: `promo-${uuidv4()}` };
    promotionRules.push(newRule);
    return newRule;
}
export async function addEventAction(eventData: any): Promise<SportEvent> {
    const sport = await getSportById(eventData.sportId);
    const facility = await dbGetFacilityById(eventData.facilityId);
    if (!sport || !facility) throw new Error("Invalid sport or facility for event.");

    const newEvent: SportEvent = {
        ...eventData,
        id: `event-${uuidv4()}`,
        sport,
        facilityName: facility.name,
        registeredParticipants: 0,
    };
    events.push(newEvent);
    return newEvent;
}
export async function dbCreateTeam(data: { name: string; sportId: string; captainId: string }): Promise<Team> {
  const sport = await getSportById(data.sportId);
  if (!sport) throw new Error("Invalid sport selected for team.");

  const newTeam: Team = {
    id: `team-${uuidv4()}`,
    name: data.name,
    sport,
    captainId: data.captainId,
    memberIds: [data.captainId],
  };
  teams.push(newTeam);
  return newTeam;
}

// UPDATE
export async function dbUpdateFacility(facilityData: any): Promise<Facility> {
    const index = facilities.findIndex(f => f.id === facilityData.id);
    if (index === -1) throw new Error("Facility not found");
    facilities[index] = { ...facilities[index], ...facilityData };
    return facilities[index];
}

export async function dbUpdateUser(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | undefined> {
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...updates };
    return users[userIndex];
  }
  return undefined;
}

export async function dbUpdateBooking(bookingId: string, updates: Partial<Booking>): Promise<Booking | undefined> {
  const bookingIndex = bookings.findIndex(b => b.id === bookingId);
  if (bookingIndex !== -1) {
    bookings[bookingIndex] = { ...bookings[bookingIndex], ...updates };
    return bookings[bookingIndex];
  }
  return undefined;
}
export async function dbMarkNotificationAsRead(userId: string, notificationId: string): Promise<void> {
    const notification = notifications.find(n => n.id === notificationId && n.userId === userId);
    if (notification) {
        notification.isRead = true;
    }
}
export async function dbMarkAllNotificationsAsRead(userId: string): Promise<void> {
    notifications.forEach(n => {
        if (n.userId === userId) {
            n.isRead = true;
        }
    });
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
export async function dbUpdateSport(id: string, updates: Partial<Sport>): Promise<Sport> {
    const index = sports.findIndex(s => s.id === id);
    if (index === -1) throw new Error("Sport not found");
    sports[index] = { ...sports[index], ...updates };
    return sports[index];
}
export async function dbUpdateMembershipPlan(data: MembershipPlan): Promise<MembershipPlan> {
    const index = membershipPlans.findIndex(p => p.id === data.id);
    if (index === -1) throw new Error("Membership plan not found");
    membershipPlans[index] = { ...membershipPlans[index], ...data };
    return membershipPlans[index];
}
export async function updatePricingRule(data: PricingRule): Promise<PricingRule> {
    const index = pricingRules.findIndex(r => r.id === data.id);
    if (index === -1) throw new Error("Pricing rule not found");
    pricingRules[index] = { ...pricingRules[index], ...data };
    return pricingRules[index];
}
export async function updatePromotionRule(data: PromotionRule): Promise<PromotionRule> {
    const index = promotionRules.findIndex(r => r.id === data.id);
    if (index === -1) throw new Error("Promotion rule not found");
    promotionRules[index] = { ...promotionRules[index], ...data };
    return promotionRules[index];
}
export async function updateEventAction(eventData: SportEvent): Promise<SportEvent> {
    const index = events.findIndex(e => e.id === eventData.id);
    if (index === -1) throw new Error("Event not found");
    events[index] = { ...events[index], ...eventData };
    return events[index];
}


// DELETE
export async function dbDeleteFacility(facilityId: string): Promise<void> {
  facilities = facilities.filter(f => f.id !== facilityId);
  // Also remove related bookings, reviews, etc.
  bookings = bookings.filter(b => b.facilityId !== facilityId);
}
export async function dbDeleteSport(id: string): Promise<void> {
    sports = sports.filter(s => s.id !== id);
}
export async function deleteMembershipPlan(id: string): Promise<void> {
    membershipPlans = membershipPlans.filter(p => p.id !== id);
}
export async function deletePricingRule(id: string): Promise<void> {
    pricingRules = pricingRules.filter(r => r.id !== id);
}
export async function deletePromotionRule(id: string): Promise<void> {
    promotionRules = promotionRules.filter(p => p.id !== id);
}
export async function deleteEvent(id: string): Promise<void> {
    events = events.filter(e => e.id !== id);
}


// Availability
export async function dbBlockTimeSlot(facilityId: string, ownerId: string, newBlock: BlockedSlot): Promise<boolean> {
    const facility = await dbGetFacilityById(facilityId);
    if (!facility || facility.ownerId !== ownerId) return false;

    if (!facility.blockedSlots) {
        facility.blockedSlots = [];
    }

    // Check for overlapping blocks
    const isOverlapping = facility.blockedSlots.some(slot =>
        slot.date === newBlock.date &&
        Math.max(parseInt(slot.startTime), parseInt(newBlock.startTime)) < Math.min(parseInt(slot.endTime), parseInt(newBlock.endTime))
    );

    if (isOverlapping) return false;

    facility.blockedSlots.push(newBlock);
    await dbUpdateFacility(facility);
    return true;
}

export async function dbUnblockTimeSlot(facilityId: string, ownerId: string, date: string, startTime: string): Promise<boolean> {
    const facility = await dbGetFacilityById(facilityId);
    if (!facility || facility.ownerId !== ownerId || !facility.blockedSlots) return false;

    const initialLength = facility.blockedSlots.length;
    facility.blockedSlots = facility.blockedSlots.filter(slot =>
        !(slot.date === date && slot.startTime === startTime)
    );

    if (facility.blockedSlots.length < initialLength) {
        await dbUpdateFacility(facility);
        return true;
    }
    return false;
}

// Site Settings
export async function updateSiteSettings(newSettings: SiteSettings): Promise<SiteSettings> {
    siteSettings = { ...siteSettings, ...newSettings };
    return siteSettings;
}

// Event Registration
export async function registerForEvent(eventId: string): Promise<boolean> {
  const event = events.find(e => e.id === eventId);
  if (event && (!event.maxParticipants || event.registeredParticipants < event.maxParticipants)) {
    event.registeredParticipants++;
    return true;
  }
  return false;
}

// TEAM LOGIC
export async function dbLeaveTeam(teamId: string, userId: string): Promise<boolean> {
  const team = await dbGetTeamById(teamId);
  if (!team) throw new Error("Team not found.");
  if (team.captainId === userId && team.memberIds.length > 1) {
    throw new Error("Captain cannot leave a team with other members. Please transfer captaincy first.");
  }
  if (team.memberIds.length === 1 && team.captainId === userId) {
    // If last member is captain, disband team
    teams = teams.filter(t => t.id !== teamId);
    return true;
  }
  
  team.memberIds = team.memberIds.filter(id => id !== userId);
  return true;
}

export async function dbRemoveUserFromTeam(teamId: string, memberIdToRemove: string, currentUserId: string): Promise<void> {
  const team = await dbGetTeamById(teamId);
  if (!team) throw new Error("Team not found.");
  if (team.captainId !== currentUserId) throw new Error("Only the team captain can remove members.");
  if (memberIdToRemove === currentUserId) throw new Error("Captain cannot remove themselves.");

  team.memberIds = team.memberIds.filter(id => id !== memberIdToRemove);
}

export async function dbTransferCaptaincy(teamId: string, newCaptainId: string, currentUserId: string): Promise<void> {
    const team = await dbGetTeamById(teamId);
    if (!team) throw new Error("Team not found.");
    if (team.captainId !== currentUserId) throw new Error("Only the team captain can transfer captaincy.");
    if (!team.memberIds.includes(newCaptainId)) throw new Error("New captain must be a member of the team.");

    team.captainId = newCaptainId;
}

export async function dbDeleteTeam(teamId: string, currentUserId: string): Promise<void> {
    const team = await dbGetTeamById(teamId);
    if (!team) throw new Error("Team not found.");
    if (team.captainId !== currentUserId) throw new Error("Only the team captain can delete the team.");

    teams = teams.filter(t => t.id !== teamId);
}

// LFG & Challenges
export async function dbGetOpenLfgRequests(): Promise<LfgRequest[]> {
    return lfgRequests.filter(r => r.status === 'open');
}

export async function dbCreateLfgRequest(data: Omit<LfgRequest, 'id'|'createdAt'|'status'|'interestedUserIds'>): Promise<LfgRequest> {
    const newRequest: LfgRequest = {
        ...data,
        id: `lfg-${uuidv4()}`,
        createdAt: new Date().toISOString(),
        status: 'open',
        interestedUserIds: [],
    };
    lfgRequests.push(newRequest);
    return newRequest;
}

export async function dbExpressInterestInLfg(lfgId: string, userId: string): Promise<LfgRequest | undefined> {
    const request = lfgRequests.find(r => r.id === lfgId);
    if (request && request.userId !== userId && !request.interestedUserIds.includes(userId)) {
        request.interestedUserIds.push(userId);
        return request;
    }
    return undefined;
}

export async function dbGetOpenChallenges(): Promise<Challenge[]> {
    const openChallenges = challenges.filter(c => c.status === 'open');
    // Populate challenger details
    return Promise.all(openChallenges.map(async c => {
        const challenger = await dbGetUserById(c.challengerId);
        return { ...c, challenger: challenger! };
    }));
}

export async function dbCreateChallenge(data: Omit<Challenge, 'id'|'challenger'|'sport'|'createdAt'|'status'>): Promise<Challenge> {
    const challenger = await dbGetUserById(data.challengerId);
    const sport = await dbGetSportById(data.sportId);
    const facility = await dbGetFacilityById(data.facilityId);

    if (!challenger || !sport || !facility) throw new Error("Invalid details for creating challenge.");
    
    const newChallenge: Challenge = {
        ...data,
        id: `chal-${uuidv4()}`,
        createdAt: new Date().toISOString(),
        status: 'open',
        challenger: challenger,
        sport: sport,
        facilityName: facility.name,
    };
    challenges.push(newChallenge);
    return newChallenge;
}

export async function dbAcceptChallenge(challengeId: string, opponentId: string): Promise<Challenge | undefined> {
    const challenge = challenges.find(c => c.id === challengeId);
    if (challenge && challenge.status === 'open' && challenge.challengerId !== opponentId) {
        challenge.status = 'accepted';
        challenge.opponentId = opponentId;
        challenge.opponent = await dbGetUserById(opponentId);
        return challenge;
    }
    return undefined;
}

export async function calculateDynamicPrice(
  basePricePerHour: number,
  selectedDate: Date,
  selectedSlot: TimeSlot,
  durationHours: number
): Promise<{ finalPrice: number; appliedRuleName?: string; appliedRuleDetails?: PricingRule }> {
  const applicableRules = pricingRules.filter(rule => {
    if (!rule.isActive) return false;

    // Day of week check
    const dayOfWeek = format(selectedDate, 'E').slice(0, 3);
    if (rule.daysOfWeek && rule.daysOfWeek.length > 0 && !rule.daysOfWeek.includes(dayOfWeek as any)) {
      return false;
    }

    // Time range check
    if (rule.timeRange && rule.timeRange.start && rule.timeRange.end) {
      const slotStart = parseISO(`1970-01-01T${selectedSlot.startTime}:00`);
      const ruleStart = parseISO(`1970-01-01T${rule.timeRange.start}:00`);
      const ruleEnd = parseISO(`1970-01-01T${rule.timeRange.end}:00`);
      if (slotStart < ruleStart || slotStart >= ruleEnd) {
        return false;
      }
    }

    // Date range check
    if (rule.dateRange && rule.dateRange.start && rule.dateRange.end) {
        const interval = { start: parseISO(rule.dateRange.start), end: parseISO(rule.dateRange.end) };
        if (!isWithinIntervals(selectedDate, [interval])) {
            return false;
        }
    }
    
    return true;
  });

  if (applicableRules.length === 0) {
    return { finalPrice: basePricePerHour * durationHours };
  }

  // Sort by priority (lower number = higher priority)
  applicableRules.sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99));

  const bestRule = applicableRules[0];
  let finalPrice = basePricePerHour;

  switch (bestRule.adjustmentType) {
    case 'percentage_increase':
      finalPrice *= (1 + bestRule.value / 100);
      break;
    case 'percentage_decrease':
      finalPrice *= (1 - bestRule.value / 100);
      break;
    case 'fixed_increase':
      finalPrice += bestRule.value;
      break;
    case 'fixed_decrease':
      finalPrice -= bestRule.value;
      break;
    case 'fixed_price':
      finalPrice = bestRule.value;
      break;
  }

  return {
    finalPrice: Math.max(0, finalPrice) * durationHours,
    appliedRuleName: bestRule.name,
    appliedRuleDetails: bestRule,
  };
};

// Initial data seeding call
seedData();

export { dbGetAllUsers as _dbGetAllUsers };
