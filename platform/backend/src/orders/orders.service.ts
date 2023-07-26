import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { SupportService } from 'src/core/support.service';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class OrdersService extends SupportService {

    constructor(
        @InjectRepository(Order) private ordersRepository: Repository<Order>,
        i18n: I18nService
    ) {
        super(i18n);
    }

    findAll() {
        return this.ordersRepository.find({ relations: ['user', 'address', 'orderHasProducts.product'] })
    }
    
    findByClient(idClient: number) {
        return this.ordersRepository.find({ 
            relations: ['user', 'address', 'orderHasProducts.product'],
            where: { idClient: idClient },
        })
    }

    async updateStatus(id: number) {
        const orderFound = await this.ordersRepository.findOneBy({id: id});
        if (!orderFound) {
            this.throwNotFoundException("ORDER_NOT_FOUND");
        }
        const updatedOrder = Object.assign(orderFound, { status: 'DESPACHADO' });
        return this.ordersRepository.save(updatedOrder);
    }

}
