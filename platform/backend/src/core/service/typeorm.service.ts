import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AddressEntity } from 'src/modules/address/address.entity';
import { CategoryEntity } from 'src/modules/categories/category.entity';
import { ImageEntity } from 'src/modules/images/image.entity';
import { OrderEntity } from 'src/modules/orders/order.entity';
import { OrderHasProductsEntity } from 'src/modules/orders/order_has_products.entity';
import { ProductEntity } from 'src/modules/products/product.entity';
import { RoleEntity } from 'src/modules/roles/role.entity';
import { UserEntity } from 'src/modules/users/user.entity';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {

  @Inject(ConfigService)
  private readonly config: ConfigService;

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      replication: {
        master: {
          host: this.config.get<string>('DATABASE_MASTER_HOST'),
          port: this.config.get<number>('DATABASE_MASTER_PORT'),
          username: this.config.get<string>('DATABASE_MASTER_USERNAME'),
          password: this.config.get<string>('DATABASE_MASTER_PASSWORD'),
          database: this.config.get<string>('DATABASE_MASTER_NAME')
        },
        slaves: [{
          host: this.config.get<string>('DATABASE_SLAVE_HOST'),
          port: this.config.get<number>('DATABASE_SLAVE_PORT'),
          username: this.config.get<string>('DATABASE_SLAVE_USERNAME'),
          password: this.config.get<string>('DATABASE_SLAVE_PASSWORD'),
          database: this.config.get<string>('DATABASE_SLAVE_NAME')
        }]
      },
      entities: [
        AddressEntity,
        CategoryEntity,
        OrderEntity,
        OrderHasProductsEntity,
        ProductEntity,
        RoleEntity,
        UserEntity,
        ImageEntity
      ],
      synchronize: true
    };
  }
}