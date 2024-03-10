import { Inject, Injectable } from '@nestjs/common';
import { IStorageService, STORAGE_SERVICE } from 'src/modules/storage/storage.service';
import { CreateImageDto } from 'src/modules/images/dto/create-image.dto';
import { ImagesService } from 'src/modules/images/images.service';
import { ImageEntity } from 'src/modules/images/image.entity';

/**
 * Mixin class providing file saving and removing functionality.
 */
@Injectable()
export class StorageMixin {
    
    /**
     * Creates an instance of FileSavingMixin.
     * @param {IStorageService} storageService - The storage service instance.
     * @param {ImagesService} imagesService - The images service instance.
     */
    constructor(
        @Inject(STORAGE_SERVICE)
        private readonly storageService: IStorageService,
        private readonly imagesService: ImagesService
    ) {}

    /**
     * Saves an image file to storage and returns the corresponding DTO.
     * @param {Express.Multer.File} file - The image file to save.
     * @param {ImageEntity} oldImage - The old image entity to remove.
     * @returns {Promise<CreateImageDto>} - The DTO representing the saved image.
     */
    async saveImageFile(file?: Express.Multer.File, oldImage?: ImageEntity): Promise<CreateImageDto> {
        if (file) {
            console.log(`saveImageFile -> mimetype: ${file.mimetype}, ${file.size}, ${file.originalname}`)
            const response = await this.storageService.saveFile(file.buffer, file.mimetype, file.size);
            await this.removeImageFile(oldImage);
            const imageDto: CreateImageDto = {
                url: response.url,
                storageId: response.id
            };
            return imageDto;
        } else {
            return null;
        }
    }

    /**
     * Removes an image file from storage and deletes the associated image entity.
     * @param {ImageEntity} image - The image entity to remove.
     * @returns {Promise<void>}
     */
    async removeImageFile(image?: ImageEntity): Promise<void> { 
        if(image) {
            await this.storageService.deleteFile(image.storageId);
            await this.imagesService.deleteImageByStorageId(image.storageId);
        }
    }
}