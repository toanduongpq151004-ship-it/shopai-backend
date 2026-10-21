import { BadRequestException, NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProductService } from '../product/product.service.js';
import type { IOrderRepository, OrderRecord } from './order.repository.js';
import { OrderService } from './order.service.js';

describe('OrderService', () => {
  let service: OrderService;
  const save = vi.fn();
  const findAll = vi.fn();
  const findByUserId = vi.fn();
  const findById = vi.fn();
  const updateStatus = vi.fn();
  const repository = {
    save,
    findAll,
    findByUserId,
    findById,
    updateStatus,
  } satisfies IOrderRepository;
  const productService = {
    findRawById: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    service = new OrderService(
      productService as unknown as ProductService,
      repository,
    );
  });

  it('calculates the total on the server and persists a PENDING order', async () => {
    productService.findRawById.mockReturnValue({
      id: 'backend_prod_0',
      price: 1_000_000,
    });
    const savedOrder: OrderRecord = {
      id: 'ORD-1',
      userId: 'user-1',
      total: 2_000_000,
      status: 'PENDING',
      createdAt: new Date(),
      items: [{ productId: 'backend_prod_0', quantity: 2, price: 1_000_000 }],
    };
    save.mockResolvedValue(savedOrder);

    await expect(
      service.createOrder(
        {
          items: [{ productId: 'backend_prod_0', quantity: 2 }],
          total: 2_000_000,
        },
        'user-1',
      ),
    ).resolves.toEqual(savedOrder);
    expect(save).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-1',
        total: 2_000_000,
        items: savedOrder.items,
      }),
    );
  });

  it('rejects a client total that differs from the server total', async () => {
    productService.findRawById.mockReturnValue({
      id: 'backend_prod_0',
      price: 1_000_000,
    });

    await expect(
      service.createOrder(
        {
          items: [{ productId: 'backend_prod_0', quantity: 2 }],
          total: 1_000,
        },
        'user-1',
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it("does not disclose another user's order", async () => {
    findById.mockResolvedValue({
      id: 'ORD-1',
      userId: 'other-user',
      total: 1,
      status: 'PENDING',
      createdAt: new Date(),
      items: [],
    });

    await expect(service.getOrderForUser('ORD-1', 'user-1')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('pays a pending order and keeps a paid order idempotent', async () => {
    const pending: OrderRecord = {
      id: 'ORD-1',
      userId: 'user-1',
      total: 1,
      status: 'PENDING',
      createdAt: new Date(),
      items: [],
    };
    const paid = { ...pending, status: 'PAID' };
    findById.mockResolvedValue(pending);
    updateStatus.mockResolvedValue(paid);

    await expect(service.payOrder('ORD-1', 'user-1')).resolves.toEqual(paid);
    expect(updateStatus).toHaveBeenCalledWith('ORD-1', 'PAID');
    findById.mockResolvedValue(paid);
    await expect(service.payOrder('ORD-1', 'user-1')).resolves.toEqual(paid);
  });
});
