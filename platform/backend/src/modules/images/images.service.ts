import { Injectable } from "@nestjs/common";
import { I18nService } from "nestjs-i18n";
import { SupportService } from "src/core/support.service";
import { ImageEntity } from "./image.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";


@Injectable()
export class ImagesService extends SupportService { 

    constructor(
        i18n: I18nService,
        @InjectRepository(ImageEntity) private imagesRepository: Repository<ImageEntity>,
    ) {
        super(i18n);
    }
    
    /**
    * Deletes an image record based on the storageId.
    * @param storageId The ID of the storage associated with the image.
    * @throws NotFoundException if the image with the given storageId is not found.
    */
    async deleteImageByStorageId(storageId: string): Promise<void> {
        const image = await this.imagesRepository.findOne({ where: { storageId } });
        if (!image) {
            throw this.throwNotFoundException("IMAGE_NOT_FOUND");
        }
        await this.imagesRepository.remove(image);
    }
}