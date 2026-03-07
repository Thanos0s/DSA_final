import api from './api';
import { Problem } from '../types';

export const getProblems = async (): Promise<Problem[]> => {
    const response = await api.get<Problem[]>('/problems');
    return response.data;
};

export const getProblem = async (slug: string): Promise<Problem> => {
    const response = await api.get<Problem>(`/problems/${slug}`);
    return response.data;
};
