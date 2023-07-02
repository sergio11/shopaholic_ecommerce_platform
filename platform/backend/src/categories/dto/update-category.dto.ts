import { IsNotEmpty, IsString } from "class-validator";

export default class UpdateCategoryDTO {

    name?: string;
    description?: string;
    image?: string;

}