
import { createClient } from '@supabase/supabase-js';

/*
 * =================================================================================
 * SCRIPT UNTUK IMPOR PENGGUNA KE SUPABASE
 * =================================================================================
 * 
 * PENJELASAN:
 * Skrip ini akan membaca data siswa dari CSV, membuat akun untuk setiap siswa di 
 * Supabase Authentication, lalu mengisi data profil mereka ke dalam tabel 'profiles'.
 * 
 * PERSIAPAN SEBELUM MENJALANKAN:
 * 1.  Install Node.js di komputer Anda jika belum ada.
 * 2.  Buka terminal atau command prompt di folder root proyek Anda.
 * 3.  Install dependency yang dibutuhkan dengan menjalankan perintah:
 *     npm install @supabase/supabase-js dotenv
 *     (dotenv digunakan untuk mengelola kunci API dengan aman)
 * 
 * 4.  Buat file baru di folder root proyek bernama `.env`
 * 
 * 5.  Isi file `.env` dengan kredensial Supabase Anda.
 *     - Buka project Supabase Anda -> Project Settings -> API.
 *     - Salin 'Project URL'.
 *     - Di bawah 'Project API Keys', salin kunci 'service_role'.
 *     - Isi file .env seperti ini:
 * 
 *     SUPABASE_URL=URL_PROYEK_ANDA
 *     SUPABASE_SERVICE_KEY=KUNCI_SERVICE_ROLE_ANDA
 * 
 *     PENTING: JANGAN PERNAH membagikan kunci `service_role` Anda atau menyimpannya
 *     di kode frontend. Kunci ini memiliki akses penuh ke database Anda.
 * 
 * CARA MENJALANKAN SCRIPT:
 * 1.  Install `ts-node` agar bisa menjalankan file TypeScript secara langsung:
 *     npm install -g ts-node
 * 2.  Jalankan skrip ini dari terminal dengan perintah:
 *     ts-node ./scripts/importUsers.ts
 * 
 * 3.  Skrip akan memproses setiap pengguna dan menampilkan log di terminal.
 * =================================================================================
 */

// Load environment variables from .env file
import * as dotenv from 'dotenv';
dotenv.config();

