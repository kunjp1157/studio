
'use server';
/**
 * @fileOverview A set of tools for Genkit flows to retrieve application data.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { getAllUsers, getAllFacilities, getAllBookings } from '@/lib/data';

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
