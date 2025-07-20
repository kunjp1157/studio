
import type { Facility, Sport, Amenity, UserProfile, UserRole, UserStatus, Booking, ReportData, MembershipPlan, SportEvent, Review, AppNotification, NotificationType, BlogPost, PricingRule, PromotionRule, RentalEquipment, RentedItemInfo, AppliedPromotionInfo, TimeSlot, UserSkill, SkillLevel, BlockedSlot, SiteSettings, Team, WaitlistEntry, LfgRequest, SportPrice, NotificationTemplate, Challenge } from './types';
import { ParkingCircle, Wifi, ShowerHead, Lock, Dumbbell, Zap, Users, Trophy, Award, CalendarDays as LucideCalendarDays, Utensils, Star, LocateFixed, Clock, DollarSign, Goal, Bike, Dices, Swords, Music, Tent, Drama, MapPin, Heart, Dribbble, Activity, Feather, CheckCircle, XCircle, MessageSquareText, Info, Gift, Edit3, PackageSearch, Shirt, Disc, Medal, Gem, Rocket, Gamepad2, MonitorPlay, Target, Drum, Guitar, Brain, Camera, PersonStanding, Building, HandCoins, Palette, Group, BikeIcon, DramaIcon, Film, Gamepad, GuitarIcon, Landmark, Lightbulb, MountainSnow, Pizza, ShoppingBag, VenetianMask, Warehouse, Weight, Wind, WrapText, Speech, HistoryIcon, BarChartIcon, UserCheck, UserX, Building2, BellRing } from 'lucide-react';
import { parseISO, isWithinInterval, isAfter, isBefore, startOfDay, endOfDay, getDay, subDays, getMonth, getYear, format as formatDateFns } from 'date-fns';
import { db } from './firebase';
import { collection, getDocs, doc, getDoc, addDoc, setDoc, deleteDoc, query, where, onSnapshot, arrayUnion, arrayRemove, updateDoc } from 'firebase/firestore';


