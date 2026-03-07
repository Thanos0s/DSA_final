import { create } from 'zustand';
import { User, AuthResponse } from '../types';

interface AuthState {
    user: User | null;
    token: string | null;
    setAuth: (auth: AuthResponse) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

export const useAuthStore = create<AuthState>((set) => {
    // Initialize from local storage
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    let user = null;
    if (userStr) {
        try {
            user = JSON.parse(userStr);
        } catch (e) {
            console.error('Failed to parse user from local storage');
        }
    }

    return {
        user,
        token,
        isAuthenticated: !!token,
        setAuth: (auth: AuthResponse) => {
            localStorage.setItem('token', auth.token);
            localStorage.setItem('user', JSON.stringify(auth.user));
            set({ user: auth.user, token: auth.token, isAuthenticated: true });
        },
        logout: () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            set({ user: null, token: null, isAuthenticated: false });
        },
    };
});
