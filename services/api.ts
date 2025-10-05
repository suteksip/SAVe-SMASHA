
import { User, AttendanceType } from '../types';

// --- Mock Database ---
const DUMMY_USERS: (User & { password_hash: string })[] = [
  { id: 1, nis: "12345", fullName: "Budi Santoso", class: "XII-A", password_hash: "$2y$10$dummyhash.user.budi" },
  { id: 2, nis: "67890", fullName: "Citra Lestari", class: "XII-B", password_hash: "$2y$10$dummyhash.user.citra" },
];

// In a real app, this would use password_verify() on the server.
// For the prototype, we just check if the password is 'password'.
const verifyPassword = (password: string, hash: string): boolean => {
    return password === 'password';
}

// --- API Functions ---
export const loginUser = (nis: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const user = DUMMY_USERS.find(u => u.nis === nis);
            if (user && verifyPassword(password, user.password_hash)) {
                const { password_hash, ...userData } = user;
                resolve(userData);
            } else {
                reject(new Error("NIS atau password salah."));
            }
        }, 1000);
    });
};

export const logAttendance = (nis: string, type: AttendanceType): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`[API] Absen dicatat: NIS=${nis}, Tipe=${type}`);
            const message = type === AttendanceType.MASUK 
                ? "Absen masuk berhasil dicatat. Selamat belajar!"
                : "Absen pulang berhasil dicatat. Sampai jumpa besok!";
            resolve({ success: true, message });
        }, 1000);
    });
};

export const uploadProof = (nis: string, subject: string, photo: File): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`[API] Bukti diunggah: NIS=${nis}, Mata Pelajaran=${subject}, File=${photo.name}`);
            resolve({ success: true, message: "Bukti belajar berhasil diunggah." });
        }, 1500);
    });
};
