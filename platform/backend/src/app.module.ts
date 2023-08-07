import { AddressModule } from './modules/address/address.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcceptLanguageResolver, I18nModule, QueryResolver , HeaderResolver} from 'nestjs-i18n';
import { join } from 'path';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { RolesModule } from './modules/roles/roles.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { RedisCacheModule } from './modules/cache/redis-cache.module';
import { ProductsModule } from './modules/products/products.module';
import { MercadoPagoModule } from './modules/mercado_pago/mercado_pago.module';
import { TypeOrmConfigService } from './core/service/typeorm.service';
import { getEnvPath } from './core/helper/env.helper';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
const envFilePath: string = getEnvPath(`${__dirname}/env`);

@Module({
  imports: [
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
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
export class AppModule implements OnApplicationBootstrap {
  async onApplicationBootstrap(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