// --- MOCK DATA (for non-facility types, to be migrated later) ---
export const mockSports: Sport[] = [
  { id: 'sport-1', name: 'Soccer', iconName: 'Goal', imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55', imageDataAiHint: 'soccer stadium' },
  { id: 'sport-2', name: 'Basketball', iconName: 'Dribbble', imageUrl: 'https://images.unsplash.com/photo-1519861531473-9200262188bf', imageDataAiHint: 'basketball court' },
  { id: 'sport-3', name: 'Tennis', iconName: 'Activity', imageUrl: 'https://images.unsplash.com/photo-1554062614-6da4fa674b73', imageDataAiHint: 'tennis court' },
  { id: 'sport-4', name: 'Badminton', iconName: 'Feather', imageUrl: 'https://images.unsplash.com/photo-1521587514789-53b8a3b09228', imageDataAiHint: 'badminton shuttlecock' },
  { id: 'sport-5', name: 'Swimming', iconName: 'PersonStanding', imageUrl: 'https://images.unsplash.com/photo-1551604313-26835b334a81', imageDataAiHint: 'swimming pool' },
  { id: 'sport-6', name: 'Yoga', iconName: 'Brain', imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b', imageDataAiHint: 'yoga class' },
  { id: 'sport-7', name: 'Cycling', iconName: 'Bike', imageUrl: 'https://images.unsplash.com/photo-1471506480216-e5719f9794d0', imageDataAiHint: 'cycling velodrome' },
  { id: 'sport-8', name: 'Dance', iconName: 'Music', imageUrl: 'https://images.unsplash.com/photo-1511719111394-550342a5b23d', imageDataAiHint: 'dance studio' },
  { id: 'sport-9', name: 'Camping', iconName: 'Tent', imageUrl: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d', imageDataAiHint: 'camping tent' },
  { id: 'sport-10', name: 'Theatre', iconName: 'Drama', imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91e38a493', imageDataAiHint: 'theatre stage' },
  { id: 'sport-13', name: 'Cricket', iconName: 'Dices', imageUrl: 'https://images.unsplash.com/photo-1593341646782-e0b495cffc25', imageDataAiHint: 'cricket stadium' },
  { id: 'sport-14', name: 'Pool', iconName: 'Target', imageUrl: 'https://images.unsplash.com/photo-1601758124235-7c98c199e4df', imageDataAiHint: 'billiards table' },
  { id: 'sport-15', name: 'PC Game/PS5', iconName: 'Gamepad2', imageUrl: 'https://images.unsplash.com/photo-1580327344181-c1163234e5a0', imageDataAiHint: 'gaming setup' },
  { id: 'sport-16', name: 'Gym', iconName: 'Dumbbell', imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48', imageDataAiHint: 'modern gym' },
];

export const mockAmenities: Amenity[] = [
  { id: 'amenity-1', name: 'Parking', iconName: 'ParkingCircle' },
  { id: 'amenity-2', name: 'WiFi', iconName: 'Wifi' },
  { id: 'amenity-3', name: 'Showers', iconName: 'ShowerHead' },
  { id: 'amenity-4', name: 'Lockers', iconName: 'Lock' },
  { id: 'amenity-5', name: 'Equipment Rental Signage', iconName: 'PackageSearch' },
  { id: 'amenity-6', name: 'Cafe', iconName: 'Utensils' },
  { id: 'amenity-7', name: 'Accessible', iconName: 'Users' },
];

// This is the static default user. It's guaranteed to be available on app load.
export let mockUser: UserProfile = { 
    id: 'user-admin-kirtan', 
    name: 'Kirtan Shah', 
    email: 'shahkirtan007@gmail.com', 
    role: 'Admin', 
    status: 'Active', 
    joinedAt: new Date().toISOString(), 
    loyaltyPoints: 1250, 
    profilePictureUrl: 'https://placehold.co/100x100.png', 
    dataAiHint: 'man smiling' 
};

// These arrays are for non-Firestore managed data or for temporary client-side operations.
// They no longer hold primary data for users, bookings, etc.
export let mockReviews: Review[] = [];
export const mockAchievements: Achievement[] = [];
export let mockTeams: Team[] = [];
let mockAppNotifications: AppNotification[] = [];
export const mockBlogPosts: BlogPost[] = [];
export let mockMembershipPlans: MembershipPlan[] = [];
export let mockEvents: SportEvent[] = [];
export let mockPricingRules: PricingRule[] = [];
export let mockPromotionRules: PromotionRule[] = [];
let defaultNotificationTemplates: NotificationTemplate[] = [
    { type: 'booking_confirmed', label: 'Booking Confirmed', description: 'Sent to user on successful booking.', emailEnabled: true, smsEnabled: false, emailSubject: 'Booking Confirmed: {{facilityName}}', emailBody: 'Hi {{userName}},\n\nYour booking for {{facilityName}} on {{date}} at {{time}} is confirmed.\n\nThank you!', smsBody: 'Booking confirmed for {{facilityName}} on {{date}}. Ref: {{bookingId}}' },
    { type: 'booking_cancelled', label: 'Booking Cancelled', description: 'Sent when a user or admin cancels a booking.', emailEnabled: true, smsEnabled: false, emailSubject: 'Booking Cancelled: {{facilityName}}', emailBody: 'Hi {{userName}},\n\nYour booking for {{facilityName}} on {{date}} at {{time}} has been cancelled.\n\nThank you!', smsBody: 'Booking for {{facilityName}} on {{date}} was cancelled.' },
    { type: 'reminder', label: 'Booking Reminder', description: 'Sent to user 24 hours before a booking.', emailEnabled: true, smsEnabled: true, emailSubject: 'Reminder: Your booking at {{facilityName}} is tomorrow', emailBody: 'Hi {{userName}},\n\nThis is a reminder for your booking at {{facilityName}} tomorrow, {{date}} at {{time}}.', smsBody: 'Reminder: Booking at {{facilityName}} tomorrow, {{date}} at {{time}}.' },
    { type: 'waitlist_opening', label: 'Waitlist Opening', description: 'Sent to waitlisted users when a slot opens up.', emailEnabled: true, smsEnabled: true, emailSubject: 'A slot has opened up at {{facilityName}}!', emailBody: 'Good news, {{userName}}! The slot you wanted at {{facilityName}} for {{date}} at {{time}} is now available. Book now before it\'s gone!', smsBody: 'Slot open at {{facilityName}} for {{date}} at {{time}}. Book now!' },
    { type: 'matchmaking_interest', label: 'Matchmaking Interest', description: 'Sent to a post creator when someone is interested.', emailEnabled: true, smsEnabled: false, emailSubject: 'Someone is interested in your game!', emailBody: 'Hi {{userName}},\n\nSomeone has expressed interest in your post about finding a game. Log in to connect with them!', smsBody: 'Someone is interested in your game post on Sports Arena!' },
    { type: 'user_status_changed', label: 'User Status Changed', description: 'Sent to a user when an admin changes their account status.', emailEnabled: true, smsEnabled: false, emailSubject: 'Your account status has been updated', emailBody: 'Hi {{userName}},\n\nAn administrator has updated your account status. Please log in to see the details.', smsBody: 'Your Sports Arena account status has been updated by an admin.' },
];
let mockSiteSettings: SiteSettings = { siteName: 'Sports Arena', defaultCurrency: 'INR', timezone: 'Asia/Kolkata', maintenanceMode: false, notificationTemplates: defaultNotificationTemplates };
let mockWaitlist: WaitlistEntry[] = [];
let mockLfgRequests: LfgRequest[] = [];
let mockRentalEquipment: RentalEquipment[] = [];
export let mockChallenges: Challenge[] = [];
export let mockBookings: Booking[] = []; // This will be populated by Firestore listeners

// --- REAL-TIME LISTENERS (Primary way to get data) ---

export function listenToCollection<T>(
  collectionName: string,
  callback: (data: T[]) => void,
  onError: (error: Error) => void
) {
  const q = query(collection(db, collectionName));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const data: T[] = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() } as T);
    });
    callback(data);
  }, (error) => {
    console.error(`Firestore listener error for ${collectionName}:`, error);
    onError(error);
  });
  return unsubscribe;
}

