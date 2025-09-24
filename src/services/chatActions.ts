
'use server';

import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import type { Conversation } from './chatService';

/**
 * Fetches all chat conversations for a specific doctor.
 */
export async function getConversationsForDoctor(doctorId: string): Promise<Conversation[]> {
  if (!doctorId) {
    console.error('Doctor ID is required.');
    return [];
  }
  try {
    const chatsCol = collection(db, 'chats');
    const q = query(chatsCol, where('doctorId', '==', doctorId), orderBy('lastMessageTimestamp', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      const lastMessageTimestamp = data.lastMessageTimestamp as Timestamp | undefined;
      
      return {
        id: docSnap.id,
        ...data,
        patientAvatar: `https://picsum.photos/seed/${data.patientId}/100/100`,
        lastMessageTimestamp: lastMessageTimestamp ? lastMessageTimestamp.toDate() : new Date(),
      } as Conversation;
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return [];
  }
}

/**
 * Sends a new message in a conversation.
 */
export async function sendMessage(chatId: string, message: { text: string; senderId: string }) {
  if (!chatId || !message.text || !message.senderId) {
    console.error('Chat ID, message text, and sender ID are required.');
    return;
  }
  try {
    // 1. Add the new message to the 'messages' subcollection
    const messagesCol = collection(db, 'chats', chatId, 'messages');
    await addDoc(messagesCol, {
      ...message,
      timestamp: serverTimestamp(),
    });

    // 2. Update the last message info in the parent chat document
    const chatDocRef = doc(db, 'chats', chatId);
    await updateDoc(chatDocRef, {
      lastMessageText: message.text,
      lastMessageTimestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error sending message:', error);
  }
}
