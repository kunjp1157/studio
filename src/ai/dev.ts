import { config } from 'dotenv';
config();

import '@/ai/flows/facility-recommendation.ts';
import '@/ai/flows/weekend-planner.ts';
import '@/ai/flows/summarize-reviews.ts';
import '@/ai/flows/generate-image-flow.ts';
import '@/ai/flows/generate-presentation-flow.ts';

import '@/ai/tools/app-data-tools.ts';
