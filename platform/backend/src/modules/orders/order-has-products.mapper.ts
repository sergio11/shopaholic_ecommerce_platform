import { Injectable } from '@nestjs/common';
import { Mapper, createMap, forMember, mapFrom } from '@automapper/core';
import { OrderHasProductResponseDto } from './dto/order-has-product-response.dto';
import { ProductEntity } from '../products/product.entity';
import { OrderHasProductsEntity } from './order_has_products.entity';
import { ProductResponseDto } from '../products/dto/product-response.dto';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';

@Injectable()
export class OrderHasProductProfile extends AutomapperProfile {
    
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }
    
    override get profile() { 
        return (mapper: Mapper) => {
            createMap(
              mapper,
               OrderHasProductsEntity, 
               OrderHasProductResponseDto,
               forMember(
                  (dest) => dest.product,
                  mapFrom((src) => mapper.map(src.product, ProductEntity, ProductResponseDto))
                ))
        };
    }
}
