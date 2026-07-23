# Sky — สภาพอากาศเขตประเวศ

เว็บแอปพยากรณ์อากาศภาษาไทย สำหรับ 50 เขตในกรุงเทพมหานคร (ค่าเริ่มต้น: เขตประเวศ) ดึงข้อมูลสด ๆ จาก [Open-Meteo](https://open-meteo.com/) แบบไม่ต้องใช้ API key

Live: https://sky.benyapol.com

## ฟีเจอร์

- อุณหภูมิปัจจุบัน, อุณหภูมิที่รู้สึกได้, ความชื้น, ค่าฝุ่น PM2.5
- โอกาสฝนตกและช่วงเวลาที่ฝนจะตกหนักที่สุดในอีก 12 ชั่วโมงข้างหน้า
- พยากรณ์รายชั่วโมง (6 ช่วง ห่างกันช่วงละ 3 ชั่วโมง)
- คำแนะนำกิจกรรมตามสภาพอากาศ
- ค้นหาและสลับเขตได้ทั้ง 50 เขตของกรุงเทพฯ พร้อมจำตำแหน่งล่าสุดไว้ใน `localStorage`
- สถานะ loading (skeleton) และ error state พร้อมปุ่มลองใหม่

## Tech Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4
- lucide-react (ไอคอน)
- Open-Meteo Forecast / Air Quality / Geocoding API

## พัฒนาแบบ Local

```bash
npm install
npm run dev      # เปิด dev server พร้อม HMR
npm run build    # type-check + build production ไปที่ dist/
npm run preview  # ดูผล production build
npm run lint      # oxlint
```

## Deploy

รันเป็น Docker container (multi-stage build → nginx serve static files):

```bash
docker compose build
docker compose up -d
```

Container ฟังที่ `127.0.0.1:8083` และเข้าถึงผ่านโดเมนจริงด้วย Cloudflare Tunnel ที่ `sky.benyapol.com`
