import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheService } from './cache.service';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        store: configService.get<string>('CACHE_STORE'),
        host: configService.get<string>('CACHE_NODE_1_HOST'),
        port: Number(configService.get<number>('CACHE_NODE_1_PORT')),
        ttl: Number(configService.get<number>('CACHE_TTL_IN_MILLIS')),
        clusterConfig: {
          nodes: [
            { host: configService.get<string>('CACHE_NODE_2_HOST'), port: Number(configService.get<number>('CACHE_NODE_2_PORT')) },
            { host: configService.get<string>('CACHE_NODE_3_HOST'), port: Number(configService.get<number>('CACHE_NODE_3_PORT')) },
            { host: configService.get<string>('CACHE_NODE_4_HOST'), port: Number(configService.get<number>('CACHE_NODE_4_PORT')) },
            { host: configService.get<string>('CACHE_NODE_5_HOST'), port: Number(configService.get<number>('CACHE_NODE_5_PORT')) },
            { host: configService.get<string>('CACHE_NODE_6_HOST'), port: Number(configService.get<number>('CACHE_NODE_6_PORT')) },
            { host: configService.get<string>('CACHE_NODE_7_HOST'), port: Number(configService.get<number>('CACHE_NODE_7_PORT')) },
            { host: configService.get<string>('CACHE_NODE_8_HOST'), port: Number(configService.get<number>('CACHE_NODE_8_PORT')) },
          ]
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    CacheService
  ],
  exports: [CacheService]
})
export class CacheConfigModule {}


