
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header';
import QrScanner from '../components/QrScanner';
import { logAttendance } from '../services/api';
import { AttendanceType } from '../types';

const DashboardPage: React.FC = () => {
    const { user, navigateTo } = useAuth();
    const [isScanning, setIsScanning] = useState(false);
    const [scanResult, setScanResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleScanSuccess = async (decodedText: string) => {
        setIsScanning(false);
        setIsLoading(true);
        setScanResult(null);
        try {
            // QR code format is assumed to be "type:nis", e.g., "masuk:12345"
            const [type, nisFromQR] = decodedText.split(':');

            if (user && nisFromQR === user.nis && (type === 'masuk' || type === 'pulang')) {
                const attendanceType = type as AttendanceType;
                const response = await logAttendance(user.nis, attendanceType);
                setScanResult({ type: 'success', message: response.message });
            } else {
                throw new Error("QR code tidak valid atau tidak sesuai dengan data Anda.");
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : "Gagal memproses QR code.";
            setScanResult({ type: 'error', message });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleScanFailure = (error: string) => {
        // Only show error if scanning was active, to prevent initial load errors
        if (isScanning) {
            setIsScanning(false);
            setScanResult({ type: 'error', message: error });
        }
    };
    
    const startScanning = () => {
        setScanResult(null);
        setIsScanning(true);
    };

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
            <Header />
            <main className="p-4 sm:p-6 md:p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-8">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Selamat Datang, {user?.fullName}!</h2>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">Siap untuk belajar hari ini? Jangan lupa catat kehadiranmu.</p>
                    </div>

                    {isLoading && (
                        <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg mb-8">
                            <svg className="animate-spin mx-auto h-8 w-8 text-sky-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p className="mt-4 text-slate-600 dark:text-slate-400">Memproses absensi...</p>
                        </div>
                    )}

                    {scanResult && (
                        <div className={`p-4 rounded-lg mb-8 text-center ${scanResult.type === 'success' ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200'}`}>
                           <i className={`fa-solid ${scanResult.type === 'success' ? 'fa-check-circle' : 'fa-times-circle'} mr-2`}></i>
                           {scanResult.message}
                        </div>
                    )}
                    
                    {isScanning ? (
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-8">
                            <h3 className="text-xl font-bold text-center mb-4">Arahkan Kamera ke QR Code</h3>
                            <QrScanner onScanSuccess={handleScanSuccess} onScanFailure={handleScanFailure} />
                            <button onClick={() => setIsScanning(false)} className="mt-4 w-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-bold py-2 px-4 rounded-lg transition">
                                Batal
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <button onClick={startScanning} className="group flex flex-col items-center justify-center bg-sky-500 hover:bg-sky-600 text-white p-8 rounded-xl shadow-lg transition-transform transform hover:scale-105">
                                <i className="fa-solid fa-qrcode text-6xl mb-4 transition-transform group-hover:rotate-12"></i>
                                <span className="text-2xl font-bold">Scan Absensi</span>
                                <span className="text-sky-100">Catat kehadiran masuk & pulang</span>
                            </button>
                            <button onClick={() => navigateTo('upload')} className="group flex flex-col items-center justify-center bg-teal-500 hover:bg-teal-600 text-white p-8 rounded-xl shadow-lg transition-transform transform hover:scale-105">
                                <i className="fa-solid fa-camera-retro text-6xl mb-4 transition-transform group-hover:rotate-12"></i>
                                <span className="text-2xl font-bold">Unggah Bukti</span>
                                <span className="text-teal-100">Kirim foto catatan pelajaran</span>
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;
