
'use server';

import { 
    dbGetAllFacilities,
    getAllSportsAction as dbGetAllSports,
    dbGetFacilityById,
    dbAddFacility,
    dbUpdateFacility,
    dbDeleteFacility,
    dbGetAllUsers, 
    dbGetAllBookings, 
    getSiteSettings,
    dbGetFacilitiesByOwnerId,
    getEventById,
    getAllEventsAction as getAllEvents,
    dbGetEventsByFacilityIds,
    getAllMembershipPlansAction as getAllMembershipPlans,
    dbGetMembershipPlanById,
    getAllPricingRulesAction as getAllPricingRules,
    getPricingRuleById,
    getAllPromotionRulesAction as getAllPromotionRules,
    dbGetNotificationsForUser,
    dbMarkNotificationAsRead,
    dbMarkAllNotificationsAsRead,
    dbGetBookingsByUserId,
    blockTimeSlot as dbBlockTimeSlot,
    unblockTimeSlot as dbUnblockTimeSlot,
    dbUpdateUser,
    dbGetSportById,
    dbUpdateBooking,
    dbAddNotification,
    dbToggleFavoriteFacility,
    dbGetBookingsForFacilityOnDate,
    dbAddBooking,
    dbAddReview,
    dbGetBookingById,
    dbAddUser,
    getPromotionRuleByCode,
    getAllBlogPostsAction as getAllBlogPosts,
    getBlogPostBySlug,
    registerForEvent,
    dbCreateTeam,
    dbGetTeamsByUserId,
    dbGetTeamById,
    dbLeaveTeam,
    dbRemoveUserFromTeam,
    dbTransferCaptaincy,
    dbDeleteTeam,
    dbGetOpenLfgRequests,
    dbCreateLfgRequest,
    dbExpressInterestInLfg,
    dbGetOpenChallenges,
    dbCreateChallenge,
    dbAcceptChallenge,
    getAllAmenitiesAction as dbGetAllAmenities,
    addSportAction as dbAddSport,
    dbUpdateSport,
    dbDeleteSport,
    dbGetUserById,
    dbAddMembershipPlan,
    dbUpdateMembershipPlan,
    deleteMembershipPlan as dbDeleteMembershipPlan,
    addPricingRule,
    updatePricingRule,
    getLfgRequestsByFacilityIds as dbGetLfgRequestsByFacilityIds,
    getChallengesByFacilityIds as dbGetChallengesByFacilityIds,
    deleteEvent as dbDeleteEvent,
    updateEventAction as dbUpdateEvent,
    addEventAction as dbAddEvent,
    deletePricingRule as dbDeletePricingRule,
    deletePromotionRule as dbDeletePromotionRule,
    updatePromotionRule as dbUpdatePromotionRule,
    addPromotionRule as dbAddPromotionRule,
    getPricingRulesByFacilityIdsAction,
    getPromotionRuleById
} from '@/lib/data';
import type { Facility, UserProfile, Booking, SiteSettings, SportEvent, MembershipPlan, PricingRule, PromotionRule, AppNotification, BlockedSlot, Sport, Review, BlogPost, LfgRequest, Challenge, Team, Amenity } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import twilio from 'twilio';

// This function now lives in actions.ts, a server-only file.
export async function sendBookingConfirmationSms(booking: Booking): Promise<void> {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env;
  
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    console.warn("[SMS] Twilio credentials are not set in .env. Skipping SMS.");
    return;
  }
  
  const phone = booking.phoneNumber;
  if (!phone) {
    console.log(`[SMS] Could not send SMS for booking ${booking.id}: No phone number provided.`);
    return;
  }

  const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  const user = booking.userId ? await dbGetUserById(booking.userId) : null;
  const userName = user ? user.name : 'Guest';
  const message = `Hi ${userName}, your booking for ${booking.sportName} at ${booking.facilityName} is confirmed. View details: /account/bookings/${booking.id}/receipt`;

  try {
    const response = await client.messages.create({
      body: message,
      from: TWILIO_PHONE_NUMBER,
      to: phone, // Make sure the phone number includes the country code, e.g., +91...
    });
    console.log(`[SMS] Message sent to ${phone}. SID: ${response.sid}`);
  } catch (error) {
    console.error("[SMS] Failed to send message:", error);
  }
}

