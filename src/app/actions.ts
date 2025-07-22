
'use server';

import { 
    getAllFacilities as dbGetAllFacilities,
    getAllUsers, 
    getAllBookings, 
    getSiteSettings,
    getFacilitiesByOwnerId,
    getEventById,
    getMembershipPlanById,
    getPricingRuleById,
    getPromotionRuleById,
    getAllEvents,
    getAllMembershipPlans,
    getAllPricingRules,
    getAllPromotionRules,
    getNotificationsForUser,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    getFacilityById,
    getSportById,
    getAmenityById,
    blockTimeSlot as dbBlockTimeSlot,
    unblockTimeSlot as dbUnblockTimeSlot
} from '@/lib/data';
import type { Facility, UserProfile, Booking, SiteSettings, Team, SportEvent, MembershipPlan, PricingRule, PromotionRule, AppNotification, Sport, BlockedSlot } from '@/lib/types';

// Note: With real-time listeners, many 'getAll' actions might become less necessary on the client,
// but they are kept for server-side operations or initial data hydration.

export async function getFacilitiesAction(): Promise<Facility[]> {
  const facilities = await dbGetAllFacilities();
  return facilities;
}

export async function getUsersAction(): Promise<UserProfile[]> {
  return getAllUsers();
}

export async function getAllBookingsAction(): Promise<Booking[]> {
  return getAllBookings();
}

export async function getSiteSettingsAction(): Promise<SiteSettings> {
    return getSiteSettings();
}

export async function getFacilitiesByOwnerIdAction(ownerId: string): Promise<Facility[]> {
    return getFacilitiesByOwnerId(ownerId);
}

export async function getAllEventsAction(): Promise<SportEvent[]> {
    return getAllEvents();
}

export async function getAllMembershipPlansAction(): Promise<MembershipPlan[]> {
    return getAllMembershipPlans();
}

export async function getAllPricingRulesAction(): Promise<PricingRule[]> {
    return getAllPricingRules();
}

export async function getAllPromotionRulesAction(): Promise<PromotionRule[]> {
    return getAllPromotionRules();
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

export async function getFacilityByIdAction(id: string): Promise<Facility | undefined> {
    return getFacilityById(id);
}

export async function blockTimeSlot(facilityId: string, ownerId: string, newBlock: BlockedSlot): Promise<boolean> {
    return dbBlockTimeSlot(facilityId, ownerId, newBlock);
}

export async function unblockTimeSlot(facilityId: string, ownerId: string, date: string, startTime: string): Promise<boolean> {
    return dbUnblockTimeSlot(facilityId, ownerId, date, startTime);
}
