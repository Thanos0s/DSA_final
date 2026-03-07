import api from './api';
import { ExecutionResult } from '../types';

export const runCode = async (language: 'python' | 'javascript', code: string, input?: string): Promise<ExecutionResult> => {
    const response = await api.post<ExecutionResult>('/execute', { language, code, input });
    return response.data;
};
