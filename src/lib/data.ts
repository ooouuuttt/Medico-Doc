import type { Patient, Appointment, Doctor } from './types';
import { PlaceHolderImages } from './placeholder-images';

export const doctor: Doctor = {
  name: 'Anjali Sharma',
  specialization: 'Cardiologist',
  avatar: PlaceHolderImages.find(img => img.id === '1')?.imageUrl || '',
};

export const patients: Patient[] = [
  {
    id: '1',
    name: 'Rohan Verma',
    age: 45,
    gender: 'Male',
    lastVisit: '2023-10-15',
    avatar: PlaceHolderImages.find(img => img.id === '2')?.imageUrl || '',
    healthRecords: `Patient reports intermittent chest pain, especially during physical exertion. History of hypertension, managed with medication. Non-smoker. Family history of heart disease. Recent EKG shows minor abnormalities. Cholesterol levels are slightly elevated. Patient also complains of occasional shortness of breath.`,
  },
  {
    id: '2',
    name: 'Priya Patel',
    age: 32,
    gender: 'Female',
    lastVisit: '2023-11-01',
    avatar: PlaceHolderImages.find(img => img.id === '3')?.imageUrl || '',
    healthRecords: `32-year-old female presenting with persistent dry cough and fatigue for the past 3 weeks. Denies fever. Works in a crowded office environment. Reports difficulty sleeping due to cough. No significant past medical history. Seasonal allergies reported, usually managed with over-the-counter antihistamines.`,
  },
  {
    id: '3',
    name: 'Amit Singh',
    age: 68,
    gender: 'Male',
    lastVisit: '2023-11-20',
    avatar: PlaceHolderImages.find(img => img.id === '4')?.imageUrl || '',
    healthRecords: `Patient with Type 2 Diabetes, struggling with glucose control. Reports symptoms of polyuria and polydipsia. Last HbA1c was 8.5%. Also manages high blood pressure. Complains of tingling sensation in feet. Diet adherence is a challenge for the patient.`,
  },
  {
    id: '4',
    name: 'Sunita Rao',
    age: 55,
    gender: 'Female',
    lastVisit: '2023-12-05',
    avatar: PlaceHolderImages.find(img => img.id === '5')?.imageUrl || '',
    healthRecords: `Patient reports severe migraine headaches, occurring 3-4 times per month. Headaches are accompanied by nausea and sensitivity to light. Current medication provides only partial relief. No other neurological symptoms. Seeking alternative treatment options.`,
  },
  {
    id: '5',
    name: 'Vikram Reddy',
    age: 28,
    gender: 'Male',
    lastVisit: '2024-01-10',
    avatar: PlaceHolderImages.find(img => img.id === '6')?.imageUrl || '',
    healthRecords: `28-year-old male athlete with right knee pain following a football injury. Swelling and instability reported. MRI results suggest a possible ACL tear. Pain is significant when walking. Patient is anxious about long-term impact on his athletic career.`,
  },
];

export const appointments: Appointment[] = [
  {
    id: '1',
    patientName: 'Priya Patel',
    patientAvatar: PlaceHolderImages.find(img => img.id === '3')?.imageUrl || '',
    time: '10:00 AM',
    type: 'Video',
    status: 'Upcoming',
  },
  {
    id: '2',
    patientName: 'Amit Singh',
    patientAvatar: PlaceHolderImages.find(img => img.id === '4')?.imageUrl || '',
    time: '11:30 AM',
    type: 'Chat',
    status: 'Upcoming',
  },
  {
    id: '3',
    patientName: 'Rohan Verma',
    patientAvatar: PlaceHolderImages.find(img => img.id === '2')?.imageUrl || '',
    time: '02:00 PM',
    type: 'Video',
    status: 'Completed',
  },
  {
    id: '4',
    patientName: 'Sunita Rao',
    patientAvatar: PlaceHolderImages.find(img => img.id === '5')?.imageUrl || '',
    time: '03:00 PM',
    type: 'Video',
    status: 'Cancelled',
  },
];
