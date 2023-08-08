import { Injectable } from '@nestjs/common';
import { RoleEntity } from 'src/modules/roles/role.entity';
import { EntityManager } from 'typeorm';
import rolesSeed from 'src/seed/role.seeds';

@Injectable()
export class SeedingService {
    constructor(
        private readonly entityManager: EntityManager,
    ) {}

    async seed(): Promise<void> {
        // Replace with your own seeds
        await Promise.all([
          this.entityManager.upsert(RoleEntity, rolesSeed, ['name']),
        ]);
    }
}