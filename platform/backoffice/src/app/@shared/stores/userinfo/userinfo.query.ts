
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { IUserInfoState, UserInfoStore } from './userinfo.store';

@Injectable({
  providedIn: 'root',
})
export class UserInfoQuery extends Query<IUserInfoState> {
  constructor(protected store: UserInfoStore) {
    super(store);
  }
}
