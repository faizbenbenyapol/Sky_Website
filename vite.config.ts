import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // ทำหน้าที่เดียวกับ nginx.conf ตอน dev/preview: Air4Thai ไม่ส่ง CORS header เบราว์เซอร์จึงเรียกตรงไม่ได้
    // `vite preview` ใช้ค่านี้ด้วยเพราะ preview.proxy ดึงจาก server.proxy โดยปริยาย
    proxy: {
      '/api/air4thai/getNewAQI_JSON.php': {
        target: 'https://air4thai.pcd.go.th',
        changeOrigin: true,
        // Air4Thai ส่ง certificate chain ผิด (ใบ Let's Encrypt แต่แนบ intermediate ของ Sectigo) ตรวจแล้วไม่ผ่าน
        secure: false,
        rewrite: () => '/services/getNewAQI_JSON.php',
      },
    },
  },
})
