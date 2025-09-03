
'use server';

import { 
    // IMPORTANT: Functions from here are NOT direct server actions.
    // They are helpers for the actual actions below.
    getStaticFacilities,
    getStaticSports,
    dbGetFacilityById,
    dbAddFacility,
    dbUpdateFacility,
    dbDeleteFacility,
    dbGetAllUsers, 
    dbGetAllBookings, 
    dbGetSiteSettings,
    dbGetFacilitiesByOwnerId,
    dbGetEventById,
    dbGetAllEvents,
    dbGetAllMembershipPlans,
    dbGetAllPricingRules,
    dbGetAllPromotionRules,
    dbGetNotificationsForUser,
    dbMarkNotificationAsRead,
    dbMarkAllNotificationsAsRead,
    dbGetBookingsByUserId,
    dbBlockTimeSlot,
    dbUnblockTimeSlot,
    dbUpdateUser,
    dbGetSportById,
    dbUpdateBooking,
    dbAddNotification,
    dbGetAllSports,
    dbAddSport,
    dbUpdateSport,
    dbDeleteSport,
    dbToggleFavoriteFacility,
    dbGetBookingsForFacilityOnDate,
    dbAddBooking,
    dbAddReview,
    dbGetBookingById,
    dbAddUser,
    dbGetPromotionRuleByCode,
    dbGetAllBlogPosts,
    dbGetBlogPostBySlug,
    dbRegisterForEvent,
} from '@/lib/data';
import type { Facility, UserProfile, Booking, SiteSettings, SportEvent, MembershipPlan, PricingRule, PromotionRule, AppNotification, BlockedSlot, Sport, Review, BlogPost } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { mockAmenities } from '@/lib/mock-data';
import { v4 as uuidv4 } from 'uuid';

export async function getSports(): Promise<Sport[]> {
    return getStaticSports();
}

export async function getFacilitiesAction(): Promise<Facility[]> {
  const facilities = getStaticFacilities();
  return facilities;
}

export async function getFacilityByIdAction(id: string): Promise<Facility | undefined> {
    const facility = await dbGetFacilityById(id);
    return facility;
}

export async function getBookingByIdAction(id: string): Promise<Booking | undefined> {
    const booking = await dbGetBookingById(id);
    return booking;
}

