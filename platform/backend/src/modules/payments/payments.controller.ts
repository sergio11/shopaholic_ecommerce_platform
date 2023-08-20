import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentProcessorService } from './payment-processor.service';
import { AuthUserId } from '../auth/decorator/auth-user-id.decorator';

@Controller('payments')
@ApiTags('Payments')
export class PaymentsController {
  constructor(private readonly paymentService: PaymentProcessorService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new payment' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Payment created successfully',
  })
  async createPayment(
    @Body() createPaymentDto: CreatePaymentDto,
    @AuthUserId() userId: string,
  ): Promise<string> {
    const payment = { ...createPaymentDto, userId: userId};
    return this.paymentService.createPayment(payment);
  }
}
