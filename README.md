# Exam Backend Dev

## การติดตั้งและรันโปรแกรมด้วย Docker

### ข้อกำหนดเบื้องต้น

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### ขั้นตอนการติดตั้ง

1. Clone โปรเจค

```bash
git clone https://github.com/ballbandit2541/exam-backend-dev.git
cd exam-backend-dev
```

2. สร้างและรัน Docker containers

```bash
docker-compose build --no-cache
docker-compose up -d
```

3. ตรวจสอบสถานะของ containers

```bash
docker-compose ps
```

### Services ที่รันใน Docker

- **Backend API**: เข้าถึงได้ที่ http://localhost:3000
- **MySQL Main**: ฐานข้อมูลหลัก (พอร์ต 3306)
- **MySQL Log**: ฐานข้อมูลสำหรับเก็บ Log (พอร์ต 3307)
- **Redis**: สำหรับ Email Queue และ Caching (พอร์ต 6379)

## การพัฒนาแบบ Local (ไม่ใช้ Docker)

1. ติดตั้ง dependencies

```bash
npm install
```

2. แก้ไขไฟล์ `.env` ให้ชี้ไปที่ localhost แทน service names

3. รันโปรแกรม

```bash
npm run start:dev
```

โปรแกรมจะทำงานที่ http://localhost:3000



