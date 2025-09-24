
'use server';

import { db } from '@/lib/firebase';
import type { Appointment } from '@/lib/types';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';

/**
 * Fetches appointments for a specific doctor from Firestore.
 * @param doctorId The UID of the doctor.
 * @returns A promise that resolves to an array of appointments.
 */
export async function getAppointmentsForDoctor(doctorId: string): Promise<Appointment[]> {
  if (!doctorId) {
    console.error('Doctor ID is required to fetch appointments.');
    return [];
  }

  try {
    const appointmentsCol = collection(db, 'appointments');
    const q = query(appointmentsCol, where('doctorId', '==', doctorId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log('No appointments found for doctor:', doctorId);
      return [];
    }

    const appointments = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      // Convert the Firestore Timestamp to a JavaScript Date object.
      const utcDate = (data.date as Timestamp).toDate();
      
      // Manually add 5 hours and 30 minutes for IST conversion
      utcDate.setHours(utcDate.getHours() + 5);
      utcDate.setMinutes(utcDate.getMinutes() + 30);

      const correctedDate = utcDate;

      return {
        id: doc.id,
        patientId: data.patientId,
        patientName: data.patientName,
        // TODO: Fetch patient avatar from the 'users' collection based on patientId
        patientAvatar: `https://picsum.photos/seed/${data.patientId}/100/100`, 
        time: correctedDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
        date: correctedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        type: data.type as 'video' | 'chat',
        status: data.status as 'upcoming' | 'completed' | 'cancelled',
      } as Appointment;
    });

    return appointments;
  } catch (error) {
    console.error('Error fetching appointments: ', error);
    // In a real app, you might want to throw the error or handle it differently
    return [];
  }
}
