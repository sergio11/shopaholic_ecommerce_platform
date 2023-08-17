import { HttpException, HttpStatus } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { CreateImageDto } from 'src/modules/images/dto/create-image.dto';
import { IStorageService } from 'src/modules/storage/storage.service';

export abstract class SupportService {

    constructor(
        private readonly i18n: I18nService,
        private readonly storageService: IStorageService
    ) {}

    protected async saveFileAndGetImageDto(file?: Express.Multer.File): Promise<CreateImageDto> {
        if (file) {
            console.log("saveFileAndGetImageDto : ", file);
            const response = await this.storageService.saveFile(file.buffer, file.mimetype, file.size);
            if (!response) {
                this.throwInternalServerError("IMAGE_ERROR");
            }
            const imageDto: CreateImageDto = {
                url: response.url,
                storageId: response.id
            };
            return imageDto;
        } else {
            return null;
        }
    }

    protected resolveString(key: string): string {
        return this.i18n.t(key, { lang: I18nContext.current().lang });
    }

    protected throwNotFoundException(key: string) {
        throw new HttpException(this.resolveString(key), HttpStatus.NOT_FOUND);
    }

    protected throwInternalServerError(key: string) {
        throw new HttpException(this.resolveString(key), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    protected throwBadRequestException(key: string) {
        throw new HttpException(this.resolveString(key), HttpStatus.BAD_REQUEST);
    }

    protected throwConflictException(key: string) {
        throw new HttpException(this.resolveString(key), HttpStatus.CONFLICT);
    }

    protected throwForbiddenException(key: string) {
        throw new HttpException(this.resolveString(key), HttpStatus.FORBIDDEN);
    }

    protected throwUnAuthorizedException(key: string) {
        throw new HttpException(this.resolveString(key), HttpStatus.UNAUTHORIZED);
    }
}