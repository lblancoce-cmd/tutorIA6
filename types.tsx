

export interface User {
    name: string;
    email: string;
    avatar: string;
    isAdmin?: boolean;
}

export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswerIndex: number;
    explanation: string;
}

export interface Topic {
    id: string;
    title: string;
    description: string;
    initialMessage: string;
    icon?: string;
    rewardIcon?: string;
    questions: QuizQuestion[];
}

export interface HolidayInfo {
    isHoliday: boolean;
    name?: string;
}

export interface AuditLogEntry {
    timestamp: string;
    user: string;
    action: string;
    details: string;
}

export interface Message {
    id: string;
    role: 'user' | 'model';
    text: string;
}