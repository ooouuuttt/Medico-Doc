'use server';
/**
 * @fileOverview A flow to create a notification when an appointment is cancelled.
 *
 * - createCancellationNotification - Creates a notification document in Firestore for a cancelled appointment.
 * - CreateCancellationNotificationInput - The input type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {db} from '@/lib/firebase';
import {collection, addDoc, serverTimestamp} from 'firebase/firestore';

export const CreateCancellationNotificationInputSchema = z.object({
  doctorId: z.string().describe('The UID of the doctor to be notified.'),
  patientName: z.string().describe('The name of the patient whose appointment was cancelled.'),
  appointmentDate: z.string().describe('The original date and time of the appointment.'),
  cancellationReason: z.string().describe('The reason for the cancellation.'),
});
export type CreateCancellationNotificationInput = z.infer<
  typeof CreateCancellationNotificationInputSchema
>;

export async function createCancellationNotification(
  input: CreateCancellationNotificationInput
): Promise<{success: boolean; notificationId?: string}> {
  return createCancellationNotificationFlow(input);
}

const createCancellationNotificationFlow = ai.defineFlow(
  {
    name: 'createCancellationNotificationFlow',
    inputSchema: CreateCancellationNotificationInputSchema,
    outputSchema: z.object({
      success: z.boolean(),
      notificationId: z.string().optional(),
    }),
  },
  async input => {
    try {
      const notificationData = {
        doctorId: input.doctorId,
        title: 'Appointment Cancelled',
        message: `Your appointment with ${input.patientName} on ${new Date(
          input.appointmentDate
        ).toLocaleString()} was cancelled. Reason: ${input.cancellationReason}`,
        createdAt: serverTimestamp(),
        read: false,
      };

      const docRef = await addDoc(collection(db, 'notifications'), notificationData);
      console.log('Cancellation notification created with ID: ', docRef.id);
      return {success: true, notificationId: docRef.id};
    } catch (error) {
      console.error('Error creating cancellation notification: ', error);
      return {success: false};
    }
  }
);
