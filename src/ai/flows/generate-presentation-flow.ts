
'use server';
/**
 * @fileOverview An AI agent that analyzes application data and generates a business presentation.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { getAppStats, getPopularSports, getRevenueAndBookingTrends } from '@/ai/tools/app-data-tools';

const GeneratePresentationInputSchema = z.object({
  topic: z
    .string()
    .describe('The main topic or focus for the presentation. e.g., "Quarterly Business Review"'),
});
export type GeneratePresentationInput = z.infer<typeof GeneratePresentationInputSchema>;

const SlideSchema = z.object({
  slideTitle: z.string().describe('The title of the presentation slide.'),
  icon: z.string().describe('A relevant icon name from the lucide-react library (e.g., "LineChart", "Users", "Target").'),
  bulletPoints: z.array(z.string()).describe('A list of key bullet points or talking points for the slide. Each point should be a concise sentence.'),
  narrative: z.string().optional().describe('A short paragraph providing more context or analysis for the slide.'),
});

const GeneratePresentationOutputSchema = z.object({
  presentationTitle: z.string().describe('The main title for the entire presentation.'),
  summary: z.string().describe("A one-sentence summary of the key takeaway from the presentation."),
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
  tools: [getAppStats, getPopularSports, getRevenueAndBookingTrends],
  prompt: `You are a senior business analyst AI for an application called "Sports Arena".
Your task is to generate a professional, insightful business presentation about the app's performance.

The presentation topic is: "{{topic}}".

You must use the provided tools to gather data for your analysis.
Analyze the data you retrieve to create insightful slides.
The presentation should include:
1.  An "Overview" slide with key app statistics.
2.  A "Revenue & Booking Trends" slide analyzing performance over the last 6 months.
3.  A "Popular Sports" slide identifying top-performing categories.
4.  A "Strategic Recommendations" slide offering actionable advice for business growth based on all the retrieved data.

For each slide:
- Provide a clear, descriptive \`slideTitle\`.
- Choose a relevant \`icon\` name from the lucide-react library (e.g., 'BarChart', 'TrendingUp', 'Users', 'Lightbulb').
- Create concise, data-driven \`bulletPoints\`.
- Write a short, insightful \`narrative\` paragraph that explains the data or provides deeper context.

Finally, generate a main \`presentationTitle\` and a one-sentence \`summary\` of the most important conclusion from your analysis.
Structure your response strictly according to the output schema.
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
