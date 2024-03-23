import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { AddressStore, IAddressState } from './address.store';

@Injectable({
  providedIn: 'root',
})
export class AddressQuery extends Query<IAddressState> {
  constructor(protected store: AddressStore) {
    super(store);
  }
}

