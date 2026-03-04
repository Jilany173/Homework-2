
export type TabType = 'Speaking' | 'Listening' | 'Reading' | 'Writing';
export type WritingTaskType = 'Task 1' | 'Task 2';
export type UserRole = 'Super Admin' | 'Admin' | 'Moderator' | 'Teacher' | 'Student' | 'public_user';

export interface AttendanceRecord {
  userId: string;
  batchId: string;
  dayId: number;
  timestamp: string;
}

export interface Batch {
  id: string;
  name: string;
  type: 'HICU' | 'IELTS';
  startDate: string;
  endDate: string;
  teacherId?: string;
  maxStudents: number;
  currentStudents: number;
  status: 'Active' | 'Completed';
  bestStudentId?: string;
  progress?: number;
}

export interface StudentProgress {
  userId: string;
  username: string;
  completedDays: number[];
  overallPercentage: number;
  isFullyCompleted: boolean;
  isPresentToday?: boolean; // New field for attendance tracking
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
  batchId?: string;
  status: 'Active' | 'Expired' | 'Pending';
  isBestStudent?: boolean;
}

export interface HomeworkDay {
  id: number;
  label: string;
  completed: boolean;
}
