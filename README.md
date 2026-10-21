# ShopAI Backend — Chương 9

Backend NestJS cho ứng dụng React Native ShopAI. Dự án triển khai các nội dung Sprint Chương 9: Products API, Gemini AI proxy, DTO/ValidationPipe, JWT Guard, Orders lưu SQLite qua Prisma, Swagger, Helmet và rate limiting.

## Yêu cầu

- Node.js 20+ (đã kiểm tra với Node 24)
- Một file `.env` tạo từ `.env.example`

## Khởi động

```bash
cp .env.example .env
# Điền JWT_SECRET và GEMINI_API_KEY vào .env
npm install
npm run db:migrate
npm run db:seed
npm run start:dev
```

Server lắng nghe trên `0.0.0.0` và dùng `PORT` trong `.env` (mặc định `3000`). Khi chạy trên điện thoại thật, Mobile phải dùng IP LAN của máy, ví dụ `http://192.168.1.15:3000`, không dùng `localhost`.

## API chính

- `GET /api/products`, `GET /api/products/:id`
- `POST /api/auth/register`, `POST /api/auth/login`
- `POST /api/orders`, `GET /api/orders`, `GET /api/orders/:id`, `POST /api/orders/:id/pay` — bắt buộc Bearer JWT
- `POST /api/ai/chat` — Gemini key chỉ nằm ở Backend
- Swagger: `http://localhost:3000/api/docs`

Tài khoản seed: `demo@shopai.com` / `123456`.

## Kiểm tra

```bash
npm run lint
npm run build
npm test
npm run test:e2e
```

Prisma Client được tự tạo bởi `postinstall`. Nếu sửa `prisma/schema.prisma`, chạy lại `npm run prisma:generate` rồi tạo migration mới bằng `npm run db:migrate`.
