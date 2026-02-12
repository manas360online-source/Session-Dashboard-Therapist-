import { Session, SessionStatus, Patient } from '../types';

const patients: Patient[] = [
  {
    id: 'p1',
    name: 'Sarah Jenkins',
    age: 34,
    condition: 'Generalized Anxiety Disorder',
    email: 'sarah.j@example.com',
    phone: '555-0101',
    avatarUrl: 'https://picsum.photos/100/100?random=1'
  },
  {
    id: 'p2',
    name: 'Michael Chen',
    age: 58,
    condition: 'Post-Stroke Motor Recovery',
    email: 'm.chen@example.com',
    phone: '555-0102',
    avatarUrl: 'https://picsum.photos/100/100?random=2'
  },
  {
    id: 'p3',
    name: 'Emma Wilson',
    age: 22,
    condition: 'Depression',
    email: 'emma.w@example.com',
    phone: '555-0103',
    avatarUrl: 'https://picsum.photos/100/100?random=3'
  },
  {
    id: 'p4',
    name: 'David Miller',
    age: 45,
    condition: 'PTSD',
    email: 'd.miller@example.com',
    phone: '555-0104',
    avatarUrl: 'https://picsum.photos/100/100?random=4'
  }
];

export const generateMockSessions = (): Session[] => {
  return [
    {
      id: 's1',
      patientId: 'p1',
      patient: patients[0],
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
      durationMinutes: 45,
      status: SessionStatus.COMPLETED,
      type: 'Video',
      clinicalNotes: 'Patient reported improved sleep. Practiced CBT techniques for intrusive thoughts. Showed good engagement.',
      patientResponses: [
        { question: 'How was your mood this week?', answer: 'Better than last week, about a 7/10.', timestamp: '2023-10-25T09:00:00Z', moodRating: 7 },
        { question: 'Did you complete the homework?', answer: 'Yes, I did the breathing exercises daily.', timestamp: '2023-10-25T09:10:00Z' }
      ]
    },
    {
      id: 's2',
      patientId: 'p2',
      patient: patients[1],
      date: new Date(Date.now() + 1000 * 60 * 30).toISOString(), // 30 mins from now
      durationMinutes: 60,
      status: SessionStatus.SCHEDULED,
      type: 'In-Person',
      clinicalNotes: '',
      patientResponses: []
    },
    {
      id: 's3',
      patientId: 'p3',
      patient: patients[2],
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
      durationMinutes: 50,
      status: SessionStatus.CANCELLED,
      type: 'Video',
      clinicalNotes: 'Cancelled by patient due to illness.',
      patientResponses: []
    },
    {
      id: 's4',
      patientId: 'p2',
      patient: patients[1],
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 1 week ago
      durationMinutes: 60,
      status: SessionStatus.COMPLETED,
      type: 'In-Person',
      clinicalNotes: 'Worked on fine motor skills in right hand. Grip strength improved by 10%.',
      patientResponses: [
        { question: 'Pain level (1-10)?', answer: 'About a 4, mostly stiff.', timestamp: '2023-10-20T14:00:00Z', moodRating: 6 }
      ]
    },
    {
      id: 's5',
      patientId: 'p4',
      patient: patients[3],
      date: new Date().toISOString(), // Today (Simulating Ongoing if needed, or just recently started)
      durationMinutes: 90,
      status: SessionStatus.ONGOING,
      type: 'In-Person',
      clinicalNotes: 'Session currently in progress. Focusing on exposure therapy.',
      patientResponses: []
    }
  ];
};