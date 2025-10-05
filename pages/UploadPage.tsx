
import React, { useState, useRef } from 'react';
import Header from '../components/Header';
import { useAuth } from '../hooks/useAuth';
import { MATA_PELAJARAN } from '../constants';
import { uploadProof } from '../services/api';

const UploadPage: React.FC = () => {
    const { user, navigateTo } = useAuth();
    const [subject, setSubject] = useState(MATA_PELAJARAN[0]);
    const [photo, setPhoto] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setPhoto(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!photo || !user) return;
        
        setIsLoading(true);
        setUploadStatus(null);

        try {
            const response = await uploadProof(user.nis, subject, photo);
            setUploadStatus({ type: 'success', message: response.message });
            setTimeout(() => {
                navigateTo('dashboard');
            }, 2000);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Gagal mengunggah bukti.";
            setUploadStatus({ type: 'error', message });
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
            <Header />
            <main className="p-4 sm:p-6 md:p-8">
                <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                    <button onClick={() => navigateTo('dashboard')} className="text-sky-500 hover:text-sky-600 mb-4 flex items-center space-x-2">
                        <i className="fa-solid fa-arrow-left"></i>
                        <span>Kembali ke Dashboard</span>
                    </button>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Unggah Bukti Belajar</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">Unggah foto catatan pelajaranmu. Catatan akan dievaluasi oleh guru mata pelajaran.</p>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Mata Pelajaran</label>
                            <select id="subject" value={subject} onChange={e => setSubject(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md bg-white dark:bg-slate-700">
                                {MATA_PELAJARAN.map(s => <option key={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Foto Catatan</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    {preview ? (
                                        <img src={preview} alt="Preview" className="mx-auto h-48 w-auto rounded-md object-contain" />
                                    ) : (
                                        <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                    <div className="flex text-sm text-slate-600 dark:text-slate-400">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-slate-800 rounded-md font-medium text-sky-600 hover:text-sky-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 dark:ring-offset-slate-900 focus-within:ring-sky-500">
                                            <span>Ambil foto</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" capture="environment" ref={fileInputRef} onChange={handleFileChange} />
                                        </label>
                                        <p className="pl-1">atau pilih dari galeri</p>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-500">PNG, JPG, GIF hingga 10MB</p>
                                </div>
                            </div>
                        </div>

                        {uploadStatus && (
                            <div className={`p-3 rounded-md text-sm ${uploadStatus.type === 'success' ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200'}`}>
                                {uploadStatus.message}
                            </div>
                        )}

                        <button type="submit" disabled={!photo || isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-sky-400 disabled:cursor-not-allowed">
                            {isLoading ? 'Mengunggah...' : 'Unggah Bukti'}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default UploadPage;
