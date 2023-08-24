import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CacheService<T> {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async get(key: string): Promise<T | undefined> {
    return this.cacheManager.get<T>(key);
  }

  async set(key: string, value: T, ttlInSeconds?: number): Promise<void> {
    console.log(`Cache Service - save key: ${key} - value: ${value} - ttl: ${ttlInSeconds}`)
    await this.cacheManager.set(key, value, ttlInSeconds * 1000);
  }

  async delete(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }
}