export function listenToFacilities(callback: (facilities: Facility[]) => void, onError: (error: Error) => void) {
  return listenToCollection<Facility>('facilities', callback, onError);
}

export function listenToUserBookings(userId: string, callback: (bookings: Booking[]) => void, onError: (error: Error) => void) {
  const q = query(collection(db, "bookings"), where("userId", "==", userId));
  return onSnapshot(q, (querySnapshot) => {
    const bookingsData: Booking[] = [];
    querySnapshot.forEach((doc) => {
      bookingsData.push({ id: doc.id, ...doc.data() } as Booking);
    });
    callback(bookingsData);
  }, onError);
}

export function listenToAllBookings(callback: (bookings: Booking[]) => void, onError: (error: Error) => void) {
  return listenToCollection<Booking>('bookings', callback, onError);
}

export function listenToAllUsers(callback: (users: UserProfile[]) => void, onError: (error: Error) => void) {
  return listenToCollection<UserProfile>('users', callback, onError);
}

// --- Direct Fetch Functions (for specific, non-listening needs) ---
export const getAllFacilities = async (): Promise<Facility[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, 'facilities'));
        const facilities: Facility[] = [];
        querySnapshot.forEach((doc) => {
            facilities.push({ id: doc.id, ...doc.data() } as Facility);
        });
        return facilities;
    } catch (error) {
        console.error("Error fetching facilities: ", error);
        return [];
    }
};

export const getAllUsers = async (): Promise<UserProfile[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const users: UserProfile[] = [];
        querySnapshot.forEach((doc) => {
            users.push({ id: doc.id, ...doc.data() } as UserProfile);
        });
        return users;
    } catch (error) {
        console.error("Error fetching users: ", error);
        return [];
    }
};

export const getUserById = async (userId: string): Promise<UserProfile | undefined> => {
    if (!userId) return undefined;
    try {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as UserProfile : undefined;
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        return undefined;
    }
};

export const getFacilityById = async (id: string): Promise<Facility | undefined> => {
    try {
        const docRef = doc(db, 'facilities', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Facility;
        } else {
            console.log("No such facility document!");
            return undefined;
        }
    } catch (error) {
        console.error("Error fetching facility by ID: ", error);
        return undefined;
    }
};

export const getFacilitiesByIds = async (ids: string[]): Promise<Facility[]> => {
    if (!ids || ids.length === 0) return [];
    try {
        const q = query(collection(db, 'facilities'), where('__name__', 'in', ids));
        const querySnapshot = await getDocs(q);
        const facilities: Facility[] = [];
        querySnapshot.forEach((doc) => {
            facilities.push({ id: doc.id, ...doc.data() } as Facility);
        });
        return facilities;
    } catch (error) {
        console.error("Error fetching facilities by IDs: ", error);
        return [];
    }
};

// ... (keep addFacility, updateFacility, deleteFacility, etc.)
export const addFacility = async (facilityData: Omit<Facility, 'id'>): Promise<Facility> => {
  try {
    const docRef = await addDoc(collection(db, 'facilities'), facilityData);
    return { id: docRef.id, ...facilityData };
  } catch (error) {
    console.error("Error adding facility: ", error);
    throw new Error("Could not add facility to the database.");
  }
};

export const updateFacility = async (updatedFacilityData: Facility): Promise<Facility> => {
  try {
    const facilityRef = doc(db, 'facilities', updatedFacilityData.id);
    await setDoc(facilityRef, updatedFacilityData, { merge: true });
    return updatedFacilityData;
  } catch (error) {
    console.error("Error updating facility: ", error);
    throw new Error("Could not update facility in the database.");
  }
};
export const deleteFacility = async (facilityId: string): Promise<void> => {
    try {
        await deleteDoc(doc(db, 'facilities', facilityId));
    } catch (error) {
        console.error("Error deleting facility: ", error);
        throw new Error("Could not delete facility from the database.");
    }
};

export const getBookingById = async (id: string): Promise<Booking | undefined> => {
    try {
        const docRef = doc(db, 'bookings', id);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Booking : undefined;
    } catch (error) {
        console.error("Error fetching booking by ID:", error);
        return undefined;
    }
};

