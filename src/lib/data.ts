

import type { Facility, Sport, Amenity, UserProfile, UserRole, UserStatus, Booking, ReportData, MembershipPlan, SportEvent, Review, AppNotification, NotificationType, BlogPost, PricingRule, PromotionRule, RentalEquipment, RentedItemInfo, AppliedPromotionInfo, TimeSlot, UserSkill, SkillLevel, BlockedSlot, SiteSettings, Team, WaitlistEntry, LfgRequest, SportPrice, NotificationTemplate, Challenge } from './types';
import { ParkingCircle, Wifi, ShowerHead, Lock, Dumbbell, Zap, Users, Trophy, Award, CalendarDays as LucideCalendarDays, Utensils, Star, LocateFixed, Clock, DollarSign, Goal, Bike, Dices, Swords, Music, Tent, Drama, MapPin, Heart, Dribbble, Activity, Feather, CheckCircle, XCircle, MessageSquareText, Info, Gift, Edit3, PackageSearch, Shirt, Disc, Medal, Gem, Rocket, Gamepad2, MonitorPlay, Target, Drum, Guitar, Brain, Camera, PersonStanding, Building, HandCoins, Palette, Group, BikeIcon, DramaIcon, Film, Gamepad, GuitarIcon, Landmark, Lightbulb, MountainSnow, Pizza, ShoppingBag, VenetianMask, Warehouse, Weight, Wind, WrapText, Speech, HistoryIcon, BarChartIcon, UserCheck, UserX, Building2, BellRing } from 'lucide-react';
import { parseISO, isWithinInterval, isAfter, isBefore, startOfDay, endOfDay, getDay, subDays, getMonth, getYear, format as formatDateFns } from 'date-fns';
import { db } from './firebase';
import { collection, getDocs, doc, getDoc, addDoc, setDoc, deleteDoc, query, where, onSnapshot, arrayUnion, arrayRemove, updateDoc } from 'firebase/firestore';


