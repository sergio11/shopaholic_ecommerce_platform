import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { BrandsEntity } from './brand.entity';
import { BrandResponseDTO } from './dto/brand-response.dto';
import { CreateBrandDTO } from './dto/create-brand.dto';
import { UpdateBrandDTO } from './dto/update-brand.dto';

@Injectable()
export class BrandsMapper {
  mapBrandToResponseDto(brand: BrandsEntity): BrandResponseDTO {
    return plainToClass(BrandResponseDTO, brand, { excludeExtraneousValues: true });
  }

  mapBrandsToResponseDtos(brands: BrandsEntity[]): BrandResponseDTO[] {
    return brands.map(brand => this.mapBrandToResponseDto(brand));
  }

  mapCreateBrandDtoToEntity(dto: CreateBrandDTO): BrandsEntity {
    return plainToClass(BrandsEntity, dto);
  }

  mapUpdateBrandDtoToEntity(dto: UpdateBrandDTO, entity: BrandsEntity): BrandsEntity {
    return Object.assign(entity, plainToClass(BrandsEntity, dto));
  }
}