export const addBooking = async (bookingData: Omit<Booking, 'id' | 'bookedAt'>): Promise<Booking> => {
  const newBookingData = {
    ...bookingData,
    bookedAt: new Date().toISOString(),
  };
  try {
    const docRef = await addDoc(collection(db, 'bookings'), newBookingData);
    return { id: docRef.id, ...newBookingData } as Booking;
  } catch (error) {
    console.error("Error adding booking:", error);
    throw new Error("Could not add booking to the database.");
  }
};

export const updateBooking = async (bookingId: string, updates: Partial<Booking>): Promise<Booking | undefined> => {
    try {
        const bookingRef = doc(db, 'bookings', bookingId);
        await setDoc(bookingRef, updates, { merge: true });
        const updatedDoc = await getDoc(bookingRef);
        return updatedDoc.exists() ? { id: updatedDoc.id, ...updatedDoc.data() } as Booking : undefined;
    } catch (error) {
        console.error("Error updating booking:", error);
        return undefined;
    }
};
export const updateUser = async (userId: string, updates: Partial<UserProfile>): Promise<UserProfile | undefined> => {
    try {
        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, updates, { merge: true });
        const updatedDoc = await getDoc(userRef);
        const updatedUser = updatedDoc.exists() ? { id: updatedDoc.id, ...updatedDoc.data() } as UserProfile : undefined;
        // If the updated user is the currently logged-in user, update that too
        if (updatedUser && mockUser && mockUser.id === userId) {
            mockUser = { ...mockUser, ...updates };
        }
        return updatedUser;
    } catch (error) {
        console.error("Error updating user:", error);
        return undefined;
    }
};

export const getBookingsForFacilityOnDate = async (facilityId: string, date: string): Promise<Booking[]> => {
    const bookings: Booking[] = [];
    try {
        const q = query(
            collection(db, "bookings"),
            where("facilityId", "==", facilityId),
            where("date", "==", date),
            where("status", "in", ["Confirmed", "Pending"])
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            bookings.push({ id: doc.id, ...doc.data() } as Booking);
        });
    } catch (error) {
        console.error("Error fetching bookings for facility on date:", error);
    }
    return bookings;
};

// ... other functions ...

// --- STATIC/MOCK GETTERS (for data not in Firestore) ---
export const getSportById = (id: string): Sport | undefined => mockSports.find(s => s.id === id);
export const getAmenityById = (id: string): Amenity | undefined => mockAmenities.find(a => a.id === id);
export const getAllSports = (): Sport[] => mockSports;
export const getSiteSettings = (): SiteSettings => mockSiteSettings;
// ... all other mock-based functions

