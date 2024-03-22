import {
  ICreateUser,
  IFChangePhoneNumber,
  IFilterUser,
  IUpdateUser,
  IUser,
} from '../interfaces/user.interface';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { baseFilterQueryUtils } from '../utils/filterquery.utils';
import { UsersStore } from '../stores/users/users.store';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserService {

  private readonly END_POINT = `${environment.API_ENDPOINT}users/`;
  private readonly USER_NAME_FIELD = "name";
  private readonly USER_LASTNAME_FIELD = "lastname";
  private readonly USER_EMAIL_FIELD = "email";
  private readonly USER_PHONE_FIELD = "phone";
  private readonly USER_COUNTRY_FIELD = "country";
  private readonly USER_LANGUAGE_FIELD = "language";
  private readonly USER_CITY_FIELD = "city";
  private readonly USER_PASSWORD_FIELD = "password";
  private readonly USER_BIRTH_DATE_FIELD = "birthDate";
  private readonly USER_GENDER_FIELD = "gender";
  private readonly USER_MAIN_IMAGE_FIELD = "imageFile";

  constructor(
    private readonly http: HttpClient,
    private readonly usersStore: UsersStore
    ) {}

  changePhoneNumber(payload: IFChangePhoneNumber) {
    return this.http.put(`${this.END_POINT}changePhoneNumber`, payload);
  }

  /**
   * Searches for customers based on the provided filters.
   * @param option - The filter options.
   * @returns An observable with the search results.
   */
  searchCustomers(option: IFilterUser) {
    const url = `${this.END_POINT}search?${baseFilterQueryUtils(
      option
    )}&role=CLIENT`;
    return this.http.get(url).pipe(
      tap((data: any) => {
        this.usersStore.update(data);
      })
    );
  }

  /**
   * Searches for administrators based on the provided filters.
   * @param option - The filter options.
   * @returns An observable with the search results.
   */
  searchAdmins(option: IFilterUser) {
    const url = `${this.END_POINT}search?${baseFilterQueryUtils(
      option
    )}&role=ADMIN`;
    return this.http.get(url).pipe(
      tap((data: any) => {
        this.usersStore.update(data);
      })
    );
  }

  /**
   * Updates an existing user.
   * @param id - The ID of the user to update.
   * @param payload - The updated user data.
   * @returns An observable with the updated user data.
   */
  updateUser(id: string, payload: IUpdateUser) {
    const formData = this.createFormData(payload);
    return this.http.post(`${this.END_POINT}${id}`, formData).pipe(
      tap((data: any) => {
        this.usersStore.updateItem(data);
      })
    );
  }

  /**
   * Creates a new user.
   * @param payload - The data of the user to create.
   * @returns An observable with the created user data.
   */
  createUser(payload: ICreateUser) {
    const formData = this.createFormData(payload);
    return this.http.post(`${this.END_POINT}`, formData).pipe(
      tap((data: any) => {
        this.usersStore.addItem(data);
      })
    );
  }

  /**
   * Deletes a user by ID.
   * @param id - The ID of the user to delete.
   * @returns An observable with the HTTP response.
   */
  delete(id: string) {
    return this.http.delete(`${this.END_POINT}${id}`, { responseType: 'text' }).pipe(
      tap(() => {
        this.usersStore.removeItem(id);
      })
    );
  }

  private createFormData(payload: any): FormData {
    const formData = new FormData();
    if (payload.name && payload.name !== undefined) {
      formData.append(this.USER_NAME_FIELD, payload.name);
    }
    if (payload.lastname && payload.lastname !== undefined) {
      formData.append(this.USER_LASTNAME_FIELD, payload.lastname);
    }
    if (payload.email && payload.email !== undefined) {
      formData.append(this.USER_EMAIL_FIELD, payload.email);
    }
    if (payload.phone && payload.phone !== undefined) {
      formData.append(this.USER_PHONE_FIELD, payload.phone.toString());
    }
    if (payload.country && payload.country !== undefined) {
      formData.append(this.USER_COUNTRY_FIELD, payload.country);
    }
    if (payload.city && payload.city !== undefined) {
      formData.append(this.USER_CITY_FIELD, payload.city);
    }
    if (payload.birthDate && payload.birthDate !== undefined) {
      formData.append(this.USER_BIRTH_DATE_FIELD, payload.birthDate);
    }
    if (payload.gender && payload.gender !== undefined) {
      formData.append(this.USER_GENDER_FIELD, payload.gender);
    }
    if (payload.language && payload.language !== undefined) {
      formData.append(this.USER_LANGUAGE_FIELD, payload.language);
    }
    if (payload.password && payload.language !== undefined) {
      formData.append(this.USER_PASSWORD_FIELD, payload.password);
    }
    if (payload.image && payload.image instanceof File) {
      formData.append(this.USER_MAIN_IMAGE_FIELD, payload.image);
    }
    return formData;
  }
}