// --- MOCK DATA (for non-facility types, to be migrated later) ---
export const mockSports: Sport[] = [
  { id: 'sport-1', name: 'Soccer', iconName: 'Goal', imageUrl: 'https://images.unsplash.com/photo-1551958214-e6163c125414', imageDataAiHint: 'soccer ball' },
  { id: 'sport-2', name: 'Basketball', iconName: 'Dribbble', imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc', imageDataAiHint: 'basketball hoop' },
  { id: 'sport-3', name: 'Tennis', iconName: 'Activity', imageUrl: 'https://images.unsplash.com/photo-1594470117722-de4b9a02ebed', imageDataAiHint: 'tennis racket' },
  { id: 'sport-4', name: 'Badminton', iconName: 'Feather', imageUrl: 'https://images.unsplash.com/photo-1521587514789-53b8a3b09228', imageDataAiHint: 'badminton shuttlecock' },
  { id: 'sport-5', name: 'Swimming', iconName: 'PersonStanding', imageUrl: 'https://images.unsplash.com/photo-1590650392358-693608513b68', imageDataAiHint: 'swimming lane' },
  { id: 'sport-6', name: 'Yoga', iconName: 'Brain', imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b', imageDataAiHint: 'yoga pose' },
  { id: 'sport-7', name: 'Cycling', iconName: 'Bike', imageUrl: 'https://images.unsplash.com/photo-1576426863875-c217e4287487', imageDataAiHint: 'cycling road' },
  { id: 'sport-8', name: 'Dance', iconName: 'Music', imageUrl: 'https://images.unsplash.com/photo-1511719111394-550342a5b23d', imageDataAiHint: 'dance studio' },
  { id: 'sport-9', name: 'Camping', iconName: 'Tent', imageUrl: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d', imageDataAiHint: 'camping tent nature' },
  { id: 'sport-10', name: 'Theatre', iconName: 'Drama', imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91e38a493', imageDataAiHint: 'theatre stage' },
  { id: 'sport-13', name: 'Cricket', iconName: 'Dices', imageUrl: 'https://images.unsplash.com/photo-1599551154316-276537b02c89', imageDataAiHint: 'cricket bat ball' },
  { id: 'sport-14', name: 'Pool', iconName: 'Target', imageUrl: 'https://images.unsplash.com/photo-1601758124235-7c98c199e4df', imageDataAiHint: 'billiards table' },
  { id: 'sport-15', name: 'PC Game/PS5', iconName: 'Gamepad2', imageUrl: 'https://images.unsplash.com/photo-1598550489913-af3c28a2cc73', imageDataAiHint: 'gaming setup' },
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

// Most data is now fetched from Firebase. Mocks for related/unmigrated data are kept for now.
export let mockReviews: Review[] = [];
export const mockAchievements: Achievement[] = [];
export let mockUsers: UserProfile[] = [];
export let mockUser: UserProfile | null = null;
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
export let mockBookings: Booking[] = [];

export const getUserByEmail = async (email: string): Promise<UserProfile | undefined> => {
    try {
        const q = query(collection(db, 'users'), where('email', '==', email));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            return { id: userDoc.id, ...userDoc.data() } as UserProfile;
        }
        return undefined;
    } catch (error) {
        console.error("Error fetching user by email:", error);
        return undefined;
    }
};


// --- FIREBASE-ENABLED FACILITY FUNCTIONS ---

export function listenToFacilities(
  callback: (facilities: Facility[]) => void, 
  onError: (error: Error) => void
) {
  const q = query(collection(db, 'facilities'));
  
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const facilitiesData: Facility[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Omit<Facility, 'id'>;
      facilitiesData.push({ ...data, id: doc.id });
    });
    callback(facilitiesData);
  }, (error) => {
    console.error("Firestore listener error: ", error);
    onError(error);
  });

  return unsubscribe;
}

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
    if (ids.length === 0) {
        return [];
    }
    try {
        // Firestore 'in' query is limited to 30 items, but for favorites this is usually fine.
        // For larger arrays, you would need to chunk the requests.
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

export const blockTimeSlot = async (facilityId: string, ownerId: string, slot: BlockedSlot): Promise<boolean> => {
    const facilityRef = doc(db, 'facilities', facilityId);
    try {
        const facilityDoc = await getDoc(facilityRef);
        if (!facilityDoc.exists() || facilityDoc.data().ownerId !== ownerId) {
            console.error("Permission denied or facility not found for blocking slot.");
            return false;
        }
        await updateDoc(facilityRef, {
            blockedSlots: arrayUnion(slot)
        });
        return true;
    } catch (error) {
        console.error("Error blocking time slot:", error);
        return false;
    }
};

export const unblockTimeSlot = async (facilityId: string, ownerId: string, date: string, startTime: string): Promise<boolean> => {
    const facilityRef = doc(db, 'facilities', facilityId);
    try {
        const facilityDoc = await getDoc(facilityRef);
        if (!facilityDoc.exists() || facilityDoc.data().ownerId !== ownerId) {
            console.error("Permission denied or facility not found for unblocking slot.");
            return false;
        }
        const facilityData = facilityDoc.data() as Facility;
        const slotToRemove = facilityData.blockedSlots?.find(s => s.date === date && s.startTime === startTime);
        if (slotToRemove) {
            await updateDoc(facilityRef, {
                blockedSlots: arrayRemove(slotToRemove)
            });
            return true;
        }
        return false; // Slot not found
    } catch (error) {
        console.error("Error unblocking time slot:", error);
        return false;
    }
};

// --- BOOKING FUNCTIONS (FIRESTORE) ---

export function listenToUserBookings(
  userId: string,
  callback: (bookings: Booking[]) => void,
  onError: (error: Error) => void
) {
  const q = query(collection(db, "bookings"), where("userId", "==", userId));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const bookingsData: Booking[] = [];
    querySnapshot.forEach((doc) => {
      bookingsData.push({ id: doc.id, ...doc.data() } as Booking);
    });
    callback(bookingsData);
  }, (error) => {
    console.error("Firestore listener error for user bookings:", error);
    onError(error);
  });

  return unsubscribe;
}

export function listenToAllBookings(
  callback: (bookings: Booking[]) => void,
  onError: (error: Error) => void
) {
  const q = query(collection(db, "bookings"));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const bookingsData: Booking[] = [];
    querySnapshot.forEach((doc) => {
      bookingsData.push({ id: doc.id, ...doc.data() } as Booking);
    });
    callback(bookingsData);
  }, (error) => {
    console.error("Firestore listener error for all bookings:", error);
    onError(error);
  });

  return unsubscribe;
}

