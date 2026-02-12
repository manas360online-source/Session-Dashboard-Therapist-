export enum SessionStatus {
  COMPLETED = 'Completed',
  SCHEDULED = 'Scheduled',
  CANCELLED = 'Cancelled',
  ONGOING = 'Ongoing',
  MISSED = 'Missed'
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string; // e.g., "Post-Stroke Recovery", "Anxiety Disorder"
  email: string;
  phone: string;
  avatarUrl?: string;
}

export interface SessionResponse {
  question: string;
  answer: string;
  timestamp: string;
  moodRating?: number; // 1-10
}

export interface Session {
  id: string;
  patientId: string;
  patient: Patient;
  date: string; // ISO string
  durationMinutes: number;
  status: SessionStatus;
  type: 'In-Person' | 'Video' | 'Phone';
  clinicalNotes: string;
  patientResponses: SessionResponse[];
  aiSummary?: string;
}

export interface DashboardStats {
  totalSessions: number;
  completionRate: number;
  averageDuration: number;
  upcomingCount: number;
}