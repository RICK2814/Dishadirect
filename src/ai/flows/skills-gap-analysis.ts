'use server';

/**
 * @fileOverview A skills gap analysis AI agent.
 *
 * - analyzeSkillsGap - A function that handles the skills gap analysis process.
 * - SkillsGapAnalysisInput - The input type for the analyzeSkillsGap function.
 * - SkillsGapAnalysisOutput - The return type for the analyzeSkillsGap function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SkillsGapAnalysisInputSchema = z.object({
  currentSkills: z
    .string()
    .describe('A comma separated list of skills the user currently possesses.'),
  desiredCareerPath: z.string().describe('The desired career path of the user.'),
});
export type SkillsGapAnalysisInput = z.infer<typeof SkillsGapAnalysisInputSchema>;

const SkillsGapAnalysisOutputSchema = z.object({
  missingSkills: z
    .string()
    .describe(
      'A comma separated list of skills that the user is missing to achieve their desired career path.'
    ),
  suggestedResources: z
    .string()
    .describe(
      'A comma separated list of resources that the user can use to learn the missing skills.'
    ),
});
export type SkillsGapAnalysisOutput = z.infer<typeof SkillsGapAnalysisOutputSchema>;

export async function analyzeSkillsGap(
  input: SkillsGapAnalysisInput
): Promise<SkillsGapAnalysisOutput> {
  return analyzeSkillsGapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'skillsGapAnalysisPrompt',
  input: {schema: SkillsGapAnalysisInputSchema},
  output: {schema: SkillsGapAnalysisOutputSchema},
  prompt: `You are a career advisor specializing in identifying skills gaps for students.

You will use the current skills of the student and their desired career path to identify the skills that the student is missing.

You will also suggest resources that the student can use to learn the missing skills.

Current Skills: {{{currentSkills}}}
Desired Career Path: {{{desiredCareerPath}}}

Missing Skills: 
Suggested Resources:`,
});

const analyzeSkillsGapFlow = ai.defineFlow(
  {
    name: 'analyzeSkillsGapFlow',
    inputSchema: SkillsGapAnalysisInputSchema,
    outputSchema: SkillsGapAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
