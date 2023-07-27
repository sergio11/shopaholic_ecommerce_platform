import { IsNotEmpty, IsString } from "class-validator";

export class CreateRolDto {

    @IsNotEmpty()
    @IsString()
    id: string;

    @IsNotEmpty()
    @IsString()
    name: string;
    
    
    @IsNotEmpty()
    @IsString()
    image: string;
    
    @IsNotEmpty()
    @IsString()
    route: string;

}