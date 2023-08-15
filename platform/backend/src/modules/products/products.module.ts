import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductEntity } from './product.entity';
import { CategoryEntity } from '../categories/category.entity';
import { OrderHasProductsEntity } from '../orders/order_has_products.entity';
import { ProductMapper } from './product.mapper';
import { CategoriesModule } from '../categories/categories.module';

@Global()
@Module({
  imports: [ 
    TypeOrmModule.forFeature([ ProductEntity, CategoryEntity, OrderHasProductsEntity ]),
    CategoriesModule
   ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductMapper],
  exports: [ProductsService, ProductMapper]
})
export class ProductsModule {}
