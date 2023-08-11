import { Controller, UseGuards, Put, Param, Get, Version } from '@nestjs/common';
import { HasRoles } from '../auth/jwt/has-roles';
import { JwtRole } from '../auth/jwt/jwt-role';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { JwtRolesGuard } from '../auth/jwt/jwt-roles.guard';
import { OrdersService } from './orders.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderResponseDto } from './dto/order-response.dto';

@ApiBearerAuth()
@ApiTags('orders')
@Controller('orders')
export class OrdersController {

    constructor(private ordersService: OrdersService) {}

    /**
    * Retrieve a list of all orders.
    * @returns {OrderResponseDto[]} List of orders.
    */
    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Version('1.0')
    @Get()
    @ApiOperation({ summary: 'Retrieve a list of all orders' })
    @ApiResponse({ status: 200, description: 'List of orders', type: [OrderResponseDto] })
    findAll() {
        return this.ordersService.findAll()
    }
    
    /**
    * Retrieve orders by client ID.
    * @param {string} id_client - ID of the client.
    * @returns {OrderResponseDto[]} List of orders.
    */
    @HasRoles(JwtRole.CLIENT, JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Version('1.0')
    @Get(':id_client')
    @ApiOperation({ summary: 'Retrieve orders by client ID' })
    @ApiParam({ name: 'id_client', description: 'ID of the client' })
    @ApiResponse({ status: 200, description: 'List of orders', type: [OrderResponseDto] })
    findByClient(@Param('id_client') idClient: string) {
        return this.ordersService.findByClient(idClient);
    }
    
    /**
     * Update the status of an order.
     * @param {string} id - ID of the order.
     * @returns {OrderResponseDto} Updated order with new status.
    */
    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Version('1.0')
    @Put(':id')
    @ApiOperation({ summary: 'Update the status of an order' })
    @ApiParam({ name: 'id', description: 'ID of the order' })
    @ApiResponse({ status: 200, description: 'Updated order with new status', type: OrderResponseDto })
    updateStatus(@Param('id') id: string) {
        return this.ordersService.updateStatus(id);
    }
}
