import { CacheModule, CacheInterceptor } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisCacheService } from './cache.service';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        store: configService.get<string>('CACHE_STORE'),
        host: configService.get<string>('CACHE_NODE_1_HOST'),
        port: configService.get<number>('CACHE_NODE_1_PORT'),
        ttl: configService.get<number>('CACHE_TTL'),
        max: configService.get<number>('CACHE_MAX'),
        clusterConfig: {
          nodes: [
            { host: configService.get<string>('CACHE_NODE_2_HOST'), port: configService.get<number>('CACHE_NODE_2_PORT') },
            { host: configService.get<string>('CACHE_NODE_3_HOST'), port: configService.get<number>('CACHE_NODE_3_PORT') },
            { host: configService.get<string>('CACHE_NODE_4_HOST'), port: configService.get<number>('CACHE_NODE_4_PORT') },
            { host: configService.get<string>('CACHE_NODE_5_HOST'), port: configService.get<number>('CACHE_NODE_5_PORT') },
            { host: configService.get<string>('CACHE_NODE_6_HOST'), port: configService.get<number>('CACHE_NODE_6_PORT') },
            { host: configService.get<string>('CACHE_NODE_7_HOST'), port: configService.get<number>('CACHE_NODE_7_PORT') },
            { host: configService.get<string>('CACHE_NODE_8_HOST'), port: configService.get<number>('CACHE_NODE_8_PORT') },
          ],
          redisOptions: {
            keyPrefix: 'cache:',
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    RedisCacheService
  ]
})
export class CacheConfigModule {}


