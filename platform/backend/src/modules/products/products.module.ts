import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductEntity } from './product.entity';
import { CategoryEntity } from '../categories/category.entity';
import { OrderHasProductsEntity } from '../orders/order_has_products.entity';
import { ProductMapper } from './product.mapper';
import { CategoriesModule } from '../categories/categories.module';
import { BrandsEntity } from '../brands/brand.entity';
import { BrandModule } from '../brands/brand.module';

@Module({
  imports: [ 
    TypeOrmModule.forFeature([ ProductEntity, CategoryEntity, OrderHasProductsEntity, BrandsEntity ]),
    CategoriesModule,
    BrandModule
   ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductMapper],
  exports: [ProductsService, ProductMapper]
})
export class ProductsModule {}
