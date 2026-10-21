import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors(); // Bật để test qua Postman Web/Chrome hoặc phòng khi có Admin Web sau này — KHÔNG phải để "mở khóa" cho Mobile.

  // ➕ MỚI: Trạm kiểm soát dữ liệu vào — áp dụng cho TOÀN BỘ endpoint, không cần khai báo lại từng chỗ
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Client gửi thừa field lạ -> tự động cắt bỏ
      forbidNonWhitelisted: true, // Gửi field lạ thì báo lỗi 400 luôn cho minh bạch
      transform: true, // Bật class-transformer: JSON -> instance DTO, tự ép kiểu
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('ShopAI API')
    .setDescription('Backend phục vụ App React Native ShopAI (Chương 9)')
    .setVersion('1.0')
    .addBearerAuth() // Hiện ô nhập JWT — dùng thật ngay ở đây vì Guard (Phần 9.7) đã hoạt động
    .build();
  SwaggerModule.setup(
    'api/docs',
    app,
    SwaggerModule.createDocument(app, swaggerConfig),
  );

  // "0.0.0.0" = lắng nghe TẤT CẢ card mạng (Wifi, LAN...) của máy tính.
  // Nếu chỉ ghi app.listen(3000) mặc định là 127.0.0.1 -> Điện thoại thật
  // trong cùng Wifi sẽ KHÔNG BAO GIỜ kết nối được, dù IP có đúng! (Đây mới là bẫy thật của Mobile — xem lại Phần 9.4)
  await app.listen(Number(process.env.PORT) || 3000, '0.0.0.0');
}
void bootstrap();
