import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { BrandsEntity } from './brand.entity';
import { BrandResponseDTO } from './dto/brand-response.dto';
import { CreateBrandDTO } from './dto/create-brand.dto';
import { UpdateBrandDTO } from './dto/update-brand.dto';
import { ImageMapper } from '../images/image.mapper';

@Injectable()
export class BrandsMapper {

  constructor(private readonly imageMapper: ImageMapper) {}

  mapBrandToResponseDto(brand: BrandsEntity): BrandResponseDTO {
    const brandResponseDto = plainToClass(BrandResponseDTO, brand, {
      excludeExtraneousValues: true,
    });
    if (brand.image) {
      const imageDto = this.imageMapper.mapImageToResponseDto(brand.image);
      brandResponseDto.image = imageDto;
    }
    return brandResponseDto;
  }

  mapBrandsToResponseDtos(brands: BrandsEntity[]): BrandResponseDTO[] {
    return brands.map((brand) => this.mapBrandToResponseDto(brand));
  }

  mapCreateBrandDtoToEntity(dto: CreateBrandDTO): BrandsEntity {
    return plainToClass(BrandsEntity, dto);
  }

  mapUpdateBrandDtoToEntity(
    dto: UpdateBrandDTO,
    entity: BrandsEntity,
  ): BrandsEntity {
    return Object.assign(entity, plainToClass(BrandsEntity, dto));
  }
}
