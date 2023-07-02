import { I18nContext, I18nService } from 'nestjs-i18n';


export abstract class SupportService {

    constructor(private readonly i18n: I18nService) {}

    protected resolveString(key: string): string {
        return this.i18n.t('app.USER_NOT_FOUND',{ lang: I18nContext.current().lang });
    }

}