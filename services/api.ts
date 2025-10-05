import { User, AttendanceType } from '../types';
import { supabase } from './supabase';

// --- API Functions ---

// Note: For this to work, you must set up Row Level Security (RLS) policies in your Supabase project.
// 1. Enable RLS on `profiles`, `attendance`, `proofs` tables.
// 2. Policy for `profiles`: Allow authenticated users to read their own profile.
//    `CREATE POLICY "Allow authenticated users to read own profile" ON "public"."profiles" FOR SELECT TO authenticated USING (auth.uid() = id);`
// 3. Policy for `attendance` & `proofs`: Allow authenticated users to insert records for themselves.
//    `CREATE POLICY "Allow users to insert their own records" ON "public"."attendance" FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);`
//    `CREATE POLICY "Allow users to insert their own proofs" ON "public"."proofs" FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);`
// 4. Policy for Storage bucket 'proofs': Allow authenticated users to upload.
//    `CREATE POLICY "Allow authenticated uploads" ON storage.objects FOR INSERT TO authenticated WITH CHECK ( bucket_id = 'proofs' AND auth.uid() = (storage.foldername(name))[1]::uuid );`
//    (This assumes file path is like `{user_id}/{filename}`)


export const loginUser = async (nis: string, password: string): Promise<User> => {
    // Supabase uses email for login. We'll construct an email from the NIS.
    // In a real scenario, you would register users with this email format.
    const email = `${nis}@smasha.student.sch.id`;
    
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (signInError) {
        console.error('Sign-in error:', signInError);
        throw new Error("NIS atau Password salah. Mohon periksa kembali. Pastikan pengguna terdaftar di Supabase dengan email format 'NIS@smasha.student.sch.id'.");
    }

    if (!data.user) {
         throw new Error("Login gagal, pengguna tidak ditemukan.");
    }
    
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, nis, full_name, class')
        .eq('id', data.user.id)
        .single();
        
    if (profileError) {
        console.error('Profile fetch error:', profileError);
        throw new Error("Gagal mengambil data profil pengguna.");
    }

    return {
        id: profile.id,
        nis: profile.nis,
        fullName: profile.full_name,
        class: profile.class
    };
};

export const logAttendance = async (userId: string, type: AttendanceType): Promise<{ success: boolean; message: string }> => {
    const { error } = await supabase
        .from('attendance')
        .insert({ user_id: userId, type: type });

    if (error) {
        console.error('Log attendance error:', error);
        throw new Error("Gagal mencatat absensi.");
    }

    const message = type === AttendanceType.MASUK 
        ? "Absen masuk berhasil dicatat. Selamat belajar!"
        : "Absen pulang berhasil dicatat. Sampai jumpa besok!";
    return { success: true, message };
};

export const uploadProof = async (userId: string, subject: string, photo: File): Promise<{ success: boolean; message: string }> => {
    const fileExt = photo.name.split('.').pop();
    const fileName = `${subject.replace(/\s+/g, '-')}-${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('proofs') // The name of your storage bucket
        .upload(filePath, photo);

    if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw new Error("Gagal mengunggah foto bukti.");
    }

    const { error: dbError } = await supabase
        .from('proofs')
        .insert({ user_id: userId, subject: subject, photo_url: filePath });

    if (dbError) {
        console.error('Proof insert error:', dbError);
        // Attempt to remove the orphaned file from storage
        await supabase.storage.from('proofs').remove([filePath]);
        throw new Error("Gagal menyimpan data bukti ke database.");
    }
    
    return { success: true, message: "Bukti belajar berhasil diunggah." };
};