// Action to add a facility. It takes form data, processes it, and calls the DB function.
export async function addFacilityAction(facilityData: any): Promise<Facility> {
    const allSports = await getSports();
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
export async function updateFacilityAction(facilityData: any): Promise<Facility> {
    const allSports = await getSports();
    const existingFacility = await dbGetFacilityById(facilityData.id);
    const sportData = (facilityData.sports || []).map((sportId: string) => allSports.find(s => s.id === sportId)).filter(Boolean) as Sport[];
    const payload = {
      ...existingFacility, // Start with existing data to preserve reviews, etc.
      ...facilityData,
      sports: sportData,
      amenities: mockAmenities.filter(amenity => (facilityData.amenities || []).includes(amenity.id)),
    };
    const updatedFacility = await dbUpdateFacility(payload);
    revalidatePath(`/admin/facilities/${facilityData.id}/edit`);
    revalidatePath(`/owner/my-facilities/${facilityData.id}/edit`);
    revalidatePath('/admin/facilities');
    revalidatePath('/owner/my-facilities');
    revalidatePath('/facilities'); // Revalidate public facilities page
    return updatedFacility;
}

export async function deleteFacilityAction(facilityId: string): Promise<void> {
  await dbDeleteFacility(facilityId);
  revalidatePath('/admin/facilities');
  revalidatePath('/owner/my-facilities');
  revalidatePath('/facilities');
}

export async function getUsersAction(): Promise<UserProfile[]> {
  return await dbGetAllUsers();
}

export async function addUserAction(userData: { name: string; email: string; password?: string }): Promise<UserProfile> {
    const newUser = await dbAddUser(userData);
    revalidatePath('/admin/users');
    return newUser;
}

export async function getAllBookingsAction(): Promise<Booking[]> {
  return await dbGetAllBookings();
}

export async function getSiteSettingsAction(): Promise<SiteSettings> {
    return await dbGetSiteSettings();
}

export async function getFacilitiesByOwnerIdAction(ownerId: string): Promise<Facility[]> {
    return await dbGetFacilitiesByOwnerId(ownerId);
}

export async function getAllEventsAction(): Promise<SportEvent[]> {
    return await dbGetAllEvents();
}

export async function getEventByIdAction(id: string): Promise<SportEvent | undefined> {
    return await dbGetEventById(id);
}

export async function getAllMembershipPlansAction(): Promise<MembershipPlan[]> {
    return await dbGetAllMembershipPlans();
}

export async function getAllPricingRulesAction(): Promise<PricingRule[]> {
    return await dbGetAllPricingRules();
}

export async function getAllPromotionRulesAction(): Promise<PromotionRule[]> {
    return await dbGetAllPromotionRules();
}

export async function getPromotionRuleByCodeAction(code: string): Promise<PromotionRule | undefined> {
    return await dbGetPromotionRuleByCode(code);
}

export async function getNotificationsForUserAction(userId: string): Promise<AppNotification[]> {
    return await dbGetNotificationsForUser(userId);
}

export async function markNotificationAsReadAction(userId: string, notificationId: string): Promise<void> {
    return await dbMarkNotificationAsRead(userId, notificationId);
}

export async function markAllNotificationsAsReadAction(userId: string): Promise<void> {
    return await dbMarkAllNotificationsAsRead(userId);
}

export async function getBookingsByUserIdAction(userId: string): Promise<Booking[]> {
    return await dbGetBookingsByUserId(userId);
}

export async function getBookingsForFacilityOnDateAction(facilityId: string, date: string): Promise<Booking[]> {
    return await dbGetBookingsForFacilityOnDate(facilityId, date);
}

export async function blockTimeSlotAction(facilityId: string, ownerId: string, newBlock: BlockedSlot): Promise<boolean> {
    const success = await dbBlockTimeSlot(facilityId, ownerId, newBlock);
    if(success) {
        revalidatePath(`/owner/availability`);
        revalidatePath(`/facilities/${facilityId}`);
    }
    return success;
}

export async function unblockTimeSlotAction(facilityId: string, ownerId: string, date: string, startTime: string): Promise<boolean> {
    const success = await dbUnblockTimeSlot(facilityId, ownerId, date, startTime);
    if (success) {
        revalidatePath(`/owner/availability`);
        revalidatePath(`/facilities/${facilityId}`);
    }
    return success;
}

export async function updateUserAction(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | undefined> {
    const user = await dbUpdateUser(userId, updates);
    if (user) {
        revalidatePath(`/account/profile`);
        revalidatePath(`/admin/users`);
    }
    return user;
}

export async function updateBookingAction(bookingId: string, updates: Partial<Booking>): Promise<Booking | undefined> {
    const booking = await dbUpdateBooking(bookingId, updates);
    if (booking) {
        revalidatePath(`/account/bookings`);
        revalidatePath(`/account/bookings/${bookingId}/edit`);
        revalidatePath(`/admin/bookings`);
    }
    return booking;
}

export async function addBookingAction(bookingData: Omit<Booking, 'id' | 'bookedAt'>): Promise<Booking> {
    const bookingWithId = { ...bookingData, id: uuidv4() };
    const newBooking = await dbAddBooking(bookingWithId);
    revalidatePath('/account/bookings');
    revalidatePath(`/facilities/${bookingData.facilityId}`);
    revalidatePath('/admin/bookings');
    return newBooking;
}


export async function addNotificationAction(
  userId: string,
  notificationData: Omit<AppNotification, 'id' | 'userId' | 'createdAt' | 'isRead'>
): Promise<AppNotification> {
  return await dbAddNotification(userId, notificationData);
}

export async function getAllSportsAction(): Promise<Sport[]> {
  return await dbGetAllSports();
}

export async function addSportAction(sportData: Omit<Sport, 'id'>): Promise<Sport> {
  const newSport = await dbAddSport(sportData);
  revalidatePath('/admin/sports');
  return newSport;
}

export async function updateSportAction(sportId: string, sportData: Partial<Sport>): Promise<Sport> {
  const updatedSport = await dbUpdateSport(sportId, sportData);
  revalidatePath('/admin/sports');
  revalidatePath(`/admin/sports/${sportId}/edit`);
  return updatedSport;
}

export async function deleteSportAction(sportId: string): Promise<void> {
  await dbDeleteSport(sportId);
  revalidatePath('/admin/sports');
}

export async function toggleFavoriteFacilityAction(userId: string, facilityId: string): Promise<UserProfile | undefined> {
    const updatedUser = await dbToggleFavoriteFacility(userId, facilityId);
    if(updatedUser) {
        revalidatePath('/account/favorites');
        revalidatePath(`/facilities/${facilityId}`);
    }
    return updatedUser;
}

export async function addReviewAction(reviewData: Omit<Review, 'id' | 'createdAt' | 'userName' | 'userAvatar' | 'isPublicProfile'>): Promise<Review> {
    const newReview = await dbAddReview(reviewData);
    revalidatePath(`/facilities/${reviewData.facilityId}`);
    revalidatePath('/account/bookings'); // Revalidate bookings to show "Reviewed" status
    return newReview;
}

export async function getAllBlogPostsAction(): Promise<BlogPost[]> {
    return await dbGetAllBlogPosts();
}

export async function getBlogPostBySlugAction(slug: string): Promise<BlogPost | undefined> {
    return await dbGetBlogPostBySlug(slug);
}

export async function registerForEventAction(eventId: string): Promise<boolean> {
    return await dbRegisterForEvent(eventId);
}
