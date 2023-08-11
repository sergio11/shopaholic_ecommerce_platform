import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from './order.entity';
import { SupportService } from 'src/core/support.service';
import { I18nService } from 'nestjs-i18n';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { OrderResponseDto } from './dto/order-response.dto';
import { OrderStatus } from './order-status.enum'; // Asegúrate de importar el enumerado correcto

@Injectable()
export class OrdersService extends SupportService {
    constructor(
        @InjectRepository(OrderEntity) private ordersRepository: Repository<OrderEntity>,
        @InjectMapper() private readonly mapper: Mapper,
        i18n: I18nService
    ) {
        super(i18n);
    }

    async findAll(): Promise<OrderResponseDto[]> {
        const orders = await this.ordersRepository.find({
            relations: ['user', 'address', 'orderHasProducts.product'],
        });
        return this.mapper.mapArray(orders, OrderEntity, OrderResponseDto);
    }

    async findByClient(idClient: string): Promise<OrderResponseDto[]> {
        const orders = await this.ordersRepository.find({
            relations: ['user', 'address', 'orderHasProducts.product'],
            where: { idClient: idClient },
        });
        return this.mapper.mapArray(orders, OrderEntity, OrderResponseDto);
    }

    async updateStatus(id: string): Promise<OrderResponseDto> {
        const orderFound = await this.findOrder(id);
        orderFound.status = OrderStatus.PAGADO;
        const updatedOrder = await this.ordersRepository.save(orderFound);
        return this.mapper.map(updatedOrder, OrderEntity, OrderResponseDto);
    }

    private async findOrder(id: string): Promise<OrderEntity> {
        const orderFound = await this.ordersRepository.findOne({ where: {id} });
        if (!orderFound) {
            this.throwNotFoundException('ORDER_NOT_FOUND');
        }
        return orderFound;
    }
}
