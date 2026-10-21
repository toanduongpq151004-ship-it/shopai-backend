import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';
import { PRODUCT_CATALOG } from '../src/product/product.catalog.js';
import { PrismaService } from '../src/prisma/prisma.service.js';

describe('Products API (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const prisma = app.get(PrismaService);
    await Promise.all(
      PRODUCT_CATALOG.map((product) =>
        prisma.product.upsert({
          where: { id: product.id },
          update: product,
          create: product,
        }),
      ),
    );
  });

  it('GET /api/products returns the seeded ShopAI catalogue', async () => {
    const firstResponse = await request(app.getHttpServer())
      .get('/api/products')
      .expect(200);

    expect(firstResponse.body).toHaveLength(PRODUCT_CATALOG.length);
    expect(firstResponse.body[0]).toMatchObject({
      id: 'backend_prod_0',
      name: 'iPhone 15 Pro 128GB',
    });

    return request(app.getHttpServer())
      .get('/api/products')
      .expect(200)
      .expect(firstResponse.body);
  });

  afterEach(async () => {
    await app.close();
  });
});
