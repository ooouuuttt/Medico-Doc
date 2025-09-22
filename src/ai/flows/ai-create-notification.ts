'use server';
/**
 * @fileOverview A flow to create a notification when an appointment is booked.
 *
 * - createNotification - Creates a notification document in Firestore.
 * - CreateNotificationInput - The input type for the createNotification function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {db} from '@/lib/firebase';
import {collection, addDoc, serverTimestamp} from 'firebase/firestore';

export const CreateNotificationInputSchema = z.object({
  doctorId: z.string().describe('The UID of the doctor to be notified.'),
  patientName: z.string().describe('The name of the patient who booked the appointment.'),
  appointmentDate: z.string().describe('The date and time of the appointment.'),
});
export type CreateNotificationInput = z.infer<
  typeof CreateNotificationInputSchema
>;

export async function createNotification(
  input: CreateNotificationInput
): Promise<{success: boolean; notificationId?: string}> {
  return createNotificationFlow(input);
}

const createNotificationFlow = ai.defineFlow(
  {
    name: 'createNotificationFlow',
    inputSchema: CreateNotificationInputSchema,
    outputSchema: z.object({
      success: z.boolean(),
      notificationId: z.string().optional(),
    }),
  },
  async input => {
    try {
      const notificationData = {
        doctorId: input.doctorId,
        title: 'New Appointment Booked',
        message: `${input.patientName} has booked a new appointment for ${new Date(
          input.appointmentDate
        ).toLocaleString()}.`,
        createdAt: serverTimestamp(),
        read: false,
      };

      const docRef = await addDoc(collection(db, 'notifications'), notificationData);
      console.log('Notification created with ID: ', docRef.id);
      return {success: true, notificationId: docRef.id};
    } catch (error) {
      console.error('Error creating notification: ', error);
      return {success: false};
    }
  }
);
