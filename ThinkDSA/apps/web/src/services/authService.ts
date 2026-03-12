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

export const logout = async (): Promise<void> => {
    await firebaseSignOut(auth);
};
