import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { Category } from '../categories/category.entity';
import { JwtStrategy } from '../auth/jwt/jwt.strategy';
import { OrderHasProducts } from '../orders/order_has_products.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([ Product, Category, OrderHasProducts ]) ],
  controllers: [ProductsController],
  providers: [ProductsService, JwtStrategy]
})
export class ProductsModule {}
