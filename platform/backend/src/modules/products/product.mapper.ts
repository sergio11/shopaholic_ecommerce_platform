import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ProductEntity } from './product.entity';
import { ProductResponseDto } from './dto/product-response.dto';
import { CategoryMapper } from '../categories/category.mapper';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { BrandsMapper } from '../brands/brands.mapper';
import { StorageMixin } from '../storage/mixin/file-saving.mixin';
import { ImageResponseDto } from '../images/dto/image-response.dto';

@Injectable()
export class ProductMapper {
  /**
   * Creates an instance of ProductMapper.
   * @param categoryMapper - An instance of CategoryMapper.
   * @param brandsMapper - An instance of BrandsMapper.
   * @param storageMixin - An instance of StorageMixin
   */
  constructor(
    private readonly categoryMapper: CategoryMapper,
    private readonly brandsMapper: BrandsMapper,
    private readonly storageMixin: StorageMixin
  ) {}

  /**
   * Maps a ProductEntity instance to a ProductResponseDto instance.
   * @param product - The ProductEntity instance to map.
   * @returns The mapped ProductResponseDto instance.
   */
  async mapProductToResponseDto(product: ProductEntity): Promise<ProductResponseDto> {
    const productDto = plainToClass(ProductResponseDto, product, {
      excludeExtraneousValues: true,
      exposeUnsetFields: false,
    });
    if (product.category) {
      productDto.category = await this.categoryMapper.mapCategoryToResponseDto(
        product.category,
      );
    }
    if (product.brand) {
      productDto.brand = await this.brandsMapper.mapBrandToResponseDto(product.brand);
    }
    if (product.mainImage) {
      const url = await this.storageMixin.getImageUrl(product.mainImage.storageId);
      if (url) {
        const imageResponseDto = new ImageResponseDto();
        imageResponseDto.url = url;
        productDto.mainImage = imageResponseDto;
      }
    }
    if (product.secondaryImage) {
      const url = await this.storageMixin.getImageUrl(product.secondaryImage.storageId);
      if (url) {
        const imageResponseDto = new ImageResponseDto();
        imageResponseDto.url = url;
        productDto.secondaryImage = imageResponseDto;
      }
    }
    return productDto;
  }

  /**
   * Maps an array of ProductEntity instances to an array of ProductResponseDto instances.
   * @param products - The array of ProductEntity instances to map.
   * @returns The array of mapped ProductResponseDto instances.
   */
  async mapProductsToResponseDtos(products: ProductEntity[]): Promise<ProductResponseDto[]> {
    const responseDtos: ProductResponseDto[] = [];
    for (const product of products) {
      const productResponseDto = await this.mapProductToResponseDto(product);
      responseDtos.push(productResponseDto);
    }
    return responseDtos;
  }

  /**
   * Maps a CreateProductDto instance to a ProductEntity instance.
   * @param dto - The CreateProductDto instance to map.
   * @returns The mapped ProductEntity instance.
   */
  mapCreateProductDtoToEntity(dto: CreateProductDto): ProductEntity {
    return plainToClass(ProductEntity, dto);
  }

  /**
   * Maps an UpdateProductDto instance to an existing ProductEntity instance.
   * @param dto - The UpdateProductDto instance to map.
   * @param entity - The existing ProductEntity instance to update.
   * @returns The updated ProductEntity instance.
   */
  mapUpdateProductDtoToEntity(
    dto: UpdateProductDto,
    entity: ProductEntity,
  ): ProductEntity {
    return Object.assign(entity, plainToClass(ProductEntity, dto));
  }
}
