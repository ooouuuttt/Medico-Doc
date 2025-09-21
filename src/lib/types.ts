export type Patient = {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  lastVisit: string;
  avatar: string;
  healthRecords: string;
};

export type Appointment = {
  id: string;
  patientName: string;
  patientAvatar: string;
  time: string;
  type: 'Video' | 'Chat';
  status: 'Upcoming' | 'Completed' | 'Cancelled';
};

export type Doctor = {
  name: string;
  specialization: string;
  avatar: string;
};
