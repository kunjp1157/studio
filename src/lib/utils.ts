
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { TimeSlot, PricingRule } from './types';

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

export const calculateDynamicPrice = ( basePricePerHour: number, selectedDate: Date, selectedSlot: TimeSlot, durationHours: number ): { finalPrice: number; appliedRuleName?: string, appliedRuleDetails?: PricingRule } => ({ finalPrice: basePricePerHour * durationHours });
