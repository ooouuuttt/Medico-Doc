
'use server';

import { db } from '@/lib/firebase';
import type { Notification } from '@/lib/types';
import { collection, query, where, getDocs, orderBy, limit, Timestamp, onSnapshot, writeBatch } from 'firebase/firestore';

/**
 * Listens for real-time notifications for a specific doctor from Firestore.
 * @param doctorId The UID of the doctor.
 * @param callback The function to call with the new list of notifications.
 * @returns An unsubscribe function to stop listening to changes.
 */
export function listenToNotifications(doctorId: string, callback: (notifications: Notification[]) => void) {
  if (!doctorId) {
    console.error('Doctor ID is required to listen to notifications.');
    return () => {}; // Return a no-op unsubscribe function
  }

  const notificationsCol = collection(db, 'notifications');
  const q = query(
      notificationsCol, 
      where('doctorId', '==', doctorId), 
      orderBy('createdAt', 'desc'),
      limit(20) // Get the 20 most recent notifications
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
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
    callback(notifications);
  }, (error) => {
      console.error('Error listening to notifications:', error);
  });

  return unsubscribe;
}


/**
 * Marks all unread notifications for a doctor as read.
 * @param doctorId The UID of the doctor.
 * @returns An object indicating success or failure.
 */
export async function markAllNotificationsAsRead(doctorId: string): Promise<{ success: boolean; error?: string }> {
  if (!doctorId) {
    return { success: false, error: 'Doctor ID is required.' };
  }

  try {
    const notificationsCol = collection(db, 'notifications');
    const q = query(
      notificationsCol,
      where('doctorId', '==', doctorId),
      where('read', '==', false)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return { success: true }; // No unread notifications to mark
    }

    const batch = writeBatch(db);
    querySnapshot.docs.forEach(doc => {
      batch.update(doc.ref, { read: true });
    });

    await batch.commit();
    console.log(`Marked ${querySnapshot.size} notifications as read for doctor ${doctorId}`);
    return { success: true };

  } catch (error) {
    console.error('Error marking notifications as read:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return { success: false, error: errorMessage };
  }
}