// Konfigurasi Klien Supabase (Admin)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase URL and Service Key are required. Please check your .env file.');
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Data CSV yang akan diimpor
const csvData = `email,NIS,NAMA SISWA,KELAS,password
ABDULLAHFAQIHSUTAWIJAYA11978@smasha.student.sch.id,11978,ABDULLAHFAQIHSUTAWIJAYA,X-IKM,password
GHANISFLICKALESMANA11979@smasha.student.sch.id,11979,GHANISFLICKALESMANA,X-IKM,password
ANANDAKHARISMASINTANURIYAH11990@smasha.student.sch.id,11990,ANANDAKHARISMASINTANURIYAH,X-IKM,password
MAHESWARISHONIAPRANATA11981@smasha.student.sch.id,11981,MAHESWARISHONIAPRANATA,X-IKM,password
MOCHAMMADEFFENDI11982@smasha.student.sch.id,11982,MOCHAMMADEFFENDI,X-IKM,password
M.IQBALMAULANA11983@smasha.student.sch.id,11983,M.IQBALMAULANA,X-IKM,password
MUCHAMMADRAFLIFARDHANI11984@smasha.student.sch.id,11984,MUCHAMMADRAFLIFARDHANI,X-IKM,password
CHOIRUNNISA11987@smasha.student.sch.id,11987,CHOIRUNNISA,X-IKM,password
DEFIKARAHMAADHCHIYAH11988@smasha.student.sch.id,11988,DEFIKARAHMAADHCHIYAH,X-IKM,password
ELFIAKAILANISA11989@smasha.student.sch.id,11989,ELFIAKAILANISA,X-IKM,password
FITRIYATUALIYAH11990@smasha.student.sch.id,11990,FITRIYATUALIYAH,X-IKM,password
KHOLILATULKHOIROH11992@smasha.student.sch.id,11992,KHOLILATULKHOIROH,X-IKM,password
NELMAALIZAAMELIA11995@smasha.student.sch.id,11995,NELMAALIZAAMELIA,X-IKM,password
SINTADWINURROHMAH11997@smasha.student.sch.id,11997,SINTADWINURROHMAH,X-IKM,password
ALFIANIZAMIRA11985@smasha.student.sch.id,11985,ALFIANIZAMIRA,X-IKM,password
SALZANABILA11996@smasha.student.sch.id,11996,SALZANABILA,X-IKM,password
ASROFAHANDAYANI11986@smasha.student.sch.id,11986,ASROFAHANDAYANI,X-IKM,password
HISYAMRAFIFARDHANI11991@smasha.student.sch.id,11991,HISYAMRAFIFARDHANI,X-IKM,password
M.DAFFINIQOBINTANGDIANDRA11993@smasha.student.sch.id,11993,M.DAFFINIQOBINTANGDIANDRA,X-IKM,password
MUHAMMADZAKARIYAFACHRIANSYAH11994@smasha.student.sch.id,11994,MUHAMMADZAKARIYAFACHRIANSYAH,X-IKM,password
ALIVIYAHNURKHUMAIROH11998@smasha.student.sch.id,11998,ALIVIYAHNURKHUMAIROH,X-IKM,password
ALIAJASMINEVIQONIA11959@smasha.student.sch.id,11959,ALIAJASMINEVIQONIA,XI-IKM,password
ARWANIABDULLAHARIF11960@smasha.student.sch.id,11960,ARWANIABDULLAHARIF,XI-IKM,password
ASAAN-YAHDIYANISABILA11961@smasha.student.sch.id,11961,ASAAN-YAHDIYANISABILA,XI-IKM,password
AURANAJWAALI11962@smasha.student.sch.id,11962,AURANAJWAALI,XI-IKM,password
AURATRIKURNIA11963@smasha.student.sch.id,11963,AURATRIKURNIA,XI-IKM,password
ISTIQOMAHNURAZIZAH11964@smasha.student.sch.id,11964,ISTIQOMAHNURAZIZAH,XI-IKM,password
M.AZZAMAQILAAL-AZKAR.11965@smasha.student.sch.id,11965,M.AZZAMAQILAAL-AZKAR.,XI-IKM,password
MUHAMMADHILALFAUZAN11966@smasha.student.sch.id,11966,MUHAMMADHILALFAUZAN,XI-IKM,password
MUHAMMADASYRAFWIDJANARKO11967@smasha.student.sch.id,11967,MUHAMMADASYRAFWIDJANARKO,XI-IKM,password
NAYLAAZIZAHISLAMI11968@smasha.student.sch.id,11968,NAYLAAZIZAHISLAMI,XI-IKM,password
NURALFIANISAANGGRAENI11969@smasha.student.sch.id,11969,NURALFIANISAANGGRAENI,XI-IKM,password
LINTANGADIPRIYONGGO11972@smasha.student.sch.id,11972,LINTANGADIPRIYONGGO,XI-IKM,password
MOCHAMADTHORIQMALIGHANFIRDAUS11976@smasha.student.sch.id,11976,MOCHAMADTHORIQMALIGHANFIRDAUS,XI-IKM,password
APRILIAVALENYUSTININGSIH11936@smasha.student.sch.id,11936,APRILIAVALENYUSTININGSIH,XII-MIPA,password
FRISKAAMALIACITRANINGTYAS11937@smasha.student.sch.id,11937,FRISKAAMALIACITRANINGTYAS,XII-MIPA,password
RAYAPRAMBANCANASIWI11943@smasha.student.sch.id,11943,RAYAPRAMBANCANASIWI,XII-MIPA,password
RENDYNURPRADANA11944@smasha.student.sch.id,11944,RENDYNURPRADANA,XII-MIPA,password
RESTIRISACHALISTA11945@smasha.student.sch.id,11945,RESTIRISACHALISTA,XII-MIPA,password
RAHMANULQUR'AN11974@smasha.student.sch.id,11974,RAHMANULQUR'AN,XII-MIPA,password
AGHISTAHANADJIYANAYLA11948@smasha.student.sch.id,11948,AGHISTAHANADJIYANAYLA,XII-MIPA,password
CHERYELBRILLIANTNAYA11949@smasha.student.sch.id,11949,CHERYELBRILLIANTNAYA,XII-MIPA,password
FRINDAFATMAWATY11950@smasha.student.sch.id,11950,FRINDAFATMAWATY,XII-MIPA,password
LYLYANURRAHMAWATY11951@smasha.student.sch.id,11951,LYLYANURRAHMAWATY,XII-MIPA,password
NAZANINPRICHELYAPUTRI11952@smasha.student.sch.id,11952,NAZANINPRICHELYAPUTRI,XII-MIPA,password
NURMAULIDIAHIKMAH11953@smasha.student.sch.id,11953,NURMAULIDIAHIKMAH,XII-MIPA,password
SALMAAMALIYATUSSHOLIHAH11954@smasha.student.sch.id,11954,SALMAAMALIYATUSSHOLIHAH,XII-MIPA,password
SITIFATIMAH11955@smasha.student.sch.id,11955,SITIFATIMAH,XII-MIPA,password
STAVADARAMADHANNUZULIM.11956@smasha.student.sch.id,11956,STAVADARAMADHANNUZULIM.,XII-MIPA,password
VINDYPUTRIOKTORIA11957@smasha.student.sch.id,11957,VINDYPUTRIOKTORIA,XII-MIPA,password
ZASKIAPUTRIPERNANU11958@smasha.student.sch.id,11958,ZASKIAPUTRIPERNANU,XII-MIPA,password
SANGSURYAAJIGUNA11975@smasha.student.sch.id,11975,SANGSURYAAJIGUNA,XII-MIPA,password
MUHAMMADNADHIFRASENDRIYARAMADHAN11977@smasha.student.sch.id,11977,MUHAMMADNADHIFRASENDRIYARAMADHAN,XII-MIPA,password
ADNANDARISAKHRONI11935@smasha.student.sch.id,11935,ADNANDARISAKHRONI,XII-IPS,password
LIVINADANIARNURHANA11939@smasha.student.sch.id,11939,LIVINADANIARNURHANA,XII-IPS,password
MOCHAMADFAIS11940@smasha.student.sch.id,11940,MOCHAMADFAIS,XII-IPS,password
MUHAMMADAKASHAISRAABGHANI11941@smasha.student.sch.id,11941,MUHAMMADAKASHAISRAABGHANI,XII-IPS,password
NAZWARIFAFIRDAUSI11942@smasha.student.sch.id,11942,NAZWARIFAFIRDAUSI,XII-IPS,password
ROMEMAROGEORGEPAEZ11947@smasha.student.sch.id,11947,ROMEMAROGEORGEPAEZ,XII-IPS,password
ZINEDINEMISHBAHIZZZAKY11971@smasha.student.sch.id,11971,ZINEDINEMISHBAHIZZZAKY,XII-IPS,password
NURFELINAFEBRIYUSANTI11973@smasha.student.sch.id,11973,NURFELINAFEBRIYUSANTI,XII-IPS,password
`;

