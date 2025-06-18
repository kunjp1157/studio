// src/ai/flows/facility-recommendation.ts
'use server';
/**
 * @fileOverview An AI agent that recommends sports facilities to a user.
 *
 * - recommendFacility - A function that recommends a sports facility to a user.
 * - RecommendFacilityInput - The input type for the recommendFacility function.
 * - RecommendFacilityOutput - The return type for the recommendFacility function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendFacilityInputSchema = z.object({
  preferences: z
    .string()
    .describe('The user preferences for sports facilities, including sport type, location, amenities, and price range.'),
  pastBookingHistory: z
    .string()
    .describe('The user past booking history, including sports facilities, dates, times, and sports played.'),
});
export type RecommendFacilityInput = z.infer<typeof RecommendFacilityInputSchema>;

const RecommendFacilityOutputSchema = z.object({
  facilityName: z.string().describe('The name of the recommended sports facility.'),
  facilityType: z.string().describe('The type of the recommended sports facility (e.g., sports complex, court, field).'),
  location: z.string().describe('The location of the recommended sports facility.'),
  reason: z.string().describe('The reason for recommending this sports facility based on user preferences and past booking history.'),
});
export type RecommendFacilityOutput = z.infer<typeof RecommendFacilityOutputSchema>;

export async function recommendFacility(input: RecommendFacilityInput): Promise<RecommendFacilityOutput> {
  return recommendFacilityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendFacilityPrompt',
  input: {schema: RecommendFacilityInputSchema},
  output: {schema: RecommendFacilityOutputSchema},
  prompt: `You are an AI sports facility recommendation agent. You will recommend a sports facility to the user based on their preferences and past booking history.

User Preferences: {{{preferences}}}
Past Booking History: {{{pastBookingHistory}}}

Consider the user's stated preferences, but also extrapolate what they might like based on their booking history.

Give a detailed explanation in the reason field as to why the AI recommended this facility.
`,
});

const recommendFacilityFlow = ai.defineFlow(
  {
    name: 'recommendFacilityFlow',
    inputSchema: RecommendFacilityInputSchema,
    outputSchema: RecommendFacilityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
