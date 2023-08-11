import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDate, IsNumber, IsString } from 'class-validator';
import { CategoryResponseDto } from 'src/modules/categories/dto/category-response.dto';

@Expose()
export class ProductResponseDto {
    
    @ApiProperty({ description: 'Unique identifier of the product', example: 'c5e1e99a-7efc-4a63-83da-5ef5e6cb6d16' })
    @Expose()
    @IsString()
    id: string;

    @ApiProperty({ description: 'Name of the product', example: 'T-shirt' })
    @Expose()
    @IsString()
    name: string;

    @ApiProperty({ description: 'Description of the product', example: 'A comfortable and stylish T-shirt' })
    @Expose()
    @IsString()
    description: string;

    @ApiProperty({ description: 'URL of the first product image', example: 'https://example.com/images/tshirt1.jpg' })
    @Expose({ name: 'image1' })
    @IsString()
    image1Url: string;

    @ApiProperty({ description: 'URL of the second product image', example: 'https://example.com/images/tshirt2.jpg' })
    @Expose({ name: 'image2' })
    @IsString()
    image2Url: string;

    @ApiProperty({ description: 'Category of the product' })
    @Expose()
    category: CategoryResponseDto;

    @ApiProperty({ description: 'Price of the product', example: 25.99 })
    @Expose()
    @IsNumber()
    price: number;

    @ApiProperty({ description: 'Creation date of the product', example: '2023-08-15T10:30:00Z' })
    @Expose()
    @IsDate()
    createdAt: Date;

    @ApiProperty({ description: 'Last updated date of the product', example: '2023-08-15T14:45:00Z' })
    @Expose()
    @IsDate()
    updatedAt: Date;
}
