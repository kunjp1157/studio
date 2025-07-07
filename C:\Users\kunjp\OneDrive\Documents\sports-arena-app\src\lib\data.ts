
'use server';

import type { Facility, Sport, Amenity, UserProfile, Booking, MembershipPlan, SportEvent, Review, AppNotification, PricingRule, PromotionRule, RentalEquipment, SiteSettings, Team, LfgRequest, WaitlistEntry } from './types';
import { db } from './firebase';
import { collection, doc, getDocs, getDoc, addDoc, setDoc, updateDoc, deleteDoc, query, where, writeBatch, documentId, serverTimestamp, orderBy, limit } from "firebase/firestore";
import { parseISO, isWithinInterval, isAfter, isBefore, startOfDay, endOfDay, getDay } from 'date-fns';

// Helper function to convert Firestore doc to a typed object with its ID
function docToType<T>(d: any): T { // Use `any` for Firebase doc since its internal types can be complex
  const data = d.data();
  // Firestore timestamps need to be converted to ISO strings for consistency
  for (const key in data) {
    if (data[key]?.toDate) {
      data[key] = data[key].toDate().toISOString();
    }
  }
  return { id: d.id, ...data } as T;
}

// --- DATA GETTERS ---

export const getSiteSettings = async (): Promise<SiteSettings> => {
    const docRef = doc(db, 'settings', 'site');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data() as SiteSettings;
    } else {
        // Return default settings if not found in DB
        return {
            siteName: 'Sports Arena',
            defaultCurrency: 'INR',
            timezone: 'Asia/Kolkata',
            maintenanceMode: false,
        };
    }
};

