
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import type { User } from 'firebase/auth';

export type UserProfile = {
  uid: string;
  name: string;
  specialization: string;
  email: string;
  bio: string;
  consultationTimings: string;
  availability: string;
  license: string;
  avatar: string;
};

/**
 * Creates a new doctor profile in Firestore.
 * @param user The Firebase user object.
 * @param additionalData Additional data to include in the profile.
 */
export async function createDoctorProfile(user: User, additionalData: { name: string }) {
  const userDocRef = doc(db, 'users', user.uid);
  const defaultProfile: UserProfile = {
    uid: user.uid,
    name: additionalData.name,
    email: user.email || '',
    specialization: 'General Physician',
    bio: 'Dedicated to providing the best patient care.',
    consultationTimings: 'Mon - Fri, 9 AM - 5 PM',
    availability: 'Available for teleconsultation',
    license: 'Not Verified',
    avatar: user.photoURL || `https://picsum.photos/seed/${user.uid}/100/100`,
  };
  await setDoc(userDocRef, defaultProfile);
  return defaultProfile;
}

/**
 * Retrieves a doctor's profile from Firestore.
 * @param uid The user's unique ID.
 * @returns The user profile object or null if not found.
 */
export async function getDoctorProfile(uid: string): Promise<UserProfile | null> {
  const userDocRef = doc(db, 'users', uid);
  const userDoc = await getDoc(userDocRef);
  if (userDoc.exists()) {
    return userDoc.data() as UserProfile;
  }
  return null;
}

/**
 * Updates a doctor's profile in Firestore.
 * @param uid The user's unique ID.
 * @param data The partial profile data to update.
 */
export async function updateUserProfile(uid: string, data: Partial<UserProfile>) {
  const userDocRef = doc(db, 'users', uid);
  await setDoc(userDocRef, data, { merge: true });
}
