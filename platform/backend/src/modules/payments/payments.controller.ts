import { Controller, UseGuards, Param, Body, Post, Get, Version } from '@nestjs/common';
import { HasRoles } from '../auth/jwt/has-roles';
import { JwtRole } from '../auth/jwt/jwt-role';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { JwtRolesGuard } from '../auth/jwt/jwt-roles.guard';
import { MercadoPagoPaymentService } from './mercadopago/mercadopago-payment.service';
import { PaymentBody } from './models/payment_body';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CardTokenBody } from './models/card_token_body';

@ApiBearerAuth()
@ApiTags('payments')
@Controller('payments')
export class PaymentsController {

    constructor(private mercadoPagoService: MercadoPagoPaymentService) {}

    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Version('1.0')
    @Get('identification_types')
    getIdentificationTypes() {
        return this.mercadoPagoService.getIdentificationTypes();
    }
    
    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Version('1.0')
    @Get('installments/:first_six_digits/:amount')
    getInstallments(
        @Param('first_six_digits') firstSixDigits: number, 
        @Param('amount') amount: number
    ) {
        console.log('firstSixDigits', firstSixDigits);
        console.log('amount', amount);
        
        return this.mercadoPagoService.getInstallments(firstSixDigits, amount);
    }
    
    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Version('1.0')
    @Post('card_token')
    createCardToken(@Body() cardTokenBody: CardTokenBody) {
        return this.mercadoPagoService.createCardToken(cardTokenBody);
    }
    
    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Version('1.0')
    @Post('payments')
    createPayment(@Body() paymentBody: PaymentBody) {
        return this.mercadoPagoService.createPayment(paymentBody);
    }

}
