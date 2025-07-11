
'use server';

import { 
    getAllFacilities, 
    getAllUsers, 
    getAllBookings, 
    getSiteSettings,
    getBookingsByUserId,
    getFacilitiesByOwnerId,
    getEventById,
    getMembershipPlanById,
    getPricingRuleById,
    getPromotionRuleById,
    getAllEvents,
    getAllMembershipPlans,
    getAllPricingRules,
    getAllPromotionRules,
    getLoggedInUser as getMockLoggedInUser,
} from '@/lib/data';
import type { Facility, UserProfile, Booking, SiteSettings, Team, SportEvent, MembershipPlan, PricingRule, PromotionRule } from '@/lib/types';

// Note: With real-time listeners, many 'getAll' actions might become less necessary on the client,
// but they are kept for server-side operations or initial data hydration.

export async function getFacilitiesAction(): Promise<Facility[]> {
  return getAllFacilities();
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

export async function getBookingsByUserIdAction(userId: string): Promise<Booking[]> {
  return getBookingsByUserId(userId);
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

export async function getLoggedInUser(): Promise<UserProfile | null> {
    return getMockLoggedInUser();
}
