import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CacheService<T> {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async get(key: string): Promise<T | undefined> {
    return this.cacheManager.get<T>(key);
  }

  async set(key: string, value: T, options?: { ttl: number }): Promise<void> {
    await this.cacheManager.set(key, value, options?.ttl);
  }

  async delete(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }
}