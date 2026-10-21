import { Module } from '@nestjs/common';
import { ProductController } from './product.controller.js';
import { ProductService } from './product.service.js';

@Module({
  controllers: [ProductController], // Đăng ký "người tiếp tân" của Module này
  providers: [ProductService], // Đăng ký Service vào IoC Container để có thể Inject được
  exports: [ProductService],
})
export class ProductModule {}
