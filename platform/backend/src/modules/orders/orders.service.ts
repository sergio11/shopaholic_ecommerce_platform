import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from './order.entity';
import { SupportService } from 'src/core/support.service';
import { I18nService } from 'nestjs-i18n';
import { OrderResponseDto } from './dto/order-response.dto';
import { OrderStatus } from './order-status.enum';
import { OrderMapper } from './order.mapper';
import { IStorageService, STORAGE_SERVICE } from '../storage/storage.service';

@Injectable()
export class OrdersService extends SupportService {
    /**
     * Constructor of the OrdersService class.
     * @param {Repository<OrderEntity>} ordersRepository - The repository for OrderEntity.
     * @param {IStorageService} storageService - The storage service.
     * @param {OrderMapper} mapper - The mapper for orders.
     * @param {I18nService} i18n - The internationalization service.
     */
    constructor(
        @InjectRepository(OrderEntity) private ordersRepository: Repository<OrderEntity>,
        @Inject(STORAGE_SERVICE)
        storageService: IStorageService,
        private readonly mapper: OrderMapper,
        i18n: I18nService
    ) {
        super(i18n, storageService);
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
     * Updates the status of an order to PAID.
     * @param {string} id - The ID of the order.
     * @returns {Promise<OrderResponseDto>} - The updated order response DTO.
     */
    async updateStatus(id: string): Promise<OrderResponseDto> {
        const orderFound = await this.findOrder(id);
        orderFound.status = OrderStatus.PAID;
        const updatedOrder = await this.ordersRepository.save(orderFound);
        return this.mapper.mapOrderToResponseDto(updatedOrder);
    }

    /**
     * Finds an order by its ID.
     * @param {string} id - The ID of the order.
     * @returns {Promise<OrderEntity>} - The found order entity.
     */
    private async findOrder(id: string): Promise<OrderEntity> {
        const orderFound = await this.ordersRepository.findOne({ where: { id } });
        if (!orderFound) {
            this.throwNotFoundException('ORDER_NOT_FOUND');
        }
        return orderFound;
    }
}
