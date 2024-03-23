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
import { StorageMixin } from '../storage/mixin/file-saving.mixin';

@Injectable()
export class OrderMapper {
  constructor(
    private readonly userMapper: UserMapper,
    private readonly addressMapper: AddressMapper,
    private readonly productMapper: ProductMapper,
    private readonly storageMixin: StorageMixin
  ) {}

  async mapOrderToResponseDto(order: OrderEntity): Promise<OrderResponseDto> {
    const orderDto = plainToClass(OrderResponseDto, order, {
      excludeExtraneousValues: true,
    });

    if (order.user) {
      orderDto.client = await this.userMapper.mapUserToResponseDto(order.user);
    }

    if (order.address) {
      orderDto.address = await this.addressMapper.mapAddressToResponseDto(
        order.address,
      );
    }

    if (order.orderHasProducts) {
      orderDto.orderHasProducts = await this.mapOrderHasProductsToResponseDtos(
        order.orderHasProducts,
      );
    }

    return orderDto;
  }

  async mapOrdersToResponseDtos(orders: OrderEntity[]): Promise<OrderResponseDto[]> {
    const responseDtos: OrderResponseDto[] = [];
    for (const order of orders) {
      // Calculating total amount
      const totalAmount = order.orderHasProducts.reduce((total, orderLine) => {
        return total + Number(orderLine.entryPrice) * orderLine.quantity;
      }, 0);
  
      // Calculating total products
      const totalProducts = order.orderHasProducts.length;
  
      // Map the order to response DTO and assign totalAmount and totalProducts
      const orderResponseDto = await this.mapOrderToResponseDto(order);
      orderResponseDto.totalAmount = totalAmount;
      orderResponseDto.totalProducts = totalProducts;
  
      responseDtos.push(orderResponseDto);
    }
    return responseDtos;
  }

  async mapOrderToPaymentDto(order: OrderEntity): Promise<CreatePaymentDto> {
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
  
    const cartItems = await Promise.all(order.orderHasProducts.map(async (lineOrder) => {
      const item = new CartItemDto();
      item.id = lineOrder.id;
      item.name = lineOrder.product.name;
      item.desc = lineOrder.product.description;
      item.price = lineOrder.product.price;
      item.image = await this.storageMixin.getImageUrl(lineOrder.product.mainImage.storageId)
      item.cartQuantity = lineOrder.quantity;
      return item;
    }));
  
    paymentDto.cartItems = cartItems;
  
    return paymentDto;
  }


  private async mapOrderHasProductToResponseDto(
    orderHasProduct: OrderHasProductsEntity,
  ): Promise<OrderHasProductResponseDto> {
    const orderHasProductDto = plainToClass(
      OrderHasProductResponseDto,
      orderHasProduct,
      { excludeExtraneousValues: true },
    );
    if(orderHasProduct.product) {
      orderHasProductDto.product = await this.productMapper.mapProductToResponseDto(orderHasProduct.product);
    }
    return orderHasProductDto;
  }

  private async mapOrderHasProductsToResponseDtos(
    orderHasProducts: OrderHasProductsEntity[]
  ): Promise<OrderHasProductResponseDto[]> {
    const responseDtos: OrderHasProductResponseDto[] = [];
    for (const orderHasProduct of orderHasProducts) {
      const orderHasProductResponseDto = await this.mapOrderHasProductToResponseDto(orderHasProduct);
      responseDtos.push(orderHasProductResponseDto);
    }
    return responseDtos;
  }
}
