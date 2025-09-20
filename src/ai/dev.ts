import { config } from 'dotenv';
config({ path: '.env.local' });

import '@/ai/flows/job-market-trends.ts';
import '@/ai/flows/skills-recommendation.ts';
import '@/ai/flows/career-path-recommendations.ts';
import '@/ai/flows/skills-gap-analysis.ts';
import '@/ai/flows/interview-prep.ts';
