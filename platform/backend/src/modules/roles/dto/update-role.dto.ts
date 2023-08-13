import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoleDto {

    @ApiProperty({ example: 'ADMIN', description: 'The name of the role', required: false })
    @IsNotEmpty()
    @IsString()
    name?: string;

    @ApiProperty({ example: 'admin.png', description: 'The image URL for the role', required: false })
    @IsNotEmpty()
    @IsString()
    image?: string;

    @ApiProperty({ example: '/admin', description: 'The route for the role', required: false })
    @IsNotEmpty()
    @IsString()
    route?: string;

}
