import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class CreateProductDto {
    @ApiProperty({ description: 'Product name', example: 'Product Name' })
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    name: string;

    @ApiProperty({ description: 'Product description', example: 'Product description goes here' })
    @IsNotEmpty({ message: 'Description is required' })
    @IsString({ message: 'Description must be a string' })
    description: string;

    @ApiProperty({ description: 'Product price', example: 19.99 })
    @IsNotEmpty({ message: 'Price is required' })
    @IsNumber({}, { message: 'Price must be a number' })
    @Min(0, { message: 'Price must be greater than or equal to 0' })
    price: number;

    @ApiProperty({ description: 'ID of the category for the product', example: 'category_id' })
    @IsNotEmpty({ message: 'Category ID is required' })
    @IsUUID(undefined, { message: 'Invalid category ID format' })
    id_category: string;
}