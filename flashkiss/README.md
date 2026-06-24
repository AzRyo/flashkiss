# Flashkiss Booth

Dashboard photobooth Flashkiss. Dua mode bagi hasil dan pribadi, kustomisasi harga, dan kiosk pembayaran QRIS. Dibuat dengan Next.js.

## Jalankan di komputer
1. npm install
2. npm run dev
3. Buka http://localhost:3000

## Deploy ke Vercel (cara GitHub)
1. Upload folder ini ke sebuah repository GitHub.
2. Buka vercel.com, New Project, Import repository tadi.
3. Framework terdeteksi otomatis Next.js. Klik Deploy.

## Deploy ke Vercel (cara CLI, tanpa GitHub)
1. npm i -g vercel
2. Di dalam folder ini jalankan: vercel
3. Ikuti pertanyaannya, lalu: vercel --prod

## Catatan
Data masih contoh di dalam aplikasi. Pembayaran masih simulasi.
Penyambungan database Supabase dan backend Midtrans menyusul di fase berikutnya.
