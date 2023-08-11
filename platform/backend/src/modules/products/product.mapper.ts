import { Injectable } from '@nestjs/common';
import { Mapper, createMap, forMember, ignore, mapFrom } from '@automapper/core';
import { ProductEntity } from './product.entity';
import { ProductResponseDto } from './dto/product-response.dto';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { CategoryResponseDto } from '../categories/dto/category-response.dto';

@Injectable()
export class ProductProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
      }

    override get profile() {
        return (mapper) => {
          createMap(mapper, ProductEntity, ProductResponseDto, 
            forMember(
                (dest) => dest.image1Url,
                mapFrom((src) => src.image1)
            ),
            forMember(
                (dest) => dest.image2Url,
                mapFrom((src) => src.image2)
            ),
            forMember(
                (dest) => dest.category,
                mapFrom((src) => mapper.map(src.category, CategoryResponseDto))
            ))
        };
      }
}
