import { HttpClient } from '@angular/common/http';
import { IFUserInfo } from './../interfaces/userInfo.interface';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class UserInfoService {
  private readonly END_POINT = `${environment.API_ENDPOINT}users/`;

  constructor(private readonly http: HttpClient) {}

  updateCurrentUserInfo(payload: IFUserInfo) {
    return this.http.put(`${this.END_POINT}self`, payload);
  }
  getCurrentUserInfo() {
    return this.http.get(`${this.END_POINT}self`);
  }
}
