
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
    getBookingsByUserId,
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
    toggleFavoriteFacility,
    getBookingsForFacilityOnDate as dbGetBookingsForFacilityOnDate,
    addBooking as dbAddBooking,
    addReview as dbAddReview,
} from '@/lib/data';
import type { Facility, UserProfile, Booking, SiteSettings, SportEvent, MembershipPlan, PricingRule, PromotionRule, AppNotification, BlockedSlot, Sport, Review } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { mockAmenities } from '@/lib/mock-data';

export async function getSports() {
    return dbGetAllSports();
}

export async function getFacilitiesAction(): Promise<Facility[]> {
  const facilities = await dbGetAllFacilities();
  return facilities;
}

export async function getFacilityByIdAction(id: string): Promise<Facility | undefined> {
    const facility = await dbGetFacilityById(id);
    return facility;
}

// Action to add a facility. It takes form data, processes it, and calls the DB function.
export async function addFacilityAction(facilityData: any): Promise<Facility> {
    const mockSports = await getSports();
    const sportData = (facilityData.sports || []).map((sportId: string) => mockSports.find(s => s.id === sportId)).filter(Boolean) as Sport[];
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
    const mockSports = await getSports();
    const existingFacility = await dbGetFacilityById(facilityData.id);
    const sportData = (facilityData.sports || []).map((sportId: string) => mockSports.find(s => s.id === sportId)).filter(Boolean) as Sport[];
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
  return dbGetAllUsers();
}

export async function getAllBookingsAction(): Promise<Booking[]> {
  return dbGetAllBookings();
}

export async function getSiteSettingsAction(): Promise<SiteSettings> {
    return dbGetSiteSettings();
}

export async function getFacilitiesByOwnerIdAction(ownerId: string): Promise<Facility[]> {
    return dbGetFacilitiesByOwnerId(ownerId);
}

export async function getAllEventsAction(): Promise<SportEvent[]> {
    return dbGetAllEvents();
}

export async function getEventByIdAction(id: string): Promise<SportEvent | undefined> {
    return dbGetEventById(id);
}

export async function getAllMembershipPlansAction(): Promise<MembershipPlan[]> {
    return dbGetAllMembershipPlans();
}

export async function getAllPricingRulesAction(): Promise<PricingRule[]> {
    return dbGetAllPricingRules();
}

export async function getAllPromotionRulesAction(): Promise<PromotionRule[]> {
    return dbGetAllPromotionRules();
}

export async function getNotificationsForUserAction(userId: string): Promise<AppNotification[]> {
    return dbGetNotificationsForUser(userId);
}

export async function markNotificationAsReadAction(userId: string, notificationId: string): Promise<void> {
    return markNotificationAsRead(userId, notificationId);
}

export async function markAllNotificationsAsReadAction(userId: string): Promise<void> {
    return markAllNotificationsAsRead(userId);
}

export async function getBookingsByUserIdAction(userId: string): Promise<Booking[]> {
    return getBookingsByUserId(userId);
}

export async function getBookingsForFacilityOnDateAction(facilityId: string, date: string): Promise<Booking[]> {
    return dbGetBookingsForFacilityOnDate(facilityId, date);
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
    const newBooking = await dbAddBooking(bookingData);
    revalidatePath('/account/bookings');
    revalidatePath(`/facilities/${bookingData.facilityId}`);
    revalidatePath('/admin/bookings');
    return newBooking;
}


export async function addNotificationAction(
  userId: string,
  notificationData: Omit<AppNotification, 'id' | 'userId' | 'createdAt' | 'isRead'>
): Promise<AppNotification> {
  return dbAddNotification(userId, notificationData);
}

export async function getAllSportsAction(): Promise<Sport[]> {
  return dbGetAllSports();
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
    const updatedUser = await toggleFavoriteFacility(userId, facilityId);
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
