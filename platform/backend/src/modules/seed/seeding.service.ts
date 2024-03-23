import { Injectable } from '@nestjs/common';
import { RoleEntity } from 'src/modules/roles/role.entity';
import { Repository } from 'typeorm';
import rolesSeed from 'src/modules/seed/role.seeds';
import { UserEntity } from 'src/modules/users/user.entity';
import userSeeds from 'src/modules/seed/user.seeds';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SeedingService {

  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private rolesRepository: Repository<RoleEntity>,
   ) {}

  async seed(): Promise<void> {
    await Promise.all([
      this.rolesRepository.upsert(rolesSeed, ['name']),
      this.usersRepository.upsert(userSeeds, ['email'])
    ]);
    const allRoles = await this.rolesRepository.find();
    for(const user of userSeeds) { 
      const userFound = await this.usersRepository.findOneBy({email : user.email});
      if(userFound) {
        userFound.roles = allRoles;
        await this.usersRepository.save(userFound);
      }
    }
  }
}