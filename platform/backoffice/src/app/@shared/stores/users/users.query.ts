
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { UsersStore, IUserState } from './users.store';

@Injectable({
  providedIn: 'root',
})
export class UsersQuery extends Query<IUserState> {
  constructor(protected store: UsersStore) {
    super(store);
  }
}
