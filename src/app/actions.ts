
'use server';

import { 
    getAllFacilities as dbGetAllFacilities,
    getFacilityById as dbGetFacilityById,
    getAllUsers as dbGetAllUsers, 
    getAllBookings as dbGetAllBookings, 
    getSiteSettings as dbGetSiteSettings,
    getFacilitiesByOwnerId as dbGetFacilitiesByOwnerId,
    getEventById as dbGetEventById,
    getAllEvents as dbGetAllEvents,
    getAllMembershipPlans as dbGetAllMembershipPlans,
    getAllPricingRules as dbGetAllPricingRules,
    getAllPromotionRules as dbGetAllPromotionRules,
    getNotificationsForUser,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    getBookingsByUserId,
    blockTimeSlot as dbBlockTimeSlot,
    unblockTimeSlot as dbUnblockTimeSlot,
    updateUser as dbUpdateUser,
} from '@/lib/data';
import type { Facility, UserProfile, Booking, SiteSettings, SportEvent, MembershipPlan, PricingRule, PromotionRule, AppNotification, BlockedSlot } from '@/lib/types';

export async function getFacilitiesAction(): Promise<Facility[]> {
  const facilities = await dbGetAllFacilities();
  return facilities;
}

export async function getFacilityByIdAction(id: string): Promise<Facility | undefined> {
    const facility = await dbGetFacilityById(id);
    return facility;
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
    return getNotificationsForUser(userId);
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

export async function blockTimeSlot(facilityId: string, ownerId: string, newBlock: BlockedSlot): Promise<boolean> {
    return dbBlockTimeSlot(facilityId, ownerId, newBlock);
}

export async function unblockTimeSlot(facilityId: string, ownerId: string, date: string, startTime: string): Promise<boolean> {
    return dbUnblockTimeSlot(facilityId, ownerId, date, startTime);
}

export async function updateUserAction(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | undefined> {
    return dbUpdateUser(userId, updates);
}
