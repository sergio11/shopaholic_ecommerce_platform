import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from './order.entity';
import { SupportService } from 'src/core/support.service';
import { I18nService } from 'nestjs-i18n';
import { OrderResponseDto } from './dto/order-response.dto';
import { OrderStatus } from './order-status.enum';
import { OrderMapper } from './order.mapper';

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
        this.throwForbiddenException("INVALID_CREDENTIALS")
    }
    order.status = OrderStatus.CANCELLED;
    await this.ordersRepository.save(order);
    return this.resolveString("ORDER_CANCELLED_SUCCESSFULLY");
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
    return this.resolveString("ORDER_DELETED_SUCCESSFULLY");
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