export async function getSportsAction(): Promise<Sport[]> {
    return await dbGetAllSports();
}

export async function getFacilitiesAction(): Promise<Facility[]> {
  const facilities = await dbGetAllFacilities();
  revalidatePath('/facilities');
  return facilities;
}

export async function getFacilityByIdAction(id: string): Promise<Facility | undefined> {
    return await dbGetFacilityById(id);
}

export async function getBookingByIdAction(id: string): Promise<Booking | undefined> {
    const booking = await dbGetBookingById(id);
    return booking;
}

export async function addFacilityAction(facilityData: any): Promise<Facility> {
    const newFacility = await dbAddFacility(facilityData);
    revalidatePath('/admin/facilities');
    revalidatePath('/owner/my-facilities');
    revalidatePath('/facilities');
    return newFacility;
}

export async function updateFacilityAction(facilityData: any): Promise<Facility> {
    const updatedFacility = await dbUpdateFacility(facilityData);
    revalidatePath(`/admin/facilities/${facilityData.id}/edit`);
    revalidatePath(`/owner/my-facilities/${facilityData.id}/edit`);
    revalidatePath('/admin/facilities');
    revalidatePath('/owner/my-facilities');
    revalidatePath('/facilities');
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

export async function getUserByIdAction(id: string): Promise<UserProfile | undefined> {
  return await dbGetUserById(id);
}

export async function addUserAction(userData: { name: string; email: string; password?: string }): Promise<UserProfile> {
    const existingUser = await query('SELECT id FROM users WHERE email = ?', [userData.email]);
    if ((existingUser[0] as any[]).length > 0) {
        throw new Error('A user with this email already exists.');
    }
    const newUser = await dbAddUser(userData);
    revalidatePath('/admin/users');
    revalidatePath('/leaderboard');
    return newUser;
}

export async function getAllBookingsAction(): Promise<Booking[]> {
  return await dbGetAllBookings();
}

export async function getSiteSettingsAction(): Promise<SiteSettings> {
    return getSiteSettings();
}

export async function getFacilitiesByOwnerIdAction(ownerId: string): Promise<Facility[]> {
    return await dbGetFacilitiesByOwnerId(ownerId);
}

export async function getAllEventsAction(): Promise<SportEvent[]> {
    return await getAllEvents();
}

export async function getEventByIdAction(id: string): Promise<SportEvent | undefined> {
    return await getEventById(id);
}

export async function getEventsByFacilityIdsAction(facilityIds: string[]): Promise<SportEvent[]> {
    return await dbGetEventsByFacilityIds(facilityIds);
}

export async function getAllMembershipPlansAction(): Promise<MembershipPlan[]> {
    return await getAllMembershipPlans();
}

export async function getMembershipPlanByIdAction(id: string): Promise<MembershipPlan | undefined> {
    return await dbGetMembershipPlanById(id);
}

export async function addMembershipPlanAction(data: Omit<MembershipPlan, 'id'>): Promise<void> {
    await dbAddMembershipPlan(data);
    revalidatePath('/admin/memberships');
    revalidatePath('/memberships');
}

export async function updateMembershipPlanAction(data: MembershipPlan): Promise<void> {
    await dbUpdateMembershipPlan(data);
    revalidatePath('/admin/memberships');
    revalidatePath('/memberships');
}
export async function deleteMembershipPlan(id: string): Promise<void> {
    await dbDeleteMembershipPlan(id);
    revalidatePath('/admin/memberships');
}


export async function getAllPricingRulesAction(): Promise<PricingRule[]> {
    return await getAllPricingRules();
}

export async function addPricingRuleAction(ruleData: Omit<PricingRule, 'id'>): Promise<void> {
    await addPricingRule(ruleData);
    revalidatePath('/admin/pricing');
    revalidatePath('/owner/pricing');
}

export async function updatePricingRuleAction(ruleData: PricingRule): Promise<void> {
    await updatePricingRule(ruleData);
    revalidatePath('/admin/pricing');
    revalidatePath('/owner/pricing');
}

export async function deletePricingRule(id: string): Promise<void> {
    await dbDeletePricingRule(id);
    revalidatePath('/admin/pricing');
    revalidatePath('/owner/pricing');
}


export async function getAllPromotionRulesAction(): Promise<PromotionRule[]> {
    return await getAllPromotionRules();
}

export async function getPromotionRuleByCodeAction(code: string): Promise<PromotionRule | undefined> {
    return await getPromotionRuleByCode(code);
}
export async function addPromotionRuleAction(data: Omit<PromotionRule, 'id'>): Promise<void> {
    await dbAddPromotionRule(data);
    revalidatePath('/admin/promotions');
}
export async function updatePromotionRuleAction(data: PromotionRule): Promise<void> {
    await dbUpdatePromotionRule(data);
    revalidatePath('/admin/promotions');
}
export async function deletePromotionRule(id: string): Promise<void> {
    await dbDeletePromotionRule(id);
    revalidatePath('/admin/promotions');
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

export async function blockTimeSlot(facilityId: string, ownerId: string, newBlock: BlockedSlot): Promise<boolean> {
    const success = await dbBlockTimeSlot(facilityId, ownerId, newBlock);
    if(success) {
        revalidatePath(`/owner/availability`);
        revalidatePath(`/facilities/${facilityId}`);
    }
    return success;
}

export async function unblockTimeSlot(facilityId: string, ownerId: string, date: string, startTime: string): Promise<boolean> {
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
        revalidatePath(`/leaderboard`);
    }
    return user;
}

export async function requestOwnerRoleAction(userId: string): Promise<UserProfile | undefined> {
    const user = await dbUpdateUser(userId, { status: 'PendingApproval' });
    if(user) {
        revalidatePath('/account/profile');
        revalidatePath('/admin/users');
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
    const bookingWithTime: Omit<Booking, 'id'> = { ...bookingData, bookedAt: new Date().toISOString().slice(0, 19).replace('T', ' ') };
    const newBooking = await dbAddBooking(bookingWithTime);
    
    if (newBooking.userId) {
        const user = await dbGetUserById(newBooking.userId);
        if (user && newBooking.phoneNumber && newBooking.phoneNumber !== user.phone) {
            await dbUpdateUser(newBooking.userId, { phone: newBooking.phoneNumber });
        }
        await addNotificationAction(newBooking.userId, {
            type: 'booking_confirmed',
            title: 'Booking Confirmed!',
            message: `Your booking for ${newBooking.facilityName} is confirmed.`,
            link: `/account/bookings/${newBooking.id}/receipt`,
            iconName: 'CheckCircle',
        });
    }

    if (newBooking.phoneNumber) {
      await sendBookingConfirmationSms(newBooking);
    }
    
    revalidatePath('/account/bookings');
    revalidatePath(`/facilities/${bookingData.facilityId}`);
    revalidatePath('/admin/bookings');
    revalidatePath('/owner/dashboard');
    revalidatePath('/owner/my-bookings');
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

export async function getAllAmenitiesAction(): Promise<Amenity[]> {
  return await dbGetAllAmenities();
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
export async function deleteEvent(id: string): Promise<void> {
    await dbDeleteEvent(id);
    revalidatePath('/admin/events');
}
export async function updateEventAction(eventData: SportEvent): Promise<void> {
    await dbUpdateEvent(eventData);
    revalidatePath(`/admin/events/${eventData.id}/edit`);
    revalidatePath('/admin/events');
}
export async function addEventAction(data: Omit<SportEvent, 'id' | 'sport' | 'registeredParticipants'>): Promise<void> {
    await dbAddEvent(data);
    revalidatePath('/admin/events');
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
    revalidatePath('/account/bookings');
    return newReview;
}

export async function getAllBlogPostsAction(): Promise<BlogPost[]> {
    return await getAllBlogPosts();
}

export async function getBlogPostBySlugAction(slug: string): Promise<BlogPost | undefined> {
    return await getBlogPostBySlug(slug);
}

export async function registerForEventAction(eventId: string, userId: string): Promise<boolean> {
    const success = await registerForEvent(eventId);
    if (success) {
      const event = await getEventById(eventId);
      if (event) {
         await addNotificationAction(userId, {
            type: 'general',
            title: 'Event Registration Confirmed',
            message: `You are now registered for ${event.name}.`,
            link: `/events/${event.id}`,
            iconName: 'Ticket'
        });
      }
      revalidatePath(`/events/${eventId}`);
    }
    return success;
}

// Team Actions
export async function createTeamAction(data: { name: string; sportId: string; captainId: string }): Promise<Team> {
    const newTeam = await dbCreateTeam(data);
    revalidatePath('/account/teams');
    return newTeam;
}

export async function getTeamsByUserIdAction(userId: string): Promise<Team[]> {
    return await dbGetTeamsByUserId(userId);
}

export async function getTeamByIdAction(teamId: string): Promise<Team | undefined> {
    return await dbGetTeamById(teamId);
}

export async function leaveTeamAction(teamId: string, userId: string): Promise<boolean> {
    const success = await dbLeaveTeam(teamId, userId);
    revalidatePath('/account/teams');
    return success;
}

export async function removeUserFromTeamAction(teamId: string, memberIdToRemove: string, currentUserId: string): Promise<void> {
    await dbRemoveUserFromTeam(teamId, memberIdToRemove, currentUserId);
    revalidatePath(`/account/teams/${teamId}/manage`);
}

export async function transferCaptaincyAction(teamId: string, newCaptainId: string, currentUserId: string): Promise<void> {
    await dbTransferCaptaincy(teamId, newCaptainId, currentUserId);
    revalidatePath(`/account/teams/${teamId}/manage`);
    revalidatePath('/account/teams');
}

export async function deleteTeamAction(teamId: string, currentUserId: string): Promise<void> {
    await dbDeleteTeam(teamId, currentUserId);
    revalidatePath('/account/teams');
}


// LFG & Challenge Actions
export async function getOpenLfgRequestsAction(): Promise<LfgRequest[]> {
    return await dbGetOpenLfgRequests();
}

export async function getLfgRequestsByFacilityIdsAction(facilityIds: string[]): Promise<LfgRequest[]> {
    return await dbGetLfgRequestsByFacilityIds(facilityIds);
}

export async function getChallengesByFacilityIdsAction(facilityIds: string[]): Promise<Challenge[]> {
    return await dbGetChallengesByFacilityIds(facilityIds);
}

export async function createLfgRequestAction(data: Omit<LfgRequest, 'id'|'createdAt'|'status'|'interestedUserIds'>): Promise<LfgRequest> {
    const newRequest = await dbCreateLfgRequest(data);
    revalidatePath('/matchmaking');
    return newRequest;
}

export async function expressInterestInLfgAction(lfgId: string, userId: string): Promise<LfgRequest | undefined> {
    const updatedRequest = await dbExpressInterestInLfg(lfgId, userId);
    if(updatedRequest) {
        revalidatePath('/matchmaking');
    }
    return updatedRequest;
}

export async function getOpenChallengesAction(): Promise<Challenge[]> {
    return await dbGetOpenChallenges();
}

export async function createChallengeAction(data: Omit<Challenge, 'id'|'challenger'|'sport'|'createdAt'|'status'>): Promise<Challenge> {
    const newChallenge = await dbCreateChallenge(data as any);
    revalidatePath('/challenges');
    return newChallenge;
}

export async function acceptChallengeAction(challengeId: string, opponentId: string): Promise<Challenge | undefined> {
    const updatedChallenge = await dbAcceptChallenge(challengeId, opponentId);
    if (updatedChallenge) {
        revalidatePath('/challenges');
    }
    return updatedChallenge;
}
