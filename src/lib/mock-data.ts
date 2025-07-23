
'use client'; // Mark as a client-safe module

import type { Sport, Amenity, MembershipPlan } from './types';

// This file contains static mock data that is safe to be imported into client components.
// It has no server-side dependencies like the 'pg' database driver.

export const mockSports: Sport[] = [
  { id: 'sport-1', name: 'Soccer', iconName: 'Goal', imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55', imageDataAiHint: 'soccer stadium' },
  { id: 'sport-2', name: 'Basketball', iconName: 'Dribbble', imageUrl: 'https://images.unsplash.com/photo-1519861531473-9200262188bf', imageDataAiHint: 'basketball court' },
  { id: 'sport-3', name: 'Tennis', iconName: 'Activity', imageUrl: 'https://images.unsplash.com/photo-1554062614-6da4fa674b73', imageDataAiHint: 'tennis court' },
  { id: 'sport-4', name: 'Badminton', iconName: 'Feather', imageUrl: 'https://images.unsplash.com/photo-1521587514789-53b8a3b09228', imageDataAiHint: 'badminton shuttlecock' },
  { id: 'sport-5', name: 'Swimming', iconName: 'PersonStanding', imageUrl: 'https://images.unsplash.com/photo-1551604313-26835b334a81', imageDataAiHint: 'swimming pool' },
  { id: 'sport-6', name: 'Yoga', iconName: 'Brain', imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b', imageDataAiHint: 'yoga class' },
  { id: 'sport-7', name: 'Cycling', iconName: 'Bike', imageUrl: 'https://images.unsplash.com/photo-1471506480216-e5719f9794d0', imageDataAiHint: 'cycling velodrome' },
  { id: 'sport-8', name: 'Dance', iconName: 'Music', imageUrl: 'https://images.unsplash.com/photo-1511719111394-550342a5b23d', imageDataAiHint: 'dance studio' },
  { id: 'sport-9', name: 'Camping', iconName: 'Tent', imageUrl: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d', imageDataAiHint: 'camping tent' },
  { id: 'sport-10', name: 'Theatre', iconName: 'Drama', imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91e38a493', imageDataAiHint: 'theatre stage' },
  { id: 'sport-13', name: 'Cricket', iconName: 'Dices', imageUrl: 'https://images.unsplash.com/photo-1593341646782-e0b495cffc25', imageDataAiHint: 'cricket stadium' },
  { id: 'sport-14', name: 'Pool', iconName: 'Target', imageUrl: 'https://images.unsplash.com/photo-1601758124235-7c98c199e4df', imageDataAiHint: 'billiards table' },
  { id: 'sport-15', name: 'PC Game/PS5', iconName: 'Gamepad2', imageUrl: 'https://images.unsplash.com/photo-1580327344181-c1163234e5a0', imageDataAiHint: 'gaming setup' },
  { id: 'sport-16', name: 'Gym', iconName: 'Dumbbell', imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48', imageDataAiHint: 'modern gym' },
];

export const mockAmenities: Amenity[] = [
  { id: 'amenity-1', name: 'Parking', iconName: 'ParkingCircle' },
  { id: 'amenity-2', name: 'WiFi', iconName: 'Wifi' },
  { id: 'amenity-3', name: 'Showers', iconName: 'ShowerHead' },
  { id: 'amenity-4', name: 'Lockers', iconName: 'Lock' },
  { id: 'amenity-5', name: 'Equipment Rental Signage', iconName: 'PackageSearch' },
  { id: 'amenity-6', name: 'Cafe', iconName: 'Utensils' },
  { id: 'amenity-7', name: 'Accessible', iconName: 'Users' },
];

export const mockMembershipPlans: MembershipPlan[] = [
  { id: 'mem_basic_1', name: 'Basic', pricePerMonth: 0, benefits: ['Access to all facilities', 'Standard booking rates', 'Community access'] },
  { id: 'mem_premium_2', name: 'Premium', pricePerMonth: 999, benefits: ['10% off all bookings', 'Priority booking slots', 'Free equipment rental (2 items/month)', 'Access to exclusive events'] },
  { id: 'mem_pro_3', name: 'Pro', pricePerMonth: 2499, benefits: ['25% off all bookings', 'Unlimited priority booking', 'Unlimited free equipment rental', 'Free entry to all events', 'Personalized coaching tips (AI-powered)'] },
];
