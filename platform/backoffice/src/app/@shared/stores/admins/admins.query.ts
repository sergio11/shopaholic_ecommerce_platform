
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { AdminStore, IAdminState } from './admins.store';

@Injectable({
  providedIn: 'root',
})
export class AdminsQuery extends Query<IAdminState> {
  constructor(protected store: AdminStore) {
    super(store);
  }
}
