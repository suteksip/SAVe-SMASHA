import React, { useState, useCallback, useMemo, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import { User, Page } from './types';
import { AuthContext } from './contexts/AuthContext';
import { supabase } from './services/supabase';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        if (profile) {
          setUser({
            id: profile.id,
            nis: profile.nis,
            fullName: profile.full_name,
            class: profile.class,
          });
          setCurrentPage('dashboard');
        }
      }
      setLoadingSession(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setUser(null);
        setCurrentPage('login');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const navigateTo = useCallback((page: Page) => {
    setCurrentPage(page);
  }, []);

  const login = useCallback((userData: User) => {
    setUser(userData);
    navigateTo('dashboard');
  }, [navigateTo]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    // onAuthStateChange will handle setting user to null and navigation
  }, []);

  const authContextValue = useMemo(() => ({ user, login, logout, navigateTo }), [user, login, logout, navigateTo]);
  
  const renderPage = () => {
    if (loadingSession) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <svg className="animate-spin h-10 w-10 text-sky-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      );
    }

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