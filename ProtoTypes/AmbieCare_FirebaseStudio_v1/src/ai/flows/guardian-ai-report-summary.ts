'use server';
/**
 * @fileOverview This file implements a Genkit flow to generate AI-powered summaries of care reports for guardians.
 *
 * - generateGuardianAIReportSummary - A function that handles the AI report summarization process.
 * - GuardianAIReportSummaryInput - The input type for the generateGuardianAIReportSummary function.
 * - GuardianAIReportSummaryOutput - The return type for the generateGuardianAIReportSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GuardianAIReportSummaryInputSchema = z.object({
  reportText: z.string().describe('The raw text content of the care report.'),
  reportType: z.enum(['daily', 'weekly']).describe('The type of report (daily or weekly).'),
  previousReportSummary: z
    .string()
    .optional()
    .describe('Optional summary from the previous report for context to identify changes.'),
});
export type GuardianAIReportSummaryInput = z.infer<typeof GuardianAIReportSummaryInputSchema>;

const GuardianAIReportSummaryOutputSchema = z.object({
  summary: z.string().describe('A concise, easy-to-understand summary of the report.'),
  unusualActivityDetected: z
    .boolean()
    .describe('True if any unusual activity or significant change was detected in the report.'),
  keyChanges: z
    .array(z.string())
    .describe('A list of key changes or unusual activities detected; empty if none.'),
});
export type GuardianAIReportSummaryOutput = z.infer<typeof GuardianAIReportSummaryOutputSchema>;

export async function generateGuardianAIReportSummary(
  input: GuardianAIReportSummaryInput
): Promise<GuardianAIReportSummaryOutput> {
  return guardianAIReportSummaryFlow(input);
}

const summarizeReportPrompt = ai.definePrompt({
  name: 'summarizeReportPrompt',
  input: {schema: GuardianAIReportSummaryInputSchema},
  output: {schema: GuardianAIReportSummaryOutputSchema},
  prompt: `You are an AI assistant specialized in summarizing care reports for guardians. Your task is to provide a concise summary of the provided care report, focusing on the well-being of the individual.
Additionally, you MUST identify any unusual activities, significant changes, or deviations from normal patterns mentioned in the report.

Here is the {{reportType}} care report:
{{{reportText}}}

{{#if previousReportSummary}}
For context, here is the summary of the previous report:
{{{previousReportSummary}}}
{{/if}}

Please provide:
1. A concise, easy-to-understand summary of the report.
2. A boolean indicating if any unusual activity or significant change was detected.
3. A list of key changes or unusual activities if detected, otherwise an empty list.`,
});

const guardianAIReportSummaryFlow = ai.defineFlow(
  {
    name: 'guardianAIReportSummaryFlow',
    inputSchema: GuardianAIReportSummaryInputSchema,
    outputSchema: GuardianAIReportSummaryOutputSchema,
  },
  async input => {
    const {output} = await summarizeReportPrompt(input);
    if (!output) {
      throw new Error('Failed to generate report summary.');
    }
    return output;
  }
);
