import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { BrandsEntity } from './brand.entity';
import { BrandResponseDTO } from './dto/brand-response.dto';
import { CreateBrandDTO } from './dto/create-brand.dto';
import { UpdateBrandDTO } from './dto/update-brand.dto';
import { StorageMixin } from '../storage/mixin/file-saving.mixin';
import { ImageResponseDto } from '../images/dto/image-response.dto';

@Injectable()
export class BrandsMapper {

  constructor(private readonly storageMixin: StorageMixin) {}

  async mapBrandToResponseDto(brand: BrandsEntity): Promise<BrandResponseDTO> {
    const brandResponseDto = plainToClass(BrandResponseDTO, brand, {
      excludeExtraneousValues: true,
    });
    if(brand.image) {
      const url = await this.storageMixin.getImageUrl(brand.image.storageId);
      if (url) {
        const imageResponseDto = new ImageResponseDto();
        imageResponseDto.url = url;
        brandResponseDto.image = imageResponseDto;
      }
    }
    return brandResponseDto;
  }

  async mapBrandsToResponseDtos(brands: BrandsEntity[]): Promise<BrandResponseDTO[]> {
    const responseDtos: BrandResponseDTO[] = [];
    for (const brand of brands) {
      const brandResponseDto = await this.mapBrandToResponseDto(brand);
      responseDtos.push(brandResponseDto);
    }
    return responseDtos;
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
