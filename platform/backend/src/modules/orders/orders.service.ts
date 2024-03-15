import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { OrderEntity } from './order.entity';
import { SupportService } from 'src/core/support.service';
import { I18nService } from 'nestjs-i18n';
import { OrderResponseDto } from './dto/order-response.dto';
import { OrderStatus } from './order-status.enum';
import { OrderMapper } from './order.mapper';
import { Pagination, paginate } from 'nestjs-typeorm-paginate';
import { CreateOrderDto } from './dto/create-order.dto';
import { UserEntity } from '../users/user.entity';
import { AddressEntity } from '../address/address.entity';
import { ProductEntity } from '../products/product.entity';
import { OrderHasProductsEntity } from './order_has_products.entity';

@Injectable()
export class OrdersService extends SupportService {
  

  constructor(
    @InjectRepository(OrderEntity)
    private readonly ordersRepository: Repository<OrderEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(AddressEntity)
    private readonly addressRepository: Repository<AddressEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly mapper: OrderMapper,
    i18n: I18nService,
  ) {
    super(i18n);
  }

  /**
   * Fetches all orders along with associated user, address, and products information.
   * @returns {Promise<OrderResponseDto[]>} - The array of order response DTOs.
   */
  async findAll(): Promise<OrderResponseDto[]> {
    const orders = await this.ordersRepository.find({
      relations: ['user', 'address', 'orderHasProducts.product'],
    });
    return this.mapper.mapOrdersToResponseDtos(orders);
  }

