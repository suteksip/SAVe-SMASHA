
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const handleLogoutConfirm = () => {
        logout();
        setShowLogoutConfirm(false);
    };

    return (
        <>
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
                            onClick={() => setShowLogoutConfirm(true)}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 flex items-center space-x-2"
                        >
                            <i className="fa-solid fa-right-from-bracket"></i>
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                )}
            </header>

            {showLogoutConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" aria-modal="true" role="dialog">
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 m-4 max-w-sm w-full">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Konfirmasi Logout</h3>
                        <p className="mt-2 text-slate-600 dark:text-slate-400">Apakah Anda yakin ingin keluar?</p>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowLogoutConfirm(false)}
                                className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition"
                            >
                                Tidak
                            </button>
                            <button
                                onClick={handleLogoutConfirm}
                                className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
                            >
                                Ya
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;
