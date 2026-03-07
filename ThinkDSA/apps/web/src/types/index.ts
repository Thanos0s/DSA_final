export interface User {
    id: string;
    email: string;
    name?: string;
}

export interface Problem {
    id: string;
    title: string;
    slug: string;
    statement: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    topic: string;
}

export interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    createdAt: string;
}

export interface Conversation {
    id: string;
    problemId: string;
    userId: string;
    messages: Message[];
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface ExecutionResult {
    stdout: string;
    stderr: string;
}
