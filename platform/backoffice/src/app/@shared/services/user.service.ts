import {
  IFChangePhoneNumber,
  IFFilterUser,
} from '../interfaces/user.interface';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly END_POINT = `${environment.API_ENDPOINT}users/`;

  constructor(private readonly http: HttpClient) {}

  changePhoneNumber(payload: IFChangePhoneNumber) {
    return this.http.put(`${this.END_POINT}changePhoneNumber`, payload);
  }

  filter(option: IFFilterUser) {
    const queryParams: string[] = [];

    if (option.searchTerm !== undefined && option.searchTerm !== null) {
      queryParams.push(`name=${option.searchTerm}`);
    }

    if (option.page !== undefined && option.page !== null) {
      queryParams.push(`page=${option.page}`);
    }

    if (option.take !== undefined && option.take !== null) {
      queryParams.push(`limit=${option.take}`);
    }

    if (option.type !== undefined && option.type !== null) {
      queryParams.push(`role=${option.type}`);
    }

    const queryString = queryParams.join('&');

    return this.http.get(`${this.END_POINT}search?${queryString}`);
  }
}