export const getAllSports = async (): Promise<Sport[]> => {
    const q = query(collection(db, "sports"), orderBy("name"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(d => docToType<Sport>(d));
};

export const getSportById = async (id: string): Promise<Sport | undefined> => {
    const docRef = doc(db, "sports", id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docToType<Sport>(docSnap) : undefined;
};

export const getAllAmenities = async (): Promise<Amenity[]> => {
    const querySnapshot = await getDocs(collection(db, "amenities"));
    return querySnapshot.docs.map(d => docToType<Amenity>(d));
};

export const getAmenityById = async (id: string): Promise<Amenity | undefined> => {
    const docRef = doc(db, "amenities", id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docToType<Amenity>(docSnap) : undefined;
};

export const getAllFacilities = async (): Promise<Facility[]> => {
    const querySnapshot = await getDocs(collection(db, "facilities"));
    const facilities = querySnapshot.docs.map(d => docToType<Facility>(d));
    // In a real app, reviews and ratings might be aggregated or fetched separately
    return facilities;
};

export const getFacilityById = async (id: string): Promise<Facility | undefined> => {
    const docRef = doc(db, "facilities", id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docToType<Facility>(docSnap) : undefined;
};

export const getFacilitiesByOwnerId = async (ownerId: string): Promise<Facility[]> => {
    const q = query(collection(db, "facilities"), where("ownerId", "==", ownerId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(d => docToType<Facility>(d));
};

export const getAllUsers = async (): Promise<UserProfile[]> => {
    const querySnapshot = await getDocs(collection(db, "users"));
    return querySnapshot.docs.map(d => docToType<UserProfile>(d));
};

export const getUserById = async (userId: string): Promise<UserProfile | undefined> => {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docToType<UserProfile>(docSnap) : undefined;
};

export const getAllBookings = async (): Promise<Booking[]> => {
    const q = query(collection(db, "bookings"), orderBy("bookedAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(d => docToType<Booking>(d));
};

export const getBookingById = async (id: string): Promise<Booking | undefined> => {
    const docRef = doc(db, "bookings", id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docToType<Booking>(docSnap) : undefined;
};

export const getBookingsByUserId = async (userId: string): Promise<Booking[]> => {
    const q = query(collection(db, "bookings"), where("userId", "==", userId), orderBy("bookedAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(d => docToType<Booking>(d));
};

export const getAllEvents = async (): Promise<SportEvent[]> => {
    const q = query(collection(db, "events"), orderBy("startDate", "asc"));
    const querySnapshot = await getDocs(q);
    const events = await Promise.all(querySnapshot.docs.map(async d => {
        const eventData = docToType<SportEvent>(d);
        if (eventData.sportId) {
            const sport = await getSportById(eventData.sportId);
            if(sport) eventData.sport = sport;
        }
        return eventData;
    }));
    return events;
};

export const getEventById = async (id: string): Promise<SportEvent | undefined> => {
    const docRef = doc(db, "events", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return undefined;
    
    const eventData = docToType<SportEvent>(docSnap);
    if (eventData.sportId) {
        const sport = await getSportById(eventData.sportId);
        if(sport) eventData.sport = sport;
    }
    return eventData;
};

export const getAllMembershipPlans = async (): Promise<MembershipPlan[]> => {
    const q = query(collection(db, "membershipPlans"), orderBy("pricePerMonth", "asc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(d => docToType<MembershipPlan>(d));
};

export const getMembershipPlanById = async (id: string): Promise<MembershipPlan | undefined> => {
    const docRef = doc(db, "membershipPlans", id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docToType<MembershipPlan>(docSnap) : undefined;
};

export const getAllPricingRules = async (): Promise<PricingRule[]> => {
    const q = query(collection(db, "pricingRules"), orderBy("priority"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(d => docToType<PricingRule>(d));
};

export const getPricingRuleById = async (id: string): Promise<PricingRule | undefined> => {
    const docRef = doc(db, "pricingRules", id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docToType<PricingRule>(docSnap) : undefined;
};

export const getAllPromotionRules = async (): Promise<PromotionRule[]> => {
    const q = query(collection(db, "promotionRules"), orderBy("name"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(d => docToType<PromotionRule>(d));
};

export const getPromotionRuleById = async (id: string): Promise<PromotionRule | undefined> => {
    const docRef = doc(db, "promotionRules", id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docToType<PromotionRule>(docSnap) : undefined;
};


// --- DATA MANIPULATION FUNCTIONS ---

export const addFacility = async (facilityData: Omit<Facility, 'id'>): Promise<Facility> => {
    const docRef = await addDoc(collection(db, "facilities"), {
        ...facilityData,
        createdAt: serverTimestamp(),
    });
    return { id: docRef.id, ...facilityData };
};

export const updateFacility = async (facilityId: string, facilityData: Partial<Facility>): Promise<void> => {
    const docRef = doc(db, "facilities", facilityId);
    await updateDoc(docRef, {
        ...facilityData,
        updatedAt: serverTimestamp(),
    });
};

export const deleteFacility = async (facilityId: string): Promise<void> => {
    const docRef = doc(db, "facilities", facilityId);
    // In a real app with Firestore, you'd use Cloud Functions to handle cascading deletes of bookings, reviews, etc.
    // For now, we just delete the facility document.
    await deleteDoc(docRef);
};

export const addEvent = async (eventData: Omit<SportEvent, 'id'>): Promise<SportEvent> => {
    const docRef = await addDoc(collection(db, "events"), {
        ...eventData,
        createdAt: serverTimestamp(),
    });
    return { id: docRef.id, ...eventData };
};

export const updateEvent = async (eventId: string, eventData: Partial<SportEvent>): Promise<void> => {
    const docRef = doc(db, "events", eventId);
    await updateDoc(docRef, {
        ...eventData,
        updatedAt: serverTimestamp(),
    });
};

export const deleteEvent = async (eventId: string): Promise<void> => {
    const docRef = doc(db, "events", eventId);
    await deleteDoc(docRef);
};

export const addMembershipPlan = async (planData: Omit<MembershipPlan, 'id'>): Promise<MembershipPlan> => {
    const docRef = await addDoc(collection(db, "membershipPlans"), planData);
    return { id: docRef.id, ...planData };
};

export const updateMembershipPlan = async (planId: string, planData: Partial<MembershipPlan>): Promise<void> => {
    const docRef = doc(db, "membershipPlans", planId);
    await updateDoc(docRef, planData);
};

export const deleteMembershipPlan = async (planId: string): Promise<void> => {
    const docRef = doc(db, "membershipPlans", planId);
    await deleteDoc(docRef);
};

export const addPricingRule = async (ruleData: Omit<PricingRule, 'id'>): Promise<PricingRule> => {
    const docRef = await addDoc(collection(db, "pricingRules"), ruleData);
    return { id: docRef.id, ...ruleData };
};

export const updatePricingRule = async (ruleId: string, ruleData: Partial<PricingRule>): Promise<void> => {
    const docRef = doc(db, "pricingRules", ruleId);
    await updateDoc(docRef, ruleData);
};

export const deletePricingRule = async (ruleId: string): Promise<void> => {
    const docRef = doc(db, "pricingRules", ruleId);
    await deleteDoc(docRef);
};

export const addPromotionRule = async (ruleData: Omit<PromotionRule, 'id'>): Promise<PromotionRule> => {
    const docRef = await addDoc(collection(db, "promotionRules"), ruleData);
    return { id: docRef.id, ...ruleData };
};

export const updatePromotionRule = async (ruleId: string, ruleData: Partial<PromotionRule>): Promise<void> => {
    const docRef = doc(db, "promotionRules", ruleId);
    await updateDoc(docRef, ruleData);
};

export const deletePromotionRule = async (ruleId: string): Promise<void> => {
    const docRef = doc(db, "promotionRules", ruleId);
    await deleteDoc(docRef);
};

export const updateUser = async (userId: string, updates: Partial<UserProfile>): Promise<void> => {
    const docRef = doc(db, "users", userId);
    await updateDoc(docRef, updates);
};

export const addNotification = async (userId: string, notificationData: Omit<AppNotification, 'id' | 'userId' | 'createdAt' | 'isRead'>): Promise<AppNotification> => {
  const docRef = await addDoc(collection(db, `users/${userId}/notifications`), {
    ...notificationData,
    createdAt: serverTimestamp(),
    isRead: false,
  });
  return { ...notificationData, id: docRef.id, userId, createdAt: new Date().toISOString(), isRead: false };
};

// ... keep other mock data and functions if they are still needed for UI previews or logic not yet migrated
// For brevity, I'm omitting the mock data arrays that are now replaced by Firestore.
// You would typically have a separate script to seed your Firestore database with initial data.
export const mockUser = {
    id: 'user-admin',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '555-123-4567',
    profilePictureUrl: 'https://placehold.co/100x100.png?text=AJ',
    dataAiHint: "user avatar",
    role: 'Admin',
    status: 'Active',
    joinedAt: new Date().toISOString(),
} as UserProfile;
