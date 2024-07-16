import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from '../models/product.entity';
import AppError from '../utils/appError';
import { authMiddleware } from 'src/middleware/auth.middleware';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';

@UseGuards(authMiddleware)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * @description Get all products controller
   * @route `/api/v1/product/all`
   * @access PRIVATE
   * @type GET
   */
  @Get('all')
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Product[]> {
    try {
      const products = await this.productService.findAll();
      return products;
    } catch (error) {
      throw new AppError(
        'Failed to retrieve products',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * @description Get one product controller
   * @route `/api/v1/product/:id`
   * @access PRIVATE
   * @type GET
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: number): Promise<Product> {
    try {
      const product = await this.productService.findOne(id);
      if (!product) {
        throw new AppError('Product not found', HttpStatus.NOT_FOUND);
      }
      return product;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        'Failed to retrieve product',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * @description create product controller
   * @route `/api/v1/product/create`
   * @access PRIVATE
   * @type POST
   */
  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProductDto: CreateProductDto): Promise<any> {
    try {
      const product = await this.productService.create(createProductDto);

      return {
        status: HttpStatus.CREATED,
        message: 'Product created successfully',
        success: true,
        product,
      };
    } catch (error) {
      throw new AppError(
        'Failed to create product',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * @description Update a product controller
   * @route `/api/v1/product/:id`
   * @access PRIVATE
   * @type PUT
   */
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<any> {
    try {
      const updatedProduct = await this.productService.update(
        id,
        updateProductDto,
      );
      if (!updatedProduct) {
        throw new AppError('Product not found', HttpStatus.NOT_FOUND);
      }
      return {
        status: HttpStatus.OK,
        message: 'Product updated successfully',
        success: true,
        updatedProduct,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        'Failed to update product',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * @description Delete a product controller
   * @route `/api/v1/product/:id`
   * @access PRIVATE
   * @type DELETE
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: number): Promise<any> {
    try {
      const result = await this.productService.remove(id);
      return {
        status: HttpStatus.OK,
        message: 'Product deleted successfully',
        success: true,
        result,
      };
    } catch (error) {
      throw new AppError(
        'Failed to delete product',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
