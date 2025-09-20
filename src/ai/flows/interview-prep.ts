'use server';

/**
 * @fileOverview An interview preparation AI agent.
 *
 * - getInterviewPrep - A function that handles the interview preparation process.
 * - InterviewPrepInput - The input type for the getInterviewPrep function.
 * - InterviewPrepOutput - The return type for the getInterviewPrep function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InterviewPrepInputSchema = z.object({
  careerPath: z.string().describe('The desired career path of the user.'),
  userSkills: z.string().describe('A comma-separated list of the user\'s skills.'),
});
export type InterviewPrepInput = z.infer<typeof InterviewPrepInputSchema>;

const InterviewPrepOutputSchema = z.object({
  sampleQuestions: z.array(
    z.object({
      question: z.string().describe('A sample interview question.'),
      answer_guideline: z.string().describe('A guideline on how to answer the question.'),
    })
  ).describe('A list of sample interview questions and answer guidelines.'),
  preparationTips: z
    .array(z.string())
    .describe('A list of tips to prepare for the interview.'),
});
export type InterviewPrepOutput = z.infer<typeof InterviewPrepOutputSchema>;

export async function getInterviewPrep(
  input: InterviewPrepInput
): Promise<InterviewPrepOutput> {
  return interviewPrepFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interviewPrepPrompt',
  input: {schema: InterviewPrepInputSchema},
  output: {schema: InterviewPrepOutputSchema},
  prompt: `You are an expert career coach preparing a student for an interview in India.

Based on their desired career path and skills, generate a list of 5-7 potential interview questions, along with guidelines on how to best answer each one. Also, provide a list of actionable preparation tips.

Desired Career Path: {{{careerPath}}}
Student's Skills: {{{userSkills}}}

Focus on a mix of technical, behavioral, and situational questions relevant to the Indian job market.
`,
});

const interviewPrepFlow = ai.defineFlow(
  {
    name: 'interviewPrepFlow',
    inputSchema: InterviewPrepInputSchema,
    outputSchema: InterviewPrepOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
