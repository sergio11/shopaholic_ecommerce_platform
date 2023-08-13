import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductEntity } from './product.entity';
import { CategoryEntity } from '../categories/category.entity';
import { OrderHasProductsEntity } from '../orders/order_has_products.entity';
import { ProductProfile } from './product.mapper';

@Module({
  imports: [ TypeOrmModule.forFeature([ ProductEntity, CategoryEntity, OrderHasProductsEntity ]) ],
  controllers: [ProductsController],
  providers: [
    ProductsService, 
    ProductProfile
  ]
})
export class ProductsModule {}
