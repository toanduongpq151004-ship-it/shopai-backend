import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { PRODUCT_CATALOG } from '../src/product/product.catalog.js';

const databaseUrl = process.env.DATABASE_URL ?? 'file:./prisma/dev.db';
const sqliteUrl = databaseUrl === 'file:./dev.db' ? 'file:./prisma/dev.db' : databaseUrl;
const prisma = new PrismaClient({ adapter: new PrismaBetterSqlite3({ url: sqliteUrl }) });

async function main() {
  const hashedPassword = await bcrypt.hash('123456', 10); // 10 = độ phức tạp (salt rounds)

  await prisma.user.upsert({
    where: { email: 'demo@shopai.com' },
    update: {},
    create: {
      email: 'demo@shopai.com',
      password: hashedPassword, // Lưu bản ĐÃ HASH, không bao giờ lưu '123456' dạng thường
      name: 'Học viên Demo',
    },
  });

  await Promise.all(
    PRODUCT_CATALOG.map((product) =>
      prisma.product.upsert({
        where: { id: product.id },
        update: product,
        create: product,
      }),
    ),
  );

  console.log('✅ Đã seed User demo: demo@shopai.com / 123456');
  console.log("✅ Đã seed 20 sản phẩm ShopAI");

  // ➕ TÙY CHỌN: seed luôn Product vào Database (Yêu cầu Nghiệm thu mục 13).
  // Ở Sprint 9 bắt buộc, Product vẫn phục vụ bằng in-memory (Bước 7c) nên đoạn dưới có thể bỏ qua.
  // const productCount = await prisma.product.count();
  // if (productCount === 0) {
  //   await prisma.product.createMany({
  //     data: Array.from({ length: 20 }).map((_, i) => ({
  //       id: `backend_prod_${i}`,
  //       name: `Sản phẩm từ NestJS Server ${i}`,
  //       price: 1000000 + i * 10000,
  //       image: `https://picsum.photos/id/${200 + i}/400/400`,
  //     })),
  //   });
  //   console.log('✅ Đã seed 20 Product vào Database');
  // }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
