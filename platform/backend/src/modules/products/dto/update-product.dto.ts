import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class UpdateProductDto {
    @ApiProperty({ description: 'Updated product name', example: 'Updated Product Name' })
    @IsOptional()
    @IsString({ message: 'Name must be a string' })
    name?: string;

    @ApiProperty({ description: 'Updated product description', example: 'Updated product description goes here' })
    @IsOptional()
    @IsString({ message: 'Description must be a string' })
    description?: string;

    @ApiProperty({ description: 'Updated product price', example: 24.99 })
    @IsOptional()
    @IsNumber({}, { message: 'Price must be a number' })
    @Min(0, { message: 'Price must be greater than or equal to 0' })
    price?: number;

    @ApiProperty({ description: 'Updated ID of the category for the product', example: 'updated_category_id' })
    @IsOptional()
    @IsUUID(undefined, { message: 'Invalid category ID format' })
    id_category?: string;

    @ApiProperty({ description: 'Updated image URL 1 for the product', example: 'https://example.com/image1.jpg' })
    @IsOptional()
    @IsString({ message: 'Image URL must be a string' })
    image1?: string;

    @ApiProperty({ description: 'Updated image URL 2 for the product', example: 'https://example.com/image2.jpg' })
    @IsOptional()
    @IsString({ message: 'Image URL must be a string' })
    image2?: string;
}
