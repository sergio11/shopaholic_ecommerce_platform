import { Injectable } from '@angular/core';
import { EntityState, GenericCrudStore } from '../core/generic-crud-store';
import { StoreConfig } from '@datorama/akita';
import { IAddress } from '../../interfaces/address.interface';

export interface IAddressState extends EntityState<IAddress> {}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'address' })
export class AddressStore extends GenericCrudStore<IAddress> {}