  /**
   * Searches and paginates orders based on a search term.
   * @param term The search term to match against user's name, user's last name, or product name.
   * @param page The page number for pagination (default: 1).
   * @param limit The maximum number of items per page (default: 10).
   * @returns A Promise resolving to a Pagination object containing the paginated orders.
   */
  async searchAndPaginate(
    term: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<Pagination<OrderResponseDto>> {
    if (page < 1) {
      this.throwBadRequestException('PAGE_NUMBER_NOT_VALID');
    }

    if (limit < 1 || limit > 100) {
      this.throwBadRequestException('LIMIT_NUMBER_NOT_VALID');
    }

    const options = { page, limit };
    const queryBuilder = this.ordersRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'client')
      .orderBy('order.createdAt', 'DESC');

    if (term) {
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where('LOWER(client.name) LIKE LOWER(:term)', {
            term: `%${term}%`,
          }).orWhere('LOWER(client.lastname) LIKE LOWER(:term)', {
            term: `%${term}%`,
          })
        }),
      );
    }

    const paginatedOrders = await paginate(queryBuilder, options);
    const items = this.mapper.mapOrdersToResponseDtos(paginatedOrders.items);
    
    return {
      ...paginatedOrders,
      items,
    };
  }

  /**
   * Fetches orders for a specific client along with associated user, address, and products information.
   * @param {string} idClient - The ID of the client.
   * @returns {Promise<OrderResponseDto[]>} - The array of order response DTOs.
   */
  async findByClient(idClient: string): Promise<OrderResponseDto[]> {
    const orders = await this.ordersRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.address', 'address')
      .leftJoinAndSelect('order.orderHasProducts', 'orderHasProducts')
      .leftJoinAndSelect('orderHasProducts.product', 'product')
      .where('order.user.id = :idClient', { idClient })
      .getMany();
    return this.mapper.mapOrdersToResponseDtos(orders);
  }

  /**
   * Retrieves an order by its ID and the associated user ID.
   * 
   * @param {string} orderId - The ID of the order to retrieve.
   * @param {string} userId - The ID of the user associated with the order.
   * @returns {Promise<OrderResponseDto>} The retrieved order.
   */
  async findOne(orderId: string, userId: string): Promise<OrderResponseDto> {
    const user = await this.findUser(userId, ["roles"]);
    const order = await this.ordersRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.address', 'address')
      .leftJoinAndSelect('order.orderHasProducts', 'orderHasProducts')
      .leftJoinAndSelect('orderHasProducts.product', 'product')
      .where('order.id = :orderId', { orderId })
      .getOne();
    const isAdmin = user.roles.some(role => role.name === "ADMIN");
    if (!isAdmin && order.user.id !== userId) {
      throw this.throwForbiddenException('INVALID_CREDENTIALS');
    }
    return this.mapper.mapOrderToResponseDto(order);
  }

  /**
   * Cancels an order with the specified ID, provided the user has the necessary permissions.
   * @param {string} id - The ID of the order to be cancelled.
   * @param {string} idUser - The ID of the user requesting the cancellation.
   * @returns {Promise<string>} - A string indicating the result of the cancellation operation.
   * @throws {ForbiddenException} - If the user attempting to cancel the order is not the owner.
   */
  async cancelOrder(id: string, idUser: string): Promise<string> {
    const order = await this.findOrder(id, ["user"]);
    // Check if the authenticated user is the owner of the order
    if (order.user.id !== idUser) {
      this.throwForbiddenException('INVALID_CREDENTIALS');
    }
    if (order.status !== OrderStatus.PENDING) { 
      this.throwForbiddenException('INVALID_ORDER_STATUS');
    }
    order.status = OrderStatus.CANCELLED;
    await this.ordersRepository.save(order);
    return this.resolveString('ORDER_CANCELLED_SUCCESSFULLY');
  }

  /**
   * Deletes an order with the specified ID, provided the user has the necessary permissions.
   * @param {string} id - The ID of the order to be deleted.
   * @param {string} idUser - The ID of the user requesting the deletion.
   * @returns {Promise<string>} - A string indicating the result of the deletion operation.
   * @throws {ForbiddenException} - If the user attempting to delete the order is not the owner.
   */
  async deleteOrder(id: string, idUser: string): Promise<string> {
    const order = await this.findOrder(id, ["user"]);
    // Check if the authenticated user is the owner of the order
    if (order.user.id !== idUser) {
      this.throwForbiddenException('INVALID_CREDENTIALS');
    }
    if (order.status === OrderStatus.PENDING) { 
      this.throwForbiddenException('INVALID_ORDER_STATUS');
    }
    await this.ordersRepository.remove(order);
    return this.resolveString('ORDER_DELETED_SUCCESSFULLY');
  }

  /**
   * Creates a new order based on the provided order data.
   * @param createOrderDto The DTO containing information to create the order.
   * @returns A promise resolving to an OrderResponseDto representing the created order.
   */
  async createOrder(createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    if (!createOrderDto.products || createOrderDto.products.length === 0) {
      this.throwBadRequestException('Products list cannot be null or empty');
    }
    const client = await this.findUser(createOrderDto.idClient);
    const clientAddress = await this.findAddress(createOrderDto.idAddress);
    console.log("createOrderDto", createOrderDto);
    console.log("products", createOrderDto.products);
    const newOrder = new OrderEntity();
    newOrder.user = client;
    newOrder.address = clientAddress;
    newOrder.orderHasProducts = await Promise.all(createOrderDto.products.map(async product =>  {
      const orderHasProduct = new OrderHasProductsEntity();
      orderHasProduct.product = await this.findProduct(product.id);
      orderHasProduct.quantity = product.quantity;
      return orderHasProduct;
    }));
    const savedOrder = await this.ordersRepository.save(newOrder);
    return this.mapper.mapOrderToResponseDto(savedOrder);
  }

  /**
   * Finds an order by its ID.
   * @param {string} id - The ID of the order.
   * @returns {Promise<OrderEntity>} - The found order entity.
   */
  private async findOrder(id: string, relations?: string[]): Promise<OrderEntity> {
    return this.findEntityById(id, this.ordersRepository, 'ORDER_NOT_FOUND', relations);
  }

  /**
   * Finds a user by their ID.
   * @param id The ID of the user to find.
   * @returns A promise resolving to a UserEntity object if the user is found.
   * @throws Error if the user is not found in the database.
   */
  private async findUser(id: string, relations?: string[]): Promise<UserEntity> {
    return this.findEntityById(id, this.usersRepository, 'USER_NOT_FOUND', relations);
  }

  /**
   * Finds an address by its ID.
   * @param id The ID of the address to find.
   * @returns A promise resolving to an AddressEntity object if the address is found.
   * @throws Error if the address is not found in the database.
   */
  private async findAddress(id: string): Promise<AddressEntity> {
    return this.findEntityById(id, this.addressRepository, 'ADDRESS_NOT_FOUND');
  }

  /**
   * Finds a product by its ID.
   * @param id The ID of the product to find.
   * @returns A promise resolving to a ProductEntity object if the product is found.
   * @throws Error if the product is not found in the database.
   */
  private async findProduct(id: string): Promise<ProductEntity> {
    return this.findEntityById(id, this.productRepository, 'PRODUCT_NOT_FOUND');
  }
}
