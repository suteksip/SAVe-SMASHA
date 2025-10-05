
import React from 'react';
import { User, Page } from '../types';

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  navigateTo: (page: Page) => void;
}

export const AuthContext = React.createContext<AuthContextType | null>(null);
