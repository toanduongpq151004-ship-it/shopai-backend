import { Test, TestingModule } from '@nestjs/testing';
import { vi } from 'vitest';
import { ProductController } from './product.controller.js';
import { ProductService } from './product.service.js';

describe('ProductController', () => {
  let controller: ProductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: { getAllProducts: vi.fn(), getProductById: vi.fn() },
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
