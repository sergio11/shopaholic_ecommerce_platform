import { CategoryStore } from 'src/app/@shared/stores/categories/category.store';
import { HttpClient } from '@angular/common/http';
import { IBaseAttributeFilterQuery } from '../interfaces/base.interface';
import { ICreateCategory } from './../interfaces/category.interface';
import { Injectable } from '@angular/core';
import { baseAttributeFilterQueryUtils } from '../utils/filterquery.utils';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';

/**
 * Service for managing categories, including image uploading.
 */
@Injectable({
  providedIn: 'root',
})
export class CategoryService {

  private readonly END_POINT = `${environment.API_ENDPOINT}categories/`;
  private readonly CATEGORY_NAME_FIELD = "name";
  private readonly CATEGORY_DESCRIPTION_FIELD = "description";
  private readonly CATEGORY_IMAGE_FIELD = "imageFile";

  constructor(
    private readonly http: HttpClient,
    private categoryStore: CategoryStore
  ) {}

  /**
   * Searches for categories with filter options.
   * @param option Filter options.
   * @returns Observable with search results.
   */
  search(option: IBaseAttributeFilterQuery) {
    const url = `${this.END_POINT}search?${baseAttributeFilterQueryUtils(
      option
    )}`;
    return this.http.get(url).pipe(
      tap((data) => {
        this.categoryStore.update(data);
      })
    );
  }

  /**
   * Creates a new category.
   * @param payload Category data, including the image.
   * @returns Observable with the creation response.
   */
  create(payload: ICreateCategory) {
    const formData = this.createFormData(payload);
    return this.http.post(`${this.END_POINT}`, formData).pipe(
      tap((data: any) => {
        this.categoryStore.addItem(data);
      })
    );
  }

  /**
   * Updates an existing category.
   * @param id ID of the category to update.
   * @param payload Category data to update, including the image.
   * @returns Observable with the update response.
   */
  update(id: string, payload: ICreateCategory) {
    const formData = this.createFormData(payload);
    return this.http.post(`${this.END_POINT}${id}`, formData).pipe(
      tap((data: any) => {
        this.categoryStore.updateItem(data);
      })
    );
  }

  /**
   * Deletes a category by its ID.
   * @param id ID of the category to delete.
   * @returns Observable with the deletion response.
   */
  delete(id: string) {
    return this.http.delete(`${this.END_POINT}${id}`, { responseType: 'text' }).pipe(
      tap(() => {
        this.categoryStore.removeItem(id);
      })
    );
  }

  /**
   * Creates a FormData object and attaches fields, including the image if present.
   * @param payload Category data, including the image.
   * @returns FormData object with attached fields.
   */
  private createFormData(payload: ICreateCategory): FormData {
    const formData = new FormData();
    if (payload.name !== undefined) {
      formData.append(this.CATEGORY_NAME_FIELD, payload.name);
    }
    if (payload.description !== undefined) {
      formData.append(this.CATEGORY_DESCRIPTION_FIELD, payload.description);
    }
    if (payload.image instanceof File) {
      formData.append(this.CATEGORY_IMAGE_FIELD, payload.image);
    }
    return formData;
  }
}
