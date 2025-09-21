import { config } from 'dotenv';
config();

import '@/ai/flows/ai-summarize-patient-symptoms.ts';
import '@/ai/flows/ai-generate-prescription.ts';
