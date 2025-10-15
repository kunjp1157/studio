
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { TimeSlot, PricingRule } from './types';
import { differenceInMinutes, parse, isValid } from 'date-fns';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: 'USD' | 'EUR' | 'GBP' | 'INR') {
  const options = { style: 'currency', currency, minimumFractionDigits: 2 };
  
  // Use a locale that fits the currency for better formatting, e.g., 'en-IN' for INR
  let locale = 'en-US';
  if (currency === 'EUR') locale = 'de-DE';
  if (currency === 'GBP') locale = 'en-GB';
  if (currency === 'INR') locale = 'en-IN';
  
  try {
    return new Intl.NumberFormat(locale, options).format(amount);
  } catch (e) {
    // Fallback for environments that might not support all locales
    const symbols = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      INR: '₹'
    };
    return `${symbols[currency] || '$'}${amount.toFixed(2)}`;
  }
}

export const calculateDynamicPrice = ( basePricePerHour: number, selectedDate: Date, selectedSlot: TimeSlot, durationHours: number ): { finalPrice: number; appliedRuleName?: string, appliedRuleDetails?: PricingRule } => {
    // Placeholder for actual dynamic pricing logic
    // In a real app, this would check pricing rules against the date and time.
    
    // For now, it just calculates based on duration.
    if(durationHours > 0) {
      return { finalPrice: basePricePerHour * durationHours };
    }
    
    // Fallback to base price if duration is invalid
    return { finalPrice: basePricePerHour };
};
