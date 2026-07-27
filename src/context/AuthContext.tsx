import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole } from '../types';
import { storageService } from '../services/storageService';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isCustomer: boolean;
  login: (email: string, role?: UserRole) => { success: boolean; message: string };
  register: (data: { name: string; email: string; phone?: string; role?: UserRole }) => { success: boolean; message: string };
  logout: () => void;
  quickLogin: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => storageService.getCurrentUser());

  useEffect(() => {
    storageService.setCurrentUser(user);
  }, [user]);

  const login = (email: string): { success: boolean; message: string } => {
    const users = storageService.getUsers();
    const foundUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
    if (foundUser) {
      setUser(foundUser);
      return { success: true, message: `Welcome back, ${foundUser.name}!` };
    }
    return { success: false, message: 'Account not found with this email address. Please register or use Quick Login.' };
  };

  const register = (data: { name: string; email: string; phone?: string; role?: UserRole }): { success: boolean; message: string } => {
    const users = storageService.getUsers();
    const exists = users.some((u) => u.email.toLowerCase() === data.email.toLowerCase().trim());
    if (exists) {
      return { success: false, message: 'An account with this email already exists!' };
    }

    const newUser: User = {
      id: 'usr_' + Date.now().toString(36),
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      role: data.role || 'customer',
      phone: data.phone || '',
      createdAt: new Date().toISOString(),
    };

    storageService.saveUser(newUser);
    setUser(newUser);
    return { success: true, message: 'Account created successfully!' };
  };

  const logout = () => {
    setUser(null);
    storageService.setCurrentUser(null);
  };

  const quickLogin = (role: UserRole) => {
    const users = storageService.getUsers();
    const targetUser = users.find((u) => u.role === role);
    if (targetUser) {
      setUser(targetUser);
    } else {
      const newUser: User = {
        id: role === 'admin' ? 'usr_admin_001' : 'usr_cust_001',
        name: role === 'admin' ? 'Vibe Admin' : 'Vibe Customer',
        email: role === 'admin' ? 'admin@vibestore.com' : 'customer@vibestore.com',
        role,
        createdAt: new Date().toISOString(),
      };
      storageService.saveUser(newUser);
      setUser(newUser);
    }
  };

  const isAdmin = user?.role === 'admin';
  const isCustomer = user?.role === 'customer';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isCustomer,
        login,
        register,
        logout,
        quickLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
