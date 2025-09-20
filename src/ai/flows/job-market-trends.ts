// JobMarketTrends flow
'use server';
/**
 * @fileOverview Provides insights into current job market trends and in-demand skills.
 *
 * - getJobMarketTrends - A function that retrieves job market trends and in-demand skills.
 * - JobMarketTrendsInput - The input type for the getJobMarketTrends function.
 * - JobMarketTrendsOutput - The return type for the getJobMarketTrends function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const JobMarketTrendsInputSchema = z.object({
  userSkills: z
    .string()
    .describe('The skills the user has.'),
  userInterests: z.string().describe('The interests of the user.'),
});
export type JobMarketTrendsInput = z.infer<typeof JobMarketTrendsInputSchema>;

const JobMarketTrendsOutputSchema = z.object({
  trends: z.string().describe('The current job market trends.'),
  inDemandSkills: z.string().describe('The skills that are currently in demand.'),
});
export type JobMarketTrendsOutput = z.infer<typeof JobMarketTrendsOutputSchema>;

export async function getJobMarketTrends(input: JobMarketTrendsInput): Promise<JobMarketTrendsOutput> {
  return jobMarketTrendsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'jobMarketTrendsPrompt',
  input: {schema: JobMarketTrendsInputSchema},
  output: {schema: JobMarketTrendsOutputSchema},
  prompt: `You are a career advisor providing insights into the job market.

  Based on the user's skills and interests, provide current job market trends and in-demand skills.

  Skills: {{{userSkills}}}
  Interests: {{{userInterests}}}

  Job Market Trends: 
  In-Demand Skills: `,
});

const jobMarketTrendsFlow = ai.defineFlow(
  {
    name: 'jobMarketTrendsFlow',
    inputSchema: JobMarketTrendsInputSchema,
    outputSchema: JobMarketTrendsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
