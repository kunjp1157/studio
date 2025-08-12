

export interface MaintenanceSchedule {
  id: string;
  taskName: string;
  recurrenceInDays: number;
  lastPerformedDate: string; // ISO Date string
}

export interface Team {
  id: string;
  name: string;
  sport: Sport;
  captainId: string;
  memberIds: string[];
}

export interface Amenity {
  id: string;
  name: string;
  iconName?: string; 
}

export interface Sport {
  id: string;
  name: string;
  iconName?: string; 
}

export interface Review {
  id: string;
  facilityId: string;
  userId: string;
  userName: string; 
  userAvatar?: string; 
  isPublicProfile?: boolean;
  rating: number; 
  comment: string;
  createdAt: string; 
  bookingId?: string; 
}

export interface PricingRule {
  id: string;
  name: string;
  description?: string;
  daysOfWeek?: ('Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun')[];
  timeRange?: { start: string; end: string }; 
  dateRange?: { start: string; end: string }; 
  adjustmentType: 'percentage_increase' | 'percentage_decrease' | 'fixed_increase' | 'fixed_decrease' | 'fixed_price';
  value: number; 
  priority?: number; 
  isActive: boolean;
}

export interface PromotionRule {
  id: string;
  name: string;
  description?: string;
  code?: string; 
  discountType: 'percentage' | 'fixed_amount';
  discountValue: number; 
  startDate?: string; 
  endDate?: string; 
  usageLimit?: number; 
  usageLimitPerUser?: number; 
  isActive: boolean;
}

export interface RentalEquipment {
  id: string;
  name: string;
  description?: string;
  pricePerItem: number; 
  priceType: 'per_booking' | 'per_hour'; 
  stock: number;
  sportIds: string[]; // Link equipment to one or more sports
}

export interface FacilityOperatingHours {
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  open: string;
  close: string;
}

export interface BlockedSlot {
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  reason?: string;
}

export type PricingModel = 'per_hour_flat' | 'per_hour_per_person';

export interface SportPrice {
  sportId: string;
  price: number;
  pricingModel: PricingModel;
}

export interface Facility {
  id: string;
  name:string;
  type: 'Complex' | 'Court' | 'Field' | 'Studio' | 'Pool' | 'Box Cricket';
  address: string;
  city: string;
  location: string; 
  description: string;
  sports: Sport[];
  sportPrices: SportPrice[];
  amenities: Amenity[];
  operatingHours: FacilityOperatingHours[];
  pricingRulesApplied?: PricingRule[]; 
  rating: number; 
  reviews?: Review[]; 
  capacity?: number;
  isPopular?: boolean;
  isIndoor?: boolean; 
  dataAiHint?: string; 
  availableEquipment?: RentalEquipment[];
  ownerId?: string;
  blockedSlots?: BlockedSlot[];
  maintenanceSchedules?: MaintenanceSchedule[];
}

export interface TimeSlot {
  startTime: string; 
  endTime: string; 
  isAvailable: boolean;
}

export interface RentedItemInfo {
  equipmentId: string;
  name: string;
  quantity: number;
  priceAtBooking: number; 
  priceTypeAtBooking: 'per_booking' | 'per_hour';
  totalCost: number;
}

export interface AppliedPromotionInfo {
    code: string;
    discountAmount: number;
    description: string;
}

export interface Booking {
  id: string;
  userId: string;
  facilityId: string;
  facilityName: string; 
  dataAiHint?: string;
  sportId: string;
  sportName: string;
  date: string; 
  startTime: string; 
  endTime: string; 
  durationHours?: number; 
  numberOfGuests?: number; 
  baseFacilityPrice?: number; 
  equipmentRentalCost?: number; 
  appliedPromotion?: AppliedPromotionInfo; 
  totalPrice: number; 
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  bookedAt: string; 
  reviewed?: boolean; 
  rentedEquipment?: RentedItemInfo[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  iconName?: string;
  unlockedAt?: string; 
}

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface UserSkill {
  sportId: string;
  sportName: string;
  level: SkillLevel;
}

export type UserRole = 'Admin' | 'FacilityOwner' | 'User';
export type UserStatus = 'Active' | 'Suspended' | 'PendingApproval';


export interface UserProfile {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  profilePictureUrl?: string;
  dataAiHint?: string; 
  preferredSports?: Sport[];
  favoriteFacilities?: string[]; 
  membershipLevel?: 'Basic' | 'Premium' | 'Pro';
  loyaltyPoints?: number;
  achievements?: Achievement[];
  bio?: string;
  preferredPlayingTimes?: string; 
  skillLevels?: UserSkill[];
  role: UserRole;
  status: UserStatus;
  joinedAt: string; 
  teamIds?: string[];
  isProfilePublic?: boolean;
}

export interface AdminUser { 
  id: string;
  username: string;
  role: 'Admin' | 'Manager'; 
}

export interface ReportData {
  totalBookings: number;
  totalRevenue: number;
  facilityUsage: { facilityName: string; bookings: number }[];
  peakHours: { hour: string; bookings: number }[];
}

export interface MembershipPlan {
  id: string;
  name: string; 
  pricePerMonth: number;
  benefits: string[];
}

export interface SportEvent {
  id: string;
  name: string;
  facilityId: string;
  facilityName?: string;
  sport: Sport; 
  startDate: string; 
  endDate: string; 
  description: string;
  entryFee?: number;
  maxParticipants?: number;
  registeredParticipants: number;
}

export interface SearchFilters {
  searchTerm: string;
  sport: string;
  city?: string;
  location?: string;
  date?: Date;
  time?: string;
  priceRange?: [number, number];
  selectedAmenities?: string[];
  indoorOutdoor?: 'any' | 'indoor' | 'outdoor';
}

export type NotificationType = 'booking_confirmed' | 'booking_cancelled' | 'review_submitted' | 'reminder' | 'promotion' | 'general' | 'user_status_changed' | 'facility_approved' | 'waitlist_opening' | 'matchmaking_interest';

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string; 
  isRead: boolean;
  link?: string; 
  iconName?: string; 
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; 
  authorName: string;
  authorAvatarUrl?: string;
  publishedAt: string; 
  tags?: string[];
  isFeatured?: boolean;
  dataAiHint?: string;
}

export interface NotificationTemplate {
  type: NotificationType;
  label: string;
  description: string;
  emailEnabled: boolean;
  smsEnabled: boolean;
  emailSubject: string;
  emailBody: string;
  smsBody?: string;
}

export interface SiteSettings {
  siteName: string;
  defaultCurrency: 'USD' | 'EUR' | 'GBP' | 'INR';
  timezone: string;
  maintenanceMode: boolean;
  notificationTemplates?: NotificationTemplate[];
}

export interface WaitlistEntry {
    id: string;
    userId: string;
    facilityId: string;
    date: string; 
    startTime: string; 
    createdAt: string; 
}

export interface LfgRequest {
  id: string;
  userId: string;
  sportId: string;
  facilityId: string;
  facilityName: string;
  notes: string;
  createdAt: string; 
  status: 'open' | 'closed';
  interestedUserIds: string[];
  skillLevel?: 'Any' | SkillLevel;
  playersNeeded?: number;
  preferredTime?: string;
}

export interface Challenge {
  id: string;
  challengerId: string;
  challenger: UserProfile;
  opponentId?: string;
  opponent?: UserProfile;
  sport: Sport;
  facilityId: string;
  facilityName: string;
  proposedDate: string; // ISO string
  notes: string;
  status: 'open' | 'accepted' | 'completed' | 'cancelled';
  createdAt: string; // ISO string
}
