import { IsNotEmpty, IsString } from "class-validator";

export default class CreateCategoryDTO {

    @IsNotEmpty()
    @IsString()
    name: string;
    
    @IsNotEmpty()
    @IsString()
    description: string;
    
    image: string;

}