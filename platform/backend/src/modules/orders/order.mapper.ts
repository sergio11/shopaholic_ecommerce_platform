import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { OrderEntity } from './order.entity';
import { OrderResponseDto } from './dto/order-response.dto';
import { OrderHasProductResponseDto } from './dto/order-has-product-response.dto';
import { UserMapper } from '../users/user.mapper';
import { OrderHasProductsEntity } from './order_has_products.entity';
import { AddressMapper } from '../address/adress.mapper';

@Injectable()
export class OrderMapper {
  constructor(
    private readonly userMapper: UserMapper,
    private readonly addressMapper: AddressMapper
  ) {}

  mapOrderToResponseDto(order: OrderEntity): OrderResponseDto {
    const orderDto = plainToClass(OrderResponseDto, order, { excludeExtraneousValues: true });

    if (order.user) {
      orderDto.client = this.userMapper.mapUserToResponseDto(order.user);
    }

    if (order.address) {
      orderDto.address = this.addressMapper.mapAddressToResponseDto(order.address);
    }

    if (order.orderHasProducts) {
      orderDto.orderHasProducts = this.mapOrderHasProductsToResponseDtos(order.orderHasProducts);
    }

    return orderDto;
  }

  mapOrdersToResponseDtos(orders: OrderEntity[]): OrderResponseDto[] {
    return orders.map(order => this.mapOrderToResponseDto(order));
  }

  private mapOrderHasProductToResponseDto(orderHasProduct: OrderHasProductsEntity): OrderHasProductResponseDto {
    const orderHasProductDto = plainToClass(OrderHasProductResponseDto, orderHasProduct, { excludeExtraneousValues: true });
    return orderHasProductDto;
  }

  private mapOrderHasProductsToResponseDtos(orderHasProducts: OrderHasProductsEntity[]): OrderHasProductResponseDto[] {
    return orderHasProducts.map(orderHasProduct => this.mapOrderHasProductToResponseDto(orderHasProduct));
  }
}
