import { describe, expect, it, vi } from 'vitest';
import { OrderController } from './order.controller.js';

describe('OrderController', () => {
  it('passes the JWT user id to the order service', async () => {
    const orderService = { getOrdersForUser: vi.fn().mockResolvedValue([]) };
    const controller = new OrderController(orderService as never);

    await expect(
      controller.findMine({
        user: { userId: 'user-1', email: 'u@example.com' },
      } as never),
    ).resolves.toEqual([]);
    expect(orderService.getOrdersForUser).toHaveBeenCalledWith('user-1');
  });
});
