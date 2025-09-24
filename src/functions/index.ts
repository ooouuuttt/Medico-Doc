
'use server';

import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { createNotification } from '@/ai/flows/ai-create-notification';

/**
 * A Firebase Function that triggers when an appointment document is written.
 * If a new appointment is created (status becomes 'upcoming'), it creates a notification for the doctor.
 */
export const onappointmentwritten = onDocumentWritten(
  'appointments/{appointmentId}',
  async (event) => {
    const beforeData = event.data?.before.data();
    const afterData = event.data?.after.data();

    // Check if it's a new appointment being booked
    // This is true if the document is newly created with status 'upcoming'
    // or if the status changes to 'upcoming'.
    if (afterData && afterData.status === 'upcoming' && beforeData?.status !== 'upcoming') {
      console.log(`New appointment detected: ${event.params.appointmentId}`);

      try {
        const result = await createNotification({
          doctorId: afterData.doctorId,
          patientName: afterData.patientName,
          appointmentDate: afterData.date.toDate().toISOString(),
        });

        if (result.success) {
          console.log(
            `Successfully created notification for appointment ${event.params.appointmentId}`
          );
        } else {
          console.error(
            `Failed to create notification for appointment ${event.params.appointmentId}`
          );
        }
      } catch (error) {
        console.error(
          `Error calling createNotification flow for appointment ${event.params.appointmentId}:`,
          error
        );
      }
    }
  }
);
