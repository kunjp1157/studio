
'use server';
/**
 * @fileOverview An AI agent that summarizes user reviews into pros and cons.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SummarizeReviewsInputSchema = z.object({
  reviews: z.array(z.string()).describe('An array of user review comments.'),
});
export type SummarizeReviewsInput = z.infer<typeof SummarizeReviewsInputSchema>;

const SummarizeReviewsOutputSchema = z.object({
  pros: z.array(z.string()).describe('A list of positive points summarized from the reviews.'),
  cons: z.array(z.string()).describe('A list of negative points summarized from the reviews.'),
});
export type SummarizeReviewsOutput = z.infer<typeof SummarizeReviewsOutputSchema>;

export async function summarizeReviews(input: SummarizeReviewsInput): Promise<SummarizeReviewsOutput> {
  // Don't run the flow if there are too few reviews to be meaningful.
  if (input.reviews.length < 3) {
      return { pros: [], cons: [] };
  }
  return summarizeReviewsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeReviewsPrompt',
  input: { schema: SummarizeReviewsInputSchema },
  output: { schema: SummarizeReviewsOutputSchema },
  prompt: `You are an expert at analyzing customer feedback. Analyze the following user reviews for a sports facility and summarize them into a short, helpful list of pros and cons.
  - Each list (pros and cons) should contain a maximum of 3 bullet points.
  - Each bullet point should be concise and directly reflect the feedback.
  - If there are no clear pros or cons, return an empty array for that list.
  - Focus on recurring themes in the reviews.

Reviews:
{{#each reviews}}
- "{{this}}"
{{/each}}
`,
});

const summarizeReviewsFlow = ai.defineFlow(
  {
    name: 'summarizeReviewsFlow',
    inputSchema: SummarizeReviewsInputSchema,
    outputSchema: SummarizeReviewsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
