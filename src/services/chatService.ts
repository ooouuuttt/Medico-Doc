
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
  onSnapshot,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';

export type Conversation = {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorAvatar: string;
  patientId: string;
  patientName: string;
  patientAvatar: string;
  lastMessageText: string;
  lastMessageTimestamp: Date;
};

export type Message = {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
};

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
      return {
        id: docSnap.id,
        ...data,
        patientAvatar: `https://picsum.photos/seed/${data.patientId}/100/100`,
        lastMessageTimestamp: (data.lastMessageTimestamp as Timestamp).toDate(),
      } as Conversation;
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return [];
  }
}

/**
 * Listens for real-time messages in a conversation.
 */
export function listenToMessages(chatId: string, callback: (messages: Message[]) => void) {
  const messagesCol = collection(db, 'chats', chatId, 'messages');
  const q = query(messagesCol, orderBy('timestamp', 'asc'));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const messages = querySnapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        senderId: data.senderId,
        text: data.text,
        timestamp: (data.timestamp as Timestamp)?.toDate(),
      } as Message;
    });
    callback(messages);
  });

  return unsubscribe; // Return the unsubscribe function for cleanup
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
