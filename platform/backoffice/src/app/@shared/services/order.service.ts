import { HttpClient } from '@angular/common/http';
import { IFBaseFilterQuery } from '../interfaces/base.interface';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { baseFilterQueryUtils } from '../utils/filterquery.utils';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly END_POINT = `${environment.API_ENDPOINT}orders/`;
  constructor(private readonly http: HttpClient) {}

  search(option: IFBaseFilterQuery) {
    return this.http.get(`${this.END_POINT}search?${baseFilterQueryUtils(option)}`);
  }
}
