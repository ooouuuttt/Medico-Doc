
'use server';

import { db } from '@/lib/firebase';
import type { Notification } from '@/lib/types';
import { collection, query, where, getDocs, orderBy, limit, Timestamp } from 'firebase/firestore';

/**
 * Fetches notifications for a specific doctor from Firestore.
 * @param doctorId The UID of the doctor.
 * @returns A promise that resolves to an array of notifications.
 */
export async function getNotificationsForDoctor(doctorId: string): Promise<Notification[]> {
  if (!doctorId) {
    console.error('Doctor ID is required to fetch notifications.');
    return [];
  }

  try {
    const notificationsCol = collection(db, 'notifications');
    const q = query(
        notificationsCol, 
        where('doctorId', '==', doctorId), 
        orderBy('createdAt', 'desc'),
        limit(10) // Get the 10 most recent notifications
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return [];
    }

    const notifications = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        doctorId: data.doctorId,
        title: data.title,
        message: data.message,
        createdAt: (data.createdAt as Timestamp).toDate(),
        read: data.read,
      } as Notification;
    });

    return notifications;
  } catch (error) {
    console.error('Error fetching notifications: ', error);
    return [];
  }
}