// --- DATA SEEDING ---
async function seedData() {
    // Seed users
    const usersCollection = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollection);
    if (usersSnapshot.empty) {
        console.log("No users found, seeding users...");
        const usersToSeed: (Omit<UserProfile, 'id'> & {id: string})[] = [
             { id: 'user-admin-kirtan', name: 'Kirtan Shah', email: 'shahkirtan007@gmail.com', role: 'Admin', status: 'Active', joinedAt: new Date().toISOString(), loyaltyPoints: 1250, profilePictureUrl: 'https://placehold.co/100x100.png', dataAiHint: 'man smiling' },
             { id: 'user-regular', name: 'Charlie Davis', email: 'user@example.com', role: 'User', status: 'Active', joinedAt: new Date().toISOString(), loyaltyPoints: 800, profilePictureUrl: 'https://placehold.co/100x100.png', dataAiHint: 'woman portrait' },
             { id: 'user-owner', name: 'Dana White', email: 'owner@example.com', role: 'FacilityOwner', status: 'Active', joinedAt: new Date().toISOString(), loyaltyPoints: 450, profilePictureUrl: 'https://placehold.co/100x100.png', dataAiHint: 'man glasses' },
        ];
        for (const user of usersToSeed) {
            const userRef = doc(db, 'users', user.id);
            await setDoc(userRef, user);
        }
    }

    // Seed facilities
    const facilitiesCollection = collection(db, 'facilities');
    const facilitiesSnapshot = await getDocs(facilitiesCollection);
    if (facilitiesSnapshot.empty) {
        console.log("No facilities found, seeding facilities...");
        const facilitiesToSeed: Omit<Facility, 'id'>[] = [
          {
            name: 'Grand City Arena',
            type: 'Complex',
            address: '100 Central Plaza, Metropolis',
            city: 'Metropolis',
            location: 'Downtown',
            description: 'A state-of-the-art sports complex in the heart of the city, offering a wide range of facilities for all sports enthusiasts.',
            images: ['https://images.unsplash.com/photo-1599386399993-430c6a995392', 'https://images.unsplash.com/photo-1574629810360-14b9d3c98485', 'https://images.unsplash.com/photo-1560089023-a2d9526ed0d5'],
            sports: [getSportById('sport-1')!, getSportById('sport-2')!],
            sportPrices: [
              { sportId: 'sport-1', pricePerHour: 1200 },
              { sportId: 'sport-2', pricePerHour: 1000 },
            ],
            amenities: [getAmenityById('amenity-1')!, getAmenityById('amenity-2')!, getAmenityById('amenity-3')!, getAmenityById('amenity-4')!],
            operatingHours: [ { day: 'Mon', open: '06:00', close: '23:00' }, { day: 'Tue', open: '06:00', close: '23:00' }, { day: 'Wed', open: '06:00', close: '23:00' }, { day: 'Thu', open: '06:00', close: '23:00' }, { day: 'Fri', open: '06:00', close: '23:00' }, { day: 'Sat', open: '07:00', close: '22:00' }, { day: 'Sun', open: '07:00', close: '21:00' } ],
            rating: 4.8,
            capacity: 200,
            isPopular: true,
            isIndoor: true,
            dataAiHint: 'modern sports complex',
            ownerId: 'user-owner'
          },
          {
            name: 'Riverside Tennis Club',
            type: 'Court',
            address: '25 River Road, Metropolis',
            city: 'Metropolis',
            location: 'Riverside',
            description: 'Picturesque tennis courts with a serene view of the river. Perfect for a friendly match or competitive play.',
            images: ['https://images.unsplash.com/photo-1594470117722-de4b9a02ebed', 'https://images.unsplash.com/photo-1563532292339-bdf35b45a4a2'],
            sports: [getSportById('sport-3')!],
            sportPrices: [{ sportId: 'sport-3', pricePerHour: 800 }],
            amenities: [getAmenityById('amenity-1')!, getAmenityById('amenity-3')!],
            operatingHours: [ { day: 'Mon', open: '07:00', close: '21:00' }, { day: 'Tue', open: '07:00', close: '21:00' }, { day: 'Wed', open: '07:00', close: '21:00' }, { day: 'Thu', open: '07:00', close: '21:00' }, { day: 'Fri', open: '07:00', close: '22:00' }, { day: 'Sat', open: '08:00', close: '22:00' }, { day: 'Sun', open: '08:00', close: '20:00' } ],
            rating: 4.5,
            isPopular: true,
            isIndoor: false,
            dataAiHint: 'outdoor tennis court',
            ownerId: 'user-owner'
          },
          {
            name: 'Uptown Box Cricket',
            type: 'Box Cricket',
            address: '50 Uptown Ave, Metropolis',
            city: 'Metropolis',
            location: 'Uptown',
            description: 'A dedicated box cricket arena perfect for fast-paced, high-energy matches with friends and colleagues.',
            images: ['https://images.unsplash.com/photo-1593341646782-e0b495cffc25'],
            sports: [getSportById('sport-13')!],
            sportPrices: [{ sportId: 'sport-13', pricePerHour: 1500 }],
            amenities: [getAmenityById('amenity-1')!, getAmenityById('amenity-5')!],
            operatingHours: [ { day: 'Mon', open: '10:00', close: '23:59' }, { day: 'Tue', open: '10:00', close: '23:59' }, { day: 'Wed', open: '10:00', close: '23:59' }, { day: 'Thu', open: '10:00', close: '23:59' }, { day: 'Fri', open: '10:00', close: '23:59' }, { day: 'Sat', open: '09:00', close: '23:59' }, { day: 'Sun', open: '09:00', close: '23:59' } ],
            rating: 4.7,
            capacity: 16,
            isIndoor: true,
            dataAiHint: 'box cricket arena',
          },
          {
            name: 'The Swim Center',
            type: 'Pool',
            address: '12 Aqua Lane, Suburbia',
            city: 'Metropolis',
            location: 'Suburbia',
            description: 'Olympic-sized swimming pool for both professional training and recreational swimming. Clean, well-maintained, and family-friendly.',
            images: ['https://images.unsplash.com/photo-1590650392358-693608513b68'],
            sports: [getSportById('sport-5')!],
            sportPrices: [{ sportId: 'sport-5', pricePerHour: 500 }],
            amenities: [getAmenityById('amenity-3')!, getAmenityById('amenity-4')!],
            operatingHours: [ { day: 'Mon', open: '05:00', close: '21:00' }, { day: 'Tue', open: '05:00', close: '21:00' }, { day: 'Wed', open: '05:00', close: '21:00' }, { day: 'Thu', open: '05:00', close: '21:00' }, { day: 'Fri', open: '05:00', close: '21:00' }, { day: 'Sat', open: '06:00', close: '19:00' }, { day: 'Sun', open: '06:00', close: '19:00' } ],
            rating: 4.6,
            isIndoor: true,
            dataAiHint: 'indoor swimming pool',
          },
          {
            name: 'Southside Badminton Hall',
            type: 'Court',
            address: '77 Shuttlecock Dr, Southside',
            city: 'Metropolis',
            location: 'Southside',
            description: 'Multiple well-lit badminton courts with professional-grade flooring. Ideal for players of all skill levels.',
            images: ['https://images.unsplash.com/photo-1620054383349-fcec19b78a48'],
            sports: [getSportById('sport-4')!],
            sportPrices: [{ sportId: 'sport-4', pricePerHour: 600 }],
            amenities: [getAmenityById('amenity-1')!],
            operatingHours: [ { day: 'Mon', open: '09:00', close: '22:00' }, { day: 'Tue', open: '09:00', close: '22:00' }, { day: 'Wed', open: '09:00', close: '22:00' }, { day: 'Thu', open: '09:00', close: '22:00' }, { day: 'Fri', open: '09:00', close: '22:00' }, { day: 'Sat', open: '09:00', close: '22:00' }, { day: 'Sun', open: '09:00', close: '22:00' } ],
            rating: 4.4,
            isIndoor: true,
            dataAiHint: 'indoor badminton court',
          },
           {
            name: 'Zen Yoga Studio',
            type: 'Studio',
            address: '33 Serenity Way, Downtown',
            city: 'Metropolis',
            location: 'Downtown',
            description: 'A peaceful and modern yoga studio. Escape the city bustle and find your inner peace.',
            images: ['https://images.unsplash.com/photo-1599447462858-a0b8188edf24'],
            sports: [getSportById('sport-6')!],
            sportPrices: [{ sportId: 'sport-6', pricePerHour: 400 }],
            amenities: [getAmenityById('amenity-2')!, getAmenityById('amenity-3')!, getAmenityById('amenity-4')!],
            operatingHours: [ { day: 'Mon', open: '06:00', close: '20:00' }, { day: 'Tue', open: '06:00', close: '20:00' }, { day: 'Wed', open: '06:00', close: '20:00' }, { day: 'Thu', open: '06:00', close: '20:00' }, { day: 'Fri', open: '06:00', close: '20:00' }, { day: 'Sat', open: '08:00', close: '18:00' }, { day: 'Sun', open: '08:00', close: '18:00' } ],
            rating: 4.9,
            isIndoor: true,
            dataAiHint: 'serene yoga studio',
          },
          {
            name: 'Iron Temple Gym',
            type: 'Studio',
            address: '88 Fitness Row, Downtown',
            city: 'Metropolis',
            location: 'Downtown',
            description: 'A hardcore gym with a vast selection of free weights and machines for serious strength training.',
            images: ['https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e'],
            sports: [getSportById('sport-16')!],
            sportPrices: [{ sportId: 'sport-16', pricePerHour: 250 }],
            amenities: [getAmenityById('amenity-2')!, getAmenityById('amenity-3')!, getAmenityById('amenity-4')!],
            operatingHours: [ { day: 'Mon', open: '05:00', close: '23:00' }, { day: 'Tue', open: '05:00', close: '23:00' }, { day: 'Wed', open: '05:00', close: '23:00' }, { day: 'Thu', open: '05:00', close: '23:00' }, { day: 'Fri', open: '05:00', close: '23:00' }, { day: 'Sat', open: '07:00', close: '21:00' }, { day: 'Sun', 'open': '08:00', 'close': '20:00' } ],
            rating: 4.7,
            capacity: 75,
            isIndoor: true,
            dataAiHint: 'weightlifting gym',
          },
        ];
        for (const facility of facilitiesToSeed) {
          await addDoc(facilitiesCollection, facility);
        }
        console.log("Database facilities seeded successfully.");
    }
}


