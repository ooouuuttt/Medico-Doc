'use server';

import { generatePrescription, type GeneratePrescriptionOutput } from '@/ai/flows/ai-generate-prescription';
import { summarizePatientSymptoms } from '@/ai/flows/ai-summarize-patient-symptoms';
import { z } from 'zod';

const schema = z.object({
  healthRecords: z.string().min(10, { message: 'Health records must be at least 10 characters long to generate a prescription.' }),
});

export type PrescriptionFormState = {
  message: string;
  prescription?: GeneratePrescriptionOutput;
}

export async function createPrescription(prevState: PrescriptionFormState, formData: FormData): Promise<PrescriptionFormState> {
  const validatedFields = schema.safeParse({
    healthRecords: formData.get('healthRecords'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid health records.',
    };
  }

  try {
    // Artificial delay to show pending state
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 1. First, summarize the symptoms
    const summaryResult = await summarizePatientSymptoms({ healthRecords: validatedFields.data.healthRecords });
    
    if (!summaryResult.summary) {
        return { message: 'Could not generate a symptom summary.' };
    }

    // 2. Then, generate the prescription using the summary
    const prescriptionResult = await generatePrescription({ symptomsSummary: summaryResult.summary });
    
    return {
      message: 'success',
      prescription: prescriptionResult,
    };
  } catch (error) {
    console.error(error);
    return {
      message: 'Failed to generate prescription. Please try again.',
    };
  }
}
