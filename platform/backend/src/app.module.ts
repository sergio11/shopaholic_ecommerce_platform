import { AddressModule } from './address/address.module';
import { CategoriesModule } from './categories/categories.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcceptLanguageResolver, I18nModule, QueryResolver , HeaderResolver} from 'nestjs-i18n';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { RedisCacheModule } from './cache/redis-cache.module';
import { ProductsModule } from './products/products.module';
import { MercadoPagoModule } from './mercado_pago/mercado_pago.module';


@Module({
  imports: [
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
    TypeOrmModule.forRoot({
      type: 'mysql',
      replication: {
        master: {
        host: process.env.MYSQL_MASTER_HOST || "localhost",
        port: parseInt(process.env.MYSQL_MASTER_PORT) || 3306,
        username: process.env.MYSQL_MASTER_USER || "dreamsoftware",
        password: process.env.MYSQL_MASTER_PASSWORD || "dreamsoftware00",
        database: process.env.MYSQL_DATABASE || "ecommerce",
        },
        slaves: [{
          host: process.env.MYSQL_SLAVE_HOST || "localhost",
          port: parseInt(process.env.MYSQL_SLAVE_PORT) || 3307,
          username: process.env.MYSQL_MASTER_USER || "dreamsoftware",
          password: process.env.MYSQL_MASTER_PASSWORD || "dreamsoftware00",
          database: process.env.MYSQL_DATABASE || "ecommerce",
        }]
      },
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true
    }),
    UsersModule,
    AuthModule,
    RolesModule,
    CategoriesModule,
    RedisCacheModule,
    AddressModule,
    ProductsModule,
    MercadoPagoModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ]
})
export class AppModule {}
