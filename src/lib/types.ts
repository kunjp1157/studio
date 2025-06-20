

export interface Amenity {
  id: string;
  name: string;
  icon?: React.ElementType; // Optional: Lucide icon component
}

export interface Sport {
  id: string;
  name: string;
  icon?: React.ElementType; // Optional: Lucide icon component
  imageUrl?: string; // Optional: URL for a representative image of the sport
  imageDataAiHint?: string; // Optional: AI hint for the sport's image
}

export interface Review {
  id: string;
  facilityId: string;
  userId: string;
  userName: string; // Denormalized for easy display
  userAvatar?: string; // Optional, denormalized
  rating: number; // 1-5
  comment: string;
  createdAt: string; // ISO date string
  bookingId?: string; // To link review to a specific booking
}

export interface PricingRule {
  id: string;
  name: string;
  description?: string;
  daysOfWeek?: ('Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun')[];
  timeRange?: { start: string; end: string }; // e.g., { start: "17:00", end: "21:00" }
  dateRange?: { start: string; end: string }; // e.g., { start: "2024-12-20", end: "2024-12-26" } for holiday pricing
  adjustmentType: 'percentage_increase' | 'percentage_decrease' | 'fixed_increase' | 'fixed_decrease' | 'fixed_price';
  value: number; // The actual adjustment value or fixed price
  priority?: number; // To handle overlapping rules, lower numbers apply first
  isActive: boolean;
}

export interface PromotionRule {
  id: string;
  name: string;
  description?: string;
  code?: string; // The actual discount code a user would enter, e.g., "SUMMER20"
  discountType: 'percentage' | 'fixed_amount';
  discountValue: number; // e.g., 20 for 20% or 5 for $5 off
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
  usageLimit?: number; // How many times this promotion can be used in total. 0 or undefined for unlimited.
  usageLimitPerUser?: number; // How many times a single user can use this promotion. 0 or undefined for unlimited.
  isActive: boolean;
}

export interface RentalEquipment {
  id: string;
  facilityId: string; 
  name: string;
  description?: string;
  pricePerItem: number; 
  priceType: 'per_booking' | 'per_hour'; 
  imageUrl?: string;
  dataAiHint?: string;
  stock: number; 
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

export interface Facility {
  id: string;
  name:string;
  type: 'Complex' | 'Court' | 'Field' | 'Studio' | 'Pool';
  address: string;
  location: string; 
  latitude?: number; 
  longitude?: number; 
  description: string;
  images: string[]; 
  sports: Sport[];
  amenities: Amenity[];
  operatingHours: FacilityOperatingHours[];
  pricePerHour: number; 
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
}

export interface TimeSlot {
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
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
  facilityImage: string; 
  dataAiHint?: string; 
  date: string; // "YYYY-MM-DD"
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
  durationHours?: number; 
  numberOfGuests?: number; 
  baseFacilityPrice?: number; 
  equipmentRentalCost?: number; 
  appliedPromotion?: AppliedPromotionInfo; 
  totalPrice: number; 
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  bookedAt: string; // ISO date string
  reviewed?: boolean; 
  rentedEquipment?: RentedItemInfo[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon?: React.ElementType;
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
  joinedAt: string; // ISO date string
}

export interface AdminUser { // This might be redundant if UserProfile.role handles it
  id: string;
  username: string;
  role: 'Admin' | 'Manager'; // Simplified for specific admin roles if needed
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
  sport: Sport; 
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  description: string;
  entryFee?: number;
  maxParticipants?: number;
  registeredParticipants: number;
  imageUrl?: string;
  imageDataAiHint?: string;
}

export interface SearchFilters {
  searchTerm: string;
  sport: string;
  location: string;
  date?: Date;
  priceRange?: [number, number];
  selectedAmenities?: string[];
  indoorOutdoor?: 'any' | 'indoor' | 'outdoor';
}

export type NotificationType = 'booking_confirmed' | 'booking_cancelled' | 'review_submitted' | 'reminder' | 'promotion' | 'general' | 'user_status_changed' | 'facility_approved';

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string; // ISO date string
  isRead: boolean;
  link?: string; 
  icon?: React.ElementType; 
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; 
  imageUrl?: string;
  imageAlt?: string;
  authorName: string;
  authorAvatarUrl?: string;
  publishedAt: string; // ISO date string
  tags?: string[];
  isFeatured?: boolean;
  dataAiHint?: string;
}

    
