
'use server';

import { 
    getAllFacilities as dbGetAllFacilities,
    getFacilityById as dbGetFacilityById,
    addFacility as dbAddFacility,
    updateFacility as dbUpdateFacility,
    deleteFacility as dbDeleteFacility,
    getAllUsers as dbGetAllUsers, 
    getAllBookings as dbGetAllBookings, 
    getSiteSettings as dbGetSiteSettings,
    getFacilitiesByOwnerId as dbGetFacilitiesByOwnerId,
    getEventById as dbGetEventById,
    getAllEvents as dbGetAllEvents,
    getAllMembershipPlans as dbGetAllMembershipPlans,
    getAllPricingRules as dbGetAllPricingRules,
    getAllPromotionRules as dbGetAllPromotionRules,
    getNotificationsForUser as dbGetNotificationsForUser,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    getBookingsByUserId as dbGetBookingsByUserId,
    blockTimeSlot as dbBlockTimeSlot,
    unblockTimeSlot as dbUnblockTimeSlot,
    updateUser as dbUpdateUser,
    getSportById,
    updateBooking as dbUpdateBooking,
    addNotification as dbAddNotification,
    getAllSports as dbGetAllSports,
    addSport as dbAddSport,
    updateSport as dbUpdateSport,
    deleteSport as dbDeleteSport,
    toggleFavoriteFacility as dbToggleFavoriteFacility,
    getBookingsForFacilityOnDate as dbGetBookingsForFacilityOnDate,
    addBooking as dbAddBooking,
    addReview as dbAddReview,
    getBookingById as dbGetBookingById,
    addUser as dbAddUser,
    getPromotionRuleByCode as dbGetPromotionRuleByCode,
    getAllBlogPosts as dbGetAllBlogPosts,
    getBlogPostBySlug as dbGetBlogPostBySlug,
    registerForEvent,
    getStaticFacilities,
    getStaticSports,
} from '@/lib/data';
import type { Facility, UserProfile, Booking, SiteSettings, SportEvent, MembershipPlan, PricingRule, PromotionRule, AppNotification, BlockedSlot, Sport, Review, BlogPost } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { mockAmenities } from '@/lib/mock-data';

export function getSports() {
    return getStaticSports();
}

export function getFacilitiesAction(): Facility[] {
  const facilities = getStaticFacilities();
  return facilities;
}

export function getFacilityByIdAction(id: string): Facility | undefined {
    const facility = dbGetFacilityById(id);
    return facility;
}

export function getBookingByIdAction(id: string): Promise<Booking | undefined> {
    const booking = dbGetBookingById(id);
    return booking;
}

// Action to add a facility. It takes form data, processes it, and calls the DB function.
export async function addFacilityAction(facilityData: any): Promise<Facility> {
    const allSports = getSports();
    const sportData = (facilityData.sports || []).map((sportId: string) => allSports.find(s => s.id === sportId)).filter(Boolean) as Sport[];
    const payload = {
      ...facilityData,
      sports: sportData,
      amenities: mockAmenities.filter(amenity => (facilityData.amenities || []).includes(amenity.id)),
      reviews: [],
      blockedSlots: [],
    };
    const newFacility = await dbAddFacility(payload);
    revalidatePath('/admin/facilities');
    revalidatePath('/owner/my-facilities');
    revalidatePath('/facilities'); // Revalidate public facilities page
    return newFacility;
}

// Action to update a facility. It takes form data, processes it, and calls the DB function.
export function updateFacilityAction(facilityData: any): Facility {
    const allSports = getSports();
    const existingFacility = dbGetFacilityById(facilityData.id);
    const sportData = (facilityData.sports || []).map((sportId: string) => allSports.find(s => s.id === sportId)).filter(Boolean) as Sport[];
    const payload = {
      ...existingFacility, // Start with existing data to preserve reviews, etc.
      ...facilityData,
      sports: sportData,
      amenities: mockAmenities.filter(amenity => (facilityData.amenities || []).includes(amenity.id)),
    };
    const updatedFacility = dbUpdateFacility(payload);
    revalidatePath(`/admin/facilities/${facilityData.id}/edit`);
    revalidatePath(`/owner/my-facilities/${facilityData.id}/edit`);
    revalidatePath('/admin/facilities');
    revalidatePath('/owner/my-facilities');
    revalidatePath('/facilities'); // Revalidate public facilities page
    return updatedFacility;
}

export function deleteFacilityAction(facilityId: string): void {
  dbDeleteFacility(facilityId);
  revalidatePath('/admin/facilities');
  revalidatePath('/owner/my-facilities');
  revalidatePath('/facilities');
}

export function getUsersAction(): Promise<UserProfile[]> {
  return dbGetAllUsers();
}

export async function addUserAction(userData: { name: string; email: string; password?: string }): Promise<UserProfile> {
    const newUser = await dbAddUser(userData);
    revalidatePath('/admin/users');
    return newUser;
}

export function getAllBookingsAction(): Promise<Booking[]> {
  return dbGetAllBookings();
}

export function getSiteSettingsAction(): SiteSettings {
    return dbGetSiteSettings();
}

export function getFacilitiesByOwnerIdAction(ownerId: string): Facility[] {
    return dbGetFacilitiesByOwnerId(ownerId);
}

