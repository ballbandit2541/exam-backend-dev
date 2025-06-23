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

## รายละเอียดโปรเจค

Exam : Backend Developer (3) (Practical examination) 

1. สร้างระบบ Authentication ด้วย NestJS 
สร้างระบบ Login/Logout พร้อม JWT Authentication โดย:
1. มีฟีเจอร์ Register, Login, และ Logout
2. ใช้ JWT สำหรับการยืนยันตัวตน
3. Endpoint ที่ต้องพัฒนา: /auth/register, /auth/login, /auth/logout
4. เก็บข้อมูลผู้ใช้ในฐานข้อมูล MySQL

2. สร้าง API สำหรับจัดการสินค้า 
สร้าง REST API สำหรับจัดการสินค้า (CRUD) โดย:
1. ใช้ NestJS + TypeORM เชื่อมต่อ MySQL
2. Endpoint ที่ต้องพัฒนา: /products (POST, GET, PUT, DELETE)
3. เพิ่มการ Validate ข้อมูลก่อนบันทึก

3. เพิ่มระบบ Caching ด้วย Redis 
สร้างระบบ Caching สำหรับ API /products โดย:
1. ใช้ Redis เก็บ Cache ของข้อมูลสินค้าทั้งหมด
2. เมื่อมีการเพิ่ม/แก้ไข/ลบสินค้า ให้ล้าง Cache ที่เกี่ยวข้อง

4. ออกแบบระบบจัดการคำสั่งซื้อ 
พัฒนาระบบจัดการคำสั่งซื้อด้วย NestJS โดย:
1. ฐานข้อมูล MySQL มี Table: orders, order_items
2. Endpoint ที่ต้องพัฒนา: /orders (POST, GET)
3. ใช้ Transaction ในการบันทึกคำสั่งซื้อพร้อมรายการสินค้า

5. ออกแบบชื่อ Endpoint และตั้งชื่อตัวแปรในระบบ 
ออกแบบโครงสร้างชื่อ Endpoint และตัวแปรสำหรับระบบจัดการสินค้า โดย:
1. ชื่อ Endpoint ต้องเป็น RESTful
2. ตัวแปรในโค้ดต้องมีความหมายชัดเจน

6. สร้าง Middleware สำหรับ Logging 
พัฒนา Middleware สำหรับบันทึก Log ทุกครั้งที่มีการเรียกใช้งาน API โดย:
1. เก็บข้อมูล URL, HTTP Method, และ Response Time ลงในไฟล์
2. ใช้ NestJS Middleware

7. สร้าง Dynamic Module ใน NestJS
สร้าง Dynamic Module สำหรับการเชื่อมต่อฐานข้อมูล โดย:
1. รองรับการเชื่อมต่อหลายฐานข้อมูลพร้อมกัน
2. ใช้ Dynamic Module ของ NestJS

8. ระบบ Queue Management ด้วย Redis
สร้างระบบจัดการ Queue ในการส่ง Email โดย:
1. ใช้ Bull.js + Redis ในการจัดการ Queue
2. พัฒนา API สำหรับเพิ่มงานเข้า Queue และตรวจสอบสถานะ

9. ออกแบบระบบ Export ข้อมูลเป็นไฟล์ CSV 
พัฒนาฟีเจอร์ Export ข้อมูลสินค้าทั้งหมดเป็นไฟล์ CSV โดย:
1. ใช้ NestJS ในการพัฒนา
2. ดาวน์โหลดไฟล์ผ่าน Endpoint /products/export

10. เพิ่มระบบ Refresh Token 
พัฒนาระบบ Refresh Token ใน NestJS โดย:
1. เก็บ Refresh Token ในฐานข้อมูล MySQL
2. เพิ่ม Endpoint /auth/refresh สำหรับ Refresh Access Token


