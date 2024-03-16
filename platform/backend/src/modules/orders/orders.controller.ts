import { Delete, Param, Get, Version, DefaultValuePipe, ParseIntPipe, Query, Post, HttpStatus, Body, ParseUUIDPipe } from '@nestjs/common';
import { JwtRole } from '../auth/jwt/jwt-role';
import { OrdersService } from './orders.service';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { OrderResponseDto } from './dto/order-response.dto';
import { Auth } from '../auth/decorator/auth.decorator';
import { ApiController } from 'src/core/decorator/default-api.decorator';
import { AuthUserId } from '../auth/decorator/auth-user-id.decorator';
import { Pagination } from 'nestjs-typeorm-paginate';
import { CreateOrderDto } from './dto/create-order.dto';

@ApiController('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}


  /**
   * Endpoint to search for orders based on a search term and paginate the results.
   * Available for CLIENT and ADMIN roles.
   * @version 1.0
   * @summary Search for orders based on a search term and paginate the results.
   * @param term The search term for filtering orders (optional).
   * @param page The page number for pagination (optional, default: 1).
   * @param limit The number of items per page (optional, default: 10, range: 1-100).
   * @returns Filtered and paginated orders.
   */
   @Auth(JwtRole.CLIENT, JwtRole.ADMIN)
   @Version('1.0')
   @Get('search')
   @ApiQuery({
     name: 'term',
     required: false,
     description: 'Search term for filtering orders',
   })
   @ApiQuery({
     name: 'page',
     required: false,
     description: 'Page number (1 .. )',
     example: 1,
     type: Number,
   })
   @ApiQuery({
     name: 'limit',
     required: false,
     description: 'Items per page (1 - 100)',
     example: 10,
     type: Number,
   })
   @ApiOperation({
     summary:
       'Search for orders based on a search term and paginate the results',
   })
   @ApiResponse({
     status: 200,
     description: 'Filtered and paginated orders',
     type: OrderResponseDto,
     isArray: true,
   })
   async searchAndPaginate(
     @Query('term') term: string,
     @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
     @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
   ): Promise<Pagination<OrderResponseDto>> {
     return this.ordersService.searchAndPaginate(term, page, limit);
   }

  /**
   * Retrieve orders by client ID.
   * @param {string} idClient - ID of the client.
   * @returns {Promise<OrderResponseDto[]>} List of orders.
   */
  @Auth(JwtRole.CLIENT, JwtRole.ADMIN)
  @Version('1.0')
  @Get('clients/:idClient')
  @ApiOperation({ summary: 'Retrieve orders by client ID' })
  @ApiParam({ name: 'idClient', description: 'ID of the client' })
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
   * Controller endpoint to retrieve an order by its ID.
   * Only accessible to users with ADMIN or CLIENT roles.
   * @param {string} id - The ID of the order to retrieve.
   * @returns {Promise<OrderResponseDto>} The retrieved order.
   */
  @Auth(JwtRole.ADMIN, JwtRole.CLIENT)
  @Version('1.0')
  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Retrieved a order by ID.',
    type: OrderResponseDto,
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @AuthUserId() userId: string,
  ): Promise<OrderResponseDto> {
    return this.ordersService.findOne(id, userId);
  }

  /**
   * Cancel an order by ID.
   * @param {string} id - ID of the order to cancel.
   * @returns {Promise<string>} Message confirming the cancellation.
   */
  @Auth(JwtRole.CLIENT, JwtRole.ADMIN)
  @Version('1.0')
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
  @Version('1.0')
  @Delete(':id/delete')
  @ApiOperation({ summary: 'Delete an order by ID' })
  @ApiParam({ name: 'id', description: 'ID of the order to delete' })
  @ApiResponse({
    status: 200,
    description: 'Order deleted successfully',
  })
  async deleteOrder(
    @Param('id') id: string,
    @AuthUserId() userId: string,
  ): Promise<string> {
    return await this.ordersService.deleteOrder(id, userId);
  }

  /**
   * Creates a new order.
   * @param createOrderDto The DTO containing information to create the order.
   * @returns A promise resolving to an OrderResponseDto representing the created order.
   */
  @Auth(JwtRole.CLIENT, JwtRole.ADMIN)
  @Version('1.0')
  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Order created successfully.',
    type: OrderResponseDto,
  })
  async createOrder(
    @AuthUserId() userId: string,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<OrderResponseDto> {
    createOrderDto.idClient = userId;
    return await this.ordersService.createOrder(createOrderDto);
  }

  /**
   * Handles the successful checkout of an order.
   * @param orderId - The ID of the order.
   * @param token - The token received as a query parameter.
   * @returns A string indicating the success of the checkout process.
   */
  @Version('1.0')
  @Get(':id/checkout/success')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Endpoint for handling successful order checkout.',
    type: String,
  })
  async orderCheckoutSuccess(
    @Param('id', ParseUUIDPipe) orderId: string,
    @Query('token') token: string,
  ): Promise<string> {
    return this.ordersService.checkoutSuccess(orderId, token);
  }

  /**
   * Handles the cancellation of an order checkout.
   * @param orderId - The ID of the order to cancel.
   * @param token - The session token used to verify the cancellation request.
   * @returns A string indicating the success of the cancellation process.
   */
  @Version('1.0')
  @Get(':id/checkout/cancelled')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Endpoint for handling cancel order checkout.',
    type: String,
  })
  async orderCheckoutCancelled(
    @Param('id', ParseUUIDPipe) orderId: string,
    @Query('token') token: string,
  ): Promise<string> {
    return this.ordersService.checkoutCacelled(orderId, token);
  }
}
