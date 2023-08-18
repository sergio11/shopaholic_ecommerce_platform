import { Put, Param, Get, Version } from '@nestjs/common';
import { JwtRole } from '../auth/jwt/jwt-role';
import { OrdersService } from './orders.service';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { OrderResponseDto } from './dto/order-response.dto';
import { Auth } from '../auth/decorator/auth.decorator';
import { ApiController } from 'src/core/decorator/default-api.decorator';


@ApiController('orders')
export class OrdersController {

    constructor(private ordersService: OrdersService) {}

    /**
    * Retrieve a list of all orders.
    * @returns {Promise<OrderResponseDto[]>} List of orders.
    */
    @Auth(JwtRole.ADMIN)
    @Version('1.0')
    @Get()
    @ApiOperation({ summary: 'Retrieve a list of all orders' })
    @ApiResponse({ status: 200, description: 'List of orders', type: [OrderResponseDto] })
    async findAll(): Promise<OrderResponseDto[]> {
        return this.ordersService.findAll()
    }
    
    /**
    * Retrieve orders by client ID.
    * @param {string} idClient - ID of the client.
    * @returns {Promise<OrderResponseDto[]>} List of orders.
    */
    @Auth(JwtRole.CLIENT, JwtRole.ADMIN)
    @Version('1.0')
    @Get(':id_client')
    @ApiOperation({ summary: 'Retrieve orders by client ID' })
    @ApiParam({ name: 'id_client', description: 'ID of the client' })
    @ApiResponse({ status: 200, description: 'List of orders', type: [OrderResponseDto] })
    async findByClient(@Param('id_client') idClient: string): Promise<OrderResponseDto[]> {
        return this.ordersService.findByClient(idClient);
    }
    
    /**
     * Update the status of an order.
     * @param {string} id - ID of the order.
     * @returns {Promise<OrderResponseDto>} Updated order with new status.
    */
    @Auth(JwtRole.ADMIN)
    @Version('1.0')
    @Put(':id')
    @ApiOperation({ summary: 'Update the status of an order' })
    @ApiParam({ name: 'id', description: 'ID of the order' })
    @ApiResponse({ status: 200, description: 'Updated order with new status', type: OrderResponseDto })
    async updateStatus(@Param('id') id: string): Promise<OrderResponseDto> {
        return this.ordersService.updateStatus(id);
    }
}
