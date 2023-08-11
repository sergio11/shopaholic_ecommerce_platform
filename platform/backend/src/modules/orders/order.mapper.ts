import { Injectable } from '@nestjs/common';
import { Mapper, createMap, forMember, mapFrom } from '@automapper/core';
import { OrderEntity } from './order.entity';
import { OrderResponseDto } from './dto/order-response.dto';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { OrderHasProductResponseDto } from './dto/order-has-product-response.dto';
import { OrderHasProductsEntity } from './order_has_products.entity';

@Injectable()
export class OrderProfile extends AutomapperProfile {

    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }
    
    override get profile() { 
        return (mapper: Mapper) => {
            createMap(mapper, OrderEntity, OrderResponseDto, 
                forMember(
                    (dest) => dest.orderHasProducts,
                    mapFrom((src) => this.mapper.mapArray(src.orderHasProducts, OrderHasProductsEntity, OrderHasProductResponseDto))
                  ))
        }
    }
}
