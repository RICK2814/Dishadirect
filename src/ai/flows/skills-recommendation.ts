'use server';

/**
 * @fileOverview A skill recommendation AI agent.
 *
 * - getSkillsRecommendation - A function that handles the skill recommendation process.
 * - SkillsRecommendationInput - The input type for the getSkillsRecommendation function.
 * - SkillsRecommendationOutput - The return type for the getSkillsRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SkillsRecommendationInputSchema = z.object({
  careerPath: z.string().describe('The desired career path of the student.'),
  skillsGap: z.string().describe('The skills gap identified for the student.'),
});
export type SkillsRecommendationInput = z.infer<typeof SkillsRecommendationInputSchema>;

const SkillsRecommendationOutputSchema = z.object({
  resources: z.array(
    z.object({
      title: z.string().describe('The title of the resource.'),
      description: z.string().describe('A brief description of the resource.'),
      url: z.string().url().describe('The URL of the resource.'),
      type: z.enum(['course', 'tutorial', 'book', 'article']).describe('The type of resource.'),
    })
  ).describe('A list of resources to acquire the necessary skills.'),
  learningPaths: z.array(
    z.object({
      title: z.string().describe('The title of the learning path.'),
      description: z.string().describe('A brief description of the learning path.'),
      steps: z.array(z.object({
        title: z.string().describe('The title of the step.'),
        description: z.string().describe('A brief description of the step.'),
        duration: z.string().describe('An estimated duration to complete the step (e.g., "1 week", "2-3 days").')
      })).describe('The steps in the learning path.'),
    })
  ).describe('A list of learning paths to acquire the necessary skills.'),
});
export type SkillsRecommendationOutput = z.infer<typeof SkillsRecommendationOutputSchema>;

export async function getSkillsRecommendation(input: SkillsRecommendationInput): Promise<SkillsRecommendationOutput> {
  return skillsRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'skillsRecommendationPrompt',
  input: {schema: SkillsRecommendationInputSchema},
  output: {schema: SkillsRecommendationOutputSchema},
  prompt: `You are an expert career advisor specializing in recommending resources and learning paths to acquire skills for students in India.

You will use the student's desired career path and skills gap to recommend resources and learning paths.

For each learning path, provide a clear title, a brief description, and a series of actionable steps. Each step should include a title, a short description, and an estimated duration (e.g., "1-2 weeks").

Career Path: {{{careerPath}}}
Skills Gap: {{{skillsGap}}}

Provide a list of resources and learning paths to acquire the necessary skills.`,
});

const skillsRecommendationFlow = ai.defineFlow(
  {
    name: 'skillsRecommendationFlow',
    inputSchema: SkillsRecommendationInputSchema,
    outputSchema: SkillsRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
