import { Module, CacheModule } from '@nestjs/common';
import { redisStore } from 'cache-manager-ioredis-yet';
import { RedisCacheService } from './redis-cache.service';

@Module({
  imports: [
    CacheModule.register({
        isGlobal: true,
        store: redisStore,
        clusterConfig: {
          nodes: [
            { host: 'localhost', port: 6379 },
            { host: 'localhost', port: 6380 },
            { host: 'localhost', port: 6381 },
            { host: 'localhost', port: 6382 },
            { host: 'localhost', port: 6383 },
            { host: 'localhost', port: 6384 },
            { host: 'localhost', port: 6385 },
            { host: 'localhost', port: 6386 }
          ],
          redisOptions: {
            keyPrefix: 'cache:'
          },
        },
        ttl: 10, // seconds
        max: 100, // maximum number of items in cache
    }),
  ],
  providers: [RedisCacheService],
})
export class RedisCacheModule {}