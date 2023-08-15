import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AbstractDto {
  @ApiProperty({
    description: 'Unique identifier',
    example: 'c5e1e99a-7efc-4a63-83da-5ef5e6cb6d16',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Date of creation',
    example: '2023-08-15T10:30:00Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Date of last update',
    example: '2023-08-15T14:45:00Z',
  })
  @Expose()
  updatedAt: Date;
}
