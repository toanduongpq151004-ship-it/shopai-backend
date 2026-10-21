import { Test, TestingModule } from '@nestjs/testing';
import { vi } from 'vitest';
import { AiController } from './ai.controller.js';
import { AiService } from './ai.service.js';

describe('AiController', () => {
  let controller: AiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiController],
      providers: [{ provide: AiService, useValue: { chat: vi.fn() } }],
    }).compile();

    controller = module.get<AiController>(AiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
