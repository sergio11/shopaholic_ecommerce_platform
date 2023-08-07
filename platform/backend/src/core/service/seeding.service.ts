import { Injectable, Logger } from '@nestjs/common';
import { RoleEntity } from 'src/modules/roles/role.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class SeedingService {
    constructor(
        private readonly entityManager: EntityManager,
    ) {}

    async seed(): Promise<void> {
        // Replace with your own seeds
        await Promise.all([
          this.entityManager.save(RoleEntity, []),
        ]);
    }
}