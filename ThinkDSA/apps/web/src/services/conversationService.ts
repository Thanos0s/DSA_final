import api from './api';
import { Conversation, Message } from '../types';

export const sendMessage = async (content: string, problemId?: string, conversationId?: string): Promise<{ message: Message; conversationId: string }> => {
    const response = await api.post<{ message: Message; conversationId: string }>('/conversations/messages', {
        content,
        problemId,
        conversationId,
    });
    return response.data;
};

export const getHistory = async (conversationId: string): Promise<Conversation> => {
    const response = await api.get<Conversation>(`/conversations/${conversationId}`);
    return response.data;
};
