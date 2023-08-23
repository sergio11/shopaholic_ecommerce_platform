import {
  Get,
  Param,
  Post,
  Body,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  UploadedFiles,
  Version,
  Put,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtRole } from '../auth/jwt/jwt-role';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ProductEntity } from './product.entity';
import { API } from 'src/config/config';
import {
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { ProductResponseDto } from './dto/product-response.dto';
import { DefaultUploadFileValidationDecorator } from 'src/core/decorator/default-file.decorator';
import { Auth } from '../auth/decorator/auth.decorator';
import { ApiController } from 'src/core/decorator/default-api.decorator';
import { CreateProductReviewDto } from './dto/create-product-review.dto';
import { UpdateProductReviewDto } from './dto/update-product-review.dto';
import { ProductReviewResponseDto } from './dto/product-review-response.dto';
import { ProductReviewService } from './products-review.service';
import { AuthUserId } from '../auth/decorator/auth-user-id.decorator';

/**
 * Controller handling CRUD operations for products.
 */
@ApiController('products')
export class ProductsController {
  /**
   * Constructs the ProductsController.
   * @param productsService - The injected ProductsService instance.
   * @param productReviewService - The injected ProductReviewService instance.
   */
  constructor(
    private readonly productsService: ProductsService,
    private readonly productReviewService: ProductReviewService,
  ) {}

  /**
   * Retrieves a list of all products.
   * @returns An array of ProductResponseDto representing all products.
   */
  @Auth(JwtRole.ADMIN, JwtRole.CLIENT)
  @Version('1.0')
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Retrieved all products.',
    type: ProductResponseDto,
    isArray: true,
  })
  async findAll(): Promise<ProductResponseDto[]> {
    return this.productsService.findAll();
  }

  /**
   * Search for products based on a search term and paginate the results.
   * @param {string} term - The search term to filter products by.
   * @param {number} page - The page number for pagination (default is 1).
   * @param {number} limit - The number of items per page (default is 10).
   * @returns {Promise<Pagination<ProductResponseDto>>} - A paginated result of ProductResponseDto.
   */
  @Auth(JwtRole.ADMIN, JwtRole.CLIENT)
  @Get('search')
  @ApiOperation({ summary: 'Search for products based on a search term and paginate the results' })
  @ApiQuery({ name: 'term', required: true, description: 'Search term for filtering products' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', type: Number })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Filtered and paginated products',
    type: ProductResponseDto,
    isArray: true,
  })
  async searchAndPaginate(
    @Query('term') term: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<Pagination<ProductResponseDto>> {
    return this.productsService.searchAndPaginate(term, page, limit);
  }

  /**
   * Retrieves products by category.
   * @param id_category - The ID of the category.
   * @returns An array of ProductResponseDto representing products in the category.
   */
  @Auth(JwtRole.ADMIN, JwtRole.CLIENT)
  @Version('1.0')
  @Get('category/:id_category')
  @ApiResponse({
    status: 200,
    description: 'Retrieved products by category.',
    type: ProductResponseDto,
    isArray: true,
  })
  async findByCategory(
    @Param('id_category') id_category: string,
  ): Promise<ProductResponseDto[]> {
    return this.productsService.findByCategory(id_category);
  }

  /**
   * Retrieves products by name.
   * @param name - The product name or part of it.
   * @returns An array of ProductResponseDto matching the provided name.
   */
  @Auth(JwtRole.ADMIN, JwtRole.CLIENT)
  @Version('1.0')
  @Get('search/:name')
  @ApiResponse({
    status: 200,
    description: 'Retrieved products by name.',
    type: ProductResponseDto,
    isArray: true,
  })
  async findByName(@Param('name') name: string): Promise<ProductResponseDto[]> {
    return this.productsService.findByName(name);
  }

  /**
   * Creates a new product with associated images.
   * @param mainImageFile - Main product image file.
   * @param secondaryImageFile - Secondary product image file.
   * @param product - The product data.
   * @returns The created ProductResponseDto.
   */
  @Auth(JwtRole.ADMIN)
  @Post()
  @DefaultUploadFileValidationDecorator({
    uploadFields: [
      { name: 'mainImageFile', maxCount: 1 },
      { name: 'secondaryImageFile', maxCount: 1 },
    ],
  })
  @Version('1.0')
  @ApiResponse({
    status: 201,
    description: 'Product created successfully.',
    type: ProductResponseDto,
  })
  async create(
    @UploadedFiles()
    files: {
      mainImageFile: Express.Multer.File;
      secondaryImageFile: Express.Multer.File;
    },
    @Body() productData: CreateProductDto,
  ): Promise<ProductResponseDto> {
    const product = {
      ...productData,
      mainImageFile: files.mainImageFile,
      secondaryImageFile: files.secondaryImageFile,
    };
    return this.productsService.create(product);
  }

  /**
   * Updates a product by ID with associated images.
   * @param mainImageFile - Main product image file.
   * @param secondaryImageFile - Secondary product image file.
   * @param id - The ID of the product to update.
   * @param product - The updated product data.
   * @returns The updated ProductResponseDto.
   */
  @Auth(JwtRole.ADMIN)
  @Version('1.0')
  @Post(':id')
  @DefaultUploadFileValidationDecorator({
    uploadFields: [
      { name: 'mainImageFile', maxCount: 1 },
      { name: 'secondaryImageFile', maxCount: 1 },
    ],
    isOptional: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully.',
    type: ProductResponseDto,
  })
  async update(
    @UploadedFiles()
    files: {
      mainImageFile?: Express.Multer.File;
      secondaryImageFile?: Express.Multer.File;
    },
    @Param('id') id: string,
    @Body() productData: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    const product = {
      ...productData,
      mainImageFile: files.mainImageFile,
      secondaryImageFile: files.secondaryImageFile,
    };
    return this.productsService.update(id, product);
  }

  /**
   * Deletes a product by ID.
   * @param id - The ID of the product to delete.
   */
  @Auth(JwtRole.ADMIN)
  @Version('1.0')
  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Product deleted successfully.' })
  async delete(@Param('id') id: string) {
    return this.productsService.delete(id);
  }

  /**
   * Like a product.
   * @param reviewId - The ID of the product to like.
   * @param userId - The ID of the authenticated user.
   * @returns A Promise indicating success.
   */
  @Auth(JwtRole.ADMIN, JwtRole.CLIENT)
  @Version('1.0')
  @Post(':id/like')
  @ApiResponse({ status: 200, description: 'Product liked successfully.' })
  async like(
    @Param('id') idProduct: string,
    @AuthUserId() userId: string,
  ): Promise<string> {
    return await this.productsService.like(idProduct, userId);
  }

  /**
   * Dislike a product.
   * @param idProduct - The ID of the product to dislike.
   * @param userId - The ID of the authenticated user.
   * @returns A Promise indicating success.
   */
  @Auth(JwtRole.ADMIN, JwtRole.CLIENT)
  @Version('1.0')
  @Post(':id/dislike')
  @ApiResponse({ status: 200, description: 'Product disliked successfully.' })
  async dislike(
    @Param('id') idProduct: string,
    @AuthUserId() userId: string,
  ): Promise<string> {
    return await this.productsService.dislike(idProduct, userId);
  }

  @ApiOperation({ summary: 'Get reviews for a product' })
  @ApiOkResponse({
    status: 200,
    description: 'Reviews retrieved successfully.',
    type: [ProductReviewResponseDto],
  })
  @ApiNotFoundResponse({ description: 'Product not found.' })
  @Version('1.0')
  @Get(':id/reviews')
  async getProductReviews(
    @Param('id') idProduct: string,
  ): Promise<ProductReviewResponseDto[]> {
    return this.productReviewService.getProductReviews(idProduct);
  }

  /**
   * Creates a new review for a product.
   * @param idProduct - The ID of the product to review.
   * @param idAuthUser - The id of the authenticated user.
   * @param createReviewDto - Review data.
   * @returns The created ProductReviewResponseDto.
   */
  @ApiOperation({ summary: 'Creates a new review for a product' })
  @ApiBody({ type: CreateProductReviewDto })
  @ApiResponse({
    status: 201,
    description: 'Review created successfully.',
    type: ProductReviewResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Product not found.' })
  @Auth(JwtRole.ADMIN, JwtRole.CLIENT)
  @Version('1.0')
  @Post(':id/reviews')
  async createReview(
    @Param('id') idProduct: string,
    @AuthUserId() idAuthUser: string,
    @Body() createReviewDto: CreateProductReviewDto,
  ): Promise<ProductReviewResponseDto> {
    const review = {
      ...createReviewDto,
      idUser: idAuthUser,
      idProduct: idProduct,
    };
    return this.productReviewService.create(review);
  }

  /**
   * Updates an existing review for a product.
   * @param idProduct - The ID of the product.
   * @param reviewId - The ID of the review to update.
   * @param idAuthUser - The id of the authenticated user.
   * @param updateReviewDto - Updated review data.
   * @returns The updated ProductReviewEntity.
   */
  @ApiOperation({ summary: 'Updates an existing review for a product' })
  @ApiBody({ type: UpdateProductReviewDto })
  @ApiResponse({
    status: 200,
    description: 'Review updated successfully.',
    type: ProductReviewResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Review or product not found.' })
  @Auth(JwtRole.ADMIN, JwtRole.CLIENT)
  @Version('1.0')
  @Put(':id/reviews/:reviewId')
  async updateReview(
    @Param('id') idProduct: string,
    @Param('reviewId') reviewId: string,
    @AuthUserId() idAuthUser: string,
    @Body() updateReviewDto: UpdateProductReviewDto,
  ): Promise<ProductReviewResponseDto> {
    const review = {
      ...updateReviewDto,
      idUser: idAuthUser,
      idProduct: idProduct,
    };
    return this.productReviewService.update(reviewId, review);
  }

  /**
   * Deletes a review for a product.
   * @param reviewId - The ID of the review to delete.
   */
  @ApiOperation({ summary: 'Deletes a review for a product' })
  @ApiResponse({ status: 200, description: 'Review deleted successfully.' })
  @ApiNotFoundResponse({ description: 'Review not found.' })
  @Auth(JwtRole.ADMIN, JwtRole.CLIENT)
  @Version('1.0')
  @Delete('reviews/:reviewId')
  async deleteReview(@Param('reviewId') reviewId: string): Promise<string> {
    return await this.productReviewService.delete(reviewId);
  }

  /**
   * Like a product review.
   * @param reviewId - The ID of the review to like.
   * @param userId - The ID of the authenticated user.
   * @returns A Promise indicating success.
   */
  @Auth(JwtRole.ADMIN, JwtRole.CLIENT)
  @Version('1.0')
  @Post('reviews/:reviewId/like')
  @ApiResponse({ status: 200, description: 'Review liked successfully.' })
  async likeReview(
    @Param('reviewId') reviewId: string,
    @AuthUserId() userId: string,
  ): Promise<string> {
    return await this.productReviewService.likeReview(reviewId, userId);
  }

  /**
   * Dislike a product review.
   * @param reviewId - The ID of the review to dislike.
   * @param userId - The ID of the authenticated user.
   * @returns A Promise indicating success.
   */
  @Auth(JwtRole.ADMIN, JwtRole.CLIENT)
  @Version('1.0')
  @Post('reviews/:reviewId/dislike')
  @ApiResponse({ status: 200, description: 'Review disliked successfully.' })
  async dislikeReview(
    @Param('reviewId') reviewId: string,
    @AuthUserId() userId: string,
  ): Promise<string> {
    return await this.productReviewService.dislikeReview(reviewId, userId);
  }
}
