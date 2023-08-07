import { AutoMap } from '@automapper/classes';
import { IsUUID, IsDate, IsOptional } from 'class-validator';

export class AbstractDto {
  @AutoMap()
  @IsUUID()
  @IsOptional()
  id?: string;

  @AutoMap()
  @IsDate()
  @IsOptional()
  createdAt?: Date;

  @AutoMap()
  @IsDate()
  @IsOptional()
  updatedAt?: Date;

  @AutoMap()
  @IsDate()
  @IsOptional()
  deletedAt?: Date;
}