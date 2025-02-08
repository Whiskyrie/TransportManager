// Auth types
export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    phoneNumber: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
    phoneNumber: string;
    profilePicture: string | null;
    createdAt?: string;
    lastLogin?: string;
}

export interface UploadResponse {
    message: string;
    user: User;
  }

export interface AuthResponse {
    token: string;
    user: User;
}

export const isAdmin = (user: User | null): boolean => {
    return user?.isAdmin === true;
};

// Hook personalizado para verificar permissões
import { useCallback } from 'react';

export const usePermissions = (user: User | null) => {
    const checkPermission = useCallback(() => {
        if (!user) return false;
        return isAdmin(user);
    }, [user]);

    return {
        canEdit: checkPermission(),
        canDelete: checkPermission(),
        canAdd: checkPermission(),
    };
};