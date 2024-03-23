import { AddressModule } from './modules/address/address.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ClassSerializerInterceptor, Module, OnApplicationBootstrap } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcceptLanguageResolver, I18nModule, QueryResolver , HeaderResolver} from 'nestjs-i18n';
import { join } from 'path';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { RolesModule } from './modules/roles/roles.module';
import { ConfigModule } from '@nestjs/config';
import { CacheConfigModule } from './modules/cache/cache.module';
import { ProductsModule } from './modules/products/products.module';
import { TypeOrmConfigService } from './core/service/typeorm.service';
import { getEnvPath } from './core/helper/env.helper';
import { SeedingService } from './modules/seed/seeding.service';
import { FilesStorageModule } from './modules/storage/storage.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ImagesModule } from './modules/images/images.module';
import { BrandModule } from './modules/brands/brand.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { OrdersModule } from './modules/orders/orders.module';
import { SeedModule } from './modules/seed/seed.module';

const envFilePath: string = getEnvPath(`${__dirname}/env`);

@Module({
  imports: [
    ConfigModule.forRoot({ 
      envFilePath, 
      isGlobal: true, 
      expandVariables: true 
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang'])
      ],
    }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    UsersModule,
    AuthModule,
    RolesModule,
    CategoriesModule,
    CacheConfigModule,
    AddressModule,
    ProductsModule,
    FilesStorageModule,
    ImagesModule,
    BrandModule,
    PaymentsModule,
    OrdersModule,
    SeedModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    }
  ]
})
export class AppModule implements OnApplicationBootstrap {

  constructor(
    private readonly seedingService: SeedingService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.seedingService.seed();
  }
}

