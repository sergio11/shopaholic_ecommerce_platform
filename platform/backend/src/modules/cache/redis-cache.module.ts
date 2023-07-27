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
            { host: process.env.REDIS_CLUSTER_HOST || 'docker.internal.network', port: 6379 },
            { host: process.env.REDIS_CLUSTER_HOST || 'docker.internal.network', port: 6380 },
            { host: process.env.REDIS_CLUSTER_HOST || 'docker.internal.network', port: 6381 },
            { host: process.env.REDIS_CLUSTER_HOST || 'docker.internal.network', port: 6382 },
            { host: process.env.REDIS_CLUSTER_HOST || 'docker.internal.network', port: 6383 },
            { host: process.env.REDIS_CLUSTER_HOST || 'docker.internal.network', port: 6384 },
            { host: process.env.REDIS_CLUSTER_HOST || 'docker.internal.network', port: 6385 },
            { host: process.env.REDIS_CLUSTER_HOST || 'docker.internal.network', port: 6386 }
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