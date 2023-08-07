import { AbstractDto } from "src/core/abstract.dto";
import { AutoMap } from '@automapper/classes';

export class RoleDto extends AbstractDto {

    @AutoMap()
    name: string;

    @AutoMap()
    image: string;

    @AutoMap()
    route: string
}