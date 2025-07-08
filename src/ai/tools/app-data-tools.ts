'use server';
/**
 * @fileOverview A set of tools for Genkit flows to retrieve application data.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { getAllUsers, getAllFacilities, getAllBookings } from '@/lib/data';
import { subMonths, format, getMonth, getYear } from 'date-fns';

const AppStatsSchema = z.object({
  totalUsers: z.number(),
  totalFacilities: z.number(),
  totalBookings: z.number(),
});

export const getAppStats = ai.defineTool(
  {
    name: 'getAppStats',
    description: 'Retrieves core statistics about the application, such as total number of users, facilities, and bookings.',
    outputSchema: AppStatsSchema,
  },
  async () => {
    const users = await getAllUsers();
    const facilities = await getAllFacilities();
    const bookings = await getAllBookings();
    return {
      totalUsers: users.length,
      totalFacilities: facilities.length,
      totalBookings: bookings.length,
    };
  }
);

const PopularSportsSchema = z.array(z.object({
    sportName: z.string(),
    bookingCount: z.number(),
}));

export const getPopularSports = ai.defineTool(
    {
        name: 'getPopularSports',
        description: 'Retrieves a list of the most popular sports based on booking counts.',
        outputSchema: PopularSportsSchema,
    },
    async () => {
        const bookings = await getAllBookings();
        const sportCounts = new Map<string, number>();

        bookings.forEach(booking => {
            if (booking.status === 'Confirmed') {
                sportCounts.set(booking.sportName, (sportCounts.get(booking.sportName) || 0) + 1);
            }
        });

        const sortedSports = Array.from(sportCounts.entries())
            .map(([sportName, bookingCount]) => ({ sportName, bookingCount }))
            .sort((a, b) => b.bookingCount - a.bookingCount);
        
        return sortedSports.slice(0, 5); // Return top 5
    }
);

const RevenueAndBookingTrendsSchema = z.object({
  trends: z.array(z.object({
    month: z.string().describe("The month in 'MMM yyyy' format (e.g., 'Jul 2024')."),
    revenue: z.number().describe("Total revenue for the month."),
    bookings: z.number().describe("Total number of bookings for the month."),
  })),
  totalRevenue: z.number().describe("The sum of revenue over the period."),
  totalBookings: z.number().describe("The sum of bookings over the period."),
});

export const getRevenueAndBookingTrends = ai.defineTool(
  {
    name: 'getRevenueAndBookingTrends',
    description: 'Retrieves revenue and booking trends over the last 6 months.',
    outputSchema: RevenueAndBookingTrendsSchema,
  },
  async () => {
    const bookings = await getAllBookings();
    const now = new Date();
    const trends: Record<string, { revenue: number, bookings: number }> = {};

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
        const d = subMonths(now, i);
        const monthKey = format(d, 'MMM yyyy');
        trends[monthKey] = { revenue: 0, bookings: 0 };
    }

    bookings.forEach(booking => {
      if (booking.status === 'Confirmed') {
        const bookingDate = new Date(booking.bookedAt);
        const monthKey = format(bookingDate, 'MMM yyyy');
        if (trends[monthKey]) {
          trends[monthKey].revenue += booking.totalPrice;
          trends[monthKey].bookings += 1;
        }
      }
    });

    const formattedTrends = Object.entries(trends).map(([month, data]) => ({ month, ...data }));
    
    return {
        trends: formattedTrends,
        totalRevenue: formattedTrends.reduce((sum, t) => sum + t.revenue, 0),
        totalBookings: formattedTrends.reduce((sum, t) => sum + t.bookings, 0),
    };
  }
);
