import { HttpException, HttpStatus } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { Repository } from 'typeorm';
import { AbstractEntity } from './abstract.entity';

/**
 * Abstract base class for service classes providing common error handling and localization functionality.
 */
export abstract class SupportService {
  /**
   * Constructs the SupportService.
   * @param i18n - The injected I18nService instance.
   */
  constructor(private readonly i18n: I18nService) {}

  /**
   * Finds an entity by its ID in the specified repository.
   * @param id - The ID of the entity to find.
   * @param repository - The repository to search in.
   * @param errorMessage - The error message to display if the entity is not found.
   * @param relations - Optional array of relation names to be loaded.
   * @returns The found entity.
   * @throws HttpException with status HttpStatus.NOT_FOUND if the entity is not found.
   */
  protected async findEntityById<T extends AbstractEntity>(
    id: string,
    repository: Repository<T>,
    errorMessage: string,
    relations?: string[],
  ): Promise<T> {
    const queryBuilder = repository.createQueryBuilder('entity');
    queryBuilder.where('entity.id = :id', { id });
    if (relations && relations.length > 0) {
      relations.forEach((relation) => {
        queryBuilder.leftJoinAndSelect(`entity.${relation}`, relation);
      });
    }
    const entityFound = await queryBuilder.getOne();
    if (!entityFound) {
      this.throwNotFoundException(errorMessage);
    }
    return entityFound;
  }

  /**
   * Resolves a localization string key to its corresponding localized string.
   * @param key - The localization string key.
   * @returns The localized string.
   */
  protected resolveString(key: string): string {
    return this.i18n.t(key, { lang: I18nContext.current().lang });
  }

  /**
   * Throws an HttpException with status HttpStatus.NOT_FOUND and a localized error message.
   * @param key - The localization string key for the error message.
   * @throws HttpException with status HttpStatus.NOT_FOUND.
   */
  protected throwNotFoundException(key: string) {
    throw new HttpException(this.resolveString(key), HttpStatus.NOT_FOUND);
  }

  /**
   * Throws an HttpException with status HttpStatus.INTERNAL_SERVER_ERROR and a localized error message.
   * @param key - The localization string key for the error message.
   * @throws HttpException with status HttpStatus.INTERNAL_SERVER_ERROR.
   */
  protected throwInternalServerError(key: string) {
    throw new HttpException(
      this.resolveString(key),
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  /**
   * Throws an HttpException with status HttpStatus.BAD_REQUEST and a localized error message.
   * @param key - The localization string key for the error message.
   * @throws HttpException with status HttpStatus.BAD_REQUEST.
   */
  protected throwBadRequestException(key: string) {
    throw new HttpException(this.resolveString(key), HttpStatus.BAD_REQUEST);
  }

  /**
   * Throws an HttpException with status HttpStatus.CONFLICT and a localized error message.
   * @param key - The localization string key for the error message.
   * @throws HttpException with status HttpStatus.CONFLICT.
   */
  protected throwConflictException(key: string) {
    throw new HttpException(this.resolveString(key), HttpStatus.CONFLICT);
  }

  /**
   * Throws an HttpException with status HttpStatus.FORBIDDEN and a localized error message.
   * @param key - The localization string key for the error message.
   * @throws HttpException with status HttpStatus.FORBIDDEN.
   */
  protected throwForbiddenException(key: string) {
    throw new HttpException(this.resolveString(key), HttpStatus.FORBIDDEN);
  }

  /**
   * Throws an HttpException with status HttpStatus.UNAUTHORIZED and a localized error message.
   * @param key - The localization string key for the error message.
   * @throws HttpException with status HttpStatus.UNAUTHORIZED.
   */
  protected throwUnAuthorizedException(key: string) {
    throw new HttpException(this.resolveString(key), HttpStatus.UNAUTHORIZED);
  }
}
