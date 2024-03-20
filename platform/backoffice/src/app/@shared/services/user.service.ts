import {
  IFChangePhoneNumber,
  IFilterUser,
} from '../interfaces/user.interface';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { baseFilterQueryUtils } from '../utils/filterquery.utils';
import { CustomerStore } from '../stores/customer/customers.store';
import { AdminStore } from '../stores/admins/admins.store';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly END_POINT = `${environment.API_ENDPOINT}users/`;

  constructor(
    private readonly http: HttpClient,
    private customerStore: CustomerStore,
    private adminStore: AdminStore
    ) {}

  changePhoneNumber(payload: IFChangePhoneNumber) {
    return this.http.put(`${this.END_POINT}changePhoneNumber`, payload);
  }

  searchCustomers(option: IFilterUser) {
    const url = `${this.END_POINT}search?${baseFilterQueryUtils(
      option
    )}&role=CLIENT`;
    return this.http.get(url).pipe(
      tap((data) => {
        this.customerStore.update(data);
      })
    );
  }

  searchAdmins(option: IFilterUser) {
    const url = `${this.END_POINT}search?${baseFilterQueryUtils(
      option
    )}&role=ADMIN`;
    return this.http.get(url).pipe(
      tap((data) => {
        this.adminStore.update(data);
      })
    );;
  }
}
