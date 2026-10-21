import { Module } from '@nestjs/common';
import { ProductModule } from '../product/product.module.js';
import { OrderController } from './order.controller.js';
import { PrismaOrderRepository } from './order.repository.js';
import { OrderService } from './order.service.js';

@Module({
  imports: [ProductModule],
  controllers: [OrderController],
  providers: [
    OrderService,
    { provide: 'IOrderRepository', useClass: PrismaOrderRepository },
  ],
})
export class OrderModule {}
