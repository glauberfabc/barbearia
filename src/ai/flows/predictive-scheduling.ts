// src/ai/flows/predictive-scheduling.ts
'use server';

/**
 * @fileOverview A flow to predict peak hours and popular services for barber shops, optimizing schedules and resource allocation.
 *
 * - predictScheduling - A function that triggers the predictive scheduling analysis.
 * - PredictSchedulingInput - The input type for the predictScheduling function.
 * - PredictSchedulingOutput - The return type for the predictScheduling function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictSchedulingInputSchema = z.object({
  historicalBookingData: z
    .string()
    .describe(
      'Historical booking data in JSON format, including date, time, barber, and service type.'
    ),
});
export type PredictSchedulingInput = z.infer<typeof PredictSchedulingInputSchema>;

const PredictSchedulingOutputSchema = z.object({
  peakHours: z
    .string()
    .describe(
      'Predicted peak hours for the barber shop based on historical data.'
    ),
  popularServices: z
    .string()
    .describe(
      'Predicted popular services based on historical booking data.'
    ),
  suggestedSchedule: z
    .string()
    .describe(
      'Suggested barber schedule based on predicted peak hours and popular services.'
    ),
});
export type PredictSchedulingOutput = z.infer<typeof PredictSchedulingOutputSchema>;

export async function predictScheduling(
  input: PredictSchedulingInput
): Promise<PredictSchedulingOutput> {
  return predictSchedulingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictSchedulingPrompt',
  input: {schema: PredictSchedulingInputSchema},
  output: {schema: PredictSchedulingOutputSchema},
  prompt: `You are an AI assistant that analyzes barber shop booking data to predict peak hours, popular services, and suggest optimal barber schedules.

Analyze the following historical booking data:
{{{historicalBookingData}}}

Based on this data, provide:

1.  Peak hours for the barber shop.
2.  Popular services.
3.  A suggested barber schedule to optimize resource allocation.`,
});

const predictSchedulingFlow = ai.defineFlow(
  {
    name: 'predictSchedulingFlow',
    inputSchema: PredictSchedulingInputSchema,
    outputSchema: PredictSchedulingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
