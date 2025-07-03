'use server';
/**
 * @fileOverview An AI agent that plans a sporty weekend for a user.
 *
 * - planWeekend - A function that handles the weekend planning process.
 * - PlanWeekendInput - The input type for the planWeekend function.
 * - PlanWeekendOutput - The return type for the planWeekend function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getAllFacilities, getSiteSettings } from '@/lib/data';
import { formatCurrency } from '@/lib/utils';

// Define Input Schema
const PlanWeekendInputSchema = z.object({
  request: z
    .string()
    .describe('A natural language request from the user detailing their preferences for a sporty weekend. This can include number of people, preferred sports, budget, location hints, and desired times.'),
});
export type PlanWeekendInput = z.infer<typeof PlanWeekendInputSchema>;

// Define Output Schema
const WeekendPlanSuggestionSchema = z.object({
    day: z.string().describe("The day of the suggested activity (e.g., 'Saturday')."),
    time: z.string().describe("The suggested time for the activity (e.g., '2:00 PM - 4:00 PM')."),
    activity: z.string().describe("The name of the sport or activity."),
    facilityName: z.string().describe("The name of the recommended facility for this activity."),
    estimatedCost: z.number().describe("A rough estimate of the cost for this activity."),
    reason: z.string().describe("A brief, compelling reason why this specific activity and facility were chosen based on the user's request."),
});

const PlanWeekendOutputSchema = z.object({
  plan: z.array(WeekendPlanSuggestionSchema).describe("An array of suggested activities that make up the weekend plan."),
  summary: z.string().describe("A friendly, encouraging summary of the overall weekend plan."),
});
export type PlanWeekendOutput = z.infer<typeof PlanWeekendOutputSchema>;


// The main exported function that the UI will call
export async function planWeekend(input: PlanWeekendInput): Promise<PlanWeekendOutput> {
  const facilities = getAllFacilities();
  const settings = getSiteSettings();

  const facilityContext = facilities
    .map(f => {
        const minPrice = f.sportPrices.length > 0 ? Math.min(...f.sportPrices.map(p => p.pricePerHour)) : 0;
        return `- ${f.name} (Sports: ${f.sports.map(s => s.name).join(', ')}), Location: ${f.location}, Price from: ${formatCurrency(minPrice, settings.defaultCurrency)}/hr`
    })
    .join('\n');

  return planWeekendFlow({ ...input, facilityContext, currency: settings.defaultCurrency });
}

const PlannerInputInternalSchema = PlanWeekendInputSchema.extend({
    facilityContext: z.string().describe("A list of available facilities for context."),
    currency: z.string().describe("The currency to use for all monetary values, e.g., INR, USD."),
});

// Define the Genkit Prompt
const prompt = ai.definePrompt({
  name: 'planWeekendPrompt',
  input: { schema: PlannerInputInternalSchema },
  output: { schema: PlanWeekendOutputSchema },
  prompt: `You are an expert AI weekend planner for a sports facility booking platform called "Sports Arena". Your goal is to create a fun, logical, and exciting weekend itinerary based on a user's request.

You MUST use the currency {{{currency}}} for all cost estimations in your response. The estimatedCost field should be a number representing the value in {{{currency}}}.

You must use the following list of available facilities to make your suggestions. Do not invent facilities.

Available Facilities:
{{{facilityContext}}}

User's Request:
"{{{request}}}"

Based on the user's request and the available facilities, create a structured weekend plan.
- The plan should be logical (e.g., don't schedule back-to-back intense activities without a break).
- The suggestions should match the user's preferences for sports, budget, and timing.
- For each item in the plan, provide a short, compelling reason for your choice.
- The cost estimation should be based on a reasonable duration (e.g., 1-2 hours) and the facility's price. The final number should be in {{{currency}}}.
- Finally, provide a friendly and encouraging summary of the entire plan.
`,
});

// Define the Genkit Flow
const planWeekendFlow = ai.defineFlow(
  {
    name: 'planWeekendFlow',
    inputSchema: PlannerInputInternalSchema,
    outputSchema: PlanWeekendOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
        throw new Error('The AI model did not return a valid plan.');
    }
    return output;
  }
);