// Fungsi utama untuk mengimpor pengguna
async function importUsers() {
    console.log('Memulai proses impor pengguna...');
    
    // Memisahkan data CSV menjadi baris-baris, dan melewati header
    const rows = csvData.trim().split('\n').slice(1);

    for (const row of rows) {
        // Memisahkan setiap baris menjadi kolom
        const [email, nis, fullName, studentClass, password] = row.split(',');

        // Mengabaikan baris kosong jika ada
        if (!email) continue;

        console.log(`--------------------------------------------------`);
        console.log(`Memproses pengguna: ${email.trim()}`);

        try {
            // Langkah 1: Buat pengguna di Supabase Auth
            const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
                email: email.trim(),
                password: password.trim(),
                email_confirm: true, // Otomatis konfirmasi email agar pengguna bisa langsung login
            });

            if (authError) {
                // Jika error, lempar ke blok catch
                throw new Error(`Error Auth: ${authError.message}`);
            }

            const user = authData.user;
            if (!user) {
                throw new Error('Gagal membuat pengguna, tidak ada objek pengguna yang dikembalikan.');
            }
            console.log(`  -> Pengguna ${user.email} berhasil dibuat dengan UID: ${user.id}`);

            // Langkah 2: Masukkan data profil ke tabel 'profiles'
            const { error: profileError } = await supabaseAdmin.from('profiles').insert({
                id: user.id, // Kunci utama (dan kunci asing ke auth.users)
                nis: nis.trim(),
                full_name: fullName.trim(),
                class: studentClass.trim(),
            });

            if (profileError) {
                // Jika gagal memasukkan profil, hapus pengguna yang sudah dibuat untuk menjaga konsistensi data
                console.warn(`  -> Gagal memasukkan profil, membatalkan pembuatan pengguna...`);
                await supabaseAdmin.auth.admin.deleteUser(user.id);
                throw new Error(`Error Profil: ${profileError.message}. Pembuatan pengguna dibatalkan.`);
            }

            console.log(`  -> Profil untuk ${fullName.trim()} berhasil dimasukkan.`);

        } catch (error) {
            // Menampilkan error yang terjadi untuk baris saat ini
            const message = error instanceof Error ? error.message : "Terjadi error tidak dikenal";
            console.error(`Gagal mengimpor pengguna ${email.trim()}: ${message}`);
        }
    }
    console.log(`--------------------------------------------------`);
    console.log('Proses impor pengguna selesai.');
}

// Menjalankan fungsi impor
importUsers();
