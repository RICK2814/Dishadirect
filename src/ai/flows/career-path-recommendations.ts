// src/ai/flows/career-path-recommendations.ts
'use server';
/**
 * @fileOverview Provides personalized career path recommendations based on the user's skills and interests.
 *
 * - careerPathRecommendations - A function that takes user skills and interests as input and returns career path recommendations.
 * - CareerPathRecommendationsInput - The input type for the careerPathRecommendations function.
 * - CareerPathRecommendationsOutput - The return type for the careerPathRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CareerPathRecommendationsInputSchema = z.object({
  skills: z
    .string()
    .describe('A comma-separated list of the user\'s skills.'),
  interests: z
    .string()
    .describe('A comma-separated list of the user\'s interests.'),
});
export type CareerPathRecommendationsInput = z.infer<
  typeof CareerPathRecommendationsInputSchema
>;

const CareerPathRecommendationsOutputSchema = z.object({
  careerPaths: z
    .array(
      z.object({
        name: z.string().describe('The name of the career path.'),
        description: z
          .string()
          .describe('A brief description of the career path.'),
      })
    )
    .describe('A list of personalized career path recommendations.'),
  reasoning: z
    .string()
    .describe(
      'The reasoning behind the career path recommendations, explaining how the skills and interests align with each career path.'
    ),
});
export type CareerPathRecommendationsOutput = z.infer<
  typeof CareerPathRecommendationsOutputSchema
>;

export async function careerPathRecommendations(
  input: CareerPathRecommendationsInput
): Promise<CareerPathRecommendationsOutput> {
  return careerPathRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'careerPathRecommendationsPrompt',
  input: {schema: CareerPathRecommendationsInputSchema},
  output: {schema: CareerPathRecommendationsOutputSchema},
  prompt: `You are a career advisor for students in India.

  Based on the student's skills and interests, provide a list of personalized career path recommendations.
  For each career path, provide a name and a brief description.
  Also, provide a brief explanation of why you recommended these career paths based on the student's profile.

  Skills: {{{skills}}}
  Interests: {{{interests}}}

  Format your response as a JSON object with "careerPaths" and "reasoning" fields.
  The "careerPaths" field is a list of objects, each with a "name" and "description" field.
  The "reasoning" field is a string.
  `,
});

const careerPathRecommendationsFlow = ai.defineFlow(
  {
    name: 'careerPathRecommendationsFlow',
    inputSchema: CareerPathRecommendationsInputSchema,
    outputSchema: CareerPathRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
