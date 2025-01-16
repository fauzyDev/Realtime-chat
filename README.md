# Realtime Chat App

Aplikasi Realtime Chat ini dibangun menggunakan Next.js dan TypeScript, dengan integrasi login melalui Google menggunakan NextAuth. Data disimpan di Supabase sebagai cloud database. Aplikasi ini memiliki fitur seperti login, chat umum (all chat), dan chat personal.

## Fitur

- **Login dengan Google**: Menggunakan NextAuth untuk autentikasi pengguna.
- **Chat All**: Semua pengguna dapat berkomunikasi di ruang obrolan umum.
- **Chat Personal**: Kirim pesan pribadi ke pengguna lain.
- **Realtime Database**: Menggunakan Supabase untuk sinkronisasi data secara realtime.

## Teknologi yang Digunakan

- **Framework**: [Next.js](https://nextjs.org/)
- **Bahasa**: TypeScript
- **Autentikasi**: [NextAuth](https://next-auth.js.org/)
- **Database**: [Supabase](https://supabase.com/)
- **UI Components**: Chakra UI

## Instalasi dan Penggunaan

### Prasyarat

Pastikan Anda memiliki:
- Node.js >= 20
- Akun Supabase untuk konfigurasi database
- Kredensial Google OAuth untuk autentikasi

### Langkah-langkah Instalasi

1. Clone repositori ini:
   ```bash
   git clone https://github.com/FauzyDev/realtime-chat-app.git
   cd realtime-chat-app
   ```

2. Instal dependensi:
   ```bash
   npm install
   ```

3. Buat file `.env` di root proyek dan tambahkan variabel berikut:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

4. Jalankan aplikasi dalam mode pengembangan:
   ```bash
   npm run dev
   ```

5. Buka browser dan akses [http://localhost:3000](http://localhost:3000).

## Kontribusi

Kontribusi sangat diterima! Jika Anda ingin menambahkan fitur atau memperbaiki bug, silakan buat pull request atau buka issue baru.

## Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).

---

Dibuat dengan oleh Fauzy.
