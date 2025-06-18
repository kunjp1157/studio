
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

export interface Facility {
  id: string;
  name:string;
  type: 'Complex' | 'Court' | 'Field' | 'Studio' | 'Pool';
  address: string;
  location: string; // Could be more complex, e.g., { lat: number, lng: number }
  description: string;
  images: string[]; // URLs to images
  sports: Sport[];
  amenities: Amenity[];
  operatingHours: {
    day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
    open: string; // e.g., "08:00"
    close: string; // e.g., "22:00"
  }[];
  pricePerHour: number; // Base price
  rating: number; // Average rating 0-5
  capacity?: number;
  isPopular?: boolean;
  dataAiHint?: string; // For placeholder image generation for the facility itself
}

export interface TimeSlot {
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
  isAvailable: boolean;
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
  totalPrice: number;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  bookedAt: string; // ISO date string
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
  name: 'Basic' | 'Premium' | 'Pro';
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
  maxParticipants?: number;
  registeredParticipants: number;
  imageUrl?: string;
  imageDataAiHint?: string;
}
