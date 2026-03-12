import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  updateProfile
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { AuthResponse } from '../types';
import api from './api';

export const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;
        const token = await firebaseUser.getIdToken();
        
        // Sync with backend to get/create local user profile
        const response = await api.post<AuthResponse>('/auth/sync', {
            email: firebaseUser.email,
            firebaseUid: firebaseUser.uid,
            name: firebaseUser.displayName
        });
        
        return {
            token,
            user: response.data.user
        };
    } catch (error: any) {
        console.error('Login Error:', error);
        throw new Error(error.code === 'auth/invalid-credential' ? 'Invalid email or password' : error.message);
    }
};

export const register = async (email: string, password: string, name?: string): Promise<AuthResponse> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;
        
        if (name) {
            await updateProfile(firebaseUser, { displayName: name });
        }
        
        const token = await firebaseUser.getIdToken();
        
        // Sync with backend
        const response = await api.post<AuthResponse>('/auth/sync', {
            email: firebaseUser.email,
            firebaseUid: firebaseUser.uid,
            name: name || firebaseUser.displayName
        });
        
        return {
            token,
            user: response.data.user
        };
    } catch (error: any) {
        console.error('Registration Error:', error);
        throw new Error(error.code === 'auth/email-already-in-use' ? 'Email already in use' : error.message);
    }
};

export const signInWithGoogle = async (): Promise<AuthResponse> => {
    // Dynamically import signInWithPopup here if desired, or export at the top (we'll assume top for this change)
    const { signInWithPopup } = await import('firebase/auth');
    const { auth, googleProvider } = await import('../config/firebase');

    try {
        const result = await signInWithPopup(auth, googleProvider);
        const firebaseUser = result.user;
        const token = await firebaseUser.getIdToken();

        // Sync with backend (creates user if they don't exist)
        const response = await api.post<AuthResponse>('/auth/sync', {
            email: firebaseUser.email,
            firebaseUid: firebaseUser.uid,
            name: firebaseUser.displayName
        });

        return {
            token,
            user: response.data.user
        };
    } catch (error: any) {
        console.error('Google Sign-In Error:', error);
        throw new Error(error.message || 'Failed to sign in with Google');
    }
};

export const logout = async (): Promise<void> => {
    await firebaseSignOut(auth);
};