export async function listenToOwnerBookings(
  ownerId: string,
  callback: (bookings: Booking[]) => void,
  onError: (error: Error) => void
): Promise<() => void> {
  const ownerFacilities = await getFacilitiesByOwnerId(ownerId);
  const facilityIds = ownerFacilities.map(f => f.id);

  if (facilityIds.length === 0) {
    callback([]);
    return () => {}; // Return a no-op unsubscribe function
  }

  const CHUNK_SIZE = 30;
  const facilityIdChunks: string[][] = [];
  for (let i = 0; i < facilityIds.length; i += CHUNK_SIZE) {
    facilityIdChunks.push(facilityIds.slice(i, i + CHUNK_SIZE));
  }

  const allBookings: { [key: string]: Booking } = {};
  const unsubscribes: (() => void)[] = [];

  facilityIdChunks.forEach(chunk => {
    const q = query(collection(db, "bookings"), where("facilityId", "in", chunk));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        const booking = { id: change.doc.id, ...change.doc.data() } as Booking;
        if (change.type === "removed") {
          delete allBookings[booking.id];
        } else {
          allBookings[booking.id] = booking;
        }
      });
      callback(Object.values(allBookings));
    }, (error) => {
      console.error("Firestore listener error for owner bookings chunk:", error);
      onError(error);
    });
    unsubscribes.push(unsubscribe);
  });

  return () => unsubscribes.forEach(unsub => unsub());
}

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

