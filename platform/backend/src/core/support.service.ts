import { HttpException, HttpStatus } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';


export abstract class SupportService {

    constructor(private readonly i18n: I18nService) {}

    protected resolveString(key: string): string {
        return this.i18n.t('app.USER_NOT_FOUND',{ lang: I18nContext.current().lang });
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

}