// Call seeding function on startup
if (typeof window !== 'undefined') {
    // We run this in a setTimeout to allow the main thread to unblock
    // and prevent any potential race conditions with other initializations.
    setTimeout(() => {
        seedData().catch(console.error);
    }, 0);
}

// Keep all other functions like addNotification, updateSiteSettings, etc. as they are.
// ... (The rest of the file remains unchanged, only mock data arrays at the top and seeding logic are modified)
export const getFacilitiesByOwnerId = async (ownerId: string): Promise<Facility[]> => {
     try {
        const q = query(collection(db, "facilities"), where("ownerId", "==", ownerId));
        const querySnapshot = await getDocs(q);
        const facilities: Facility[] = [];
        querySnapshot.forEach((doc) => {
            facilities.push({ id: doc.id, ...doc.data() } as Facility);
        });
        return facilities;
    } catch (error) {
        console.error("Error fetching owner facilities: ", error);
        return [];
    }
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
export const getRentalEquipmentById = (id: string): RentalEquipment | undefined => mockRentalEquipment.find(eq => eq.id === eq.id);
export const getNotificationsForUser = (userId: string): AppNotification[] => mockAppNotifications.filter(n => n.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
export const getAllBlogPosts = (): BlogPost[] => mockBlogPosts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
export const getBlogPostBySlug = (slug: string): BlogPost | undefined => mockBlogPosts.find(post => post.slug === slug);
export const getAllMembershipPlans = (): MembershipPlan[] => [...mockMembershipPlans];
export const getMembershipPlanById = (id: string): MembershipPlan | undefined => mockMembershipPlans.find(plan => plan.id === plan.id);
export const getAllEvents = (): SportEvent[] => [...mockEvents].sort((a,b) => parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime());
export const getEventById = async (id: string): Promise<SportEvent | undefined> => {
  const event = mockEvents.find(event => event.id === id);
  if (event) {
    const sport = getSportById(event.sport.id);
    const facility = await getFacilityById(event.facilityId);
    return sport && facility ? { ...event, sport, facilityName: facility.name } : { ...event };
  }
  return undefined;
};
export const getAllPricingRules = (): PricingRule[] => [...mockPricingRules];
export const getPricingRuleById = (id: string): PricingRule | undefined => mockPricingRules.find(rule => rule.id === id);
export const getAllPromotionRules = (): PromotionRule[] => [...mockPromotionRules].sort((a, b) => a.name.localeCompare(b.name));
export const getPromotionRuleById = (id: string): PromotionRule | undefined => mockPromotionRules.find(r => r.id === r.id);
export const isUserOnWaitlist = (userId: string, facilityId: string, date: string, startTime: string): boolean => {
    if(!mockUser) return false;
    return mockWaitlist.some(entry => entry.userId === userId && entry.facilityId === facilityId && entry.date === date && entry.startTime === startTime);
}
export const getOpenLfgRequests = (): LfgRequest[] => mockLfgRequests.filter(req => req.status === 'open').sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
export const getAllBookings = async (): Promise<Booking[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, 'bookings'));
        const bookings: Booking[] = [];
        querySnapshot.forEach((doc) => {
            bookings.push({ id: doc.id, ...doc.data() } as Booking);
        });
        return bookings.sort((a,b) => new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime());
    } catch (error) {
        console.error("Error fetching all bookings: ", error);
        return [];
    }
};

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
  updateUser(teamData.captainId, { teamIds: [...(mockUser.teamIds || []), newTeam.id] });
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
  
  updateUser(userId, { teamIds: mockUser.teamIds?.filter(id => id !== teamId) });
  return true;
};

