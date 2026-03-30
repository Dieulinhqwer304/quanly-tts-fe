import React, { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { getProfile, UserProfile } from '../services/auth/profile';

interface AuthContextType {
    isAuthenticated: boolean;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
    profile: UserProfile | null;
    refreshProfile: () => Promise<UserProfile | null>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!Cookies.get('accessToken'));
    const [profile, setProfile] = useState<UserProfile | null>(null);

    const refreshProfile = useCallback(async () => {
        if (!Cookies.get('accessToken')) {
            setProfile(null);
            return null;
        }

        try {
            const response = await getProfile();
            const profileData = ((response as any)?.data || response || null) as UserProfile | null;
            setProfile(profileData);
            return profileData;
        } catch {
            setProfile(null);
            return null;
        }
    }, []);

    useEffect(() => {
        if (!isAuthenticated) {
            setProfile(null);
            return;
        }

        void refreshProfile();
    }, [isAuthenticated, refreshProfile]);

    const logout = () => {
        Cookies.remove('accessToken', { path: '/', domain: window.location.hostname });
        setProfile(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, profile, refreshProfile, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
