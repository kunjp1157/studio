
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

// A simple utility function to calculate dynamic prices.
// This is a placeholder for a more complex pricing engine.
export function calculateDynamicPrice(
  basePricePerHour: number,
  selectedDate: Date,
  selectedSlot: { startTime: string, endTime: string },
  durationHours: number
): { finalPrice: number; appliedRuleName?: string, appliedRuleDetails?: PricingRule } {
  // In a real app, you would fetch and apply pricing rules here.
  // For now, it's a simple duration-based calculation.
  if(durationHours > 0) {
    return { finalPrice: basePricePerHour * durationHours };
  }
  
  // Fallback to base price if duration is invalid
  return { finalPrice: basePricePerHour };
};