export function getAllEventsAction(): Promise<SportEvent[]> {
    return dbGetAllEvents();
}

export function getEventByIdAction(id: string): Promise<SportEvent | undefined> {
    return dbGetEventById(id);
}

export function getAllMembershipPlansAction(): MembershipPlan[] {
    return dbGetAllMembershipPlans();
}

export function getAllPricingRulesAction(): PricingRule[] {
    return dbGetAllPricingRules();
}

export function getAllPromotionRulesAction(): PromotionRule[] {
    return dbGetAllPromotionRules();
}

export function getPromotionRuleByCodeAction(code: string): PromotionRule | undefined {
    return dbGetPromotionRuleByCode(code);
}

export function getNotificationsForUserAction(userId: string): AppNotification[] {
    return dbGetNotificationsForUser(userId);
}

export function markNotificationAsReadAction(userId: string, notificationId: string): void {
    return markNotificationAsRead(userId, notificationId);
}

export function markAllNotificationsAsReadAction(userId: string): void {
    return markAllNotificationsAsRead(userId);
}

export function getBookingsByUserIdAction(userId: string): Promise<Booking[]> {
    return dbGetBookingsByUserId(userId);
}

export function getBookingsForFacilityOnDateAction(facilityId: string, date: string): Promise<Booking[]> {
    return dbGetBookingsForFacilityOnDate(facilityId, date);
}

export function blockTimeSlotAction(facilityId: string, ownerId: string, newBlock: BlockedSlot): boolean {
    const success = dbBlockTimeSlot(facilityId, ownerId, newBlock);
    if(success) {
        revalidatePath(`/owner/availability`);
        revalidatePath(`/facilities/${facilityId}`);
    }
    return success;
}

export function unblockTimeSlotAction(facilityId: string, ownerId: string, date: string, startTime: string): boolean {
    const success = dbUnblockTimeSlot(facilityId, ownerId, date, startTime);
    if (success) {
        revalidatePath(`/owner/availability`);
        revalidatePath(`/facilities/${facilityId}`);
    }
    return success;
}

export function updateUserAction(userId: string, updates: Partial<UserProfile>): UserProfile | undefined {
    const user = dbUpdateUser(userId, updates);
    if (user) {
        revalidatePath(`/account/profile`);
        revalidatePath(`/admin/users`);
    }
    return user;
}

export function updateBookingAction(bookingId: string, updates: Partial<Booking>): Promise<Booking | undefined> {
    const booking = dbUpdateBooking(bookingId, updates);
    if (booking) {
        revalidatePath(`/account/bookings`);
        revalidatePath(`/account/bookings/${bookingId}/edit`);
        revalidatePath(`/admin/bookings`);
    }
    return booking;
}

export function addBookingAction(bookingData: Omit<Booking, 'id' | 'bookedAt'>): Promise<Booking> {
    const newBooking = dbAddBooking(bookingData);
    revalidatePath('/account/bookings');
    revalidatePath(`/facilities/${bookingData.facilityId}`);
    revalidatePath('/admin/bookings');
    return newBooking;
}


export function addNotificationAction(
  userId: string,
  notificationData: Omit<AppNotification, 'id' | 'userId' | 'createdAt' | 'isRead'>
): AppNotification {
  return dbAddNotification(userId, notificationData);
}

export function getAllSportsAction(): Sport[] {
  return dbGetAllSports();
}

export function addSportAction(sportData: Omit<Sport, 'id'>): Promise<Sport> {
  const newSport = dbAddSport(sportData);
  revalidatePath('/admin/sports');
  return newSport;
}

export function updateSportAction(sportId: string, sportData: Partial<Sport>): Promise<Sport> {
  const updatedSport = dbUpdateSport(sportId, sportData);
  revalidatePath('/admin/sports');
  revalidatePath(`/admin/sports/${sportId}/edit`);
  return updatedSport;
}

export function deleteSportAction(sportId: string): Promise<void> {
  dbDeleteSport(sportId);
  revalidatePath('/admin/sports');
  return Promise.resolve();
}

export function toggleFavoriteFacilityAction(userId: string, facilityId: string): UserProfile | undefined {
    const updatedUser = dbToggleFavoriteFacility(userId, facilityId);
    if(updatedUser) {
        revalidatePath('/account/favorites');
        revalidatePath(`/facilities/${facilityId}`);
    }
    return updatedUser;
}

export function addReviewAction(reviewData: Omit<Review, 'id' | 'createdAt' | 'userName' | 'userAvatar' | 'isPublicProfile'>): Promise<Review> {
    const newReview = dbAddReview(reviewData);
    revalidatePath(`/facilities/${reviewData.facilityId}`);
    revalidatePath('/account/bookings'); // Revalidate bookings to show "Reviewed" status
    return newReview;
}

export function getAllBlogPostsAction(): Promise<BlogPost[]> {
    return dbGetAllBlogPosts();
}

export function getBlogPostBySlugAction(slug: string): Promise<BlogPost | undefined> {
    return dbGetBlogPostBySlug(slug);
}

export function registerForEventAction(eventId: string): boolean {
    return registerForEvent(eventId);
}
