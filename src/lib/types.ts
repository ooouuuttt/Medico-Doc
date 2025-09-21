
export type Message = {
  id: string;
  sender: 'doctor' | 'patient';
  text: string;
  timestamp: string;
};

export type Patient = {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  lastVisit: string;
  avatar: string;
  healthRecords: string;
  messages?: Message[];
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