export const removeUserFromTeam = (teamId: string, memberIdToRemove: string, captainId: string): void => {
    const team = mockTeams.find(t => t.id === teamId);
    if (!team) throw new Error("Team not found.");
    if (team.captainId !== captainId) throw new Error("Only the team captain can remove members.");
    if (memberIdToRemove === captainId) throw new Error("Captain cannot remove themselves.");
    
    team.memberIds = team.memberIds.filter(id => id !== memberIdToRemove);
    updateUser(memberIdToRemove, { teamIds: mockUser.teamIds?.filter(id => id !== teamId) });
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
    
    // Remove team from all members' profiles
    team.memberIds.forEach(memberId => {
        updateUser(memberId, { teamIds: mockUser.teamIds?.filter(id => id !== teamId) });
    });

    // Remove the team itself
    mockTeams.splice(teamIndex, 1);
};


export const markNotificationAsRead = (userId: string, notificationId: string): void => { const notification = mockAppNotifications.find(n => n.id === notificationId && n.userId === userId); if (notification) notification.isRead = true; };
export const markAllNotificationsAsRead = (userId: string): void => { mockAppNotifications.forEach(n => { if (n.userId === userId) n.isRead = true; }); };
export const calculateDynamicPrice = ( basePricePerHour: number, selectedDate: Date, selectedSlot: TimeSlot, durationHours: number ): { finalPrice: number; appliedRuleName?: string, appliedRuleDetails?: PricingRule } => ({ finalPrice: basePricePerHour * durationHours });
export const addReview = async (reviewData: Omit<Review, 'id' | 'createdAt' | 'userName' | 'userAvatar'>): Promise<Review> => {
  const currentUser = await getUserById(reviewData.userId);
  const newReview: Review = { ...reviewData, id: `review-${Date.now()}`, userName: currentUser?.name || 'Anonymous User', userAvatar: currentUser?.profilePictureUrl, isPublicProfile: currentUser?.isProfilePublic || false, createdAt: new Date().toISOString() };
  mockReviews.push(newReview);
  return newReview;
};

