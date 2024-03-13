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

@Injectable()
export class OrdersService extends SupportService {
  /**
   * Constructor of the OrdersService class.
   * @param {Repository<OrderEntity>} ordersRepository - The repository for OrderEntity.
   * @param {OrderMapper} mapper - The mapper for orders.
   * @param {I18nService} i18n - The internationalization service.
   */
  constructor(
    @InjectRepository(OrderEntity)
    private ordersRepository: Repository<OrderEntity>,
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
    const orders = await this.ordersRepository.find({
      relations: ['user', 'address', 'orderHasProducts.product'],
      where: { idClient: idClient },
    });
    return this.mapper.mapOrdersToResponseDtos(orders);
  }

  /**
   * Cancel an order by ID.
   * @param {string} id - ID of the order to cancel.
   * @returns {Promise<void>}
   * @throws {NotFoundException} If the order is not found.
   * @throws {ForbiddenException} If the user is not the owner of the order.
   */
  async cancelOrder(id: string, idUser: string): Promise<string> {
    const order = await this.findOrder(id);
    // Check if the authenticated user is the owner of the order
    if (order.user.id !== idUser) {
      this.throwForbiddenException('INVALID_CREDENTIALS');
    }
    order.status = OrderStatus.CANCELLED;
    await this.ordersRepository.save(order);
    return this.resolveString('ORDER_CANCELLED_SUCCESSFULLY');
  }

  /**
   * Delete an order by ID.
   * @param {string} id - ID of the order to delete.
   * @returns {Promise<void>}
   * @throws {NotFoundException} If the order is not found.
   */
  async deleteOrder(id: string): Promise<string> {
    const order = await this.findOrder(id);
    await this.ordersRepository.remove(order);
    return this.resolveString('ORDER_DELETED_SUCCESSFULLY');
  }

  /**
   * Finds an order by its ID.
   * @param {string} id - The ID of the order.
   * @returns {Promise<OrderEntity>} - The found order entity.
   */
  private async findOrder(id: string): Promise<OrderEntity> {
    return this.findEntityById(id, this.ordersRepository, 'ORDER_NOT_FOUND');
  }
}
