import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';

@Controller('api/products')
@ApiTags('Products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getProducts() {
    return this.productService.getAllProducts();
  }

  @Post()
  createProduct(@Body() dto: CreateProductDto) {
    return {
      message: 'Dữ liệu hợp lệ, đã nhận sản phẩm',
      data: dto,
    };
  }
  @Get(':id') // GET /api/products/backend_prod_3
  getProductById(@Param('id') id: string) {
    // @Param trích đoạn ':id' trong URL ra thành biến — tương đương Route Params của
    // React Navigation ở Chương 5, chỉ khác là nó đi qua đường dây mạng.
    return this.productService.getProductById(id);
  }
}
