
'use server';
/**
 * @fileOverview An AI agent that analyzes application data and generates a business presentation.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { getAppStats, getPopularSports } from '@/ai/tools/app-data-tools';

const GeneratePresentationInputSchema = z.object({
  topic: z
    .string()
    .describe('The main topic or focus for the presentation. e.g., "Quarterly Business Review"'),
});
export type GeneratePresentationInput = z.infer<typeof GeneratePresentationInputSchema>;

const SlideSchema = z.object({
  slideTitle: z.string().describe('The title of the presentation slide.'),
  bulletPoints: z.array(z.string()).describe('A list of key bullet points or talking points for the slide. Each point should be a concise sentence.'),
});

const GeneratePresentationOutputSchema = z.object({
  presentationTitle: z.string().describe('The main title for the entire presentation.'),
  slides: z.array(SlideSchema).describe('An array of slides that make up the presentation.'),
});
export type GeneratePresentationOutput = z.infer<typeof GeneratePresentationOutputSchema>;


export async function generatePresentation(input: GeneratePresentationInput): Promise<GeneratePresentationOutput> {
  return generatePresentationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePresentationPrompt',
  input: { schema: GeneratePresentationInputSchema },
  output: { schema: GeneratePresentationOutputSchema },
  tools: [getAppStats, getPopularSports],
  prompt: `You are a business analyst AI for an application called "Sports Arena".
Your task is to generate a professional business presentation about the app's performance.

The presentation topic is: "{{topic}}".

Use the available tools to fetch real-time data about the application.
Analyze the data you retrieve to create insightful slides.
The presentation should include:
1.  An overview slide with key metrics (total users, facilities, bookings).
2.  A slide on the most popular sports.
3.  A slide with business observations or recommendations based on the data.

Structure your response strictly according to the output schema. Ensure each bullet point is a complete, insightful sentence.
`,
});


const generatePresentationFlow = ai.defineFlow(
  {
    name: 'generatePresentationFlow',
    inputSchema: GeneratePresentationInputSchema,
    outputSchema: GeneratePresentationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("The AI model failed to return a valid presentation structure.");
    }
    return output;
  }
);
