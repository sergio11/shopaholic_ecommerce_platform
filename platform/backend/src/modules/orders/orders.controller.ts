import { Delete, Param, Get, Version } from '@nestjs/common';
import { JwtRole } from '../auth/jwt/jwt-role';
import { OrdersService } from './orders.service';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { OrderResponseDto } from './dto/order-response.dto';
import { Auth } from '../auth/decorator/auth.decorator';
import { ApiController } from 'src/core/decorator/default-api.decorator';
import { AuthUserId } from '../auth/decorator/auth-user-id.decorator';

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
  @ApiResponse({
    status: 200,
    description: 'List of orders',
    type: [OrderResponseDto],
  })
  async findAll(): Promise<OrderResponseDto[]> {
    return this.ordersService.findAll();
  }

  /**
   * Retrieve orders by client ID.
   * @param {string} idClient - ID of the client.
   * @returns {Promise<OrderResponseDto[]>} List of orders.
   */
  @Auth(JwtRole.CLIENT, JwtRole.ADMIN)
  @Version('1.0')
  @Get(':idClient')
  @ApiOperation({ summary: 'Retrieve orders by client ID' })
  @ApiParam({ name: 'id_client', description: 'ID of the client' })
  @ApiResponse({
    status: 200,
    description: 'List of orders',
    type: [OrderResponseDto],
  })
  async findByClient(
    @Param('idClient') idClient: string,
  ): Promise<OrderResponseDto[]> {
    return this.ordersService.findByClient(idClient);
  }

  /**
   * Cancel an order by ID.
   * @param {string} id - ID of the order to cancel.
   * @returns {Promise<string>} Message confirming the cancellation.
   */
  @Auth(JwtRole.CLIENT)
  @Delete(':id/cancel')
  @ApiOperation({ summary: 'Cancel an order by ID' })
  @ApiParam({ name: 'id', description: 'ID of the order to cancel' })
  @ApiResponse({
    status: 200,
    description: 'Order cancelled successfully',
  })
  async cancelOrder(
    @Param('id') id: string,
    @AuthUserId() userId: string,
  ): Promise<string> {
    return await this.ordersService.cancelOrder(id, userId);
  }

  /**
   * Delete an order by ID.
   * @param {string} id - ID of the order to delete.
   * @returns {Promise<string>} Message confirming the deletion.
   */
  @Auth(JwtRole.ADMIN)
  @Delete(':id/delete')
  @ApiOperation({ summary: 'Delete an order by ID' })
  @ApiParam({ name: 'id', description: 'ID of the order to delete' })
  @ApiResponse({
    status: 200,
    description: 'Order deleted successfully',
  })
  async deleteOrder(@Param('id') id: string): Promise<string> {
    return await this.ordersService.deleteOrder(id);
  }
}
