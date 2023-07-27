import { Controller, UseGuards, Param, Body, Post, Get } from '@nestjs/common';
import { HasRoles } from '../auth/jwt/has-roles';
import { JwtRole } from '../auth/jwt/jwt-role';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { JwtRolesGuard } from '../auth/jwt/jwt-roles.guard';
import { MercadoPagoService } from './mercado_pago.service';
import { CardTokenBody } from '../mercado_pago/models/card_token_body';
import { PaymentBody } from './models/payment_body';


@Controller('mercadopago')
export class MercadoPagoController {

    constructor(private mercadoPagoService: MercadoPagoService) {}

    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Get('identification_types')
    getIdentificationTypes() {
        return this.mercadoPagoService.getIdentificationTypes();
    }
    
    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
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
    @Post('card_token')
    createCardToken(@Body() cardTokenBody: CardTokenBody) {
        return this.mercadoPagoService.createCardToken(cardTokenBody);
    }
    
    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Post('payments')
    createPayment(@Body() paymentBody: PaymentBody) {
        return this.mercadoPagoService.createPayment(paymentBody);
    }

}
