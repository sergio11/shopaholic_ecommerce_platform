import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { AbstractDto } from 'src/core/abstract.dto';
import { UserResponseDto } from 'src/modules/users/dto/user-response.dto'; // Import the UserResponseDto if needed

/**
 * Data transfer object for product review response.
 */
export class ProductReviewResponseDto extends AbstractDto {

    /**
     * Rating given by the user.
     * @example 4.5
     */
    @ApiProperty({ description: 'Rating given by the user', example: 4.5 })
    @Expose()
    rating: number;

    /**
     * Review text provided by the user.
     * @example 'This product is great!'
     */
    @ApiProperty({ description: 'Review text provided by the user', example: 'This product is great!' })
    @Expose()
    reviewText: string;

    /**
     * Product ID associated with the review.
     * @example 'a1b2c3'
     */
    @ApiProperty({ description: 'Product ID associated with the review', example: 'a1b2c3' })
    @Expose()
    productId: string;

    /**
     * User who created the review.
     */
    @ApiProperty({ description: 'User who created the review' })
    @Expose()
    @Type(() => UserResponseDto)
    user: UserResponseDto;
}
