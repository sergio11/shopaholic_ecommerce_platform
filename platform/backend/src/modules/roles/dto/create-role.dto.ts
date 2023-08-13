import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateRoleDto {

    @ApiProperty({ description: 'Unique identifier for the role', example: 'admin' })
    @IsNotEmpty()
    @IsString()
    id: string;

    @ApiProperty({ description: 'Name of the role', example: 'Administrator' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ description: 'Image associated with the role', example: 'admin.png' })
    @IsNotEmpty()
    @IsString()
    image: string;

    @ApiProperty({ description: 'Route associated with the role', example: '/admin' })
    @IsNotEmpty()
    @IsString()
    route: string;

}
