
import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Header: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <header className="bg-white dark:bg-slate-800 shadow-md p-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
                <i className="fa-solid fa-user-check text-3xl text-sky-500"></i>
                <h1 className="text-xl font-bold text-slate-800 dark:text-white">SAVe SMASHA</h1>
            </div>
            {user && (
                <div className="flex items-center space-x-4">
                    <span className="hidden sm:inline text-slate-600 dark:text-slate-300">
                        Halo, <span className="font-semibold">{user.fullName.split(' ')[0]}</span>
                    </span>
                    <button 
                        onClick={logout}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 flex items-center space-x-2"
                    >
                        <i className="fa-solid fa-right-from-bracket"></i>
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            )}
        </header>
    );
};

export default Header;