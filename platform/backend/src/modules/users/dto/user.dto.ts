import { AbstractDto } from "src/core/abstract.dto";
import { AutoMap } from '@automapper/classes';
import { IsOptional } from "class-validator";


export class UserDto extends AbstractDto {

    @AutoMap()
    name: string;

    @AutoMap()
    lastname: string;

    @AutoMap()
    email: string;

    @AutoMap()
    phone: string;

    @AutoMap()
    @IsOptional()
    image?: string;
}