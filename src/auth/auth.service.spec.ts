import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PrismaService } from '../prisma/prisma.service.js';
import { AuthService } from './auth.service.js';

describe('AuthService', () => {
  const user = {
    id: 'user-1',
    email: 'demo@shopai.com',
    password: '',
    name: 'Học viên Demo',
  };
  const prisma = {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  };
  const jwtService = { signAsync: vi.fn() };
  let service: AuthService;

  beforeEach(async () => {
    user.password = await bcrypt.hash('123456', 4);
    prisma.user.findUnique.mockReset();
    prisma.user.create.mockReset();
    jwtService.signAsync.mockReset();
    jwtService.signAsync.mockResolvedValue('signed-token');
    service = new AuthService(
      prisma as unknown as PrismaService,
      jwtService as JwtService,
    );
  });

  it('issues a JWT for valid credentials', async () => {
    prisma.user.findUnique.mockResolvedValue(user);

    await expect(
      service.login({ email: user.email, password: '123456' }),
    ).resolves.toEqual({
      accessToken: 'signed-token',
      user: { id: user.id, email: user.email, name: user.name },
    });
    expect(jwtService.signAsync).toHaveBeenCalledWith({
      sub: user.id,
      email: user.email,
    });
  });

  it('does not disclose whether an email exists when login fails', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(
      service.login({ email: user.email, password: '123456' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('rejects a duplicate email during registration', async () => {
    prisma.user.findUnique.mockResolvedValue(user);

    await expect(
      service.register({ email: user.email, password: '123456' }),
    ).rejects.toThrow(ConflictException);
  });
});
