import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { OrderEntity } from './order.entity';
import { OrderResponseDto } from './dto/order-response.dto';
import { OrderHasProductResponseDto } from './dto/order-has-product-response.dto';
import { UserMapper } from '../users/user.mapper';
import { OrderHasProductsEntity } from './order_has_products.entity';
import { AddressMapper } from '../address/address.mapper';
import { ProductMapper } from '../products/product.mapper';
import { CartItemDto, CreatePaymentDto, ShippingAddressDto } from '../payments/dto/create-payment.dto';

@Injectable()
export class OrderMapper {
  constructor(
    private readonly userMapper: UserMapper,
    private readonly addressMapper: AddressMapper,
    private readonly productMapper: ProductMapper
  ) {}

  mapOrderToResponseDto(order: OrderEntity): OrderResponseDto {
    const orderDto = plainToClass(OrderResponseDto, order, {
      excludeExtraneousValues: true,
    });

    if (order.user) {
      orderDto.client = this.userMapper.mapUserToResponseDto(order.user);
    }

    if (order.address) {
      orderDto.address = this.addressMapper.mapAddressToResponseDto(
        order.address,
      );
    }

    if (order.orderHasProducts) {
      orderDto.orderHasProducts = this.mapOrderHasProductsToResponseDtos(
        order.orderHasProducts,
      );
    }

    return orderDto;
  }

  mapOrdersToResponseDtos(orders: OrderEntity[]): OrderResponseDto[] {
    return orders.map((order) => this.mapOrderToResponseDto(order));
  }

  mapOrderToPaymentDto(order: OrderEntity): CreatePaymentDto {
    const paymentDto = new CreatePaymentDto();
    paymentDto.orderId = order.id;
    paymentDto.userId = order.user.id;
    paymentDto.language = order.user.language;

    const shippingAddressDto = new ShippingAddressDto();
    shippingAddressDto.email = order.user.email;
    shippingAddressDto.fullName = `${order.user.name} ${order.user.lastname}`;
    shippingAddressDto.phoneNumber = order.user.phone;
    shippingAddressDto.line1 = `${order.address.name} ${order.address.neighborhood}`;
    shippingAddressDto.country = order.address.country;
    shippingAddressDto.city = order.address.city;
    shippingAddressDto.state = order.address.state;
    shippingAddressDto.postalCode = order.address.postalCode;
    paymentDto.shippingAddress = shippingAddressDto;

    paymentDto.cartItems = order.orderHasProducts.map(lineOrder => {
      const item = new CartItemDto();
      item.id = lineOrder.id;
      item.name = lineOrder.product.name;
      item.desc = lineOrder.product.description;
      item.price = lineOrder.product.price;
      item.image = lineOrder.product.mainImage.url;
      item.cartQuantity = lineOrder.quantity;
      return item;
    });

    return paymentDto;
  }


  private mapOrderHasProductToResponseDto(
    orderHasProduct: OrderHasProductsEntity,
  ): OrderHasProductResponseDto {
    const orderHasProductDto = plainToClass(
      OrderHasProductResponseDto,
      orderHasProduct,
      { excludeExtraneousValues: true },
    );
    if(orderHasProduct.product) {
      orderHasProductDto.product = this.productMapper.mapProductToResponseDto(orderHasProduct.product);
    }
    return orderHasProductDto;
  }

  private mapOrderHasProductsToResponseDtos(
    orderHasProducts: OrderHasProductsEntity[],
  ): OrderHasProductResponseDto[] {
    return orderHasProducts.map((orderHasProduct) =>
      this.mapOrderHasProductToResponseDto(orderHasProduct),
    );
  }
}
