import { Injectable } from '@angular/core';
import { EntityState, GenericCrudStore } from '../core/generic-crud-store';
import { StoreConfig } from '@datorama/akita';
import { IUser } from '../../interfaces/user.interface';

export interface IAdminState extends EntityState<IUser> {}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'admins' })
export class AdminStore extends GenericCrudStore<IUser> {}