export const createLfgRequest = (requestData: Omit<LfgRequest, 'id' | 'createdAt' | 'status' | 'interestedUserIds'>): LfgRequest[] => {
    const newRequest: LfgRequest = { ...requestData, id: `lfg-${Date.now()}`, createdAt: new Date().toISOString(), status: 'open', interestedUserIds: [] };
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
    return mockChallenges.filter(c => c.status === 'open').sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const createChallenge = (data: { challengerId: string; sportId: string; proposedDate: string; notes: string }): Challenge[] => {
    const challenger = mockUser; // Simplified, assuming mockUser is challenger
    const sport = getSportById(data.sportId);

    if (!challenger || !sport) {
        throw new Error("Invalid challenger or sport ID");
    }

    const newChallenge: Challenge = {
        id: `challenge-${Date.now()}`,
        challengerId: data.challengerId,
        challenger,
        sport,
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
    const opponent = mockUser; // Simplified

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


// Functions below are still using mock data and would need to be migrated
// --- MOCK DATA POPULATION (Example data) ---
export const addMembershipPlan = (plan: Omit<MembershipPlan, 'id'>): MembershipPlan => { const newPlan = { ...plan, id: `mem-${Date.now()}`}; mockMembershipPlans.push(newPlan); return newPlan; };
export const updateMembershipPlan = (plan: MembershipPlan): void => { const index = mockMembershipPlans.findIndex(p => p.id === plan.id); if (index !== -1) mockMembershipPlans[index] = plan; };
export const deleteMembershipPlan = (id: string): void => { mockMembershipPlans = mockMembershipPlans.filter(p => p.id !== id); };
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
export const updateEvent = (event: SportEvent): void => { const index = mockEvents.findIndex(e => e.id === event.id); if (index !== -1) mockEvents[index] = event; };
export const deleteEvent = (id: string): void => { mockEvents = mockEvents.filter(e => e.id !== id); };
export const registerForEvent = (eventId: string): boolean => { const event = mockEvents.find(e => e.id === eventId); if (event && (!event.maxParticipants || event.registeredParticipants < event.maxParticipants)) { event.registeredParticipants++; return true; } return false; };
export const addPricingRule = (rule: Omit<PricingRule, 'id'>): void => { mockPricingRules.push({ ...rule, id: `pr-${Date.now()}` }); };
export const updatePricingRule = (rule: PricingRule): void => { const index = mockPricingRules.findIndex(r => r.id === rule.id); if (index !== -1) mockPricingRules[index] = rule; };
export const deletePricingRule = (id: string): void => { mockPricingRules = mockPricingRules.filter(r => r.id !== id); };
export const addPromotionRule = (rule: Omit<PromotionRule, 'id'>): void => { mockPromotionRules.push({ ...rule, id: `promo-${Date.now()}` }); };
export const updatePromotionRule = (rule: PromotionRule): void => { const index = mockPromotionRules.findIndex(r => r.id === rule.id); if (index !== -1) mockPromotionRules[index] = rule; };
export const getPromotionRuleByCode = async (code: string): Promise<PromotionRule | undefined> => mockPromotionRules.find(p => p.code?.toUpperCase() === code.toUpperCase() && p.isActive);
export const addToWaitlist = async (userId: string, facilityId: string, date: string, startTime: string): Promise<void> => { const entry: WaitlistEntry = { id: `wait-${Date.now()}`, userId, facilityId, date, startTime, createdAt: new Date().toISOString() }; mockWaitlist.push(entry); };
export async function listenToOwnerBookings(ownerId: string, callback: (bookings: Booking[]) => void, onError: (error: Error) => void): Promise<() => void> {
    const facilities = await getFacilitiesByOwnerId(ownerId);
    const facilityIds = facilities.map(f => f.id);

    if (facilityIds.length === 0) {
        callback([]);
        return () => {}; // No facilities, no need to listen
    }

    const q = query(collection(db, "bookings"), where("facilityId", "in", facilityIds));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const bookingsData: Booking[] = [];
        querySnapshot.forEach((doc) => {
            bookingsData.push({ id: doc.id, ...doc.data() } as Booking);
        });
        callback(bookingsData);
    }, onError);

    return unsubscribe;
}
export const blockTimeSlot = async (facilityId: string, ownerId: string, newBlock: BlockedSlot): Promise<boolean> => {
    try {
        const facilityRef = doc(db, 'facilities', facilityId);
        const facilitySnap = await getDoc(facilityRef);

        if (facilitySnap.exists() && facilitySnap.data().ownerId === ownerId) {
            await updateDoc(facilityRef, {
                blockedSlots: arrayUnion(newBlock)
            });
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error blocking time slot: ", error);
        return false;
    }
};

export const unblockTimeSlot = async (facilityId: string, ownerId: string, date: string, startTime: string): Promise<boolean> => {
    try {
        const facilityRef = doc(db, 'facilities', facilityId);
        const facilitySnap = await getDoc(facilityRef);

        if (facilitySnap.exists() && facilitySnap.data().ownerId === ownerId) {
            const facilityData = facilitySnap.data() as Facility;
            const slotToRemove = facilityData.blockedSlots?.find(s => s.date === date && s.startTime === startTime);
            if (slotToRemove) {
                await updateDoc(facilityRef, {
                    blockedSlots: arrayRemove(slotToRemove)
                });
                return true;
            }
        }
        return false;
    } catch (error) {
        console.error("Error unblocking time slot: ", error);
        return false;
    }
};

