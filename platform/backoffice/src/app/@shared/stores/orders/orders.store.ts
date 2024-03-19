import { Injectable } from '@angular/core';
import { EntityState, GenericCrudStore } from '../core/generic-crud-store';
import { StoreConfig } from '@datorama/akita';
import { IOrder } from '../../interfaces/order.interface';

export interface IOrderState extends EntityState<IOrder> {}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'orders' })
export class OrdersStore extends GenericCrudStore<IOrder> {}