export const getBookingsByUserId = async (userId: string): Promise<Booking[]> => {
     try {
        const q = query(collection(db, "bookings"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        const bookings: Booking[] = [];
        querySnapshot.forEach((doc) => {
            bookings.push({ id: doc.id, ...doc.data() } as Booking);
        });
        return bookings;
    } catch (error) {
        console.error("Error fetching user bookings: ", error);
        return [];
    }
};

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


// --- MOCK GETTERS (for other data types) ---
export const getSportById = (id: string): Sport | undefined => mockSports.find(s => s.id === id);
export const getAmenityById = (id: string): Amenity | undefined => mockAmenities.find(a => a.id === id);
export const getAllSports = (): Sport[] => mockSports;
export const getSiteSettings = (): SiteSettings => mockSiteSettings;
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

export const getUserById = (userId: string): UserProfile | undefined => {
    if (mockUser && userId === mockUser.id) {
        return mockUser;
    }
    return mockUsers.find(user => user.id === userId);
};
export const getReviewsByFacilityId = (facilityId: string): Review[] => mockReviews.filter(review => review.facilityId === facilityId);
export const getTeamById = (teamId: string): Team | undefined => mockTeams.find(team => team.id === teamId);
export const getTeamsByUserId = (userId: string): Team[] => mockTeams.filter(team => team.memberIds.includes(userId));
export const getAllUsers = (): UserProfile[] => [...mockUsers];
export const addUser = async (user: Omit<UserProfile, 'id'> & {id: string}): Promise<UserProfile> => {
    try {
        const userRef = doc(db, 'users', user.id);
        await setDoc(userRef, user);
        
        // Also update the local mock array for immediate consistency in client components
        const existingIndex = mockUsers.findIndex(u => u.id === user.id);
        if (existingIndex > -1) {
            mockUsers[existingIndex] = user;
        } else {
            mockUsers.push(user);
        }

        return user;
    } catch (error) {
        console.error("Error adding user to Firestore:", error);
        throw new Error("Could not add user to the database.");
    }
};

export const getRentalEquipmentById = (id: string): RentalEquipment | undefined => mockRentalEquipment.find(eq => eq.id === eq.id);
export const getNotificationsForUser = (userId: string): AppNotification[] => mockAppNotifications.filter(n => n.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
export const getAllBlogPosts = (): BlogPost[] => mockBlogPosts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
export const getBlogPostBySlug = (slug: string): BlogPost | undefined => mockBlogPosts.find(post => post.slug === slug);
export const getAllMembershipPlans = (): MembershipPlan[] => [...mockMembershipPlans];
export const getMembershipPlanById = (id: string): MembershipPlan | undefined => mockMembershipPlans.find(plan => plan.id === plan.id);
export const getAllEvents = (): SportEvent[] => [...mockEvents].sort((a,b) => parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime());
export const getEventById = (id: string): SportEvent | undefined => {
  const event = mockEvents.find(event => event.id === id);
  if (event) {
    const sport = getSportById(event.sport.id);
    return sport ? { ...event, sport } : { ...event };
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

export const addNotification = (userId: string, notificationData: Omit<AppNotification, 'id' | 'userId' | 'createdAt' | 'isRead'>): AppNotification => {
  let iconName = 'Info';
  switch (notificationData.type) { case 'booking_confirmed': iconName = 'CheckCircle'; break; case 'booking_cancelled': iconName = 'XCircle'; break; case 'review_submitted': iconName = 'MessageSquareText'; break; case 'reminder': iconName = 'CalendarDays'; break; case 'promotion': iconName = 'Gift'; break; case 'waitlist_opening': iconName = 'BellRing'; break; case 'user_status_changed': iconName = 'Edit3'; break; case 'matchmaking_interest': iconName = 'Swords'; break; }
  const newNotification: AppNotification = { ...notificationData, id: `notif-${Date.now()}`, userId, createdAt: new Date().toISOString(), isRead: false, iconName: notificationData.iconName || iconName, };
  mockAppNotifications.unshift(newNotification);
  return newNotification;
};

export const updateUser = (userId: string, updates: Partial<UserProfile>): UserProfile | undefined => {
    const userIndex = mockUsers.findIndex(user => user.id === userId);
    if (userIndex === -1) return undefined;
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };
    
    // If the updated user is the currently logged-in user, update that too
    if (mockUser && mockUser.id === userId) {
        mockUser = { ...mockUser, ...updates };
    }
    
    return mockUsers[userIndex];
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
  const user = getUserById(teamData.captainId);
  if (user) { if (!user.teamIds) user.teamIds = []; user.teamIds.push(newTeam.id); }
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
  const user = getUserById(userId);
  if (user && user.teamIds) {
      user.teamIds = user.teamIds.filter(id => id !== teamId);
  }
  return true;
};

export const removeUserFromTeam = (teamId: string, memberIdToRemove: string, captainId: string): void => {
    const team = getTeamById(teamId);
    if (!team) throw new Error("Team not found.");
    if (team.captainId !== captainId) throw new Error("Only the team captain can remove members.");
    if (memberIdToRemove === captainId) throw new Error("Captain cannot remove themselves.");
    
    team.memberIds = team.memberIds.filter(id => id !== memberIdToRemove);
    
    const member = getUserById(memberIdToRemove);
    if (member && member.teamIds) {
        member.teamIds = member.teamIds.filter(id => id !== teamId);
    }
};

export const transferCaptaincy = (teamId: string, newCaptainId: string, oldCaptainId: string): void => {
    const team = getTeamById(teamId);
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
        const member = getUserById(memberId);
        if (member && member.teamIds) {
            member.teamIds = member.teamIds.filter(id => id !== teamId);
        }
    });

    // Remove the team itself
    mockTeams.splice(teamIndex, 1);
};


export const markNotificationAsRead = (userId: string, notificationId: string): void => { const notification = mockAppNotifications.find(n => n.id === notificationId && n.userId === userId); if (notification) notification.isRead = true; };
export const markAllNotificationsAsRead = (userId: string): void => { mockAppNotifications.forEach(n => { if (n.userId === userId) n.isRead = true; }); };
export const calculateDynamicPrice = ( basePricePerHour: number, selectedDate: Date, selectedSlot: TimeSlot, durationHours: number ): { finalPrice: number; appliedRuleName?: string, appliedRuleDetails?: PricingRule } => ({ finalPrice: basePricePerHour * durationHours });
export const addReview = (reviewData: Omit<Review, 'id' | 'createdAt' | 'userName' | 'userAvatar'>): Review => {
  const currentUser = getUserById(reviewData.userId);
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
    const challenger = getUserById(data.challengerId);
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


// Functions below are still using mock data and would need to be migrated
// --- MOCK DATA POPULATION (Example data) ---
export const addMembershipPlan = (plan: Omit<MembershipPlan, 'id'>): MembershipPlan => { const newPlan = { ...plan, id: `mem-${Date.now()}`}; mockMembershipPlans.push(newPlan); return newPlan; };
export const updateMembershipPlan = (plan: MembershipPlan): void => { const index = mockMembershipPlans.findIndex(p => p.id === plan.id); if (index !== -1) mockMembershipPlans[index] = plan; };
export const deleteMembershipPlan = (id: string): void => { mockMembershipPlans = mockMembershipPlans.filter(p => p.id !== id); };
export const addEvent = (event: Omit<SportEvent, 'id' | 'sport' | 'registeredParticipants'> & { sportId: string }): void => { 
  const sport = getSportById(event.sportId); 
  const fetchFacilityName = async () => {
    const facility = await getFacilityById(event.facilityId);
    if(sport) {
      mockEvents.push({ ...event, id: `evt-${Date.now()}`, sport, registeredParticipants: 0, facilityName: facility?.name || 'Unknown Facility' });
    }
  };
  fetchFacilityName();
};
export const updateEvent = (event: SportEvent): void => { const index = mockEvents.findIndex(e => e.id === event.id); if (index !== -1) mockEvents[index] = event; };
export const deleteEvent = (id: string): void => { mockEvents = mockEvents.filter(e => e.id !== id); };
export const registerForEvent = (eventId: string): boolean => { const event = mockEvents.find(e => e.id === eventId); if (event && (!event.maxParticipants || event.registeredParticipants < event.maxParticipants)) { event.registeredParticipants++; return true; } return false; };
export const addPricingRule = (rule: Omit<PricingRule, 'id'>): void => { mockPricingRules.push({ ...rule, id: `pr-${Date.now()}` }); };
export const updatePricingRule = (rule: PricingRule): void => { const index = mockPricingRules.findIndex(r => r.id === rule.id); if (index !== -1) mockPricingRules[index] = rule; };
export const deletePricingRule = (id: string): void => { mockPricingRules = mockPricingRules.filter(r => r.id !== id); };
export const addPromotionRule = (rule: Omit<PromotionRule, 'id'>): void => { mockPromotionRules.push({ ...rule, id: `promo-${Date.now()}` }); };
export const updatePromotionRule = (rule: PromotionRule): void => { const index = mockPromotionRules.findIndex(r => r.id === rule.id); if (index !== -1) mockPromotionRules[index] = rule; };
export const deletePromotionRule = (id: string): void => { mockPromotionRules = mockPromotionRules.filter(r => r.id !== id); };
export const getPromotionRuleByCode = async (code: string): Promise<PromotionRule | undefined> => mockPromotionRules.find(p => p.code?.toUpperCase() === code.toUpperCase() && p.isActive);
export const addToWaitlist = async (userId: string, facilityId: string, date: string, startTime: string): Promise<void> => { const entry: WaitlistEntry = { id: `wait-${Date.now()}`, userId, facilityId, date, startTime, createdAt: new Date().toISOString() }; mockWaitlist.push(entry); };

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
            await addUser(user);
        }
         // Set the default mock user after seeding
        const adminUser = usersToSeed.find(u => u.role === 'Admin');
        if (adminUser) {
            mockUser = adminUser;
        }

    } else {
        const tempUsers: UserProfile[] = [];
        usersSnapshot.forEach(doc => {
            tempUsers.push({ id: doc.id, ...doc.data() } as UserProfile);
        });
        mockUsers = tempUsers;
         // Set the default mock user from existing data
        const adminUser = mockUsers.find(u => u.role === 'Admin');
        if (adminUser) {
            mockUser = adminUser;
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
            images: ['https://placehold.co/800x450.png', 'https://placehold.co/400x300.png', 'https://placehold.co/400x300.png'],
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
            dataAiHint: 'sports arena soccer',
            ownerId: 'user-owner'
          },
          {
            name: 'Riverside Tennis Club',
            type: 'Court',
            address: '25 River Road, Metropolis',
            city: 'Metropolis',
            location: 'Riverside',
            description: 'Picturesque tennis courts with a serene view of the river. Perfect for a friendly match or competitive play.',
            images: ['https://placehold.co/800x450.png', 'https://placehold.co/400x300.png'],
            sports: [getSportById('sport-3')!],
            sportPrices: [{ sportId: 'sport-3', pricePerHour: 800 }],
            amenities: [getAmenityById('amenity-1')!, getAmenityById('amenity-3')!],
            operatingHours: [ { day: 'Mon', open: '07:00', close: '21:00' }, { day: 'Tue', open: '07:00', close: '21:00' }, { day: 'Wed', open: '07:00', close: '21:00' }, { day: 'Thu', open: '07:00', close: '21:00' }, { day: 'Fri', open: '07:00', close: '22:00' }, { day: 'Sat', open: '08:00', close: '22:00' }, { day: 'Sun', open: '08:00', close: '20:00' } ],
            rating: 4.5,
            isPopular: true,
            isIndoor: false,
            dataAiHint: 'tennis court',
            ownerId: 'user-owner'
          },
          {
            name: 'Uptown Box Cricket',
            type: 'Box Cricket',
            address: '50 Uptown Ave, Metropolis',
            city: 'Metropolis',
            location: 'Uptown',
            description: 'A dedicated box cricket arena perfect for fast-paced, high-energy matches with friends and colleagues.',
            images: ['https://placehold.co/800x450.png'],
            sports: [getSportById('sport-13')!],
            sportPrices: [{ sportId: 'sport-13', pricePerHour: 1500 }],
            amenities: [getAmenityById('amenity-1')!, getAmenityById('amenity-5')!],
            operatingHours: [ { day: 'Mon', open: '10:00', close: '23:59' }, { day: 'Tue', open: '10:00', close: '23:59' }, { day: 'Wed', open: '10:00', close: '23:59' }, { day: 'Thu', open: '10:00', close: '23:59' }, { day: 'Fri', open: '10:00', close: '23:59' }, { day: 'Sat', open: '09:00', close: '23:59' }, { day: 'Sun', open: '09:00', close: '23:59' } ],
            rating: 4.7,
            capacity: 16,
            isIndoor: true,
            dataAiHint: 'box cricket',
          },
          {
            name: 'The Swim Center',
            type: 'Pool',
            address: '12 Aqua Lane, Suburbia',
            city: 'Metropolis',
            location: 'Suburbia',
            description: 'Olympic-sized swimming pool for both professional training and recreational swimming. Clean, well-maintained, and family-friendly.',
            images: ['https://placehold.co/800x450.png'],
            sports: [getSportById('sport-5')!],
            sportPrices: [{ sportId: 'sport-5', pricePerHour: 500 }],
            amenities: [getAmenityById('amenity-3')!, getAmenityById('amenity-4')!],
            operatingHours: [ { day: 'Mon', open: '05:00', close: '21:00' }, { day: 'Tue', open: '05:00', close: '21:00' }, { day: 'Wed', open: '05:00', close: '21:00' }, { day: 'Thu', open: '05:00', close: '21:00' }, { day: 'Fri', open: '05:00', close: '21:00' }, { day: 'Sat', open: '06:00', close: '19:00' }, { day: 'Sun', open: '06:00', close: '19:00' } ],
            rating: 4.6,
            isIndoor: true,
            dataAiHint: 'swimming pool',
          },
          {
            name: 'Southside Badminton Hall',
            type: 'Court',
            address: '77 Shuttlecock Dr, Southside',
            city: 'Metropolis',
            location: 'Southside',
            description: 'Multiple well-lit badminton courts with professional-grade flooring. Ideal for players of all skill levels.',
            images: ['https://placehold.co/800x450.png'],
            sports: [getSportById('sport-4')!],
            sportPrices: [{ sportId: 'sport-4', pricePerHour: 600 }],
            amenities: [getAmenityById('amenity-1')!],
            operatingHours: [ { day: 'Mon', open: '09:00', close: '22:00' }, { day: 'Tue', open: '09:00', close: '22:00' }, { day: 'Wed', open: '09:00', close: '22:00' }, { day: 'Thu', open: '09:00', close: '22:00' }, { day: 'Fri', open: '09:00', close: '22:00' }, { day: 'Sat', open: '09:00', close: '22:00' }, { day: 'Sun', open: '09:00', close: '22:00' } ],
            rating: 4.4,
            isIndoor: true,
            dataAiHint: 'badminton court',
          },
           {
            name: 'Zen Yoga Studio',
            type: 'Studio',
            address: '33 Serenity Way, Downtown',
            city: 'Metropolis',
            location: 'Downtown',
            description: 'A peaceful and modern yoga studio. Escape the city bustle and find your inner peace.',
            images: ['https://placehold.co/800x450.png'],
            sports: [getSportById('sport-6')!],
            sportPrices: [{ sportId: 'sport-6', pricePerHour: 400 }],
            amenities: [getAmenityById('amenity-2')!, getAmenityById('amenity-3')!, getAmenityById('amenity-4')!],
            operatingHours: [ { day: 'Mon', open: '06:00', close: '20:00' }, { day: 'Tue', open: '06:00', close: '20:00' }, { day: 'Wed', open: '06:00', close: '20:00' }, { day: 'Thu', open: '06:00', close: '20:00' }, { day: 'Fri', open: '06:00', close: '20:00' }, { day: 'Sat', open: '08:00', close: '18:00' }, { day: 'Sun', open: '08:00', close: '18:00' } ],
            rating: 4.9,
            isIndoor: true,
            dataAiHint: 'yoga studio',
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
