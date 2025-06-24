
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
    getPromotionRuleById
} from '@/lib/data';
import type { Facility, UserProfile, Booking, SiteSettings, Team, SportEvent, MembershipPlan, PricingRule, PromotionRule } from '@/lib/types';

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
