
import React, { useState, useCallback, useMemo } from 'react';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import { User, Page } from './types';
import { AuthContext } from './contexts/AuthContext';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('login');

  const navigateTo = useCallback((page: Page) => {
    setCurrentPage(page);
  }, []);

  const login = useCallback((userData: User) => {
    setUser(userData);
    navigateTo('dashboard');
  }, [navigateTo]);

  const logout = useCallback(() => {
    setUser(null);
    navigateTo('login');
  }, [navigateTo]);

  const authContextValue = useMemo(() => ({ user, login, logout, navigateTo }), [user, login, logout, navigateTo]);
  
  const renderPage = () => {
    if (!user) {
      return <LoginPage />;
    }
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'upload':
        return <UploadPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      <div className="min-h-screen font-sans text-slate-800 dark:text-slate-200">
        {renderPage()}
      </div>
    </AuthContext.Provider>
  );
};

export default App;
