
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
  // Future: facilityIds?: string[]; sportIds?: string[]; appliesToMembershipLevel?: string;
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
  usageLimit?: number; // How many times this promotion can be used in total
  usageLimitPerUser?: number; // How many times a single user can use this promotion
  isActive: boolean;
  // Conditions for applicability could be added later, e.g., specific facilities, sports, user segments, min booking value
}

export interface RentalEquipment {
  id: string;
  facilityId: string; // To which facility this specific stock belongs, or could be global if managed centrally
  name: string;
  description?: string;
  pricePerItem: number; // Price per booking or per hour/session
  priceType: 'per_booking' | 'per_hour'; // To clarify pricing model
  imageUrl?: string;
  dataAiHint?: string;
  stock: number; // Available quantity
}

export interface FacilityOperatingHours {
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  open: string;
  close: string;
}
export interface Facility {
  id: string;
  name:string;
  type: 'Complex' | 'Court' | 'Field' | 'Studio' | 'Pool';
  address: string;
  location: string; // Could be more complex, e.g., { lat: number, lng: number }
  latitude?: number; // Optional latitude
  longitude?: number; // Optional longitude
  description: string;
  images: string[]; // URLs to images
  sports: Sport[];
  amenities: Amenity[];
  operatingHours: FacilityOperatingHours[];
  pricePerHour: number; // Base price, or current default. Dynamic rules would modify this.
  pricingRulesApplied?: PricingRule[]; // Optional array for dynamic pricing rules
  rating: number; // This will now be dynamically calculated based on reviews
  reviews?: Review[]; // Array of reviews associated with the facility
  capacity?: number;
  isPopular?: boolean;
  isIndoor?: boolean; // Added for indoor/outdoor filter
  dataAiHint?: string; // For placeholder image generation for the facility itself
  availableEquipment?: RentalEquipment[];
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
  priceAtBooking: number; // Unit price at the time of booking
  priceTypeAtBooking: 'per_booking' | 'per_hour';
  totalCost: number;
}

export interface Booking {
  id: string;
  userId: string;
  facilityId: string;
  facilityName: string; // Denormalized for easy display
  facilityImage: string; // Denormalized
  dataAiHint?: string; // AI hint for the facility image in the booking context
  date: string; // "YYYY-MM-DD"
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
  durationHours?: number; // Calculated duration, useful for per_hour rentals
  numberOfGuests?: number; // Number of guests for the booking
  baseFacilityPrice?: number; // Price for the facility slot itself
  equipmentRentalCost?: number; // Total cost for all rented equipment
  totalPrice: number; // Overall total
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  bookedAt: string; // ISO date string
  reviewed?: boolean; // Flag to indicate if this booking has been reviewed
  rentedEquipment?: RentedItemInfo[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon?: React.ElementType;
  unlockedAt?: string; // ISO date string when the user unlocked it
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  profilePictureUrl?: string;
  dataAiHint?: string; // AI hint for the profile picture
  preferredSports?: Sport[];
  favoriteFacilities?: string[]; // Array of facility IDs
  membershipLevel?: 'Basic' | 'Premium' | 'Pro';
  loyaltyPoints?: number;
  achievements?: Achievement[];
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
  name: string; // Changed from specific enum to string to allow admin to define names
  pricePerMonth: number;
  benefits: string[];
}

export interface SportEvent {
  id: string;
  name: string;
  facilityId: string;
  sport: Sport; // For display, store the whole object or just sportId and look up
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  description: string;
  entryFee?: number;
  maxParticipants?: number;
  registeredParticipants: number;
  imageUrl?: string;
  imageDataAiHint?: string;
}

// For FacilitySearchForm
export interface SearchFilters {
  searchTerm: string;
  sport: string;
  location: string;
  date?: Date;
  priceRange?: [number, number];
  selectedAmenities?: string[];
  indoorOutdoor?: 'any' | 'indoor' | 'outdoor';
}

export type NotificationType = 'booking_confirmed' | 'booking_cancelled' | 'review_submitted' | 'reminder' | 'promotion' | 'general';

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string; // ISO date string
  isRead: boolean;
  link?: string; // Optional link to navigate to
  icon?: React.ElementType; // Optional specific icon
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Could be Markdown or HTML
  imageUrl?: string;
  imageAlt?: string;
  authorName: string;
  authorAvatarUrl?: string;
  publishedAt: string; // ISO date string
  tags?: string[];
  isFeatured?: boolean;
  dataAiHint?: string;
}

